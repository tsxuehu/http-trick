export interface Disposable {
    dispose(): void
}
export interface RequestIdleCallback {
    didTimeout?: boolean
    timeRemaining?(): number
}

export interface RequestIdleCallbackOptions {
    timeout?: number
}

interface RAL {
    readonly timer: {
        setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable
        setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable
        setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable
    }
    readonly idle: {
        requestIdleCallback(cb: (deadline: RequestIdleCallback) => any, options?: RequestIdleCallbackOptions): Disposable
    }
}

const _ral: RAL | undefined = Object.freeze<RAL>({
    timer: Object.freeze({
        setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
            const handle = setTimeout(callback, ms, ...args)
            return { dispose: () => clearTimeout(handle) }
        },
        setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable {
            if (typeof setImmediate != 'undefined') {
                const handle = setImmediate(callback, ...args)
                return { dispose: () => clearImmediate(handle) }
            } else {
                const handle = setTimeout(callback, 0, ...args)
                return { dispose: () => clearTimeout(handle) }
            }
        },
        setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
            const handle = setInterval(callback, ms, ...args)
            return { dispose: () => clearInterval(handle) }
        },
    }),
    idle: {
        requestIdleCallback(cb: (deadline: RequestIdleCallback) => any, options?: RequestIdleCallbackOptions) {
            if (typeof requestIdleCallback !== 'undefined') {
                const id = requestIdleCallback(cb, options)
                return { dispose: () => cancelIdleCallback(id) }
            } else {
                const start = Date.now()
                const id = setTimeout(function () {
                    cb({
                        didTimeout: false,
                        timeRemaining: function () {
                            return Math.max(0, 50 - (Date.now() - start))
                        },
                    })
                }, 1)
                return { dispose: () => clearTimeout(id) }
            }
        },
    },
})

function RAL(): RAL {
    if (_ral === undefined) {
        throw new Error(`No runtime abstraction layer installed`)
    }
    return _ral
}

export default RAL
