import { IdGenerator } from "../../Program/IdGenerator.js";
export class Print {
    constructor(value, program, scope) {
        this.value = value;
        this.program = program;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        this.program.writeOutput(this.value.evaluate(), this);
    }
}
