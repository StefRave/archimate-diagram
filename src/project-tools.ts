import { ArchimateProject, ArchiEntity, ArchiSourceConnection } from './greeter';


export class ProjectTools {

  public static getDuplicatesRanked(project: ArchimateProject): ArchiEntity[][] {
    const map = this.groupBy(project.entities.toArray(), e => e.name + '♥' + e.entityType);

    const toFix = [...map.values()].filter(ea => ea.length > 1);
    // put the higest rated entities first in the arrays
    const orderedFixes = toFix.map(x => {
      const ranked = x.map(e => [e, ProjectTools.getEntityRating(e, project)]);
      ranked.sort((a, b) => <number>b[1] - <number>a[1]);
      return ranked.map(x2 => x2[0]);
    });
    return <ArchiEntity[][]>orderedFixes;
  }

  public static removeDuplicatesFromOrderedFixes(orderedFixes: ArchiEntity[][], project: ArchimateProject) {
    orderedFixes.forEach(toMerge => {
      const mergeTo = toMerge[0];
      toMerge.slice(1).forEach(mergeWith => 
        this.removeDuplicate(mergeTo, mergeWith, project));
    });
  }

  public static removeDuplicate(e: ArchiEntity, toRemove: ArchiEntity, project: ArchimateProject) {
    const eSourceRelations = project.getSourceRelationShips(e.Id);
    const eTargetRelations = project.getTargetRelationShips(e.Id);

    const rSourceRelations = project.getSourceRelationShips(toRemove.Id);
    const rTargetRelations = project.getTargetRelationShips(toRemove.Id);
    rSourceRelations.forEach(rr => {
      const erFound = eSourceRelations.firstOrNull(er => er.entityType == rr.entityType && er.target == rr.target);
      if (erFound) {
        project.removeEntity(rr);
        const sourceConnections = project.diagrams.flatMap(d => d.DescendantsWithSourceConnections)
          .filter(d => d instanceof ArchiSourceConnection)
          .map(d => <ArchiSourceConnection>d)
          .filter(sc => sc.RelationShipId == rr.Id);
        sourceConnections.forEach(sc => sc.setRelationShipId(erFound.Id));
      } else {
        rr.setSource(e.Id);
      }
    });
    rTargetRelations.forEach(rr => {
      const erFound = eTargetRelations.firstOrNull(er => er.entityType == rr.entityType && er.source == rr.source);
      if (erFound) {
        project.removeEntity(rr);
        const sourceConnections = project.diagrams.flatMap(d => d.DescendantsWithSourceConnections)
          .filter(d => d instanceof ArchiSourceConnection)
          .map(d => <ArchiSourceConnection>d)
          .filter(sc => sc.RelationShipId == rr.Id);
        sourceConnections.forEach(sc => sc.setRelationShipId(erFound.Id));
      } else {
        rr.setTarget(e.Id);
      }
    });
    const diagramObjectsToRetarget = project.diagrams.flatMap(d => d.Descendants)
      .filter(d => d.ElementId == toRemove.Id);
    diagramObjectsToRetarget.forEach(d => d.setElementId(e.Id));
    project.removeEntity(toRemove);
  }

  public static getEntityRating(e: ArchiEntity, project: ArchimateProject): number {
    return ([].slice.call(e.element.children) as Element[]).filter(e => e.nodeName === 'property').length +
      project.getRelatedElementForSource(e.Id).count() * 2 +
      project.getRelatedElementForTarget(e.Id).count() * 2 +
      (project.getDiagramsWithElementId(e.Id).length - 1) * 4;
  }

  private static groupBy<T, K extends keyof any>(arr: T[], key: (i: T) => K) {
    const result = new Map<K, T[]>();
    arr.forEach(e => {
      const k = key(e);
      const oldVal = result.get(k);
      if (oldVal)
        oldVal.push(e);

      else
        result.set(k, [e]);
    });
    return result;
  }
}
