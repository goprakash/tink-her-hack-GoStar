const form = document.getElementById("loginForm");

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        console.log("Login clicked");

        const username = document.querySelector("input[name='username']").value;
        const password = document.querySelector("input[name='password']").value;

        try {
            const response = await

                console.log("Response status:", response.status);

            const data = await response.json();
            console.log("Server returned:", data);

            if (data.token) {
                console.log("Redirecting...");
                localStorage.setItem("token", data.token);
                window.location.href = "home.html";
            } else {
                alert("Invalid username or password");
            }

        } catch (err) {
            console.error("Error:", err);
            alert("Backend not reachable");
        }
    });
}

let streak = 0;

function updateStreak() {
    const todos = document.querySelectorAll(".todo-item");
    const completed = document.querySelectorAll(".todo-item.completed");

    if (todos.length > 0 && todos.length === completed.length) {
        streak++;
        document.getElementById("streakCount").textContent = streak;

        // Prevent double counting
        todos.forEach(todo => {
            todo.classList.add("counted");
        });
    }
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