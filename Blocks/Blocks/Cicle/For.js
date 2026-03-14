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
var _For_variables, _For_iterators, _For_initializers, _For_scope, _For_id, _For_blocks;
import { Scope } from "../../Program/Scope.js";
import { IdGenerator } from "../../Program/IdGenerator.js";
import { Container } from "../../Program/Container.js";
export class For {
    get variables() {
        return __classPrivateFieldGet(this, _For_variables, "f");
    }
    check() {
        if (this.condition) {
            return this.condition.evaluate();
        }
        return false;
    }
    get iterators() {
        return __classPrivateFieldGet(this, _For_iterators, "f");
    }
    get initializers() {
        return __classPrivateFieldGet(this, _For_initializers, "f");
    }
    get scope() {
        return Object.freeze(__classPrivateFieldGet(this, _For_scope, "f"));
    }
    get id() {
        return __classPrivateFieldGet(this, _For_id, "f");
    }
    get blocks() {
        return __classPrivateFieldGet(this, _For_blocks, "f");
    }
    constructor(parent) {
        _For_variables.set(this, new Container());
        _For_iterators.set(this, new Container());
        _For_initializers.set(this, new Container());
        _For_scope.set(this, void 0);
        _For_id.set(this, void 0);
        _For_blocks.set(this, new Container());
        __classPrivateFieldSet(this, _For_id, IdGenerator.generate(), "f");
        __classPrivateFieldSet(this, _For_scope, new Scope(parent), "f");
    }
    execute() {
        for (const variable of __classPrivateFieldGet(this, _For_variables, "f").blocks) {
            __classPrivateFieldGet(this, _For_scope, "f").set(variable);
        }
        __classPrivateFieldGet(this, _For_initializers, "f").blocks.forEach(block => block.execute());
        while (this.check()) {
            __classPrivateFieldGet(this, _For_blocks, "f").blocks.forEach(block => block.execute());
            __classPrivateFieldGet(this, _For_iterators, "f").blocks.forEach(iterator => iterator.execute());
        }
    }
}
_For_variables = new WeakMap(), _For_iterators = new WeakMap(), _For_initializers = new WeakMap(), _For_scope = new WeakMap(), _For_id = new WeakMap(), _For_blocks = new WeakMap();
