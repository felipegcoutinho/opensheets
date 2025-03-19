"use client";

import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Eye, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import Logo from "../logo";
import PrivacyButton from "../privacy-button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { getData } from "./nav-links";

export function AppSidebar({
  username,
  usermail,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: any }) {
  const { open } = useSidebar();
  const data = getData();
  const { resolvedTheme, setTheme } = useTheme();
  const [calcInput, setCalcInput] = React.useState("");
  const [calcResult, setCalcResult] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    try {
      setCalcResult(eval(calcInput) || "");
    } catch {
      setCalcResult("Erro");
    }
  }, [calcInput]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {open ? <Logo /> : <span className="text-black">OP</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />

        <div className="p-4 group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Calculadora</SidebarGroupLabel>
          <Input
            type="text"
            value={calcInput}
            onChange={(e) => setCalcInput(e.target.value)}
          />
          <div className="mt-2 text-lg font-bold">{calcResult}</div>
        </div>

        <SidebarMenuItem className="mt-auto mb-6 space-y-2 px-3 group-data-[collapsible=icon]:hidden">
          <SidebarMenuButton asChild>
            <label>
              <Eye />
              <span>Valores Visíveis</span>
              <PrivacyButton />
            </label>
          </SidebarMenuButton>

          <SidebarMenuButton asChild>
            <label>
              <Palette />
              <span>Dark Mode</span>
              {mounted && (
                <Switch
                  className="ml-auto"
                  checked={resolvedTheme !== "light"}
                  onCheckedChange={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                />
              )}
            </label>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser username={username} usermail={usermail} user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
