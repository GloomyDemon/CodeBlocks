import { IdGenerator } from "../../../Program/IdGenerator.js";
export class ArrayLength {
    constructor(array) {
        this.array = array;
        this.valueType = 'number';
        this.id = IdGenerator.generate();
    }
    evaluate() {
        return this.array.length();
    }
}
