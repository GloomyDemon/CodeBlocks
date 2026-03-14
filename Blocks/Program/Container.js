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
var _Container_listeners, _Container_blocks, _Container_blocksById;
export class Container {
    constructor() {
        _Container_listeners.set(this, new Set());
        _Container_blocks.set(this, []);
        _Container_blocksById.set(this, new Map());
    }
    subscribe(listener) {
        __classPrivateFieldGet(this, _Container_listeners, "f").add(listener);
        return () => __classPrivateFieldGet(this, _Container_listeners, "f").delete(listener);
    }
    get blocks() {
        return __classPrivateFieldGet(this, _Container_blocks, "f");
    }
    get blocksById() {
        return __classPrivateFieldGet(this, _Container_blocksById, "f");
    }
    addBlock(block, index) {
        this.deleteBlock(block.id);
        if (index === undefined) {
            __classPrivateFieldGet(this, _Container_blocks, "f").push(block);
            this.emit('add', block, __classPrivateFieldGet(this, _Container_blocks, "f").length - 1);
        }
        else if (index < 0 || index > __classPrivateFieldGet(this, _Container_blocks, "f").length) {
            const error = new RangeError("Timeout Error");
            error.cause = {
                comment: "Index out of range",
                index
            };
            throw error;
        }
        else {
            __classPrivateFieldGet(this, _Container_blocks, "f").splice(index, 0, block);
            this.emit('add', block, index);
        }
        if (__classPrivateFieldGet(this, _Container_blocks, "f").find(b => b.id === block.id)) {
            __classPrivateFieldGet(this, _Container_blocksById, "f").set(block.id, block);
        }
    }
    deleteBlock(id) {
        if (!__classPrivateFieldGet(this, _Container_blocksById, "f").has(id)) {
            return undefined;
        }
        const block = __classPrivateFieldGet(this, _Container_blocksById, "f").get(id);
        const index = __classPrivateFieldGet(this, _Container_blocks, "f").findIndex(b => b.id === id);
        __classPrivateFieldSet(this, _Container_blocks, __classPrivateFieldGet(this, _Container_blocks, "f").filter(b => b.id !== id), "f");
        __classPrivateFieldGet(this, _Container_blocksById, "f").delete(id);
        if (index >= 0) {
            this.emit('remove', block, index);
        }
        return block;
    }
    emit(type, block, index) {
        __classPrivateFieldGet(this, _Container_listeners, "f").forEach(listener => listener({ type, block, index }));
    }
}
_Container_listeners = new WeakMap(), _Container_blocks = new WeakMap(), _Container_blocksById = new WeakMap();
