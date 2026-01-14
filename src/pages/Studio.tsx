import { useState, useEffect } from "react";
import {
  BookOpen, Mic, Volume2, Brain, FileText, BarChart3,
  AudioLines, Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import predikaLogo from "@assets/predika-logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";

import Dictionary from "@/pages/Dictionary";
import Quiz from "@/pages/Quiz";
import Progress from "@/pages/Progress";
import TextToSpeech from "@/pages/TextToSpeech";
import PronunciationAssessment from "@/pages/PronunciationAssessment";
import SpeechToText from "@/pages/SpeechToText";
import GrammarCorrector from "@/pages/GrammarCorrector";

const navItems = [
  { id: "progress", label: "Pwogrè", icon: BarChart3, component: Progress },
  { id: "dictionary", label: "Diksyonè", icon: BookOpen, component: Dictionary },
  { id: "quiz", label: "Sant Quiz", icon: Brain, component: Quiz },
  { id: "tts", label: "Tèks an Lapawòl", icon: Volume2, component: TextToSpeech },
  { id: "pronunciation", label: "Pwononsyasyon", icon: Mic, component: PronunciationAssessment },
  { id: "stt", label: "Lapawòl an Tèks", icon: AudioLines, component: SpeechToText },
  { id: "gec", label: "Verifye Gramè", icon: FileText, component: GrammarCorrector },
];

function AppSidebar({
  activeTab,
  setActiveTab,
  user,
  onLogout
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; email: string; avatar?: string };
  onLogout: () => void;
}) {
  const mainNavItems = navItems.map(item => ({
    title: item.label,
    icon: item.icon,
    isActive: activeTab === item.id,
    onClick: () => setActiveTab(item.id),
  }));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg overflow-hidden">
                  <img src={predikaLogo} alt="Predika" className="w-full h-full object-cover" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-serif font-bold text-lg">Predika</span>
                  <span className="truncate text-xs text-muted-foreground">Estidyo Lang</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainNavItems} label="Fonksyon" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default function Studio() {
  const [activeTab, setActiveTab] = useState("progress");
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const ActiveComponent = navItems.find(item => item.id === activeTab)?.component || Progress;
  const activeLabel = navItems.find(item => item.id === activeTab)?.label || "Diksyonè";

  const userData = {
    name: user.fullName || user.email || "User",
    email: user.email || "",
    ...(user.avatar ? { avatar: user.avatar } : {}),
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={userData}
          onLogout={logout}
        />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" data-testid="button-sidebar-toggle" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{activeLabel}</h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <ActiveComponent />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
