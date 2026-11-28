import React, { useEffect } from "react";

export default function AdminDashboard() {
  useEffect(() => {
    window.location.replace("/admin/login");
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-white">
      <p className="text-sm font-medium">Opening the secure Get Into Feed admin panel…</p>
    </main>
  );
}
