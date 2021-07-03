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

      const project = await ArchimateProjectStorage.GetDefaultProject();
      const diagram  = project.Diagrams[0];
      const svg = await DiagramRenderer.BuildDiagram(project, diagram);
      const s = DiagramRenderer.SetDiagram(svgTarget, svg);

      expect(s).toMatchSnapshot();
    });
});
