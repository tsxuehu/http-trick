import RAL, { Disposable } from './ral'

export default class Future<T = void, E extends Error = Error> {
    private name: string
    private readonly promise: Promise<T>
    private _isFinished: boolean = false
    private _isRejected: boolean = false
    private _isResolved: boolean = false
    private resolveFn?: (result: T) => void
    private rejectFn?: (error: Error) => void
    private timeoutDisposable?: Disposable

    constructor(name: string = '') {
        this.name = name
        this.promise = new Promise((resolve, reject) => {
            this.resolveFn = resolve
            this.rejectFn = reject
        })
    }

    setTaskTimeout(time: number, err?: Error) {
        this.timeoutDisposable = RAL().timer.setTimeout(() => {
            if (this._isFinished) {
                return
            }
            const throwError = err || new Error(`Future超时: ${this.name}`)
            this.rejectFn!(throwError)
        }, time)
        return this
    }

    resolve(result: T) {
        this._isFinished = true
        this._isResolved = true
        this.timeoutDisposable?.dispose()
        this.resolveFn!(result)
    }

    reject(error: E) {
        this._isFinished = true
        this._isRejected = true
        this.timeoutDisposable?.dispose()
        this.rejectFn!(error)
    }
    isFinished(): boolean {
        return this._isFinished
    }
    isResolved(): boolean {
        return this._isResolved
    }
    isRejected(): boolean {
        return this._isRejected
    }
    get(): Promise<T> {
        return this.promise
    }

    then(onfulfilled?: (value: T) => any, onrejected?: (reason: any) => any): void {
        this.promise.then(onfulfilled, onrejected)
    }

    static all(futures: Future<any>[]): Promise<any[]> {
        return Promise.all(futures.map((f) => f.get()))
    }
}
