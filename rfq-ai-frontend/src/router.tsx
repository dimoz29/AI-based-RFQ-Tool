
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import DashboardBuyer from "./pages/DashboardBuyer";
import DashboardSupplier from "./pages/DashboardSupplier";
import RFQDetailPage from "./pages/RFQDetailPage";

export default createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardBuyer /> },
      { path: "supplier", element: <DashboardSupplier /> },
      { path: "rfq/:id", element: <RFQDetailPage /> },
    ],
  },
]);
