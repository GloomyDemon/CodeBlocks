var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ArrayVariable_id, _ArrayVariable_name, _ArrayVariable_elementType, _ArrayVariable_values;
import { IdGenerator } from "../Program/IdGenerator.js";
export class ArrayVariable {
    get id() {
        return __classPrivateFieldGet(this, _ArrayVariable_id, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _ArrayVariable_name, "f");
    }
    get elementType() {
        return __classPrivateFieldGet(this, _ArrayVariable_elementType, "f");
    }
    constructor(name, sizeOrValues, elementType, fillValue) {
        _ArrayVariable_id.set(this, void 0);
        _ArrayVariable_name.set(this, void 0);
        _ArrayVariable_elementType.set(this, void 0);
        this.valueType = 'array';
        _ArrayVariable_values.set(this, void 0);
        __classPrivateFieldSet(this, _ArrayVariable_id, IdGenerator.generate(), "f");
        __classPrivateFieldSet(this, _ArrayVariable_name, name, "f");
        __classPrivateFieldSet(this, _ArrayVariable_elementType, elementType, "f");
        if (typeof sizeOrValues === 'number') {
            __classPrivateFieldSet(this, _ArrayVariable_values, new Array(sizeOrValues).fill(fillValue), "f");
        }
        else {
            __classPrivateFieldSet(this, _ArrayVariable_values, [...sizeOrValues], "f");
        }
    }
    evaluate() {
        return __classPrivateFieldGet(this, _ArrayVariable_values, "f");
    }
    length() {
        return __classPrivateFieldGet(this, _ArrayVariable_values, "f").length;
    }
    getElement(index) {
        this.ensureIndex(index);
        return __classPrivateFieldGet(this, _ArrayVariable_values, "f")[index];
    }
    setElement(index, value) {
        this.ensureIndex(index);
        __classPrivateFieldGet(this, _ArrayVariable_values, "f")[index] = value;
    }
    change(values) {
        __classPrivateFieldSet(this, _ArrayVariable_values, [...values], "f");
    }
    ensureIndex(index) {
        if (!Number.isInteger(index)) {
            throw new TypeError(`Index must be an integer. Got ${index}.`);
        }
        if (index < 0 || index >= __classPrivateFieldGet(this, _ArrayVariable_values, "f").length) {
            throw new RangeError(`Index out of range: ${index}.`);
        }
    }
}
_ArrayVariable_id = new WeakMap(), _ArrayVariable_name = new WeakMap(), _ArrayVariable_elementType = new WeakMap(), _ArrayVariable_values = new WeakMap();
