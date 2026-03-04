import type { Scope } from "../Program/Scope.ts";
import type { IBlock } from "./IBlock.js";

export interface IExecutable extends IBlock {
    readonly scope: Readonly<Scope>;
    execute(): void;
}
