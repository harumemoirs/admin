"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, User, LogOut } from "lucide-react";
import {
  Home,
  PenSquare,
  FileText,
  BookOpen,
  Newspaper,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/src/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";

import { useAdmin } from "../hooks/use-admin";
import axios from "axios";

const sidebarNav = [
  {
    title: "Blogs",
    basePath: "/dashboard/blogs",
    baseLink: null,
    icon: PenSquare,
    items: [
      { title: "Add blog", path: "/new-blog", icon: PenSquare },
      { title: "All blogs", path: "/all-blogs", icon: FileText },
    ],
  },
  {
    title: "Letters",
    basePath: "/dashboard/letters",
    baseLink: null,
    icon: FileText,
    items: [
      { title: "Add letter", path: "/new-letter", icon: FileText },
      { title: "All letters", path: "/all-letters", icon: FileText },
    ],
  },
  {
    title: "Poems",
    basePath: "/dashboard/poems",
    baseLink: null,
    icon: BookOpen,
    items: [
      { title: "Add Poem", path: "/new-poem", icon: PenSquare },
      { title: "All Poems", path: "/all-poems", icon: BookOpen },
    ],
  },
  {
    title: "Journals",
    basePath: "/dashboard/journals",
    baseLink: null,
    icon: BookOpen,
    items: [
      { title: "Add journal", path: "/new-journal", icon: PenSquare },
      { title: "All journals", path: "/all-journals", icon: BookOpen },
    ],
  },
  {
    title: "Newsletters",
    basePath: "/dashboard/newsletter",
    baseLink: null,
    icon: Newspaper,
    items: [
      { title: "New Broadcast", path: "/new-broadcast", icon: Newspaper },
    ],
  },
  {
    title: "Subscribers",
    basePath: "/dashboard/subscribers",
    baseLink: null,
    icon: Users,
    items: [
      { title: "All subscribers", path: "/all-subscribers", icon: Users },
    ],
  },
];

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, loading } = useAdmin();

  const handleLogout = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/kairos/v1/admin/auth/logout`,
      {},
      { withCredentials: true }
    );

    router.push("/auth/login");
  };

  return (
    <Sidebar {...props}>
      {/* --- Header --- */}
      <SidebarHeader className="p-4 border-b">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Image
            src="/nav-icon.svg"
            alt="Haru Memoirs Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <h5 className="mt-1 text-lg font-semibold">Haru Memoirs</h5>
        </div>
      </SidebarHeader>

      {/* --- Main Nav --- */}
      <SidebarContent className="gap-0 flex-1">
        {sidebarNav.map((group) => (
          <Collapsible
            key={group.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="text-sidebar-foreground text-sm"
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    suppressHydrationWarning
                  >
                    {group.baseLink ? (
                      <>
                        <Link
                          href={group.baseLink}
                          className="flex-1 text-left"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {group.title}
                        </Link>
                        <ChevronRight className="ml-2 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-2 flex-1 text-left">
                          {group.icon && <group.icon size={16} />}
                          {group.title}
                        </span>
                        <ChevronRight className="ml-2 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </>
                    )}
                  </button>
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const fullPath = `${group.basePath}${item.path}`;
                      const isActive = pathname === fullPath;

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link
                              href={fullPath}
                              className={`flex items-center gap-2 ${
                                isActive ? "bg-blue-100 hover:bg-blue-100" : ""
                              }`}
                            >
                              {item.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      {/* --- User Info with DropdownMenu (Mobile-Friendly) --- */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <User size={20} className="text-gray-600" />
              </div>

              <div className="flex flex-col text-left flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {loading ? "Loading..." : admin?.name}
                </span>

                <span className="text-xs text-gray-500">
                  {admin?.email || "No email"}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut size={16} className="mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}