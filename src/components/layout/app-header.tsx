import { LogOut, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/features/auth/services/auth-actions";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";

export async function AppHeader({ title }: { title?: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
      <h1 className="text-heading-lg text-foreground">{title}</h1>
      <Dropdown>
        <DropdownTrigger>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-body-sm text-foreground-muted transition-colors duration-fast hover:bg-surface hover:text-foreground"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-surface-elevated">
              <UserIcon className="size-3.5" aria-hidden="true" />
            </span>
            <span className="max-w-[160px] truncate">{user?.email ?? "Account"}</span>
          </button>
        </DropdownTrigger>
        <DropdownContent>
          <form action={signOutAction}>
            <DropdownItem type="submit">
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </DropdownItem>
          </form>
        </DropdownContent>
      </Dropdown>
    </header>
  );
}
