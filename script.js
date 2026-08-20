// ========================================
// GET HTML ELEMENTS
// ========================================

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

const searchInput = document.getElementById("searchInput");

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

const clearBtn = document.getElementById("clearBtn");


// ========================================
// TASK DATA
// ========================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ========================================
// ADD TASK
// ========================================

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});


function addTask() {

    const text = taskInput.value.trim();

    const priority = priorityInput.value;

    const dueDate = dueDateInput.value;


    // Check task
    if (text === "") {

        alert("Please enter a task!");

        taskInput.focus();

        return;
    }


    // Add task
    const newTask = {

        id: Date.now(),

        text: text,

        priority: priority,

        dueDate: dueDate,

        completed: false

    };


    tasks.push(newTask);


    // Save
    saveTasks();


    // Display
    renderTasks();


    // Clear inputs
    taskInput.value = "";

    dueDateInput.value = "";


    // Focus
    taskInput.focus();

}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks() {

    taskList.innerHTML = "";


    const searchText = searchInput.value
        .toLowerCase()
        .trim();


    tasks.forEach(function (task) {


        // =================================
        // SEARCH
        // =================================

        if (
            !task.text
                .toLowerCase()
                .includes(searchText)
        ) {

            return;

        }


        // =================================
        // FILTER
        // =================================

        if (
            currentFilter === "active" &&
            task.completed
        ) {

            return;

        }


        if (
            currentFilter === "completed" &&
            !task.completed
        ) {

            return;

        }


        // =================================
        // CREATE TASK ITEM
        // =================================

        const li = document.createElement("li");


        // =================================
        // COMPLETED CLASS
        // =================================

        if (task.completed) {

            li.classList.add("completed-task");

        }


        // =================================
        // TASK CONTENT
        // =================================

        const taskContent = document.createElement("div");

        taskContent.className = "task-content";


        // =================================
        // TASK TEXT
        // =================================

        const span = document.createElement("span");

        span.textContent = task.text;

        span.className = "task-text";


        if (task.completed) {

            span.classList.add("completed");

        }


        // =================================
        // CLICK TASK TO COMPLETE
        // =================================

        span.addEventListener("click", function () {

            task.completed = !task.completed;

            saveTasks();

            renderTasks();

        });


        taskContent.appendChild(span);


        // =================================
        // DUE DATE
        // =================================

        if (task.dueDate) {

            const dateElement = document.createElement("small");

            dateElement.textContent =
                "📅 Due: " + task.dueDate;


            dateElement.className = "due-date";


            taskContent.appendChild(dateElement);

        }


        // =================================
        // PRIORITY
        // =================================

        const priorityElement = document.createElement("small");


        if (task.priority === "high") {

            priorityElement.textContent = "🔴 High";

            priorityElement.className = "priority high";

        }

        else if (task.priority === "medium") {

            priorityElement.textContent = "🟡 Medium";

            priorityElement.className = "priority medium";

        }

        else {

            priorityElement.textContent = "🟢 Low";

            priorityElement.className = "priority low";

        }


        taskContent.appendChild(priorityElement);


        // =================================
        // BUTTON CONTAINER
        // =================================

        const buttons = document.createElement("div");

        buttons.className = "buttons";


        // =================================
        // EDIT BUTTON
        // =================================

        const editBtn = document.createElement("button");

        editBtn.textContent = "Edit";

        editBtn.className = "editBtn";


        editBtn.addEventListener("click", function () {

            const newText = prompt(
                "Edit your task:",
                task.text
            );


            if (
                newText !== null &&
                newText.trim() !== ""
            ) {

                task.text = newText.trim();

                saveTasks();

                renderTasks();

            }

        });


        // =================================
        // DELETE BUTTON
        // =================================

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.className = "deleteBtn";


        deleteBtn.addEventListener("click", function () {

            const confirmDelete = confirm(
                "Are you sure you want to delete this task?"
            );


            if (confirmDelete) {

                tasks = tasks.filter(function (item) {

                    return item.id !== task.id;

                });


                saveTasks();

                renderTasks();

            }

        });


        // =================================
        // ADD BUTTONS
        // =================================

        buttons.appendChild(editBtn);

        buttons.appendChild(deleteBtn);


        // =================================
        // ADD EVERYTHING TO LI
        // =================================

        li.appendChild(taskContent);

        li.appendChild(buttons);


        // =================================
        // ADD LI TO LIST
        // =================================

        taskList.appendChild(li);

    });


    // Update counter
    updateCounter();


    // Update filter buttons
    updateFilterButtons();


    // Update progress
    updateProgress();

}


// ========================================
// ALL FILTER
// ========================================

allBtn.addEventListener("click", function () {

    currentFilter = "all";

    renderTasks();

});


// ========================================
// ACTIVE FILTER
// ========================================

activeBtn.addEventListener("click", function () {

    currentFilter = "active";

    renderTasks();

});


// ========================================
// COMPLETED FILTER
// ========================================

completedBtn.addEventListener("click", function () {

    currentFilter = "completed";

    renderTasks();

});


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener("input", function () {

    renderTasks();

});


// ========================================
// UPDATE FILTER BUTTONS
// ========================================

function updateFilterButtons() {

    allBtn.classList.remove("active-filter");

    activeBtn.classList.remove("active-filter");

    completedBtn.classList.remove("active-filter");


    if (currentFilter === "all") {

        allBtn.classList.add("active-filter");

    }


    if (currentFilter === "active") {

        activeBtn.classList.add("active-filter");

    }


    if (currentFilter === "completed") {

        completedBtn.classList.add("active-filter");

    }

}


// ========================================
// UPDATE COUNTER
// ========================================

function updateCounter() {

    const completedTasks = tasks.filter(
        function (task) {

            return task.completed;

        }
    ).length;


    taskCounter.textContent =
        `Total: ${tasks.length} | Completed: ${completedTasks}`;

}


// ========================================
// UPDATE PROGRESS
// ========================================

function updateProgress() {

    const progressText =
        document.getElementById("progressText");

    const progressBar =
        document.getElementById("progressBar");


    if (!progressText || !progressBar) {

        return;

    }


    const total = tasks.length;


    const completed = tasks.filter(
        function (task) {

            return task.completed;

        }
    ).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round((completed / total) * 100);

    }


    progressText.textContent =
        `Progress: ${percentage}%`;


    progressBar.style.width =
        percentage + "%";

}


// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ========================================
// CLEAR ALL
// ========================================

clearBtn.addEventListener("click", function () {


    if (tasks.length === 0) {

        alert("There are no tasks to clear!");

        return;

    }


    const confirmClear = confirm(
        "Are you sure you want to delete all tasks?"
    );


    if (confirmClear) {

        tasks = [];

        saveTasks();

        renderTasks();

    }

});


// ========================================
// LOAD TASKS WHEN PAGE OPENS
// ========================================

renderTasks();

// ========================================
// DARK / LIGHT MODE
// ========================================

const themeBtn = document.getElementById("themeBtn");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeBtn.textContent = "☀️ Light Mode";

}


// Toggle theme
themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");


    // Check current mode
    if (document.body.classList.contains("dark-mode")) {

        themeBtn.textContent = "☀️ Light Mode";

        localStorage.setItem("theme", "dark");

    } else {

        themeBtn.textContent = "🌙 Dark Mode";

        localStorage.setItem("theme", "light");

    }

});