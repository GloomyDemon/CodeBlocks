import type { IBlock } from "../Interfaces/IBlock.ts";

export class Container<T extends IBlock> {
    #blocks: T[] = [];
    get blocks(): readonly T[]{
        return this.#blocks;
    }
    
    #blocksById: Map<number, T> = new Map();
    get blocksById(): ReadonlyMap<number, T> {
        return this.#blocksById;
    }

    addBlock(block: T, index?: number): void {
        
        this.deleteBlock(block.id);

        if (index === undefined) {
            this.#blocks.push(block);
        } else if (index < 0 || index > this.#blocks.length) {
            throw new RangeError(
                "Timeout Error", 
                {
                    cause: {
                        comment: "Index out of range",
                        index: index
                    }
                }
            );
        } else {
            this.#blocks.splice(index, 0, block);
        }

        if (this.#blocks.find(b => b.id === block.id)) {
            this.#blocksById.set(block.id, block);
        }
        
    }
    
    deleteBlock(id: number): T | undefined {

        if (!this.#blocksById.has(id)) {
            return undefined;
        }

        const block = this.#blocksById.get(id)!;
        this.#blocks = this.#blocks.filter(b => b.id !== id);
        this.#blocksById.delete(id);
        return block;
        
    }

}