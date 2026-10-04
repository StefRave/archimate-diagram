// Definition modules for importing png|svg|jpg|gif 
declare module "*.svg?raw" {
  const content: any;
  export default content;
}

declare module "*.archimate" {
  const content: any;
  export default content;
}

declare module "*.module.css" {
  const styles: { readonly [key: string]: string };
  export default styles;
}
