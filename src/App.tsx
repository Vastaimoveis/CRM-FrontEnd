import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './layout/DashboardLayout'
import { PrivateRoute } from './routes/PrivateRoute'
import FunilPage from './modules/funil/pages/FunilPage'
import LeadsPage from './modules/Leads/pages/LeadsPage'
import OportunidadesPage from './modules/Oportunitys/pages/OportunidadesPage'
import Login from './modules/login/pages/login'

function App() {

  return (
    <BrowserRouter>
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
    </BrowserRouter>

  )
}

export default App
