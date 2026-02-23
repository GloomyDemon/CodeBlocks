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
        //clone block creation
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

        //const blocksInCategoryContainer = document.createElement('div');

        //blocksInCategoryContainer.className = 'category-blocks';
        for (let j = 0; j < category.blockArray.length; j++) {
            const block = category.blockArray[j];
            const blockContainer = createBlockTemplate(block, category.color);
            categoryContainer.appendChild(blockContainer);
        }

        //categoryContainer.appendChild(blocksInCategoryContainer);
        blockLibrary.appendChild(categoryContainer);
    }
}

document.addEventListener('DOMContentLoaded', createBlockLibrary);