
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ImagePlus } from "lucide-react";
import { 
  User, 
  UserCircle, 
  UserRound, 
  Users,
  Contact, 
  ContactRound, 
  Smile, 
  Meh, 
  Frown 
} from "lucide-react";

// Default avatar options with more friendly options
const defaultAvatars = [
  { id: "user", icon: <User className="h-6 w-6" />, label: "Default" },
  { id: "user-circle", icon: <UserCircle className="h-6 w-6" />, label: "Circle" },
  { id: "contact", icon: <Contact className="h-6 w-6" />, label: "Contact" },
  { id: "smile", icon: <Smile className="h-6 w-6" />, label: "Happy" },
  { id: "meh", icon: <Meh className="h-6 w-6" />, label: "Neutral" },
  { id: "frown", icon: <Frown className="h-6 w-6" />, label: "Sad" },
  { id: "users", icon: <Users className="h-6 w-6" />, label: "Group" },
  { id: "contact-round", icon: <ContactRound className="h-6 w-6" />, label: "Profile" },
];

interface AvatarSelectorProps {
  currentAvatar: string | null;
  userName: string;
  onAvatarChange: (avatarData: string) => void;
}

const AvatarSelector = ({
  currentAvatar,
  userName,
  onAvatarChange,
}: AvatarSelectorProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarData = e.target?.result as string;
        setSelectedAvatar(avatarData);
        onAvatarChange(avatarData);
        setIsPopoverOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectDefaultAvatar = (avatarId: string) => {
    const newAvatarData = `default:${avatarId}`;
    setSelectedAvatar(newAvatarData);
    onAvatarChange(newAvatarData);
    setIsPopoverOpen(false);
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine what to show in the avatar
  const renderAvatarContent = () => {
    if (selectedAvatar && selectedAvatar.startsWith("data:image")) {
      return <AvatarImage src={selectedAvatar} alt={userName} />;
    }
    
    if (selectedAvatar && selectedAvatar.startsWith("default:")) {
      const avatarId = selectedAvatar.split(":")[1];
      const avatarOption = defaultAvatars.find((a) => a.id === avatarId);
      
      return (
        <AvatarFallback className="bg-primary/10 text-primary flex items-center justify-center">
          {avatarOption ? avatarOption.icon : getInitials(userName)}
        </AvatarFallback>
      );
    }
    
    return (
      <AvatarFallback className="bg-primary/10 text-primary">
        {getInitials(userName)}
      </AvatarFallback>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar className="h-24 w-24 cursor-pointer" onClick={() => setIsPopoverOpen(true)}>
        {renderAvatarContent()}
      </Avatar>
      
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            Change Avatar
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-6">
            <div>
              <Label htmlFor="avatar-upload" className="block mb-2 font-medium">Upload Image</Label>
              <div 
                className="mt-2 p-4 border border-dashed border-gray-300 rounded-md text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="cursor-pointer flex flex-col items-center">
                  <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Click to upload</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 1MB</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="block mb-4 font-medium">Default Avatars</Label>
              <div className="grid grid-cols-4 gap-3">
                {defaultAvatars.map((avatar) => (
                  <div key={avatar.id} className="flex flex-col items-center space-y-2">
                    <div 
                      className={`
                        cursor-pointer border rounded-md p-2 flex items-center justify-center h-14 w-14
                        ${selectedAvatar === `default:${avatar.id}` ? 'border-primary bg-primary/10' : 'border-gray-200'}
                        hover:border-primary hover:bg-primary/5 transition-colors
                      `}
                      onClick={() => handleSelectDefaultAvatar(avatar.id)}
                    >
                      {avatar.icon}
                    </div>
                    <span className="text-xs text-center">{avatar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AvatarSelector;