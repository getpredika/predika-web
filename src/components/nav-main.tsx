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

export function NavMain({
  items,
  label = "Features",
}: {
  items: NavItem[];
  label?: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={Boolean(item.isActive)}
                onClick={item.onClick}
                data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                className={`
                  transition-colors duration-200
                  hover:bg-[#40c4a7] hover:text-white
                  data-[active=true]:bg-[#40c4a7]
                  data-[active=true]:text-white
                 `}
              >
                {Icon && <Icon className="size-4" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
