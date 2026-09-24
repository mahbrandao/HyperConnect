import { useState } from "react";
import { TrendingUp, FolderOpen, Users, CheckCircle2, ChevronRight, ArrowRight, PencilLine } from "lucide-react";
import Link from "next/link";
import { projects as initialProjects, STAGES, stageColor, stageDot, fmt, progressForProject } from "@/data/mockData";
import type { Project, Stage } from "@/interfaces/project";
import ProjectEditorModal from "@/components/ui/ProjectEditorModal";

export default function DashboardGerente() {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const stageCounts = STAGES.reduce<Record<Stage, number>>((acc, s) => {
    acc[s] = projectList.filter((p) => p.stage === s).length;
    return acc;
  }, {} as Record<Stage, number>);

  const totalValue = projectList.reduce((s, p) => s + p.value, 0);
  const activeCount = projectList.filter((p) => p.stage !== "Concluído").length;
  const doneCount = projectList.filter((p) => p.stage === "Concluído").length;
  const quoteCount = projectList.filter((p) => p.stage === "Orçamento").length;

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
        <h1 className="text-xl font-bold text-white">Painel Geral — Hyper Connect</h1>
        <p className="text-[#888] text-sm">Visão completa de todos os projetos e equipes.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Projetos ativos", value: String(activeCount), icon: FolderOpen, color: "text-[#f5c518]", sub: "em andamento" },
          { label: "Receita total", value: fmt(totalValue), icon: TrendingUp, color: "text-green-400", sub: "carteira atual" },
          { label: "Orçamentos abertos", value: String(quoteCount), icon: Users, color: "text-blue-400", sub: "aguardando aprovação" },
          { label: "Concluídos", value: String(doneCount), icon: CheckCircle2, color: "text-purple-400", sub: "este período" },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-[#151515] border border-[#222] rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <Icon size={18} className={color} />
            </div>
            <div className="text-xl font-bold text-white mb-0.5 truncate">{value}</div>
            <div className="text-xs text-white font-medium">{label}</div>
            <div className="text-xs text-[#555] mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#151515] border border-[#222] rounded-xl p-5">
        <h2 className="font-semibold text-white text-sm mb-4">Pipeline de Projetos</h2>
        <div className="flex items-stretch gap-0">
          {STAGES.map((stage, i) => {
            const count = stageCounts[stage];
            const pct = projectList.length ? Math.round((count / projectList.length) * 100) : 0;
            return (
              <div key={stage} className="flex items-center flex-1 min-w-0">
                <div className="flex-1 min-w-0 bg-[#1a1a1a] rounded-xl p-4 text-center">
                  <div className={`inline-flex w-6 h-6 rounded-full ${stageDot[stage]} items-center justify-center text-black text-xs font-bold mb-2`}>
                    {count}
                  </div>
                  <div className="text-xs font-medium text-white truncate">{stage}</div>
                  <div className="text-[10px] text-[#555] mt-0.5">{pct}%</div>
                </div>
                {i < STAGES.length - 1 && <ArrowRight size={14} className="text-[#333] flex-shrink-0 mx-1" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <h2 className="font-semibold text-white text-sm">Todos os projetos</h2>
          <Link href="/app/projects" className="text-xs text-[#f5c518] hover:underline flex items-center gap-1">
            Ver todos <ChevronRight size={12} />
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["Projeto / Cliente", "Tipo", "Vendedor", "Instalador", "Etapa", "Valor", "Prioridade", "Ação"].map((col) => (
                <th key={col} className="text-left py-3 px-4 text-xs font-medium text-[#555] uppercase tracking-wider">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {projectList.map((p) => (
              <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-white">{p.title}</div>
                  <div className="text-xs text-[#555]">{p.client}</div>
                </td>
                <td className="py-3 px-4 text-xs text-[#888]">{p.type}</td>
                <td className="py-3 px-4 text-xs text-[#888]">{p.vendedor || "—"}</td>
                <td className="py-3 px-4 text-xs text-[#888]">{p.instalador || "—"}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stageColor[p.stage]}`}>{p.stage}</span>
                </td>
                <td className="py-3 px-4 text-xs text-white font-medium">{fmt(p.value)}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge[p.priority]}`}>{p.priority}</span>
                </td>
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => setEditingProject(p)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#2a2a2a] bg-[#111] px-2.5 py-1.5 text-[11px] text-[#f5c518] hover:bg-[#1a1a1a]"
                  >
                    <PencilLine size={12} />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Equipe Vendas", name: "Paulo Henrique", field: "vendedor" as const, color: "text-blue-400", dot: "bg-blue-400" },
          { label: "Equipe Instalação", name: "Diego Costa", field: "instalador" as const, color: "text-[#f5c518]", dot: "bg-[#f5c518]" },
        ].map(({ label, name, field, color, dot }) => {
          const mine = projectList.filter((p) => p[field] === name);
          return (
            <div key={label} className="bg-[#151515] border border-[#222] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${dot}`} />
                <h2 className="font-semibold text-white text-sm">{label}</h2>
                <span className={`ml-auto text-xs font-semibold ${color}`}>{mine.length} projetos</span>
              </div>
              <div className="space-y-2.5">
                {mine.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white truncate">{p.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0 ${stageColor[p.stage]}`}>{p.stage}</span>
                      </div>
                      <div className="bg-[#222] rounded-full h-1">
                        <div className="bg-[#f5c518] h-1 rounded-full" style={{ width: `${progressForProject(p)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
