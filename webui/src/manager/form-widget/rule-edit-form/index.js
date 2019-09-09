let instance;

export function setInstance(ins) {
  instance = ins;
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
