import { useEffect, useState } from "react";
import type { UserRole } from "../domain/entities/User";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

type AppRoute = "login" | "forgot-password" | "dashboard";

function getRoute(): AppRoute {
  if (window.location.pathname === "/dashboard") return "dashboard";
  if (window.location.pathname === "/forgot-password") return "forgot-password";
  return "login";
}

export function App() {
  const [route, setRoute] = useState<AppRoute>(getRoute);
  const [demoRole, setDemoRole] = useState<UserRole>("manager");

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextRoute: Exclude<AppRoute, "dashboard">) => {
    const path = nextRoute === "login" ? "/login" : `/${nextRoute}`;
    window.history.pushState(null, "", path);
    setRoute(nextRoute);
  };

  const enterDemo = (role: UserRole) => {
    setDemoRole(role);
    window.history.pushState(null, "", "/dashboard");
    setRoute("dashboard");
  };

  if (route === "dashboard") return <DashboardPage role={demoRole} />;

  return (
    <LoginPage
      mode={route}
      onNavigate={navigate}
      onEnterDemo={enterDemo}
    />
  );
}
