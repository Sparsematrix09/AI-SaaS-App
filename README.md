# 🤖 Full Stack AI SaaS Platform

Welcome to my **AI-powered SaaS platform** – a passion project built with the **PERN stack** (PostgreSQL, Express, React, Node.js).  
It’s designed to give users a **powerful set of AI tools** in one place, while also keeping things **secure, scalable, and easy to use**.

---

## 💡 What Does This App Do?

Think of it as your **AI toolbox**:
- ✍ **Article Writer:** Generate entire articles with just a topic.  
- 🏷 **Blog Title Generator:** Need catchy titles? Done.  
- 📄 **Resume Analyzer:** Get AI insights on your resume.  
- 🖼 **Background & Object Remover:** Clean up your images.  
- 🎨 **Image Generator:** Create stunning visuals using AI prompts.  

---

## 🧰 Tech Behind the Scenes
- **Frontend:** React (Vite) + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database:** PostgreSQL (via Neon – cloud-native & scalable)  
- **Auth:** Clerk (handles sign-ups, logins, and user sessions securely)  
- **AI Magic:** Various AI APIs (for text, image & resume analysis)

---

## 🚀 Want to Run It on Your Machine?

It’s super simple:

1. **Clone the repo**
git clone <https://github.com/Sparsematrix09/AI-SaaS-App/>

3. Install dependencies
For the frontend:
cd client
npm install

For the backend:
cd ../server
npm install


3. In client create .env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_BASE_URL

In server .env
DATABASE_URL=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
GEMINI_API_KEY=
CLIPDROP_API_KEY=
CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=
CLIENT_URL=

4. Fire it up!
Start the frontend:
cd client
npm run dev


Start the backend:
cd ..
cd server
npm run server


