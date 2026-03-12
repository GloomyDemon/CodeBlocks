import { Scope } from "./Scope.ts";
import { Variable } from "../Blocks/Variable.ts";

export type CoreDraftBlockKind = 'varDecl' | 'assign' | 'if';

export type CoreDraftBlock = {
    id: number;
    workspaceBlockId: string;
    kind: CoreDraftBlockKind;
    payload: Readonly<Record<string, unknown>>;
};

export type CoreDiagnosticSeverity = 'warning' | 'error';

export type CoreDraftDiagnostic = {
    blockId: number;
    workspaceBlockId: string;
    severity: CoreDiagnosticSeverity;
    message: string;
};

export type CoreDraftRunResult = {
    memory: Record<string, number>;
    executedBlockIds: number[];
    warnings: string[];
    diagnostics: CoreDraftDiagnostic[];
};

function isNumberVariable(value: unknown): value is Variable<number> {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const maybeVariable = value as {
        valueType?: unknown;
        change?: unknown;
        evaluate?: unknown;
    };

    return maybeVariable.valueType === 'number'
        && typeof maybeVariable.change === 'function'
        && typeof maybeVariable.evaluate === 'function';
}

export function runCoreDraftProgram(blocks: readonly CoreDraftBlock[]): CoreDraftRunResult {
    const scope = new Scope();
    const memory: Record<string, number> = {};
    const executedBlockIds: number[] = [];
    const warnings: string[] = [];
    const diagnostics: CoreDraftDiagnostic[] = [];

    let halted = false;

    const addDiagnostic = (
        block: CoreDraftBlock,
        severity: CoreDiagnosticSeverity,
        message: string
    ): void => {
        diagnostics.push({
            blockId: block.id,
            workspaceBlockId: block.workspaceBlockId,
            severity,
            message
        });

        warnings.push(message);

        if (severity === 'error') {
            halted = true;
        }
    };

    for (const block of blocks) {
        if (halted) {
            break;
        }

        executedBlockIds.push(block.id);

        if (block.kind === 'varDecl') {
            const name = typeof block.payload['name'] === 'string' ? block.payload['name'] : '';
            const valueType = block.payload['valueType'];

            if (!name) {
                addDiagnostic(block, 'error', `Block #${block.id}: variable name is empty.`);
                continue;
            }

            if (valueType !== 'number') {
                addDiagnostic(block, 'warning', `Block #${block.id}: unsupported valueType \"${String(valueType)}\". Only number is supported.`);
            }

            const existing = scope.get(name);
            if (existing) {
                addDiagnostic(block, 'warning', `Block #${block.id}: variable \"${name}\" redeclared. Previous value will be overwritten to 0.`);
            }

            const variable = new Variable<number>(name, 'number', 0);
            scope.set(variable);
            memory[name] = 0;
            continue;
        }

        if (block.kind === 'assign') {
            const name = typeof block.payload['name'] === 'string' ? block.payload['name'] : '';
            const value = typeof block.payload['value'] === 'number' ? block.payload['value'] : Number.NaN;

            if (!name) {
                addDiagnostic(block, 'error', `Block #${block.id}: assignment target name is empty.`);
                continue;
            }

            const target = scope.get(name);
            if (!target || !isNumberVariable(target)) {
                addDiagnostic(block, 'error', `Block #${block.id}: variable \"${name}\" is not declared.`);
                continue;
            }

            if (Number.isNaN(value)) {
                addDiagnostic(block, 'error', `Block #${block.id}: assignment value is not a valid number.`);
                continue;
            }

            target.change(value);
            memory[name] = target.evaluate();
            continue;
        }

        addDiagnostic(block, 'warning', `Block #${block.id}: if execution is not implemented in core adapter yet.`);
    }

    return {
        memory,
        executedBlockIds,
        warnings,
        diagnostics
    };
}
