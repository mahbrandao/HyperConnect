"use client";

import React, { useMemo, useState } from "react";
import { projects as initialProjects, fmt } from "@/data/mockData";

function toISO(display?: string | null) {
  if (!display) return "";
  const parts = display.split("/");
  if (parts.length !== 3) return "";
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function fromISO(iso?: string) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  if (!d) return null;
  return `${d}/${m}/${y}`;
}

export default function Payments() {
  const [rows, setRows] = useState(() => initialProjects.map(p => ({ ...p })));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [valorAReceberInput, setValorAReceberInput] = useState<string>("");
  const [dataPgtoInput, setDataPgtoInput] = useState<string>("");

  const totals = useMemo(() => {
    const totalSistema = rows.reduce((s, r) => s + (r.valorSistema ?? r.value ?? 0), 0);
    const totalMO = rows.reduce((s, r) => s + (r.valorMO ?? 0), 0);
    const totalAReceber = rows.reduce((s, r) => s + (r.valorAReceber ?? 0), 0);
    const totalRecebido = rows.reduce((s, r) => s + ((r.valorSistema ?? r.value ?? 0) - (r.valorAReceber ?? 0)), 0);
    const pct = totalSistema > 0 ? Math.round((totalRecebido / totalSistema) * 100) : 0;
    return { totalSistema, totalMO, totalAReceber, totalRecebido, pct };
  }, [rows]);

  function openEdit(id: number) {
    const p = rows.find(r => r.id === id);
    if (!p) return;
    setEditingId(id);
    setValorAReceberInput(String(p.valorAReceber ?? 0));
    setDataPgtoInput(toISO(p.dataPgto ?? undefined));
    if (typeof window !== "undefined" && window.scrollTo) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveEdit() {
    if (editingId === null) return;
    setRows(prev => prev.map(r => {
      if (r.id !== editingId) return r;
      const vAR = Number((valorAReceberInput || "0").replace(/[^0-9.-]/g, ""));
      const newDate = fromISO(dataPgtoInput) || null;
      return { ...r, valorAReceber: Number.isFinite(vAR) ? vAR : r.valorAReceber, dataPgto: newDate };
    }));
    setEditingId(null);
  }

  function markPaidToday(id: number) {
    const today = new Date();
    const display = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    setRows(prev => prev.map(r => r.id === id ? { ...r, dataPgto: display, valorAReceber: 0 } : r));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Pagamentos</h1>
          <p className="text-[#888] text-sm">Visão geral dos valores por cliente (sistema / MO / a receber).</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#151515] border border-[#222] rounded-xl p-3 text-center">
            <div className="text-xs text-[#888]">Total Sistema</div>
            <div className="text-lg font-bold text-white">{fmt(totals.totalSistema)}</div>
          </div>
          <div className="bg-[#151515] border border-[#222] rounded-xl p-3 text-center">
            <div className="text-xs text-[#888]">Total MO</div>
            <div className="text-lg font-bold text-white">{fmt(totals.totalMO)}</div>
          </div>
          <div className="bg-[#151515] border border-[#222] rounded-xl p-3 text-center">
            <div className="text-xs text-[#888]">A Receber</div>
            <div className="text-lg font-bold text-white">{fmt(totals.totalAReceber)}</div>
          </div>
          <div className="bg-[#151515] border border-[#222] rounded-xl p-3 text-center">
            <div className="text-xs text-[#888]">Recebido</div>
            <div className="text-lg font-bold text-white">{fmt(totals.totalRecebido)}</div>
            <div className="text-xs text-[#888] mt-1">{totals.pct}% pago</div>
          </div>
        </div>
      </div>

      {editingId !== null && (
        <div className="bg-[#0f0f0f] border border-[#222] rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-white">Editando pagamento</div>
            <button onClick={() => setEditingId(null)} className="text-sm text-[#888] hover:text-white">Cancelar</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-[#888] mb-1">Valor a receber (R$)</label>
              <input type="number" value={valorAReceberInput} onChange={e => setValorAReceberInput(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">Data Pgto</label>
              <input type="date" value={dataPgtoInput} onChange={e => setDataPgtoInput(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={saveEdit} className="bg-[#f5c518] text-black font-bold px-4 py-2 rounded-lg">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#222]">
              {["Cliente", "Valor Sistema", "Valor MO", "Valor a receber", "Status", "Data Pgto", "Ações"].map(col => (
                <th key={col} className="text-left py-3 px-4 text-xs font-medium text-[#555] uppercase tracking-wider">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {rows.map(p => {
              const sistema = p.valorSistema ?? p.value ?? 0;
              const mo = p.valorMO ?? 0;
              const aReceber = p.valorAReceber ?? 0;
              const paid = !!p.dataPgto || aReceber === 0;
              return (
                <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-white">{p.client}</div>
                    <div className="text-xs text-[#555]">{p.title}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-white font-medium">{fmt(sistema)}</td>
                  <td className="py-3 px-4 text-xs text-white font-medium">{mo ? fmt(mo) : "-"}</td>
                  <td className="py-3 px-4 text-xs text-white font-medium">{fmt(aReceber)}</td>
                  <td className="py-3 px-4 text-xs">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${paid ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>{paid ? "Pago" : "Pendente"}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-[#888]">{p.dataPgto || "-"}</td>
                  <td className="py-3 px-4 text-xs">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p.id)} className="text-sm text-[#f5c518] hover:underline">Editar</button>
                      <button onClick={() => markPaidToday(p.id)} className="text-sm text-green-400 hover:underline">Marcar pago</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
