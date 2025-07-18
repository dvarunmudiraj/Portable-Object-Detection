# 🚀 Portable Object Detection in Real-Time

A modern, responsive, and scalable full-stack application that enables **object detection from images in real-time** using the state-of-the-art **YOLOv8 model** from Ultralytics.

Hosted on the cloud with **Vercel (Frontend)** and **Render (Backend)**, this project showcases seamless integration of **Computer Vision, Deep Learning, and Web Technologies**.

---

## 🌟 Key Features

- 🎯 Object detection using **YOLOv8 (Ultralytics)** on uploaded images
- 🔐 Token-based **User Authentication** (Sign Up, Login)
- 🧑‍💼 Admin panel for user approval (pending/approved)
- 📊 Detection output with bounding boxes, labels, and confidence scores
- 🌐 Hosted on **Vercel + Render** with clean API integration
- ⚡ Optimized for low-memory environments using `yolov8n.pt`
- 📁 Persistent user data using a lightweight `users.json` file (no DB)

---

## 🖼️ Application Flow (Screenshots)

### 1️⃣ Sign Up / Login
Users first sign up or log in to the application.

<p align="center">
  <img src="assets/signup.png" width="320"/>
  <img src="assets/login.png" width="320"/>
</p>

---

### 2️⃣ Admin User Dashboard (Approve or Reject)
Admin can view **Pending** and **Approved** users and take actions accordingly.

<p align="center">
  <img src="assets/admin-dashboard.png" width="600"/>
</p>

---

### 3️⃣ User Dashboard - Upload Image for Detection
Once approved, users land on their dashboard and upload images.

<p align="center">
  <img src="assets/user-dashboard.png" width="600"/>
</p>

---

### 4️⃣ Detection Results (YOLOv8 Output)
After submission, the YOLOv8 model returns detections with bounding boxes.

<p align="center">
  <img src="assets/detection-results-1.png" width="480"/>
  <img src="assets/detection-results-2.png" width="480"/>
</p>

---

## 🧠 YOLOv8 Model

- **Model**: [`yolov8n.pt`](https://github.com/ultralytics/ultralytics/releases)
- **Framework**: [Ultralytics YOLOv8](https://docs.ultralytics.com/)
- **Use case**: Fast, accurate detection with minimal resource usage (Render compatible)

---

## 🛠️ Tech Stack

| Layer     | Tech Used                                     |
|-----------|-----------------------------------------------|
| 👨‍🎨 Frontend | React, Vite, Tailwind CSS                   |
| 🧪 Backend  | Flask, Python, Gunicorn, OpenCV, Ultralytics |
| 📦 Model    | YOLOv8 (Nano - `yolov8n.pt`)                 |
| ☁️ Hosting  | Vercel (UI), Render (API)                    |

---

## 📦 Installation (Local Dev)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/dvarunmudiraj/Portable-Object-Detection.git
cd Portable-Object-Detection
```

### 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Ensure the `yolov8n.pt` model file is placed in the backend folder.

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

### ✅ Frontend (Vercel)
- Configure the root as `frontend/`
- Auto-detects React/Vite
- No environment variables needed

### ✅ Backend (Render)
- Configure root as `backend/`
- **Start Command**: `gunicorn app:app`
- **Build Command**: `pip install -r requirements.txt`
- **Instance**: Use Starter ($7/month) or Free (with model size adjusted)
- Uses `users.json` to persist user info

---

## 🔐 Admin Workflow

- New users sign up → stored in `users.json` as `pending`
- Admin reviews users from **admin dashboard**
- Approved users get full access to detection features

---

## 📁 Folder Structure

```bash
Portable-Object-Detection/
│
├── frontend/               
├── backend/                
│   ├── app.py              
│   ├── users.json         
│   ├── yolov8n.pt          
│   └── requirements.txt
├── assets/                 
└── README.md               
```

---

## 👨‍💻 Author

**Varun Mudiraj**  
📍 Hyderabad, India  
🎓 Final Year B.Tech @ ACE Engineering College  
📧 [varunmudiraj154@gmail.com](mailto:varunmudiraj154@gmail.com)  
🔗 [GitHub Profile](https://github.com/dvarunmudiraj)

---

## 💼 Why This Project Matters

> A full-stack showcase of **AI-powered web applications** that combines:
> - 💡 Machine learning integration (YOLOv8)
> - 🧩 REST API design with Flask
> - 🌐 UI development with React
> - 🚀 Deployment skills with Vercel & Render  
>
> This is the kind of work that demonstrates readiness for **real-world projects at scale**.

---

## 🏁 Final Note

If you're an MNC or a tech company hiring for **AI Engineers**, **Web Developers**, or **Full Stack ML Engineers** — this project reflects a strong foundation in building intelligent, production-ready systems.

---

⭐ Star this repo if you find it useful or inspiring!
