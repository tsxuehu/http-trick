import { createStore, StoreApi } from 'zustand/vanilla'

export default abstract class StateBase<T> {
  protected __store: StoreApi<T>

  protected constructor(initialState: T) {
    this.__store = createStore<T>((set) => initialState)
  }

  protected setState(partial: Partial<T>) {
    this.__store.setState(partial)
  }

  protected getState(): T {
    return this.__store.getState()
  }

  subscribe(listener: (data: T) => void): () => void {
    listener(this.__store.getState())
    return this.__store.subscribe(listener)
  }
}
