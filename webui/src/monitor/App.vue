<template>
    <div id="app" class="app">
        <div class="op-bar">
            <span class="icon-btn" :class="{'overflow':state.overflow}"
                  @click="requestToggleRecordState">
                <i class="iconfont icon-zanting" v-if="!state.stopRecord"></i>
                <i class="iconfont icon-bofang"  v-else></i>
            </span>
            <i class="iconfont icon-qingchu icon-btn" @click="requestClear"></i>
            <span class="tips " :style="{visibility: state.overflow? 'initial' : 'hidden'}">记录已满，请清除历史记录</span>
            <span class="filters">Filter:
                <input placeholder="Host" v-model="filter.host"/>
                / <input placeholder="Path" v-model="filter.path"/>
                <i class="iconfont icon-sousuo search"></i>
            </span>
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
    import * as trafficApi from '../api/traffic';
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
                // 记录id 和 row中索引的映射关系
                recordMap: {}, // 当前所有记录
                originRecordArray: [],// 原始记录数组 存放记录id
                filterdRecordArray: [], // 过滤后的数组 存放记录id
                selectId: '',//当前选择的记录
                rightClickId: '',// 右击的id
                currentRequestBody: '',// 选择记录的请求body
                currentResponseBody: '',// 选择记录的响应body
                requestingClear: false, // 请求清除记录
                state: {
                    stopRecord: false, // 停止记录
                    overflow: false // 打到最大记录数显示
                },
                filter: { // 过滤器
                    host: '',
                    path: ''
                }
            };
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
                return trafficApi.parseCookie(this.currentRow.reqHeaders.cookie || '');
            },
            requestQueryParams(){
                return trafficApi.parseQuery(this.currentRow.path);
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
        methods: {
            requestToggleRecordState(){
                this.state.stopRecord = !this.state.stopRecord;
                // 向远端发送请求
                trafficApi.setStopRecord(this.state.stopRecord);
            },
            requestClear(){
                this.requestingClear = true;
                this.clear();
                trafficApi.clear();
                // 向远端发送请求
            },
            filterRecords(){
                let filtered = [];
                let { host: hostFilter, path: pathFilter } = this.filter;
                this.originRecordArray.forEach(id => {
                    let r = this.recordMap[id];
                    let originRequest = r.originRequest;
                    if (originRequest
                        && originRequest.host.indexOf(hostFilter) > -1
                        && originRequest.path.indexOf(pathFilter) > -1) {
                        filtered.push(r.id);
                    }
                });
                this.filterdRecordArray = filtered;
            },
            calcSize(){
                this.width = $(window).width();
                this.height = $(window).height() - 28;
            },
            // 处理接受到的请求处理数据
            receiveTraffic(rows){
                if (this.state.stopRecord || this.requestingClear) return;
                let { host: hostFilter, path: pathFilter } = this.filter;
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
                        && originRequest.host.indexOf(hostFilter) > -1
                        && originRequest.path.indexOf(pathFilter) > -1) {
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
                    this.currentResponseBody = await trafficApi.getRequestBody(index);
                }
            },
            setRightClickedRecordId(id){
                this.rightClickId = id;
            },
            setFilter(filter){
                let origin = this.filter;
                if (origin.path == filter.path && origin.host == filter.host) {
                    return;
                }
                this.filter = filter;

            },
            setState(state){
                this.state = state;
            },
            clear() {
                this.recordMap = {};
                this.originRecordArray = [];
                this.filterdRecordArray = [];
            }
        },
        watch: {
            // 监听过滤器变化
            filter: {
                handler: _.debounce(function () {
                    // 过滤
                    this.filterRecords();
                    trafficApi.setFilter(this.filter);
                }, 1500),
                deep: true
            }
        },
        created() {
            this.calcSize();

            $(window).resize(_.debounce(this.calcSize, 200));

            if (!window.io) return;
            let socket = io('/httptrafic');
            socket.on('rows', this.receiveTraffic);
            socket.on('filter', filter => {
                this.setFilter(filter);
            });
            socket.on('state', this.setState);
            socket.on('clear', () => {
                this.requestingClear = false;
                this.clear();
            });
        }
    };
</script>

