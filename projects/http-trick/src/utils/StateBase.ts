import {createStore, StoreApi} from "zustand/vanilla";

export default abstract class StateBase<T> {
    private store: StoreApi<T>

    protected constructor(initialState: T) {
        this.store = createStore<T>((set) => initialState)
    }

    setState(partial: Partial<T>) {
        this.store.setState(partial)
    }
    getState():T {
        return this.store.getState()
    }
    subscribe(listener: (data: T) => void): () => void {
        return this.store.subscribe(listener)
    }
}
