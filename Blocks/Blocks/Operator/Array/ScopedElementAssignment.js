import { IdGenerator } from "../../../Program/IdGenerator.js";
import { ArrayVariable } from "../../ArrayVariable.js";
export class ScopedElementAssignment {
    constructor(arrayName, index, source, scope) {
        this.arrayName = arrayName;
        this.index = index;
        this.source = source;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        const resolved = this.scope.get(this.arrayName);
        if (!resolved || !(resolved instanceof ArrayVariable)) {
            throw new Error(`Array "${this.arrayName}" is not declared.`);
        }
        resolved.setElement(this.index.evaluate(), this.source.evaluate());
    }
}
