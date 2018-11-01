<template>
    <div id="app" class="app">
        <div class="op-bar">
            <span class="icon-btn" :class="{'overflow':state.overflow}"
                  @click="requestToggleRecordState">
                <i class="iconfont icon-zanting zanting" v-if="!state.stopRecord"></i>
                <i class="iconfont icon-bofang bofang" v-else></i>
            </span>
            <i class="iconfont icon-qingchu icon-btn" @click="requestClear"></i>
            <span class="tips " :style="{visibility: state.overflow? 'initial' : 'hidden'}">记录已满，请清除历史记录</span>
            <span class="filters">
                Filter: <input placeholder="Host" v-model="filter.host"/> / <input placeholder="Path"
                                                                                   v-model="filter.path"/>
                <i class="iconfont icon-sousuo search"></i>
            </span>
            <a href="javascript:void(0)" v-if="!$dc.appInfo.single" class="username" @click="changeUser">
                <el-tooltip class="item" effect="dark" content="点击切换用户" placement="top">
                    <el-button type="text">{{$dc.userId}}</el-button>
                </el-tooltip>
            </a>
        </div>
        <div :style="{height: contentHeight+'px'}" class="monitor">
            <device-list></device-list>
            <http-traffic :height="contentHeight"></http-traffic>
            <detail :height="contentHeight"></detail>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';
    import _ from 'lodash';
    import HttpTraffic from './components/traffic/HttpTraffic.vue';
    import Detail from './components/detail/Detail.vue';
    import DeviceList from './components/device/DeviceList.vue';
    import * as trafficApi from '../api/traffic';
    import profileApi from '../api/profile';
    import appApi from '../api/app';

    export default {
        components: {
            HttpTraffic, Detail, DeviceList
        },
        data() {
            return {
                isDataCenter: true,
                appInfo: {},
                userId: 'guest',
                bindedDeviceList: [],
                // host文件列表
                hostFileList: [],
                // 当前选择的记录
                width: 0,
                contentHeight: 0,
                // 记录id 和 row中索引的映射关系
                recordMap: {}, // 当前所有记录
                originRecordArray: [],// 原始记录数组 存放记录id
                filterdRecordArray: [], // 过滤后的数组 存放记录id
                selectId: '',//当前选择的记录
                rightClickId: '',// 右击的记录id
                rightClickDeviceId: '',// 右击的设备id
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
            total() {
                return this.filterdRecordArray.length;
            },

            currentRow() {
                return this.recordMap[this.selectId] || {};
            },
            rightClickRow() {
                return this.recordMap[this.rightClickId];
            },
            rightClickDevice() {
                let device = this.bindedDeviceList.find(d => {
                    return d.id == this.rightClickDeviceId;
                })
                return device || {};
            },
            // 原始请求的header键值对
            originRequestHeader() {
                try {
                    return this.currentRow.originRequest.headers;
                } catch (e) {
                    return {};
                }
            },
            originRequestCookie() {
                try {
                    return trafficApi.parseCookie(this.currentRow.originRequest.headers.cookie || '');
                } catch (e) {
                    return {};
                }
            },
            originRequestQueryParams() {
                try {
                    return trafficApi.parseQuery(this.currentRow.originRequest.path);
                } catch (e) {
                    return {};
                }
            },
            // 当前请求的header键值对
            requestHeader() {
                try {
                    return this.currentRow.requestData.headers;
                } catch (e) {
                    return {};
                }
            },
            requestCookie() {
                try {
                    return trafficApi.parseCookie(this.currentRow.requestData.headers.cookie || '');
                } catch (e) {
                    return {};
                }
            },
            requestQueryParams() {
                try {
                    return trafficApi.parseQuery(this.currentRow.requestData.path);
                } catch (e) {
                    return {};
                }
            },

            responseHeader() {
                try {
                    let headers = Object.assign({}, this.currentRow.response.headers);
                    delete headers['set-cookie'];
                    return headers;
                } catch (e) {
                    return {};
                }
            },
            setCookies() {
                try {
                    return this.currentRow.response.headers['set-cookie'] || [];
                } catch (e) {
                    return [];
                }
            },

            timeline() {
                return {
                    '请求': ''
                }
            }
        },
        methods: {
            changeUser() {

            },
            requestToggleRecordState() {
                this.state.stopRecord = !this.state.stopRecord;
                // 向远端发送请求
                trafficApi.setStopRecord(this.state.stopRecord);
            },
            requestClear() {
                this.requestingClear = true;
                this.clear();
                trafficApi.clear();
                // 向远端发送请求
            },
            filterRecords() {
                let filtered = [];
                let {host: hostFilter, path: pathFilter} = this.filter;
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
            calcSize() {
                this.width = $(window).width();
                this.contentHeight = $(window).height() - 28;
            },
            // 处理接受到的请求处理数据
            receiveTraffic(rows) {
                if (this.state.stopRecord || this.requestingClear) return;
                let {host: hostFilter, path: pathFilter} = this.filter;
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
            async setCurrentRowIndex(id) {
                if (this.selectId == id) return;
                this.selectId = id;
                this.currentRequestBody = '';
                this.currentResponseBody = '';
                let currentRow = this.recordMap[id];
                if (/(json)|(x-www-form-urlencoded)/i.test(currentRow.originRequest.headers['content-type'])) {
                    // 请求后端 拿数据
                    this.currentRequestBody = await trafficApi.getRequestBody(id);
                }
                // 如果是html json数据 向后端请求拿数据
                try {
                    if (/(text)|(javascript)|(json)/i.test(currentRow.response.headers['content-type'])) {
                        // 请求后端 拿数据
                        this.currentResponseBody = await trafficApi.getResponseBody(id);
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            setRightClickedRecordId(id) {
                this.rightClickId = id;
            },
            setRightClickedDeviceId(deviceId) {
                this.rightClickDeviceId = deviceId;
            },
            setFilter(filter) {
                let origin = this.filter;
                if (origin.path == filter.path && origin.host == filter.host) {
                    return;
                }
                this.filter = filter;

            },
            setState(state) {
                this.state = state;
            },
            clear() {
                this.recordMap = {};
                this.originRecordArray = [];
                this.filterdRecordArray = [];
                this.currentRequestBody = '';
                this.currentResponseBody = '';
            }
        },
        watch: {
            // 监听过滤器变化
            filter: {
                handler: _.debounce(function () {
                    // 过滤
                    this.filterRecords();
                    trafficApi.setFilter(this.filter);
                }, 1000),
                deep: true
            }
        },
        async created() {
            this.calcSize();

            let result = await profileApi.getUserId();
            this.userId = result.data.data.userId;
            let appInfo = await appApi.getAppInfo();
            this.appInfo = appInfo.data.data;

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
            socket.on('bindedDeviceList', deviceList => {
                this.bindedDeviceList = deviceList;
            });
            socket.on('hostfilelist', data => {
                this.hostFileList = data;
            });
        }
    };
</script>

