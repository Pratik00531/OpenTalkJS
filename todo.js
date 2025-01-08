const fs = require('fs');
const fileName = 'todos.txt';

if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, '');
}

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'add':
        addTask(args.slice(1).join(' '));
        break;
    case 'list':
        listTasks();
        break;
    case 'delete':
        deleteTask(args[1]);
        break;
    case 'mark':
        markTask(args[1]);
        break;
    case 'clear':
        clearTasks();
        break;
    default:
        showUsage();
        break;
}

function addTask(task) {
    if (!task.trim()) {
        console.log('Error: Task description cannot be empty.');
        return;
    }
    fs.appendFileSync(fileName, task + '\n');
    console.log('Todo added!');
}

function listTasks() {
    const content = fs.readFileSync(fileName, 'utf-8').trim();
    if (!content) {
        console.log('No tasks found.');
        return;
    }
    const tasks = content.split('\n');
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task}`);
    });
}

function deleteTask(number) {
    const taskIndex = parseInt(number) - 1;
    if (isNaN(taskIndex) || taskIndex < 0) {
        console.log('Error: Invalid task number.');
        return;
    }
    const tasks = fs.readFileSync(fileName, 'utf-8').trim().split('\n');
    if (taskIndex >= tasks.length) {
        console.log('Error: Task number out of range.');
        return;
    }
    tasks.splice(taskIndex, 1);
    fs.writeFileSync(fileName, tasks.join('\n') + (tasks.length ? '\n' : ''));
    console.log('Todo deleted!');
}

function markTask(number) {
    const taskIndex = parseInt(number) - 1;
    if (isNaN(taskIndex) || taskIndex < 0) {
        console.log('Error: Invalid task number.');
        return;
    }
    const tasks = fs.readFileSync(fileName, 'utf-8').trim().split('\n');
    if (taskIndex >= tasks.length) {
        console.log('Error: Task number out of range.');
        return;
    }
    tasks[taskIndex] += ' [completed]';
    fs.writeFileSync(fileName, tasks.join('\n') + '\n');
    console.log('Todo marked as completed!');
}

function clearTasks() {
    fs.writeFileSync(fileName, '');
    console.log('All tasks cleared!');
}

function showUsage() {
    console.log(`Usage:
  node todo.js add <task>      # Add a new task
  node todo.js list            # Display all tasks
  node todo.js delete <number> # Delete a task by its number
  node todo.js mark <number>   # Mark a task as complete
  node todo.js clear           # Delete all tasks`);
}
