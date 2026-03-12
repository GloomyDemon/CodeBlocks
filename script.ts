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

function runDraftProgram(program: InterpreterProgramDraft): DraftRunResult {
    const memory: RuntimeMemory = {};
    const executedBlockIds: number[] = [];
    const warnings: string[] = [];
    const diagnostics: DraftDiagnostic[] = [];

    const addDiagnostic = (
        block: InterpreterBlockDraft,
        severity: DiagnosticSeverity,
        message: string
    ): void => {
        diagnostics.push({
            blockId: block.id,
            workspaceBlockId: block.workspaceBlockId,
            severity,
            message
        });
    };

    for (const block of program.blocks) {
        executedBlockIds.push(block.id);

        if (block.kind === 'varDecl') {
            const name = typeof block.payload.name === 'string' ? block.payload.name : '';
            const valueType = block.payload.valueType;

            if (!name) {
                const message = `Block #${block.id}: variable name is empty.`;
                warnings.push(message);
                addDiagnostic(block, 'error', message);
                continue;
            }

            if (valueType !== 'number') {
                const message = `Block #${block.id}: unsupported valueType \"${String(valueType)}\". Only number is supported in draft runtime.`;
                warnings.push(message);
                addDiagnostic(block, 'warning', message);
            }

            if (Object.prototype.hasOwnProperty.call(memory, name)) {
                const message = `Block #${block.id}: variable \"${name}\" redeclared. Previous value will be overwritten to 0.`;
                warnings.push(message);
                addDiagnostic(block, 'warning', message);
            }

            memory[name] = 0;
            continue;
        }

        if (block.kind === 'assign') {
            const name = typeof block.payload.name === 'string' ? block.payload.name : '';
            const value = typeof block.payload.value === 'number' ? block.payload.value : Number.NaN;

            if (!name) {
                const message = `Block #${block.id}: assignment target name is empty.`;
                warnings.push(message);
                addDiagnostic(block, 'error', message);
                continue;
            }

            if (!Object.prototype.hasOwnProperty.call(memory, name)) {
                const message = `Block #${block.id}: variable \"${name}\" is not declared. Assignment skipped.`;
                warnings.push(message);
                addDiagnostic(block, 'error', message);
                continue;
            }

            if (Number.isNaN(value)) {
                const message = `Block #${block.id}: assignment value is not a valid number.`;
                warnings.push(message);
                addDiagnostic(block, 'error', message);
                continue;
            }

            memory[name] = value;
            continue;
        }

        if (block.kind === 'if') {
            const message = `Block #${block.id}: if execution is not implemented yet in draft runtime.`;
            warnings.push(message);
            addDiagnostic(block, 'warning', message);
            continue;
        }
    }

    return { memory, executedBlockIds, warnings, diagnostics };
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
    private element: HTMLElement;
    private isTemplate: boolean; 
    private clone: HTMLElement | null = null;
    private offsetX: number = 0;
    private offsetY: number = 0;

    constructor(element: HTMLElement, isTemplate: boolean = false) {
        this.element = element;
        this.isTemplate = isTemplate;
        
        this.element.addEventListener('mousedown', this.handleMouseDown);
    }

    private handleMouseDown = (downEvent: MouseEvent): void => {
        downEvent.preventDefault();

        const rect = this.element.getBoundingClientRect();
        this.offsetX = downEvent.clientX - rect.left;
        this.offsetY = downEvent.clientY - rect.top;

        if (this.isTemplate) {
            this.clone = this.element.cloneNode(true) as HTMLElement;
            this.clone.classList.add('block-draggable-clone');
            this.clone.style.position = 'fixed';
            this.clone.style.opacity = '0.8';
            this.clone.style.pointerEvents = 'none';
            this.clone.style.zIndex = '1000';
            this.clone.style.margin = '0';
            this.clone.style.left = (downEvent.clientX - this.offsetX) + 'px';
            this.clone.style.top = (downEvent.clientY - this.offsetY) + 'px';
            
            document.body.appendChild(this.clone);
        }
        else {            
            this.element.style.position = 'fixed';
            this.element.style.left = (downEvent.clientX - this.offsetX) + 'px';
            this.element.style.top = (downEvent.clientY - this.offsetY) + 'px';
            this.element.style.zIndex = '1000';
            this.element.style.opacity = '0.8';
            this.element.style.pointerEvents = 'none';
        }

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    private handleMouseMove = (moveEvent: MouseEvent): void => {
        moveEvent.preventDefault();
        
        if (this.isTemplate) {
            if (this.clone) {
                this.clone.style.left = (moveEvent.clientX - this.offsetX) + 'px';
                this.clone.style.top = (moveEvent.clientY - this.offsetY) + 'px';
            }
        } 
        else {
            this.element.style.left = (moveEvent.clientX - this.offsetX) + 'px';
            this.element.style.top = (moveEvent.clientY - this.offsetY) + 'px';
        }
    }

    private handleMouseUp = (upEvent: MouseEvent): void => {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);

        if (this.isTemplate) {
            if (this.clone) {
                this.handleTemplateDrop(upEvent);
                this.clone.remove();
                this.clone = null;
            }
        } 
        else {
            this.element.style.opacity = '1';

            this.handlePermanentDrop(upEvent);
        }
    }
    
    private handlePermanentDrop = (upEvent: MouseEvent): void => {
        const workspace = document.querySelector('.workspace');
        if (!workspace) return;

        const workspaceRect = workspace.getBoundingClientRect();
        const isOverWorkspace = 
            upEvent.clientX >= workspaceRect.left && upEvent.clientX <= workspaceRect.right &&
            upEvent.clientY >= workspaceRect.top && upEvent.clientY <= workspaceRect.bottom;

        //will add other checks

        if (isOverWorkspace) {
            const x = upEvent.clientX - this.offsetX - workspaceRect.left;
            const y = upEvent.clientY - this.offsetY - workspaceRect.top;

            this.element.style.position = 'absolute';
            this.element.style.left = x + 'px';
            this.element.style.top = y + 'px';
            
            this.element.style.zIndex = '';
            this.element.style.opacity = '';
            this.element.style.pointerEvents = 'auto';

            if (!workspace.contains(this.element)) {
                workspace.appendChild(this.element);
            }

            const workspaceBlockId = this.element.dataset.workspaceBlockId;
            if (workspaceBlockId) {
                updateWorkspaceBlockPosition(workspaceBlockId, x, y);
            }
        }
        else {
            const workspaceBlockId = this.element.dataset.workspaceBlockId;
            if (workspaceBlockId) {
                removeWorkspaceBlock(workspaceBlockId);
            }

            this.destroy();
            this.element.remove();
            console.log('deleted');
        }
    }

    private handleTemplateDrop = (upEvent: MouseEvent): void => {
        const workspace = document.querySelector('.workspace') as HTMLElement | null;
        if (!workspace) return;

        const workspaceRect = workspace.getBoundingClientRect();
        const isOverWorkspace = 
            upEvent.clientX >= workspaceRect.left && upEvent.clientX <= workspaceRect.right &&
            upEvent.clientY >= workspaceRect.top && upEvent.clientY <= workspaceRect.bottom;

        if (isOverWorkspace) {
            const newBlock = this.element.cloneNode(true) as HTMLElement;
            const x = upEvent.clientX - this.offsetX - workspaceRect.left;
            const y = upEvent.clientY - this.offsetY - workspaceRect.top;

            newBlock.style.margin = '0';
            newBlock.style.position = 'absolute';
            newBlock.style.left = x + 'px';
            newBlock.style.top = y + 'px';

            const workspaceBlockId = createWorkspaceBlockId();
            newBlock.dataset.workspaceBlockId = workspaceBlockId;

            workspace.appendChild(newBlock);
            new Block(newBlock, false);

            const blockKind = newBlock.dataset.blockKind as BlockKind | undefined;
            const payloadRaw = newBlock.dataset.blockPayload;

            if (blockKind && payloadRaw) {
                addWorkspaceBlock({
                    id: workspaceBlockId,
                    kind: blockKind,
                    payload: JSON.parse(payloadRaw) as Readonly<Record<string, unknown>>,
                    x,
                    y
                });
            }
        }
    }

    private destroy = (): void =>{
        this.element.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        
        if (this.clone && this.clone.parentNode) {
            this.clone.remove();
        }
        
        this.element.classList.remove('block-draggable-clone');
    }
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
