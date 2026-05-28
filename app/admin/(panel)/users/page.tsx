import { redirect } from "next/navigation";
import { getCurrentProfile, getProfiles } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { UserManager } from "@/components/admin/UserManager";

export default async function AdminUsersPage() {
  let currentUserId: string | null = null;

  if (isSupabaseConfigured) {
    const profile = await getCurrentProfile();
    // Only super admins manage users; editors are sent back to the dashboard.
    if (!profile || profile.role !== "super_admin") {
      redirect("/admin");
    }
    currentUserId = profile.id;
  }

  const profiles = await getProfiles();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Pengguna</h1>
      <p className="mb-6 text-sm text-muted">
        Kelola akun guru dan staf Pusaka. Hanya super admin yang dapat membuat
        atau menonaktifkan akun.
      </p>
      <UserManager
        profiles={profiles}
        currentUserId={currentUserId}
        configured={isSupabaseConfigured}
      />
    </div>
  );
}
