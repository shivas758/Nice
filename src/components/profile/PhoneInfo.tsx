import { Phone } from "lucide-react";

interface PhoneInfoProps {
  gcc_phone?: string;
  india_phone?: string;
}

export const PhoneInfo = ({ gcc_phone, india_phone }: PhoneInfoProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Phone className="w-5 h-5 text-gray-500" />
      <div className="flex flex-col">
        {gcc_phone && <span>GCC: {gcc_phone}</span>}
        {india_phone && <span>India: {india_phone}</span>}
      </div>
    </div>
  );
};
