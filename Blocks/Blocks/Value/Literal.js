import { IdGenerator } from "../../Program/IdGenerator.js";
export class Literal {
    constructor(value, valueType) {
        this.value = value;
        this.id = IdGenerator.generate();
        this.valueType = valueType;
    }
    evaluate() {
        return this.value;
    }
}
