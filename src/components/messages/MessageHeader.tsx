import { Button } from "@/components/ui/button";
import { Check, X, ArrowLeft } from "lucide-react";
import { ViewableProfilePicture } from "@/components/profile/ViewableProfilePicture";

interface MessageHeaderProps {
  recipientName: string;
  recipientAvatar?: string | null;
  isPending: boolean;
  isRecipient: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onBack: () => void;
}

export const MessageHeader = ({
  recipientName,
  recipientAvatar,
  isPending,
  isRecipient,
  onAccept,
  onDecline,
  onBack,
}: MessageHeaderProps) => {
  return (
    <div className="border-b p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 mr-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <ViewableProfilePicture
          avatarUrl={recipientAvatar}
          size="sm"
        />
        <span className="font-semibold">{recipientName}</span>
      </div>
      {isPending && isRecipient && (
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={onAccept}
            className="flex-1 sm:flex-none"
          >
            <Check className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Accept</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDecline}
            className="flex-1 sm:flex-none"
          >
            <X className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Decline</span>
          </Button>
        </div>
      )}
    </div>
  );
};
