import type { IExecutable } from "../Interfaces/IExecutable.js";
import type { IContainer } from "../Interfaces/IContainer.js";
import type { INamed } from "../Interfaces/INamed.js";

export class VoidFunction implements IExecutable, IContainer, INamed {

    readonly #id: string;
    get id(): string {
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

    #blocksById: Map<string, IExecutable> = new Map();
    get blocksById(): ReadonlyMap<string, IExecutable> {
        return this.#blocksById;
    }

    constructor(id: string, name: string) {
        this.#id = id;
        this.#name = name;
    }

    execute(): void {
        this.#blocks.forEach(block => block.execute());
    }

    addBlock(block: IExecutable, index: number = -1): void {
        if (this.#blocksById.has(block.id)) return;

        if (index === -1) {
            this.#blocks.push(block);
        } else {
            this.#blocks.splice(index, 0, block);
        }
        this.#blocksById.set(block.id, block);
    }

    deleteBlock(index: number): IExecutable | undefined;
    deleteBlock(id: string): IExecutable | undefined;

    deleteBlock(key: number | string): IExecutable | undefined {
        if (typeof key == 'number') {
            if (key < 0 || key >= this.#blocks.length) {
                return undefined;
            }
            const block = this.#blocks.splice(key, 1)[0];
            if (block) {
                this.#blocksById.delete(block.id);
            }
            return block;
        } else if (typeof key == 'string') {
            const block = this.#blocksById.get(key);
            if (block) {
                this.#blocks = this.#blocks.filter(b => b.id !== key);
                this.#blocksById.delete(key);
            }
            return block;
        }
        return undefined;
    }
}