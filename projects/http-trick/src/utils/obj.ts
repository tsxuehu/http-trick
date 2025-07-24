export function filterEmptyValues(obj: Record<string, string>): Record<string, string> {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    // 处理普通对象
    const result: Record<string, string> = {};
    for (let key of Object.keys(obj)) {
        const value = obj[key];
        // 判断处理后的值是否为空
        if (
            value !== null &&
            value !== undefined &&
            value !== ''
        ) {
            result[key] = value;
        }
    }

    return result;
}
