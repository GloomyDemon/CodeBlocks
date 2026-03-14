import type { IExecutable } from "../../Interfaces/IExecutable.js";
import type { IEvaluable } from "../../Interfaces/IEvaluable.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import type { Scope } from "../../Program/Scope.js";
import type { ValueType } from "../../Program/ValueType.js";
import { ArrayVariable } from "../ArrayVariable.js";
import { Variable } from "../Variable.js";

type VarDeclOptions = {
    name: string;
    valueType: ValueType;
    value?: IEvaluable<number> | null;
    size?: number;
    values?: number[];
    elementType?: ValueType;
};

export class VarDecl implements IExecutable {
    readonly id: number;
    readonly scope: Readonly<Scope>;

    constructor(private readonly options: VarDeclOptions, scope: Scope) {
        this.id = IdGenerator.generate();
        this.scope = scope;
    }

    execute(): void {
        const name = this.options.name.trim();
        if (!name) {
            throw new Error('Variable name is empty.');
        }

        if (this.options.valueType === 'array') {
            const values = this.options.values ?? [];
            const size = typeof this.options.size === 'number' ? this.options.size : values.length;
            const elementType = this.options.elementType ?? 'number';
            const array = new ArrayVariable<number>(name, size, elementType === 'number' ? 'number' : 'number', 0);
            if (values.length > 0) {
                array.change(values);
            }
            this.scope.set(array);
            return;
        }

        const initialValue = this.options.value ? this.options.value.evaluate() : 0;
        const variable = new Variable<number>(name, 'number', Number(initialValue));
        this.scope.set(variable);
    }
}
