// basic setup for now
console.log("TaskList loaded successfully!");

// later. we'll build our task logic here step by step
// TaskList Lite
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

const KEY = "tasklist-v1";
let tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem(KEY)) || [];
} catch {
  tasks = [];
}


function render() {
  list.innerHTML = tasks.map(t => `
    <li data-id="${t.id}">
      <input type="checkbox" ${t.done ? "checked" : ""}>
      <span>${t.title}</span>
      <button class="delete">Delete</button>
    </li>
  `).join("");
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}


if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    tasks.push({ id: crypto.randomUUID(), title, done: false });
    save();
    input.value = "";
    render();
  });
}

if (list) {
  list.addEventListener("click", e => {
    const li = e.target.closest("li");
    if (!li) return;
    const id = li.dataset.id;

    if (e.target.matches("input[type=checkbox]")) {
      const t = tasks.find(t => t.id === id);
      t.done = e.target.checked;
      save();
      render();
    }

    if (e.target.matches(".delete")) {
      tasks = tasks.filter(t => t.id !== id);
      save();
      render();
    }
  });
}


render();
