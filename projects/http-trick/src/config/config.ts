import 'dotenv/config';

export interface Env {

    isDev: boolean
}

export const env: Env = {
    isDev: (process.env.NODE_ENV as any) === 'development',
}


export const UrlPrefix = '/fe'
