import { redirect } from "next/navigation";
import { getProjects } from "@/lib/super-agent/projects";

export default async function SuperAgentHome() {
  const projects = await getProjects();

  if (!projects || projects.length === 0) {
    redirect("/super-agent/onboarding");
  }

  redirect(`/super-agent/overview?projectId=${projects[0].id}`);
}
