import { IdGenerator } from "../../Program/IdGenerator.js";
export class Ternary {
    constructor(condition, whenTrue, whenFalse) {
        this.condition = condition;
        this.whenTrue = whenTrue;
        this.whenFalse = whenFalse;
        this.id = IdGenerator.generate();
        this.valueType = whenTrue.valueType;
    }
    evaluate() {
        return this.condition.evaluate() ? this.whenTrue.evaluate() : this.whenFalse.evaluate();
    }
}
