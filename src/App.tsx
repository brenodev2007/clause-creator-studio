import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import AdminPanel from "./pages/AdminPanel";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import ContratosList from "./pages/ContratosList";
import ModelosGallery from "./pages/ModelosGallery";
import ContractEditor from "./pages/ContractEditor";
import ContractReview from "./pages/ContractReview";
import Dashboard from "./pages/Dashboard";
import ClausulasLibrary from "./pages/ClausulasLibrary";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              {/* App Routes with Layout */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                {/* Default route for /app */}
                <Route index element={<Dashboard />} />
                <Route path="contratos" element={<ContratosList />} />
                <Route path="modelos" element={<ModelosGallery />} />
                <Route path="clausulas" element={<ClausulasLibrary />} />
                <Route path="editor/:id" element={<ContractEditor />} />
                <Route path="revisao/:id" element={<ContractReview />} />
                <Route path="configuracoes" element={<Profile />} />
                <Route path="admin" element={<AdminPanel />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />


              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
