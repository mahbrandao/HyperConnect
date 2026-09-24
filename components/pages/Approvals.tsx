"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, ShieldCheck } from "lucide-react";

type PendingAccount = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

const mockPendingAccounts: PendingAccount[] = [
  { id: "1", name: "Ana Paula Souza", email: "ana.souza@gmail.com", created_at: "2026-09-20T10:00:00.000Z" },
  { id: "2", name: "Pedro Martins", email: "pedro.martins@gmail.com", created_at: "2026-09-21T08:30:00.000Z" },
];

const teamOptions = [
  { value: "gerente", label: "Gerência" },
  { value: "admin", label: "Administração" },
  { value: "vendas", label: "Vendas" },
  { value: "instalacao", label: "Instalação" },
] as const;

export default function Approvals() {
  const [accounts, setAccounts] = useState<PendingAccount[]>(mockPendingAccounts);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const rows = useMemo(
    () =>
      accounts.map((account) => ({
        ...account,
        team: selected[account.id] ?? "vendas",
      })),
    [accounts, selected]
  );

  function handleApprove(id: string) {
    setAccounts(prev => prev.filter(account => account.id !== id));
    setSelected(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Aprovações pendentes</h1>
        <p className="text-[#888] text-sm mt-1">Defina o departamento das contas ainda sem acesso ao sistema.</p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-[#222] bg-[#151515] p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5c518]/10 text-[#f5c518] border border-[#f5c518]/20">
            <Clock3 size={24} />
          </div>
          <p className="text-white font-medium">Nenhuma conta aguardando aprovação no momento.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#222] bg-[#151515]">
          <table className="w-full text-left">
            <thead className="border-b border-[#222] bg-[#111]">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#555]">Nome</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#555]">E-mail</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#555]">Cadastro</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#555]">Departamento</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-[#555]">Ação</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((account) => (
                <tr key={account.id} className="border-b border-[#1a1a1a] last:border-b-0">
                  <td className="px-4 py-4 text-sm text-white">{account.name}</td>
                  <td className="px-4 py-4 text-sm text-[#bbb]">{account.email}</td>
                  <td className="px-4 py-4 text-sm text-[#777]">{new Date(account.created_at).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-4">
                    <select
                      value={selected[account.id] ?? "vendas"}
                      onChange={(e) => setSelected(prev => ({ ...prev, [account.id]: e.target.value }))}
                      className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-[#f5c518]/50"
                    >
                      {teamOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleApprove(account.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#f5c518] px-3 py-2 text-sm font-bold text-black hover:bg-[#e6b800] transition-colors"
                    >
                      <ShieldCheck size={14} />
                      Aprovar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
