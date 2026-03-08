export class IdGenerator {

    static #nextId = 0;

    static generate(): number {
        return this.#nextId++;
    }

    static reset(): void {
        this.#nextId = 0;
    }

}