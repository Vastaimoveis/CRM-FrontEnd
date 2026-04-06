import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './layout/DashboardLayout'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './routes/PrivateRoute'
import FunilPage from './modules/funil/pages/FunilPage'
import { LeadProvider } from './context/LeadContext'
import LeadsPage from './modules/Leads/pages/LeadsPage'
import OportunidadesPage from './modules/Oportunitys/pages/OportunidadesPage'
import { ToastProvider } from './context/ToastContext'
import Login from './modules/login/pages/login'

function App() {

  return (
    <AuthProvider>
      <LeadProvider>
        <BrowserRouter>
          <ToastProvider>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route
                path="/funil"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <FunilPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/leads"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <LeadsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/oportunidades"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <OportunidadesPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </ToastProvider>
        </BrowserRouter>
      </LeadProvider>
    </AuthProvider >
  )
}

export default App
