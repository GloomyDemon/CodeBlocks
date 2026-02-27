export class Variable {
    #id;
    #name;
    #value;
    constructor(id, name, value) {
        this.#id = id;
        this.#name = name;
        this.#value = value;
    }
    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    evaluate() {
        return this.#value;
    }
    change(value) {
        this.#value = value;
    }
}
//# sourceMappingURL=Variable.js.map