"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
const tslib_1 = require("tslib");
const isEmpty_1 = tslib_1.__importDefault(require("lodash/isEmpty"));
const forEach_1 = tslib_1.__importDefault(require("lodash/forEach"));
const isNumber_1 = tslib_1.__importDefault(require("lodash/isNumber"));
function newNode(name) {
    return {
        name,
        incoming: Object.create(null),
        outgoing: Object.create(null)
    };
}
class Graph {
    constructor() {
        this._nodes = Object.create(null);
    }
    getLeafList() {
        const ret = [];
        (0, forEach_1.default)(this._nodes, (entry) => {
            if ((0, isEmpty_1.default)(entry.outgoing)) {
                ret.push(entry.name);
            }
        });
        return ret;
    }
    insertEdge(from, to) {
        const fromNode = this.lookupOrInsertNode(from);
        const toNode = this.lookupOrInsertNode(to);
        if ((0, isNumber_1.default)(fromNode.outgoing[to])) {
            fromNode.outgoing[to]++;
        }
        else {
            fromNode.outgoing[to] = 1;
        }
        if ((0, isNumber_1.default)(toNode.incoming[from])) {
            toNode.incoming[from]++;
        }
        else {
            toNode.incoming[from] = 1;
        }
    }
    removeNode(name) {
        const key = name;
        delete this._nodes[key];
        (0, forEach_1.default)(this._nodes, (entry) => {
            delete entry.outgoing[key];
            delete entry.incoming[key];
        });
    }
    lookupOrInsertNode(name) {
        const key = name;
        let node = this._nodes[key];
        if (!node) {
            node = newNode(name);
            this._nodes[key] = node;
        }
        return node;
    }
    lookup(data) {
        return this._nodes[data];
    }
    isEmpty() {
        if (Object.keys(this._nodes).length > 0) {
            return false;
        }
        return true;
    }
    toString() {
        let data = [];
        (0, forEach_1.default)(this._nodes, (value, key) => {
            data.push(`${key}, (incoming)[${Object.keys(value.incoming).join(', ')}], (outgoing)[${Object.keys(value.outgoing).join(',')}]`);
        });
        return data.join('\n');
    }
}
exports.Graph = Graph;
//# sourceMappingURL=graph.js.map