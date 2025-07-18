
import { Button } from "@/components/ui/button";
import { BarChart3, BookOpen, TrendingUp, Calendar, Settings } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: any;
}

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "classrooms", label: "Classrooms", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          onClick={() => onTabChange(tab.id)}
          className={`transition-all duration-200 ${
            activeTab === tab.id 
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25" 
              : "border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:shadow-lg hover:shadow-white/5"
          }`}
        >
          <tab.icon className="h-4 w-4 mr-2" />
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default DashboardTabs;
