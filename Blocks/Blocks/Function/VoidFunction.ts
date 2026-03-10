import type { IExecutable } from "../../Interfaces/IExecutable.ts";
import type { IContainer } from "../../Interfaces/IContainer.ts";
import type { INamed } from "../../Interfaces/INamed.ts";
import type { IEvaluable } from "../../Interfaces/IEvaluable.ts"
import { Variable } from "../Variable.ts";
import { Scope } from "../../Program/Scope.ts";
import { IdGenerator } from "../../Program/IdGenerator.ts"; 
import { VoidReturnException } from "../../Program/VoidReturnException.ts";
import { ReturnException } from "../../Program/ReturnException.ts";
import { Container } from "../../Program/Container.ts";

export class VoidFunction implements IExecutable, IContainer, INamed {

    #blocks: Container<IExecutable> = new Container<IExecutable>();
    get blocks(): Readonly<Container<IExecutable>> {
        return this.#blocks;
    }
    
    readonly #scope: Scope = new Scope();
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

    #params: Container<Variable<unknown>> = new Container<Variable<unknown>>();
    get params(): Readonly<Container<Variable<unknown>>> {
        return this.#params;
    }

    setArgs(args: IEvaluable<unknown>[]): void {

        if (args.length != this.#params.blocks.length) {
            throw new RangeError(
                "Wrong number of args.",
                {
                    cause: {
                        comment: `Expected ${this.#params.blocks.length} args, got ${args.length}.`,
                        paramsLength: this.#params.blocks.length,
                        argsLength: args.length
                    }
                }
            );
        }
        
        for (let i = 0; i < this.#params.blocks.length; i++) {

            let param = this.#params.blocks.at(i);
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

        for (const param of this.#params.blocks) {
            this.#scope.set(param);
        }
        
    }

    constructor(name: string) {
        this.#id = IdGenerator.generate();
        this.#name = name;
    }

    execute(): void {
        for (const block of this.blocks.blocks) {
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

}