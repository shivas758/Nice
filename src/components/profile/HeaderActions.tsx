import { Menu, Pencil, ClipboardList, Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PersonalDetailsDialog } from "./PersonalDetailsDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { useNavigate } from "react-router-dom";

interface HeaderActionsProps {
  profile: any;
  onEditClick: () => void;
}

export const HeaderActions = ({ profile, onEditClick }: HeaderActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Logo size="sm" />
        <h1 className="text-2xl font-bold text-primary">My NICE!</h1>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[200px] p-2">
            <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 rounded" onClick={onEditClick}>
              <Pencil className="h-4 w-4 mr-3" />
              <span className="flex-1">Edit Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <PersonalDetailsDialog profile={profile} onUpdate={() => window.location.reload()}>
                <div className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 rounded w-full">
                  <ClipboardList className="h-4 w-4 mr-3" />
                  <span className="flex-1">Personal Information</span>
                </div>
              </PersonalDetailsDialog>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ChangePasswordDialog>
                <div className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 rounded w-full">
                  <Lock className="h-4 w-4 mr-3" />
                  <span className="flex-1">Change Password</span>
                </div>
              </ChangePasswordDialog>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-red-50 rounded text-red-600 hover:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span className="flex-1">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};