import Sidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}