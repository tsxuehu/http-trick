webpackJsonp([2],{11:function(e,n){},162:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=t(315),o=t.n(s),i=t(316),a=t.n(i),r=t(318),c=t.n(r),d=t(317),l=t.n(d),u=t(6),p=t.n(u),f=null,h=1;n.default={components:{Card:o.a,List:a.a,Textinput:c.a,Message:l.a},data:function(){return{isDataCenter:!0,sessions:[],currentSessionLocalId:1,filterKey:""}},methods:{search:function(e){this.filterKey=e},selectSession:function(e){this.currentSessionLocalId=e,this.currentSession.hasNewMsg=!1},comingMsg:function(e){e.localId!=this.currentSession.localId&&(e.hasNewMsg=!0)},openSession:function(e){var n=h++;this.currentSessionLocalId=n,this.sessions.push({localId:n,sessionId:"",hasNewMsg:!1,urlPattern:e,messages:[{content:"等待服务器分配调试会话ID",date:new Date,type:"cmd"}]}),f.emit("opensession",e)},closeSession:function(e){var n=p.a.findIndex(this.sessions,function(n){return n.localId==e}),t=this.sessions[n].sessionId;this.sessions.splice(n,1),f.emit("closesession",t),this.currentSessionLocalId==e&&(n>0&&n--,this.currentSessionLocalId=this.sessions[n]&&this.sessions[n].localId)},assignedSessionId:function(e,n){var t=p.a.find(this.sessions,function(n){return n.urlPattern==e});t&&(t.sessionId=n,this.comingMsg(t),t.messages.push({content:"分配到调试会话ID: "+n,date:new Date,type:"cmd"}))},connectionBuild:function(e){var n=p.a.find(this.sessions,function(n){return n.sessionId==e});n&&(this.comingMsg(n),n.messages.push({content:"和目标页面建立调试连接",date:new Date,type:"cmd"}))},sendMsg:function(e){this.currentSession&&(this.currentSession.messages.push({content:e,date:new Date,type:"me"}),f.emit("debuggermsg",this.currentSession.sessionId,e))},recieve:function(e,n){var t=p.a.find(this.sessions,function(n){return n.sessionId==e});t&&(this.comingMsg(t),t.messages.push({content:n,date:new Date,type:"page"}))},connectionBreak:function(e){var n=p.a.find(this.sessions,function(n){return n.sessionId==e});n&&(this.comingMsg(n),n.messages.push({content:"页面终止调试会话，等待新的页面接入调试会话",date:new Date,type:"cmd"}))}},computed:{currentSession:function(){var e=this;return p.a.find(this.sessions,function(n){return n.localId==e.currentSessionLocalId})}},created:function(){window.io&&(f=io("/wsmock"),f.on("assignedsessionid",this.assignedSessionId),f.on("page-msg",this.recieve),f.on("page-connected",this.connectionBuild),f.on("page-closed",this.connectionBreak))}}},163:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={methods:{onKeyup:function(e){this.$dc.search(e.target.value)},requestAddSession:function(){var e=this;this.$prompt("请输入要拦截的WebSocket url特征","新建调试会话",{confirmButtonText:"新建会话",cancelButtonText:"取消"}).then(function(n){var t=n.value;e.$dc.openSession(t)})}}}},164:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={}},165:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=t(1);n.default={methods:{showTime:function(e,n){return"cmd"==e.type||0==n||e.date.getTime()-this.$dc.currentSession.messages[n-1].date.getTime()>3e5}},filters:{time:function(e){return"string"==typeof e&&(e=new Date(e)),e.getHours()+":"+e.getMinutes()}},directives:{"scroll-bottom":{componentUpdated:function(e){s.default.nextTick(function(){e.scrollTop=e.scrollHeight-e.clientHeight})}}}}},166:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={data:function(){return{content:""}},methods:{onKeyup:function(e){e.ctrlKey&&13===e.keyCode&&this.content.length&&(this.$dc.sendMsg(this.content),this.content="")}}}},175:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=t(1),o=t(98),i=t.n(o),a=t(22),r=t.n(a),c=t(21),d=t.n(c),l=t(11);t.n(l);s.default.use(d.a),s.default.use(r.a),new s.default({el:"#app",render:function(e){return e(i.a)}})},217:function(e,n,t){n=e.exports=t(3)(),n.push([e.i,"\n.avatar-img {\n  width: 30px;\n  height: 30px;\n  display: inline-block;\n  border-radius: 15px;\n  line-height: 30px;\n  text-align: center;\n  background-color: #808080;\n  -webkit-transform: rotate(20deg);\n          transform: rotate(20deg);\n  color: #fff;\n}\n#app {\n  margin: 20px auto;\n  width: 800px;\n  height: 600px;\n\n  overflow: hidden;\n  border-radius: 3px;\n}\n#app .sidebar, #app .main {\n  height: 100%;\n}\n#app .sidebar {\n  float: left;\n  width: 200px;\n  color: #f4f4f4;\n  background-color: #2e3238;\n}\n#app .main {\n  position: relative;\n  overflow: hidden;\n  background-color: #eee;\n}\n* {\n  box-sizing: border-box;\n}\n*:before, *:after {\n  box-sizing: inherit;\n}\nbody, html {\n  height: 100%;\n  overflow: hidden;\n}\nbody, ul {\n  margin: 0;\n  padding: 0;\n}\nbody {\n  color: #4d4d4d;\n  font: 14px/1.4em 'Helvetica Neue', Helvetica, 'Microsoft Yahei', Arial, sans-serif;\n  background-size: cover;\n  font-smoothing: antialiased;\n}\nul {\n  list-style: none;\n}\n\n",""])},221:function(e,n,t){n=e.exports=t(3)(),n.push([e.i,"\n.card[data-v-216ea560] {\n  padding: 12px;\n  border-bottom: solid 1px #24272C;\n}\n.card .header[data-v-216ea560] {\n  line-height: 45px;\n  height: 45px;\n}\n.card .header .name[data-v-216ea560] {\n  display: inline-block;\n  margin: 0 0 0 5px;\n  font-size: 16px;\n  vertical-align: top;\n}\n.card .header .add[data-v-216ea560] {\n  line-height: 1;\n  display: inline-block;\n  font-weight: bold;\n  font-size: 30px;\n  height: 30px;\n  vertical-align: top;\n  margin-top:3px;\n  margin-left: 5px;\n  cursor: pointer;\n}\n.card .search-container[data-v-216ea560] {\n  margin-top: 10px;\n}\n.card .search[data-v-216ea560] {\n  padding: 0 10px;\n  width: 100%;\n  font-size: 12px;\n  color: #fff;\n  height: 30px;\n  line-height: 30px;\n  border: solid 1px #3a3a3a;\n  border-radius: 4px;\n  outline: none;\n  background-color: #26292E;\n}\n\n",""])},224:function(e,n,t){n=e.exports=t(3)(),n.push([e.i,'\n.message[data-v-46d61c67] {\n  padding: 10px 15px;\n  overflow-y: scroll;\n}\n.message li[data-v-46d61c67] {\n  margin-bottom: 15px;\n}\n.message .time[data-v-46d61c67] {\n  margin: 7px 0;\n  text-align: center;\n}\n.message .time >\nspan[data-v-46d61c67] {\n  display: inline-block;\n  padding: 0 18px;\n  font-size: 12px;\n  color: #fff;\n  border-radius: 2px;\n  background-color: #dcdcdc;\n}\n.message .avatar[data-v-46d61c67] {\n  float: left;\n  margin: 0 10px 0 0;\n}\n.message .text[data-v-46d61c67] {\n  display: inline-block;\n  position: relative;\n  padding: 0 10px;\n  max-width: calc(100% - 40px);\n  min-height: 30px;\n  line-height: 2.5;\n  font-size: 12px;\n  text-align: left;\n  word-break: break-all;\n  background-color: #fafafa;\n  border-radius: 4px\n}\n.message .text\n[data-v-46d61c67]:before {\n  content: " ";\n  position: absolute;\n  top: 9px;\n  right: 100%;\n  border: 6px solid transparent;\n  border-right-color: #fafafa;\n}\n.message .self[data-v-46d61c67] {\n  text-align: right;\n}\n.message .self .avatar[data-v-46d61c67] {\n  float: right;\n  margin: 0 0 0 10px;\n}\n.message .self .text[data-v-46d61c67] {\n  background-color: #b2e281\n}\n.message .self .text\n[data-v-46d61c67]:before {\n  right: inherit;\n  left: 100%;\n  border-right-color: transparent;\n  border-left-color: #b2e281;\n}\n.avatar-img[data-v-46d61c67] {\n  width: 30px;\n  height: 30px;\n  display: inline-block;\n  border-radius: 15px;\n  line-height: 30px;\n  text-align: center;\n  background-color: #808080;\n  -webkit-transform: rotate(20deg);\n          transform: rotate(20deg);\n  color: #fff;\n}\n.message[data-v-46d61c67] {\n  height: calc(100% - 160px);\n}\n',""])},229:function(e,n,t){n=e.exports=t(3)(),n.push([e.i,"\n.list li[data-v-722163ee] {\n  padding: 12px 15px;\n  border-bottom: 1px solid #292C33;\n  cursor: pointer;\n  -webkit-transition: background-color .1s;\n  transition: background-color .1s\n}\n.list li[data-v-722163ee]:hover {\n  background-color: rgba(255, 255, 255, 0.03)\n}\n.list li.active[data-v-722163ee] {\n  background-color: rgba(255, 255, 255, 0.1)\n}\n.list .avatar[data-v-722163ee], .list .name[data-v-722163ee] {\n  vertical-align: middle;\n}\n.list .name[data-v-722163ee] {\n  display: inline-block;\n  margin: 0 0 0 5px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  width: 120px;\n}\n.session-row[data-v-722163ee] {\n  position: relative;\n}\n.newmsg .msg-state[data-v-722163ee] {\n  position: absolute;\n  background-color: #00ff00;\n  width: 8px;\n  height: 8px;\n  border-radius: 4px;\n  top: 22px;\n  right: 25px;\n}\n.close[data-v-722163ee]{\n  position: absolute;\n  top: 18px;\n  right: 5px;\n}\n",""])},233:function(e,n,t){n=e.exports=t(3)(),n.push([e.i,'\n.text[data-v-f79a33c6] {\n    height: 160px;\n    border-top: solid 1px #ddd;\n}\n.text textarea[data-v-f79a33c6] {\n    padding: 10px;\n    height: 100%;\n    width: 100%;\n    border: none;\n    outline: none;\n    font-family: "Micrsofot Yahei";\n    resize: none;\n}\n.text[data-v-f79a33c6] {\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  left: 0;\n}\n\n',""])},315:function(e,n,t){t(355);var s=t(0)(t(163),t(327),"data-v-216ea560",null);s.options.__file="/Users/tsxuehu/workspace-mock/fe-proxy/webui/src/wsmock/components/card.vue",s.esModule&&Object.keys(s.esModule).some(function(e){return"default"!==e&&"__esModule"!==e})&&console.error("named exports are not supported in *.vue files."),s.options.functional&&console.error("[vue-loader] card.vue: functional components are not supported with templates, they should use render functions."),e.exports=s.exports},316:function(e,n,t){t(363);var s=t(0)(t(164),t(340),"data-v-722163ee",null);s.options.__file="/Users/tsxuehu/workspace-mock/fe-proxy/webui/src/wsmock/components/list.vue",s.esModule&&Object.keys(s.esModule).some(function(e){return"default"!==e&&"__esModule"!==e})&&console.error("named exports are not supported in *.vue files."),s.options.functional&&console.error("[vue-loader] list.vue: functional components are not supported with templates, they should use render functions."),e.exports=s.exports},317:function(e,n,t){t(358);var s=t(0)(t(165),t(332),"data-v-46d61c67",null);s.options.__file="/Users/tsxuehu/workspace-mock/fe-proxy/webui/src/wsmock/components/message.vue",s.esModule&&Object.keys(s.esModule).some(function(e){return"default"!==e&&"__esModule"!==e})&&console.error("named exports are not supported in *.vue files."),s.options.functional&&console.error("[vue-loader] message.vue: functional components are not supported with templates, they should use render functions."),e.exports=s.exports},318:function(e,n,t){t(367);var s=t(0)(t(166),t(347),"data-v-f79a33c6",null);s.options.__file="/Users/tsxuehu/workspace-mock/fe-proxy/webui/src/wsmock/components/textinput.vue",s.esModule&&Object.keys(s.esModule).some(function(e){return"default"!==e&&"__esModule"!==e})&&console.error("named exports are not supported in *.vue files."),s.options.functional&&console.error("[vue-loader] textinput.vue: functional components are not supported with templates, they should use render functions."),e.exports=s.exports},321:function(e,n,t){e.exports={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("div",{staticClass:"sidebar"},[t("card"),e._v(" "),t("list")],1),e._v(" "),t("div",{staticClass:"main"},[t("message"),e._v(" "),t("textinput")],1)])},staticRenderFns:[]},e.exports.render._withStripped=!0},327:function(e,n,t){e.exports={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"card"},[t("div",{staticClass:"header"},[t("p",{staticClass:"name"},[e._v("WebSocket Mock")]),e._v(" "),t("p",{staticClass:"add",on:{click:e.requestAddSession}},[e._v("+")])])])},staticRenderFns:[]},e.exports.render._withStripped=!0},332:function(e,n,t){e.exports={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{directives:[{name:"scroll-bottom",rawName:"v-scroll-bottom"}],staticClass:"message"},[e.$dc.currentSession?t("ul",e._l(e.$dc.currentSession.messages,function(n,s){return t("li",[e.showTime(n,s)?t("p",{staticClass:"time"},[t("span",[e._v(e._s(e._f("time")(n.date))+" "+e._s("cmd"==n.type?"- "+n.content:""))])]):e._e(),e._v(" "),"cmd"!=n.type?t("div",{staticClass:"main",class:{self:"me"==n.type}},[t("span",{staticClass:"avatar avatar-img"},[e._v("\n            "+e._s("me"==n.type?"我":e.$dc.currentSession.urlPattern.charAt(0))+"\n          ")]),e._v(" "),t("div",{staticClass:"text"},[e._v(e._s(n.content))])]):e._e()])})):e._e()])},staticRenderFns:[]},e.exports.render._withStripped=!0},340:function(e,n,t){e.exports={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"list"},[t("ul",e._l(e.$dc.sessions,function(n){return t("li",{staticClass:"session-row",class:{active:n.localId===e.$dc.currentSession.localId,newmsg:n.hasNewMsg},on:{click:function(t){e.$dc.selectSession(n.localId)}}},[t("span",{staticClass:"avatar avatar-img"},[e._v("\n        "+e._s(n.urlPattern.charAt(0))+"\n      ")]),e._v(" "),t("p",{staticClass:"name"},[e._v(e._s(n.urlPattern))]),e._v(" "),t("p",{staticClass:"msg-state"}),e._v(" "),t("p",{staticClass:"close",on:{click:function(t){e.$dc.closeSession(n.localId)}}},[e._v("X")])])}))])},staticRenderFns:[]},e.exports.render._withStripped=!0},347:function(e,n,t){e.exports={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"text"},[t("textarea",{directives:[{name:"model",rawName:"v-model",value:e.content,expression:"content"}],attrs:{placeholder:"按 Ctrl + Enter 发送"},domProps:{value:e.content},on:{keyup:e.onKeyup,input:function(n){n.target.composing||(e.content=n.target.value)}}})])},staticRenderFns:[]},e.exports.render._withStripped=!0},351:function(e,n,t){var s=t(217);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);t(4)("4b24296d",s,!1)},355:function(e,n,t){var s=t(221);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);t(4)("9d9b602a",s,!1)},358:function(e,n,t){var s=t(224);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);t(4)("412d83c6",s,!1)},363:function(e,n,t){var s=t(229);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);t(4)("e0789dbc",s,!1)},367:function(e,n,t){var s=t(233);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);t(4)("cbc688a8",s,!1)},98:function(e,n,t){t(351);var s=t(0)(t(162),t(321),null,null);s.options.__file="/Users/tsxuehu/workspace-mock/fe-proxy/webui/src/wsmock/App.vue",s.esModule&&Object.keys(s.esModule).some(function(e){return"default"!==e&&"__esModule"!==e})&&console.error("named exports are not supported in *.vue files."),s.options.functional&&console.error("[vue-loader] App.vue: functional components are not supported with templates, they should use render functions."),e.exports=s.exports}},[175]);
//# sourceMappingURL=wsmock.js.map