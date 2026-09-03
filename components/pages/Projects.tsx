"use client";

import { useState } from "react";
import { Search, Plus, ChevronRight, X, Calendar, Star } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { projects as allProjectsData, STAGES, stageColor, fmt, progressForProject, progressForStage } from "@/data/mockData";
import type { Project, Stage } from "@/interfaces/project";

const serviceTypes = [
  "Instalação fotovoltaica",
  "Limpeza",
  "Configuração de inversor",
  "Carregador de carro elétrico",
  "Automação de painel de comando",
];

const tabs = ["Todos", "Orçamento", "Aprovado", "Em Instalação", "Manutenção", "Concluído"];

const priorityBadge: Record<string, string> = {
  Alta:  "bg-red-500/15 text-red-400",
  Média: "bg-[#f5c518]/15 text-[#f5c518]",
  Baixa: "bg-green-500/15 text-green-400",
};

const imgByType: Record<string, string> = {
  "Instalação fotovoltaica":         "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=120&h=80&fit=crop&auto=format",
  "Limpeza":                         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=80&fit=crop&auto=format",
  "Configuração de inversor":        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&h=80&fit=crop&auto=format",
  "Carregador de carro elétrico":    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=120&h=80&fit=crop&auto=format",
  "Automação de painel de comando":  "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=120&h=80&fit=crop&auto=format",
};

const emptyForm = {
  title: "", client: "", type: serviceTypes[0],
  stage: "Orçamento" as Stage, start: "", end: "",
  progress: 0, priority: "Média" as Project["priority"],
  value: "",
};

function ProjectCard({ p }: { p: Project; mine?: boolean }) {
  const prog = progressForProject(p);
  return (
    <div className="bg-[#151515] border border-[#222] rounded-xl p-5 flex items-center gap-5 hover:border-[#333] transition-colors">
      <img src={p.img} alt={p.title} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-white">{p.title}</h3>
            <p className="text-xs text-[#888]">{p.client} · {p.type}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge[p.priority]}`}>{p.priority}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stageColor[p.stage]}`}>{p.stage}</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 text-xs text-[#888] mb-3">
          <div><span className="text-[#555]">Tipo</span><br /><span className="text-[#ccc]">{p.type}</span></div>
          <div><span className="text-[#555]">Início</span><br /><span className="text-[#ccc]">{p.start}</span></div>
          <div><span className="text-[#555]">Conclusão</span><br /><span className="text-[#ccc]">{p.end}</span></div>
          <div><span className="text-[#555]">Valor</span><br /><span className="text-[#ccc]">{fmt(p.value)}</span></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#222] rounded-full h-1.5">
            <div className="bg-[#f5c518] h-1.5 rounded-full transition-all" style={{ width: `${prog}%` }} />
          </div>
          <span className="text-xs font-medium text-[#f5c518] w-8">{prog}%</span>
          <button className="text-xs text-[#f5c518] hover:underline flex items-center gap-1 ml-2">
            Ver detalhes <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { user } = useUser();
  const [tab, setTab] = useState("Todos");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>(allProjectsData);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const myProjects = projects.filter(p =>
    user.team === "vendas"     ? p.vendedor === user.name :
    user.team === "instalacao" ? p.instalador === user.name :
    user.team === "gerente"    ? true : true
  );

  const filtered = projects.filter(p => {
    const matchTab = tab === "Todos" || p.stage === tab;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Informe o título.";
    if (!form.client.trim()) e.client = "Informe o cliente.";
    if (!form.start) e.start = "Informe a data de início.";
    if (!form.end) e.end = "Informe a previsão de conclusão.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const toDate = (iso: string) => { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
    setProjects(prev => [...prev, {
      id: Date.now(),
      title: form.title.trim(),
      client: form.client.trim(),
      type: form.type,
      stage: form.stage,
      progress: progressForStage(form.stage),
      vendedor: user.team === "vendas" ? user.name : "",
      instalador: user.team === "instalacao" ? user.name : "",
      start: toDate(form.start),
      end: toDate(form.end),
      img: imgByType[form.type] || imgByType["Instalação fotovoltaica"],
      priority: form.priority,
      value: parseFloat(form.value) || 0,
    }]);
    setOpen(false);
    setForm(emptyForm);
    setErrors({});
  }

  const inputCls = "w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#444] outline-none focus:border-[#f5c518]/50 transition-colors";
  const showMine = user.team === "vendas" || user.team === "instalacao";

  return (
    <div className="p-6 space-y-6">
      {/* Minha Responsabilidade */}
      {showMine && myProjects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star size={15} className="text-[#f5c518]" />
            <h2 className="font-semibold text-white text-sm">Minha responsabilidade</h2>
            <span className="text-xs text-[#555] ml-1">({myProjects.length} {myProjects.length === 1 ? "projeto" : "projetos"})</span>
          </div>
          <div className="space-y-3">
            {myProjects.map(p => <ProjectCard key={`mine-${p.id}`} p={p} mine />)}
          </div>
          <div className="border-t border-[#1e1e1e] my-6" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            {showMine ? "Todos os projetos" : "Meus projetos"}
          </h1>
          <p className="text-[#888] text-sm">Acompanhe todos os projetos com a HyperZ.</p>
        </div>
        <button
          onClick={() => { setOpen(true); setErrors({}); }}
          className="bg-[#f5c518] text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#e6b800] transition-colors"
        >
          <Plus size={16} />
          Novo projeto
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-[#1a1a1a] rounded-lg p-1 flex-wrap">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t ? "bg-[#f5c518] text-black" : "text-[#888] hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar projeto"
            className="bg-[#1a1a1a] border border-[#222] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#555] outline-none focus:border-[#333] w-48"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#555] text-sm">Nenhum projeto encontrado.</div>
        )}
        {filtered.map(p => <ProjectCard key={p.id} p={p} />)}
      </div>

      {/* Modal Novo Projeto */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#111] border border-[#222] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e] sticky top-0 bg-[#111] z-10">
              <div>
                <h2 className="text-base font-bold text-white">Novo projeto</h2>
                <p className="text-xs text-[#555] mt-0.5">Preencha os dados para criar o projeto.</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-[#1e1e1e] text-[#555] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">Título do projeto</label>
                <input className={inputCls} placeholder="Ex: Instalação Fotovoltaica Industrial" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">Cliente</label>
                <input className={inputCls} placeholder="Nome da empresa ou pessoa" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
                {errors.client && <p className="text-red-400 text-xs mt-1">{errors.client}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Tipo de serviço</label>
                  <select className={inputCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {serviceTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Etapa inicial</label>
                  <select className={inputCls} value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as Stage })}>
                    {STAGES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Prioridade</label>
                  <select className={inputCls} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Project["priority"] })}>
                    {["Alta", "Média", "Baixa"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Valor (R$)</label>
                  <input type="number" className={inputCls} placeholder="0,00" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Data de início</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none" />
                    <input type="date" className={`${inputCls} pl-9`} value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
                  </div>
                  {errors.start && <p className="text-red-400 text-xs mt-1">{errors.start}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Previsão de conclusão</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none" />
                    <input type="date" className={`${inputCls} pl-9`} value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
                  </div>
                  {errors.end && <p className="text-red-400 text-xs mt-1">{errors.end}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">
                  Progresso inicial (calculado pela etapa) — <span className="text-[#f5c518]">{progressForStage(form.stage)}%</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-lg border border-[#222] text-sm text-[#888] hover:text-white hover:border-[#333] transition-colors font-medium">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#f5c518] text-black text-sm font-bold hover:bg-[#e6b800] transition-colors">
                  Criar projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
