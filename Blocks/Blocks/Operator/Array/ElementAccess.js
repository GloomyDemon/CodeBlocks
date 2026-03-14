import { IdGenerator } from "../../../Program/IdGenerator.js";
export class ElementAccess {
    constructor(array, index) {
        this.array = array;
        this.index = index;
        this.id = IdGenerator.generate();
        this.valueType = array.elementType;
    }
    evaluate() {
        const indexValue = this.index.evaluate();
        return this.array.getElement(indexValue);
    }
}
