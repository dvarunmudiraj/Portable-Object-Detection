import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, Play, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LiveDetection = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [detections, setDetections] = useState<{ label: string; confidence: number }[]>([]);
  const videoRef = useRef<HTMLImageElement>(null);
  const startBackendStream = async () => {
    try {
      await fetch("http://localhost:5000/start_stream", { method: "POST" });
    } catch (err) {
      console.error("Error starting stream:", err);
    }
  };
  
  const stopBackendStream = async () => {
    try {
      await fetch("http://localhost:5000/stop_stream", { method: "POST" });
    } catch (err) {
      console.error("Error stopping stream:", err);
    }
  };
  
  // Simulate detection results
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  
  //   if (isStreaming) {
  //     setIsLoading(false);
  
  //     // Fetch detection data every 2 seconds
  //     interval = setInterval(async () => {
  //       try {
  //         const res = await fetch("http://localhost:5000/detections");
  //         const data = await res.json();
  //         setDetections(data);
  //       } catch (error) {
  //         console.error("Error fetching detections:", error);
  //       }
  //     }, 2000);
  //   } else {
  //     setIsLoading(true);
  //     setDetections([]);
  //   }
  
  //   return () => clearInterval(interval);
  // }, [isStreaming]);
  useEffect(() => {
    let loadingTimer: NodeJS.Timeout;
    let detectionInterval: NodeJS.Timeout;
  
    if (isStreaming) {
      loadingTimer = setTimeout(() => {
        setIsLoading(false);
  
        // Start polling detections after loading ends
        detectionInterval = setInterval(async () => {
          try {
            const res = await fetch("http://localhost:5000/detections");
            const data = await res.json();
            console.log("Fetched detections:", data); // ⬅️ Add this line
            setDetections(data);
          } catch (err) {
            console.error("Failed to fetch detections", err);
          }
        }, 2000); // Poll every 2 seconds
  
      }, 2000); // Simulated loading
  
    } else {
      setIsLoading(true);
    }
  
    return () => {
      clearTimeout(loadingTimer);
      clearInterval(detectionInterval);
    };
  }, [isStreaming]);
  
  

  const toggleStream = async () => {
    if (isStreaming) {
      await stopBackendStream();
      setIsStreaming(false);
    } else {
      await startBackendStream();
      setIsStreaming(true);
    }
  };

  return (
    //<div className="space-y-6 animate-fade-in">
    <div className="space-y-6">  
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Live Detection</h1>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" /> Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed */}
        <Card className="lg:col-span-2 gradient-card card-shadow">
          <CardHeader>
            <CardTitle>Camera Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
              {!isStreaming ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-lg font-medium text-slate-500 mb-4">Video feed is paused</p>
                  <Button onClick={toggleStream}>
                    <Play className="h-4 w-4 mr-2" /> Start Stream
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                  <p className="text-slate-500">Connecting to video feed...</p>
                </div>
              ) : (
                <>
                  {/* 🔥 Live stream from Flask */}
                  {isStreaming && !isLoading && (
                  // <img
                  // ref={videoRef}
                  // src="http://localhost:5000/video_feed"
                  // alt="Live video feed"
                  // className="w-full h-full object-cover"
                  // />
                  <img
                    ref={videoRef}
                    src="http://localhost:5000/video_feed"
                    alt="Live video feed"
                    onError={() => {
                      console.error("Video feed failed to load");
                      videoRef.current?.setAttribute("alt", "Failed to load video");
                    }}
                    className="w-full h-full object-cover"
                  /> // Step 2: Added onError handling

)}


                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={toggleStream}
                    className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>

                  {/* Optional: Static detection boxes (mock UI) */}
                  {/* <div className="absolute top-[10%] left-[20%] w-[25%] h-[70%] border-2 border-green-500 rounded-md">
                    <div className="bg-green-500 text-white text-xs px-1 py-0.5 absolute -top-6 left-0">
                      Person: 98%
                    </div>
                  </div>
                  <div className="absolute top-[40%] right-[20%] w-[15%] h-[20%] border-2 border-blue-500 rounded-md">
                    <div className="bg-blue-500 text-white text-xs px-1 py-0.5 absolute -top-6 left-0">
                      Laptop: 92%
                    </div>
                  </div> */}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detection Results */}
        <Card className="lg:col-span-1 gradient-card card-shadow">
          <CardHeader>
            <CardTitle>Detection Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isStreaming && !isLoading ? (
              <div className="space-y-4">
                {/* {detections.map((detection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: index === 0 ? "rgb(34, 197, 94)" : index === 1 ? "rgb(59, 130, 246)" : "rgb(168, 85, 247)" }}
                      ></div>
                      <span className="font-medium">{detection.label}</span>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(detection.confidence * 100)}%
                    </Badge>
                  </div>
                ))} */}

                {/* <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Detected {detections.length} objects in frame
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div> */}
                <div className="pt-2 space-y-1">
                {detections.map((detection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: index === 0 ? "rgb(34, 197, 94)" : index === 1 ? "rgb(59, 130, 246)" : "rgb(168, 85, 247)" }}
                      ></div>
                    <span className="font-medium">{detection.label}</span>
                  </div>
                  <Badge variant="secondary">
                    {Math.round(detection.confidence * 100)}%
                  </Badge>
                </div>
              ))}

                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                {isStreaming ? (
                  <p>Waiting for detection results...</p>
                ) : (
                  <p>Start the video stream to see detections</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export default LiveDetection;
