import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Импортируем App

import "./style/bootstrap.css";
import "./style/bootstrap-responsive.css";
import "./style/city.css";
import "./style/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);