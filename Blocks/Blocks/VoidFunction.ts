import type { IExecutable } from "../Interfaces/IExecutable.ts";
import type { IContainer } from "../Interfaces/IContainer.ts";
import type { INamed } from "../Interfaces/INamed.ts";
import type { IEvaluable } from "../Interfaces/IEvaluable.ts"
import { Variable } from "./Variable.ts";
import { Scope } from "../Program/Scope.ts";
import { IdGenerator } from "../Program/IdGenerator.ts"; 
import { VoidReturnException } from "../Program/VoidReturnException.ts";
import { ReturnException } from "../Program/ReturnException.ts";

export class VoidFunction implements IExecutable, IContainer, INamed {
    
    readonly #scope: Scope;
    get scope(): Readonly<Scope> {
        return Object.freeze(this.#scope);
    }

    readonly #id: number;
    get id(): number {
        return this.#id;
    }

    readonly #name: string;
    get name(): string {
        return this.#name;
    }

    blocks: IExecutable[] = [];

    #blocksById: Map<number, IExecutable> = new Map();
    get blocksById(): ReadonlyMap<number, IExecutable> {
        return this.#blocksById;
    }

    #params: Variable<unknown>[] = [];

    addParam(param: Variable<unknown>): void {
        this.#params.push(param);
        this.#scope.set(param);
    }

    deleteParam(id: number): Variable<unknown> | undefined;
    deleteParam(name: string): Variable<unknown> | undefined;
    deleteParam(key: number | string): Variable<unknown> | undefined {

        const index = this.#params.findIndex(param => 
            param.id === key || param.name === key
        );
        
        if (index === -1) {
            return undefined;
        }
        
        const deletedParam = this.#params.splice(index, 1)[0];
        if (deletedParam) {
            this.#scope.delete(deletedParam.id);
        }
        return deletedParam;

    }

    setArgs(args: IEvaluable<unknown>[]): void {

        if (args.length != this.#params.length) {
            throw new RangeError(
                "Wrong number of args.",
                {
                    cause: {
                        comment: `Expected ${this.#params.length} args, got ${args.length}.`,
                        paramsLength: this.#params.length,
                        argsLength: args.length
                    }
                }
            );
        }
        
        for (let i = 0; i < this.#params.length; i++) {

            let param = this.#params.at(i);
            let arg = args.at(i);

            if (param && arg) {
                const paramValue = param.evaluate();
                const argValue = arg.evaluate();
                
                if (typeof argValue !== typeof paramValue) {
                    throw new TypeError(
                        "Wrong argument type.",
                        {
                            cause: {
                                comment: `Param ${i} expects ${typeof paramValue}, got ${typeof argValue} ` +
                                    `(value: ${JSON.stringify(argValue)})`,
                                paramValueType: typeof paramValue,
                                argValuType: typeof argValue
                            }
                        }
                    );
                }
                param.change(argValue);
            }
        }
    }

    constructor(name: string, parent: Scope) {
        this.#id = IdGenerator.generate();
        this.#name = name;
        this.#scope = new Scope(parent);
    }

    execute(): void {
        for (const block of this.blocks) {
            try {
                block.execute();
            }
            catch(exception) {
                if (exception instanceof VoidReturnException) {
                    return;
                }
                if (exception instanceof ReturnException) {
                    throw new TypeError(
                        "Wrong return.",
                        {
                            cause: `Return type should be void.`
                        }
                    );
                }
                throw exception;
            }
        }
    }

    addBlock(block: IExecutable, index?: number): void {

        this.deleteBlock(block.id);

        if (!index) {
            this.blocks.push(block);
        } else if (index < 0 || index > this.blocks.length) {
            throw new RangeError(
                "Timeout Error", 
                {
                    cause: {
                        comment: "Index out of range",
                        index: index
                    }
                }
            );
        } else {
            this.blocks.splice(index, 0, block);
        }

        if (this.blocks.find(b => b.id === block.id)) {
            this.#blocksById.set(block.id, block);
        }
        
    }
    
    deleteBlock(id: number): IExecutable | undefined {

        if (!this.#blocksById.has(id)) {
            return undefined;
        }

        const block = this.#blocksById.get(id)!;
        this.blocks = this.blocks.filter(b => b.id !== id);
        this.#blocksById.delete(id);
        return block;
        
    }

}