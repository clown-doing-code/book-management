"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Session } from "@/lib/auth-types";
import {
  Edit,
  Laptop,
  Loader2,
  LogOut,
  Smartphone,
  X,
  Shield,
  Mail,
  Key,
  CircleAlert,
  BadgeCheck,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { PasswordInput } from "./ui/password-input";
import { UAParser } from "ua-parser-js";

//TODO: Fix layout

export default function UserCard(props: {
  session: Session | null;
  activeSessions: Session["session"][];
}) {
  const router = useRouter();
  const { data } = useSession();
  const session = data || props.session;
  const [isTerminating, setIsTerminating] = useState<string>();
  const [isSignOut, setIsSignOut] = useState<boolean>(false);
  const [emailVerificationPending, setEmailVerificationPending] =
    useState<boolean>(false);
  const [activeSessions, setActiveSessions] = useState(props.activeSessions);
  const removeActiveSession = (id: string) =>
    setActiveSessions(activeSessions.filter((session) => session.id !== id));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      {/* Profile Header Card */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-sm dark:from-gray-900 dark:to-gray-800/50">
        <CardHeader className="pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="mx-auto h-20 w-20 ring-2 ring-gray-100 sm:mx-0 sm:h-16 sm:w-16 dark:ring-gray-800">
                <AvatarImage
                  src={session?.user.image || undefined}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-semibold text-white sm:text-lg">
                  {session?.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-xl dark:text-white">
                  {session?.user.name}
                </h2>
                <p className="flex items-center justify-center gap-2 text-sm text-gray-600 sm:justify-start dark:text-gray-400">
                  <Mail className="h-3 w-3" />
                  {session?.user.email}
                </p>
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  {session?.user.emailVerified ? (
                    <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-sm text-green-400 dark:bg-green-700 dark:text-white">
                      <BadgeCheck className="h-3 w-3" />
                      Verified Account
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-sm text-amber-400 dark:bg-amber-700 dark:text-white">
                      <CircleAlert className="h-3 w-3" />
                      Pending Verification
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center sm:justify-end">
              <EditUserDialog />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Email Verification Alert - Only show if not verified */}
      {!session?.user.emailVerified && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <Mail className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Email Verification Required
          </AlertTitle>
          <AlertDescription className="mt-2 text-amber-700 dark:text-amber-300">
            Please verify your email address to secure your account. Check your
            inbox for the verification email.
          </AlertDescription>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 w-fit border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
            onClick={async () => {
              await authClient.sendVerificationEmail(
                {
                  email: session?.user.email || "",
                },
                {
                  onRequest(context) {
                    setEmailVerificationPending(true);
                  },
                  onError(context) {
                    toast.error(context.error.message);
                    setEmailVerificationPending(false);
                  },
                  onSuccess() {
                    toast.success("Verification email sent successfully");
                    setEmailVerificationPending(false);
                  },
                },
              );
            }}
            disabled={emailVerificationPending}
          >
            {emailVerificationPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Resend Verification"
            )}
          </Button>
        </Alert>
      )}

      {/* Active Sessions Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
                <Shield className="h-4 w-4" />
                Active Sessions
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage your active sessions across devices
              </p>
            </div>
            <div className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {activeSessions.filter((session) => session.userAgent).length}{" "}
              active
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeSessions
            .filter((session) => session.userAgent)
            .map((session) => {
              const parser = new UAParser(session.userAgent || "");
              const device = parser.getDevice();
              const os = parser.getOS();
              const browser = parser.getBrowser();
              const isCurrentSession = session.id === props.session?.session.id;

              return (
                <div
                  key={session.id}
                  className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                    isCurrentSession
                      ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 rounded-full p-2 ${
                        isCurrentSession
                          ? "bg-blue-100 dark:bg-blue-900/40"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      {device.type === "mobile" ? (
                        <Smartphone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Laptop className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {os.name} • {browser.name}
                      </p>
                      {isCurrentSession && (
                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                          Current session
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    onClick={async () => {
                      setIsTerminating(session.id);
                      const res = await authClient.revokeSession({
                        token: session.token,
                      });

                      if (res.error) {
                        toast.error(res.error.message);
                      } else {
                        toast.success("Session terminated successfully");
                        removeActiveSession(session.id);
                      }
                      if (session.id === props.session?.session.id)
                        router.refresh();
                      setIsTerminating(undefined);
                    }}
                    disabled={isTerminating === session.id}
                  >
                    {isTerminating === session.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCurrentSession ? (
                      "Sign Out"
                    ) : (
                      "Terminate"
                    )}
                  </Button>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card className="border-0 shadow-sm">
        <CardFooter className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ChangePassword />
          <Button
            variant="outline"
            className="w-full gap-2 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 sm:w-auto dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={async () => {
              setIsSignOut(true);
              await signOut({
                fetchOptions: {
                  onSuccess() {
                    router.push("/auth/sign-in");
                  },
                },
              });
              setIsSignOut(false);
            }}
            disabled={isSignOut}
          >
            {isSignOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [signOutDevices, setSignOutDevices] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 sm:w-auto">
          <Key className="h-4 w-4" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[425px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Update your password to keep your account secure
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <PasswordInput
              id="current-password"
              value={currentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentPassword(e.target.value)
              }
              autoComplete="current-password"
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <PasswordInput
              id="new-password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              autoComplete="new-password"
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex items-start space-x-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <Checkbox
              id="sign-out-devices"
              checked={signOutDevices}
              onCheckedChange={(checked) =>
                setSignOutDevices(checked as boolean)
              }
              className="mt-0.5"
            />
            <Label
              htmlFor="sign-out-devices"
              className="text-sm leading-relaxed font-normal"
            >
              Sign out from all other devices after changing password
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
              }
              if (newPassword.length < 8) {
                toast.error("Password must be at least 8 characters");
                return;
              }
              setLoading(true);
              const res = await authClient.changePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: signOutDevices,
              });
              setLoading(false);
              if (res.error) {
                toast.error(
                  res.error.message ||
                    "Couldn't change your password! Make sure it's correct",
                );
              } else {
                setOpen(false);
                toast.success("Password changed successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setSignOutDevices(false);
              }
            }}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Update Password"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditUserDialog() {
  const { data } = useSession();
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[425px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder={data?.user.name}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      New profile image
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Ready to upload
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await authClient.updateUser({
                image: image ? await convertImageToBase64(image) : undefined,
                name: name || undefined,
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("Profile updated successfully");
                  },
                  onError: (error) => {
                    toast.error(error.error.message);
                  },
                },
              });
              setName("");
              router.refresh();
              setImage(null);
              setImagePreview(null);
              setIsLoading(false);
              setOpen(false);
            }}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
