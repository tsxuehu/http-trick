<template>
    <div id="app" style="height: 100%;">
        <div class="op-bar">

        </div>
        <div>
            <http-traffic :height="height" :width="width"></http-traffic>
            <div class="detail">
                <detail></detail>
            </div>
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
                rows: [],
                currentRowCount: 0,
                // 记录id 和 row中索引的映射关系
                idIndexMap: {},
                smallId: 3000,
                bigId: 0,
                rightClickRow: {},
                selectId: '',
                currentRequestBody: '',
                currentResponseBody: ''
            };
        },
        methods: {
            calcSize(){
                this.width = $(window).width();
                this.height = $(window).height() - 300;
            },
            // 处理接受到的请求处理数据
            receiveTraffic(rows){
                _.forEach(rows, (row) => {
                    let id = row.id;
                    let index = this.idIndexMap[id];
                    if (index == undefined) {
                        this.idIndexMap[id] = this.currentRowCount;
                        this.rows.push[row];
                        this.currentRowCount++;
                    } else {
                        let merged = Object.assign({}, this.rows[this.currentRowCount], row);
                        this.$set(this.rows, index, merged);
                    }
                });
            },
            async setCurrentRowIndex(index){
                if (this.selectId == index) return;
                this.selectId = index;
                this.currentRequestBody = '';
                this.currentResponseBody = '';
                if (/(json)|(x-www-form-urlencoded)/i.test(this.currentRow.reqHeaders['content-type'])) {
                    this.currentRequestBody = this.currentRow.reqBody;
                }
                // 如果是html json数据 向后端请求拿数据
                if (/(text)|(javascript)|(json)/i.test(this.currentRow.contentType)) {
                    this.currentResponseBody = await monitorApi.getRequestBody(index);
                }
            }
        },
        computed: {
            total(){
                return this.bigId - this.smallId + 1;
            },

            currentRow(){
                return this.rows[this.selectId] || {};
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

            if (!window.io) return;
            let socket = io('/httptrafic');
            socket.on('rows', this.receiveTraffic);
        }
    };
</script>

