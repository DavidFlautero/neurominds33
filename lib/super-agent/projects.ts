type Project = { id: string };

export async function getProjects(): Promise<Project[]> {
  // Stub temporal: en Fase DB lo conectamos a Prisma/Supabase.
  // Para pruebas locales podés devolver un proyecto por defecto:
  return [];
}
