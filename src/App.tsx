import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import { DashboardProvider } from './context/DashboardContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignalRProvider } from './context/SignalRContext';
import { ThemeProvider } from './context/ThemeContext';
import { App as CapacitorApp } from '@capacitor/app';
import SalesPanel from './pageInline/SalesPanel';
import GeneralPanel from './pageInline/GeneralPanel';
import PurchasingPanel from './pageInline/PurchasingPanel';
import FinancePanel from './pageInline/FinancePanel';
import ProjectPanel from './pageInline/ProjectPanel';
import PartnerPanel from './pageInline/PartnerPanel';
import MainMenu from './pages/MainMenu';
import InventoryPanel from './pageInline/InventoryPanel';
import LogisticPanel from './pageInline/LogisticPanel';
import TodoPanel from './pageInline/TodoPanel';
import HRPanel from './pageInline/HRPanel';
import VesselVisitPanel from './pageInline/VesselVisitPanel';
import ServicePanel from './pageInline/ServicePanel';
import ShipPanel from './pageInline/ShipPanel';
import Login from './pages/Login';
import DetailDashboard from './pages/DetailDashboard';
import ErrorBoundary from './components/ErrorBoundary';

// Loading component
const LoadingSpinner = () => (
   <div className="flex items-center justify-center h-screen w-full bg-slate-50 dark:bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
   </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
   const { isAuthenticated, isLoading } = useAuth();
   const location = useLocation();

   if (isLoading) {
      return <LoadingSpinner />;
   }

   if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   return children;
};

// Handle Android hardware back button in Capacitor APK
const BackButtonHandler = () => {
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      const listenerPromise = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
         // Önce router geçmişine geri git
         if (canGoBack || window.history.length > 1) {
            navigate(-1);
            return;
         }

         // Giriş veya ana ekrandaysak uygulamadan çık
         if (location.pathname === '/login' || location.pathname === '/') {
            CapacitorApp.exitApp();
         } else {
            navigate(-1);
         }
      });

      return () => {
         listenerPromise.then(handle => handle.remove());
      };
   }, [navigate, location.pathname]);

   return null;
};

const App = () => {
   return (
      <ErrorBoundary>
         <AuthProvider>
            <ThemeProvider>
               <SignalRProvider>
                  <DashboardProvider>
                     <BrowserRouter>
                        <BackButtonHandler />
                        <Suspense fallback={<LoadingSpinner />}>
                           <Routes>
                              <Route path="/login" element={<Login />} />

                              <Route path="/" element={
                                 <ProtectedRoute>
                                    <MainLayout />
                                 </ProtectedRoute>
                              }>
                                 <Route index element={<MainMenu />} />
                                 <Route path="general" element={<GeneralPanel />} />
                                 <Route path="sales" element={<SalesPanel />} />
                                 <Route path="purchasing" element={<PurchasingPanel />} />
                                 <Route path="inventory" element={<InventoryPanel />} />
                                 <Route path="logistics" element={<LogisticPanel />} />
                                 <Route path="finance" element={<FinancePanel />} />
                                 <Route path="hr" element={<HRPanel />} />
                                 <Route path="projects" element={<ProjectPanel />} />
                                 <Route path="partners" element={<PartnerPanel />} />
                                 <Route path="services" element={<ServicePanel />} />
                                 <Route path="ships" element={<ShipPanel />} />
                                 <Route path="vessel-visits" element={<VesselVisitPanel />} />
                                 <Route path="todo" element={<TodoPanel />} />


                                 <Route path="detail/:type/:id" element={<DetailDashboard />} />
                              </Route>

                              <Route path="*" element={<Navigate to="/" replace />} />
                           </Routes>
                        </Suspense>
                     </BrowserRouter>
                  </DashboardProvider>
               </SignalRProvider>
            </ThemeProvider>
         </AuthProvider>
      </ErrorBoundary>
   );
};

export default App;