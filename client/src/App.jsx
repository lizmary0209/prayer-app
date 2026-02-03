import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Header from "./components/Navigation/Header";
import Cards from "./pages/Cards/Cards";
import AddPrayerModal from "./components/AddPrayerModal/AddPrayerModal";
import FloatingPrayButton from "./components/FloatingPrayButton/FloatingPrayButton";
import LoginModal from "./components/LoginModal/LoginModal";

export default function App() {
  const [isPrayerOpen, setIsPrayerOpen] = useState(false);
  const [prayerSeed, setPrayerSeed] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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

  return (
    <>
    <Header
    onOpenLogin={openLoginModal}
    onOpenAddPrayer={() => openPrayerModal(null)}
    />


    <Routes>
      <Route path="/" element={<Navigate to="/cards" replace />} />
        <Route
        path="/cards"
        element={
          <Cards
        onPrayForCard={(card) =>
          openPrayerModal({
            cardId: card._id,
            reference: card.reference || card.scripture,
            title: card.title,
          })
        }
        />
      }
      />
   </Routes>

    <FloatingPrayButton onClick={() => openPrayerModal(null)} />

      <AddPrayerModal 
      isOpen={isPrayerOpen}
       onClose={closePrayerModal}
        seed={prayerSeed}
         />

         <LoginModal
         isOpen={isLoginOpen}
         onClose={closeLoginModal}
         />
</>
  );
}