import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockRequests = [
  { id: 1, name: "Alice Doe" },
  { id: 2, name: "Bob Smith" },
];

const NotificationPopover = () => {
  const handleApprove = (id: number) => {
    console.log(`Approved user ${id}`);
    // You can replace this with an API call
  };

  const handleReject = (id: number) => {
    console.log(`Rejected user ${id}`);
    // You can replace this with an API call
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h4 className="font-semibold mb-3">Pending Approvals</h4>
        {mockRequests.length === 0 ? (
          <p className="text-muted-foreground text-sm">No new user requests.</p>
        ) : (
          <div className="space-y-3">
            {mockRequests.map((user) => (
              <div key={user.id} className="flex justify-between items-center">
                <span className="font-medium">{user.name}</span>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprove(user.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(user.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
