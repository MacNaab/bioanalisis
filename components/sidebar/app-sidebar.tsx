"use client";

import * as React from "react";
import {
  BookOpen,
  Command,
  Settings2,
  SquareTerminal,
  FilePlus2,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavAnalyses as NavProjects } from "@/components/sidebar/nav-projects";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

// This is sample data.
const data = {
  teams: [
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Enslaved",
    },
  ],
  navMain: [
    {
      title: "Nouveau",
      url: "/nouveau",
      icon: FilePlus2,
      isActive: false,
    },
    {
      title: "Playground",
      url: "/playground",
      icon: SquareTerminal,
      isActive: false,
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-center items-center gap-2"><ModeToggle /></div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
