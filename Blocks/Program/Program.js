var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Program_blocks, _Program_scope, _Program_output, _Program_diagnostics, _Program_executedBlockIds;
import { Container } from "./Container.js";
import { Scope } from "./Scope.js";
export class Program {
    get blocks() {
        return __classPrivateFieldGet(this, _Program_blocks, "f");
    }
    get scope() {
        return Object.freeze(__classPrivateFieldGet(this, _Program_scope, "f"));
    }
    get output() {
        return __classPrivateFieldGet(this, _Program_output, "f");
    }
    get diagnostics() {
        return __classPrivateFieldGet(this, _Program_diagnostics, "f");
    }
    get executedBlockIds() {
        return __classPrivateFieldGet(this, _Program_executedBlockIds, "f");
    }
    constructor(maxOutput = 1000) {
        this.maxOutput = maxOutput;
        _Program_blocks.set(this, new Container());
        _Program_scope.set(this, new Scope());
        _Program_output.set(this, []);
        _Program_diagnostics.set(this, []);
        _Program_executedBlockIds.set(this, []);
    }
    execute() {
        for (const block of __classPrivateFieldGet(this, _Program_blocks, "f").blocks) {
            try {
                __classPrivateFieldGet(this, _Program_executedBlockIds, "f").push(block.id);
                block.execute();
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                __classPrivateFieldGet(this, _Program_diagnostics, "f").push({ blockId: block.id, severity: 'error', message });
            }
        }
    }
    writeOutput(value, block) {
        if (__classPrivateFieldGet(this, _Program_output, "f").length >= this.maxOutput) {
            if (block) {
                __classPrivateFieldGet(this, _Program_diagnostics, "f").push({
                    blockId: block.id,
                    severity: 'error',
                    message: 'Output limit exceeded.'
                });
            }
            return;
        }
        __classPrivateFieldGet(this, _Program_output, "f").push(String(value));
    }
}
_Program_blocks = new WeakMap(), _Program_scope = new WeakMap(), _Program_output = new WeakMap(), _Program_diagnostics = new WeakMap(), _Program_executedBlockIds = new WeakMap();
