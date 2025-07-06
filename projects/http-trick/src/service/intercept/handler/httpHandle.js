const zlib = require("zlib");
const parseUrl = require("../../../utils/parseUrl");
const log = require("../../../utils/log");
const requestResponseUtils = require("../../../utils/requestResponseUtils");
const ServiceRegistry = require("../../../service/index");
const Action = require("../action/index");
const getClientIp = require("../../../utils/getClientIp");
const _ = require("lodash");
const cookie = require("cookie");
const sendSpecificToClient = require("../../../utils/sendSpecificToClient");
// request session id seed
let httpHandle;
module.exports = class HttpHandle {

  static getInstance() {
    if (!httpHandle) {
      httpHandle = new HttpHandle();
    }
    return httpHandle;
  }

  constructor() {
    this.ruleService = ServiceRegistry.getRuleService();
    this.logService = ServiceRegistry.getLogService();
    this.profileService = ServiceRegistry.getProfileService();
    this.appInfoService = ServiceRegistry.getAppInfoService();
    this.filterService = ServiceRegistry.getFilterService();
    this.httpTrafficService = ServiceRegistry.getHttpTrafficService();
  }

};
