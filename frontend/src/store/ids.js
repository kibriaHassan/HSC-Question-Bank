export function createId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function wait(ms = 160) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
