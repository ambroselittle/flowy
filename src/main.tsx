import React from "react";
import ReactDOM from "react-dom/client";
import { SalesDashboard } from "./dashboard/SalesDashboard.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SalesDashboard />
  </React.StrictMode>
);
