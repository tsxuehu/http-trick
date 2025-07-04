/**
 * Created by tsxuehu on 8/3/17.
 */
module.exports = class LogService {

  start() {

  }

  error(msg, error) {
    console.error(msg, error)
  }

  log(msg) {
    console.log(msg)
  }

  info(msg) {
    console.log(msg)
  }
}
