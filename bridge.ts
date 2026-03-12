type BlockKind = 'varDecl' | 'assign' | 'if';

type DiagnosticSeverity = 'warning' | 'error';

type DraftDiagnostic = {
    blockId: number;
    workspaceBlockId: string;
    severity: DiagnosticSeverity;
    message: string;
};

type RuntimeMemory = Record<string, number>;

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

export type DraftRunResult = {
    memory: RuntimeMemory;
    executedBlockIds: number[];
    warnings: string[];
    diagnostics: DraftDiagnostic[];
};

type BridgeExecutionContext = {
    memory: RuntimeMemory;
    executedBlockIds: number[];
    warnings: string[];
    diagnostics: DraftDiagnostic[];
    halted: boolean;
};

type BridgeBlockMeta = Pick<InterpreterBlockDraft, 'id' | 'workspaceBlockId' | 'kind' | 'payload'>;

interface BridgeExecutable {
    execute(context: BridgeExecutionContext): void;
}

function addBridgeDiagnostic(
    context: BridgeExecutionContext,
    block: BridgeBlockMeta,
    severity: DiagnosticSeverity,
    message: string
): void {
    context.warnings.push(message);
    context.diagnostics.push({
        blockId: block.id,
        workspaceBlockId: block.workspaceBlockId,
        severity,
        message
    });

    if (severity === 'error') {
        context.halted = true;
    }
}

class BridgeVarDeclExecutable implements BridgeExecutable {
    constructor(private readonly block: BridgeBlockMeta) {}

    execute(context: BridgeExecutionContext): void {
        const name = typeof this.block.payload.name === 'string' ? this.block.payload.name : '';
        const valueType = this.block.payload.valueType;

        if (!name) {
            addBridgeDiagnostic(context, this.block, 'error', `Block #${this.block.id}: variable name is empty.`);
            return;
        }

        if (valueType !== 'number') {
            addBridgeDiagnostic(
                context,
                this.block,
                'warning',
                `Block #${this.block.id}: unsupported valueType \"${String(valueType)}\". Only number is supported in draft runtime.`
            );
        }

        if (Object.prototype.hasOwnProperty.call(context.memory, name)) {
            addBridgeDiagnostic(
                context,
                this.block,
                'warning',
                `Block #${this.block.id}: variable \"${name}\" redeclared. Previous value will be overwritten to 0.`
            );
        }

        context.memory[name] = 0;
    }
}

class BridgeAssignExecutable implements BridgeExecutable {
    constructor(private readonly block: BridgeBlockMeta) {}

    execute(context: BridgeExecutionContext): void {
        const name = typeof this.block.payload.name === 'string' ? this.block.payload.name : '';
        const value = typeof this.block.payload.value === 'number' ? this.block.payload.value : Number.NaN;

        if (!name) {
            addBridgeDiagnostic(context, this.block, 'error', `Block #${this.block.id}: assignment target name is empty.`);
            return;
        }

        if (!Object.prototype.hasOwnProperty.call(context.memory, name)) {
            addBridgeDiagnostic(context, this.block, 'error', `Block #${this.block.id}: variable \"${name}\" is not declared. Assignment skipped.`);
            return;
        }

        if (Number.isNaN(value)) {
            addBridgeDiagnostic(context, this.block, 'error', `Block #${this.block.id}: assignment value is not a valid number.`);
            return;
        }

        context.memory[name] = value;
    }
}

class BridgeIfExecutable implements BridgeExecutable {
    constructor(private readonly block: BridgeBlockMeta) {}

    execute(context: BridgeExecutionContext): void {
        addBridgeDiagnostic(context, this.block, 'warning', `Block #${this.block.id}: if execution is not implemented yet in draft runtime.`);
    }
}

function buildBridgeProgram(program: InterpreterProgramDraft): BridgeExecutable[] {
    return program.blocks.map((block) => {
        if (block.kind === 'varDecl') {
            return new BridgeVarDeclExecutable(block);
        }

        if (block.kind === 'assign') {
            return new BridgeAssignExecutable(block);
        }

        return new BridgeIfExecutable(block);
    });
}

export function runDraftProgram(program: InterpreterProgramDraft): DraftRunResult {
    const context: BridgeExecutionContext = {
        memory: {},
        executedBlockIds: [],
        warnings: [],
        diagnostics: [],
        halted: false
    };

    const bridgeProgram = buildBridgeProgram(program);

    for (let index = 0; index < bridgeProgram.length; index++) {
        const executable = bridgeProgram[index];
        const sourceBlock = program.blocks[index];

        if (context.halted || !sourceBlock) {
            break;
        }

        context.executedBlockIds.push(sourceBlock.id);
        executable.execute(context);
    }

    return {
        memory: context.memory,
        executedBlockIds: context.executedBlockIds,
        warnings: context.warnings,
        diagnostics: context.diagnostics
    };
}
