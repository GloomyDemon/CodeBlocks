import type { IExecutable } from "../../Interfaces/IExecutable.js";
import { Container } from "../../Program/Container.js";
import { If } from "./If.js";

export class IfElse extends If{

    elseBlocks: Container<IExecutable> = new Container<IExecutable>;

    override execute(): void {
        if (this.check()) {
            this.blocks.blocks.forEach(block => block.execute());
        } else {
            this.elseBlocks.blocks.forEach(block => block.execute());
        }
    }

}