/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ReloadWarningContext = createContext<any>(null);

export const ReloadWarningProvider = ({ children }: { children: React.ReactNode }) => {
  const [showModal, setShowModal] = useState(false);
  const [pendingReload, setPendingReload] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!pendingReload) {
        e.preventDefault();
        e.returnValue = "";
        setShowModal(true);   // show cute popup instead of immediate reload
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pendingReload]);

  const confirmReload = () => {
    setPendingReload(true);
    setShowModal(false);
    window.location.reload(); // now it will happen without native popup
  };

  const cancelReload = () => setShowModal(false);

  return (
    <ReloadWarningContext.Provider value={{ showModal, confirmReload, cancelReload }}>
      {children}
    </ReloadWarningContext.Provider>
  );
};

export const useReloadWarning = () => useContext(ReloadWarningContext);
