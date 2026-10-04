import {
  relationshipConcepts,
  relationshipKeyAlphabet,
  relationshipKeySets,
  relationshipRows,
} from './relationship-matrix';

export type RelationshipGroup = 'Structural' | 'Dependency' | 'Dynamic' | 'Other';

export interface RelationshipTypeInfo {
  type: string;
  label: string;
  group: RelationshipGroup;
  description: string;
  previewClass: string;
  previewStartMarker?: 'composition' | 'aggregation' | 'circle';
  previewEndMarker?: 'closed' | 'open' | 'pointed';
  previewDashArray?: string;
}

export const relationshipTypes: RelationshipTypeInfo[] = [
  {
    type: 'CompositionRelationship',
    label: 'Composition',
    group: 'Structural',
    description: 'The target is an integral part of the source and does not exist without it.',
    previewClass: 'Composition Relationship',
    previewStartMarker: 'composition',
  },
  {
    type: 'AggregationRelationship',
    label: 'Aggregation',
    group: 'Structural',
    description: 'The source groups the target; the target can also exist on its own.',
    previewClass: 'Aggregation Relationship',
    previewStartMarker: 'aggregation',
  },
  {
    type: 'AssignmentRelationship',
    label: 'Assignment',
    group: 'Structural',
    description: 'The source is responsible for, performs, or carries out the target.',
    previewClass: 'Assignment Relationship',
    previewStartMarker: 'circle',
    previewEndMarker: 'closed',
  },
  {
    type: 'RealizationRelationship',
    label: 'Realization',
    group: 'Structural',
    description: 'The source implements or brings about the more abstract target.',
    previewClass: 'Realization Relationship',
    previewEndMarker: 'open',
    previewDashArray: '4 4',
  },
  {
    type: 'ServingRelationship',
    label: 'Serving',
    group: 'Dependency',
    description: 'The source provides its functionality to the target.',
    previewClass: 'Serving Relationship',
    previewEndMarker: 'pointed',
  },
  {
    type: 'AccessRelationship',
    label: 'Access',
    group: 'Dependency',
    description: 'The source reads or writes the passive target.',
    previewClass: 'Access Relationship',
    previewDashArray: '2 4',
  },
  {
    type: 'InfluenceRelationship',
    label: 'Influence',
    group: 'Dependency',
    description: 'The source affects the target motivation element, positively or negatively.',
    previewClass: 'Influence Relationship',
    previewEndMarker: 'pointed',
    previewDashArray: '6 4',
  },
  {
    type: 'AssociationRelationship',
    label: 'Association',
    group: 'Dependency',
    description: 'An unspecified relationship between source and target.',
    previewClass: 'Association Relationship',
  },
  {
    type: 'TriggeringRelationship',
    label: 'Triggering',
    group: 'Dynamic',
    description: 'The source causes the target to start; a temporal or causal order.',
    previewClass: 'Triggering Relationship',
    previewEndMarker: 'closed',
  },
  {
    type: 'FlowRelationship',
    label: 'Flow',
    group: 'Dynamic',
    description: 'Information, goods, or value moves from the source to the target.',
    previewClass: 'Flow Relationship',
    previewEndMarker: 'closed',
    previewDashArray: '8 4',
  },
  {
    type: 'SpecializationRelationship',
    label: 'Specialization',
    group: 'Other',
    description: 'The source is a particular kind of the target.',
    previewClass: 'Specialization Relationship',
    previewEndMarker: 'open',
  },
];

const relationshipTypeByKey = new Map<string, string>([
  ['a', 'AccessRelationship'],
  ['c', 'CompositionRelationship'],
  ['f', 'FlowRelationship'],
  ['g', 'AggregationRelationship'],
  ['i', 'AssignmentRelationship'],
  ['n', 'InfluenceRelationship'],
  ['o', 'AssociationRelationship'],
  ['r', 'RealizationRelationship'],
  ['s', 'SpecializationRelationship'],
  ['t', 'TriggeringRelationship'],
  ['v', 'ServingRelationship'],
]);

let relationshipMatrix: Map<string, Map<string, string>>;

function getRelationshipMatrix(): Map<string, Map<string, string>> {
  if (relationshipMatrix)
    return relationshipMatrix;

  relationshipMatrix = new Map();
  relationshipConcepts.forEach((source, sourceIndex) => {
    const targets = new Map<string, string>();
    const encodedRow = relationshipRows[sourceIndex];
    if (!encodedRow || encodedRow.length !== relationshipConcepts.length)
      throw new Error(`Invalid Archi relationship matrix row for ${source}`);
    relationshipConcepts.forEach((target, targetIndex) => {
      const keyIndex = relationshipKeyAlphabet.indexOf(encodedRow[targetIndex]);
      const relationKeys = relationshipKeySets[keyIndex];
      if (keyIndex < 0 || relationKeys === undefined)
        throw new Error(`Invalid Archi relationship matrix code at ${source} -> ${target}`);
      targets.set(target, relationKeys);
    });
    relationshipMatrix.set(source, targets);
  });
  return relationshipMatrix;
}

export function conceptType(entityType: string): string {
  if (!entityType)
    return '';
  return entityType.startsWith('archimate:') ? entityType.substring('archimate:'.length) : entityType;
}

export function isConnectableConcept(entityType: string): boolean {
  const type = conceptType(entityType);
  return type !== 'Relationship' && getRelationshipMatrix().has(type);
}

export function allowedRelationshipTypes(sourceType: string, targetType: string): string[] {
  const source = conceptType(sourceType);
  const target = conceptType(targetType);
  const keys = getRelationshipMatrix().get(source)?.get(target);
  if (!keys)
    return [];

  const allowed = new Set(Array.from(keys.toLowerCase(), key => relationshipTypeByKey.get(key)).filter(Boolean));
  return relationshipTypes.filter(type => allowed.has(type.type)).map(type => type.type);
}

export function relationshipTypeInfo(type: string): RelationshipTypeInfo {
  const info = relationshipTypes.find(item => item.type === type);
  if (!info)
    throw new Error(`Unknown ArchiMate relationship type: ${type}`);
  return info;
}
