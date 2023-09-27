"use strict";

const addBtn = document.querySelector(".add-task");
const inputField = document.querySelector("input");
const todoList = document.querySelector(".todo-container > ul");
const task = document.querySelector(".task");
const removeBtns = document.querySelectorAll(".remove-task");
const tasks = document.querySelectorAll(".task");
const taskText = document.querySelectorAll(".task-field");
const msgModal = document.querySelector(".message-modal");
// Menu DOM
const fontBtn = document.querySelector(".ifa-font");
const themeBtn = document.querySelector("i.fa-palette");
const saveBtn = document.querySelector("i.fa-save");
const menuTheme = document.querySelector(".fa-palette + .menu-popout");
let themeElement = document.querySelector(".themes");

// Themes Menu
function selectTheme(e) {
  const themeID = e.target.getAttribute("ID");
  if (themeID === "blue-theme") {
    themeElement.setAttribute("href", "./themes/blue.css");
  } else if (themeID === "yellow-theme") {
    themeElement.setAttribute("href", "./themes/yellow.css");
  } else if (themeID === "purple-theme") {
    themeElement.setAttribute("href", "./themes/purple.css");
  } else if (themeID === "light-purple-theme") {
    themeElement.setAttribute("href", "./themes/light-purple.css");
  } else if (themeID === "gray-theme") {
    themeElement.setAttribute("href", "./themes/gray.css");
  }
}
menuTheme.classList.remove("active");

themeBtn.addEventListener("click", () => {
  menuTheme.classList.toggle("active");
  document.addEventListener("click", selectTheme);
});


// Save & Load task list
window.addEventListener("load", () => {
  if (localStorage.getItem("savedList")) {
    let listStateDeserialized = JSON.parse(localStorage.getItem("savedList"));
    todoList.innerHTML = listStateDeserialized;
  }
  if (localStorage.getItem("savedTheme")) {
    let themeStateDeserialized = JSON.parse(localStorage.getItem("savedTheme"));
    themeElement.setAttribute("href", themeStateDeserialized);
  }
});

function saveTaskList() {
  const listState = todoList.innerHTML;
  const themeState = themeElement.getAttribute("href");
  let listStateSerialized = JSON.stringify(listState);
  let themeStateSerialized = JSON.stringify(themeState);
  localStorage.setItem("savedList", listStateSerialized);
  localStorage.setItem("savedTheme", themeStateSerialized);
  msgModal.classList.add("show");
  setTimeout(() => msgModal.classList.remove("show"), 3000);
}

// Add timestamp
function addTimestamp() {
  let currentDate = new Date();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let year = currentDate.getFullYear();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let timeStamp = `${month}/${day}/${year} @ ${hours}:${minutes} ${ampm.toUpperCase()}`;
  return timeStamp;
}

// Add a new task
function addTask() {
  if (inputField.value != "") {
    let newTimestamp = addTimestamp();
    const newTask = document.createElement("li");
    newTask.classList.add("task");
    newTask.classList.add("draggable");
    newTask.setAttribute("draggable", true);
    newTask.innerHTML = `<input type="text" class="edit-task hide" />
    <span class="task-field"
      >${inputField.value}<span class="cross-out 1"></span
    ></span>
    <span class="timestamp">${newTimestamp}</span>
    <i class="task-btn add-edit hide fas fa-plus"></i>
    <i class="fas fa-wrench task-btn"></i>
    <i class="remove-task fas fa-trash-alt task-btn"></i>`;
    todoList.appendChild(newTask);
    inputField.value = "";
    // ---------------
    setTimeout(() => {
      newTask.style.zIndex = "1";
    }, 500);
  }
  inputField.focus();
}

// Remove a task
function removeTask(e) {
  const taskItem = e.target;
  if (taskItem.classList[0] === "remove-task") {
    setTimeout(() => {
      taskItem.parentElement.style.opacity = "0";
    }, 50);
    setTimeout(() => {
      taskItem.parentElement.remove();
    }, 400);
  }
}

// Complete a task
function complete(e) {
  const taskItem = e.target;
  if (taskItem.classList[0] === "task") {
    taskItem.classList.toggle("complete");
  } else if (
    taskItem.classList[0] === "task-field" ||
    taskItem.classList[0] === "timestamp"
  ) {
    taskItem.parentElement.classList.toggle("complete");
  }

  sortList(taskItem);
}

// Drop completed to the bottom
function sortList(completedTask) {
  let taskHolder = completedTask;
  let taskParent = completedTask.parentNode;
  if (taskHolder.classList.contains('task')) {
    taskParent.appendChild(taskHolder);
  } else if (taskHolder.classList.contains('timestamp')) {
      taskParent.parentNode.appendChild(taskHolder.parentNode);
  }
    // console.log("taskHolder ", taskHolder);
    // console.log("taskParent ", taskParent);
}


// Show or hide a task edit (edit subfunction)
function showEdit(b, c) {
  b.classList.toggle("hide");
  c.classList.toggle("hide");
}

// Add a task edit (edit subfunction)
function addEdit(a, b, c) {
  a.textContent = b.value;
  showEdit(b, c);
}

// Edit a task
function editTask(e) {
  let editBtn = e.target;
  // if wrench button clicked
  if (editBtn.classList[1] === "fa-wrench") {
    // Assign edit add button and input field
    let editTaskBtn = editBtn.previousElementSibling;
    let editTaskInput =
      editTaskBtn.previousElementSibling.previousElementSibling
        .previousElementSibling;
    // Transfer existing task string value over to edit input field
    let newTask =
      editBtn.previousElementSibling.previousElementSibling
        .previousElementSibling;
    editTaskInput.value = newTask.textContent;
    // Show edit add button and input field
    showEdit(editTaskInput, editTaskBtn);
    editTaskInput.focus();
    // Add Event listener on the Add button to add edits
    editTaskBtn.addEventListener("click", () => {
      const crossOut = document.createElement("span");
      crossOut.classList.add("cross-out");
      newTask.innerHTML = editTaskInput.value + crossOut.outerHTML;
      editTaskInput.classList.add("hide");
      editTaskBtn.classList.add("hide");
    });
    // Add event listener on "ENTER" key to add edits
    editTaskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        addEdit(newTask, editTaskInput, editTaskBtn);
      }
    });
  }
}

// DRAGGABLES
const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");
// Switching containers
containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    // Removes default cursor prevent-symbol (circle with slash through)
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    console.log(afterElement);
    // If element not above anything
    // Add/Append draggable element to the new container
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

// Event listeners
inputField.focus();
addBtn.addEventListener("click", addTask);
saveBtn.addEventListener("click", saveTaskList);
document.addEventListener("click", removeTask);
document.addEventListener("click", complete);
document.addEventListener("click", editTask);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Local Storage

// let myObj = {
//   name: "Tony",
//   age: 38,
//   state: "Arizona",
// };

// let myObjSerialized = JSON.stringify(myObj);

// localStorage.setItem("myObj", myObjSerialized);

// let myObjDeserialized = JSON.parse(localStorage.getItem("myObj"));
// console.log(myObjDeserialized);

// let myArray = [];
// myArray.push("dog");
// myArray.push("cat");
// myArray.push("worm");
// myArray.pop();

// let myArraySerialized = JSON.stringify(myArray);

// localStorage.setItem("myArray", myArraySerialized);

// let myArrayDeserialized = JSON.parse(localStorage.getItem("myArray"));
// console.log(myArrayDeserialized);
