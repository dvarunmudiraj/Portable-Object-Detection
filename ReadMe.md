# 🚀 Portable Object Detection in Real-Time

This is a production-ready full-stack web application that enables real-time object detection using a custom-trained YOLOv8 model. Built with React (frontend), Flask (backend), and deployed using **Vercel** and **Render**, this project demonstrates modern AI-integrated software engineering practices.

---

## 🎯 Key Features

- 🔍 Real-Time Object Detection using YOLOv8 (custom-trained in Google Colab)
- 📸 Detect objects from uploaded images or live camera
- 🔐 Admin approval system with user roles and login
- 💾 Persistent user data via `users.json` (no database required)
- 🌐 Seamless deployment: Frontend on **Vercel**, Backend on **Render**

---

## 🧠 Model Training

The model used here was **trained from scratch** using Ultralytics' YOLOv8 in **Google Colab**.

### 📚 Training Workflow:

1. Dataset prepared and labeled via Roboflow (exported in YOLOv8 format)
2. Trained using `ultralytics` in Google Colab (GPU runtime)
3. Exported the best model as `best.pt` (replaces `yolov8n.pt`)
4. Integrated directly into the backend

```python
# app.py
from ultralytics import YOLO
model = YOLO("best.pt")
```

---

## 📸 Demo Screens

### 🔐 Login & Signup

<p align="center">
  <img src="assets/signup.png" width="45%" />
  <img src="assets/login.png" width="45%" />
</p>

---

### 🛡️ Admin Dashboard – Approve or Reject Users

<p align="center">
  <img src="assets/admin-dashboard.png" width="90%" />
</p>

---

### 🖼️ Upload Image for Detection

<p align="center">
  <img src="assets/upload.png" width="90%" />
</p>

---

### ✅ Detection Results

<p align="center">
  <img src="assets/detection-results-1.png" width="45%" />
  <img src="assets/detection-results-2.png" width="45%" />
</p>

---

### 👤 User Dashboard

<p align="center">
  <img src="assets/user-dashboard.png" width="90%" />
</p>

---


## 🛠️ Tech Stack

| Layer      | Technology           |
|------------|----------------------|
| Frontend   | React + Tailwind CSS |
| Backend    | Flask + YOLOv8       |
| Model      | YOLOv8 (custom-trained) |
| Deployment | Vercel (frontend), Render (backend) |

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
├── frontend/                # React app
├── backend/                 # Flask app
│   ├── app.py               # Main entry point
│   ├── users.json           # Persistent user data
│   ├── best.pt              # Custom-trained YOLOv8 model
│   └── requirements.txt     # Python dependencies
├── assets/                  # Screenshots for README
└── README.md                # Project documentation
```

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

## 👨‍💻 Author

**Varun D**  
📍 Hyderabad, India  
🎓 Final Year B.Tech @ ACE Engineering College  
📧 [varunmudiraj154@gmail.com](mailto:varunmudiraj154@gmail.com)  
🔗 [GitHub Profile](https://github.com/dvarunmudiraj)

---

## ⭐ Give a Star!

If you liked this project, consider giving it a ⭐ to support my work.

```
