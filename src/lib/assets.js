export function assetUrl(path) {
  const key=String(path).replace(/^\/+/, '');
  return globalThis.__DEBT_ASSETS__?.[key] || `${import.meta.env?.BASE_URL || "/"}${key}`;
}
