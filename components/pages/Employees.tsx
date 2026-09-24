"use client";

import { useState } from "react";
import { Plus, Search, X, User, Mail, Phone, Briefcase, Calendar, MoreVertical } from "lucide-react";

type Status = "Ativo" | "Inativo" | "Férias";

type Employee = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  since: string;
  status: Status;
};

type AccessInvite = {
  email: string;
  team: "gerente" | "admin" | "vendas" | "instalacao";
};

const initialEmployees: Employee[] = [
  { id: 1, name: "Carlos Mendes", email: "carlos.mendes@hyperconnect.com.br", phone: "(11) 99123-4567", role: "Técnico de Campo", department: "Instalações", since: "03/01/2023", status: "Ativo" },
  { id: 2, name: "Fernanda Lima", email: "fernanda.lima@hyperconnect.com.br", phone: "(11) 98765-0011", role: "Engenheira Elétrica", department: "Projetos", since: "15/06/2022", status: "Ativo" },
  { id: 3, name: "Rafael Torres", email: "rafael.torres@hyperconnect.com.br", phone: "(11) 97654-3321", role: "Analista de Automação", department: "Automação", since: "20/03/2024", status: "Férias" },
];

const departments = ["Instalações", "Projetos", "Automação", "Comercial", "Administrativo", "TI"];
const roles = ["Técnico de Campo", "Engenheiro Elétrico", "Analista de Automação", "Gerente de Projetos", "Vendedor", "Assistente Administrativo"];
const statusOptions: Status[] = ["Ativo", "Inativo", "Férias"];

const statusStyle: Record<Status, string> = {
  Ativo: "bg-green-500/15 text-green-400",
  Inativo: "bg-red-500/15 text-red-400",
  Férias: "bg-blue-500/15 text-blue-400",
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: roles[0],
  department: departments[0],
  since: "",
  status: "Ativo" as Status,
  giveAccess: false,
  accessEmail: "",
  accessTeam: "vendas" as AccessInvite["team"],
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

const avatarColors = [
  "bg-[#f5c518] text-black",
  "bg-blue-500 text-white",
  "bg-purple-500 text-white",
  "bg-green-500 text-black",
  "bg-orange-500 text-white",
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [invites, setInvites] = useState<AccessInvite[]>([]);

  const filtered = employees.filter(
    e =>
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Informe o nome completo.";
    if (!form.email.trim()) e.email = "Informe o e-mail.";
    if (!form.since) e.since = "Informe a data de admissão.";
    return e;
  }

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const [y, m, d] = form.since.split("-");

    if (form.giveAccess && form.accessEmail.trim()) {
      setInvites(prev => [
        ...prev,
        { email: form.accessEmail.trim(), team: form.accessTeam },
      ]);
    }

    setEmployees(prev => [
      ...prev,
      {
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        department: form.department,
        since: `${d}/${m}/${y}`,
        status: form.status,
      },
    ]);
    setOpen(false);
    setForm(emptyForm);
    setErrors({});
  }

  const inputCls = "w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#444] outline-none focus:border-[#f5c518]/50 transition-colors";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Funcionários</h1>
          <p className="text-[#888] text-sm">Gerencie a equipe da Hyper Connect.</p>
        </div>
        <button
          onClick={() => { setOpen(true); setErrors({}); }}
          className="bg-[#f5c518] text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#e6b800] transition-colors"
        >
          <Plus size={16} />
          Novo funcionário
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: employees.length, color: "text-white" },
          { label: "Ativos", value: employees.filter(e => e.status === "Ativo").length, color: "text-green-400" },
          { label: "Em férias", value: employees.filter(e => e.status === "Férias").length, color: "text-blue-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#151515] border border-[#222] rounded-xl p-4">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-[#888] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar funcionário"
          className="w-full bg-[#1a1a1a] border border-[#222] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#555] outline-none focus:border-[#333]"
        />
      </div>

      {/* Table */}
      <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#222]">
              {["Funcionário", "Cargo", "Departamento", "Admissão", "Status", ""].map(col => (
                <th key={col} className="text-left py-3 px-4 text-xs font-medium text-[#555] uppercase tracking-wider">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#555] text-sm">Nenhum funcionário encontrado.</td>
              </tr>
            )}
            {filtered.map((emp, idx) => (
              <tr key={emp.id} className="hover:bg-[#1a1a1a] transition-colors group">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                      {initials(emp.name)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{emp.name}</div>
                      <div className="text-xs text-[#555]">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-sm text-[#888]">{emp.role}</td>
                <td className="py-3.5 px-4 text-sm text-[#888]">{emp.department}</td>
                <td className="py-3.5 px-4 text-sm text-[#888]">{emp.since}</td>
                <td className="py-3.5 px-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[emp.status]}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === emp.id ? null : emp.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[#222] text-[#888] hover:text-white transition-all">
                      <MoreVertical size={14} />
                    </button>
                    {menuOpen === emp.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-[#111] border border-[#222] rounded-md p-2 z-50">
                        <button onClick={() => { setEmployees(prev => prev.filter(e => e.id !== emp.id)); setMenuOpen(null); }} className="w-full text-left text-sm text-red-400">Excluir</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#111] border border-[#222] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e] sticky top-0 bg-[#111] z-10">
              <div>
                <h2 className="text-base font-bold text-white">Novo funcionário</h2>
                <p className="text-xs text-[#555] mt-0.5">Preencha os dados para cadastrar.</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-[#1e1e1e] text-[#555] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">
                  <span className="flex items-center gap-1.5"><User size={12} /> Nome completo</span>
                </label>
                <input className={inputCls} placeholder="Ex: Maria Silva" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">
                  <span className="flex items-center gap-1.5"><Mail size={12} /> E-mail corporativo</span>
                </label>
                <input type="email" className={inputCls} placeholder="nome@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">
                  <span className="flex items-center gap-1.5"><Phone size={12} /> Telefone</span>
                </label>
                <input className={inputCls} placeholder="(11) 99999-9999" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>

              <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-3">
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.giveAccess}
                    onChange={e => setForm({ ...form, giveAccess: e.target.checked })}
                    className="accent-[#f5c518]"
                  />
                  Dar acesso ao sistema
                </label>
                <p className="mt-2 text-[11px] text-[#888] leading-5">
                  Isso é um convite de acesso: a pessoa só conseguirá entrar depois de se cadastrar em /register com o mesmo e-mail informado.
                </p>
              </div>

              {form.giveAccess && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#888] mb-1.5">E-mail de acesso</label>
                    <input
                      type="email"
                      className={inputCls}
                      placeholder="funcionario@gmail.com"
                      value={form.accessEmail}
                      onChange={e => setForm({ ...form, accessEmail: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#888] mb-1.5">Departamento de acesso</label>
                    <select
                      className={inputCls}
                      value={form.accessTeam}
                      onChange={e => setForm({ ...form, accessTeam: e.target.value as AccessInvite["team"] })}
                    >
                      <option value="gerente">Gerência</option>
                      <option value="admin">Administração</option>
                      <option value="vendas">Vendas</option>
                      <option value="instalacao">Instalação</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">
                    <span className="flex items-center gap-1.5"><Briefcase size={12} /> Cargo</span>
                  </label>
                  <select className={inputCls} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Departamento</label>
                  <select className={inputCls} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> Data de admissão</span>
                  </label>
                  <input type="date" className={inputCls} value={form.since} onChange={e => setForm({ ...form, since: e.target.value })} />
                  {errors.since && <p className="text-red-400 text-xs mt-1">{errors.since}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Status</label>
                  <select className={inputCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Status })}>
                    {statusOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-lg border border-[#222] text-sm text-[#888] hover:text-white hover:border-[#333] transition-colors font-medium">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#f5c518] text-black text-sm font-bold hover:bg-[#e6b800] transition-colors">
                  Cadastrar funcionário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
