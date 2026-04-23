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
        <SidebarGroup key={group.label} className="mb-4">
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

          <SidebarMenu>
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={Boolean(item.isActive)}
                    onClick={item.onClick}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="
                      transition-colors
                      hover:bg-[#40c4a7]/10
                      hover:text-[#40c4a7]
                      data-[active=true]:bg-[#40c4a7]
                      data-[active=true]:text-white
                    "
                  >
                    {Icon && <Icon className="size-4" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
