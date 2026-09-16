import images from '../data/images.json';
import { assetUrl } from '../lib/assets.js';

/** Native image selection: dimensions reserve space; the browser chooses by width/DPR. */
export function ResponsiveImage({ src, sizes = '100vw', loading = 'lazy', decoding = 'async', ...props }) {
  const path = src.startsWith(import.meta.env.BASE_URL) ? src.slice(import.meta.env.BASE_URL.length) : src;
  const image = images[path];
  const srcSet = image?.variants.length
    ? [
      ...image.variants.map(width => `${assetUrl(path.replace(/\.webp$/, `-${width}w.webp`))} ${width}w`),
      `${src} ${image.width}w`,
    ].join(', ')
    : undefined;

  return <img src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} width={image?.width} height={image?.height} loading={loading} decoding={decoding} {...props} />;
}
