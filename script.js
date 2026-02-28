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

// --- 2. Streak Logic ---
async function checkAllCompleted() {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "todos"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    const todos = [];
    snap.forEach(doc => todos.push(doc.data()));

    if (todos.length > 0 && todos.every(t => t.completed)) {
        updateDailyStreak(user.uid);
    }
}

async function updateDailyStreak(uid) {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    const today = new Date().toISOString().split("T")[0];

    if (!docSnap.exists()) return;
    let { streak, lastCompletedDate } = docSnap.data();

    if (lastCompletedDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    streak = (lastCompletedDate === yesterdayStr) ? (streak + 1) : 1;

    await updateDoc(userRef, { streak, lastCompletedDate: today });
    document.getElementById("streakCount").textContent = streak;
}

// --- 3. Social Logic ---
window.searchFriend = async function () {
    const emailInput = document.getElementById("friendSearchInput");
    const email = emailInput.value.toLowerCase().trim();
    const resultsDiv = document.getElementById("searchResults");

    if (!email) return;
    resultsDiv.innerHTML = "Searching...";

    try {
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
    } catch (e) { console.error("Search error:", e); }
};

window.connectWithUser = async function (friendId) {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
        friends: arrayUnion(friendId)
    });
    alert("Connected!");
    location.reload(); // Refresh to show new friend in list
};

// --- 4. Load Friends ---
async function loadFriendsList(userDoc) {
    const friendsListDiv = document.getElementById("friendsList");
    const friendIds = userDoc.data().friends || [];

    if (friendIds.length === 0) {
        friendsListDiv.innerHTML = "<p>No friends yet.</p>";
        return;
    }

    friendsListDiv.innerHTML = "";
    for (const id of friendIds) {
        const fSnap = await getDoc(doc(db, "users", id));
        if (fSnap.exists()) {
            const fData = fSnap.data();
            friendsListDiv.innerHTML += `
                <div class="todo-item">
                    <span><strong>${fData.email}</strong></span>
                    <span>🔥 ${fData.streak || 0}</span>
                </div>`;
        }
    }
}

// --- 5. Enhanced Friend List & Leaderboard ---

async function loadSocialFeatures(userDoc) {
    const friendsListDiv = document.getElementById("friendsList");
    const leaderboardDiv = document.getElementById("leaderboardList");
    
    const userData = userDoc.data();
    const friendIds = userData.friends || [];
    
    // We start a list with the current user included for the leaderboard
    let allSocialUsers = [{
        email: userData.email,
        streak: userData.streak || 0,
        isMe: true
    }];

    friendsListDiv.innerHTML = friendIds.length === 0 ? "<p>No friends yet.</p>" : "";
    leaderboardDiv.innerHTML = "";

    // Fetch friend data
    for (const id of friendIds) {
        const fSnap = await getDoc(doc(db, "users", id));
        if (fSnap.exists()) {
            const fData = fSnap.data();
            const friendObj = {
                email: fData.email,
                streak: fData.streak || 0,
                isMe: false
            };
            
            allSocialUsers.push(friendObj);

            // Display in Friends List
            friendsListDiv.innerHTML += `
                <div class="todo-item">
                    <span><strong>${fData.email}</strong></span>
                    <span>🔥 ${fData.streak || 0}</span>
                </div>`;
        }
    }

    // --- Leaderboard Logic ---
    // Sort users by streak (Highest to Lowest)
    allSocialUsers.sort((a, b) => b.streak - a.streak);

    allSocialUsers.forEach((user, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
        
        leaderboardDiv.innerHTML += `
            <div class="todo-item ${user.isMe ? 'my-rank' : ''}">
                <span>${medal} ${user.email} ${user.isMe ? '(You)' : ''}</span>
                <strong>${user.streak} Days</strong>
            </div>`;
    });
}