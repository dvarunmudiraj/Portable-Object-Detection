import React, { useRef, useEffect, useState } from 'react';

function LiveCameraDetection() {
  const videoRef = useRef(null);
  const [detectionResult, setDetectionResult] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  const captureAndSendFrame = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const formData = new FormData();
    formData.append('file', blob, 'frame.jpg');
    const response = await fetch('https://objdetec.onrender.com/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    setDetectionResult(result);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: 400 }} />
      <button onClick={captureAndSendFrame}>Detect Frame</button>
      {detectionResult && (
        <pre>{JSON.stringify(detectionResult, null, 2)}</pre>
      )}
    </div>
  );
}

export default LiveCameraDetection;
