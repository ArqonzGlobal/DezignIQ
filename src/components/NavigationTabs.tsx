import { Button } from "@/components/ui/button";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'all-tools', label: 'All Tools' },
  { id: 'edit-modify', label: 'Edit & Modify' },
  { id: 'image-tools', label: 'Image tools' },
  { id: 'ai-enhancements', label: 'AI Enhancements' },
  { id: 'concept-tools', label: 'Concept Tools' },
];

export const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  return (
    <div className="flex items-center gap-2 mb-8">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'default' : 'ghost'}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            activeTab === tab.id 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};