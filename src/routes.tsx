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
import { InventoryHealthView } from "./containers/InventoryHealthView"
import { InventoryHealthMRPView } from "./containers/InventoryHealthMRPView"
import { POInboxView } from "./containers/POInboxView"
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
          { path: "demand/forecast", element: <DemandPlanView /> },
          { path: "demand/validation", element: <RetailValidationView /> },
          { path: "shipments/walk", element: <SupplyWalkView /> },
          { path: "shipments/forecast", element: <ShipmentForecastView /> },
          { path: "shipments/validation", element: <ShipmentsValidationView /> },
          { path: "shipments/configuration", element: <ShipmentsConfigurationView /> },
          { path: "inventory-health", element: <InventoryHealthView /> },
          { path: "inventory-health-mrp", element: <InventoryHealthMRPView /> },
          { path: "po-inbox", element: <POInboxView /> },
          { path: "nucleus", element: <NucleusChatView /> },
        ],
      },
    ],
  },
])

export default router
