import { auth, db } from "./firebase.js";
import { 
    collection, addDoc, onSnapshot, query, where, 
    deleteDoc, doc, getDoc, updateDoc, arrayUnion, getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- 1. To-Do Logic ---
window.addTodo = async function () {
    const todoInput = document.getElementById("todoText");
    const taskName = todoInput.value.trim();
    const user = auth.currentUser;
    if (!taskName || !user) return;

    try {
        await addDoc(collection(db, "todos"), {
            text: taskName,
            userId: user.uid,
            completed: false,
            createdAt: new Date()
        });
        todoInput.value = "";
    } catch (e) { console.error("Error adding:", e); }
};

window.deleteTodo = async function (id) {
    await deleteDoc(doc(db, "todos", id));
};

window.toggleComplete = async function (id, currentState) {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, { completed: !currentState });
    checkAllCompleted();
};

// --- 2. Streak & Points Logic ---
async function checkAllCompleted() {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "todos"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    const todos = [];
    snap.forEach(doc => todos.push(doc.data()));

    if (todos.length > 0 && todos.every(t => t.completed)) {
        updateDailyStats(user.uid);
    }
}

async function updateDailyStats(uid) {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    const today = new Date().toISOString().split("T")[0];

    if (!docSnap.exists()) return;
    let { streak, points, lastCompletedDate } = docSnap.data();
    points = points || 0; // Fallback for old users

    if (lastCompletedDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    streak = (lastCompletedDate === yesterdayStr) ? (streak + 1) : 1;
    points += 10; // Award 10 points for completing the list

    await updateDoc(userRef, { 
        streak: streak, 
        points: points, 
        lastCompletedDate: today 
    });

    document.getElementById("streakCount").textContent = streak;
    // Refresh social features to show new points/streak
    loadSocialFeatures(await getDoc(userRef));
}

// --- 3. Social & Leaderboard Logic ---
window.searchFriend = async function () {
    const emailInput = document.getElementById("friendSearchInput");
    const email = emailInput.value.toLowerCase().trim();
    const resultsDiv = document.getElementById("searchResults");
    if (!email) return;

    resultsDiv.innerHTML = "Searching...";
    const q = query(collection(db, "users"), where("email", "==", email));
    const snap = await getDocs(q);

    resultsDiv.innerHTML = snap.empty ? "No user found." : "";
    snap.forEach((userDoc) => {
        resultsDiv.innerHTML += `
            <div class="todo-item">
                <span>${userDoc.data().email}</span>
                <button onclick="connectWithUser('${userDoc.id}')">Connect</button>
            </div>`;
    });
};

window.connectWithUser = async function (friendId) {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), { friends: arrayUnion(friendId) });
    alert("Connected!");
    location.reload();
};

async function loadSocialFeatures(userDoc) {
    const friendsListDiv = document.getElementById("friendsList");
    const leaderboardDiv = document.getElementById("leaderboardList");
    const userData = userDoc.data();
    const friendIds = userData.friends || [];
    
    let allSocialUsers = [{
        email: userData.email,
        streak: userData.streak || 0,
        points: userData.points || 0,
        isMe: true
    }];

    friendsListDiv.innerHTML = "";
    leaderboardDiv.innerHTML = "";

    for (const id of friendIds) {
        const fSnap = await getDoc(doc(db, "users", id));
        if (fSnap.exists()) {
            const fData = fSnap.data();
            allSocialUsers.push({
                email: fData.email,
                streak: fData.streak || 0,
                points: fData.points || 0,
                isMe: false
            });

            friendsListDiv.innerHTML += `
                <div class="todo-item">
                    <span><strong>${fData.email}</strong></span>
                    <span>🔥 ${fData.streak || 0}</span>
                </div>`;
        }
    }

    // Sort by Points (Primary) then Streak (Secondary)
    allSocialUsers.sort((a, b) => b.points - a.points || b.streak - a.streak);

    allSocialUsers.forEach((user, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
        leaderboardDiv.innerHTML += `
            <div class="todo-item ${user.isMe ? 'my-rank' : ''}">
                <span>${medal} ${user.email}</span>
                <strong>${user.points} pts (🔥${user.streak})</strong>
            </div>`;
    });
}

// --- 4. Auth Listener ---
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            document.getElementById("streakCount").textContent = userSnap.data().streak || 0;
            loadSocialFeatures(userSnap);
        }

        const q = query(collection(db, "todos"), where("userId", "==", user.uid));
        onSnapshot(q, (snapshot) => {
            const list = document.getElementById("todoList");
            list.innerHTML = "";
            snapshot.forEach((d) => {
                const todo = d.data();
                const item = document.createElement("div");
                item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                item.innerHTML = `
                    <span onclick="toggleComplete('${d.id}', ${todo.completed})">${todo.text}</span>
                    <button onclick="deleteTodo('${d.id}')">🗑</button>
                `;
                list.appendChild(item);
            });
        });
    }
});