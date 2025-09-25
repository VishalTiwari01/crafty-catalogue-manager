import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";
import Orders from "./pages/admin/Users";
import { Provider } from "react-redux";
import { store } from "./redux/store";
const queryClient = new QueryClient();
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <Provider store={store}>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="admin-panel-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
       

<Routes>
  <Route path="/" element={<Login />} />
  
  {/* Protected Routes */}
  <Route
    path="/admin"
    element={
      <PrivateRoute>
        <AdminLayout><Dashboard /></AdminLayout>
      </PrivateRoute>
    }
  />
  <Route
    path="/admin/products"
    element={
      <PrivateRoute>
        <AdminLayout><Admin /></AdminLayout>
      </PrivateRoute>
    }
  />
  <Route
    path="/admin/users"
    element={
      <PrivateRoute>
        <AdminLayout><Orders /></AdminLayout>
      </PrivateRoute>
    }
  />
  <Route
    path="/admin/analytics"
    element={
      <PrivateRoute>
        <AdminLayout><Analytics /></AdminLayout>
      </PrivateRoute>
    }
  />
  <Route
    path="/admin/settings"
    element={
      <PrivateRoute>
        <AdminLayout><Settings /></AdminLayout>
      </PrivateRoute>
    }
  />
  <Route path="*" element={<NotFound />} />
</Routes>

        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </Provider>
);

export default App;
