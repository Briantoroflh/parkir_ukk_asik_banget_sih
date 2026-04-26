"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, Cpu, LayoutDashboard, Archive } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: (
        <LayoutDashboard />
      ),
      isActive: true,
      items: [
        {
          title: "Parking",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Master Data",
      url: "#",
      icon: (
        <Archive />
      ),
      items: [
        {
          title: "Zones",
          url: "/dashboard/master-data/zone",
        },
        {
          title: "Gates",
          url: "/dashboard/master-data/gate",
        },
        {
          title: "Employees",
          url: "/dashboard/master-data/employee",
        },
        {
          title: "Roles",
          url: "/dashboard/master-data/role",
        },
        {
          title: "Vehicle Types",
          url: "/dashboard/master-data/vehicle-type",
        },
        {
          title: "Vehicles",
          url: "/dashboard/master-data/vehicle",
        },
        {
          title: "Fee Configs",
          url: "/dashboard/master-data/fee-config",
        },
        {
          title: "Rfid Cards",
          url: "/dashboard/master-data/rfid-card",
        },
      ],
    },
    // {
    //   title: "Report",
    //   url: "#",
    //   icon: (
    //     <BookOpenIcon
    //     />
    //   ),
    //   items: [
    //     {
    //       title: "Cashflow",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Features",
      url: "#",
      icon: (
        <Cpu />
      ),
      items: [
        {
          title: "Gate Devices",
          url: "/dashboard/feature/gate-device",
        },
        // {
        //   title: "Holiday Rates",
        //   url: "/dashboard/feature/holiday-rate",
        // },
        {
          title: "Member Packages",
          url: "/dashboard/feature/membership-package",
        },
        {
          title: "Tenant Members",
          url: "/dashboard/feature/tenant-member",
        },
      ],
    }
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: (
  //       <FrameIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: (
  //       <PieChartIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: (
  //       <MapIcon
  //       />
  //     ),
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Default user data
  const defaultUser = {
    name: "Guest",
    email: "guest@example.com",
    avatar: "/avatars/shadcn.jpg",
  }

  // Use user dari context jika ada, otherwise gunakan default
  const currentUser = user ? {
    name: user.name,
    email: user.email,
    avatar: "/avatars/shadcn.jpg",
  } : defaultUser
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
