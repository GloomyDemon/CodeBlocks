import {
    blockDefinitions,
    buildExpressionFromSlot,
    type ExpressionNode,
    type StatementNode,
    loadBubbleSortPreset,
    type BlockDefinition,
    type BlockKind
} from "./blocks.js";
import { Program } from "./Blocks/Program/Program.js";
import { Scope } from "./Blocks/Program/Scope.js";
import type { ValueType } from "./Blocks/Program/ValueType.js";
import type { IEvaluable } from "./Blocks/Interfaces/IEvaluable.js";
import type { IExecutable } from "./Blocks/Interfaces/IExecutable.js";
import { ArrayVariable } from "./Blocks/Blocks/ArrayVariable.js";
import { Variable } from "./Blocks/Blocks/Variable.js";
import { Literal } from "./Blocks/Blocks/Value/Literal.js";
import { VariableReference } from "./Blocks/Blocks/Value/VariableReference.js";
import { ScopedElementAccess } from "./Blocks/Blocks/Operator/Array/ScopedElementAccess.js";
import { ScopedElementAssignment } from "./Blocks/Blocks/Operator/Array/ScopedElementAssignment.js";
import { ScopedAssignment } from "./Blocks/Blocks/Operator/Assignment/ScopedAssignment.js";
import { Addition } from "./Blocks/Blocks/Operator/Arithmetic/Addition.js";
import { Subtraction } from "./Blocks/Blocks/Operator/Arithmetic/Subtraction.js";
import { Multiply } from "./Blocks/Blocks/Operator/Arithmetic/Multiply.js";
import { Division } from "./Blocks/Blocks/Operator/Arithmetic/Division.js";
import { Remainder } from "./Blocks/Blocks/Operator/Arithmetic/Remainder.js";
import { Exponentiation } from "./Blocks/Blocks/Operator/Arithmetic/Exponentiation.js";
import { And } from "./Blocks/Blocks/Operator/Logical/And.js";
import { Or } from "./Blocks/Blocks/Operator/Logical/Or.js";
import { Not } from "./Blocks/Blocks/Operator/Logical/Not.js";
import { Equal } from "./Blocks/Blocks/Operator/Comparison/Equal.js";
import { NotEqual } from "./Blocks/Blocks/Operator/Comparison/NotEqual.js";
import { Greater } from "./Blocks/Blocks/Operator/Comparison/Greater.js";
import { GreaterOrEqual } from "./Blocks/Blocks/Operator/Comparison/GreaterOrEqual.js";
import { Less } from "./Blocks/Blocks/Operator/Comparison/Less.js";
import { LessOrEqual } from "./Blocks/Blocks/Operator/Comparison/LessOrEqual.js";
import { VarDecl } from "./Blocks/Blocks/Statement/VarDecl.js";
import { Assignment } from "./Blocks/Blocks/Operator/Assignment/Assignment.js";
import { If } from "./Blocks/Blocks/Statement/If.js";
import { IfElse } from "./Blocks/Blocks/Statement/IfElse.js";
import { While } from "./Blocks/Blocks/Cicle/While.js";
import { For } from "./Blocks/Blocks/Cicle/For.js";
import { Print } from "./Blocks/Blocks/Statement/Print.js";

type DraftRunResult = {
    memory: Record<string, number | readonly number[]>;
    executedBlockIds: number[];
    warnings: string[];
    diagnostics: { blockId: number; workspaceBlockId: string; severity: 'warning' | 'error'; message: string }[];
    output: string[];
    returnValue?: unknown;
};

// Runtime model builders
function buildExpressionModel(node: ExpressionNode, scope: Scope): IEvaluable<unknown> {
    switch (node.type) {
        case 'literal':
            return new Literal<number>(node.value, 'number');
        case 'variable':
            return new VariableReference<number>(node.name, scope, 'number');
        case 'arrayAccess':
            return new ScopedElementAccess<number>(
                node.array,
                buildExpressionModel(node.index, scope) as IEvaluable<number>,
                scope,
                'number'
            );
        case 'binary': {
            const left = buildExpressionModel(node.left, scope);
            const right = buildExpressionModel(node.right, scope);
            switch (node.operator) {
                case '+':
                    return new Addition(left as IEvaluable<number>, right as IEvaluable<number>);
                case '-':
                    return new Subtraction(left as IEvaluable<number>, right as IEvaluable<number>);
                case '*':
                    return new Multiply(left as IEvaluable<number>, right as IEvaluable<number>);
                case '/':
                    return new Division(left as IEvaluable<number>, right as IEvaluable<number>);
                case '%':
                    return new Remainder(left as IEvaluable<number>, right as IEvaluable<number>);
                case '>':
                    return new Greater(left as IEvaluable<number>, right as IEvaluable<number>);
                case '>=':
                    return new GreaterOrEqual(left as IEvaluable<number>, right as IEvaluable<number>);
                case '<':
                    return new Less(left as IEvaluable<number>, right as IEvaluable<number>);
                case '<=':
                    return new LessOrEqual(left as IEvaluable<number>, right as IEvaluable<number>);
                case '==':
                    return new Equal(left as IEvaluable<number>, right as IEvaluable<number>);
                case '!=':
                    return new NotEqual(left as IEvaluable<number>, right as IEvaluable<number>);
                case '&&':
                    return new And(left as unknown as IEvaluable<boolean>, right as unknown as IEvaluable<boolean>);
                case '||':
                    return new Or(left as unknown as IEvaluable<boolean>, right as unknown as IEvaluable<boolean>);
                default:
                    return new Literal<number>(0, 'number');
            }
        }
        case 'unary': {
            const operand = buildExpressionModel(node.operand, scope) as IEvaluable<boolean>;
            return new Not(operand);
        }
        default:
            return new Literal<number>(0, 'number');
    }
}

function buildStatementModel(statement: StatementNode | null | undefined, scope: Scope): IExecutable | null {
    if (!statement) {
        return null;
    }

    if (statement.kind === 'varDecl') {
        const payload = statement.payload;
        const valueType = payload['valueType'] as ValueType | undefined;
        const name = typeof payload['name'] === 'string' ? payload['name'] : '';
        const value = payload['value'] as ExpressionNode | undefined;
        const size = typeof payload['size'] === 'number' ? payload['size'] : undefined;
        const values = Array.isArray(payload['values'])
            ? payload['values'].filter((item): item is number => typeof item === 'number')
            : undefined;
        const elementType = payload['elementType'] as ValueType | undefined;
        return new VarDecl(
            {
                name,
                valueType: valueType ?? 'number',
                value: value ? (buildExpressionModel(value, scope) as IEvaluable<number>) : null,
                size,
                values,
                elementType
            },
            scope
        );
    }

    if (statement.kind === 'assign') {
        const payload = statement.payload;
        const target = payload['target'] as ExpressionNode | undefined;
        const expression = payload['expression'] as ExpressionNode | undefined;
        if (!target || !expression) {
            return null;
        }
        if (target.type === 'arrayAccess') {
            return new ScopedElementAssignment<number>(
                target.array,
                buildExpressionModel(target.index, scope) as IEvaluable<number>,
                buildExpressionModel(expression, scope) as IEvaluable<number>,
                scope
            );
        }
        if (target.type === 'variable') {
            return new ScopedAssignment<number>(
                target.name,
                buildExpressionModel(expression, scope) as IEvaluable<number>,
                scope
            );
        }
    }

    return null;
}

function buildExecutableFromElement(element: HTMLElement, program: Program, scope: Scope): IExecutable {
    const kind = element.dataset.blockKind as BlockKind | undefined;
    if (!kind) {
        return new Assignment(new Variable<number>('unused', 'number', 0), new Literal<number>(0, 'number'), scope);
    }

    if (kind === 'varDecl' || kind === 'assign') {
        const payload = JSON.parse(element.dataset.blockPayload ?? '{}') as Record<string, unknown>;
        return buildStatementModel({ kind, payload }, scope) as IExecutable;
    }

    if (kind === 'print') {
        const slot = element.querySelector(':scope > .block-label > .block-slot') as HTMLElement | null;
        const expressionNode = slot ? buildExpressionFromSlot(slot) : null;
        return new Print(
            expressionNode ? buildExpressionModel(expressionNode, scope) : new Literal<number>(0, 'number'),
            program,
            scope
        );
    }

    if (kind === 'if' || kind === 'ifElse') {
        const conditionSlot = element.querySelector(':scope > .block-condition > .block-slot') as HTMLElement | null;
        const conditionNode = conditionSlot ? buildExpressionFromSlot(conditionSlot) : null;
        const ifBlock = kind === 'if'
            ? new If(scope)
            : new IfElse(scope);
        ifBlock.condition = conditionNode
            ? (buildExpressionModel(conditionNode, ifBlock.scope as Scope) as IEvaluable<boolean>)
            : undefined;

        const body = element.querySelector(':scope > .block-body');
        body?.querySelectorAll(':scope > .block').forEach((child) => {
            ifBlock.blocks.addBlock(buildExecutableFromElement(child as HTMLElement, program, ifBlock.scope as Scope));
        });

        if (kind === 'ifElse' && ifBlock instanceof IfElse) {
            const elseBody = element.querySelector(':scope > .block-else > .block-else-body');
            elseBody?.querySelectorAll(':scope > .block').forEach((child) => {
                ifBlock.elseBlocks.addBlock(buildExecutableFromElement(child as HTMLElement, program, ifBlock.scope as Scope));
            });
        }

        return ifBlock;
    }

    if (kind === 'while') {
        const conditionSlot = element.querySelector(':scope > .block-condition > .block-slot') as HTMLElement | null;
        const conditionNode = conditionSlot ? buildExpressionFromSlot(conditionSlot) : null;
        const whileBlock = new While(scope);
        whileBlock.condition = conditionNode
            ? (buildExpressionModel(conditionNode, whileBlock.scope as Scope) as IEvaluable<boolean>)
            : undefined;

        const body = element.querySelector(':scope > .block-body');
        body?.querySelectorAll(':scope > .block').forEach((child) => {
            whileBlock.blocks.addBlock(buildExecutableFromElement(child as HTMLElement, program, whileBlock.scope as Scope));
        });

        return whileBlock;
    }

    if (kind === 'for') {
        const forBlock = new For(scope);
        const slots = element.querySelectorAll(':scope > .block-meta > .block-slot');
        if (slots.length >= 3) {
            const initStatement = buildStatementFromSlot(slots[0] as HTMLElement);
            const conditionNode = buildExpressionFromSlot(slots[1] as HTMLElement);
            const stepStatement = buildStatementFromSlot(slots[2] as HTMLElement);

            const initBlock = buildStatementModel(initStatement, forBlock.scope as Scope);
            if (initBlock) {
                forBlock.initializers.addBlock(initBlock);
            }

            const stepBlock = buildStatementModel(stepStatement, forBlock.scope as Scope);
            if (stepBlock) {
                forBlock.iterators.addBlock(stepBlock);
            }

            forBlock.condition = conditionNode
                ? (buildExpressionModel(conditionNode, forBlock.scope as Scope) as IEvaluable<boolean>)
                : undefined;
        }

        const body = element.querySelector(':scope > .block-body');
        body?.querySelectorAll(':scope > .block').forEach((child) => {
            forBlock.blocks.addBlock(buildExecutableFromElement(child as HTMLElement, program, forBlock.scope as Scope));
        });

        return forBlock;
    }

    return new Assignment(new Variable<number>('unused', 'number', 0), new Literal<number>(0, 'number'), scope);
}

function buildMemorySnapshot(scope: Scope): Record<string, number | readonly number[]> {
    const memory: Record<string, number | readonly number[]> = {};

    const collect = (current: Scope): void => {
        if (current.parent) {
            collect(current.parent);
        }

        for (const item of current.values()) {
            if (item instanceof Variable && item.valueType === 'number') {
                memory[item.name] = item.evaluate();
            }
            if (item instanceof ArrayVariable && item.valueType === 'array') {
                memory[item.name] = item.evaluate();
            }
        }
    };

    collect(scope);

    return memory;
}

// DOM roots and ids
const workspaceRoot = document.querySelector('#workspace-canvas') as HTMLElement | null;
const toolboxRoot = document.querySelector('#flyout') as HTMLElement | null;
const categoryRoot = document.querySelector('#category-list') as HTMLElement | null;
const runOutput = document.querySelector('#run-output') as HTMLElement | null;

let nextWorkspaceBlockId = 1;

function createWorkspaceBlockId(): string {
    return `wb-${nextWorkspaceBlockId++}`;
}

// Expression and statement rendering
function createExpressionBlock(node: ExpressionNode): HTMLElement | null {
    if (node.type === 'binary') {
        const kind: BlockKind = ['+', '-', '*', '/', '%'].includes(node.operator)
            ? 'math'
            : ['&&', '||'].includes(node.operator)
                ? 'logic'
                : 'compare';
        const def = getDefinition(kind);
        return createBlockElement(def, { left: node.left, operator: node.operator, right: node.right }, false);
    }

    if (node.type === 'unary') {
        const def = getDefinition('not');
        return createBlockElement(def, { operand: node.operand }, false);
    }

    if (node.type === 'arrayAccess') {
        const def = getDefinition('arrayAccess');
        return createBlockElement(def, { name: node.array, index: node.index }, false);
    }

    return null;
}

function renderExpressionSlot(slot: HTMLElement, node: ExpressionNode | null | undefined): void {
    if (!node) {
        return;
    }

    const input = slot.querySelector(':scope > input') as HTMLInputElement | null;
    if (node.type === 'literal' || node.type === 'variable') {
        if (input) {
            input.value = getExpressionLabel(node);
        }
        const existing = slot.querySelector(':scope > .block') as HTMLElement | null;
        existing?.remove();
        return;
    }

    const block = createExpressionBlock(node);
    if (!block) {
        return;
    }

    const existing = slot.querySelector(':scope > .block') as HTMLElement | null;
    existing?.remove();
    slot.appendChild(block);
    syncSlotInput(slot);

    hydrateExpressionBlock(block, node);
}

function hydrateExpressionBlock(block: HTMLElement, node: ExpressionNode): void {
    if (node.type === 'binary') {
        const slots = block.querySelectorAll(':scope > .block-label > .block-slot');
        if (slots[0]) {
            renderExpressionSlot(slots[0] as HTMLElement, node.left);
        }
        if (slots[1]) {
            renderExpressionSlot(slots[1] as HTMLElement, node.right);
        }
        return;
    }

    if (node.type === 'arrayAccess') {
        const nameInput = block.querySelector('input') as HTMLInputElement | null;
        if (nameInput) {
            nameInput.value = node.array;
        }
        const indexSlot = block.querySelector(':scope > .block-label > .block-slot') as HTMLElement | null;
        if (indexSlot) {
            renderExpressionSlot(indexSlot, node.index);
        }
    }
}

function renderStatementSlot(slot: HTMLElement, statement: StatementNode | null | undefined): void {
    if (!statement) {
        return;
    }

    const def = getDefinition(statement.kind);
    const block = createBlockElement(def, statement.payload, false);
    const existing = slot.querySelector(':scope > .block') as HTMLElement | null;
    existing?.remove();
    slot.appendChild(block);
    syncSlotInput(slot);
}

// Parsing utilities
function parseInlineExpression(rawValue: string): ExpressionNode {
    const numericValue = Number(rawValue);
    if (!Number.isNaN(numericValue)) {
        return { type: 'literal', value: numericValue };
    }
    return { type: 'variable', name: rawValue };
}


function getExpressionLabel(node: ExpressionNode | null | undefined): string {
    if (!node) {
        return '';
    }
    if (node.type === 'literal') {
        return String(node.value);
    }
    if (node.type === 'variable') {
        return node.name;
    }
    return '';
}

// Slot utilities
function buildStatementFromSlot(slot: HTMLElement): StatementNode | null {
    const nested = slot.querySelector('.block') as HTMLElement | null;
    if (!nested) {
        return null;
    }

    const kind = nested.dataset.blockKind as BlockKind | undefined;
    if (kind !== 'varDecl' && kind !== 'assign') {
        return null;
    }

    const payloadRaw = nested.dataset.blockPayload;
    if (!payloadRaw) {
        return null;
    }

    const payload = JSON.parse(payloadRaw) as Readonly<Record<string, unknown>>;
    return { kind, payload };
}

function syncSlotInput(slot: HTMLElement): void {
    const input = slot.querySelector(':scope > input') as HTMLInputElement | null;
    if (!input) {
        return;
    }

    const hasBlock = Boolean(slot.querySelector(':scope > .block'));
    input.style.display = hasBlock ? 'none' : '';
}

// Drag and drop helpers
function setupDeleteZone(zone: HTMLElement): void {
    zone.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.stopPropagation();
        zone.classList.add('drop-target');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drop-target');
    });

    zone.addEventListener('drop', (event) => {
        event.preventDefault();
        event.stopPropagation();
        zone.classList.remove('drop-target');

        const raw = event.dataTransfer?.getData('application/json');
        if (!raw) {
            return;
        }

        const payload = JSON.parse(raw) as { type: 'prototype' | 'workspace'; workspaceId?: string };
        if (payload.type === 'workspace' && payload.workspaceId) {
            const existing = document.querySelector(`[data-workspace-block-id="${payload.workspaceId}"]`) as HTMLElement | null;
            existing?.remove();
        }
    });
}

function setupExpressionSlot(slot: HTMLElement, onUpdate: () => void): void {
    slot.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.stopPropagation();
        slot.classList.add('drop-target');
    });

    slot.addEventListener('dragleave', () => {
        slot.classList.remove('drop-target');
    });

    slot.addEventListener('drop', (event) => {
        event.preventDefault();
        event.stopPropagation();
        slot.classList.remove('drop-target');

        const raw = event.dataTransfer?.getData('application/json');
        if (!raw) {
            return;
        }

        const payload = JSON.parse(raw) as { type: 'prototype' | 'workspace'; kind: BlockKind; payload?: string; workspaceId?: string };
        const supportedKinds: BlockKind[] = ['varDecl', 'assign', 'compare', 'math', 'logic', 'not', 'arrayAccess'];
        if (supportedKinds.indexOf(payload.kind) === -1) {
            return;
        }

        if (payload.type === 'prototype' && payload.payload) {
            const def = getDefinition(payload.kind);
            const blockPayload = JSON.parse(payload.payload) as Readonly<Record<string, unknown>>;
            const element = createBlockElement(def, blockPayload, false);
            const existing = slot.querySelector(':scope > .block') as HTMLElement | null;
            existing?.remove();
            slot.appendChild(element);
            syncSlotInput(slot);
            onUpdate();
            return;
        }

        if (payload.type === 'workspace' && payload.workspaceId) {
            const existing = document.querySelector(`[data-workspace-block-id="${payload.workspaceId}"]`) as HTMLElement | null;
            if (existing) {
                const current = slot.querySelector(':scope > .block') as HTMLElement | null;
                current?.remove();
                slot.appendChild(existing);
                syncSlotInput(slot);
                onUpdate();
            }
        }
    });

    slot.addEventListener('input', onUpdate);
    slot.addEventListener('change', onUpdate);

    const observer = new MutationObserver(() => {
        syncSlotInput(slot);
    });
    observer.observe(slot, { childList: true });
    syncSlotInput(slot);
}

// Block definition helpers
function updateBlockPayload(block: HTMLElement, nextPayload: Readonly<Record<string, unknown>>): void {
    block.dataset.blockPayload = JSON.stringify(nextPayload);
}

function getDefinition(kind: BlockKind): BlockDefinition {
    const def = blockDefinitions.find(item => item.kind === kind);
    if (!def) {
        throw new Error(`Missing definition for ${kind}`);
    }
    return def;
}

function tryGetDefinition(kind: BlockKind): BlockDefinition | null {
    return blockDefinitions.find(item => item.kind === kind) ?? null;
}

function setBlockLabel(element: HTMLElement, text: string): void {
    const label = element.querySelector('.block-label') as HTMLElement | null;
    if (label) {
        label.textContent = text;
        return;
    }
    element.textContent = text;
}

function getBlockCaption(kind: BlockKind, payload: Readonly<Record<string, unknown>>, fallback: string): string {
    if (kind === 'varDecl') {
        const name = typeof payload.name === 'string' ? payload.name : 'x';
        return `var ${name}`;
    }

    if (kind === 'assign') {
        const name = typeof payload.name === 'string' ? payload.name : 'x';
        const expression = typeof payload.expression === 'string' ? payload.expression : '';
        const value = typeof payload.value === 'number' ? payload.value : 0;
        return expression ? `${name} = ${expression}` : `${name} = ${value}`;
    }

    if (kind === 'print') {
        const value = typeof payload.value === 'string' ? payload.value : '';
        return value ? `print ${value}` : 'print';
    }


    if (kind === 'if') {
        return 'if';
    }

    if (kind === 'ifElse') {
        return 'if / else';
    }

    if (kind === 'while') {
        return 'while';
    }

    if (kind === 'for') {
        return 'for';
    }

    return fallback;
}

// Block rendering
function createBlockElement(def: BlockDefinition, payload: Readonly<Record<string, unknown>>, isPrototype: boolean): HTMLElement {
    const block = document.createElement('div');
    block.className = 'block';
    block.style.backgroundColor = def.color;
    block.dataset.blockKind = def.kind;
    block.dataset.blockPayload = JSON.stringify(payload);
    block.draggable = true;

    const label = document.createElement('div');
    label.className = 'block-label';
    block.appendChild(label);

    if (def.kind === 'varDecl') {
        const nameInput = document.createElement('input');
        nameInput.className = 'block-input';
        nameInput.value = typeof payload.name === 'string' ? payload.name : 'x';

        const typeSelect = document.createElement('select');
        typeSelect.className = 'block-select';
        ['number', 'array'].forEach((type) => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            if (payload.valueType === type) {
                option.selected = true;
            }
            typeSelect.appendChild(option);
        });

        const prefix = document.createElement('span');
        prefix.textContent = 'var ';

        const valueInput = document.createElement('input');
        valueInput.className = 'block-input';
        valueInput.placeholder = 'value';
        valueInput.value = getExpressionLabel(payload.value as ExpressionNode | undefined);

        const arrayMeta = document.createElement('div');
        arrayMeta.className = 'block-meta';

        const sizeInput = document.createElement('input');
        sizeInput.className = 'block-input';
        sizeInput.type = 'number';
        sizeInput.placeholder = 'size';
        sizeInput.value = typeof payload.size === 'number' ? String(payload.size) : '';

        const valuesInput = document.createElement('input');
        valuesInput.className = 'block-input';
        valuesInput.placeholder = 'values (1,2,3)';
        valuesInput.value = Array.isArray(payload.values) ? (payload.values as number[]).join(',') : '';

        arrayMeta.append(sizeInput, valuesInput);
        label.append(prefix, nameInput, typeSelect, valueInput);
        block.appendChild(arrayMeta);

        const update = () => {
            const selectedType = typeSelect.value;
            if (selectedType === 'array') {
                const sizeValue = Number(sizeInput.value.trim());
                const values = valuesInput.value
                    .split(',')
                    .map(item => Number(item.trim()))
                    .filter(item => !Number.isNaN(item));
                updateBlockPayload(block, {
                    name: nameInput.value.trim() || 'arr',
                    valueType: 'array',
                    size: Number.isNaN(sizeValue) ? undefined : sizeValue,
                    values,
                    elementType: 'number'
                });
                return;
            }

            const rawValue = valueInput.value.trim();
            const parsed = parseInlineExpression(rawValue);

            updateBlockPayload(block, {
                name: nameInput.value.trim() || 'x',
                valueType: selectedType,
                value: parsed
            });
        };

        const toggleArrayInputs = () => {
            const isArray = typeSelect.value === 'array';
            arrayMeta.style.display = isArray ? 'flex' : 'none';
            valueInput.style.display = isArray ? 'none' : 'inline-flex';
        };

        nameInput.addEventListener('input', update);
        typeSelect.addEventListener('change', () => {
            toggleArrayInputs();
            update();
        });
        valueInput.addEventListener('input', update);
        sizeInput.addEventListener('input', update);
        valuesInput.addEventListener('input', update);

        toggleArrayInputs();
        update();
    } else if (def.kind === 'arrayAccess') {
        label.textContent = '';

        const nameInput = document.createElement('input');
        nameInput.className = 'block-input';
        nameInput.placeholder = 'array';
        nameInput.value = typeof payload.name === 'string' ? payload.name : 'arr';

        const indexSlot = document.createElement('div');
        indexSlot.className = 'block-slot';
        const indexInput = document.createElement('input');
        indexInput.className = 'block-input';
        indexInput.placeholder = 'index';
        indexInput.value = getExpressionLabel(payload.index as ExpressionNode | undefined);
        indexSlot.appendChild(indexInput);

        const open = document.createElement('span');
        open.textContent = '[';
        const close = document.createElement('span');
        close.textContent = ']';

        label.append(nameInput, open, indexSlot, close);

        const update = () => {
            updateBlockPayload(block, {
                name: nameInput.value.trim() || 'arr',
                index: buildExpressionFromSlot(indexSlot)
            });
        };

        nameInput.addEventListener('input', update);
        indexInput.addEventListener('input', update);
        setupExpressionSlot(indexSlot, update);
        renderExpressionSlot(indexSlot, payload.index as ExpressionNode | undefined);
        update();
    } else if (def.kind === 'assign') {
        const leftSlot = document.createElement('div');
        leftSlot.className = 'block-slot';
        const leftInput = document.createElement('input');
        leftInput.className = 'block-input';
        leftInput.placeholder = 'target';
        leftInput.value = getExpressionLabel(payload.target as ExpressionNode | undefined) || 'x';
        leftSlot.appendChild(leftInput);

        const equals = document.createElement('span');
        equals.textContent = ' = ';

        const rightSlot = document.createElement('div');
        rightSlot.className = 'block-slot';
        const rightInput = document.createElement('input');
        rightInput.className = 'block-input';
        rightInput.placeholder = 'value';
        const currentExpression = payload.expression as ExpressionNode | undefined;
        rightInput.value = getExpressionLabel(currentExpression) || '0';
        rightSlot.appendChild(rightInput);

        label.append(leftSlot, equals, rightSlot);

        const update = () => {
            const target = buildExpressionFromSlot(leftSlot);
            const expression = buildExpressionFromSlot(rightSlot);
            updateBlockPayload(block, { target, expression });
        };

        leftInput.addEventListener('input', update);
        rightInput.addEventListener('input', update);
        setupExpressionSlot(leftSlot, update);
        setupExpressionSlot(rightSlot, update);
        renderExpressionSlot(leftSlot, payload.target as ExpressionNode | undefined);
        renderExpressionSlot(rightSlot, payload.expression as ExpressionNode | undefined);
        update();
    } else if (def.kind === 'print') {
        const prefix = document.createElement('span');
        prefix.textContent = 'print ';

        const valueSlot = document.createElement('div');
        valueSlot.className = 'block-slot';
        const valueInput = document.createElement('input');
        valueInput.className = 'block-input';
        valueInput.placeholder = 'value';
        valueInput.value = getExpressionLabel(payload.value as ExpressionNode | undefined);
        valueSlot.appendChild(valueInput);

        label.append(prefix, valueSlot);

        const update = () => {
            updateBlockPayload(block, { value: buildExpressionFromSlot(valueSlot) });
        };
        valueInput.addEventListener('input', update);
        setupExpressionSlot(valueSlot, update);
        renderExpressionSlot(valueSlot, payload.value as ExpressionNode | undefined);
        update();
    } else if (def.kind === 'for') {
        label.textContent = 'for';
        const meta = document.createElement('div');
        meta.className = 'block-meta';

        const initSlot = document.createElement('div');
        initSlot.className = 'block-slot';
        const initInput = document.createElement('input');
        initInput.className = 'block-input';
        initInput.placeholder = 'drop var/assign';
        initInput.readOnly = true;
        initInput.value = typeof payload.init === 'string' ? payload.init : '';
        initSlot.appendChild(initInput);

        const condSlot = document.createElement('div');
        condSlot.className = 'block-slot';
        const condInput = document.createElement('input');
        condInput.className = 'block-input';
        condInput.placeholder = 'drop expression or value';
        condInput.value = getExpressionLabel(payload.condition as ExpressionNode | undefined);
        condSlot.appendChild(condInput);

        const stepSlot = document.createElement('div');
        stepSlot.className = 'block-slot';
        const stepInput = document.createElement('input');
        stepInput.className = 'block-input';
        stepInput.placeholder = 'drop assign';
        stepInput.readOnly = true;
        stepInput.value = typeof payload.step === 'string' ? payload.step : '';
        stepSlot.appendChild(stepInput);

        meta.append(initSlot, condSlot, stepSlot);
        block.appendChild(meta);

        const update = () => {
            updateBlockPayload(block, {
                init: buildStatementFromSlot(initSlot),
                condition: buildExpressionFromSlot(condSlot),
                step: buildStatementFromSlot(stepSlot)
            });
        };

        initInput.addEventListener('input', update);
        condInput.addEventListener('input', update);
        stepInput.addEventListener('input', update);
        setupExpressionSlot(initSlot, update);
        setupExpressionSlot(condSlot, update);
        setupExpressionSlot(stepSlot, update);
        renderStatementSlot(initSlot, payload.init as StatementNode | null | undefined);
        renderExpressionSlot(condSlot, payload.condition as ExpressionNode | undefined);
        renderStatementSlot(stepSlot, payload.step as StatementNode | null | undefined);
        update();
    } else {
        label.textContent = getBlockCaption(def.kind, payload, def.label);
    }

    if (def.kind === 'compare' || def.kind === 'math' || def.kind === 'logic') {
        label.textContent = '';

        const operatorSelect = document.createElement('select');
        operatorSelect.className = 'block-select';
        const operatorOptions = def.kind === 'compare'
            ? ['>', '<', '>=', '<=', '==', '!=']
            : def.kind === 'logic'
                ? ['&&', '||']
                : ['+', '-', '*', '/', '%'];
        operatorOptions.forEach((op) => {
            const option = document.createElement('option');
            option.value = op;
            option.textContent = op;
            if (payload.operator === op) {
                option.selected = true;
            }
            operatorSelect.appendChild(option);
        });

        const leftSlot = document.createElement('div');
        leftSlot.className = 'block-slot';
        const leftInput = document.createElement('input');
        leftInput.className = 'block-input';
        leftInput.value = getExpressionLabel(payload.left as ExpressionNode | undefined) || '0';
        leftSlot.appendChild(leftInput);

        const rightSlot = document.createElement('div');
        rightSlot.className = 'block-slot';
        const rightInput = document.createElement('input');
        rightInput.className = 'block-input';
        rightInput.value = getExpressionLabel(payload.right as ExpressionNode | undefined) || '0';
        rightSlot.appendChild(rightInput);

        label.append(leftSlot, operatorSelect, rightSlot);

        const update = () => {
            updateBlockPayload(block, {
                left: buildExpressionFromSlot(leftSlot),
                operator: operatorSelect.value,
                right: buildExpressionFromSlot(rightSlot)
            });
        };

        leftInput.addEventListener('input', update);
        rightInput.addEventListener('input', update);
        operatorSelect.addEventListener('change', update);

        setupExpressionSlot(leftSlot, update);
        setupExpressionSlot(rightSlot, update);
        renderExpressionSlot(leftSlot, payload.left as ExpressionNode | undefined);
        renderExpressionSlot(rightSlot, payload.right as ExpressionNode | undefined);
        update();
    }

    if (def.kind === 'not') {
        label.textContent = '';

        const notLabel = document.createElement('span');
        notLabel.textContent = 'not ';

        const operandSlot = document.createElement('div');
        operandSlot.className = 'block-slot';
        const operandInput = document.createElement('input');
        operandInput.className = 'block-input';
        operandInput.value = getExpressionLabel(payload.operand as ExpressionNode | undefined) || '0';
        operandSlot.appendChild(operandInput);

        label.append(notLabel, operandSlot);

        const update = () => {
            updateBlockPayload(block, { operand: buildExpressionFromSlot(operandSlot) });
        };

        operandInput.addEventListener('input', update);
        setupExpressionSlot(operandSlot, update);
        renderExpressionSlot(operandSlot, payload.operand as ExpressionNode | undefined);
        update();
    }

    if (def.hasCondition) {
        const condition = document.createElement('div');
        condition.className = 'block-condition';
        const labelText = document.createElement('span');
        labelText.textContent = 'condition: ';

        const conditionSlot = document.createElement('div');
        conditionSlot.className = 'block-slot';
        const conditionInput = document.createElement('input');
        conditionInput.className = 'block-input';
        conditionInput.placeholder = 'drop expression';
        const conditionValue = payload.condition as ExpressionNode | undefined;
        conditionInput.value = getExpressionLabel(conditionValue);
        conditionSlot.appendChild(conditionInput);

        condition.append(labelText, conditionSlot);
        block.appendChild(condition);
        const updateCondition = () => {
            const payloadRaw = block.dataset.blockPayload;
            if (!payloadRaw) {
                return;
            }
            const nextPayload = JSON.parse(payloadRaw) as Record<string, unknown>;
            nextPayload.condition = buildExpressionFromSlot(conditionSlot);
            block.dataset.blockPayload = JSON.stringify(nextPayload);
        };

        conditionInput.addEventListener('input', updateCondition);
        setupExpressionSlot(conditionSlot, updateCondition);
        renderExpressionSlot(conditionSlot, conditionValue);
    }

    if (def.isContainer) {
        const body = document.createElement('div');
        body.className = 'block-body';
        block.appendChild(body);
        setupDropZone(body);
    }

    if (def.hasElse) {
        const elseWrap = document.createElement('div');
        elseWrap.className = 'block-else';

        const elseLabel = document.createElement('div');
        elseLabel.className = 'block-else-label';
        elseLabel.textContent = 'else';

        const elseBody = document.createElement('div');
        elseBody.className = 'block-else-body';
        setupDropZone(elseBody);

        elseWrap.append(elseLabel, elseBody);
        block.appendChild(elseWrap);
    }

    if (!isPrototype) {
        block.dataset.workspaceBlockId = createWorkspaceBlockId();
    }

    block.addEventListener('dragstart', (event) => {
        if (!event.dataTransfer) {
            return;
        }

        event.stopPropagation();

        const data = {
            type: isPrototype ? 'prototype' : 'workspace',
            kind: def.kind,
            payload: block.dataset.blockPayload,
            workspaceId: block.dataset.workspaceBlockId
        };

        event.dataTransfer.setData('application/json', JSON.stringify(data));
    });

    return block;
}

// Workspace drop zones
function setupDropZone(zone: HTMLElement): void {
    zone.addEventListener('dragover', (event) => {
        event.stopPropagation();
        event.preventDefault();
        zone.classList.add('drop-target');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drop-target');
    });

    zone.addEventListener('drop', (event) => {
        event.stopPropagation();
        event.preventDefault();
        zone.classList.remove('drop-target');

        const raw = event.dataTransfer?.getData('application/json');
        if (!raw) {
            return;
        }

        const payload = JSON.parse(raw) as { type: 'prototype' | 'workspace'; kind: BlockKind; payload?: string; workspaceId?: string };

        if (payload.type === 'prototype' && payload.payload) {
            const def = tryGetDefinition(payload.kind);
            if (!def) {
                return;
            }
            const blockPayload = JSON.parse(payload.payload) as Readonly<Record<string, unknown>>;
            const element = createBlockElement(def, blockPayload, false);
            zone.appendChild(element);
            return;
        }

        if (payload.type === 'workspace' && payload.workspaceId) {
            const existing = document.querySelector(`[data-workspace-block-id="${payload.workspaceId}"]`) as HTMLElement | null;
            if (existing) {
                zone.appendChild(existing);
            }
        }
    });
}

// Toolbox and run UI
function setupAdapterUI(): void {
    const runProgramButton = document.querySelector('#run-program-btn');
    const loadBubbleButton = document.querySelector('#load-bubble-btn');

    if (!(runProgramButton instanceof HTMLButtonElement)
        || !(runOutput instanceof HTMLElement)) {
        return;
    }

    if (loadBubbleButton instanceof HTMLButtonElement) {
        loadBubbleButton.addEventListener('click', () => {
            loadBubbleSortPreset(workspaceRoot, (kind, payload) => {
                const def = getDefinition(kind);
                return createBlockElement(def, payload, false);
            });
        });
    }

    runProgramButton.addEventListener('click', () => {
        try {
            const runner = new Program();
            if (workspaceRoot) {
                workspaceRoot.querySelectorAll(':scope > .block').forEach((block) => {
                    const executable = buildExecutableFromElement(block as HTMLElement, runner, runner.scope as Scope);
                    runner.blocks.addBlock(executable);
                });
            }

            runner.execute();

            const result: DraftRunResult = {
                memory: buildMemorySnapshot(runner.scope as Scope),
                executedBlockIds: [...runner.executedBlockIds],
                warnings: runner.diagnostics.filter(item => item.severity === 'warning').map(item => item.message),
                diagnostics: runner.diagnostics.map(item => ({
                    blockId: item.blockId,
                    workspaceBlockId: '',
                    severity: item.severity,
                    message: item.message
                })),
                output: [...runner.output],
                returnValue: undefined
            };

            runOutput.textContent = JSON.stringify(result, null, 2);
        } catch (error) {
            runOutput.textContent = error instanceof Error ? error.stack ?? error.message : String(error);
        }
    });
}

function renderFlyout(category: string): void {
    if (!toolboxRoot) {
        return;
    }

    toolboxRoot.innerHTML = '';
    blockDefinitions
        .filter(def => def.category === category)
        .forEach(def => {
            const element = createBlockElement(def, def.defaultPayload, true);
            toolboxRoot.appendChild(element);
        });
}

function createToolbox(): void {
    if (!categoryRoot || !toolboxRoot) {
        return;
    }

    categoryRoot.innerHTML = '';
    const categories = Array.from(new Set(blockDefinitions.map(item => item.category)));

    categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category;
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-button').forEach((el) => el.classList.remove('active'));
            button.classList.add('active');
            renderFlyout(category);
        });
        categoryRoot.appendChild(button);

        if (index === 0) {
            button.classList.add('active');
            renderFlyout(category);
        }
    });
}

// App init
document.addEventListener('DOMContentLoaded', () => {
    createToolbox();
    setupAdapterUI();

    const themeToggle = document.querySelector('#theme-toggle') as HTMLButtonElement | null;
    if (themeToggle) {
        const applyTheme = (theme: 'light' | 'dark') => {
            document.body.dataset.theme = theme;
            themeToggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
        };
        const initialTheme = document.body.dataset.theme === 'dark' ? 'dark' : 'light';
        applyTheme(initialTheme);
        themeToggle.addEventListener('click', () => {
            const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    if (workspaceRoot) {
        setupDropZone(workspaceRoot);
    }

    if (toolboxRoot) {
        setupDeleteZone(toolboxRoot);
    }
    if (categoryRoot) {
        setupDeleteZone(categoryRoot);
    }
});
