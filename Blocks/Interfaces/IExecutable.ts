import type { Scope } from "../Program/Scope.js";
import type { IBlock } from "./IBlock.js";

export interface IExecutable extends IBlock {
    readonly scope: Readonly<Scope>;
    execute(): void;
}
