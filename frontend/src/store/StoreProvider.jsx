import { useEffect, useState } from 'react'
import { getState, subscribe } from './repository'

export function StoreProvider({ children }) {
  return children
}

export function useStore() {
  const [state, setState] = useState(getState)
  useEffect(() => subscribe(setState), [])
  return state
}
