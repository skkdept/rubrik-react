import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/primitives.css";
import "./styles/semantic.css";
import "./styles/reset.css";
import "./styles/scroll-reveal.css";
import App from "./App.tsx";
import { ComponentDetails } from "./pages/ComponentDetails/ComponentDetails.tsx";

const notFound = (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
    <p>404: Page not found.</p>
  </div>
);

// No router in this app: one real page plus this single unlisted reference
// page doesn't warrant adding one. Vite's dev server (and the production
// server.js catch-all) both serve this same index.html for ANY path, so
// without an explicit check every unknown path would silently render the
// homepage instead of a real 404 — matched only against "" (root) and
// "component-details" here, everything else falls through to NotFound.
// Reached only by knowing the URL directly (nothing on the site links to
// it); the production server (see server.js) already password-gates every
// path under its base, this one included, so no separate auth is needed here.
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");
let path = window.location.pathname;
if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length);
path = path.replace(/^\/+|\/+$/g, "");

const page = path === "" ? <App /> : path === "component-details" ? <ComponentDetails /> : notFound;

createRoot(document.getElementById("root")!).render(<StrictMode>{page}</StrictMode>);
