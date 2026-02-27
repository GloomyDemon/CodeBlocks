export class VoidFunc {
    #id;
    #name;
    #blocks = [];
    #blocksById = new Map();
    get blocksById() {
        return this.#blocksById;
    }
    get blocks() {
        return this.#blocks;
    }
    constructor(id, name) {
        this.#id = id;
        this.#name = name;
    }
    execute() {
        this.#blocks.forEach(block => block.execute());
    }
    addBlock(block, index = -1) {
        if (this.#blocksById.has(block.id))
            return;
        if (index === -1) {
            this.#blocks.push(block);
        }
        else {
            this.#blocks.splice(index, 0, block);
        }
        this.#blocksById.set(block.id, block);
    }
    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    deleteBlock(key) {
        if (typeof key == 'number') {
            if (key < 0 || key >= this.#blocks.length) {
                return undefined;
            }
            const block = this.#blocks.splice(key, 1)[0];
            if (block) {
                this.#blocksById.delete(block.id);
            }
            return block;
        }
        else if (typeof key == 'string') {
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
//# sourceMappingURL=VoidFunc.js.map