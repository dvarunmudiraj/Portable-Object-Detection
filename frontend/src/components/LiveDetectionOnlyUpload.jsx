
import React, { useRef, useEffect, useState } from 'react';

function LiveDetectionOnlyUpload() {
  const videoRef = useRef(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [lastFrameUrl, setLastFrameUrl] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => {
        setCameraError('Unable to access camera: ' + err.message);
      });
  }, []);

  const captureAndSendFrame = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    setLastFrameUrl(canvas.toDataURL('image/jpeg'));
    const formData = new FormData();
    formData.append('file', blob, 'frame.jpg');
    try {
      const response = await fetch('https://objdetec.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setDetectionResult(result);
    } catch (err) {
      setDetectionResult({ error: 'Failed to fetch detection results.' });
    }
  };

  // Draw bounding boxes on the last captured frame
  const renderAnnotatedImage = () => {
    if (!lastFrameUrl || !detectionResult || !detectionResult.results) return null;
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img src={lastFrameUrl} alt="Detected" style={{ width: 400 }} />
        {detectionResult.results.map((det, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${(det.boundingBox.x / det.imageWidth) * 400}px`,
              top: `${(det.boundingBox.y / det.imageHeight) * 400}px`,
              width: `${(det.boundingBox.width / det.imageWidth) * 400}px`,
              height: `${(det.boundingBox.height / det.imageHeight) * 400}px`,
              border: '2px solid #00ff00',
              color: '#00ff00',
              fontWeight: 'bold',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <span style={{ background: 'rgba(0,255,0,0.7)', color: '#000', fontSize: 12 }}>{det.label} ({det.confidence})</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {cameraError && <div style={{ color: 'red' }}>{cameraError}</div>}
      <video ref={videoRef} autoPlay playsInline style={{ width: 400 }} />
      <button onClick={captureAndSendFrame}>Detect Frame</button>
      {renderAnnotatedImage()}
      {detectionResult && !detectionResult.results && (
        <pre>{JSON.stringify(detectionResult, null, 2)}</pre>
      )}
    </div>
  );
}

export default LiveDetectionOnlyUpload;
