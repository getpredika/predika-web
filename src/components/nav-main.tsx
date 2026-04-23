import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  icon?: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function NavMain({
  groups
}: {
  groups: NavGroup[];
}) {
  return (
    <>
      {groups.map((group) => (
        <SidebarGroupLabel
          className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-muted-foreground
              group-data-[collapsible=icon]:hidden
            "
        >
          {group.label}
        </SidebarGroupLabel>
        
      ))}
    </>
  );
} 
