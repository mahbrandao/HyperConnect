"use client";

import { createContext, useMemo, useState, type ReactNode } from "react";
import type { Team, User } from "@/interfaces/user";

export const USERS: Record<Team, User> = {
  gerente: { name: "Carlos Rocha", team: "gerente", teamLabel: "Gerência", avatar: "C" },
  admin: { name: "Samanta Brandão", team: "admin", teamLabel: "Administração", avatar: "S" },
  vendas: { name: "Paulo Henrique", team: "vendas", teamLabel: "Vendas", avatar: "P" },
  instalacao: { name: "Diego Costa", team: "instalacao", teamLabel: "Instalação", avatar: "D" },
};

export interface UserContextValue {
  user: User;
  setTeam: (team: Team) => void;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team>("gerente");
  const value = useMemo(() => ({ user: USERS[team], setTeam }), [team]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
