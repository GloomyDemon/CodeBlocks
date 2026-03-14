import { IdGenerator } from "../../../Program/IdGenerator.js";
import { Addition } from "../Arithmetic/Addition.js";
export class AdditionAssignment {
    constructor(target, operand, scope) {
        this.target = target;
        this.operand = operand;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        const addOp = new Addition(this.target, this.operand);
        this.target.change(addOp.evaluate());
    }
}
