import jsonfile from "jsonfile";
import fs from "fs";
/**
 * 如果文件不存在，则返回空字符串
 * Created by tsxuehu on 8/2/17.
 */
export function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        })
    });
}
export function writeFile(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if (!err) {
                resolve(true);
            } else {
                reject(err);
            }
        });
    });
}

export function readJsonFromFile(path) {
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

export async function writeJsonToFile(path, data) {
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

