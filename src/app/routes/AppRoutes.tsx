import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '@/modules/login/pages/login'
import DashboardLayout from '@/layout/DashboardLayout'
import { PrivateRoute } from './PrivateRoute'
import FunilPage from '@/modules/funil/pages/FunilPage'
import LeadsPage from '@/modules/Leads/pages/LeadsPage'
import OportunidadesPage from '@/modules/Oportunitys/pages/OportunidadesPage'
import AppProviders from '../providers/AppProviders'
import { RoleGuard } from '@/services/RoleGuard'
import { UserRoles } from '@/shared/types/UserTypes'
import CorretoresPage from '@/modules/Corretores/pages/CorretoresPage'

function App() {

  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path="*" element={<Login />} />
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

          {/*<Route
            path="/requisicoes"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <RequisitosPage />
                </DashboardLayout>
              </PrivateRoute>
              }
              />
          */}
          <Route
            path="/corretores"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <RoleGuard allowed={[UserRoles.GERENTE]}>
                    <CorretoresPage />
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
