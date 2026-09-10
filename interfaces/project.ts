export type Stage = "Orçamento" | "Aprovado" | "Em Instalação" | "Manutenção" | "Concluído";
export type Priority = "Alta" | "Média" | "Baixa";

export interface Project {
  id: number;
  title: string;
  client: string;
  type: string;
  stage: Stage;
  progress: number;
  vendedor: string;
  instalador: string;
  start: string;
  end: string;
  img: string;
  priority: Priority;
  value: number;
  valorSistema?: number;
  valorMO?: number;
  valorAReceber?: number;
  dataPgto?: string | null;
  notes?: string;
}
