import { useEffect, useState } from "react";
import { RedirectIfAuthenticated, RequireAuth } from "./guards";
import { CallbackPage } from "../../features/auth/CallbackPage";
import { NotFoundPage } from "../../features/auth/NotFoundPage";
import { BookmarksScreen } from "../../features/bookmarks/BookmarksScreen";
import { SignInScreen } from "../../features/sign-in/SignInScreen";
import { useT } from "../../lib/i18n/LocalizationProvider";

export function AppRouter() {
  const { t } = useT();
  const [path, setPath] = useState(() => window.location.pathname);
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(nextPath: string) {
    const [nextPathname = "/", queryString = ""] = nextPath.split("?");
    window.history.pushState({}, "", nextPath);
    setPath(nextPathname);
    setSearch(queryString ? `?${queryString}` : "");
  }

  if (path === "/login/callback") {
    return <CallbackPage onNavigate={navigate} />;
  }

  const params = new URLSearchParams(search);

  if (path === "/login" || path === "/sign-in") {
    const returnTo = params.get("returnTo") || "/";
    return (
      <RedirectIfAuthenticated onNavigate={navigate}>
        <SignInScreen onNavigate={navigate} />
      </RedirectIfAuthenticated>
    );
  }

  if (path === "/" || path === "/bookmarks") {
    return (
      <RequireAuth currentPath={path === "/" ? "/bookmarks" : path} onNavigate={navigate}>
        <BookmarksScreen
          activeFolder={params.get("folder") || undefined}
          notice={params.get("created") ? t("bookmarks.folderCreated", { name: params.get("created") ?? "" }) : undefined}
          onNavigate={navigate}
        />
      </RequireAuth>
    );
  }

  return <NotFoundPage onNavigate={navigate} />;
}
