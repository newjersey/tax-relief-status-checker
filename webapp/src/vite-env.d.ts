/// <reference types="vite/client" />

/**
 * Allows TypeScript to resolve static image imports (e.g. `.png`, `.jpg`, `.svg`) as URL strings,
 * matching Vite's asset-handling behavior.
 */
declare module "*.png" {
  const url: string;
  export default url;
}
