import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import AvatarSelector from "./AvatarSelector";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

type UpdateProfileFormProps = {
  onSuccess: () => void;
};

const UpdateProfileForm = ({ onSuccess }: UpdateProfileFormProps) => {
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
      email: user?.email || "",
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
        email: values.email,
        avatar: avatarData,
        currentPassword: values.currentPassword || "",
        newPassword: values.newPassword || "",
      });
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated.",
      });
      onSuccess();
      form.reset({
        name: values.name,
        email: values.email,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AvatarSelector 
          currentAvatar={user?.avatar || null} 
          userName={user?.name || ""} 
          onAvatarChange={handleAvatarChange} 
        />

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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
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

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;