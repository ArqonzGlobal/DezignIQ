import {
  LayoutDashboard,
  Package,
  Home,
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  Award,
  FileCheck,
  Brain,
  CreditCard,
  Settings,
  MessageCircle,
  User,
  Database,
} from "lucide-react";
import { Route, Routes, NavLink } from "react-router-dom";
import Dashboard from "./profile/Dashboard";
import ProductsManagement from "./profile/ProductsManagement";
import PropertiesManagement from "./profile/PropertiesManagement";
import ProfessionalsManagement from "./profile/ProfessionalsManagement";
import ProjectsManagement from "./profile/ProjectsManagement";
import RequirementsManagement from "./profile/RequirementsManagement";
import EnquiriesManagement from "./profile/EnquiriesManagement";
import EndorsementsManagement from "./profile/EndorsementsManagement";
import KYCManagement from "./profile/KYCManagement";
import AQIQManagement from "./profile/AQIQManagement";
import BuyCredits from "./profile/BuyCredits";
import ConfigManagement from "./profile/ConfigManagement";
import ChatManagement from "./profile/ChatManagement";
import ProfileDetails from "./profile/ProfileDetails";
import SampleDataGenerator from "./profile/SampleDataGenerator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Header } from "@/components/Header";

const menuItems = [
  { title: "Dashboard", url: "/profile", icon: LayoutDashboard },
  { title: "Products", url: "/profile/products", icon: Package },
  { title: "Properties", url: "/profile/properties", icon: Home },
  { title: "Projects", url: "/profile/projects", icon: Briefcase },
  { title: "Professionals", url: "/profile/professionals", icon: Users },
  { title: "Requirements", url: "/profile/requirements", icon: FileText },
  { title: "Enquiries", url: "/profile/enquiries", icon: MessageSquare },
  { title: "Endorsements", url: "/profile/endorsements", icon: Award },
  { title: "KYC", url: "/profile/kyc", icon: FileCheck },
  { title: "AQ-IQ", url: "/profile/aq-iq", icon: Brain },
  { title: "Buy Credits", url: "/profile/buy-credits", icon: CreditCard },
  { title: "Config", url: "/profile/config", icon: Settings },
  { title: "Chat", url: "/profile/chat", icon: MessageCircle },
  { title: "Profile", url: "/profile/details", icon: User },
  { title: "Sample Data", url: "/profile/sample-data", icon: Database },
];

function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/profile"}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const Profile = () => {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <SidebarProvider>
        <div className="flex w-full">
          <div className="mt-[16px]">
            <AppSidebar />
          </div>
          <main className="flex-1 p-6 pt-8 mt-[16px]">
            <div className="mb-6">
              <SidebarTrigger />
            </div>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="properties" element={<PropertiesManagement />} />
              <Route path="professionals" element={<ProfessionalsManagement />} />
              <Route path="projects" element={<ProjectsManagement />} />
              <Route path="requirements" element={<RequirementsManagement />} />
              <Route path="enquiries" element={<EnquiriesManagement />} />
              <Route path="endorsements" element={<EndorsementsManagement />} />
              <Route path="kyc" element={<KYCManagement />} />
              <Route path="aq-iq" element={<AQIQManagement />} />
              <Route path="buy-credits" element={<BuyCredits />} />
              <Route path="config" element={<ConfigManagement />} />
              <Route path="chat" element={<ChatManagement />} />
              <Route path="details" element={<ProfileDetails />} />
              <Route path="sample-data" element={<SampleDataGenerator />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Profile;
