 import { ArchimateProjectStorage } from './greeter';
import { DiagramTemplate } from "./diagram-template";
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

      const projectData = await ArchimateProjectStorage.GetDefaultProjectData();
      const project = await ArchimateProjectStorage.GetProjectFromArrayBuffer(projectData);
      const diagram  = project.diagrams[0];
      const renderer = new DiagramRenderer(project, diagram, DiagramTemplate.getFromDrawing())
      const svg = renderer.buildSvg();
      const s = svgTarget.appendChild(svg.firstChild);

      expect(s).toMatchSnapshot();
    });
});
