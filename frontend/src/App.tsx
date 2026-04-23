import React, { Component } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { loginRoutes } from './pages/Auth/Login'
import { TooltipProvider } from './components/ui/tooltip'
import { dashboardRoutes } from './pages/Dashboard'
import { entryParkingRoutes } from './pages/EntryParking'
import Cookies from 'js-cookie'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = Cookies.get('accessToken')

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default class App extends Component {
  render() {
    return (
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {loginRoutes.map((route) => (
              <Route key={route.path} {...route} />
            ))}

            {dashboardRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute>
                    {route.element}
                  </ProtectedRoute>
                }
              />
            ))}

            {entryParkingRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute>
                    {route.element}
                  </ProtectedRoute>
                }
              />
            ))}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    )
  }
}
