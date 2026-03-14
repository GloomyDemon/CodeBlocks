import type { Container } from "../Program/Container.js";
import type { IBlock } from "./IBlock.js";
import type { IExecutable } from "./IExecutable.js";

export interface IContainer extends IBlock {

    blocks: Readonly<Container<IExecutable>>;

}
