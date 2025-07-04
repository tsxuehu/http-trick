import {Container} from "di/container";

let _container: Container

export function setContainer(container: Container) {
    _container = container;
}

export function getContainer(): Container {
    return _container;
}
