import {Resource, Service} from "di/annotation";
import mime from "mime";
import fs from "fs";
import {IToClientResponse, setError} from "service/intercept/http";
import {ServerResponse} from "http";
import FileService from "service/infra/FileService";

export interface IPipeParam {
    res: ServerResponse
    filePath: string
    contentType: string
    toClientResponse: IToClientResponse
}

export interface ICacheParam {
    filePath: string
    contentType: string
    toClientResponse: IToClientResponse
}

@Service()
export default class LocalContentService {

    @Resource() private fileService: FileService

    /**
     * 将请求远程的响应内容直接返回给浏览器
     */
    async pipe(params: IPipeParam) {
        const {res, filePath, contentType, toClientResponse} = params;

        // 本地文件
        const stat = await fs.promises.stat(filePath)

        if (!stat.isFile()) {
            setError(toClientResponse, 'can not read file' + filePath);
            return;
        }
        toClientResponse.sendedToClient = true;
        res.statusCode = 200;
        // 增加跨域头部
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', contentType);
        fs.createReadStream(filePath).pipe(res);
    }

    /**
     * 将请求远程的响应内容
     */
    async cache(param: ICacheParam) {
        const {filePath, contentType, toClientResponse} = param;
        const stat = await fs.promises.stat(filePath)
        if (!stat.isFile()) {
            setError(toClientResponse, 'can not read file' + filePath);
            return;
        }

        toClientResponse.hasContent = true;
        toClientResponse.headers['Access-Control-Allow-Origin'] = '*';
        toClientResponse.headers['Content-Length'] = stat.size + '';
        toClientResponse.headers['Content-Type'] = contentType;
        toClientResponse.body = await this.fileService.readFile(filePath)
    }
}
