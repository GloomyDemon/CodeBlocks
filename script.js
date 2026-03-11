var categoriesArray = [
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
var Block = /** @class */ (function () {
    function Block(element, isTemplate) {
        if (isTemplate === void 0) { isTemplate = false; }
        var _this = this;
        this.clone = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.handleMouseDown = function (downEvent) {
            downEvent.preventDefault();
            var rect = _this.element.getBoundingClientRect();
            _this.offsetX = downEvent.clientX - rect.left;
            _this.offsetY = downEvent.clientY - rect.top;
            if (_this.isTemplate) {
                _this.clone = _this.element.cloneNode(true);
                _this.clone.classList.add('block-draggable-clone');
                _this.clone.style.position = 'fixed';
                _this.clone.style.opacity = '0.8';
                _this.clone.style.pointerEvents = 'none';
                _this.clone.style.zIndex = '1000';
                _this.clone.style.margin = '0';
                _this.clone.style.left = (downEvent.clientX - _this.offsetX) + 'px';
                _this.clone.style.top = (downEvent.clientY - _this.offsetY) + 'px';
                document.body.appendChild(_this.clone);
            }
            else {
                _this.element.style.position = 'fixed';
                _this.element.style.left = (downEvent.clientX - _this.offsetX) + 'px';
                _this.element.style.top = (downEvent.clientY - _this.offsetY) + 'px';
                _this.element.style.zIndex = '1000';
                _this.element.style.opacity = '0.8';
                _this.element.style.pointerEvents = 'none';
            }
            document.addEventListener('mousemove', _this.handleMouseMove);
            document.addEventListener('mouseup', _this.handleMouseUp);
        };
        this.handleMouseMove = function (moveEvent) {
            moveEvent.preventDefault();
            if (_this.isTemplate) {
                if (_this.clone) {
                    _this.clone.style.left = (moveEvent.clientX - _this.offsetX) + 'px';
                    _this.clone.style.top = (moveEvent.clientY - _this.offsetY) + 'px';
                }
            }
            else {
                _this.element.style.left = (moveEvent.clientX - _this.offsetX) + 'px';
                _this.element.style.top = (moveEvent.clientY - _this.offsetY) + 'px';
            }
        };
        this.handleMouseUp = function (upEvent) {
            document.removeEventListener('mousemove', _this.handleMouseMove);
            document.removeEventListener('mouseup', _this.handleMouseUp);
            if (_this.isTemplate) {
                if (_this.clone) {
                    _this.handleTemplateDrop(upEvent);
                    _this.clone.remove();
                    _this.clone = null;
                }
            }
            else {
                _this.element.style.opacity = '1';
                _this.handlePermanentDrop(upEvent);
            }
        };
        this.handlePermanentDrop = function (upEvent) {
            var workspace = document.querySelector('.workspace');
            if (!workspace)
                return;
            var workspaceRect = workspace.getBoundingClientRect();
            var isOverWorkspace = upEvent.clientX >= workspaceRect.left && upEvent.clientX <= workspaceRect.right &&
                upEvent.clientY >= workspaceRect.top && upEvent.clientY <= workspaceRect.bottom;
            //will add other checks
            if (isOverWorkspace) {
                _this.element.style.position = 'absolute';
                _this.element.style.left = (upEvent.clientX - _this.offsetX - workspaceRect.left) + 'px';
                _this.element.style.top = (upEvent.clientY - _this.offsetY - workspaceRect.top) + 'px';
                _this.element.style.zIndex = '';
                _this.element.style.opacity = '';
                _this.element.style.pointerEvents = 'auto';
                if (!workspace.contains(_this.element)) {
                    workspace.appendChild(_this.element);
                }
            }
            else {
                _this.destroy();
                _this.element.remove();
                console.log('deleted');
            }
        };
        this.handleTemplateDrop = function (upEvent) {
            var workspace = document.querySelector('.workspace');
            if (!workspace)
                return;
            var workspaceRect = workspace.getBoundingClientRect();
            var isOverWorkspace = upEvent.clientX >= workspaceRect.left && upEvent.clientX <= workspaceRect.right &&
                upEvent.clientY >= workspaceRect.top && upEvent.clientY <= workspaceRect.bottom;
            if (isOverWorkspace) {
                var newBlock = _this.element.cloneNode(true);
                newBlock.style.margin = '0';
                newBlock.style.position = 'absolute';
                newBlock.style.left = (upEvent.clientX - _this.offsetX - workspaceRect.left) + 'px';
                newBlock.style.top = (upEvent.clientY - _this.offsetY - workspaceRect.top) + 'px';
                workspace.appendChild(newBlock);
                new Block(newBlock, false);
            }
        };
        this.destroy = function () {
            _this.element.removeEventListener('mousedown', _this.handleMouseDown);
            document.removeEventListener('mousemove', _this.handleMouseMove);
            document.removeEventListener('mouseup', _this.handleMouseUp);
            if (_this.clone && _this.clone.parentNode) {
                _this.clone.remove();
            }
            _this.element.classList.remove('block-draggable-clone');
        };
        this.element = element;
        this.isTemplate = isTemplate;
        this.element.addEventListener('mousedown', this.handleMouseDown);
    }
    return Block;
}());
function createCategory() {
    var container = document.createElement('div');
    container.className = 'category-body';
    return container;
}
function createBlockTemplate(blockData, blockColor) {
    var container = document.createElement('div');
    container.className = 'block';
    container.style.backgroundColor = blockColor;
    container.textContent = blockData;
    new Block(container, true);
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
            var blockData = category.blockArray[j];
            var blockContainer = createBlockTemplate(blockData, category.color);
            categoryContainer.appendChild(blockContainer);
        }
        blockLibrary.appendChild(categoryContainer);
    }
}
document.addEventListener('DOMContentLoaded', createBlockLibrary);
