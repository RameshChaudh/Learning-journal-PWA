# 🎓 **Learning Journal PWA**
### **Offline‑Capable • Installable • Full‑Stack Flask Application**

This project is a **Progressive Web Application (PWA)** built by **Ramesh Chaudhary** for the **FGCT6021 Mobile Application Development** unit.  
It has evolved from a simple static website into a **full‑stack, offline‑ready, installable web application**.

---

## ✨ **Project Overview**
The Learning Journal PWA uses:

- A **Flask backend** deployed on PythonAnywhere  
- A **JavaScript frontend** with responsive UI  
- A **Service Worker** for offline capability  
- A **PWA Manifest** for installability  

The app behaves like a native mobile application while maintaining the flexibility of the web.

---

## 🌟 **Key Features**

### 📱 **Fully Installable**
- Custom **“Install App”** button  
- Add to Home Screen support  
- Standalone mobile‑app experience  

### 📡 **Offline Support**
- Service Worker with **Network‑First** strategy  
- Falls back to cached content when offline  
- Ensures reliability even without internet  

### 💾 **Dual Persistence**
- Saves reflections to:
  - **Server-side JSON file** (`reflections.json`)
  - **LocalStorage** for instant UI updates  

### 🔌 **REST API Integration**
Full backend API built with Flask:
- `GET /api/reflections`
- `POST /api/reflections`
- `DELETE /api/reflections/<id>`

### ⏱️ **Mini Project: Persistent Study Tracker**
A Pomodoro-style study timer that:
- Stores target timestamps in LocalStorage  
- **Continues running even after refresh or browser restart**  
- Logs completed study sessions  

---

## 🚀 **Live Application & Deployment**

| Link Type | URL | Notes |
|----------|-----|-------|
| **Live PWA** | https://ramesh32.pythonanywhere.com/ | Fully functional PWA with offline support |
| **GitHub Repo** | https://github.com/Rameshchaudh/Learning-journal-PWA | Full source code |

---

## 📂 **Project Structure**

```
Learning-journal-PWA/
├── flask_app.py            # Flask backend (API + routing)
├── templates/              # Jinja2 HTML templates
│   ├── index.html           # Dashboard with live stats
│   ├── journal.html         # Journal entries + API integration
│   ├── projects.html        # Labs & mini project showcase
│   ├── resources.html       # Study Tracker (Pomodoro)
│   └── about.html           # Profile + Spotify widget
├── static/
│   ├── manifest.json        # PWA identity + icons
│   ├── css/
│   │   └── style.css        # Mobile-first responsive design
│   ├── js/
│   │   ├── sw.js            # Service Worker (offline logic)
│   │   ├── script.js        # Navigation, theme, install logic
│   │   ├── browser.js       # Clipboard & browser APIs
│   │   ├── storage.js       # LocalStorage + API sync
│   │   └── thirdparty.js    # External API integrations
│   ├── images/             # Icons & assets
│   └── backend/
│       └── reflections.json  # Persistent data storage

```
---

## 🛠️ **Installation & Local Development**

### **1. Clone the Repository**
```bash
git clone https://github.com/Rameshchaudh/Learning-journal-PWA.git
cd Learning-journal-PWA

2. Install Dependencies
pip install flask

3. Run the Application
python flask_app.py

4. Open in Browser
http://127.0.0.1:5000/
## 📱 **PWA Features Implementation**

```

### 🔧 **Service Worker**
- **Network‑First** strategy for HTML & API requests  
- **Cache‑First** strategy for static assets  
- Handles **versioning** and **cache cleanup** to ensure updates apply correctly  

```

### 📄 **Manifest**
- `theme_color: "#8e44ad"`  
- `display: "standalone"`  
- Includes app icons for **Add to Home Screen** installation  

```

### 📥 **Custom Install Trigger**
- Listens for the `beforeinstallprompt` event  
- Displays a custom **“Install App”** button for a better user experience  

---

## 📝 **Mini Project: Persistent Study Tracker**

The Study Tracker solves the issue of timers resetting when the page reloads.

```

### ⚙️ **How It Works**
- Stores a **target timestamp** instead of a countdown  
- Recalculates remaining time on page reload  
- Continues running even after browser restart  

```

### 🌟 **Benefits**
- **Reliable**  
- **Persistent**  
- **Great for productivity tracking**  

```

## © **2026 Ramesh Chaudhary**  
**BSc Computer Science — University for the Creative Arts**

