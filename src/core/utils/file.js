const jsonfile = require("jsonfile");
const fs = require("fs");
/**
 * 如果文件不存在，则返回空字符串
 * Created by tsxuehu on 8/2/17.
 */
module.exports.readFile = function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, {
            encoding: 'utf-8'
        }, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        })
    });
}
module.exports.writeFile = function writeFile(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, {
            encoding: 'utf-8'
        }, (err) => {
            if (!err) {
                resolve(true);
            } else {
                reject(err);
            }
        });
    });
}

module.exports.removeFile = function removeFile(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (!err) {
                resolve(true);
            } else {
                reject(err);
            }
        })
    });
}

module.exports.readJsonFromFile = function readJsonFromFile(path) {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(path, (err, obj) => {
            if (!err) {
                resolve(obj);
            } else {
                reject(err);
            }
        })
    });
}

module.exports.writeJsonToFile = function writeJsonToFile(path, data) {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile(path, data, {spaces: 2}, (err) => {
            if (!err) {
                resolve(true);
            } else {
                reject(err);
            }
        })
    });
}

