"use client";

import { useState, useRef } from "react";
import { Search, Download, MoreVertical, FileText, Plus, X, Upload, CloudUpload } from "lucide-react";

const docTypes = ["Contrato", "Projeto", "Técnico", "Orçamento", "Fiscal", "Manual", "Termo", "Outros"];
const projectOptions = [
  "Instalação fotovoltaica",
  "Limpeza",
  "Configuração de inversor",
  "Carregador de carro elétrico",
  "Automação de painel de comando",
];

const initialDocs = [
  { id: 1, name: "Contrato_Instalacao.pdf", project: "Instalação fotovoltaica", date: "13/08/2024", type: "Contrato" },
  { id: 2, name: "Projeto_Fotovoltaico.pdf", project: "Instalação fotovoltaica", date: "14/08/2024", type: "Projeto" },
  { id: 3, name: "ART_Projeto.pdf", project: "Instalação fotovoltaica", date: "14/08/2024", type: "Técnico" },
  { id: 4, name: "Orçamento_Instalacao.pdf", project: "Instalação fotovoltaica", date: "10/08/2024", type: "Orçamento" },
  { id: 5, name: "Nota_Fiscal_Equipamentos.pdf", project: "Instalação fotovoltaica", date: "18/08/2024", type: "Fiscal" },
  { id: 6, name: "Manual_Operacao.pdf", project: "Instalação fotovoltaica", date: "20/08/2024", type: "Manual" },
  { id: 7, name: "Termo_Entrega.pdf", project: "Instalação fotovoltaica", date: "22/08/2024", type: "Termo" },
];

const typeColor: Record<string, string> = {
  Contrato: "bg-blue-500/15 text-blue-400",
  Projeto: "bg-purple-500/15 text-purple-400",
  Técnico: "bg-[#f5c518]/15 text-[#f5c518]",
  Orçamento: "bg-orange-500/15 text-orange-400",
  Fiscal: "bg-red-500/15 text-red-400",
  Manual: "bg-teal-500/15 text-teal-400",
  Termo: "bg-green-500/15 text-green-400",
  Outros: "bg-gray-500/15 text-gray-400",
};

const emptyForm = {
  name: "",
  project: projectOptions[0],
  type: docTypes[0],
};

export default function Documents() {
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("Todos os projetos");
  const [docs, setDocs] = useState(initialDocs);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter((d) => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.project.toLowerCase().includes(search.toLowerCase());
    const matchProject =
      filterProject === "Todos os projetos" || d.project === filterProject;
    return matchSearch && matchProject;
  });

  function pickFile(f: File) {
    setFile(f);
    if (!form.name) setForm((prev) => ({ ...prev, name: f.name }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Informe o nome do documento.";
    if (!file) e.file = "Selecione um arquivo para enviar.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

    setDocs((prev) => [
      {
        id: Date.now(),
        name: form.name.trim(),
        project: form.project,
        date,
        type: form.type,
      },
      ...prev,
    ]);
    setOpen(false);
    setForm(emptyForm);
    setFile(null);
    setErrors({});
  }

  const inputCls =
    "w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#444] outline-none focus:border-[#f5c518]/50 transition-colors";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Documentos</h1>
          <p className="text-[#888] text-sm">Acesse e baixe todos os documentos dos seus projetos.</p>
        </div>
        <button
          onClick={() => { setOpen(true); setErrors({}); }}
          className="bg-[#f5c518] text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#e6b800] transition-colors"
        >
          <Plus size={16} />
          Novo documento
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar documento"
            className="w-full bg-[#1a1a1a] border border-[#222] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#555] outline-none focus:border-[#333]"
          />
        </div>
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="bg-[#1a1a1a] border border-[#222] rounded-lg px-3 py-2 text-sm text-[#888] outline-none focus:border-[#333]"
        >
          <option value="Todos os projetos">Todos os projetos</option>
          {projectOptions.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#222]">
              {["Documento", "Projeto", "Data", "Tipo", "Ações"].map((col) => (
                <th key={col} className="text-left py-3 px-4 text-xs font-medium text-[#555] uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-[#555] text-sm">Nenhum documento encontrado.</td>
              </tr>
            )}
            {filtered.map(({ id, name, project, date, type }) => (
              <tr key={id} className="hover:bg-[#1a1a1a] transition-colors group">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-red-400" />
                    </div>
                    <span className="text-sm text-white font-medium">{name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-sm text-[#888]">{project}</td>
                <td className="py-3.5 px-4 text-sm text-[#888]">{date}</td>
                <td className="py-3.5 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[type] || "bg-gray-500/15 text-gray-400"}`}>
                    {type}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-[#222] text-[#888] hover:text-white transition-colors">
                      <Download size={14} />
                    </button>
                    <div className="relative">
                      <button onClick={() => setMenuOpen(menuOpen === id ? null : id)} className="p-1.5 rounded-lg hover:bg-[#222] text-[#888] hover:text-white transition-colors">
                        <MoreVertical size={14} />
                      </button>
                      {menuOpen === id && (
                        <div className="absolute right-0 mt-2 w-36 bg-[#111] border border-[#222] rounded-md p-2 z-50">
                          <button onClick={() => { setDocs(prev => prev.filter(d => d.id !== id)); setMenuOpen(null); }} className="w-full text-left text-sm text-red-400">Excluir</button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Documento */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#111] border border-[#222] rounded-2xl w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e]">
              <div>
                <h2 className="text-base font-bold text-white">Novo documento</h2>
                <p className="text-xs text-[#555] mt-0.5">Envie um arquivo e classifique o documento.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#1e1e1e] text-[#555] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Dropzone */}
              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">Arquivo</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const f = e.dataTransfer.files[0];
                    if (f) pickFile(f);
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    dragging
                      ? "border-[#f5c518]/60 bg-[#f5c518]/5"
                      : file
                      ? "border-[#f5c518]/30 bg-[#f5c518]/5"
                      : "border-[#2a2a2a] hover:border-[#333]"
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 bg-red-500/15 rounded-lg flex items-center justify-center">
                        <FileText size={14} className="text-red-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-white font-medium truncate max-w-[220px]">{file.name}</p>
                        <p className="text-xs text-[#555]">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="ml-auto p-1 rounded hover:bg-[#222] text-[#555] hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <CloudUpload size={24} className="mx-auto text-[#444] mb-2" />
                      <p className="text-sm text-[#666]">Arraste um arquivo ou <span className="text-[#f5c518]">clique para selecionar</span></p>
                      <p className="text-xs text-[#444] mt-1">PDF, DOCX, XLSX, PNG — máx. 20 MB</p>
                    </>
                  )}
                </div>
                {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">Nome do documento</label>
                <input
                  className={inputCls}
                  placeholder="Ex: Contrato_Instalacao.pdf"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Projeto</label>
                  <select
                    className={inputCls}
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                  >
                    {projectOptions.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Tipo</label>
                  <select
                    className={inputCls}
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {docTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#222] text-sm text-[#888] hover:text-white hover:border-[#333] transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#f5c518] text-black text-sm font-bold hover:bg-[#e6b800] transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={14} />
                  Enviar documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
