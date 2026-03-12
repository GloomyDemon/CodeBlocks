import { runDraftProgram } from "./bridge.js";

type BlockKind = 'varDecl' | 'assign' | 'if';

type BlockTemplateData = {
    kind: BlockKind;
    label: string;
    defaultPayload: Readonly<Record<string, unknown>>;
};

type WorkspaceBlockData = {
    id: string;
    kind: BlockKind;
    payload: Readonly<Record<string, unknown>>;
    x: number;
    y: number;
};

type InterpreterBlockDraft = {
    id: number;
    workspaceBlockId: string;
    kind: BlockKind;
    payload: Readonly<Record<string, unknown>>;
    x: number;
    y: number;
};

type InterpreterProgramDraft = {
    blocks: InterpreterBlockDraft[];
};

type RuntimeMemory = Record<string, number>;

type DraftRunResult = {
    memory: RuntimeMemory;
    executedBlockIds: number[];
    warnings: string[];
    diagnostics: DraftDiagnostic[];
};

type DiagnosticSeverity = 'warning' | 'error';

type DraftDiagnostic = {
    blockId: number;
    workspaceBlockId: string;
    severity: DiagnosticSeverity;
    message: string;
};

type CategoryData = { //temp
    name: string;
    color: string;
    blockArray: BlockTemplateData[];
};

const categoriesArray: CategoryData[] = [ //temp
    {
        name: 'Variables',
        color: '#83a6da',
        blockArray: [
            { kind: 'varDecl', label: 'Declare variable', defaultPayload: { name: 'x', valueType: 'number' } }
        ]
    },
    {
        name: 'Statements',
        color: '#ec5d92',
        blockArray: [
            { kind: 'assign', label: 'Assignment', defaultPayload: { name: 'x', value: 0 } },
            { kind: 'if', label: 'If', defaultPayload: { condition: null } }
        ]
    },
    {
        name: 'Reserved',
        color: '#efd26b',
        blockArray: []
    }
];

const workspaceBlocks: WorkspaceBlockData[] = [];
let nextWorkspaceBlockId = 1;

function createWorkspaceBlockId(): string {
    return `wb-${nextWorkspaceBlockId++}`;
}

function addWorkspaceBlock(data: WorkspaceBlockData): void {
    workspaceBlocks.push(data);
}

function updateWorkspaceBlockPayload(id: string, payload: Readonly<Record<string, unknown>>): void {
    const block = workspaceBlocks.find(item => item.id === id);
    if (block) {
        block.payload = payload;
    }
}

function removeWorkspaceBlock(id: string): void {
    const index = workspaceBlocks.findIndex(block => block.id === id);
    if (index >= 0) {
        workspaceBlocks.splice(index, 1);
    }
}

function updateWorkspaceBlockPosition(id: string, x: number, y: number): void {
    const block = workspaceBlocks.find(item => item.id === id);
    if (block) {
        block.x = x;
        block.y = y;
    }
}

function getNumericIdFromWorkspaceId(workspaceId: string): number {
    if (workspaceId.startsWith('wb-')) {
        const numericPart = Number.parseInt(workspaceId.slice(3), 10);
        if (!Number.isNaN(numericPart)) {
            return numericPart;
        }
    }
    return -1;
}

function normalizePayload(kind: BlockKind, payload: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
    const source = payload as Record<string, unknown>;

    if (kind === 'varDecl') {
        const name = typeof source.name === 'string' ? source.name : 'x';
        const valueType = typeof source.valueType === 'string' ? source.valueType : 'number';
        return { name, valueType };
    }

    if (kind === 'assign') {
        const name = typeof source.name === 'string' ? source.name : 'x';
        const value = typeof source.value === 'number' ? source.value : 0;
        return { name, value };
    }

    return {
        condition: source.condition ?? null
    };
}

function getBlockCaption(kind: BlockKind, payload: Readonly<Record<string, unknown>>, fallback: string): string {
    if (kind === 'varDecl') {
        const name = typeof payload.name === 'string' ? payload.name : 'x';
        return `var ${name}`;
    }

    if (kind === 'assign') {
        const name = typeof payload.name === 'string' ? payload.name : 'x';
        const value = typeof payload.value === 'number' ? payload.value : 0;
        return `${name} = ${value}`;
    }

    if (kind === 'if') {
        return 'if (...)';
    }

    return fallback;
}

function buildInterpreterProgramDraft(): InterpreterProgramDraft {
    const orderedBlocks = [...workspaceBlocks].sort((a, b) => {
        if (a.y === b.y) {
            return a.x - b.x;
        }
        return a.y - b.y;
    });

    return {
        blocks: orderedBlocks.map((block) => ({
            id: getNumericIdFromWorkspaceId(block.id),
            workspaceBlockId: block.id,
            kind: block.kind,
            payload: normalizePayload(block.kind, block.payload),
            x: block.x,
            y: block.y
        }))
    };
}

function clearDiagnosticHighlights(): void {
    const highlighted = document.querySelectorAll('.workspace .block-warning, .workspace .block-error');
    highlighted.forEach((element) => {
        element.classList.remove('block-warning');
        element.classList.remove('block-error');
    });
}

function applyDiagnosticHighlights(diagnostics: DraftDiagnostic[]): void {
    for (const diagnostic of diagnostics) {
        const selector = `.workspace .block[data-workspace-block-id=\"${diagnostic.workspaceBlockId}\"]`;
        const blockElement = document.querySelector(selector);

        if (!(blockElement instanceof HTMLElement)) {
            continue;
        }

        if (diagnostic.severity === 'error') {
            blockElement.classList.add('block-error');
            continue;
        }

        blockElement.classList.add('block-warning');
    }
}

function setupAdapterUI(): void {
    const runAdapterButton = document.querySelector('#run-adapter-btn');
    const runProgramButton = document.querySelector('#run-program-btn');
    const adapterOutput = document.querySelector('#adapter-output');
    const runOutput = document.querySelector('#run-output');

    if (!(runAdapterButton instanceof HTMLButtonElement)
        || !(runProgramButton instanceof HTMLButtonElement)
        || !(adapterOutput instanceof HTMLElement)
        || !(runOutput instanceof HTMLElement)) {
        return;
    }

    runAdapterButton.addEventListener('click', () => {
        const programDraft = buildInterpreterProgramDraft();
        adapterOutput.textContent = JSON.stringify(programDraft, null, 2);
    });

    runProgramButton.addEventListener('click', () => {
        clearDiagnosticHighlights();

        const programDraft = buildInterpreterProgramDraft();
        const result = runDraftProgram(programDraft);
        applyDiagnosticHighlights(result.diagnostics);

        runOutput.textContent = JSON.stringify(result, null, 2);
    });
}

class Block {
    private static allPermanentBlocks: Block[] = [];

    private element: HTMLElement;
    private isTemplate: boolean;
    private clone: HTMLElement | null = null;

    private parent: Block | null = null;
    private child: Block | null = null;
    private relativeX: number = 0;
    private relativeY: number = 0;

    private offsetX: number = 0;
    private offsetY: number = 0;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private chainBlocks: Block[] = [];
    private chainStartPositions: { left: number; top: number }[] = [];

    constructor(element: HTMLElement, isTemplate: boolean = false) {
        this.element = element;
        this.isTemplate = isTemplate;

        (element as HTMLElement & { __blockInstance?: Block }).__blockInstance = this;

        if (!isTemplate) {
            Block.allPermanentBlocks.push(this);
            this.element.addEventListener('dblclick', this.handleDoubleClick);
        }

        this.element.addEventListener('mousedown', this.handleMouseDown);
    }

    private handleDoubleClick = (): void => {
        const workspaceBlockId = this.element.dataset.workspaceBlockId;
        const blockKind = this.element.dataset.blockKind as BlockKind | undefined;
        const payloadRaw = this.element.dataset.blockPayload;

        if (!workspaceBlockId || !blockKind || !payloadRaw) {
            return;
        }

        const currentPayload = JSON.parse(payloadRaw) as Readonly<Record<string, unknown>>;
        let nextPayload: Readonly<Record<string, unknown>> | null = null;

        if (blockKind === 'varDecl') {
            const currentName = typeof currentPayload.name === 'string' ? currentPayload.name : 'x';
            const inputName = prompt('Variable name:', currentName);
            if (inputName === null) {
                return;
            }

            nextPayload = {
                name: inputName.trim(),
                valueType: 'number'
            };
        }

        if (blockKind === 'assign') {
            const currentName = typeof currentPayload.name === 'string' ? currentPayload.name : 'x';
            const currentValue = typeof currentPayload.value === 'number' ? currentPayload.value : 0;

            const inputName = prompt('Assignment target variable:', currentName);
            if (inputName === null) {
                return;
            }

            const inputValue = prompt('Assignment value (number):', String(currentValue));
            if (inputValue === null) {
                return;
            }

            nextPayload = {
                name: inputName.trim(),
                value: Number(inputValue)
            };
        }

        if (blockKind === 'if') {
            const currentCondition = typeof currentPayload.condition === 'string' ? currentPayload.condition : '';
            const inputCondition = prompt('If condition (draft text):', currentCondition);
            if (inputCondition === null) {
                return;
            }

            nextPayload = {
                condition: inputCondition
            };
        }

        if (!nextPayload) {
            return;
        }

        this.element.dataset.blockPayload = JSON.stringify(nextPayload);
        updateWorkspaceBlockPayload(workspaceBlockId, nextPayload);
        this.element.textContent = getBlockCaption(blockKind, nextPayload, this.element.textContent ?? blockKind);
    };

    private handleMouseDown = (downEvent: MouseEvent): void => {
        if (!this.isTemplate && downEvent.detail > 1) {
            return;
        }

        downEvent.preventDefault();

        const rect = this.element.getBoundingClientRect();
        this.offsetX = downEvent.clientX - rect.left;
        this.offsetY = downEvent.clientY - rect.top;
        this.dragStartX = downEvent.clientX;
        this.dragStartY = downEvent.clientY;

        if (this.isTemplate) {
            this.clone = this.element.cloneNode(true) as HTMLElement;
            this.clone.classList.add('block-draggable-clone');
            this.clone.style.position = 'fixed';
            this.clone.style.left = (downEvent.clientX - this.offsetX) + 'px';
            this.clone.style.top = (downEvent.clientY - this.offsetY) + 'px';
            document.body.appendChild(this.clone);
        } else {
            if (this.parent) {
                this.detachBlockFromParent();
            }

            this.chainBlocks = this.getChain();
            this.chainStartPositions = this.chainBlocks.map((block) => {
                const bounds = block.element.getBoundingClientRect();
                return { left: bounds.left, top: bounds.top };
            });

            this.chainBlocks.forEach((block, index) => {
                block.element.style.position = 'fixed';
                block.element.style.left = this.chainStartPositions[index].left + 'px';
                block.element.style.top = this.chainStartPositions[index].top + 'px';
                block.element.style.zIndex = '1000';
            });
        }

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    };

    private handleMouseMove = (moveEvent: MouseEvent): void => {
        moveEvent.preventDefault();

        if (this.isTemplate) {
            if (this.clone) {
                this.clone.style.left = (moveEvent.clientX - this.offsetX) + 'px';
                this.clone.style.top = (moveEvent.clientY - this.offsetY) + 'px';
            }
            return;
        }

        const deltaX = moveEvent.clientX - this.dragStartX;
        const deltaY = moveEvent.clientY - this.dragStartY;

        this.chainBlocks.forEach((block, index) => {
            const position = this.chainStartPositions[index];
            block.element.style.left = (position.left + deltaX) + 'px';
            block.element.style.top = (position.top + deltaY) + 'px';
        });
    };

    private handleMouseUp = (upEvent: MouseEvent): void => {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);

        if (this.isTemplate) {
            if (this.clone) {
                this.handleCloneDrop(upEvent);
                this.clone.remove();
                this.clone = null;
            }
            return;
        }

        this.chainBlocks.forEach((block) => {
            block.element.style.zIndex = '';
        });
        this.handlePermanentDrop(upEvent);
    };

    private handlePermanentDrop = (upEvent: MouseEvent): void => {
        const workspace = document.querySelector('.workspace');
        if (!(workspace instanceof HTMLElement)) {
            return;
        }

        const workspaceRect = workspace.getBoundingClientRect();
        const isOverWorkspace =
            upEvent.clientX >= workspaceRect.left && upEvent.clientX <= workspaceRect.right &&
            upEvent.clientY >= workspaceRect.top && upEvent.clientY <= workspaceRect.bottom;

        if (!isOverWorkspace) {
            this.removeBlockChain();
            return;
        }

        this.chainBlocks.forEach((block) => {
            block.element.style.visibility = 'hidden';
        });
        const elementUnderCursor = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
        this.chainBlocks.forEach((block) => {
            block.element.style.visibility = '';
        });

        let targetElement = elementUnderCursor as HTMLElement | null;
        while (targetElement && !targetElement.classList.contains('block')) {
            targetElement = targetElement.parentElement;
        }

        const targetBlock = targetElement
            ? (targetElement as HTMLElement & { __blockInstance?: Block }).__blockInstance
            : undefined;

        if (targetBlock && this.chainBlocks.indexOf(targetBlock) === -1) {
            this.chainBlocks.forEach((block) => {
                const rect = block.element.getBoundingClientRect();
                block.element.style.position = 'absolute';
                block.element.style.left = (rect.left - workspaceRect.left) + 'px';
                block.element.style.top = (rect.top - workspaceRect.top) + 'px';
            });

            const targetRect = targetBlock.element.getBoundingClientRect();
            const offsetX = 0;
            const offsetY = targetRect.height + 5;

            this.attachBlockToParent(targetBlock, offsetX, offsetY);

            const newLeft = (targetRect.left - workspaceRect.left) + offsetX;
            const newTop = (targetRect.top - workspaceRect.top) + offsetY;
            this.updatePosition(newLeft, newTop);

            this.chainBlocks.forEach((block) => {
                if (!workspace.contains(block.element)) {
                    workspace.appendChild(block.element);
                }

                const workspaceBlockId = block.element.dataset.workspaceBlockId;
                if (workspaceBlockId) {
                    const rect = block.element.getBoundingClientRect();
                    updateWorkspaceBlockPosition(workspaceBlockId, rect.left - workspaceRect.left, rect.top - workspaceRect.top);
                }
            });
            return;
        }

        this.chainBlocks.forEach((block) => {
            const rect = block.element.getBoundingClientRect();
            const left = rect.left - workspaceRect.left;
            const top = rect.top - workspaceRect.top;

            block.element.style.position = 'absolute';
            block.element.style.left = left + 'px';
            block.element.style.top = top + 'px';

            if (!workspace.contains(block.element)) {
                workspace.appendChild(block.element);
            }

            const workspaceBlockId = block.element.dataset.workspaceBlockId;
            if (workspaceBlockId) {
                updateWorkspaceBlockPosition(workspaceBlockId, left, top);
            }
        });
    };

    private handleCloneDrop = (upEvent: MouseEvent): void => {
        const workspace = document.querySelector('.workspace');
        if (!(workspace instanceof HTMLElement)) {
            return;
        }

        const workspaceRect = workspace.getBoundingClientRect();
        const isOverWorkspace =
            upEvent.clientX >= workspaceRect.left && upEvent.clientX <= workspaceRect.right &&
            upEvent.clientY >= workspaceRect.top && upEvent.clientY <= workspaceRect.bottom;

        if (!isOverWorkspace) {
            return;
        }

        if (this.clone) {
            this.clone.style.visibility = 'hidden';
        }
        const elementUnderCursor = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
        if (this.clone) {
            this.clone.style.visibility = '';
        }

        let targetElement = elementUnderCursor as HTMLElement | null;
        while (targetElement && !targetElement.classList.contains('block')) {
            targetElement = targetElement.parentElement;
        }

        const newBlockElement = this.element.cloneNode(true) as HTMLElement;
        newBlockElement.style.margin = '0';
        newBlockElement.style.position = 'absolute';

        const workspaceBlockId = createWorkspaceBlockId();
        newBlockElement.dataset.workspaceBlockId = workspaceBlockId;

        workspace.appendChild(newBlockElement);
        const newBlock = new Block(newBlockElement, false);

        const blockKind = newBlockElement.dataset.blockKind as BlockKind | undefined;
        const payloadRaw = newBlockElement.dataset.blockPayload;
        if (!blockKind || !payloadRaw) {
            return;
        }

        const parsedPayload = JSON.parse(payloadRaw) as Readonly<Record<string, unknown>>;

        if (targetElement) {
            const targetBlock = (targetElement as HTMLElement & { __blockInstance?: Block }).__blockInstance;
            if (targetBlock) {
                const targetRect = targetBlock.element.getBoundingClientRect();
                const offsetX = 0;
                const offsetY = targetRect.height + 5;

                newBlock.attachBlockToParent(targetBlock, offsetX, offsetY);

                const newLeft = (targetRect.left - workspaceRect.left) + offsetX;
                const newTop = (targetRect.top - workspaceRect.top) + offsetY;

                newBlock.element.style.left = newLeft + 'px';
                newBlock.element.style.top = newTop + 'px';
                newBlock.element.textContent = getBlockCaption(blockKind, parsedPayload, newBlock.element.textContent ?? blockKind);

                addWorkspaceBlock({
                    id: workspaceBlockId,
                    kind: blockKind,
                    payload: parsedPayload,
                    x: newLeft,
                    y: newTop
                });
                return;
            }
        }

        const x = upEvent.clientX - this.offsetX - workspaceRect.left;
        const y = upEvent.clientY - this.offsetY - workspaceRect.top;

        newBlockElement.style.left = x + 'px';
        newBlockElement.style.top = y + 'px';
        newBlockElement.textContent = getBlockCaption(blockKind, parsedPayload, newBlockElement.textContent ?? blockKind);

        addWorkspaceBlock({
            id: workspaceBlockId,
            kind: blockKind,
            payload: parsedPayload,
            x,
            y
        });
    };

    private detachBlockFromParent = (): void => {
        if (this.parent) {
            this.parent.child = null;
            this.parent = null;
        }
    };

    private attachBlockToParent = (parentBlock: Block, offsetX: number, offsetY: number): void => {
        if (this.parent) {
            this.detachBlockFromParent();
        }
        if (parentBlock.child) {
            parentBlock.child.detachBlockFromParent();
        }

        this.relativeX = offsetX;
        this.relativeY = offsetY;
        this.parent = parentBlock;
        parentBlock.child = this;
    };

    private getChain = (): Block[] => {
        const chain: Block[] = [];
        let current: Block | null = this;
        while (current) {
            chain.push(current);
            current = current.child;
        }
        return chain;
    };

    private updatePosition = (left: number, top: number): void => {
        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';

        if (this.child) {
            this.child.updatePosition(left + this.relativeX, top + this.relativeY);
        }
    };

    private removeBlockChain = (): void => {
        if (this.child) {
            this.child.removeBlockChain();
        }

        const workspaceBlockId = this.element.dataset.workspaceBlockId;
        if (workspaceBlockId) {
            removeWorkspaceBlock(workspaceBlockId);
        }

        this.destroy();
        this.element.remove();
    };

    private destroy = (): void => {
        delete (this.element as HTMLElement & { __blockInstance?: Block }).__blockInstance;

        const index = Block.allPermanentBlocks.indexOf(this);
        if (index !== -1) {
            Block.allPermanentBlocks.splice(index, 1);
        }

        this.detachBlockFromParent();
        if (this.child) {
            this.child.detachBlockFromParent();
        }

        this.element.removeEventListener('mousedown', this.handleMouseDown);
        this.element.removeEventListener('dblclick', this.handleDoubleClick);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);

        if (this.clone && this.clone.parentNode) {
            this.clone.remove();
        }

        this.element.classList.remove('block-draggable-clone');
    };
}

function createCategory() {
    const container = document.createElement('div');
    container.className = 'category-body';

    return container;
}

function createBlockTemplate(blockData: BlockTemplateData, blockColor: string) {
    const container = document.createElement('div');
    container.className = 'block';
    container.style.backgroundColor = blockColor;
    container.textContent = blockData.label;
    container.dataset.blockKind = blockData.kind;
    container.dataset.blockPayload = JSON.stringify(blockData.defaultPayload);

    new Block(container, true);

    return container;
}

function createBlockLibrary() { //from array of categories //temp
    const blockLibrary = document.querySelector('.block-categories-list');

    if (!blockLibrary){
        console.log('script error');
        return;
    }

    for (let i = 0; i < categoriesArray.length; i++) {
        const category = categoriesArray[i];

        const categoryContainer = createCategory();

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.textContent = category.name;

        categoryContainer.appendChild(categoryHeader);

        for (let j = 0; j < category.blockArray.length; j++) {
            const blockData = category.blockArray[j];
            const blockContainer = createBlockTemplate(blockData, category.color);
            categoryContainer.appendChild(blockContainer);
        }

        blockLibrary.appendChild(categoryContainer);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createBlockLibrary();
    setupAdapterUI();
});
