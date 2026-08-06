import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/primitives.css";
import "./styles/semantic.css";
import "./styles/reset.css";
import "./styles/scroll-reveal.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
