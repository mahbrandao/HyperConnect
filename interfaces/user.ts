export type Team = "gerente" | "admin" | "vendas" | "instalacao";

export interface User {
  name: string;
  team: Team | null;
  teamLabel: string | null;
  avatar: string | null;
}
