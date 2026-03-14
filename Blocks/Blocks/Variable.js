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
var _Variable_id, _Variable_name, _Variable_valueType, _Variable_value;
import { IdGenerator } from "../Program/IdGenerator.js";
export class Variable {
    get id() {
        return __classPrivateFieldGet(this, _Variable_id, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _Variable_name, "f");
    }
    get valueType() {
        return __classPrivateFieldGet(this, _Variable_valueType, "f");
    }
    evaluate() {
        return __classPrivateFieldGet(this, _Variable_value, "f");
    }
    change(value) {
        __classPrivateFieldSet(this, _Variable_value, value, "f");
    }
    constructor(name, valueType, value = undefined) {
        _Variable_id.set(this, void 0);
        _Variable_name.set(this, void 0);
        _Variable_valueType.set(this, void 0);
        _Variable_value.set(this, void 0);
        __classPrivateFieldSet(this, _Variable_id, IdGenerator.generate(), "f");
        __classPrivateFieldSet(this, _Variable_name, name, "f");
        __classPrivateFieldSet(this, _Variable_valueType, valueType, "f");
        __classPrivateFieldSet(this, _Variable_value, value, "f");
    }
}
_Variable_id = new WeakMap(), _Variable_name = new WeakMap(), _Variable_valueType = new WeakMap(), _Variable_value = new WeakMap();
