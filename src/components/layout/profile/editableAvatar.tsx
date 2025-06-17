import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

type Props = {
  name: string;
  avatarUrl?: string;
  onChange?: (file: File) => void;
};

export default function EditableAvatar({ name, avatarUrl, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(avatarUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange?.(file);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-fit">
        <Avatar className="w-24 h-24 border">
          <AvatarImage src={preview ?? "/placeholder.png"} />
          <AvatarFallback>{name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs px-2 py-1"
          onClick={() => inputRef.current?.click()}
        >
          Đổi ảnh
        </Button>

        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          onChange={handleSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
