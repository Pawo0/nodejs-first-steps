const add_text = document.getElementById("add_text");
const tasks = document.getElementById("tasks");

addEventListener('DOMContentLoaded', displayTasks);

async function displayTasks(){
    const response = await fetch('/tasks');
    const data = await response.json();
    tasks.innerHTML = ""
    data.forEach(obj => {
        add_to_list(obj.task, obj.id, obj.completed);
    })
}


function add_to_list(to_add, id, completed){
    let task = document.createElement("li");
    let label = document.createElement("label");
    let input = document.createElement("input");
    let checkmark = document.createElement("span");
    let text_task = document.createElement("span");
    let del_task = document.createElement("span");
    task.classList.add("task");

    input.classList.add("task_chk");
    input.type = "checkbox";
    input.checked = completed;
    input.addEventListener('change', async() =>{
        await fetch(`/tasks/${id}`, {method : 'PATCH'})
    })

    checkmark.classList.add("checkmark");
    text_task.classList.add("text_task");
    text_task.textContent = to_add;

    label.appendChild(input);
    label.appendChild(checkmark);
    label.appendChild(text_task);
    task.appendChild(label);

    del_task.classList.add("del_task");
    del_task.textContent = "✖";
    del_task.onclick = del_from_list;
    del_task.dataset.id = id;
    task.appendChild(del_task);

    tasks.appendChild(task);

    add_text.value = "";
}

async function del_from_list() {
    await fetch(`/tasks/${this.dataset.id}`, {method:'DELETE'});
    await displayTasks();
}