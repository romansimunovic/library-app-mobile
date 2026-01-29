# 🟩 BRAT. LIBRARY. APP.

> **"READING. IS. SO. BRAT."**

A high-performance library management system built with **React Native** and **Spring Boot**, wrapped in the unapologetic, high-contrast aesthetic of Charli XCX’s *Brat* era. This isn't just a CRUD app; it's a statement.

---

## 🟩 THE. VIBE.

Forget boring, corporate library software. This application embraces **Gen Z pop culture** and "Brat Summer."

* **Industrial.**
* **Lime Green.**
* **Unapologetic.**
It’s about managing data with main character energy and high-fashion "anti-design."

---

## 🛠️ FEATURES. PERIOD.

* **THE ARCHIVE** – A high-intensity `FlatList` with real-time book status.
* **NEW ENTRIES** – A "File Update" style form with strict validation (letters only, no filler).
* **VIBE SEARCH** – A blackout-style modal to find books instantly within the archive.
* **GLITCH UI** – Anti-design elements: tilted status blocks, sharp corners, and neon shadows.
* **REST INTEGRATION** – Fully connected to a **Spring Boot** REST API with **PostgreSQL**.

---

## 🧪 THE. TECH. STACK.

* **Frontend:** React Native + Expo Go
* **Backend:** Spring Boot (Java)
* **Database:** PostgreSQL
* **Communication:** Axios + REST
* **Design:** Custom "Brat" Tokens (theme.js)
* **AI Collaborators:** Gemini 1.5 Flash / GPT-4o

---

## 📁 PROJECT. STRUCTURE.

```bash
src/
 ├── api/          # Axios logic (The data pipeline)
 ├── components/   # BookItem (The modular UI card)
 ├── screens/      # Home, List, Detail, Form (The Viewports)
 ├── theme/        # theme.js (Design tokens & neon shadows)
 └── navigation/   # Stack & Tab logic
App.js             # Root Navigation Container
.env               # API_URL (The Gateway to the backend)

```

---

## 💅 DESIGN. TOKENS. (theme.js)

The app's identity is hardcoded into a modular theme. Instead of standard "Material Design," we use **sharp edges** and **aggressive colors**.

| Token | Value | Vibe |
| --- | --- | --- |
| **BRAT_GREEN** | `#89CC04` | High intensity neon |
| **PITCH_BLACK** | `#0f0f0f` | Background depth |
| **TEXT_PRIMARY** | `#ffffff` | Pure white |
| **SHADOWS** | `6px offset` | Hard, industrial depth |

> **Note:** We ditched `borderRadius` for the "Brat" look. The app uses `elevation: 8` on Android to simulate the neon green glow.

---

## 🚀 BOOTING. UP.

1. **Clone the repository:**
```bash
git clone <your-repo-link>

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure the Environment:** Create a `.env` file in the root directory:
```env
API_URL=http://192.168.x.x:8080/api

```


4. **Launch Expo:**
```bash
npx expo start -c

```


5. **Connect:** Ensure your phone is on the **same Wi-Fi network** as your backend server and scan the QR code via **Expo Go**.

---

## 🚩 DEVELOPMENT. LOG.

* **The "Double Fetch" Glitch:** Fixed duplicate API calls by combining `useEffect` navigation listeners.
* **The Shadow Bug:** Android doesn't support blurred shadows well; implemented a **Hard Shadow** approach (`shadowOpacity: 1, shadowRadius: 0`) to match the industrial look.
* **Bratty Validation:** Implemented regex that blocks numbers in Title/Author fields—keeping the data "clean" and consistent.
* **Anti-Design:** Switched from `borderRadius: RADIUS.xl` to sharp corners to better reflect the album cover's aesthetic.

---

## 🤖 AI. ROLE.

This project utilized AI assistance for:

* **Refactoring:** Converting a monolithic `App.js` into a clean, modular component-based architecture.
* **Theme Engineering:** Translating the "Brat" aesthetic into a scalable `theme.js` file.
* **Validation:** Creating "Bratty" error handling (e.g., `"WHO. WROTE. THIS?"` instead of `"Field required"`).

---

**Mentor:** Assistant Marko Buljan

**Course:** Programming 3 – Faculty of Humanities and Social Sciences, Osijek

**Project Lead:** Roman Šimunović

**V1.0.0 — SO. BRAT.**