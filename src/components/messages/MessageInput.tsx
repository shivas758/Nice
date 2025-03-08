import { Button } from "@/components/ui/button";

interface MessageInputProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const MessageInput = ({
  message,
  onChange,
  onSend,
  disabled = false,
}: MessageInputProps) => {
  return (
    <div className="flex gap-2 items-center pb-safe">
      <input
        type="text"
        value={message}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 min-w-0 h-11 rounded-full border border-input bg-background px-4 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
      />
      <Button
        onClick={onSend}
        disabled={disabled}
        size="icon"
        className="h-11 w-11 rounded-full shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 rotate-45"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
};
