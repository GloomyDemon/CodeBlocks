import { IdGenerator } from "../../../Program/IdGenerator.js";
import { ArrayVariable } from "../../ArrayVariable.js";
export class ScopedElementAccess {
    constructor(arrayName, index, scope, elementType = 'number') {
        this.arrayName = arrayName;
        this.index = index;
        this.scope = scope;
        this.id = IdGenerator.generate();
        this.valueType = elementType;
    }
    evaluate() {
        const resolved = this.scope.get(this.arrayName);
        if (!resolved || !(resolved instanceof ArrayVariable)) {
            throw new Error(`Array "${this.arrayName}" is not declared.`);
        }
        return resolved.getElement(this.index.evaluate());
    }
}
