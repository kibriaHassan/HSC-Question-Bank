function getPlacements(question) {
  if (Array.isArray(question?.placements) && question.placements.length) {
    return question.placements.map((item) => ({
      year: Number(item.year),
      serialNumber: Number(item.serialNumber),
    }))
  }
  if (question?.year && question.serialNumber != null && question.serialNumber !== '') {
    return [{ year: Number(question.year), serialNumber: Number(question.serialNumber) }]
  }
  return []
}

function recoverMathSerial(question) {
  if (question.serialNumber != null && question.serialNumber !== '') {
    const value = Number(question.serialNumber)
    if (!Number.isNaN(value) && value > 0) return value
  }
  const match = String(question.id || '').match(/-r\d+-(\d+)$/)
  if (match) return Number(match[1])
  return 1
}

export function migrateQuestion(question) {
  if (question?.questionType === 'math') {
    return {
      ...question,
      placements: [],
      year: undefined,
      serialNumber: recoverMathSerial(question),
    }
  }
  if (question?.questionType === 'topic') {
    return {
      ...question,
      placements: [],
      year: undefined,
      serialNumber: question.serialNumber || question.topicNumber,
    }
  }
  const placements = getPlacements(question)
  return {
    ...question,
    placements,
    year: placements[0]?.year,
    serialNumber: placements[0]?.serialNumber,
  }
}

export function questionMatchesYear(question, year) {
  if (!year) return true
  return getPlacements(question).some((item) => Number(item.year) === Number(year))
}

export function questionMatchesSerial(question, serialNumber) {
  if (serialNumber === undefined || serialNumber === null || serialNumber === '') return true
  return getPlacements(question).some((item) => Number(item.serialNumber) === Number(serialNumber))
}

export function serialForYear(question, year) {
  const match = getPlacements(question).find((item) => Number(item.year) === Number(year))
  return match?.serialNumber
}

export function allYearsFromQuestions(questions) {
  const years = new Set()
  questions.forEach((question) => {
    getPlacements(question).forEach((item) => years.add(Number(item.year)))
  })
  return [...years].sort((a, b) => b - a)
}

export { getPlacements }
