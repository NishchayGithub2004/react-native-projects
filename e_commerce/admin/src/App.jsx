import { Navigate, Route, Routes } from "react-router"; // import 'Navigate' component to redirect user to another page, 'Route' component to map component to render at URLs and 'Routes' component to group all 'Route' in one container

import { useAuth } from "@clerk/clerk-react"; // import 'useAuth' hook to get information about user like if it is signed in

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";

import DashboardLayout from "./layouts/DashboardLayout";

import PageLoader from "./components/PageLoader";

function App() {
  const { isSignedIn, isLoaded } = useAuth(); // from 'useAuth' hook, extract 'isSignedIn' boolean flag to check if user is signed in
  // and 'isLoaded' boolean flag to check if current page has been loaded

  if (!isLoaded) return <PageLoader />; // if 'isLoaded' is false ie current page is not loaded, return 'PageLoader' component which renders a loading icon

  return (
    <Routes>
      <Route path="/login" element={isSignedIn ? <Navigate to={"/dashboard"} /> : <LoginPage />} />
      {/* at '/login' ie login page, render 'Navigate' component which redirects to '/dashboard' page ie dashboard page, otherwise render 'LoginPage' page */}

      <Route path="/" element={isSignedIn ? <DashboardLayout /> : <Navigate to={"/login"} />}>
        {/* at '/' ie home page, render 'DashboardLayout' page if user is signed in, otherwise render 'Navigate' component which redirects to '/login' ie login page */}
        <Route index element={<Navigate to={"dashboard"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  );
}

export default App;