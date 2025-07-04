import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AvatarSelector from "@/components/profile/AvatarSelector";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine((data) => {
  if (data.currentPassword || data.newPassword) {
    return !!data.currentPassword && !!data.newPassword && data.currentPassword.length >= 6 && data.newPassword.length >= 6;
  }
  return true;
}, {
  message: "Both current and new password are required when changing password",
  path: ["newPassword"],
});

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarData, setAvatarData] = useState<string | null>(user?.avatar || null);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarData(user.avatar);
    }
  }, [user?.avatar]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const handleAvatarChange = (newAvatarData: string) => {
    setAvatarData(newAvatarData);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await updateUserProfile({
        name: values.name,
        email: user?.email || "",
        avatar: avatarData,
        currentPassword: values.currentPassword || "",
        newPassword: values.newPassword || "",
      });
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated.",
      });
      form.reset({
        name: values.name,
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: "Please check your current password and try again.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-center mb-6">
              <AvatarSelector 
                currentAvatar={user?.avatar || null} 
                userName={user?.name || ""} 
                onAvatarChange={handleAvatarChange} 
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 pt-4">
              <h3 className="text-sm font-medium">Change Password</h3>
            </div>
            
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Settings;