import { Badge } from "@/components/ui/badge";

export function PreviewBadge({ label = "Preview data" }: { label?: string }) {
  return (
    <Badge variant="default" className="font-mono uppercase tracking-wide">
      {label}
    </Badge>
  );
}
