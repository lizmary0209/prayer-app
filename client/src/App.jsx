import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

import Header from "./components/Navigation/Header";
import Cards from "./pages/Cards/Cards";
import AddPrayerModal from "./components/AddPrayerModal/AddPrayerModal";
import LoginModal from "./components/LoginModal/LoginModal";
import RegisterModal from "./components/RegisterModal/RegisterModal";
import Profile from "./pages/Profile/Profile";
import SalvationModal from "./components/SalvationModal/SalvationModal";
import Home from "./pages/Home/Home";


import { getMe, getSalvationCount } from "./utils/api";


export default function App() {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [currentUser, setCurrentUser] = useState(null);
const [isPrayerOpen, setIsPrayerOpen] =useState(false);
const [prayerSeed, setPrayerSeed] = useState(null);
const [isLoginOpen, setIsLoginOpen] = useState(false);
const [isRegisterOpen, setIsRegisterOpen] = useState(false);
const [cardsRefreshToken, setCardsRefreshToken] = useState(0);
const [isSalvationOpen, setIsSalvationOpen] = useState(false);
const [salvationModalStep, setSalvationModalStep] = useState("initial");
const [salvationModalInitialData, setSalvationModalInitialData] = useState(null);
const [salvationCount, setSalvationCount] = useState(0);
const [salvationEvent, setSalvationEvent] = useState(false);


  function openPrayerModal(seed = null) {
    setPrayerSeed(seed);
    setIsPrayerOpen(true);
  }

  function closePrayerModal() {
    setIsPrayerOpen(false);
    setPrayerSeed(null);
  }

  function openLoginModal() {
    setIsLoginOpen(true);
  }

  function closeLoginModal() {
    setIsLoginOpen(false);
  }

  function openRegisterModal() {
    setIsRegisterOpen(true);
  }

  function closeRegisterModal() {
    setIsRegisterOpen(false);
  }

 function handleOpenSalvationModal() {
  setSalvationModalStep("initial");
  setSalvationModalInitialData(null);
  setIsSalvationOpen(true);
 }

 function handleEditSalvationJourney() {
  setSalvationModalStep("already");
  setSalvationModalInitialData(currentUser);
  setIsSalvationOpen(true);
 }

 function handleCloseSalvationModal() {
  setIsSalvationOpen(false);
  setSalvationModalStep("initial");
  setSalvationModalInitialData(null);
 }

async function handleSalvationSuccess(data) {
  if (data?.user) {
    setCurrentUser(data.user);

    if (data.user.salvationStatus === "saved_today") {
      setSalvationEvent(true);

      try {
        const res = await getSalvationCount();
        setSalvationCount(res.count || 0);
      } catch (err) {
        console.error("Failed to refresh salvation count", err);
        setSalvationCount((prev) => prev + 1);
      }
    }
  }
}


  function handleLogout() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  }

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setIsPrayerOpen(false);
        setPrayerSeed(null);
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setIsSalvationOpen(false);
        setSalvationModalStep("initial");
        setSalvationModalInitialData(null);
      }
    }

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    getMe()
    .then((data) => {
      setCurrentUser(data?.user || data || null);
      setIsLoggedIn(true);
    })
    .catch(() => {
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      setCurrentUser(null);
    });
  }, []);

  return (
    <>
    <Header
    isLoggedIn={isLoggedIn}
    currentUser={currentUser}
    onOpenLogin={openLoginModal}
    onOpenRegister={openRegisterModal}
    onOpenAddPrayer={() => {
      if (!isLoggedIn) return openLoginModal();
     openPrayerModal(null);
    }}
    onOpenSalvation={handleOpenSalvationModal}
    onLogout={handleLogout}
    />


<Routes>
  <Route path="/"
   element={
   <Home
   isLoggedIn={isLoggedIn}
  salvationCount={salvationCount}
  setSalvationCount={setSalvationCount}
  salvationEvent={salvationEvent}
  setSalvationEvent={setSalvationEvent}
  onOpenRegister={openRegisterModal}
  />
  }
 />

 <Route
 path="/admin"
 element={
currentUser?.role === "admin"
? <AdminDashboard />
: <Navigate to="/" replace />
 }
/>


  <Route
    path="/cards"
    element={
    <Cards
     currentUser={currentUser}
     refreshToken={cardsRefreshToken}
      />
    }
  />

  <Route
    path="/profile"
    element={
      <Profile
        currentUser={currentUser}
        onUserUpdate={(user) => setCurrentUser(user)}
        onEditSalvationJourney={handleEditSalvationJourney}
      />
    }
  />
</Routes>


      <AddPrayerModal 
      isOpen={isPrayerOpen}
       onClose={closePrayerModal}
        seed={prayerSeed}
        onSubmit={async (prayerData) => {
          const { createPrayer } = await import("./utils/api");
          await createPrayer(prayerData);
          setCardsRefreshToken((prev) => prev + 1);
        }}
         />

         <LoginModal
         isOpen={isLoginOpen}
         onClose={closeLoginModal}
         onLoggedIn={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          closeLoginModal();
         }}
         onOpenRegister={() => {
          closeLoginModal();
          openRegisterModal();
         }}
         />


         <RegisterModal
         isOpen={isRegisterOpen}
         onClose={closeRegisterModal}
         onRegistered={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          closeRegisterModal();
          }}
          onOpenLogin={() => {
            closeRegisterModal();
            openLoginModal();
            }}
            />

            <SalvationModal
            isOpen={isSalvationOpen}
            onClose={handleCloseSalvationModal}
            onSuccess={handleSalvationSuccess}
            initialStep={salvationModalStep}
            initialData={salvationModalInitialData}
            />
</>
  );
}