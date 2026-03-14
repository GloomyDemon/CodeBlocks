import type { INamed } from "../Interfaces/INamed.js";

export class Scope {

    readonly parent: Scope | undefined;

    #dataName: Map<string, INamed> = new Map();
    #dataId: Map<number, INamed> = new Map();

    constructor(parent?: Scope) {
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
        throw new TypeError(`Wrong key type. Key type is: ${typeof key}, expected string or number.`)
    }

    set(block: INamed) {
        this.#dataName.set(block.name, block);
        this.#dataId.set(block.id, block);
    }

    values(): readonly INamed[] {
        return Array.from(this.#dataName.values());
    }
    
    delete(id: number): INamed | undefined;
    delete(name: string): INamed | undefined;
    delete(key: number | string): INamed | undefined {

        if (typeof key === 'string') {

            if (this.#dataName.has(key)) {
                const block = this.#dataName.get(key)!;
                this.#dataName.delete(key);
                this.#dataId.delete(block.id);
                return block;
            } else if (this.parent) {
                return this.parent.delete(key);
            }
            return undefined;

        } else if (typeof key === 'number') {

            if (this.#dataId.has(key)) {
                const block = this.#dataId.get(key)!;
                this.#dataId.delete(key);
                this.#dataName.delete(block.name);
                return block;
            } else if (this.parent) {
                return this.parent.delete(key);
            }
            return undefined;

        }

        return undefined;

    }

}
