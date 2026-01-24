import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
import FilesPage from "./pages/FilesPage"
import HomePage from "./pages/HomePage"
import PageNotFound from "./pages/PageNotFound"
import UploadPage from "./pages/UploadPage"
import AuthRedirect from "./components/AuthRedirect"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
          <Route
            path="/"
            element={
              <AuthRedirect>
                <HomePage />
              </AuthRedirect>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
