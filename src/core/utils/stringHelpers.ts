export const isSame = (a = '', b = '') =>
  a.toLocaleLowerCase() === b.toLocaleLowerCase()
export const toSentenceCase = (str = '') =>
  str
    .split(' ')
    .map((x) => `${x[0].toUpperCase()}${x.slice(1).toLowerCase()}`)
    .join(' ')
