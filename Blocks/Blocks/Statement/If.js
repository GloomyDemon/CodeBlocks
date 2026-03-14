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
var _If_blocks, _If_scope, _If_id;
import { Scope } from "../../Program/Scope.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import { Container } from "../../Program/Container.js";
export class If {
    get blocks() {
        return __classPrivateFieldGet(this, _If_blocks, "f");
    }
    check() {
        if (this.condition) {
            return this.condition.evaluate();
        }
        return false;
    }
    get scope() {
        return Object.freeze(__classPrivateFieldGet(this, _If_scope, "f"));
    }
    get id() {
        return __classPrivateFieldGet(this, _If_id, "f");
    }
    constructor(parent) {
        _If_blocks.set(this, new Container());
        _If_scope.set(this, void 0);
        _If_id.set(this, void 0);
        __classPrivateFieldSet(this, _If_id, IdGenerator.generate(), "f");
        __classPrivateFieldSet(this, _If_scope, new Scope(parent), "f");
    }
    execute() {
        if (this.check()) {
            __classPrivateFieldGet(this, _If_blocks, "f").blocks.forEach(block => block.execute());
        }
        ;
    }
}
_If_blocks = new WeakMap(), _If_scope = new WeakMap(), _If_id = new WeakMap();
