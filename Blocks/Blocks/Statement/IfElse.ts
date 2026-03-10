import type { IExecutable } from "../../Interfaces/IExecutable.ts";
import { Container } from "../../Program/Container.ts";
import { If } from "./If.ts";

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