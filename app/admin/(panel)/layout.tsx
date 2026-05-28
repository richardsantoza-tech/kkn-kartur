import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getCurrentProfile } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Profile } from "@/lib/types";

const DEMO_PROFILE: Profile = {
  id: "demo",
  full_name: "Demo Admin",
  email: "demo@pusaka.local",
  role: "super_admin",
  is_active: true,
  created_at: "",
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile: Profile | null;

  if (!isSupabaseConfigured) {
    // Demo mode: show the admin with sample data so it's fully browsable.
    profile = DEMO_PROFILE;
  } else {
    profile = await getCurrentProfile();
    if (!profile || !profile.is_active) redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <AdminSidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col">
        {!isSupabaseConfigured && (
          <div className="bg-amber px-6 py-2 text-center text-xs font-semibold text-navy">
            Mode demo — data contoh ditampilkan. Hubungkan Supabase (lihat
            SETUP.md) agar perubahan tersimpan.
          </div>
        )}
        <div className="min-w-0 flex-1 p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
