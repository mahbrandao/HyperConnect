import { useState } from "react";
import { TrendingUp, FolderOpen, FileCheck, Clock, ChevronRight, ArrowRight, PencilLine } from "lucide-react";
import Link from "next/link";
import { projects as initialProjects, STAGES, stageColor, stageDot, fmt, progressForProject } from "@/data/mockData";
import type { Project, Stage } from "@/interfaces/project";
import ProjectEditorModal from "@/components/ui/ProjectEditorModal";

const myName = "Paulo Henrique";

export default function DashboardVendas() {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const myProjects = projectList.filter((p) => p.vendedor === myName);
  const totalMyValue = myProjects.reduce((s, p) => s + p.value, 0);
  const quoteCount = myProjects.filter((p) => p.stage === "Orçamento").length;
  const approvedCount = myProjects.filter((p) => p.stage === "Aprovado" || p.stage === "Em Instalação").length;

  const stageCounts = STAGES.reduce<Record<Stage, number>>((acc, s) => {
    acc[s] = myProjects.filter((p) => p.stage === s).length;
    return acc;
  }, {} as Record<Stage, number>);

  const priorityBadge: Record<string, string> = {
    Alta: "bg-red-500/15 text-red-400",
    Média: "bg-[#f5c518]/15 text-[#f5c518]",
    Baixa: "bg-green-500/15 text-green-400",
  };

  function handleSave(updatedProject: Project) {
    setProjectList((prev) => prev.map((project) => (project.id === updatedProject.id ? updatedProject : project)));
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Olá, João!</h1>
        <p className="text-[#888] text-sm">Seus projetos e pipeline de vendas.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Meus projetos", value: String(myProjects.length), icon: FolderOpen, color: "text-[#f5c518]" },
          { label: "Orçamentos abertos", value: String(quoteCount), icon: Clock, color: "text-orange-400" },
          { label: "Aprovados / Instalando", value: String(approvedCount), icon: FileCheck, color: "text-blue-400" },
          { label: "Receita potencial", value: fmt(totalMyValue), icon: TrendingUp, color: "text-green-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#151515] border border-[#222] rounded-xl p-4">
            <Icon size={18} className={`${color} mb-3`} />
            <div className="text-xl font-bold text-white mb-0.5 truncate">{value}</div>
            <div className="text-xs text-[#888]">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#151515] border border-[#222] rounded-xl p-5">
        <h2 className="font-semibold text-white text-sm mb-4">Meu pipeline</h2>
        <div className="flex items-stretch gap-0">
          {STAGES.map((stage, i) => {
            const count = stageCounts[stage];
            return (
              <div key={stage} className="flex items-center flex-1 min-w-0">
                <div className={`flex-1 min-w-0 rounded-xl p-3 text-center ${count > 0 ? "bg-[#1a1a1a]" : "bg-[#111]"}`}>
                  <div className={`inline-flex w-6 h-6 rounded-full ${count > 0 ? stageDot[stage] : "bg-[#222]"} items-center justify-center text-xs font-bold ${count > 0 ? "text-black" : "text-[#444]"} mb-1.5`}>
                    {count}
                  </div>
                  <div className={`text-xs font-medium truncate ${count > 0 ? "text-white" : "text-[#444]"}`}>{stage}</div>
                </div>
                {i < STAGES.length - 1 && <ArrowRight size={13} className="text-[#2a2a2a] flex-shrink-0 mx-1" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <h2 className="font-semibold text-white text-sm">Meus projetos</h2>
          <Link href="/app/projects" className="text-xs text-[#f5c518] hover:underline flex items-center gap-1">
            Ver todos <ChevronRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-[#1e1e1e]">
          {myProjects.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#1a1a1a] transition-colors">
              <img src={p.img} alt={p.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="text-sm font-semibold text-white">{p.title}</div>
                    <div className="text-xs text-[#555]">{p.client}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityBadge[p.priority]}`}>{p.priority}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${stageColor[p.stage]}`}>{p.stage}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#222] rounded-full h-1">
                    <div className="bg-[#f5c518] h-1 rounded-full" style={{ width: `${progressForProject(p)}%` }} />
                  </div>
                  <span className="text-xs text-[#f5c518] font-medium w-7">{progressForProject(p)}%</span>
                  <span className="text-xs text-white font-medium">{fmt(p.value)}</span>
                </div>
                {p.notes && <p className="text-xs text-[#555] mt-1 truncate">{p.notes}</p>}
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(p)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#2a2a2a] bg-[#111] px-2.5 py-1.5 text-[11px] text-[#f5c518] hover:bg-[#1a1a1a]"
              >
                <PencilLine size={12} />
                Editar
              </button>
            </div>
          ))}
        </div>
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
