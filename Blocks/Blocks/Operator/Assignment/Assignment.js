import { IdGenerator } from "../../../Program/IdGenerator.js";
export class Assignment {
    constructor(target, source, scope) {
        this.target = target;
        this.source = source;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        this.target.change(this.source.evaluate());
    }
}
