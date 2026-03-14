import { IdGenerator } from "../../Program/IdGenerator.js";
import { Variable } from "../Variable.js";
export class VariableReference {
    constructor(name, scope, valueType = 'number') {
        this.name = name;
        this.scope = scope;
        this.id = IdGenerator.generate();
        this.valueType = valueType;
    }
    evaluate() {
        const resolved = this.scope.get(this.name);
        if (!resolved || !(resolved instanceof Variable)) {
            throw new Error(`Variable "${this.name}" is not declared.`);
        }
        if (resolved.valueType !== this.valueType) {
            throw new Error(`Variable "${this.name}" type mismatch.`);
        }
        return resolved.evaluate();
    }
}
