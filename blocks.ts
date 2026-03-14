export type BlockKind = 'varDecl' | 'assign' | 'if' | 'ifElse' | 'while' | 'for' | 'print' | 'compare' | 'math' | 'logic' | 'not' | 'arrayAccess';

export type BlockDefinition = {
    kind: BlockKind;
    label: string;
    color: string;
    defaultPayload: Readonly<Record<string, unknown>>;
    category: string;
    isContainer?: boolean;
    hasCondition?: boolean;
    hasElse?: boolean;
};

export type BinaryOperator = '+' | '-' | '*' | '/' | '%' | '>' | '>=' | '<' | '<=' | '==' | '!=' | '&&' | '||';

export type ExpressionNode =
    | { type: 'literal'; value: number }
    | { type: 'variable'; name: string }
    | { type: 'binary'; operator: BinaryOperator; left: ExpressionNode; right: ExpressionNode }
    | { type: 'unary'; operator: '!'; operand: ExpressionNode }
    | { type: 'arrayAccess'; array: string; index: ExpressionNode };

export type StatementNode =
    | { kind: 'varDecl'; payload: Readonly<Record<string, unknown>> }
    | { kind: 'assign'; payload: Readonly<Record<string, unknown>> };

const literal = (value: number): ExpressionNode => ({ type: 'literal', value });
const variable = (name: string): ExpressionNode => ({ type: 'variable', name });

type BlockFactory = (kind: BlockKind, payload: Readonly<Record<string, unknown>>) => HTMLElement;

export const bubbleSortPreset = {
    arrayValues: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    outerLimit: 8
};

export function clearWorkspace(workspaceRoot: HTMLElement | null): void {
    if (workspaceRoot) {
        workspaceRoot.innerHTML = '';
    }
}

export function createWorkspaceBlock(createBlock: BlockFactory, kind: BlockKind, payload: Readonly<Record<string, unknown>>): HTMLElement {
    return createBlock(kind, payload);
}

export function appendToContainer(container: Element | null, block: HTMLElement): void {
    if (container) {
        container.appendChild(block);
    }
}

export function loadBubbleSortPreset(
    workspaceRoot: HTMLElement | null,
    createBlock: BlockFactory
): void {
    if (!workspaceRoot) {
        return;
    }

    clearWorkspace(workspaceRoot);

    const arrayBlock = createWorkspaceBlock(createBlock, 'varDecl', {
        name: 'array',
        valueType: 'array',
        size: bubbleSortPreset.arrayValues.length,
        values: bubbleSortPreset.arrayValues,
        elementType: 'number'
    });
    workspaceRoot.appendChild(arrayBlock);

    const outerFor = createWorkspaceBlock(createBlock, 'for', {
        init: {
            kind: 'varDecl',
            payload: { name: 'i', valueType: 'number', value: { type: 'literal', value: 0 } }
        },
        condition: {
            type: 'binary',
            operator: '<',
            left: { type: 'variable', name: 'i' },
            right: { type: 'literal', value: bubbleSortPreset.outerLimit }
        },
        step: {
            kind: 'assign',
            payload: {
                target: { type: 'variable', name: 'i' },
                expression: {
                    type: 'binary',
                    operator: '+',
                    left: { type: 'variable', name: 'i' },
                    right: { type: 'literal', value: 1 }
                }
            }
        }
    });
    workspaceRoot.appendChild(outerFor);

    const outerBody = outerFor.querySelector(':scope > .block-body');
    const innerFor = createWorkspaceBlock(createBlock, 'for', {
        init: {
            kind: 'varDecl',
            payload: { name: 'j', valueType: 'number', value: { type: 'literal', value: 0 } }
        },
        condition: {
            type: 'binary',
            operator: '<',
            left: { type: 'variable', name: 'j' },
            right: {
                type: 'binary',
                operator: '-',
                left: { type: 'literal', value: bubbleSortPreset.outerLimit },
                right: { type: 'variable', name: 'i' }
            }
        },
        step: {
            kind: 'assign',
            payload: {
                target: { type: 'variable', name: 'j' },
                expression: {
                    type: 'binary',
                    operator: '+',
                    left: { type: 'variable', name: 'j' },
                    right: { type: 'literal', value: 1 }
                }
            }
        }
    });
    appendToContainer(outerBody, innerFor);

    const innerBody = innerFor.querySelector(':scope > .block-body');
    const ifBlock = createWorkspaceBlock(createBlock, 'if', {
        condition: {
            type: 'binary',
            operator: '>',
            left: { type: 'arrayAccess', array: 'array', index: { type: 'variable', name: 'j' } },
            right: {
                type: 'arrayAccess',
                array: 'array',
                index: {
                    type: 'binary',
                    operator: '+',
                    left: { type: 'variable', name: 'j' },
                    right: { type: 'literal', value: 1 }
                }
            }
        }
    });
    appendToContainer(innerBody, ifBlock);

    const ifBody = ifBlock.querySelector(':scope > .block-body');
    const tempDecl = createWorkspaceBlock(createBlock, 'varDecl', {
        name: 'temp',
        valueType: 'number',
        value: { type: 'literal', value: 0 }
    });
    appendToContainer(ifBody, tempDecl);

    const tempAssign = createWorkspaceBlock(createBlock, 'assign', {
        target: { type: 'variable', name: 'temp' },
        expression: { type: 'arrayAccess', array: 'array', index: { type: 'variable', name: 'j' } }
    });
    appendToContainer(ifBody, tempAssign);

    const shiftLeft = createWorkspaceBlock(createBlock, 'assign', {
        target: { type: 'arrayAccess', array: 'array', index: { type: 'variable', name: 'j' } },
        expression: {
            type: 'arrayAccess',
            array: 'array',
            index: {
                type: 'binary',
                operator: '+',
                left: { type: 'variable', name: 'j' },
                right: { type: 'literal', value: 1 }
            }
        }
    });
    appendToContainer(ifBody, shiftLeft);

    const shiftRight = createWorkspaceBlock(createBlock, 'assign', {
        target: {
            type: 'arrayAccess',
            array: 'array',
            index: {
                type: 'binary',
                operator: '+',
                left: { type: 'variable', name: 'j' },
                right: { type: 'literal', value: 1 }
            }
        },
        expression: { type: 'variable', name: 'temp' }
    });
    appendToContainer(ifBody, shiftRight);

    const printFor = createWorkspaceBlock(createBlock, 'for', {
        init: {
            kind: 'varDecl',
            payload: { name: 'x', valueType: 'number', value: { type: 'literal', value: 0 } }
        },
        condition: {
            type: 'binary',
            operator: '<',
            left: { type: 'variable', name: 'x' },
            right: { type: 'literal', value: bubbleSortPreset.arrayValues.length }
        },
        step: {
            kind: 'assign',
            payload: {
                target: { type: 'variable', name: 'x' },
                expression: {
                    type: 'binary',
                    operator: '+',
                    left: { type: 'variable', name: 'x' },
                    right: { type: 'literal', value: 1 }
                }
            }
        }
    });
    workspaceRoot.appendChild(printFor);

    const printBody = printFor.querySelector(':scope > .block-body');
    const printBlock = createWorkspaceBlock(createBlock, 'print', {
        value: { type: 'arrayAccess', array: 'array', index: { type: 'variable', name: 'x' } }
    });
    appendToContainer(printBody, printBlock);
}

export const blockDefinitions: BlockDefinition[] = [
    { kind: 'varDecl', label: 'Declare variable', color: '#83a6da', defaultPayload: { name: 'x', valueType: 'number' }, category: 'Variables' },
    { kind: 'arrayAccess', label: 'Array access', color: '#83a6da', defaultPayload: { name: 'arr', index: 'i' }, category: 'Variables' },
    { kind: 'compare', label: 'Compare', color: '#5b8def', defaultPayload: { left: null, operator: '>', right: null }, category: 'Logic' },
    { kind: 'logic', label: 'Logic', color: '#5b8def', defaultPayload: { left: null, operator: '&&', right: null }, category: 'Logic' },
    { kind: 'not', label: 'Not', color: '#5b8def', defaultPayload: { operand: null }, category: 'Logic' },
    { kind: 'math', label: 'Math', color: '#f59e0b', defaultPayload: { left: null, operator: '+', right: null }, category: 'Math' },
    { kind: 'assign', label: 'Assignment', color: '#ec5d92', defaultPayload: { name: 'x', value: 0 }, category: 'Statements' },
    { kind: 'if', label: 'If', color: '#ec5d92', defaultPayload: { condition: null }, category: 'Statements', isContainer: true, hasCondition: true },
    { kind: 'ifElse', label: 'If / Else', color: '#ec5d92', defaultPayload: { condition: null, elseChildren: [] }, category: 'Statements', isContainer: true, hasCondition: true, hasElse: true },
    { kind: 'while', label: 'While', color: '#ec5d92', defaultPayload: { condition: null }, category: 'Statements', isContainer: true, hasCondition: true },
    { kind: 'for', label: 'For', color: '#ec5d92', defaultPayload: { init: null, condition: null, step: null }, category: 'Statements', isContainer: true },
    { kind: 'print', label: 'Print', color: '#ec5d92', defaultPayload: { value: '' }, category: 'Statements' }
];

export function buildExpressionFromSlot(slot: HTMLElement): ExpressionNode {
    const nested = slot.querySelector('.block') as HTMLElement | null;
    if (nested) {
        return buildExpressionFromBlock(nested);
    }

    const input = slot.querySelector(':scope > input') as HTMLInputElement | null;
    const rawValue = input?.value.trim() || '0';
    const numericValue = Number(rawValue);
    if (!Number.isNaN(numericValue)) {
        return literal(numericValue);
    }

    return variable(rawValue);
}

export function buildInitExpressionFromSlot(slot: HTMLElement): ExpressionNode {
    const nested = slot.querySelector(':scope > .block') as HTMLElement | null;
    if (nested && nested.dataset.blockKind === 'varDecl') {
        const payloadRaw = nested.dataset.blockPayload;
        if (payloadRaw) {
            const payload = JSON.parse(payloadRaw) as Record<string, unknown>;
            const name = typeof payload.name === 'string' ? payload.name : '';
            const rawValue = payload.value;
            if (!name) {
                return literal(0);
            }

            if (typeof rawValue === 'number') {
                return literal(rawValue);
            }

            return variable(name);
        }
    }

    return buildExpressionFromSlot(slot);
}

export function buildExpressionFromBlock(block: HTMLElement): ExpressionNode {
    const kind = block.dataset.blockKind as BlockKind | undefined;
    if (!kind) {
        return literal(0);
    }

    if (kind === 'compare' || kind === 'math' || kind === 'logic') {
        const operator = (block.querySelector('select') as HTMLSelectElement | null)?.value ?? '+';
        const slots = block.querySelectorAll(':scope > .block-label > .block-slot');
        const left = slots[0] ? buildExpressionFromSlot(slots[0] as HTMLElement) : literal(0);
        const right = slots[1] ? buildExpressionFromSlot(slots[1] as HTMLElement) : literal(0);
        return {
            type: 'binary',
            operator: operator as BinaryOperator,
            left,
            right
        };
    }

    if (kind === 'arrayAccess') {
        const nameInput = block.querySelector('input') as HTMLInputElement | null;
        const indexSlot = block.querySelector(':scope > .block-label > .block-slot') as HTMLElement | null;
        const name = nameInput?.value.trim() || 'arr';
        const index = indexSlot ? buildExpressionFromSlot(indexSlot) : literal(0);
        return { type: 'arrayAccess', array: name, index };
    }

    if (kind === 'assign') {
        const slots = block.querySelectorAll(':scope > .block-label > .block-slot');
        if (slots.length >= 2) {
            const left = buildExpressionFromSlot(slots[0] as HTMLElement);
            const right = buildExpressionFromSlot(slots[1] as HTMLElement);
            return left;
        }

        const payloadRaw = block.dataset.blockPayload;
        if (payloadRaw) {
            const payload = JSON.parse(payloadRaw) as Record<string, unknown>;
            const name = typeof payload.name === 'string' ? payload.name : '';
            const expression = typeof payload.expression === 'string' ? payload.expression : '';
            const value = typeof payload.value === 'number' ? payload.value : undefined;
            if (name) {
                return expression ? variable(expression) : literal(value ?? 0);
            }
        }
    }

    if (kind === 'varDecl') {
        const payloadRaw = block.dataset.blockPayload;
        if (payloadRaw) {
            const payload = JSON.parse(payloadRaw) as Record<string, unknown>;
            const name = typeof payload.name === 'string' ? payload.name : '';
            if (name) {
                return variable(name);
            }
        }
    }

    return literal(0);
}

export function getExpressionFromPayload(kind: BlockKind, payload: Record<string, unknown>): ExpressionNode | null {
    if (kind === 'assign') {
        const expression = payload.expression as ExpressionNode | undefined;
        if (expression) {
            return expression;
        }
        const value = typeof payload.value === 'number' ? payload.value : 0;
        return literal(value);
    }

    if (kind === 'varDecl') {
        const name = typeof payload.name === 'string' ? payload.name : '';
        return name ? variable(name) : null;
    }

    return null;
}
