import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./components/Profile";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Dashboard from "./components/dashboard/Index";
import Payments from "./components/payments/Index";
import Administrator from "./components/administrator/Index";
import Template from "./components/payments/Template";
import CourseInfo from "./components/dashboard/CourseInfo";
import Queries from "./components/queries/Index";
import Program from "./components/administrator/program";
import History from "./components/history/Index";
import Catalog from "./components/administrator/catalog";
import Details from "./components/history/details";
import PayPDF from "./components/payments/payPdfRedirect";
import { Toaster } from "sonner";
import { PrimeReactProvider } from "primereact/api";
import { Buffer } from "buffer";
import process from "process";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <PrimeReactProvider>
      <Router>
        <div className="flex h-screen">
          <div className="flex-1 bg-white overflow-y-auto">
            <div className="mx-auto">
              <Routes>
                <Route
                  path="/"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" />
                    ) : (
                      <HomePage />
                    )
                  }
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/admin" element={<Administrator />} />
                <Route path="/template" element={<Template />} />
                <Route path="/courseinfo" element={<CourseInfo />} />
                <Route path="/queries" element={<Queries />} />
                <Route path="/program" element={<Program />} />
                <Route path="/history" element={<History />} />
                <Route path="/history/details" element={<Details />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/paypdf" element={<PayPDF />} />
              </Routes>
              <Toaster position="top-right" />
            </div>
          </div>
        </div>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
