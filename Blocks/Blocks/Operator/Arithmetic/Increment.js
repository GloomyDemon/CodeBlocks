import { IdGenerator } from "../../../Program/IdGenerator.js";
export class Increment {
    constructor(target) {
        this.target = target;
        this.valueType = 'number';
        this.id = IdGenerator.generate();
    }
    evaluate() {
        const nextValue = this.target.evaluate() + 1;
        this.target.change(nextValue);
        return nextValue;
    }
}
