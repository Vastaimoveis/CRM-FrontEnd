import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '@/modules/login/pages/login'
import DashboardLayout from '@/layout/DashboardLayout'
import { PrivateRoute } from './PrivateRoute'
import FunilPage from '@/modules/funil/pages/FunilPage'
import LeadsPage from '@/modules/Leads/LeadsPage'
import OportunidadesPage from '@/modules/Oportunitys/pages/OportunidadesPage'
import AppProviders from '../providers/AppProviders'
import { RoleGuard } from '@/services/RoleGuard'
import RequisitosPage from '@/modules/Requisitos/pages/RequisitosPage'
import { UserRoles } from '@/shared/types/UserTypes'

function App() {

  return (
    <BrowserRouter>
      <AppProviders>
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

          <Route
            path="/requisicoes"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <RoleGuard allowed={[UserRoles.GERENTE]}>
                    <RequisitosPage />
                  </RoleGuard>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </AppProviders>
    </BrowserRouter>

  )
}

export default App
