import { IdGenerator } from "../../Program/IdGenerator.js";
import { ArrayVariable } from "../ArrayVariable.js";
import { Variable } from "../Variable.js";
export class VarDecl {
    constructor(options, scope) {
        this.options = options;
        this.id = IdGenerator.generate();
        this.scope = scope;
    }
    execute() {
        var _a, _b;
        const name = this.options.name.trim();
        if (!name) {
            throw new Error('Variable name is empty.');
        }
        if (this.options.valueType === 'array') {
            const values = (_a = this.options.values) !== null && _a !== void 0 ? _a : [];
            const size = typeof this.options.size === 'number' ? this.options.size : values.length;
            const elementType = (_b = this.options.elementType) !== null && _b !== void 0 ? _b : 'number';
            const array = new ArrayVariable(name, size, elementType === 'number' ? 'number' : 'number', 0);
            if (values.length > 0) {
                array.change(values);
            }
            this.scope.set(array);
            return;
        }
        const initialValue = this.options.value ? this.options.value.evaluate() : 0;
        const variable = new Variable(name, 'number', Number(initialValue));
        this.scope.set(variable);
    }
}
