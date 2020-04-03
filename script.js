const content = document.querySelector('.content');

const addSortListener = () => {

    const sortBtn = document.querySelector('.sort');
    const children = content.children;

    sortBtn.addEventListener('click', () => {
        if (sortBtn.classList.contains('asc')) {
            sortBtn.classList.add('dsc');
            sortBtn.classList.toggle('asc');
            sortAsc(children);
        } else if (sortBtn.classList.contains('dsc')) {
            sortBtn.classList.add('asc');
            sortBtn.classList.toggle('dsc');
            sortDsc(children);
        }
    });
};

const sortAsc = (children) => {
    for (let i = 0; i < children.length - 1; i++) {
        for (let j = 1 + i; j < children.length; j++) {

            let text1 = children[i].querySelector('label').textContent;
            let text2 = children[j].querySelector('label').textContent;

            if (text1 < text2) {
                content.insertBefore(children[j], children[i]);
            }
        }
    }
};

const sortDsc = (children) => {
    for (let i = 0; i < children.length - 1; i++) {
        for (let j = 1 + i; j < children.length; j++) {

            let text1 = children[i].querySelector('label').textContent;
            let text2 = children[j].querySelector('label').textContent;

            if (text1 > text2) {
                content.insertBefore(children[j], children[i]);
            }
        }
    }
};

const addEditListener = (item) => {
    const label = item.querySelector('label');
    label.addEventListener('click', () => {
        const labelParent = label.parentElement;
        labelParent.classList.add('editmode');
        const input = labelParent.querySelector('input');
        input.style.display = 'block';
        input.value = label.textContent;

        input.addEventListener('blur', () => {
            labelParent.classList.remove('editmode');
            label.textContent = input.value;
            input.style.display = 'none';
        })
    });
};

const addDeleteListener = (item) => {
    const deleteBtn = item.querySelector('.delete');
    deleteBtn.addEventListener('click', () => {
        deleteBtn.parentElement.remove();
        const allItems = content.querySelectorAll('.input_field');
        if (allItems.length === 0) content.classList.remove('frame');
    });
};

const addDragAndDropListener = (item) => {
    item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
        item.querySelector('input').classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        item.querySelector('input').classList.remove('dragging');
    });
};

const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('.input_field:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child};
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element;
};

const addTask = () => {
    const content = document.querySelector('.content');
    const input = document.querySelector('#input');
    const newTask = document.createElement('div');

    newTask.draggable = true;
    newTask.classList.add('input_field');
    newTask.innerHTML = `<div class="drag_n_grop"></div>
                        <div class="text">
                            <label>${input.value}</label><input type="text"/>
                        </div>
                        <div class="delete delete_in_content"></div>`;
    content.appendChild(newTask);
    content.classList.add('frame');

    addDragAndDropListener(newTask);
    addDeleteListener(newTask);
    addEditListener(newTask);
};

addSortListener();

content.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(content, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        content.appendChild(draggable);
    } else {
        content.insertBefore(draggable, afterElement);
    }
});
document.querySelector('.submit').addEventListener('click', addTask);