💚 BRAT. LIBRARY. APP.
Mentor: Assistant Marko Buljan

Course: Programming 3 – Faculty of Humanities and Social Sciences, Osijek

Project Lead: [Your Name]

🟩 THE. VIBE.
Forget boring library software. This application is inspired by Gen Z pop culture, "BRAT summer," and the high-contrast, minimalist aesthetic of Charli XCX's 6th studio album. It’s industrial. It’s lime green. It’s unapologetic. It’s about managing data with main character energy.

🛠️ FEATURES. PERIOD.
THE ARCHIVE: A high-intensity FlatList of books with real-time status updates.

NEW ENTRIES: A "File Update" style form with strict validation (letters only, no filler).

VIBE SEARCH: A blackout-style modal to find books instantly.

GLITCH UI: Anti-design elements, including tilted status blocks and neon shadows.

REST API INTEGRATION: Fully connected to a Spring Boot backend.

🧪 THE. TECH. STACK.
React Native + Expo Go (The Engine)

React Navigation (The Flow)

Axios (The Connection)

Spring Boot + PostgreSQL (The Backbone)

Gemini 1.5 Flash / GPT-4o (The AI Collaborators)

📁 PROJECT. STRUCTURE.
Plaintext
src/
 ├── api/          # Axios logic (The data pipeline)
 ├── components/   # BookItem (The modular UI)
 ├── screens/      # Home, List, Detail, Form (The Viewports)
 ├── theme/        # theme.js (The BRAT color tokens: #89CC04)
 └── navigation/   # Stack & Tab logic
App.js             # Entry Point
.env               # API_URL (The Gateway)
🚀 BOOTING. UP.
Clone the archive: git clone <repo-url>

Install dependencies: npm install

Configure the link: Update .env with your machine's IP:

Code snippet
API_URL=http://192.168.x.x:8080/api
Launch: npx expo start -c

Scan: Open Expo Go on your phone (Same Wi-Fi is mandatory).

🚩 DEVELOPMENT. LOG.
The "Double Fetch" Glitch: Fixed duplicate API calls by combining useEffect dependencies.

The Shadow Bug: Android doesn't support standard shadows well; added elevation logic to ensure the "Brat Glow" worked on all devices.

ReferenceErrors: Cleaned up duplicate imports for StyleSheet and @expo/vector-icons.

The Aesthetic Shift: Moved from standard "Material Design" to "Brat Anti-Design" (Sharp corners, heavy typography, and tilted blocks).

💅 DESIGN. PHILOSOPHY. (GEN Z / BRAT)
The UI follows the Brat aesthetic:

Color: Primary use of #89CC04 (Brat Green) against #000000 (Pitch Black).

Typography: All-caps, heavy font weights (900), and negative letter-spacing for that "poster" look.

Tone: The app doesn't say "Error"; it says "FAILED. VIBE. CHECK." It doesn't say "Loading"; it says "FETCHING. THE. ARCHIVE."

🤖 AI. ROLE.
This project utilized AI for:

Refactoring: Turning a monolithic App.js into a clean, modular structure.

Theme Engineering: Translating the "Brat" aesthetic into a theme.js file.

Validation: Creating regex-based "Bratty" error handling.