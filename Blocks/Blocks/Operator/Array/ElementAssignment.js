import { IdGenerator } from "../../../Program/IdGenerator.js";
export class ElementAssignment {
    constructor(array, index, source, scope) {
        this.array = array;
        this.index = index;
        this.source = source;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        const indexValue = this.index.evaluate();
        const nextValue = this.source.evaluate();
        this.array.setElement(indexValue, nextValue);
    }
}
