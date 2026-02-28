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
});