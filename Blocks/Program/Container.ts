import type { IBlock } from "../Interfaces/IBlock.js";

export class Container<T extends IBlock> {
    #listeners: Set<(event: { type: 'add' | 'remove'; block: T; index: number }) => void> = new Set();

    subscribe(listener: (event: { type: 'add' | 'remove'; block: T; index: number }) => void): () => void {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }

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
            this.emit('add', block, this.#blocks.length - 1);
        } else if (index < 0 || index > this.#blocks.length) {
            const error = new RangeError("Timeout Error");
            (error as Error & { cause?: unknown }).cause = {
                comment: "Index out of range",
                index
            };
            throw error;
        } else {
            this.#blocks.splice(index, 0, block);
            this.emit('add', block, index);
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
        const index = this.#blocks.findIndex(b => b.id === id);
        this.#blocks = this.#blocks.filter(b => b.id !== id);
        this.#blocksById.delete(id);
        if (index >= 0) {
            this.emit('remove', block, index);
        }
        return block;
        
    }

    private emit(type: 'add' | 'remove', block: T, index: number): void {
        this.#listeners.forEach(listener => listener({ type, block, index }));
    }

}