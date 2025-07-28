import {Container} from "@spring4js/container-node";

let _container: Container

export function setContainer(container: Container) {
    _container = container;
}

export function getContainer(): Container {
    return _container;
}
