// import { Bell } from "lucide-react";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { useAuth } from "@/contexts/AuthContext";
// import { Camera, Database, Eye, UploadCloud } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// // Sample objects for the common detections list
// const recentDetections = [
//   { name: "Person", count: 87, percentage: 57 },
//   { name: "Car", count: 35, percentage: 23 },
//   { name: "Dog", count: 12, percentage: 8 },
//   { name: "Bicycle", count: 9, percentage: 6 },
//   { name: "Chair", count: 9, percentage: 6 },
// ];

// const Dashboard = () => {
//   const { user } = useAuth();  // Get user from AuthContext
//   const navigate = useNavigate();  // For navigation

//   //if (!user) return null;  // If no user, return nothing (loading or redirect to login page)

//   ///🚨 Redirect admin to AdminDashboard
//   // if (user.role === "admin") {
//   //   navigate("/admin/dashboard");  // Redirect admin to admin dashboard
//   //   return null;  // Prevent rendering of user dashboard for admin
//   // }
//   useEffect(() => {
//     if (user?.role === "admin") {
//       navigate("/dashboard");
//     }
//   }, [user, navigate]);

//   const { stats } = user;  // Destructure stats from user

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>

//         <p className="text-muted-foreground mt-1">
//           Here's an overview of your object detection activity
//         </p>
//       </div>

//       {/* Quick Action Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className="border-none bg-primary text-primary-foreground card-shadow">
//           <CardHeader className="pb-2">
//             <CardTitle className="flex items-center gap-2">
//               <Camera className="h-5 w-5" /> Live Detection
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm opacity-90 mb-4">
//               Start detecting objects in real-time using your camera feed
//             </p>
//             <Button 
//               variant="secondary" 
//               onClick={() => navigate('/live-detection')}
//               className="text-primary w-full"
//             >
//               Launch Live Detection
//             </Button>
//           </CardContent>
//         </Card>

//         <Card className="gradient-card card-shadow">
//           <CardHeader className="pb-2">
//             <CardTitle className="flex items-center gap-2">
//               <UploadCloud className="h-5 w-5" /> Upload Image
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm text-muted-foreground mb-4">
//               Upload an image or video file to detect objects
//             </p>
//             <Button 
//               variant="default"
//               onClick={() => navigate('/upload')}
//               className="w-full"
//             >
//               Upload Files
//             </Button>
//           </CardContent>
//         </Card>

//         <Card className="gradient-card card-shadow">
//           <CardHeader className="pb-2">
//             <CardTitle className="flex items-center gap-2">
//               <Database className="h-5 w-5" /> Detection History
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm text-muted-foreground mb-4">
//               View your past detections and analyze results
//             </p>
//             <Button 
//               variant="outline"
//               className="w-full"
//             >
//               View History
//             </Button>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Stats and Analytics */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Stats Cards */}
//         <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           <Card className="gradient-card card-shadow">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Total Detections
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{stats.totalDetections}</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 +12 since last week
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="gradient-card card-shadow">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Detection Accuracy
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{stats.detectionAccuracy}%</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 +2.3% improvement
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="gradient-card card-shadow">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Recent Uploads
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{stats.recentUploads}</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 In the last 7 days
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Most Common Objects */}
//         <Card className="lg:col-span-1 gradient-card card-shadow">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Eye className="h-5 w-5" /> Most Common Objects
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentDetections.map((object, index) => (
//                 <div key={index} className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
//                     {index + 1}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium">{object.name}</span>
//                       <span className="text-sm text-muted-foreground">
//                         {object.count} detections
//                       </span>
//                     </div>
//                     <div className="mt-1 bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-primary h-2 rounded-full"
//                         style={{ width: `${object.percentage}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Admin Button (Optional) */}
//       {/* {user.role === "admin" && (
//         <Button
//           onClick={() => navigate("/admin")}
//           variant="secondary"
//           className="w-full mt-6"
//         >
//           Go to Admin Dashboard
//         </Button>
//       )} */}
//     </div>
//   );
// };

// export default Dashboard;


import { useAuth } from "@/contexts/AuthContext";
import { Camera, Database, Eye, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Sample objects for the common detections list
const recentDetections = [
  { name: "Person", count: 87, percentage: 57 },
  { name: "Car", count: 35, percentage: 23 },
  { name: "Dog", count: 12, percentage: 8 },
  { name: "Bicycle", count: 9, percentage: 6 },
  { name: "Chair", count: 9, percentage: 6 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const { stats } = user;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your object detection activity
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none bg-primary text-primary-foreground card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" /> Live Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90 mb-4">
              Start detecting objects in real-time using your camera feed
            </p>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/live-detection')}
              className="text-primary w-full"
            >
              Launch Live Detection
            </Button>
          </CardContent>
        </Card>

        <Card className="gradient-card card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-5 w-5" /> Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload an image or video file to detect objects
            </p>
            <Button 
              variant="default"
              onClick={() => navigate('/upload')}
              className="w-full"
            >
              Upload Files
            </Button>
          </CardContent>
        </Card>

        <Card className="gradient-card card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" /> Detection History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View your past detections and analyze results
            </p>
            <Button 
              variant="outline"
              className="w-full"
            >
              View History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card className="gradient-card card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Detections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalDetections}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12 since last week
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Detection Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.detectionAccuracy}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2.3% improvement
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.recentUploads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                In the last 7 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Most Common Objects */}
        <Card className="lg:col-span-1 gradient-card card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" /> Most Common Objects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDetections.map((object, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{object.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {object.count} detections
                      </span>
                    </div>
                    <div className="mt-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${object.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
