<template>
    <div id="app" class="app">
        <div class="op-bar">
            暂停（开始） | 清空 | 记录已满，请清除历史记录 | filter （） （） 搜索
        </div>
        <div class="monitor">
            <http-traffic :height="height"></http-traffic>
            <detail></detail>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';
    import _ from 'lodash';
    import HttpTraffic from './components/HttpTraffic.vue';
    import Detail from './components/Detail.vue';
    import * as monitorApi from '../api/monitor';
    let socket = null;
    export default {
        components: {
            HttpTraffic, Detail
        },
        data(){
            return {
                isDataCenter: true,
                // 当前选择的记录
                width: 0,
                height: 0,
                hostFilter: '',
                pathFilter: '',
                // 记录id 和 row中索引的映射关系
                recordMap: {}, // 当前所有记录
                originRecordArray: [],// 原始记录数组 存放记录id
                filterdRecordArray: [], // 过滤后的数组 存放记录id
                selectId: '',//当前选择的记录
                rightClickId: '',// 右击的id
                currentRequestBody: '',// 选择记录的请求body
                currentResponseBody: '',// 选择记录的响应body
            };
        },
        methods: {
            filterRecords(){
                let filtered = [];
                this.originRecordArray.forEach(r => {
                    let originRequest = r.originRequest;
                    if (originRequest
                        && originRequest.host.indexOf(this.hostFilter) > -1
                        && originRequest.path.indexOf(this.pathFilter) > -1) {
                        filtered.push(r.id);
                    }
                });
                this.filterdRecordArray = filtered;
            },
            calcSize(){
                this.width = $(window).width();
                this.height = $(window).height() - 20;
            },
            // 处理接受到的请求处理数据
            receiveTraffic(rows){
                _.forEach(rows, (row) => {
                    let id = row.id;
                    let hasRecieved = !!this.recordMap[id];
                    let record = this.recordMap[id] || {};
                    Object.assign(record, row);

                    this.$set(this.recordMap, id, record);

                    if (!hasRecieved) {
                        this.originRecordArray.push(id);
                    }
                    // 根据host、path进行过滤
                    let originRequest = row.originRequest;
                    if (originRequest
                        && originRequest.host.indexOf(this.hostFilter) > -1
                        && originRequest.path.indexOf(this.pathFilter) > -1) {
                        this.filterdRecordArray.push(id);
                    }
                });
            },
            async setCurrentRowIndex(id){
                if (this.selectId == id) return;
                this.selectId = id;
                this.currentRequestBody = '';
                this.currentResponseBody = '';
                let currentRow = this.recordMap[id];
                if (/(json)|(x-www-form-urlencoded)/i.test(currentRow.originRequest.headers['content-type'])) {
                    // 请求后端 拿数据
                    this.currentRequestBody = currentRow.reqBody;
                }
                // 如果是html json数据 向后端请求拿数据
                if (/(text)|(javascript)|(json)/i.test(currentRow.contentType)) {
                    // 请求后端 拿数据
                    this.currentResponseBody = await monitorApi.getRequestBody(index);
                }
            },
            setRightClickedRecordId(id){
                this.rightClickId = id;
            }
        },
        computed: {
            total(){
                return this.filterdRecordArray.length;
            },

            currentRow(){
                return this.recordMap[this.selectId] || {};
            },
            rightClickRow(){
                return this.recordMap[this.rightClickId];
            },
            // 当前请求的header键值对
            requestHeader(){
                var headers = _.assign({}, this.currentRow.reqHeaders);
                delete headers['cookie'];
                return headers;
            },
            requestCookie(){
                if (!this.currentRow.reqHeaders) return {};
                return monitorApi.parseCookie(this.currentRow.reqHeaders.cookie || '');
            },
            requestQueryParams(){
                return monitorApi.parseQuery(this.currentRow.path);
            },
            requestRawHeader(){
                let row = this.currentRow;
                let headers = this.currentRow.resHeaders;
                if (!headers) return '';
                let lines = `${row.method} ${row.protocol}/${row.httpVersion} ${row.path}\n`;
                _.forEach(this.requestHeader, (v, k) => {
                    lines += `${k}    ${v}\n`;
                });
                return lines;
            },
            responseHeader(){
                var headers = _.assign({}, this.currentRow.resHeaders);
                delete headers['set-cookie'];
                return headers;
            },
            setCookies(){
                return this.currentRow.resHeaders ? this.currentRow.resHeaders['set-cookie'] : [];
            },
            responseRawHeader(){
                let row = this.currentRow;
                let headers = this.currentRow.resHeaders;
                if (!headers) return '';
                let lines = `${row.protocol}/${row.httpVersion} ${row.result}\n`;
                _.forEach(this.responseHeader, (v, k) => {
                    lines += `${k}    ${v}\n`;
                });
                return lines;
            }
        },
        created() {
            this.calcSize();

            $(window).resize(_.debounce(this.calcSize, 200));

            // 数据mock
            this.receiveTraffic([{
                id: 1,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            },{
                id: 2,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            },{
                id: 3,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            },{
                id: 4,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            },{
                id: 5,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            },{
                id: 6,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            },{
                id: 7,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            },{
                id: 8,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            },{
                id: 20,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            },{
                id: 9,
                originRequest: {
                    clientIp: '111',
                    method: 'get',
                    httpVersion: '1.1',
                    headers: {a:1},
                    host: 'www.baidu.com',
                    path: '/'
                }
            }]);
            // end

            if (!window.io) return;
            let socket = io('/httptrafic');
            socket.on('rows', this.receiveTraffic);

        }
    };
</script>

