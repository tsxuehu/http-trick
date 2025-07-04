/**
 * host文件
 * content内容格式
 * 8.8.8.8    www.google.com
 * 4.4.4.4    *.taobao.com #所有后缀为.taobao.com的域名都被解析为4.4.4.4
 * 6.6.6.6    www.youzan.com h5.youzan.com`
 */
export interface IHostFile {
    meta: Meta;
    id: string;
    userId: string;
    readonly: boolean;
    default: boolean;
    checked: boolean;
    name: string;
    description: string;
    content: string;
}

export interface Meta {
    local: boolean;
}

export interface IHostFileCacheItem {
    name: string
    hostMap: Record<string, string>
    globHostMap: Record<string, string>
}
export interface IHostFileListItem {
    id: string
    name: string
    checked: boolean
    description: string
    meta: Meta
}
