"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, FileText, PencilLine, TrendingUp, Users, Wallet } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { projects as initialProjects, fmt, progressForProject, stageColor } from "@/data/mockData";
import ProjectEditorModal from "@/components/ui/ProjectEditorModal";
import type { Project } from "@/interfaces/project";

export default function ProjectDetails() {
  const params = useParams<{ id?: string }>();
  const projectId = Number(params?.id ?? 0);
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const project = projectList.find((item) => item.id === projectId);

  function handleSave(updatedProject: Project) {
    setProjectList((prev) => prev.map((item) => (item.id === updatedProject.id ? updatedProject : item)));
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-[#222] bg-[#151515] p-8 text-center">
          <h1 className="text-xl font-bold text-white">Projeto não encontrado</h1>
          <p className="mt-2 text-sm text-[#888]">Não foi possível localizar o projeto solicitado.</p>
          <Link
            href="/app/projects"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#f5c518] px-4 py-2 text-sm font-bold text-black hover:bg-[#e6b800]"
          >
            <ArrowLeft size={15} />
            Voltar para projetos
          </Link>
        </div>
      </div>
    );
  }

  const progress = progressForProject(project);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#f5c518]">Projeto</p>
          <h1 className="mt-2 text-2xl font-bold text-white">{project.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditingProject(project)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#f5c518]/40 bg-[#f5c518]/10 px-3 py-2 text-sm font-medium text-[#f5c518] hover:bg-[#f5c518]/15"
          >
            <PencilLine size={15} />
            Editar projeto
          </button>
          <Link
            href="/app/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-[#222] bg-[#111] px-3 py-2 text-sm text-[#ddd] hover:bg-[#1a1a1a]"
          >
            <ArrowLeft size={15} />
            Voltar
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-[#222] bg-[#151515] p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[#888]">Cliente</p>
              <p className="text-lg font-semibold text-white">{project.client}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${stageColor[project.stage]}`}>
              {project.stage}
            </span>
          </div>

          <img src={project.img} alt={project.title} className="h-56 w-full rounded-xl object-cover" />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-4">
              <div className="flex items-center gap-2 text-[#888]">
                <FileText size={14} />
                <span className="text-xs uppercase tracking-wider">Tipo</span>
              </div>
              <p className="mt-2 text-sm font-medium text-white">{project.type}</p>
            </div>

            <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-4">
              <div className="flex items-center gap-2 text-[#888]">
                <Users size={14} />
                <span className="text-xs uppercase tracking-wider">Responsáveis</span>
              </div>
              <p className="mt-2 text-sm text-white">{project.vendedor || "—"}</p>
              <p className="text-xs text-[#888]">{project.instalador || "—"}</p>
            </div>

            <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-4">
              <div className="flex items-center gap-2 text-[#888]">
                <CalendarDays size={14} />
                <span className="text-xs uppercase tracking-wider">Período</span>
              </div>
              <p className="mt-2 text-sm text-white">{project.start} até {project.end}</p>
            </div>

            <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-4">
              <div className="flex items-center gap-2 text-[#888]">
                <Wallet size={14} />
                <span className="text-xs uppercase tracking-wider">Valor</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{fmt(project.value)}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#888]">
                <TrendingUp size={14} />
                <span className="text-xs uppercase tracking-wider">Progresso</span>
              </div>
              <span className="text-sm font-semibold text-[#f5c518]">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#222]">
              <div className="h-2 rounded-full bg-[#f5c518]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#222] bg-[#151515] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f5c518]">Resumo</h2>
            <div className="mt-4 space-y-3 text-sm text-[#ddd]">
              <div className="flex justify-between gap-3 border-b border-[#1e1e1e] pb-2">
                <span className="text-[#888]">Sistema</span>
                <span>{fmt(project.valorSistema ?? project.value)}</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#1e1e1e] pb-2">
                <span className="text-[#888]">Mão de obra</span>
                <span>{fmt(project.valorMO ?? 0)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#888]">A receber</span>
                <span>{fmt(project.valorAReceber ?? project.value)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#222] bg-[#151515] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f5c518]">Observações</h2>
            <p className="mt-3 text-sm leading-6 text-[#bbb]">
              {project.notes || "Nenhuma observação adicional cadastrada para este projeto."}
            </p>
          </div>
        </aside>
      </div>

      <ProjectEditorModal
        project={editingProject}
        open={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        onSave={handleSave}
      />
    </div>
  );
}
