/**
 * Created by tsxuehu on 17/3/19.
 */
/**
 * Created by tsxuehu on 17/2/24.
 */
var _ = require('lodash');
var Vue = require('vue');
var path = require('path');
var file = require('../../utils/file');
var mkdirp = require('mkdirp');
var fs = require('fs');


module.exports = function (store, localConfDir) {
    var dataListPath = path.join(localConfDir, 'data/datalist.json');
    var datafileDir = path.join(localConfDir, 'data/file');

    // 确保建立data文件夹
    fs.writeFile(path.join(localConfDir, 'data/file/flag'), 'flag', function (err) {
        if (err) {
            mkdirp(path.join(localConfDir, 'data/file'), function () {
            })
        }
    });


    return {
        /**
         * {id:'',contenttype:'',name:''}
         * @returns {*}
         */
        getDataList: function () {
            return store.dataList;
        },
        // 保存数据文件列表，请求无用的数据文件
        saveDataList: function (content) {
            store.dataList = content;
            file.writeJsonFile(dataListPath, content);
            file.readFileInDir(datafileDir, function (nameList) {
                var fileNameList = _.filter(nameList, function (name) {
                    return name.length > 20;
                });
                var tobeDelete = fileNameList;
                var toBeAdded = [];
                _.forEach(store.dataList, function (entry) {
                    var index = _.findIndex(tobeDelete, function (id) {
                        return id == entry.id;
                    });
                    // 如果找到则保留
                    if (index > -1) {
                        tobeDelete.splice(index, 1);
                    } else {
                        toBeAdded.push(entry.id);
                    }
                });
                // 进行文件操作
                _.forEach(toBeAdded, function (id) {// 写空文件
                    file.writeFileUTF8(path.join(datafileDir, id), '');
                });
                _.forEach(tobeDelete, function (id) {// 写空文件
                    file.deleteFile(path.join(datafileDir, id));
                });
            })
        },

        getDataFilePath: function (dataId) {
            return path.join(localConfDir, 'data/file', dataId);
        },

        saveDataFileContent: function (dataId, content) {
            file.writeFileUTF8(path.join(datafileDir, dataId), content);
        },

        getDataFileContentType: function (dataId) {
            return store.dataFileMap[dataId]['contenttype'];
        },

        saveDataEntryFromTraffic(id, name, contenttype, reqid){
            // 保存数据
            store.dataList.push({
                id: id,
                name: name,
                contenttype: contenttype
            });
            file.writeJsonFile(dataListPath, store.dataList);
            // 写文件
            var bodypath =  path.join(file.getUserHomeConfDir(), 'tmp',  reqid + '_res_body');
            var target = path.join(datafileDir, id);
            fs.createReadStream(bodypath).pipe(fs.createWriteStream(target));
        }
    }
};
