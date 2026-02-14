import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function Layout({ children, showFooter = true }: { children: React.ReactNode; showFooter?: boolean }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Landing />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <Layout showFooter={false}>
                <Dashboard />
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
