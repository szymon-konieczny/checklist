class Task {
    constructor(config){
        this.taskName = config.taskName;
        this.taskStatus = config.taskStatus || 'To-Do';
    };
};
class List {
    constructor(){
        this.createMainDOMStructure = createMainDOMStructure;
        this.taskManage = taskManage;
        const taskListName = this.taskManage.getListName();
        this.createMainDOMStructure.createListHeader();
        this.createMainDOMStructure.createListName(taskListName);
        this.createMainDOMStructure.createInputSection(); 
        this.createMainDOMStructure.createTaskListWrapper();
        const list = document.querySelector('.list');
        
        this.taskManage.printTask();
        this.createMainDOMStructure.messageEmptyList();
    };
};
/* ---------------- TASK DOM MANAGEMENT SECTION - START ---------------- */
const createMainDOMStructure = {
    hookTheList () {
        const listHook = document.querySelector('.task-app');
        return listHook;
    },
    // Creates the header section.
    createListHeader () { 
        const list = this.hookTheList();
        const header = document.createElement('section');
        header.classList.add('header');
        list.appendChild(header);
        return header;
    },
    // Creates the list name section
    createListName (taskListName) {
        this.taskListName = taskListName;
        const header = this.createListHeader();
        const title = document.createElement('span');
        title.classList.add('title');
        title.textContent = this.taskListName;
        header.appendChild(title);
    },
    // Creates the task input section wrapper
    createInputSection () {
        const list = this.hookTheList();
        const inputWrapper = document.createElement('section');
        inputWrapper.classList.add('input-wrapper');
        list.appendChild(inputWrapper);

        // Creates the task name input field.
        function createInputField () {
            
            const todoInput = document.createElement('input');
            todoInput.classList.add('input', 'task-input');
            todoInput.setAttribute('type', 'text');
            todoInput.setAttribute('value', '');
            todoInput.setAttribute('placeholder', 'Enter task name...');
            inputWrapper.appendChild(todoInput);
        };
        // Creates the button to adding new tasks.
        function createAddButton () {
            const inputField = document.querySelector('.task-input');
            const addButton = document.createElement('button');
            addButton.classList.add('input', 'task-add');

            ['keydown', 'mousedown', 'keypress'].forEach(event => {
                addButton.addEventListener(event, () => taskManage.getNewTask());
                inputField.addEventListener(event, e => e.which === 13 ? taskManage.getNewTask() : false);
            }); 
          

            const span = document.createElement('span');
            span.classList.add('add');
            addButton.appendChild(span);
            inputWrapper.appendChild(addButton);
        };
        createInputField();
        createAddButton();
    },
    // Creates the section containing added tasks.
    createTaskListWrapper () {
        const list = this.hookTheList();
        const taskList = document.createElement('ul');
        taskList.classList.add('list');
       
        taskList.addEventListener('mousedown', e => {
            const el = e.target;
            if(el.nodeName === 'BUTTON') {  
                const taskName = el.previousSibling.textContent;
                taskManage.removeFromLS(taskName);
            };                                     
        });   
                 
        list.appendChild(taskList);
    },
    // Creates a field with added task name
    createTaskDescription () {
        const taskDescription = document.createElement('span');
        taskDescription.classList.add('task-description');
        return taskDescription;
    },
    // Enclose the 'remove task' button to listed tasks
    createRemoveTaskButton () {
        const removeTaskBtn = document.createElement('button');
        removeTaskBtn.classList.add('task-remove');
        return removeTaskBtn;
    },
    // Creates a wrapper for listed tasks (including remove button and task type and status choice)
    createTaskListItem (taskParams) {
        const taskDescription = this.createTaskDescription();
        const removeTaskBtn = this.createRemoveTaskButton();
        const taskList = document.querySelector('.list');
        const taskListItem = document.createElement('li');
        taskDescription.textContent = taskParams.taskName;
        taskList.appendChild(taskListItem);
        taskListItem.appendChild(taskDescription);
        taskListItem.appendChild(removeTaskBtn);
    },
    clearTaskList () {
        const taskList = document.querySelector('.list');
        taskList.innerHTML = '';
    },
    messageEmptyList () {
        const list = document.querySelector('.list');
        if (!list.hasChildNodes()) {
            const listName = taskManage.getListName()
            taskManage.removeListFromLS(listName);
            return list.textContent = 'Nothing to do here...';
        };
    }
    
};
/* ---------------- TASK DOM MANAGEMENT SECTION - END ---------------- */

/* ---------------- TASK MANAGEMENT SECTION - START ---------------- */
const taskManage = {
    // Gets a name of the task list
    getListName () {
        const taskListName = 'Your Tasklist'; // It will be taken from an input field, but for now it's hardcoded ;)
        return taskListName;
    },
    // Saves task to local storage
    addToLS (taskParams) {
        const listName = this.getListName();
        this.taskParams = taskParams; 
        const taskToJSON = JSON.stringify(this.taskParams);
        localStorage.setItem(listName, taskToJSON);
        this.fetchFromLS();
        createMainDOMStructure.clearTaskList();
        this.printTask();
        createMainDOMStructure.messageEmptyList();
    },
    // Fetches tasks from local storage
    fetchFromLS (){
        const listName = this.getListName();
        const listFromLS = localStorage.getItem(listName);
        const listConvertedFromJSON = JSON.parse(listFromLS);
        return listConvertedFromJSON;
    },
    // Displays current task list
    printTask () {
        
        const fromLS = this.fetchFromLS();

        if(fromLS !== null) {
            
            fromLS.forEach(task => {
                //const taskParams = task;
                createMainDOMStructure.createTaskListItem(task);
            });
        };
    },
    // Gets a new task from input field
    getNewTask () {
        
        const getItem = document.querySelector('.task-input');
        const itemVal = getItem.value;
        const array = this.fetchFromLS() || [];

        if (itemVal) {
            createMainDOMStructure.clearTaskList();
            const newTask = new Task(array);
            newTask.taskName = itemVal;
            array.push(newTask);
            this.addToLS(array);
            getItem.value = '';
        };
    },
    // Removes entire list of tasks from local storage
    removeListFromLS (listName) {
        this.listName = listName;
        localStorage.removeItem(this.listName);
    },
    // Takes an index of the choosen task to remove
    getIndexOfTask (taskName) {
        const list = this.fetchFromLS();
        let index;
        list.forEach(task => {
            const taskDesc = task.taskName
            if(taskName === taskDesc){
                index = list.indexOf(task);
            } 
        });
        return index;
    },
    // Removes the every single task you have clicked to remove
    removeFromLS (taskName) {
        const listName = this.getListName();
        taskList = this.fetchFromLS();

        const index = this.getIndexOfTask(taskName);
        const tempArray = [];

        taskList.forEach(task => {
            
            if (taskName === task.taskName) {
                return;
            }
            tempArray.push(task);
        });
        this.addToLS(tempArray);
    }
};
/* ---------------- TASK MANAGEMENT SECTION - END ---------------- */

window.onload = () => new List(taskManage.listName);