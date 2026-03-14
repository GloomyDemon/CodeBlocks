var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Scope_dataName, _Scope_dataId;
export class Scope {
    constructor(parent) {
        _Scope_dataName.set(this, new Map());
        _Scope_dataId.set(this, new Map());
        this.parent = parent;
    }
    get(key) {
        if (typeof key == 'string') {
            let data = __classPrivateFieldGet(this, _Scope_dataName, "f").get(key);
            if (!data && this.parent) {
                return this.parent.get(key);
            }
            return data;
        }
        else if (typeof key == "number") {
            let data = __classPrivateFieldGet(this, _Scope_dataId, "f").get(key);
            if (!data && this.parent) {
                return this.parent.get(key);
            }
            return data;
        }
        throw new TypeError(`Wrong key type. Key type is: ${typeof key}, expected string or number.`);
    }
    set(block) {
        __classPrivateFieldGet(this, _Scope_dataName, "f").set(block.name, block);
        __classPrivateFieldGet(this, _Scope_dataId, "f").set(block.id, block);
    }
    values() {
        return Array.from(__classPrivateFieldGet(this, _Scope_dataName, "f").values());
    }
    delete(key) {
        if (typeof key === 'string') {
            if (__classPrivateFieldGet(this, _Scope_dataName, "f").has(key)) {
                const block = __classPrivateFieldGet(this, _Scope_dataName, "f").get(key);
                __classPrivateFieldGet(this, _Scope_dataName, "f").delete(key);
                __classPrivateFieldGet(this, _Scope_dataId, "f").delete(block.id);
                return block;
            }
            else if (this.parent) {
                return this.parent.delete(key);
            }
            return undefined;
        }
        else if (typeof key === 'number') {
            if (__classPrivateFieldGet(this, _Scope_dataId, "f").has(key)) {
                const block = __classPrivateFieldGet(this, _Scope_dataId, "f").get(key);
                __classPrivateFieldGet(this, _Scope_dataId, "f").delete(key);
                __classPrivateFieldGet(this, _Scope_dataName, "f").delete(block.name);
                return block;
            }
            else if (this.parent) {
                return this.parent.delete(key);
            }
            return undefined;
        }
        return undefined;
    }
}
_Scope_dataName = new WeakMap(), _Scope_dataId = new WeakMap();
