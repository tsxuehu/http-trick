import {Service} from "di/annotation";
import {ActionRunExtraInfo, IProcessContext} from "service/intercept/http";
import lowerCase from "lodash/lowerCase";
import {BaseAction} from "service/action";

// =============  js css请求加时间戳
function addTimestampToJsCss(body: string): string {
    //<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic">
    //<script async="async" crossorigin="anonymous"  src="https://assets-cdn.github.com/assets/60.js">
    const timestamp = Date.now();
    body = body.replace(/<script .*?>|<link .*?>/gi, element => {
        // 对script src属性进行处理
        const isLink = element.startsWith('<link');
        const toReplace = addTimestampToElement(element, isLink ? /href=['"].*?['"]/gi : /src=['"].*?['"]/gi, timestamp);
        return toReplace;
    });
    return body;
}

function addTimestampToElement(element: string, reg: RegExp, timestamp: number) {
    return element.replace(reg, url => {
        const isDouble = url.indexOf('"') > -1;
        const hasWenhao = url.indexOf('?') > -1;
        return `${url.substring(0, url.length - 1)}${hasWenhao ? '&' : '?'}proxyts=${timestamp}${isDouble ? '"' : "'"}`;
    })
}


@Service()
export class ModifyResponseAction extends BaseAction {
    needRequestContent() {
        return false;
    }

    needResponse() {
        return true;
    }

    willGetContent() {
        return false;
    }

    async run(context: IProcessContext, extraInfo: ActionRunExtraInfo) {
        const {additionalRequestQuery, toClientResponse, originRequestData, req} = context;
        const {action} = extraInfo;
        const body = toClientResponse.body;

        if (action.data.modifyResponseType == 'addTimestampToJsCss') {

            toClientResponse.body = addTimestampToJsCss(body);

        } else if (action.data.modifyResponseType == "returnDataInJsonpStyle") {

            // jsonp请求 替换callback
            let cbName = originRequestData.query[action.data.callbackName];
            toClientResponse.body = `${cbName}(${body})`;
            toClientResponse.headers['Content-Type'] = 'application/javascript;charset=utf-8';

        } else if (action.data.modifyResponseType == "allowCros") {
            // todo 存在问题
            // req.headers.origin || ''
            toClientResponse.headers['Access-Control-Allow-Origin'] = '*';
            // toClientResponse.headers['Vary'] =  'Origin';
            toClientResponse.headers['Access-Control-Allow-Credentials'] = 'true';
            toClientResponse.headers['Access-Control-Allow-Methods'] = (req.headers['Access-Control-Request-Method'] || '') as string;
            toClientResponse.headers['Access-Control-Allow-Headers'] = (req.headers['Access-Control-Request-Headers'] || '') as string;
            let method = req.method;
            if (lowerCase(method) == 'option') {
                toClientResponse.headers['Access-Control-Max-Age'] = '86400';
            }

        } else if (action.data.modifyResponseType == "return404") {

            toClientResponse.hasContent = true;
            toClientResponse.statusCode = 404;
            toClientResponse.body = 'user want';

        }
    }
}
