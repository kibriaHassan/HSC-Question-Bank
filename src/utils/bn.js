const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

export function toBn(value) {
  return String(value).replace(/\d/g, (digit) => BN_DIGITS[digit])
}

const FROM_BN = Object.fromEntries(BN_DIGITS.map((digit, index) => [digit, String(index)]))

export function fromBn(value) {
  return String(value ?? '').replace(/[০-৯]/g, (digit) => FROM_BN[digit] ?? digit)
}

export function parseNumber(value) {
  const numeric = Number(fromBn(value).trim())
  return Number.isNaN(numeric) ? NaN : numeric
}

export function chapterLabel(number) {
  return `${toBn(number)}ম অধ্যায়`.replace('1ম', '১ম').replace('2ম', '২য়').replace('3ম', '৩য়')
}

const ORDINAL = {
  1: '১ম',
  2: '২য়',
  3: '৩য়',
  4: '৪র্থ',
  5: '৫ম',
  6: '৬ষ্ঠ',
  7: '৭ম',
  8: '৮ম',
  9: '৯ম',
  10: '১০ম',
  11: '১১তম',
  12: '১২তম',
}

export function bnOrdinal(number) {
  return ORDINAL[number] ?? toBn(number)
}

export function bnChapterTitle(number) {
  return `${bnOrdinal(number)} অধ্যায়`
}
