import type { Container } from "../Program/Container.ts";
import type { IBlock } from "./IBlock.ts";
import type { IExecutable } from "./IExecutable.ts";

export interface IContainer extends IBlock {

    blocks: Readonly<Container<IExecutable>>;

}
