import { LucideIcon } from "lucide-react";

interface InfoItemProps {
  icon: LucideIcon;
  text: string;
}

export const InfoItem = ({ icon: Icon, text }: InfoItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 text-gray-500" />
      <span>{text}</span>
    </div>
  );
};