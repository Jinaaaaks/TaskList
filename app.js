const KEY = "tasklist-v1";

// elements
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const search = document.getElementById("searchInput");
const statusSel = document.getElementById("statusFilter");
const clearBtn = document.getElementById("clearDone");

// state
let tasks = [];
let query = "";
let filterStatus = "all";

// load from storage
try {
  tasks = JSON.parse(localStorage.getItem(KEY)) || [];
} catch {
  tasks = [];
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

function render() {
  const filtered = tasks.filter(t => {
    const matchText = t.title.toLowerCase().includes(query);
    const matchStatus = filterStatus === "all"
      ? true
      : filterStatus === "done"
        ? t.done
        : !t.done;
    return matchText && matchStatus;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<li class="empty">No tasks. Add one, or change filters.</li>`;
    return;
  }

  list.innerHTML = filtered.map(t => `
    <li data-id="${t.id}" class="${t.done ? "done" : ""}">
      <input type="checkbox" ${t.done ? "checked" : ""}>
      <span>${t.title}</span>
      <button class="delete">Delete</button>
    </li>
  `).join("");
}

// add task
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

// toggle or delete
if (list) {
  list.addEventListener("click", e => {
    const li = e.target.closest("li");
    if (!li) return;
    const id = li.dataset.id;

    if (e.target.matches("input[type=checkbox]")) {
      const t = tasks.find(t => t.id === id);
      if (!t) return;
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

// search
if (search) {
  search.addEventListener("input", e => {
    query = e.target.value.trim().toLowerCase();
    render();
  });
}

// status filter
if (statusSel) {
  statusSel.addEventListener("change", e => {
    filterStatus = e.target.value;
    render();
  });
}

// clear done
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => !t.done);
    save();
    render();
  });
}

render();
