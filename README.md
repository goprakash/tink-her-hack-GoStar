<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# HaBitHUB 🎯

## Basic Details

### Team Name: Gostar

### Team Members
- Member 1: Christta Ann Mathew - College of Engineering Trivandrum
- Member 2: Gopika Prakash -  College of Engineering Trivandrum

### Hosted Project Link
[mention your project hosted link here]

### Project Description
HabitHUB is a gamified social productivity platform designed to help users build lasting habits through accountability. It combines a clean to-do interface with real-time streak tracking and a competitive social leaderboard to turn daily discipline into an engaging experience.

### The Problem statement
Many people struggle to maintain consistency with new habits because solo productivity often feels lonely and lacks immediate gratification. Traditional to-do apps are functional but fail to provide the social motivation or "fun factor" needed to stay committed over long periods.

### The Solution
We solve this by introducing "Social Accountability." By allowing users to connect with friends, compare daily streaks, and earn points for completing tasks, HabitHUB transforms mundane chores into a shared journey. If you don't finish your tasks, your streak resets, and you fall behind on the leaderboard—providing the perfect "nudge" to stay productive.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: HTML5, CSS3, JavaScript (ES6+)

-Frameworks used: Firebase (BaaS)

-Libraries used: Firebase Auth, Firestore (NoSQL Database)

-Tools used: VS Code, Git, Firebase Console

## Features

List the key features of your project:
- Real-time To-Do List: Create, complete, and delete tasks with instant database syncing.

-Dynamic Streak System: Tracks daily consistency. Streaks increment only when all daily tasks are checked off.

-Friend Search & Connect: Find friends by email and add them to your inner circle.

-Live Leaderboard: A competitive ranking system that sorts you and your friends by Points and streaks.

-Gamified Points: Earn +10 points for every successful day of habit completion.

-Responsive Dashboard: A clean, mobile-friendly UI featuring a personalized welcome and habit stats.
---

## Implementation

### For Software:

#### Installation
```bash
# Clone the repository
git clone https://github.com/goprakash/tink-her-hack-GoStar.git

# Navigate to the directory
cd HabitHub

# No heavy installations required (CDN-based Firebase), but you can use a local server
npm install -g live-server
```

#### Run
```bash
# Start a local development server
live-server .
```


## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

Login Page
<img width="1919" height="901" alt="Screenshot 2026-02-28 174505" src="https://github.com/user-attachments/assets/8dbb73ea-ec88-402d-87a2-e669dafb7cd8" />

Home Page
<img width="1919" height="909" alt="Screenshot 2026-02-28 174549" src="https://github.com/user-attachments/assets/b0e772dc-ae62-4e3a-a3d2-35fbc80cacb5" />

Connect and compete with friends
<img width="799" height="878" alt="Screenshot 2026-02-28 174730" src="https://github.com/user-attachments/assets/e9817ba6-a325-4923-8e18-18df2f3f5cbd" />


#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)
The architecture can be broken down into three main layers: the Client Layer, the Backend-as-a-Service (BaaS) Layer, and the Data Persistence 
Layer.1. Client Layer (Frontend)This is what the user interacts with in their browser.Technologies: HTML5, CSS3, JavaScript (ES6+).State Management: Handled by the Firebase onAuthStateChanged listener and real-time onSnapshot listeners.Logic: * Calculating streaks (Client-side logic).Sorting the Leaderboard (Array manipulation).Handling input validation for To-Dos and Friend searches.
2. Service Layer (Firebase BaaS)This layer replaces the traditional "API Server."Firebase Authentication: Handles user sign-up, login, and session persistence. It provides the unique UID used to index all data.Firestore SDK: Acts as the bridge between your code and the database. It handles the "Websocket" connection for real-time updates (e.g., when a friend completes a task, your leaderboard updates instantly).
3. Data Persistence Layer (Database)This is where the actual JSON-like documents live.Users Collection: Stores profile data, total points, and current streaks.Todos Collection: Stores individual tasks linked to users via their userId.Security Rules: These sit in front of the data to ensure User A cannot delete User B’s tasks.
**Application Workflow:**

![Workflow](docs/workflow.png)
The Data Flow (How it works)Authentication: User logs in $\rightarrow$ Firebase Auth returns a Token $\rightarrow$ Frontend saves the UID.Task Completion: User clicks "Done" $\rightarrow$ Frontend sends updateDoc to Firestore $\rightarrow$ Firestore triggers a "Change" event.Real-time Update: The onSnapshot listener in the Frontend hears the "Change" $\rightarrow$ It triggers checkAllCompleted() $\rightarrow$ If all are done, it updates the streak in the Users Collection.Social Sync: Because your friends' Leaderboard is also listening to the Users Collection, their screen updates with your new streak immediately.



## Additional Documentation
### For Web Projects with Backend:

#### API Documentation

Collection,Document ID,Fields
users,UID,"email, streak, points, friends (array), lastCompletedDate"
todos,Auto-ID,"text, userId, completed (boolean), createdAt"

**Base URL:** no single url

##### Endpoints

**GET /api/endpoint**
- **Description:** [What it does]
- **Parameters:**
  - `param1` (string): [Description]
  - `param2` (integer): [Description]
- **Response:**
```json
{
  "status": "success",
  "data": {}
}
```

**POST /api/endpoint**
- **Description:** [What it does]
- **Request Body:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```
- **Response:**
```json
{
  "status": "success",
  "message": "Operation completed"
}
```

[Add more endpoints as needed...]

---

### For Mobile Apps:

#### App Flow Diagram

![App Flow](docs/app-flow.png)
*Explain the user flow through your application*

#### Installation Guide

**For Android (APK):**
1. Download the APK from [Release Link]
2. Enable "Install from Unknown Sources" in your device settings:
   - Go to Settings > Security
   - Enable "Unknown Sources"
3. Open the downloaded APK file
4. Follow the installation prompts
5. Open the app and enjoy!

**For iOS (IPA) - TestFlight:**
1. Download TestFlight from the App Store
2. Open this TestFlight link: [Your TestFlight Link]
3. Click "Install" or "Accept"
4. Wait for the app to install
5. Open the app from your home screen

**Building from Source:**
```bash
# For Android
flutter build apk
# or
./gradlew assembleDebug

# For iOS
flutter build ios
# or
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug
```

---


### For Scripts/CLI Tools:

#### Command Reference

**Basic Usage:**
```bash
python script.py [options] [arguments]
```

**Available Commands:**
- `command1 [args]` - Description of what command1 does
- `command2 [args]` - Description of what command2 does
- `command3 [args]` - Description of what command3 does

**Options:**
- `-h, --help` - Show help message and exit
- `-v, --verbose` - Enable verbose output
- `-o, --output FILE` - Specify output file path
- `-c, --config FILE` - Specify configuration file
- `--version` - Show version information

**Examples:**

```bash
# Example 1: Basic usage
python script.py input.txt

# Example 2: With verbose output
python script.py -v input.txt

# Example 3: Specify output file
python script.py -o output.txt input.txt

# Example 4: Using configuration
python script.py -c config.json --verbose input.txt
```

#### Demo Output

**Example 1: Basic Processing**

**Input:**
```
This is a sample input file
with multiple lines of text
for demonstration purposes
```

**Command:**
```bash
python script.py sample.txt
```

**Output:**
```
Processing: sample.txt
Lines processed: 3
Characters counted: 86
Status: Success
Output saved to: output.txt
```

**Example 2: Advanced Usage**

**Input:**
```json
{
  "name": "test",
  "value": 123
}
```

**Command:**
```bash
python script.py -v --format json data.json
```

**Output:**
```
[VERBOSE] Loading configuration...
[VERBOSE] Parsing JSON input...
[VERBOSE] Processing data...
{
  "status": "success",
  "processed": true,
  "result": {
    "name": "test",
    "value": 123,
    "timestamp": "2024-02-07T10:30:00"
  }
}
[VERBOSE] Operation completed in 0.23s
```

---

## Project Demo

### Video
[Add your demo video link here - YouTube, Google Drive, etc.]

*Explain what the video demonstrates - key features, user flow, technical highlights*

### Additional Demos
[Add any extra demo materials/links - Live site, APK download, online demo, etc.]

---

## AI Tools Used (Optional - For Transparency Bonus)

If you used AI tools during development, document them here for transparency:Gemini and chatgpt


**Purpose:** [What you used it for]
- Example: "Generated boilerplate React components"
- Example: "Debugging assistance for async functions"
- Example: "Code review and optimization suggestions"

**Key Prompts Used:**
- "Create a REST API endpoint for user authentication"
- "Debug this async function that's causing race conditions"
- "Optimize this database query for better performance"

**Percentage of AI-generated code:** [Approximately X%]

**Human Contributions:**
- Architecture design and planning
- Custom business logic implementation
- Integration and testing
- UI/UX design decisions

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- Christta Ann Mathew: Backend integration with Firebase, Streak logic implementation, and API/Database management.

-Gopika Prakash: Frontend UI/UX Design, CSS styling, and Leaderboard rendering logic.

---

## License

This project is licensed under the [LICENSE_NAME] License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub
