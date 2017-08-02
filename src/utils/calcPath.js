/**
 * Created by tsxuehu on 17/3/2.
 */
var fs = require('fs');
var jsonfile = require('jsonfile');
var _ = require('lodash');
var path = require('path');
var dc = require('../datacenter')
/**
 * 更具请求url，匹配规则，目录路径模板。。经正则替换、参数替换计算出目标路径
 * @param requestUrl
 * @param match
 * @param tpl
 */
exports.calcPath = function (requestUrl, match ,targetTpl) {
    var target = targetTpl;

    if (match){
        try{
            var matchList = requestUrl.match(new RegExp(match));
            _.forEach(matchList,function (value,index) {
                if (index == 0) return ;
                var reg = new RegExp('\\$'+index, 'g');
                target = target.replace(reg,value);
            });
            // 解析应用的变量
            return dc.resolvePath(target);
        }catch (e){}
    }

};