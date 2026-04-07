import { createBrowserRouter, Navigate } from "react-router"
import App from "./App.tsx"
import { DashboardLayout } from "./layouts"
import { DataHubView } from "./containers/DataHubView"
import { PlanStatusView } from "./containers/PlanStatusView"
import { StageViewPage } from "./containers/StageViewPage"
import { ShipmentsPlanPage } from "./containers/ShipmentsPlanPage"
import { NucleusChatView } from "./containers/NucleusChatView"
import { ConsumptionPlanPage } from "./containers/ConsumptionPlanPage"
import { ConsumptionPivotPage } from "./containers/ConsumptionPivotPage"
import { ConsumptionValidationPage } from "./containers/ConsumptionValidationPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/consumption/plan" replace /> },
          { path: "data-hub", element: <DataHubView /> },
          { path: "plan-status", element: <PlanStatusView /> },
          { path: "consumption/plan", element: <ConsumptionPlanPage /> },
          { path: "consumption/pivot", element: <ConsumptionPivotPage /> },
          { path: "consumption/validation", element: <ConsumptionValidationPage /> },
          { path: "plan", element: <Navigate to="/plan/shipments" replace /> },
          { path: "plan/shipments", element: <ShipmentsPlanPage /> },
          { path: "plan/:moduleId", element: <StageViewPage /> },
          { path: "nucleus", element: <NucleusChatView /> },
        ],
      },
    ],
  },
])

export default router
