import type { IEvaluable } from "../Interfaces/IEvaluable.ts";
import type { INamed } from "../Interfaces/INamed.ts";
export declare class Variable<T> implements INamed, IEvaluable<T> {
    #private;
    constructor(id: string, name: string, value: T);
    get id(): string;
    get name(): string;
    evaluate(): T;
    change(value: T): void;
}
//# sourceMappingURL=Variable.d.ts.map