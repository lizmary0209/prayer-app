import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Header from "./components/Navigation/Header";
import Cards from "./pages/Cards/Cards";
import AddPrayerModal from "./components/AddPrayerModal/AddPrayerModal";
import FloatingPrayButton from "./components/FloatingPrayButton/FloatingPrayButton";
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
    setIsSalvationOpen(true);
  }

  function handleCloseSalvationModal() {
    setIsSalvationOpen(false);
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

  setIsSalvationOpen(false);
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
  <Route path="/" element={<Home
  salvationCount={salvationCount}
  setSalvationCount={setSalvationCount}
  salvationEvent={salvationEvent}
  setSalvationEvent={setSalvationEvent}
  />} />

  <Route
    path="/cards"
    element={<Cards currentUser={currentUser} />}
  />

  <Route
    path="/profile"
    element={
      <Profile
        currentUser={currentUser}
        onUserUpdate={(user) => setCurrentUser(user)}
      />
    }
  />
</Routes>


    <FloatingPrayButton onClick={() => {
      if (!isLoggedIn) return openLoginModal();
      openPrayerModal(null);
      }}
       />

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
            />
</>
  );
}