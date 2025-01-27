import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import StoreContextProvider from "./user/context/StoreContext.jsx";
import AdminStoreContextProvider from "./admin/context/AdminStoreContextProvider.jsx.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      <AdminStoreContextProvider>
        <App />
      </AdminStoreContextProvider>
    </StoreContextProvider>
  </BrowserRouter>
);