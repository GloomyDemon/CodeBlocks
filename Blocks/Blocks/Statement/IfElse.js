import { Container } from "../../Program/Container.js";
import { If } from "./If.js";
export class IfElse extends If {
    constructor() {
        super(...arguments);
        this.elseBlocks = new Container;
    }
    execute() {
        if (this.check()) {
            this.blocks.blocks.forEach(block => block.execute());
        }
        else {
            this.elseBlocks.blocks.forEach(block => block.execute());
        }
    }
}
