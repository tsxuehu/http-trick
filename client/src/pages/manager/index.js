import "regenerator-runtime/runtime";
// element-ui

import Vue from 'vue'
import ElementUI from 'element-ui';

import App from './App'
import router from './router'
import store from './store/index'

import 'element-ui/lib/theme-chalk/index.css';
import './iconfont.css';
import './index.scss';

Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
document.addEventListener('keydown', function (e) {
  if((event.ctrlKey || event.metaKey) && event.which == 83) {
    // Save Function
    event.preventDefault();
    return false;
  }
},true);


