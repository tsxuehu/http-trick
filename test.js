Error: Can't set headers after they are sent.
{ hasContent: true,
    sendedToClient: false,
    stopRunAction: true,
    requestData:
    { method: '',
        protocol: '',
        port: '',
        path: '',
        headers: {},
        body: '' },
    remoteIp: '124.160.144.49',
        receiveRequestTime: 1515744084304,
    dnsResolveBeginTime: 1515744084304,
    remoteRequestBeginTime: 1515744084657,
    remoteResponseStartTime: 1515744084709,
    remoteResponseEndTime: 0,
    requestEndTime: 0,
    statusCode: 600,
    headers:
    { server: 'JSP3/2.0.14',
        date: 'Fri, 12 Jan 2018 08:01:24 GMT',
        'content-type': 'application/x-javascript',
        'content-length': 106,
        connection: 'close',
        etag: '"5a56f6ca-7ed4"',
        'last-modified': 'Thu, 11 Jan 2018 05:31:54 GMT',
        expires: 'Fri, 12 Jan 2018 08:07:13 GMT',
        age: '3251',
        'cache-control': 'max-age=3600',
        'accept-ranges': 'bytes',
        'content-encoding': 'gzip',
        'ohc-response-time': '1 0 0 0 0 0',
        'fe-proxy-userId': 'root',
        'fe-proxy-action-0': '--bypass-run',
        'fe-proxy-content': 'http://dup.baidustatic.com:80/js/os.js',
        'remote-ip': '124.160.144.49' },
    body: '{ Error: unexpected end of file\n    at Unzip.zlibOnError (zlib.js:153:15) errno: -5, code: \'Z_BUF_ERROR\' }' }
Url {
    protocol: 'http:',
        slashes: true,
        auth: null,
        at validateHeader (_http_outgoing.js:494:11)
    host: 'dup.baidustatic.com',
        port: 80,
        hostname: 'dup.baidustatic.com',
        at ServerResponse.setHeader (_http_outgoing.js:501:3)
    hash: null,
    at /Users/tsxuehu/workspace-mock/fe-proxy/src/core/proxy/sendToClient/specific.js:19:13
    search: null,
    at /Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:4944:15
    query: null,
        at baseForOwn (/Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:3001:24)
    pathname: '/js/os.js',
        path: '/js/os.js',
    at /Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:4913:18
    href: 'http://dup.baidustatic.com/js/os.js' }
at Function.forEach (/Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:9359:14)
at module.exports (/Users/tsxuehu/workspace-mock/fe-proxy/src/core/proxy/sendToClient/specific.js:18:7)
at HttpHandle._runAtions (/Users/tsxuehu/workspace-mock/fe-proxy/src/core/proxy/handle/httpHandle.js:280:21)
at <anonymous>
{ hasContent: true,
    sendedToClient: false,
    stopRunAction: true,
    requestData:
        { method: '',
            protocol: '',
            port: '',
            path: '',
            headers: {},
            body: '' },
    remoteIp: '220.170.182.34',
    receiveRequestTime: 1515744085667,
    dnsResolveBeginTime: 1515744085668,
    remoteRequestBeginTime: 1515744086207,
    remoteResponseStartTime: 1515744086299,
    remoteResponseEndTime: 0,
    requestEndTime: 0,
    statusCode: 600,
    headers:
        { server: 'JSP3/2.0.14',
            date: 'Fri, 12 Jan 2018 08:01:26 GMT',
            'content-type': 'application/x-javascript',
            'content-length': 106,
            connection: 'close',
            etag: '"5a56f6c6-7ed4"',
            'last-modified': 'Thu, 11 Jan 2018 05:31:50 GMT',
            expires: 'Fri, 12 Jan 2018 08:46:40 GMT',
            age: '886',
            'cache-control': 'max-age=3600',
            'accept-ranges': 'bytes',
            'content-encoding': 'gzip',
            'ohc-response-time': '1 0 0 0 0 0',
            'fe-proxy-userId': 'root',
            'fe-proxy-action-0': '--bypass-run',
            'fe-proxy-content': 'http://cpro.baidustatic.com:80/cpro/ui/c.js',
            'remote-ip': '220.170.182.34' },
    body: '{ Error: unexpected end of file\n    at Unzip.zlibOnError (zlib.js:153:15) errno: -5, code: \'Z_BUF_ERROR\' }' }
Url {
    protocol: 'http:',
        slashes: true,
        auth: null,
        host: 'cpro.baidustatic.com',
        port: 80,
        hostname: 'cpro.baidustatic.com',
        hash: null,
        search: null,
        query: null,
        pathname: '/cpro/ui/c.js',
        path: '/cpro/ui/c.js',
        href: 'http://cpro.baidustatic.com/cpro/ui/c.js' }
Error: Can't set headers after they are sent.
at validateHeader (_http_outgoing.js:494:11)
at ServerResponse.setHeader (_http_outgoing.js:501:3)
at /Users/tsxuehu/workspace-mock/fe-proxy/src/core/proxy/sendToClient/specific.js:19:13
at /Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:4944:15
at baseForOwn (/Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:3001:24)
at /Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:4913:18
at Function.forEach (/Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:9359:14)
at module.exports (/Users/tsxuehu/workspace-mock/fe-proxy/src/core/proxy/sendToClient/specific.js:18:7)
at HttpHandle._runAtions (/Users/tsxuehu/workspace-mock/fe-proxy/src/core/proxy/handle/httpHandle.js:280:21)
at <anonymous>
Error: Can't set headers after they are sent.
at validateHeader (_http_outgoing.js:494:11)
at ServerResponse.setHeader (_http_outgoing.js:501:3)
at /Users/tsxuehu/workspace-mock/fe-proxy/src/core/proxy/sendToClient/specific.js:19:13
at /Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:4944:15
at baseForOwn (/Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:3001:24)
at /Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:4913:18
at Function.forEach (/Users/tsxuehu/workspace-mock/fe-proxy/node_modules/lodash/lodash.js:9359:14)
at module.exports (/Users/tsxuehu/workspace-mock/fe-proxy/src/core/proxy/sendToClient/specific.js:18:7)
at HttpHandle._runAtions (/Users/tsxuehu/workspace-mock/fe-proxy/src/core/proxy/handle/httpHandle.js:280:21)
at <anonymous>
{ hasContent: true,
    sendedToClient: false,
    stopRunAction: true,
    requestData:
        { method: '',
            protocol: '',
            port: '',
            path: '',
            headers: {},
            body: '' },
    remoteIp: '180.101.150.6',
    receiveRequestTime: 1515744086430,
    dnsResolveBeginTime: 1515744086430,
    remoteRequestBeginTime: 1515744086787,
    remoteResponseStartTime: 1515744086978,
    remoteResponseEndTime: 0,
    requestEndTime: 0,
    statusCode: 600,
    headers:
        { server: 'Tengine',
            'content-type': 'application/javascript',
            connection: 'keep-alive',
            date: 'Fri, 12 Jan 2018 07:56:29 GMT',
            'x-oss-request-id': '5A586A2D2B5AE4A5660F8E02',
            'accept-ranges': 'bytes',
            etag: '"12FB91CDBC6BB8F246973EED79622846"',
            'last-modified': 'Thu, 27 Jul 2017 07:24:31 GMT',
            'x-oss-object-type': 'Normal',
            'x-oss-hash-crc64ecma': '13831314831240464866',
            'x-oss-storage-class': 'Standard',
            'cache-control': 'max-age=3600,s-maxage=3600',
            vary: 'Accept-Encoding',
            'content-md5': 'EvuRzbxruPJGlz7teWIoRg==',
            'x-oss-server-time': '1',
            via: 'cache40.l2cn41[0,304-0,H], cache20.l2cn41[0,0], cache4.cn618[0,304-0,H], cache5.cn618[0,0]',
            'content-encoding': 'gzip',
            age: '297',
            'x-cache': 'HIT TCP_IMS_HIT dirn:9:312774969 mlen:-1',
            'timing-allow-origin': '*',
            eagleid: 'b465964515157440869802466e',
            'fe-proxy-userId': 'root',
            'fe-proxy-action-0': '--bypass-run',
            'fe-proxy-content': 'https://atanx2.alicdn.com:443/g/mm/tanx-cdn2/t/tanxssp.js?_v=12',
            'remote-ip': '180.101.150.6',
            'content-length': 106 },
    body: '{ Error: unexpected end of file\n    at Unzip.zlibOnError (zlib.js:153:15) errno: -5, code: \'Z_BUF_ERROR\' }' }
Url {
    protocol: 'https:',
        slashes: true,
        auth: null,
        host: 'atanx2.alicdn.com',
        port: 443,
        hostname: 'atanx2.alicdn.com',
        hash: null,
        search: '?_v=12',
        query: '_v=12',
        pathname: '/g/mm/tanx-cdn2/t/tanxssp.js',
        path: '/g/mm/tanx-cdn2/t/tanxssp.js?_v=12',
        href: 'https://atanx2.alicdn.com/g/mm/tanx-cdn2/t/tanxssp.js?_v=12' }
