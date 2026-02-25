import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import DashboardLayout from './layout/DashboardLayout'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './routes/PrivateRoute'
import FunilPage from './modules/funil/pages/FunilPage'
import { LeadProvider } from './context/LeadContext'

function App() {
  function Leads() {
    return <div>Leads</div>;
  }

  function Oportunidades() {
    return <div>Oportunidades</div>;
  }

  return (
    <AuthProvider>
      <LeadProvider>

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
                    <Leads />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/oportunidades"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Oportunidades />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </LeadProvider>
    </AuthProvider>
  )
}

export default App
