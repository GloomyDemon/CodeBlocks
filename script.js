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
        event.preventDefault();
        var clone = container.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.opacity = '0.8';
        clone.style.pointerEvents = 'none';
        var startX = event.clientX, startY = event.clientY, newX = 0, newY = 0;
        document.body.appendChild(clone);
        function onMouseMove(moveEvent) {
            newX = startX - event.clientX;
            newY = startY - event.clientY;
            startX = event.clientX;
            startY = event.clientY;
            clone.style.top = (clone.offsetTop - newY) + 'px';
            clone.style.left = (clone.offsetLeft - newX) + 'px';
        }
        function onMouseUp(upEvent) {
            document.removeEventListener('mousemove', onMouseMove);
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
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
        for (var j = 0; j < category.blockArray.length; j++) {
            var block = category.blockArray[j];
            var blockContainer = createBlockTemplate(block, category.color);
            categoryContainer.appendChild(blockContainer);
        }
        blockLibrary.appendChild(categoryContainer);
    }
}
document.addEventListener('DOMContentLoaded', createBlockLibrary);
