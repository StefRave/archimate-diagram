 import { ArchimateProjectStorage } from './greeter';
 import { DiagramRenderer } from './diagram-renderer';

 function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Greeter', () => {
    it('should greet', async () => {
      // spyOn(console, 'log');
      const svgTarget = document.createElement('div');
      svgTarget.id = 'svgTarget';
      document.body.appendChild(svgTarget);

      var project = await ArchimateProjectStorage.GetDefaultProject();
      var diagram  = project.Diagrams[0];
      var svg = await DiagramRenderer.BuildDiagram(project, diagram);
      var s = DiagramRenderer.SetDiagram(svgTarget, svg);

      expect(console.log).toHaveBeenCalled();
    });
});
