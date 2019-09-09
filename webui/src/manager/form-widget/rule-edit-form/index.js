import Vue from 'vue';
import RuleEditForm from './Index.vue';

let RuleEditFormConstructor = Vue.extend(RuleEditForm);

let instance;
let inited = false;

export function init() {
  if (!inited) {
    inited = true;
    instance = new RuleEditFormConstructor({
      propsData: {
        useType: 'api',
      }
    });
    instance.$mount();
    document.body.appendChild(instance.$el);
  }
}

export function editRule(data) {
  instance.editRule(data);
}

export function createRule(data) {
  instance.createRule(data);
}

export function setActionDataFileId(data) {
  instance.setActionDataFileId(data);
}
