 import { ArchimateProjectStorage } from './greeter';
 import { DiagramRenderer, DiagramTemplate } from './diagram-renderer';

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
      const svg = DiagramRenderer.BuildSvg(project, diagram, DiagramTemplate.GetFromDrawing());
      const s = svgTarget.appendChild(svg.firstChild);

      expect(s).toMatchSnapshot();
    });
});
