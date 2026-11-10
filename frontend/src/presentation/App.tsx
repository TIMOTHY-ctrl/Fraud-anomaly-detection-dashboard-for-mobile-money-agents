import { useEffect, useState } from "react";
import type { UserRole } from "../domain/entities/User";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

type AppRoute = "login" | "forgot-password" | "dashboard";

function getRoute(): AppRoute {
  const path = window.location.hash.slice(1);
  if (path === "/dashboard") return "dashboard";
  if (path === "/forgot-password") return "forgot-password";
  return "login";
}

function getDemoRole(): UserRole {
  const role = window.sessionStorage.getItem("nexaguard-demo-role");
  return role === "agent" || role === "analyst" ? role : "manager";
}

export function App() {
  const [route, setRoute] = useState<AppRoute>(getRoute);
  const [demoRole, setDemoRole] = useState<UserRole>(getDemoRole);

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextRoute: Exclude<AppRoute, "dashboard">) => {
    window.history.pushState(null, "", `${import.meta.env.BASE_URL}#/${nextRoute}`);
    setRoute(nextRoute);
  };

  const enterDemo = (role: UserRole) => {
    setDemoRole(role);
    window.sessionStorage.setItem("nexaguard-demo-role", role);
    window.history.pushState(null, "", `${import.meta.env.BASE_URL}#/dashboard`);
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
