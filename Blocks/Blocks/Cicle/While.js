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
var _While_scope, _While_id, _While_blocks;
import { Scope } from "../../Program/Scope.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import { Container } from "../../Program/Container.js";
export class While {
    check() {
        if (this.condition) {
            return this.condition.evaluate();
        }
        return false;
    }
    get scope() {
        return Object.freeze(__classPrivateFieldGet(this, _While_scope, "f"));
    }
    get id() {
        return __classPrivateFieldGet(this, _While_id, "f");
    }
    get blocks() {
        return __classPrivateFieldGet(this, _While_blocks, "f");
    }
    constructor(parent) {
        _While_scope.set(this, void 0);
        _While_id.set(this, void 0);
        _While_blocks.set(this, new Container());
        __classPrivateFieldSet(this, _While_id, IdGenerator.generate(), "f");
        __classPrivateFieldSet(this, _While_scope, new Scope(parent), "f");
    }
    execute() {
        while (this.check()) {
            this.blocks.blocks.forEach(block => block.execute());
        }
        ;
    }
}
_While_scope = new WeakMap(), _While_id = new WeakMap(), _While_blocks = new WeakMap();
