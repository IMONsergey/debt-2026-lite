export function assetUrl(path){
  const key=String(path||'').replace(/^\/+/, '');
  const origin=String(import.meta.env?.VITE_ASSET_ORIGIN||'').replace(/\/$/,'');
  return origin ? `${origin}/${key}` : `/${key}`;
}
