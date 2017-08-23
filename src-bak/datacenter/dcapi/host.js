/**
 * Created by tsxuehu on 17/2/24.
 */
var _ = require('lodash');
var Vue = require('vue');
var path = require('path');
var file = require('../../utils/file');

module.exports = function (store ,localConfDir) {
    return {
        // host配置相关
        createHostFile: function (name, description) {
            if (store.hostFileMap[name]){
                // 文件已经存在不让创建
                return false;
            }

            var content = {
                "meta": {
                    "local": true
                },
                "checked": false,
                "name": name,
                "description": description,
                "content": {}
            };
            Vue.set(store.hostFileMap, name, content);
            file.writeJsonFile(path.join(localConfDir,'host',name+'.json'),content);
            return true;
        },

        getHostFileList: function () {
            return store.hostFileList;
        },

        deleteHostFile: function (name) {
            Vue.delete(store.hostFileMap, name);
            file.deleteFile(path.join(localConfDir,'host',name+'.json'));
        },

        getHostFile: function (name) {
            return store.hostFileMap[name];
        },

        setUseHost: function (filename) {
            _.forEach(store.hostFileMap, function (content, name) {
                if (name == filename) {
                    Vue.set(content, 'checked', true);
                } else {
                    Vue.set(content, 'checked', false);
                }
                file.writeJsonFile(path.join(localConfDir,'host',name+'.json'),content);
            })
        },

        saveHostFile: function (name, content) {
            Vue.set(store.hostFileMap, name, content);
            file.writeJsonFile(path.join(localConfDir,'host',name+'.json'),content);
        },

        /**
         * 解析hostname为ip，如果解析不了则返回hostname
         */
        resolveHost: function (hostname) {
            if (!hostname) return hostname;
            var ip = store.hostMap[hostname];
            if (ip) return ip;
            // 配置 *开头的host  计算属性globHostMap已经将*去除
            ip = _.find(store.globHostMap, function (value, host) {
                return hostname.endsWith(host);
            });
            return ip || hostname;
        },

        getHostMap: function () {
            return store.hostMap;
        },

        getGlobHostMap: function () {
            return store.globHostMap;
        }
    }
};