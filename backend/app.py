from flask import Flask, render_template, Response, request, jsonify
from flask_cors import CORS
import cv2
import torch
import os
from ultralytics import YOLO
import time
import uuid

app = Flask(__name__)
CORS(app)
USERS = {}

# Load YOLOv8 model
MODEL_PATH = os.path.join("model", "obj-detect.pt")
model = YOLO(MODEL_PATH)
print("YOLOv8 model loaded")

streaming = False
import threading

frame_lock = threading.Lock()
latest_frame = None
import numpy as np
latest_frame = np.zeros((480, 640, 3), dtype=np.uint8)
detection_results = []

def camera_loop():
    global latest_frame, detection_results, streaming

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Failed to open camera")
        return

    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    frame_count = 0
    frame_skip = 2

    while streaming:
        success, frame = cap.read()
        if not success:
            continue

        frame = cv2.resize(frame, (640, 480))
        frame_count += 1
        if frame_count % frame_skip != 0:
            continue

        results = model.predict(source=frame, stream=False)[0]
        annotated = results.plot()

        with frame_lock:
            latest_frame = annotated
            detection_results = [
                {
                    "label": model.names[int(box.cls[0])],
                    "confidence": round(float(box.conf[0]), 2)
                }
                for box in results.boxes
            ]
    cap.release()


def generate_frames():
    global latest_frame
    while streaming:
        with frame_lock:
            if latest_frame is None:
                continue
            _, buffer = cv2.imencode('.jpg', latest_frame)
            frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')



@app.route('/video_feed')
def video_feed():
    if not streaming:
        return "Stream is off", 204
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/start_stream', methods=['POST'])
# def start_stream():
#     global streaming
#     streaming = True
#     return jsonify({"status": "started"})

@app.route('/start_stream', methods=['POST'])
def start_stream():
    global streaming
    if not streaming:
        streaming = True
        thread = threading.Thread(target=camera_loop)
        thread.start()
    return jsonify({"status": "started"})



@app.route('/stop_stream', methods=['POST'])
def stop_stream():
    global streaming
    streaming = False
    return jsonify({"status": "stopped"})

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filename = f"{uuid.uuid4().hex}.jpg"
    filepath = os.path.join("uploads", filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(filepath)

    img = cv2.imread(filepath)
    image_height, image_width = img.shape[:2]
    results = model(img)[0]

    output = []
    for box in results.boxes:
        label = model.names[int(box.cls[0])]
        conf = float(box.conf[0])
        x1, y1, x2, y2 = box.xyxy[0]
        output.append({
            "label": label,
            "confidence": round(conf, 2),
            "boundingBox": {
                "x": int(x1),
                "y": int(y1),
                "width": int(x2 - x1),
                "height": int(y2 - y1)
            },
            "imageWidth": image_width,
            "imageHeight": image_height
        })

    return jsonify(output)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = USERS.get(email)
    if user:
        if not user.get("approved", False):
            return jsonify({"status": "pending"}), 403
        if user["password"] == password:
            return jsonify({
                "status": "success",
                "role": user["role"],
                "id": email,
                "name": email.split("@")[0].capitalize(),
                "email": email,
                "stats": {
                    "totalDetections": 0,
                    "mostCommonObject": "N/A",
                    "detectionAccuracy": 0.0,
                    "recentUploads": 0
                }
            })
    return jsonify({"status": "failure"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if email in USERS:
        return jsonify({"status": "failure", "message": "User already exists"}), 409

    USERS[email] = {"password": password, "role": "user", "approved": False}
    return jsonify({"status": "pending", "message": "Signup request submitted. Awaiting admin approval."}), 201

# @app.route('/pending_users', methods=['GET'])
# def pending_users():
#     pending = [
#         {"email": email, "role": data["role"]}
#         for email, data in USERS.items()
#         if not data.get("approved", False)
#     ]
#     return jsonify(pending)
@app.route('/pending_users', methods=['GET'])
def pending_users():
    pending = [
        {
            "id": email,
            "email": email,
            "name": email.split("@")[0].capitalize(),
            "role": data["role"],
            "status": "pending",
            "createdAt": time.time() * 1000  # or use a fixed dummy timestamp
        }
        for email, data in USERS.items()
        if not data.get("approved", False)
    ]
    return jsonify(pending)

# @app.route('/approve_user', methods=['POST'])
# def approve_user():
#     data = request.json
#     email = data.get("email")

#     if email in USERS:
#         USERS[email]["approved"] = True
#         return jsonify({"status": "success", "message": f"{email} approved."})
#     return jsonify({"status": "failure", "message": "User not found"}), 404
@app.route('/approved_users', methods=['GET'])
def approved_users():
    approved = [
        {
            "id": email,
            "email": email,
            "name": email.split("@")[0].capitalize(),
            "role": data["role"],
            "status": "approved",
            "createdAt": time.time() * 1000
        }
        for email, data in USERS.items()
        if data.get("approved", False)
    ]
    return jsonify(approved)

@app.route('/detections')
def get_detections():
    global detection_results
    return jsonify(detection_results)

# === Run App ===
if __name__ == '__main__':
    app.run(debug=True, threaded=True)
