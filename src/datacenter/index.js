var path = require("path");

var _ = require('lodash');
var copydir = require('copy-dir');
var fs = require('fs');
var confDir = path.join(__dirname, '../../conf');
var file = require('../utils/file');
// 用户配置目录
var userHomeConf = file.getUserHomeConfDir();
// 复制文件
if (!file.existsSync(userHomeConf)) {
    fs.mkdirSync(userHomeConf);
    copydir.sync(confDir, userHomeConf);

}
var localConfDir = file.getUserHomeConfLocalDir();

// 事件处理
var EventEmitter = require('events');
var event = new EventEmitter();

// 创建状态
var Vue = require('vue');

var store = new Vue({
    data: function () {
        return {
            // gitlab token
            /**
             * 运行时参数
             */
            runtimeInfo: {
                realUiPort: '',
                realProxyPort: '',
                pcIp: '127.0.0.1',
                pid: '', // 线程id
                httpTraficMonitorCnt: 0, // 监控窗口的打开数量
                storeMonitorCnt: 0, // 监控数据中心的界面数量
                wsMockCnt: 0 //websocket mock界面的打开数量
            },
            /**
             * 配置信息及用户交互数据
             * conf.json中的配置信息
             */
            conf: {},//
            /**
             * 存放所有的host数据，格式
             * 文件名 -> 文件内容json
             */
            hostFileMap: {},// host 名字 文件类容
            /**
             * 存放所有的rule规则，存放格式
             * 文件名 -> 文件内容json
             */
            ruleFileMap: {},
            /**
             * 数据文件列表
             */
            dataList: [],
        }
    },
    computed: {
        /**
         * 返回正在使用的host规则
         * host -> ip
         */
        hostMap: function () {
            // 读需要的host
            var findedUsingHost = _.find(this.hostFileMap, function (content) {
                return content.checked;
            });
            var hostmap = {};
            if (!findedUsingHost) return hostmap;
            _.forEach(findedUsingHost.content, function (ip, host) {
                if (!host.startsWith('*')) {
                    hostmap[host] = ip;
                }
            });
            return hostmap;
        },
        /**
         *  带有*的hostmap
         */
        globHostMap: function () {
            // 读需要的host
            var findedUsingHost = _.find(this.hostFileMap, function (content) {
                return content.checked;
            });
            var hostmap = {};
            if (!findedUsingHost) return hostmap;
            _.forEach(findedUsingHost.content, function (ip, host) {
                if (host.startsWith('*')) {
                    hostmap[host.substr(1, host.length)] = ip;
                }
            });
            return hostmap;
        },
        /**
         * 返回生效的 请求处理规则
         * [rule]
         */
        inusingRules: function () {
            var _this = this;
            var rulesLocal = [];
            var rulesRemote = [];
            _.forEach(this.ruleFileMap, function (file, filename) {
                if (!file.checked) return;
                _.forEach(file.content, function (rule) {
                    if (!rule.checked) return;
                    var copy = _.cloneDeep(rule);
                    copy.rcName = filename;
                    if (file.meta.remote) {
                        rulesRemote.push(copy);
                    } else {
                        rulesLocal.push(copy);
                    }
                });
            });
            return rulesLocal.concat(rulesRemote);
        },
        // host文件列表简要信息
        hostFileList: function () {
            var hosts = [];
            _.forEach(this.hostFileMap, function (content, key) {
                hosts.push({
                    name: content.name,
                    checked: content.checked,
                    description: content.description,
                    meta: content.meta
                })
            });
            return hosts;
        },
        // 规则文件列表简要信息
        ruleFileList: function () {
            var rulesLocal = [];
            var rulesRemote = [];
            _.forEach(this.ruleFileMap, function (content) {
                if (content.meta.remote) {
                    rulesRemote.push({
                        name: content.name,
                        checked: content.checked,
                        description: content.description,
                        meta: content.meta
                    });
                } else {
                    rulesLocal.push({
                        name: content.name,
                        checked: content.checked,
                        description: content.description,
                        meta: content.meta
                    });
                }
            });

            return rulesLocal.concat(rulesRemote);
        },
        // 将datalist 转成 data id -> entry映射
        dataFileMap: function () {
            var map = {};
            _.forEach(this.dataList, function (entry, index) {
                map[entry.id] = entry;
            });
            return map;
        }
    },
    /**
     * 监听数据变化，向用户界面发送数据变化通知，
     * 通过抛事件的方式，向外发送通知
     */
    watch: {
        runtimeInfo: {
            handler: function () {
                event.emit('runtimeChange', this.runtimeInfo);
            },
            deep: true
        },
        conf: {
            handler: function () {
                event.emit('confChange', this.conf);
            },
            deep: true
        },
        hostMap: function () {
            event.emit('hostChange', this.hostMap);
        },
        globHostMap: function () {
            event.emit('globHostChange', this.globHostMap);
        },
        inusingRules: function () {
            event.emit('ruleChange', this.inusingRules);
        },
        hostFileList: function () {
            event.emit('hostFileListChange', this.hostFileList);
        },
        ruleFileList: {
            handler: function () {
                event.emit('ruleFileListChange', this.ruleFileList);
            },
            deep: true
        },
        dataList: function () {
            event.emit('dataListChange', this.dataList);
        }
    }
});


/**
 */
// 将配置信息，用户行为数据读到内存中
function loadConf() {
    // 这个配置文件不能异步读取。。因为启动流程需要用到conf里的信息,...进行合并操作
    var defaultConf = file.readJsonFileSync(path.join(confDir, 'local/conf.json'));
    store.conf = _.merge(defaultConf, file.readJsonFileSync(path.join(localConfDir, 'conf.json')));
}
// 将所有的host配置文件读到内存中
function loadHost() {
    // 加载本利的host
    var localHostDir = path.join(localConfDir, 'host');
    file.readJsonFileInDir(localHostDir, function (name, content) {
        Vue.set(store.hostFileMap, name, content);
    });
}
// 将规则信息读到内存中
function loadRule() {
    // 文件名 -> 文件内容 （server目录下的文件名添加'[remote]'后缀）
    // 加载本地的规则
    var localRuleDir = path.join(localConfDir, 'rule');
    file.readJsonFileInDir(localRuleDir, function (name, content) {
        // 补全同步字段
        Vue.set(store.ruleFileMap, content.name, content);
    });
}
function loadDataList() {
    // 加载datalist
    var datalistPath = path.join(localConfDir, 'data/datalist.json');
    file.readJsonFile(datalistPath, function (name, content) {
        store.dataList = content;
    });
}
loadConf();
loadHost();
loadRule();
loadDataList();

// 启动3s后将运行信息写入文件写文件
setTimeout(function () {
    store.runtimeInfo.pid = process.pid;
    file.writeJsonFile(path.join(localConfDir, 'runtime.json'), store.runtimeInfo);
}, 3000);

// --------------------------------------
module.exports = Object.assign({},
    require('./dcapi/conf')(store, localConfDir),
    require('./dcapi/host')(store, localConfDir),
    require('./dcapi/rule')(store, localConfDir),
    require('./dcapi/runtime')(store, localConfDir),
    require('./dcapi/data')(store, localConfDir),
    // 提供事件监听
    {
        on: function (eventanme, callback) {
            event.on(eventanme, callback);
        }
    }
);
