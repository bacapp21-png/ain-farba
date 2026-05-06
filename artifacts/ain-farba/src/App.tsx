import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import AdminLayout from "@/components/admin-layout";
import { AdminAuthProvider, RequireAdmin } from "@/lib/admin-auth";

// Public pages
import Home from "@/pages/home";
import Articles from "@/pages/articles/index";
import ArticleDetail from "@/pages/articles/[id]";
import Events from "@/pages/events/index";
import EventDetail from "@/pages/events/[id]";
import Notables from "@/pages/notables/index";
import NotableDetail from "@/pages/notables/[id]";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

// Admin pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/index";
import AdminArticles from "@/pages/admin/articles";
import AdminEvents from "@/pages/admin/events";
import AdminNotables from "@/pages/admin/notables";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Switch>
              {/* Admin login — no auth required */}
              <Route path="/admin/login" component={AdminLogin} />

              {/* Admin protected pages */}
              <Route path="/admin/articles">
                <RequireAdmin>
                  <AdminLayout><AdminArticles /></AdminLayout>
                </RequireAdmin>
              </Route>
              <Route path="/admin/events">
                <RequireAdmin>
                  <AdminLayout><AdminEvents /></AdminLayout>
                </RequireAdmin>
              </Route>
              <Route path="/admin/notables">
                <RequireAdmin>
                  <AdminLayout><AdminNotables /></AdminLayout>
                </RequireAdmin>
              </Route>
              <Route path="/admin">
                <RequireAdmin>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </RequireAdmin>
              </Route>

              {/* Public pages */}
              <Route path="/">
                <Layout><Home /></Layout>
              </Route>
              <Route path="/articles">
                <Layout><Articles /></Layout>
              </Route>
              <Route path="/articles/:id">
                <Layout><ArticleDetail /></Layout>
              </Route>
              <Route path="/events">
                <Layout><Events /></Layout>
              </Route>
              <Route path="/events/:id">
                <Layout><EventDetail /></Layout>
              </Route>
              <Route path="/notables">
                <Layout><Notables /></Layout>
              </Route>
              <Route path="/notables/:id">
                <Layout><NotableDetail /></Layout>
              </Route>
              <Route path="/about">
                <Layout><About /></Layout>
              </Route>
              <Route>
                <Layout><NotFound /></Layout>
              </Route>
            </Switch>
          </WouterRouter>
          <Toaster />
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
