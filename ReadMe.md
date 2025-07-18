# 🚀 Portable Object Detection in Real-Time

This is a production-ready full-stack web application that enables real-time object detection using a custom-trained YOLOv8 model. Built with React (frontend), Flask (backend), and deployed using **Vercel** and **Render**, this project demonstrates modern AI-integrated software engineering practices.

[![Python](https://img.shields.io/badge/Python-3.10-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3-lightgrey.svg)](https://flask.palletsprojects.com/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-orange.svg)](https://github.com/ultralytics/ultralytics)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.x-green.svg)](https://opencv.org/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
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

## 🔐 Authentication Screens

| 🖼️ Screenshot | Description |
|--------------|-------------|
| <img src="assets/signup.png" width="300px"/> | ✍️ **User Sign Up Page** |
| <img src="assets/login.png" width="300px"/> | 🔐 **User Login Page** |

---

## 🛠️ Admin Dashboard

| 🖼️ Screenshot | Description |
|--------------|-------------|
| <img src="assets/admin-dashboard.png" width="600px"/> | 🧑‍💼 **Admin Panel** for approving or rejecting users |

---

## 👤 User Dashboard

| 🖼️ Screenshot |
|--------------|
| <img src="assets/user-dashboard.png" width="600px"/> |

## 📷 Upload Detection Interface

| 🖼️ Screenshot | Description |
|--------------|-------------|
| <img src="assets/upload.png" width="600px"/> | 📤 **Upload Interface** to submit images for detection |

---

## 🧪 Detection Results (YOLOv8)

| 🖼️ Screenshot | Description |
|--------------|-------------|
| <img src="assets/detection1.png" width="300px"/> | 🎯 **Detection Example 1** |
| <img src="assets/detection2.png" width="300px"/> | 🎯 **Detection Example 2** |

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

---
