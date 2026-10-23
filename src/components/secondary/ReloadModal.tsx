"use client";
import { useReloadWarning } from "@/src/components/provider/ReloadWarningProvider";

export function ReloadModal() {
  const { showModal, confirmReload, cancelReload } = useReloadWarning();
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-72 text-center space-y-4">
        <p className="text-lg">
          Reloading will make you lose progress. Continue?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={confirmReload}
            className="px-4 py-2 bg-white text-black rounded-md"
          >
            Yes
          </button>
          <button
            onClick={cancelReload}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
