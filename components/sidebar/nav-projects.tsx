"use client";

import {
  File,
  FileSpreadsheet,
  Forward,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useLiveAnalyses } from "@/hooks/useLiveAnalyses";
import { deleteAnalysis as deleteAnalysisIDB } from "@/lib/idb";

export function NavAnalyses() {
  const { isMobile } = useSidebar();
  // const [analyses, setAnalyses] = useState<Analysis[]>([]);

  const analyses = useLiveAnalyses();

  const handleDeleteAnalysis = async (analysisId: string) => {
    try {
      await deleteAnalysisIDB(analysisId);
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Analyses biomédicales</SidebarGroupLabel>
      <SidebarMenu>
        {analyses.map((analysis) => (
          <SidebarMenuItem key={analysis.id}>
            <SidebarMenuButton asChild>
              <div>
                <File />
                <span>{analysis.name}</span>
              </div>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover className="cursor-pointer">
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Link
                    className="flex gap-2 w-full"
                    href={`/biostatistics/${analysis.id}`}
                  >
                    <FileSpreadsheet className="text-muted-foreground" />
                    <span>View Analysis</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    className="flex gap-2 w-full"
                    href={`/export/${analysis.id}`}
                  >
                    <Forward className="text-muted-foreground" />
                    <span>Share Analysis</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteAnalysis(analysis.id)}
                  className="text-destructive cursor-pointer"
                >
                  <Trash2 className="text-destructive" />
                  <span>Delete Analysis</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
