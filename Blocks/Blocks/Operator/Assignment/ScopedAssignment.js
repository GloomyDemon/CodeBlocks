import { IdGenerator } from "../../../Program/IdGenerator.js";
import { Variable } from "../../Variable.js";
export class ScopedAssignment {
    constructor(targetName, source, scope) {
        this.targetName = targetName;
        this.source = source;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        const resolved = this.scope.get(this.targetName);
        if (!resolved || !(resolved instanceof Variable)) {
            throw new Error(`Variable "${this.targetName}" is not declared.`);
        }
        resolved.change(this.source.evaluate());
    }
}
