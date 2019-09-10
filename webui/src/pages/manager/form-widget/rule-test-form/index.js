let instance;

export function test({rule, actionIndex}) {

  instance.testRule({
    match: rule.match,
    method: rule.method,
    target: actionIndex > -1 ? rule.actionList[actionIndex].data.target : ''
  })
}

export function setInstance(ins) {
  instance = ins;
}
