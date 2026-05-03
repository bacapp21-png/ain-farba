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
    }
  }
});

function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/articles">
        <RequireAdmin>
          <AdminLayout>
            <AdminArticles />
          </AdminLayout>
        </RequireAdmin>
      </Route>
      <Route path="/admin/events">
        <RequireAdmin>
          <AdminLayout>
            <AdminEvents />
          </AdminLayout>
        </RequireAdmin>
      </Route>
      <Route path="/admin/notables">
        <RequireAdmin>
          <AdminLayout>
            <AdminNotables />
          </AdminLayout>
        </RequireAdmin>
      </Route>
      <Route path="/admin">
        <RequireAdmin>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </RequireAdmin>
      </Route>
    </Switch>
  );
}

function PublicRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/articles" component={Articles} />
        <Route path="/articles/:id" component={ArticleDetail} />
        <Route path="/events" component={Events} />
        <Route path="/events/:id" component={EventDetail} />
        <Route path="/notables" component={Notables} />
        <Route path="/notables/:id" component={NotableDetail} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/:rest*">
        {() => <AdminRoutes />}
      </Route>
      <Route>
        {() => <PublicRoutes />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
