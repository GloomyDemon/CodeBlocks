type CategoryData = { //temp
    name: string;
    color: string;
    blockArray: string[];
};

const categoriesArray: CategoryData[] = [ //temp
    {
        name: 'Category 1',
        color: '#83a6da',
        blockArray: ['1', '2', '3']
    },
    {
        name: 'Category 2',
        color: '#ec5d92',
        blockArray: ['1', '2']
    },
    {
        name: 'Category 3',
        color: '#efd26b',
        blockArray: ['1', '2']
    }
];

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
             this.element.style.position = 'absolute';
            this.element.style.left = (upEvent.clientX - this.offsetX - workspaceRect.left) + 'px';
            this.element.style.top = (upEvent.clientY - this.offsetY - workspaceRect.top) + 'px';
            
            this.element.style.zIndex = '';
            this.element.style.opacity = '';
            this.element.style.pointerEvents = 'auto';

            if (!workspace.contains(this.element)) {
                workspace.appendChild(this.element);
            }
        }
        else {
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
            newBlock.style.margin = '0';
            newBlock.style.position = 'absolute';
            newBlock.style.left = (upEvent.clientX - this.offsetX - workspaceRect.left) + 'px';
            newBlock.style.top = (upEvent.clientY - this.offsetY - workspaceRect.top) + 'px';

            workspace.appendChild(newBlock);
            new Block(newBlock, false);
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

function createBlockTemplate(blockData: string, blockColor: string) {
    const container = document.createElement('div');
    container.className = 'block';
    container.style.backgroundColor = blockColor;
    container.textContent = blockData;

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

document.addEventListener('DOMContentLoaded', createBlockLibrary);
