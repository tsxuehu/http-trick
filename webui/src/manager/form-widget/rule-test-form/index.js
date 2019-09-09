import Vue from 'vue';
import RuleTestForm from './Index.vue';
let RuleTestFormConstructor = Vue.extend(RuleTestForm);

let instance;
let inited = false;
export function test({rule, actionIndex}) {
  if (!inited) {
    inited = true;
    instance = new RuleTestFormConstructor({});
    instance.$mount();
    document.body.appendChild(instance.$el);
  }
  instance.testRule({
    match: rule.match,
    method: rule.method,
    target: actionIndex > -1 ? rule.actionList[actionIndex].data.target : ''
  })
}
