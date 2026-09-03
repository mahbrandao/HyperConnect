import { Wrench, CheckCircle2, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { projects, stageColor, progressForProject } from "@/data/mockData";
import { FileText } from "lucide-react";

const myName = "Diego Costa";
const myProjects = projects.filter(p => p.instalador === myName);
const installing = myProjects.filter(p => p.stage === "Em Instalação");
const maintenance = myProjects.filter(p => p.stage === "Manutenção");
const done = myProjects.filter(p => p.stage === "Concluído");
const pending = myProjects.filter(p => p.stage === "Aprovado");

const typeIcon: Record<string, JSX.Element> = {
  "Instalação fotovoltaica": <FileText size={14} />,
  "Limpeza": <FileText size={14} />,
  "Configuração de inversor": <FileText size={14} />,
  "Carregador de carro elétrico": <FileText size={14} />,
  "Automação de painel de comando": <FileText size={14} />,
  "Manutenção": <FileText size={14} />,
};

const priorityBadge: Record<string, string> = {
  Alta:  "bg-red-500/15 text-red-400",
  Média: "bg-[#f5c518]/15 text-[#f5c518]",
  Baixa: "bg-green-500/15 text-green-400",
};

function ProjectCard({ p }: { p: typeof projects[number] }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-[#1a1a1a] transition-colors border-b border-[#1e1e1e] last:border-0">
      <div className="w-10 h-10 bg-[#222] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
        {typeIcon[p.type] || <FileText size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="text-sm font-semibold text-white">{p.title}</div>
            <div className="text-xs text-[#555]">{p.client} · {p.type}</div>
          </div>
          <div className="flex gap-2 flex-shrink-0 ml-3">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityBadge[p.priority]}`}>{p.priority}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${stageColor[p.stage]}`}>{p.stage}</span>
          </div>
        </div>
          <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#222] rounded-full h-1">
            <div className="bg-[#f5c518] h-1 rounded-full" style={{ width: `${progressForProject(p)}%` }} />
          </div>
          <span className="text-xs text-[#f5c518] font-medium w-7">{progressForProject(p)}%</span>
          <span className="text-xs text-[#555]">até {p.end}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardInstalacao() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Olá, Diego!</h1>
        <p className="text-[#888] text-sm">Suas tarefas de instalação, manutenção e limpeza.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Em instalação",     value: String(installing.length), icon: Wrench,       color: "text-[#f5c518]", sub: "projetos em campo" },
          { label: "Manutenções",        value: String(maintenance.length), icon: AlertTriangle, color: "text-orange-400", sub: "agendadas" },
          { label: "Aguardando início",  value: String(pending.length),    icon: Clock,         color: "text-blue-400",  sub: "aprovados, fila" },
          { label: "Concluídos",         value: String(done.length),       icon: CheckCircle2,  color: "text-green-400", sub: "este período" },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-[#151515] border border-[#222] rounded-xl p-4">
            <Icon size={18} className={`${color} mb-3`} />
            <div className="text-xl font-bold text-white mb-0.5">{value}</div>
            <div className="text-xs text-white font-medium">{label}</div>
            <div className="text-xs text-[#555] mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Em instalação */}
      {installing.length > 0 && (
        <div className="bg-[#151515] border border-[#f5c518]/20 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f5c518]/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#f5c518]" />
              <h2 className="font-semibold text-white text-sm">Em instalação agora</h2>
            </div>
            <Link href="/app/projects" className="text-xs text-[#f5c518] hover:underline flex items-center gap-1">
              Detalhes <ChevronRight size={12} />
            </Link>
          </div>
          {installing.map(p => <ProjectCard key={p.id} p={p} />)}
        </div>
      )}

      {/* Manutenções */}
      {maintenance.length > 0 && (
        <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#222]">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <h2 className="font-semibold text-white text-sm">Manutenções agendadas</h2>
          </div>
          {maintenance.map(p => <ProjectCard key={p.id} p={p} />)}
        </div>
      )}

      {/* Aguardando início */}
      {pending.length > 0 && (
        <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#222]">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <h2 className="font-semibold text-white text-sm">Aprovados — aguardando início</h2>
          </div>
          {pending.map(p => <ProjectCard key={p.id} p={p} />)}
        </div>
      )}

      {/* Concluídos */}
      {done.length > 0 && (
        <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#222]">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <h2 className="font-semibold text-white text-sm">Concluídos</h2>
          </div>
          {done.map(p => <ProjectCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
