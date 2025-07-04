import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'
import isNumber from 'lodash/isNumber'

export interface Node {
    name: string
    incoming: { [key: string]: number }
    outgoing: { [key: string]: number }
}

function newNode(name: string): Node {
    return {
        name,
        incoming: Object.create(null),
        outgoing: Object.create(null)
    }
}

export class Graph {
    private _nodes: { [key: string]: Node } = Object.create(null)

    constructor() {
        // empty
    }

    getLeafList(): string[] {
        const ret: string[] = []
        forEach(this._nodes, (entry) => {
            if (isEmpty(entry.outgoing)) {
                ret.push(entry.name)
            }
        })
        return ret
    }

    insertEdge(from: string, to: string): void {
        const fromNode = this.lookupOrInsertNode(from)
        const toNode = this.lookupOrInsertNode(to)
        if (isNumber(fromNode.outgoing[to])) {
            fromNode.outgoing[to]++
        } else {
            fromNode.outgoing[to] = 1
        }

        if (isNumber(toNode.incoming[from])) {
            toNode.incoming[from]++
        } else {
            toNode.incoming[from] = 1
        }
    }

    removeNode(name: string): void {
        const key = name
        delete this._nodes[key]
        forEach(this._nodes, (entry) => {
            delete entry.outgoing[key]
            delete entry.incoming[key]
        })
    }

    lookupOrInsertNode(name: string): Node {
        const key = name
        let node = this._nodes[key]

        if (!node) {
            node = newNode(name)
            this._nodes[key] = node
        }

        return node
    }

    lookup(data: string): Node {
        return this._nodes[data]
    }

    isEmpty(): boolean {
        if (Object.keys(this._nodes).length > 0) {
            return false
        }
        return true
    }

    toString(): string {
        let data: string[] = []
        forEach(this._nodes, (value, key) => {
            data.push(
                `${key}, (incoming)[${Object.keys(value.incoming).join(', ')}], (outgoing)[${Object.keys(value.outgoing).join(
                    ','
                )}]`
            )
        })
        return data.join('\n')
    }
}
