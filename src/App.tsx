import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
import UploadPage from "./pages/UploadPage"
import LoginPage from "./pages/LoginPage"
import PageNotFound from "./pages/PageNotFound"
import RegisterPage from "./pages/RegisterPage"
import { Provider } from "react-redux"
import store from "./store"
import AuthRedirect from "./components/AuthRedirect"
import FilesPage from "./pages/FilesPage"

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <RegisterPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/files"
              element={
                <ProtectedRoute>
                  <FilesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  )
}

export default App
