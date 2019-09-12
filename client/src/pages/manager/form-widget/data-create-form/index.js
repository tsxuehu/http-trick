let instance;

export function setEventHandle(eventHandlerMap) {
  instance.setEventHandle(eventHandlerMap);
}

export function create() {
  instance.createDataFile();
}

export function setInstance(ins) {
  instance = ins;
}
