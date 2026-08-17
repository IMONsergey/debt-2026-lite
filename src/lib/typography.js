const GLUE_WORDS = [
  'а',
  'без',
  'бы',
  'в',
  'во',
  'вы',
  'да',
  'для',
  'до',
  'за',
  'и',
  'из',
  'или',
  'к',
  'как',
  'ко',
  'ли',
  'на',
  'над',
  'не',
  'ни',
  'но',
  'о',
  'об',
  'от',
  'по',
  'под',
  'при',
  'про',
  'с',
  'со',
  'у',
  'через',
  'что',
];

const GLUE_RE = new RegExp(`(^|[\\s([{"'«„])(${GLUE_WORDS.join('|')})(\\s+)`, 'giu');

export function typograf(value) {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(GLUE_RE, (_, prefix, word) => `${prefix}${word}\u00a0`);
}
