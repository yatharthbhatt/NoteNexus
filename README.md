# 🧠 NoteNexus — Your Advanced Note-Taking Powerhouse

A sleek, fast, and ultra-productive web app that reimagines note-taking for the modern dev, student, and digital thinker.  
 backed by full-stack wizardry & turbocharged with AI ✨

> **Built with**: ⚛️ React • ⚡ Vite • 🎨 TailwindCSS • 🔐 Firebase / Supabase • 🧠 GPT • 🌐 PWA

---

## 🔑 Core Features 

- 📝 **Rich Notes**: Text, images, checklists  
- 🏷️ **Labels & Tags**: Color-coded organization  
- ⏰ **Reminders**: Time & location-based alerts  
- 👥 **Collaborators**: Real-time shared notes  
- 🗃️ **Archive & Trash**: Manage notes safely  
- 📌 **Pin Notes**: Prioritize what's important  
- 🔍 **Search & Filter**: Tag, keyword, label  
- 🧩 **Drag & Drop Layout**: Customizable board

---

## ⚙️ Advanced Upgrades (Where Nexus Goes Beast Mode)

- 🔐 **Version History**: Full note edit timeline + diff view  
- 💬 **Inline Comments**: Real-time collab threads  
- 🧠 **AI Assistant**: GPT-powered summaries, tag suggestions, to-do generation  
- 📥 **Import/Export Hub**: Sync with Notion, Evernote, Keep + PDF/Markdown export  
- 🗂 **Workspace & Folder Views**: Organize notes like a boss  
- 🔍 **Smart Search**: Filter by media type, OCR inside images  
- 🖼 **Media Notes**: Audio recording, video embeds, image editing  
- 📱 **PWA + Offline Sync**: IndexedDB + Service Workers + local encryption  
- 🚨 **Security Suite**: Note-level encryption, biometric login, 2FA  
- 📊 **Admin Analytics**: Usage heatmaps, note trends, Chart.js dashboards

---

## ⚙️ Installation & Setup

Want to run NoteNexus locally or self-host it? Here's how to get this beast up and running 👇

---

### 🧱 1. Clone the Repository

```bash
git clone https://github.com/yourusername/NoteNexus.git
cd NoteNexus
```
📦 2. Install Dependencies
```bash
npm install
```
🧪 3. Create .env File
```bash
# 🛠️ Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 🤖 OpenAI API (for AI Assistant)
VITE_OPENAI_API_KEY=your_openai_key

# 🔍 OCR via Tesseract.js
VITE_USE_OCR=true

# 🔐 Firebase (if used for Auth/Realtime features)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
🚀 4. Start the Development Server
```bash
npm run dev
```
💻 Built with ❤️ by Yatharth Bhatt



