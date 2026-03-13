import { Outlet } from "react-router"
import { AuthProvider } from "./contexts/AuthContext"
import { SystemMessagesProvider } from "./contexts/SystemMessagesContext"

function App() {
  return (
    <AuthProvider>
      <SystemMessagesProvider>
        <Outlet />
      </SystemMessagesProvider>
    </AuthProvider>
  )
}

export default App
