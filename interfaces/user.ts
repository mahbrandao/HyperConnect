export type Team = "gerente" | "admin" | "vendas" | "instalacao";

export interface User {
  name: string;
  team: Team;
  teamLabel: string;
  avatar: string;
}
