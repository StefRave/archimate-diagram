import { Base64 } from "./util/base64";
import { ArchimateProject } from "./greeter";

/**
 * Adds images to the #imageDefs section in the defs element of the SVG.
 * Gets the width and hight of the images, so the document renderer can position
 * the elements correctly
 * 
 * @privateRemarks
 * By putting the images in the defs section, they are stored only once in the DOM. 
 * It also makes the images immediately accesible.
 */
export class DiagramImageCache {
  private cache = new Map<string, ImageCache>()
  private urlPromises = new Map<string, Deferred[]>();
  private uniqueIds = new Set<string>();

  constructor(private project: ArchimateProject, private imageDefs: SVGGElement) {
  }

  public getImage(url: string): Promise<ImageCache> {
    const image = this.cache.get(url);
    if (image)
      return new Promise((resolve) => resolve(image));
    
    const defer = new Deferred();
    const promise = new Promise<ImageCache>((resolve, reject) => {
      defer.resolveSelf = resolve;
      defer.rejectSelf = reject;
    });
    const promiseArray = this.urlPromises.get(url) ?? [];
    promiseArray.push(defer);
    this.urlPromises.set(url, promiseArray);
    
    if (promiseArray.length == 1) {
      this.loadImage(url);
    }
    return promise;
  }

  private async loadImage(imagePath: string) {
    const imageData = await this.project.getImage(imagePath)
    
    const base64String = Base64.fromUint8Array(imageData);
    const fileExtension = imagePath.split('.').pop();
    

    // The img HTML element will contain the width and height. (The SVG Image element does not)
    const img = document.createElement('img');
    img.setAttribute('src', `data:image/${fileExtension};base64, ${base64String}`);

    img.onload = () => {
      // eslint-disable-next-line no-useless-escape
      const badChar = /[\w\-\:\.]/g;
      let id = 'img_' + imagePath.replace(badChar, '');
      if (this.uniqueIds.has(id))
        id = id + Math.random().toString(36).substring(2, 10);
      else
        this.uniqueIds.add(id);

        // <image id="imgSample" href="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" />
        const image = document.createElementNS('http://www.w3.org/2000/svg','image');
        image.id = id;
        image.setAttribute('href', `data:image/${fileExtension};base64, ${base64String}`);
        this.imageDefs.appendChild(image);

        const imageCashe = new ImageCache(img.width, img.height, id);
        this.cache.set(imagePath, imageCashe);
        const promises = this.urlPromises.get(imagePath);
        this.urlPromises.delete(imagePath);
        promises.forEach(d => d.resolveSelf(imageCashe))
    }
  }
}

class Deferred {
  public resolveSelf: (arg: ImageCache)=>void;
  public rejectSelf: (arg: any)=>void;
}


export class ImageCache {
  constructor (
    public width: number,
    public height: number,
    public defsId: string) {
  }
}
