import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-alt flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pt-16 lg:pt-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}
