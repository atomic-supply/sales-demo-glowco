import { createBrowserRouter, Navigate } from "react-router"
import App from "./App.tsx"
import { DashboardLayout } from "./layouts"
import { DataHubView } from "./containers/DataHubView"
import { DemandPlanView } from "./containers/DemandPlanView"
import { RetailValidationView } from "./containers/RetailValidationView"
import { SupplyWalkView } from "./containers/SupplyWalkView"
import { ShipmentForecastView } from "./containers/ShipmentForecastView"
import { ShipmentsValidationView } from "./containers/ShipmentsValidationView"
import { ShipmentsConfigurationView } from "./containers/ShipmentsConfigurationView"
import { NucleusChatView } from "./containers/NucleusChatView"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/data-hub" replace /> },
          { path: "data-hub", element: <DataHubView /> },
          { path: "retailers", element: <DemandPlanView /> },
          { path: "retailers/validation", element: <RetailValidationView /> },
          { path: "shipments", element: <SupplyWalkView /> },
          { path: "shipments/forecast", element: <ShipmentForecastView /> },
          { path: "shipments/validation", element: <ShipmentsValidationView /> },
          { path: "shipments/configuration", element: <ShipmentsConfigurationView /> },
          { path: "nucleus", element: <NucleusChatView /> },
        ],
      },
    ],
  },
])

export default router
