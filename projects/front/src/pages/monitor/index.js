import "regenerator-runtime/runtime";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Vue from 'vue'
import App from './App'
import store from './store/index'

import './index.scss'

Vue.use(ElementUI);

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});
