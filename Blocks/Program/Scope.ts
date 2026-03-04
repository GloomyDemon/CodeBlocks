import type { INamed } from "../Interfaces/INamed.ts";

export class Scope {

    readonly parent: Scope;

    #dataName: Map<string, INamed> = new Map();
    #dataId: Map<number, INamed> = new Map();

    constructor(parent: Scope) {
        this.parent = parent;
    }

    get(id: number): INamed|undefined;

    get(name: string): INamed|undefined;

    get(key: number | string): INamed|undefined {
        if (typeof key == 'string') {
        
            let data = this.#dataName.get(key);
            if (!data && this.parent) {
                return this.parent.get(key)
            }
            return data;

        }
        else if (typeof key == "number") {

            let data = this.#dataId.get(key);
            if (!data && this.parent) {
                return this.parent.get(key)
            }
            return data;
            
        }
        return undefined;
    }

    set(block: INamed) {
        this.#dataName.set(block.name, block);
        this.#dataId.set(block.id, block);
    }
    
}
