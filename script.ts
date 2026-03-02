type BlockData = { //temp??
    text: string;
    //probably will add shape & behavior data??
};

type CategoryData = { //temp
    name: string;
    color: string;
    blockArray: BlockData[];
};

const categoriesArray: CategoryData[] = [ //temp
    {
        name: 'Category name',
        color: '#83a6da',
        blockArray: [
            { text: 'block sample' },
            { text: 'block sample' },
            { text: 'block sample' }
        ]
    },
    {
        name: 'Category name',
        color: '#ec5d92',
        blockArray: [
            { text: 'block sample' },
            { text: 'block sample' },
        ]
    },
    {
        name: 'Category name',
        color: '#efd26b',
        blockArray: [
            { text: 'block sample' },
        ]
    },
    {
        name: 'Category name',
        color: '#83a6da',
        blockArray: [
            { text: 'block sample' },
            { text: 'block sample' },
            { text: 'block sample' }
        ]
    },
    {
        name: 'Category name',
        color: '#ec5d92',
        blockArray: [
            { text: 'block sample' },
            { text: 'block sample' },
        ]
    },
    {
        name: 'Category name',
        color: '#efd26b',
        blockArray: [
            { text: 'block sample' },
        ]
    },
    {
        name: 'Category name',
        color: '#83a6da',
        blockArray: [
            { text: 'block sample' },
            { text: 'block sample' },
            { text: 'block sample' }
        ]
    },
    {
        name: 'Category name',
        color: '#ec5d92',
        blockArray: [
            { text: 'block sample' },
            { text: 'block sample' },
        ]
    },
    {
        name: 'Category name',
        color: '#efd26b',
        blockArray: [
            { text: 'block sample' },
        ]
    },
    {
        name: 'Category name',
        color: '#efd26b',
        blockArray: [
            { text: 'block sample' },
        ]
    },
    {
        name: 'Category name',
        color: '#83a6da',
        blockArray: [
            { text: 'block sample' },
            { text: 'block sample' },
            { text: 'block sample' }
        ]
    },
    {
        name: 'Category name',
        color: '#ec5d92',
        blockArray: [
            { text: 'block sample' },
            { text: 'block sample' },
        ]
    },
    {
        name: 'Category name',
        color: '#efd26b',
        blockArray: [
            { text: 'block sample' },
        ]
    }
];

function createCategory() {
    const container = document.createElement('div');
    container.className = 'category-body';

    return container;
}

function createBlockTemplate(block: BlockData, blockColor: string) {
    const container = document.createElement('div');
    container.className = 'template-block-body';
    container.style.backgroundColor = blockColor;
    container.textContent = block.text;

    container.addEventListener('mousedown', function(event) {
        event.preventDefault();
        
        const clone = container.cloneNode(true) as HTMLElement;
        
        clone.style.position = 'fixed';
        clone.style.opacity = '0.8';
        clone.style.pointerEvents = 'none';

        var startX = event.clientX, startY = event.clientY,
            newX = 0, newY = 0;

        function onMouseMove(moveEvent: MouseEvent) {
            newX = startX - event.clientX;
            newY = startY - event.clientY;

            startX = event.clientX;
            startY = event.clientY;

            clone.style.top = (clone.offsetTop - newY) + 'px';
            clone.style.left = (clone.offsetLeft - newX) + 'px';
        }

        function onMouseUp(upEvent: MouseEvent) {
            document.removeEventListener('mousemove', onMouseMove);
        }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    });

    return container;
}

function createBlockLibrary() { //from array of categories //partly temp??
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
            const block = category.blockArray[j];
            const blockContainer = createBlockTemplate(block, category.color);
            categoryContainer.appendChild(blockContainer);
        }

        blockLibrary.appendChild(categoryContainer);
    }
}

document.addEventListener('DOMContentLoaded', createBlockLibrary);