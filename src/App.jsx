import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home, FileText, Gamepad } from "lucide-react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/sidebar"; // Use the sidebar layout
import Index from "./pages/Index.jsx";
import CsvManagement from "./pages/CsvManagement.jsx"; // Import the new CSV management page
import Gobang from "./pages/Gobang.jsx"; // Import the new Gobang game page

const queryClient = new QueryClient();

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "CSV Management",
    to: "/csv-management",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Gobang Game", // New navigation item
    to: "/gobang",
    icon: <Gamepad className="h-4 w-4" />,
  },
];

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="csv-management" element={<CsvManagement />} />
              <Route path="gobang" element={<Gobang />} /> {/* New route */}
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;