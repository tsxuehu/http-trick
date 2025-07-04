const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const charactersLength = characters.length

/**
 * 生成固定长度的随机数
 * @param len
 */
export function randomString(len: number): string {
    let result = ''
    for (var i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

// 返回20位的唯一id
export function uniqueId(): string {
    return randomString(7) + Date.now()
}
