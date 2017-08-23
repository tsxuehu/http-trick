/**
 * Created by tsxuehu on 17/2/24.
 */
var _ = require('lodash');
var Vue = require('vue');
var path = require('path');
var file = require('../../utils/file');

module.exports = function (store, localConfDir) {
    return {
        // rule规则相关
        // host配置相关
        createRuleFile: function (name, description) {
            if (store.ruleFileMap[name]) {
                // 文件已经存在不让创建
                return false;
            }

            var content = {
                "meta": {
                    "remote": false,
                    "url": "",
                    "ETag": "",
                    "remoteETag": ""
                },
                "checked": true,
                "name": name,
                "description": description,
                "content": []
            };
            Vue.set(store.ruleFileMap, name, content);
            file.writeJsonFile(path.join(localConfDir, 'rule', name + '.json'), content);
            return true;
        },

        getRuleFileList: function () {
            return store.ruleFileList;
        },

        deleteRuleFile: function (name) {
            Vue.delete(store.ruleFileMap, name);
            file.deleteFile(path.join(localConfDir, 'rule', name + '.json'));
        },

        getRuleFile: function (name) {
            return store.ruleFileMap[name];
        },

        setRuleFilecheckStatus: function (filename, status) {
            store.ruleFileMap[filename].checked = status;
            file.writeJsonFile(path.join(localConfDir, 'rule', filename + '.json'),
                store.ruleFileMap[filename]);
        },

        saveRuleFile: function (name, content) {
            Vue.set(store.ruleFileMap, name, content);
            file.writeJsonFile(path.join(localConfDir, 'rule', name + '.json'), content);
        },

        /**
         * 获取正在使用的规则
         * @returns {store.computed.inusingRules}
         */
        getInuseRules: function () {
            return store.inusingRules;
        },
    }
};
