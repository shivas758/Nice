import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  attachmentPreviews: string[];
  onSend: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
}

export const MessageInput = ({
  newMessage,
  setNewMessage,
  attachmentPreviews,
  onSend,
  onFileSelect,
  onRemoveAttachment
}: MessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5 min-h-[40px]">
        {attachmentPreviews.map((preview, index) => (
          <div key={index} className="relative">
            <img
              src={preview}
              alt="attachment preview"
              className="h-16 w-16 object-cover rounded-md"
            />
            <button
              onClick={() => onRemoveAttachment(index)}
              className="absolute -top-1.5 -right-1.5 bg-foreground/90 hover:bg-foreground text-background rounded-full p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="What are your thoughts?"
          className="flex-1 min-h-[36px] max-h-[200px] resize-none bg-background border border-input focus-visible:ring-0 px-2 py-1.5 text-sm rounded-md"
          rows={1}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          multiple
          accept="image/*,video/*,application/*"
          className="hidden"
        />
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted flex items-center justify-center"
          >
            <ImagePlus className="w-4 h-4" />
          </Button>
          <Button
            onClick={onSend}
            size="sm"
            className="h-8 px-3"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}; 
