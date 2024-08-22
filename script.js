document.getElementById('taskForm').addEventListener('submit', addTask);
document.addEventListener('DOMContentLoaded', loadTasks);

function addTask(e) {
    e.preventDefault();
    let taskInput = document.getElementById('taskInput').value;
    if (taskInput === '') return;

    fetch('add_task.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `task=${taskInput}`
    })
    .then(response => response.text())
    .then(() => loadTasks());

    document.getElementById('taskInput').value = '';
}

function loadTasks() {
    fetch('index.php')
    .then(response => response.json())
    .then(data => {
        let taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        data.forEach(task => {
            let li = document.createElement('li');
            li.textContent = task.task;
            li.dataset.id = task.id;
            if (task.status === 'completed') li.classList.add('completed');

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete');
            deleteButton.onclick = () => deleteTask(task.id);

            li.appendChild(deleteButton);
            taskList.appendChild(li);

            li.addEventListener('click', () => toggleTask(task.id, task.status));
        });
    });
}

function deleteTask(id) {
    fetch(`delete_task.php?id=${id}`, { method: 'GET' })
    .then(() => loadTasks());
}

function toggleTask(id, status) {
    let newStatus = status === 'pending' ? 'completed' : 'pending';
    fetch('update_task.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}&status=${newStatus}`
    })
    .then(() => loadTasks());
}
