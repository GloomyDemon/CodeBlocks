import type { IExecutable } from "../Interfaces/IExecutable.js";
import { Container } from "./Container.js";
import { Scope } from "./Scope.js";

export type ProgramDiagnostic = {
    blockId: number;
    severity: 'warning' | 'error';
    message: string;
};

export class Program {
    #blocks: Container<IExecutable> = new Container<IExecutable>();
    get blocks(): Readonly<Container<IExecutable>> {
        return this.#blocks;
    }

    #scope: Scope = new Scope();
    get scope(): Readonly<Scope> {
        return Object.freeze(this.#scope);
    }

    #output: string[] = [];
    get output(): readonly string[] {
        return this.#output;
    }

    #diagnostics: ProgramDiagnostic[] = [];
    get diagnostics(): readonly ProgramDiagnostic[] {
        return this.#diagnostics;
    }

    #executedBlockIds: number[] = [];
    get executedBlockIds(): readonly number[] {
        return this.#executedBlockIds;
    }

    constructor(private readonly maxOutput: number = 1000) {}

    execute(): void {
        for (const block of this.#blocks.blocks) {
            try {
                this.#executedBlockIds.push(block.id);
                block.execute();
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                this.#diagnostics.push({ blockId: block.id, severity: 'error', message });
            }
        }
    }

    writeOutput(value: unknown, block?: IExecutable): void {
        if (this.#output.length >= this.maxOutput) {
            if (block) {
                this.#diagnostics.push({
                    blockId: block.id,
                    severity: 'error',
                    message: 'Output limit exceeded.'
                });
            }
            return;
        }
        this.#output.push(String(value));
    }
}
