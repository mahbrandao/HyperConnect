import type { Project, Priority, Stage } from "@/interfaces/project";

export const STAGES: Stage[] = ["Orçamento", "Aprovado", "Em Instalação", "Manutenção", "Concluído"];

export const stageColor: Record<Stage, string> = {
  "Orçamento":    "bg-gray-500/15 text-gray-400",
  "Aprovado":     "bg-blue-500/15 text-blue-400",
  "Em Instalação":"bg-[#f5c518]/15 text-[#f5c518]",
  "Manutenção":   "bg-orange-500/15 text-orange-400",
  "Concluído":    "bg-green-500/15 text-green-400",
};

export const stageDot: Record<Stage, string> = {
  "Orçamento":    "bg-gray-400",
  "Aprovado":     "bg-blue-400",
  "Em Instalação":"bg-[#f5c518]",
  "Manutenção":   "bg-orange-400",
  "Concluído":    "bg-green-400",
};

export const priorityColor: Record<Priority, string> = {
  Alta:  "text-red-400",
  Média: "text-[#f5c518]",
  Baixa: "text-green-400",
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Sistema Fotovoltaico Residencial",
    client: "Família Oliveira",
    type: "Instalação fotovoltaica",
    stage: "Orçamento",
    progress: 15,
    vendedor: "Paulo Henrique",
    instalador: "",
    start: "18/08/2024",
    end: "30/09/2024",
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=120&h=80&fit=crop&auto=format",
    priority: "Alta",
    value: 42000,
    notes: "Cliente aguardando proposta detalhada.",
  },
  {
    id: 2,
    title: "Carregador de Carro Elétrico",
    client: "Empresa XYZ",
    type: "Carregador de carro elétrico",
    stage: "Aprovado",
    progress: 35,
    vendedor: "Paulo Henrique",
    instalador: "Diego Costa",
    start: "15/08/2024",
    end: "10/09/2024",
    img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=120&h=80&fit=crop&auto=format",
    priority: "Média",
    value: 18500,
    notes: "Aguardando entrega dos equipamentos.",
  },
  {
    id: 3,
    title: "Instalação Fotovoltaica Industrial",
    client: "Empresa ABC",
    type: "Instalação fotovoltaica",
    stage: "Em Instalação",
    progress: 80,
    vendedor: "Paulo Henrique",
    instalador: "Diego Costa",
    start: "10/08/2024",
    end: "22/08/2024",
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=120&h=80&fit=crop&auto=format",
    priority: "Alta",
    value: 95000,
    notes: "Painéis instalados, falta fiação e homologação.",
  },
  {
    id: 4,
    title: "Manutenção Preventiva Q3",
    client: "Empresa DEF",
    type: "Manutenção",
    stage: "Manutenção",
    progress: 60,
    vendedor: "Paulo Henrique",
    instalador: "Diego Costa",
    start: "01/08/2024",
    end: "28/08/2024",
    img: "https://images.unsplash.com/photo-1473341304170-971dce60d489?w=120&h=80&fit=crop&auto=format",
    priority: "Média",
    value: 4500,
    notes: "Verificação semestral dos painéis.",
  },
  {
    id: 5,
    title: "Automação de Painel de Comando",
    client: "Indústria GHI",
    type: "Automação de painel de comando",
    stage: "Aprovado",
    progress: 25,
    vendedor: "Paulo Henrique",
    instalador: "Diego Costa",
    start: "20/08/2024",
    end: "30/09/2024",
    img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=120&h=80&fit=crop&auto=format",
    priority: "Alta",
    value: 67000,
    notes: "Projeto técnico em elaboração.",
  },
  {
    id: 6,
    title: "Limpeza de Painéis",
    client: "Empresa ABC",
    type: "Limpeza",
    stage: "Concluído",
    progress: 100,
    vendedor: "Paulo Henrique",
    instalador: "Diego Costa",
    start: "05/08/2024",
    end: "05/08/2024",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=80&fit=crop&auto=format",
    priority: "Baixa",
    value: 800,
  },
  {
    id: 7,
    title: "Configuração de Inversor",
    client: "Empresa JKL",
    type: "Configuração de inversor",
    stage: "Em Instalação",
    progress: 50,
    vendedor: "Paulo Henrique",
    instalador: "Diego Costa",
    start: "12/08/2024",
    end: "20/08/2024",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&h=80&fit=crop&auto=format",
    priority: "Média",
    value: 5500,
  },
];

export function fmt(val: number) {
  return `R$ ${val.toLocaleString("pt-BR")}`;
}

export function progressForStage(stage: string | undefined | null) {
  if (!stage) return 0;
  const s = String(stage).toLowerCase();
  // custom mappings (user steps) and fallbacks for existing STAGES
  if (s.includes("aprova")) return 25;
  if (s.includes("entrada") || s.includes("cpfl") || s.includes("descri")) return 40;
  if (s.includes("instal")) return 70;
  if (s.includes("foto") || s.includes("envio")) return 90;
  if (s.includes("orçamento")) return 5;
  if (s.includes("aprovado")) return 25;
  if (s.includes("em instalação")) return 70;
  if (s.includes("manutenção")) return 50;
  if (s.includes("conclu")) return 100;
  return 0;
}

export function progressForProject(p: Project) {
  const computed = progressForStage(p.stage as string);
  // prefer computed value, but fallback to stored progress if present
  return computed || (typeof p.progress === "number" ? p.progress : 0);
}
