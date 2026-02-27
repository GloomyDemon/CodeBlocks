var categoriesArray = [
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
    var container = document.createElement('div');
    container.className = 'category-body';
    return container;
}
function createBlockTemplate(block, blockColor) {
    var container = document.createElement('div');
    container.className = 'template-block-body';
    container.style.backgroundColor = blockColor;
    container.textContent = block.text;
    container.addEventListener('mousedown', function (event) {
        //clone block creation
    });
    return container;
}
function createBlockLibrary() {
    var blockLibrary = document.querySelector('.block-categories-list');
    if (!blockLibrary) {
        console.log('script error');
        return;
    }
    for (var i = 0; i < categoriesArray.length; i++) {
        var category = categoriesArray[i];
        var categoryContainer = createCategory();
        var categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.textContent = category.name;
        categoryContainer.appendChild(categoryHeader);
        //const blocksInCategoryContainer = document.createElement('div');
        //blocksInCategoryContainer.className = 'category-blocks';
        for (var j = 0; j < category.blockArray.length; j++) {
            var block = category.blockArray[j];
            var blockContainer = createBlockTemplate(block, category.color);
            categoryContainer.appendChild(blockContainer);
        }
        //categoryContainer.appendChild(blocksInCategoryContainer);
        blockLibrary.appendChild(categoryContainer);
    }
}
document.addEventListener('DOMContentLoaded', createBlockLibrary);
