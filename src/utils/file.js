var fs = require('fs');
var jsonfile = require('jsonfile');
var _ = require('lodash');
var path = require('path');
/**
 * 写json文件
 * @param path
 * @param content
 */
exports.writeJsonFile = function (path, content) {
    jsonfile.writeFile(path, content, {spaces: 2}, function () {
    })
};


exports.deleteFile = function (path) {
    fs.unlink(path, function () {
    })
};
exports.readJsonFileSync = function (path) {
    return jsonfile.readFileSync(path)
};

exports.readFileSync = function (path) {
    return fs.readFileSync(path, 'utf8')
};
/**
 *
 * callback(filename,content) filename:是文件里的name字段
 * @param path
 * @param callback
 * @returns {Array}
 */
exports.readJsonFile = function (path, callback) {
    jsonfile.readFile(path, function (err, obj) {
        if (!err) {
            callback && callback(obj.name, obj);
        }
    })
};
/**
 *
 * callback(filename,content) filename:是文件里的name字段
 * @param path
 * @param callback
 * @returns {Array}
 */
exports.readJsonFileInDir = function (dir, callback) {
    fs.readdir(dir, function (err, files) {
        if (err) throw err;

        _.forEach(files, function (nameWithExtention) {
            if (!nameWithExtention.endsWith('.json')) return;
            jsonfile.readFile(path.join(dir, nameWithExtention), function (err, obj) {
                if (err) throw err;
                callback && callback(obj.name, obj);
            })
        })
    })
};

exports.readFileInDir = function (dir, callback) {
    fs.readdir(dir, function (err, files) {
        if (err) throw err;
        callback && callback(files);

    })
};

exports.existsSync = function (path) {
    return fs.existsSync(path)
};

exports.writeFileUTF8 = function (path, content) {
    fs.writeFile(path, content, 'utf8', function (err) {
        if (err) throw err;
    });
};

exports.getUserHome = function () {
    return process.env.HOME || process.env.USERPROFILE;

};

exports.getUserHomeConfDir = function () {
    return path.join(exports.getUserHome(), '.fe-proxy');
};

exports.getUserHomeConfLocalDir = function () {
    return path.join(exports.getUserHomeConfDir(), 'local');

};
