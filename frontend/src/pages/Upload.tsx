import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
interface DetectionResult {
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const Upload = () => {
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      const updateSize = () => {
        setImageSize({
          width: img.clientWidth,
          height: img.clientHeight,
        });
      };
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, [preview]);
  const [imageDims, setImageDims] = useState({ width: 1, height: 1 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [results, setResults] = useState<DetectionResult[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-primary");
    }
  };

  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-primary");
    }
  };

  const processFile = (selectedFile: File) => {
    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setResults([]);
    };
    reader.readAsDataURL(selectedFile);
  };

  // const handleDetect = async () => {
  //   if (!file) return;

  //   setIsDetecting(true);
    
  //   // Mock detection API call
  //   try {
  //     await new Promise(resolve => setTimeout(resolve, 2000));
      
  //     // Mock results
  //     const mockResults: DetectionResult[] = [
  //       { 
  //         label: "Person", 
  //         confidence: 0.97, 
  //         boundingBox: { x: 50, y: 30, width: 200, height: 400 } 
  //       },
  //       { 
  //         label: "Chair", 
  //         confidence: 0.89, 
  //         boundingBox: { x: 300, y: 250, width: 150, height: 180 } 
  //       },
  //       { 
  //         label: "Cup", 
  //         confidence: 0.78, 
  //         boundingBox: { x: 400, y: 100, width: 50, height: 60 } 
  //       }
  //     ];
      
  //     setResults(mockResults);
  //     toast.success("Detection completed successfully!");
  //   } catch (error) {
  //     toast.error("Error during detection");
  //   } finally {
  //     setIsDetecting(false);
  //   }
  // };
  const handleDetect = async () => {
    if (!file) return;
  
    setIsDetecting(true);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        toast.error("Server error: " + response.status);
        return;
      }
      const data = await response.json();
      if (data.length > 0) {
        setImageDims({
          width: data[0].imageWidth,
          height: data[0].imageHeight
        });
      }
      
      setResults(data);
      toast.success("Detection completed successfully!");
    } catch (error) {
      toast.error("Error during detection");
      console.error(error);
    } finally {
      setIsDetecting(false);
    }
  };
  
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Upload Image</h1>
      <p className="text-muted-foreground">
        Upload an image to detect objects using our AI model
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card className="gradient-card card-shadow">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={dropZoneRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-primary transition-colors"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <UploadCloud className="h-10 w-10 mx-auto text-slate-400 mb-4" />
              
              <h3 className="text-lg font-medium mb-2">
                Drag and drop your image here
              </h3>
              
              <p className="text-sm text-muted-foreground mb-6">
                Supports JPG, PNG and WEBP up to 5MB
              </p>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Browse Files
              </Button>
            </div>

            {file && (
              <div className="mt-4 bg-white p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium flex-1 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={handleDetect}
                className="w-full"
                disabled={!file || isDetecting}
              >
                {isDetecting ? (
                  <>
                    <span className="animate-spin-slow mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Detecting objects...
                  </>
                ) : (
                  "Detect Objects"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Area */}
        <Card className="gradient-card card-shadow">
          <CardHeader>
            <CardTitle>Detection Results</CardTitle>
          </CardHeader>
          <CardContent>
            {preview ? (
              <div className="space-y-4">
                <div className="relative bg-slate-100 rounded-lg overflow-auto">
                <img
                  src={preview}
                  alt="Uploaded preview"
                  ref={imageRef}
                  onLoad={() => {
                    if (imageRef.current) {
                      const rect = imageRef.current.getBoundingClientRect();
                      setImageDims({
                        width: imageRef.current.naturalWidth,
                        height: imageRef.current.naturalHeight,
                      });
                      setImageSize({
                        width: rect.width,
                        height: rect.height,
                      });
                    }
                  }}
                  
                  className="w-full h-auto max-h-[512px] object-contain rounded-md shadow"
                  style={{ position: 'relative' }}
                />

                  
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="absolute border-2 rounded-md"
                      style={{
                        left: `${(result.boundingBox.x / imageDims.width) * imageSize.width}px`,
                        top: `${(result.boundingBox.y / imageDims.height) * imageSize.height}px`,
                        width: `${(result.boundingBox.width / imageDims.width) * imageSize.width}px`,
                        height: `${(result.boundingBox.height / imageDims.height) * imageSize.height}px`,

                        borderColor: index === 0 ? "rgb(34, 197, 94)" : 
                                   index === 1 ? "rgb(59, 130, 246)" : 
                                   "rgb(168, 85, 247)"
                      }}
                    >
                      <div 
                        className="absolute -top-6 left-0 px-1 py-0.5 text-xs text-white"
                        style={{
                          backgroundColor: index === 0 ? "rgb(34, 197, 94)" : 
                                         index === 1 ? "rgb(59, 130, 246)" : 
                                         "rgb(168, 85, 247)"
                        }}
                      >
                        {result.label}: {Math.round(result.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>

                {results.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Detected Objects:</h3>
                    <div className="space-y-2">
                      {results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ 
                                backgroundColor: index === 0 ? "rgb(34, 197, 94)" : 
                                               index === 1 ? "rgb(59, 130, 246)" : 
                                               "rgb(168, 85, 247)" 
                              }}
                            ></div>
                            <span>{result.label}</span>
                          </div>
                          <Badge variant="secondary">
                            {Math.round(result.confidence * 100)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>Upload an image to see detection results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
