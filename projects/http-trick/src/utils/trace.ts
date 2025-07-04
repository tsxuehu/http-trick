import {AsyncLocalStorage} from 'async_hooks'
import {uniqueId} from "./random";


export interface Context {
    traceId: string
}

let asyncLocalStorage: AsyncLocalStorage<Context>

export function initAsyncContext() {
    asyncLocalStorage = new AsyncLocalStorage()
}

export async function runInAsyncContext(source: string, callback: () => any) {
    await asyncLocalStorage.run(
        {
            traceId: `tc-${source}-${uniqueId()}`
        },
        () => {
            return callback()
        }
    )
}

export function getTraceId(): string {
    return asyncLocalStorage.getStore()?.traceId || 'no-trace'
}
