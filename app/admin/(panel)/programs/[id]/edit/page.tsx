import { notFound } from "next/navigation";
import { getAllPrograms } from "@/lib/admin-data";
import { ProgramForm } from "@/components/admin/ProgramForm";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const programs = await getAllPrograms();
  const program = programs.find((p) => p.id === id);
  if (!program) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-navy">Edit Program</h1>
      <ProgramForm initial={program} />
    </div>
  );
}
