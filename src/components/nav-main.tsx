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
   </>
  );
}
