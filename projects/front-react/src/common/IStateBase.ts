export default interface IStateBase<T> {
  // setState(partial: Partial<T>): void
  // getState(): T
  subscribe(listener: (data: T) => void): () => void
}
