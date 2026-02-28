import { auth, db } from "./firebase.js";
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    where, 
    deleteDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- Functions ---

// 1. Add a new Task
window.addTodo = async function() {
    const todoInput = document.getElementById("todoText");
    const taskName = todoInput.value.trim();
    const user = auth.currentUser;

    if (taskName === "") return alert("Please enter a task!");
    if (!user) return alert("You must be logged in!");

    try {
        await addDoc(collection(db, "todos"), {
            text: taskName,
            userId: user.uid,
            createdAt: new Date()
        });
        todoInput.value = ""; // Clear input
    } catch (error) {
        console.error("Error adding task: ", error);
    }
};

// 2. Delete a Task
window.deleteTodo = async function(id) {
    try {
        await deleteDoc(doc(db, "todos", id));
    } catch (error) {
        console.error("Error deleting task: ", error);
    }
};

// 3. Listen for Real-time Updates
auth.onAuthStateChanged((user) => {
    if (user) {
        const q = query(collection(db, "todos"), where("userId", "==", user.uid));
        
        // This updates the list automatically whenever the database changes
        onSnapshot(q, (snapshot) => {
            const todoList = document.getElementById("todoList");
            todoList.innerHTML = ""; // Clear current list

            snapshot.forEach((doc) => {
                const todo = doc.data();
                const todoDiv = document.createElement("div");
                todoDiv.className = "todo-item";
                todoDiv.innerHTML = `
                    <span>${todo.text}</span>
                    <button onclick="deleteTodo('${doc.id}')">Done</button>
                `;
                todoList.appendChild(todoDiv);
            });
        });
    }
<<<<<<< HEAD
});
=======
}

function addTodo() {
    const input = document.getElementById("todoText");
    const text = input.value.trim();
    if (text === "") return;

    const todoList = document.getElementById("todoList");

    const item = document.createElement("div");
    item.className = "todo-item";

    item.innerHTML = `
        <span>${text}</span>
        <div class="todo-actions">
            <button onclick="toggleComplete(this)">✔</button>
            <button onclick="deleteTodo(this)">🗑</button>
        </div>
    `;

    todoList.appendChild(item);
    input.value = "";
}

function toggleComplete(button) {
    const item = button.closest(".todo-item");
    item.classList.toggle("completed");

    updateStreak();
}

function deleteTodo(button) {
    button.closest(".todo-item").remove();
}

const db = getFirestore();

async function updateDailyStreak() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    const today = new Date().toISOString().split("T")[0];

    if (!docSnap.exists()) return;

    let { streak, lastCompletedDate } = docSnap.data();

    if (lastCompletedDate === today) {
        return; // already counted today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastCompletedDate === yesterdayStr) {
        streak += 1;
    } else {
        streak = 1; // reset streak
    }

    await updateDoc(userRef, {
        streak,
        lastCompletedDate: today
    });

    document.getElementById("streakCount").textContent = streak;
}

function checkAllCompleted() {
    const todos = document.querySelectorAll(".todo-item");
    const completed = document.querySelectorAll(".todo-item.completed");

    if (todos.length > 0 && todos.length === completed.length) {
        updateDailyStreak();
    }
}

function toggleComplete(button) {
    const item = button.closest(".todo-item");
    item.classList.toggle("completed");
    checkAllCompleted();
}
import { auth, db } from "./firebase.js";
import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.addTodo = async function () {

    const text = document.getElementById("todoText").value;

    if (!text) return;

    const user = auth.currentUser;

    await addDoc(collection(db, "habits"), {
        uid: user.uid,
        text: text,
        createdAt: new Date()
    });

    alert("Habit added!");
};
>>>>>>> 54e9ea178c7e56f51a5bb4d5cf4f80a797c7299f
