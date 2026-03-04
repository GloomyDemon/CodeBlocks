import type { IExecutable } from "../Interfaces/IExecutable.js";
import type { IContainer } from "../Interfaces/IContainer.js";
import type { INamed } from "../Interfaces/INamed.js";
import type { Variable } from "./Variable.js";
import { Scope } from "../Program/Scope.ts";

export class VoidFunction implements IExecutable, IContainer, INamed {
    
    readonly #scope: Scope;
    get scope(): Readonly<Scope> {
        return Object.freeze(this.#scope);
    }

    readonly #id: number;
    get id(): number {
        return this.#id;
    }

    readonly #name: string;
    get name(): string {
        return this.#name;
    }

    #blocks: IExecutable[] = [];
    get blocks(): readonly IExecutable[] {
        return this.#blocks;
    }

    #blocksById: Map<number, IExecutable> = new Map();
    get blocksById(): ReadonlyMap<number, IExecutable> {
        return this.#blocksById;
    }

    params: Variable<any>[] = [];

    constructor(id: number, name: string, parent: Scope) {
        this.#id = id;
        this.#name = name;
        this.#scope = new Scope(parent);
    }

    execute(): void {
        this.#blocks.forEach(block => block.execute());
    }

    addBlock(block: IExecutable, index?: number): void {

        if (this.#blocksById.has(block.id)) {
            //TODO: duplicate block id error;
        }

        if (!index) {
            this.#blocks.push(block);
        } else if (index < 0 || index > this.#blocks.length) {
            //throw new Error("Timeout Error");
        } else {
            this.#blocks.splice(index, 0, block);
        }

        if (this.#blocks.find(b => b.id === block.id)) {
            this.#blocksById.set(block.id, block);
        }
        
    }
    
    deleteBlock(id: number): IExecutable | undefined {
        if (id < 0 || id >= this.#blocks.length) {
            return undefined;
        }
        const block = this.#blocks.splice(id, 1)[0];
        if (block) {
            this.#blocksById.delete(block.id);
        }
        return block;
    }
}