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
var _a, _IdGenerator_nextId;
export class IdGenerator {
    static generate() {
        var _b, _c;
        return __classPrivateFieldSet(this, _a, (_c = __classPrivateFieldGet(this, _a, "f", _IdGenerator_nextId), _b = _c++, _c), "f", _IdGenerator_nextId), _b;
    }
    static reset() {
        __classPrivateFieldSet(this, _a, 0, "f", _IdGenerator_nextId);
    }
}
_a = IdGenerator;
_IdGenerator_nextId = { value: 0 };
