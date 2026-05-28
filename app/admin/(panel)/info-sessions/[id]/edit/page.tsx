import { notFound } from "next/navigation";
import { getAllInfoSessions } from "@/lib/admin-data";
import { SessionForm } from "@/components/admin/SessionForm";

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessions = await getAllInfoSessions();
  const session = sessions.find((s) => s.id === id);
  if (!session) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-navy">Edit Kegiatan</h1>
      <SessionForm initial={session} />
    </div>
  );
}
