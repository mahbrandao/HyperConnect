"use client";

import { Fragment, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, Calendar } from "lucide-react";

type ViewMode = "Mês" | "Semana" | "Lista";

type AppEvent = {
  id: number;
  date: string;
  time: string;
  title: string;
  sub: string;
  type: string;
  color: string;
};

const COLOR_MAP: Record<string, { cell: string; dot: string; badge: string }> = {
  yellow: {
    cell: "bg-[#f5c518]/20 border-l-2 border-[#f5c518] text-[#f5c518]",
    dot: "bg-[#f5c518]",
    badge: "bg-[#f5c518]/15 text-[#f5c518]",
  },
  blue: {
    cell: "bg-blue-500/20 border-l-2 border-blue-400 text-blue-300",
    dot: "bg-blue-400",
    badge: "bg-blue-500/15 text-blue-400",
  },
  purple: {
    cell: "bg-purple-500/20 border-l-2 border-purple-400 text-purple-300",
    dot: "bg-purple-400",
    badge: "bg-purple-500/15 text-purple-400",
  },
  green: {
    cell: "bg-green-500/20 border-l-2 border-green-400 text-green-300",
    dot: "bg-green-400",
    badge: "bg-green-500/15 text-green-400",
  },
  orange: {
    cell: "bg-orange-500/20 border-l-2 border-orange-400 text-orange-300",
    dot: "bg-orange-400",
    badge: "bg-orange-500/15 text-orange-400",
  },
};

const COLOR_KEYS = Object.keys(COLOR_MAP);

const eventTypes = ["Visita técnica", "Reunião", "Instalação", "Manutenção", "Outros"];
const typeColorMap: Record<string, string> = {
  "Visita técnica": "blue",
  "Reunião": "purple",
  "Instalação": "yellow",
  "Manutenção": "green",
  "Outros": "orange",
};

const initialEvents: AppEvent[] = [
  { id: 1, date: "2026-08-20", time: "09:00", title: "Instalação", sub: "Painéis solares — Unidade Industrial", type: "Instalação", color: "yellow" },
  { id: 2, date: "2026-08-22", time: "09:00", title: "Visita Técnica", sub: "Unidade Industrial", type: "Visita técnica", color: "blue" },
  { id: 3, date: "2026-08-23", time: "14:00", title: "Reunião de acompanhamento", sub: "Online", type: "Reunião", color: "purple" },
  { id: 4, date: "2026-08-24", time: "14:00", title: "Manutenção preventiva", sub: "Unidade Industrial", type: "Manutenção", color: "green" },
];

const DAYS_SHORT = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function monthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function weekDates(year: number, month: number, day: number) {
  const base = new Date(year, month, day);
  const dow = base.getDay();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() - dow + i);
    return d;
  });
}

const emptyForm = { title: "", type: eventTypes[0], date: "", time: "", sub: "" };

export default function Agenda() {
  const [view, setView] = useState<ViewMode>("Semana");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(7);
  const [weekAnchor, setWeekAnchor] = useState(20);
  const [events, setEvents] = useState<AppEvent[]>(initialEvents);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = isoDate(year, month, 20);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function eventsOnDate(iso: string) {
    return events.filter(e => e.date === iso);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Informe o título.";
    if (!form.date) e.date = "Selecione uma data.";
    if (!form.time) e.time = "Selecione o horário.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const color = typeColorMap[form.type] || "orange";
    setEvents(prev => [...prev, { id: Date.now(), date: form.date, time: form.time, title: form.title.trim(), sub: form.sub.trim(), type: form.type, color }]);
    setOpen(false);
    setForm(emptyForm);
    setErrors({});
  }

  const inputCls = "w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#444] outline-none focus:border-[#f5c518]/50 transition-colors";

  const wDates = weekDates(year, month, weekAnchor);

  const sortedEvents = [...events].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Agenda</h1>
          <p className="text-[#888] text-sm">Confira seus compromissos e atividades programadas.</p>
        </div>
        <button
          onClick={() => { setOpen(true); setErrors({}); }}
          className="bg-[#f5c518] text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#e6b800] transition-colors"
        >
          <Plus size={16} />
          Novo compromisso
        </button>
      </div>

      <div className="bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
        {/* Calendar header */}
        <div className="flex items-center justify-between p-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <button
              onClick={view === "Semana" ? () => setWeekAnchor(d => d - 7) : prevMonth}
              className="p-1.5 rounded-lg hover:bg-[#222] text-[#888] hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-white">
              {view === "Semana"
                ? `${wDates[0].getDate()} – ${wDates[6].getDate()} de ${MONTH_NAMES[wDates[0].getMonth()]} ${wDates[0].getFullYear()}`
                : `${MONTH_NAMES[month]} ${year}`}
            </span>
            <button
              onClick={view === "Semana" ? () => setWeekAnchor(d => d + 7) : nextMonth}
              className="p-1.5 rounded-lg hover:bg-[#222] text-[#888] hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-1 bg-[#1a1a1a] rounded-lg p-1">
            {(["Mês", "Semana", "Lista"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === v ? "bg-[#f5c518] text-black" : "text-[#888] hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* ── MONTH VIEW ── */}
        {view === "Mês" && (() => {
          const cells = monthGrid(year, month);
          return (
            <div>
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-[#222]">
                {DAYS_SHORT.map(d => (
                  <div key={d} className="py-2 text-center text-xs font-medium text-[#555]">{d}</div>
                ))}
              </div>
              {/* Weeks */}
              <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                  const iso = day ? isoDate(year, month, day) : "";
                  const dayEvents = day ? eventsOnDate(iso) : [];
                  const isToday = iso === today;
                  return (
                    <div
                      key={i}
                      className={`min-h-[90px] p-2 border-b border-r border-[#1e1e1e] ${
                        i % 7 === 6 ? "border-r-0" : ""
                      } ${!day ? "bg-[#111]" : "hover:bg-[#1a1a1a] transition-colors"}`}
                    >
                      {day && (
                        <>
                          <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-semibold mb-1 ${
                            isToday ? "bg-[#f5c518] text-black" : "text-[#888]"
                          }`}>
                            {day}
                          </span>
                          <div className="space-y-0.5">
                            {dayEvents.slice(0, 2).map(ev => (
                              <div
                                key={ev.id}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium truncate ${COLOR_MAP[ev.color]?.cell || COLOR_MAP.orange.cell}`}
                              >
                                {ev.time} {ev.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-[10px] text-[#555] px-1">+{dayEvents.length - 2} mais</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── WEEK VIEW ── */}
        {view === "Semana" && (
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            {/* Header */}
            <div className="border-b border-[#222] py-3" />
            {wDates.map((d, i) => {
              const iso = isoDate(d.getFullYear(), d.getMonth(), d.getDate());
              const isToday = iso === today;
              return (
                <div key={i} className={`border-b border-[#222] border-l py-3 text-center ${isToday ? "bg-[#f5c518]/5" : ""}`}>
                  <div className="text-xs text-[#888] font-medium">{DAYS_SHORT[d.getDay()]}</div>
                  <div className={`text-lg font-bold mt-0.5 ${isToday ? "text-[#f5c518]" : "text-white"}`}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}

            {/* Time slots */}
            {HOURS.map((hour) => (
              <Fragment key={hour}>
                <div className="border-b border-[#1e1e1e] py-3 pr-3 text-right">
                  <span className="text-xs text-[#555]">{hour}</span>
                </div>
                {wDates.map((d, colIdx) => {
                  const iso = isoDate(d.getFullYear(), d.getMonth(), d.getDate());
                  const isToday = iso === today;
                  const dayEvents = eventsOnDate(iso);
                  const hourEvent = dayEvents.find(e => e.time === hour);
                  return (
                    <div
                      key={`cell-${hour}-${colIdx}`}
                      className={`border-b border-[#1e1e1e] border-l border-[#1e1e1e] min-h-[48px] p-1 ${isToday ? "bg-[#f5c518]/3" : ""}`}
                    >
                      {hourEvent && (
                        <div className={`rounded p-2 text-xs ${COLOR_MAP[hourEvent.color]?.cell || COLOR_MAP.orange.cell}`}>
                          <div className="font-semibold">{hourEvent.title}</div>
                          <div className="opacity-70 text-[10px]">{hourEvent.sub}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === "Lista" && (
          <div className="divide-y divide-[#1e1e1e]">
            {sortedEvents.length === 0 && (
              <div className="py-16 text-center text-[#555] text-sm">Nenhum compromisso cadastrado.</div>
            )}
            {sortedEvents.map(ev => {
              const [yr, mo, dy] = ev.date.split("-").map(Number);
              const label = `${String(dy).padStart(2, "0")}/${String(mo).padStart(2, "0")}/${yr}`;
              const cms = COLOR_MAP[ev.color] || COLOR_MAP.orange;
              return (
                <div key={ev.id} className="flex items-center gap-5 px-5 py-4 hover:bg-[#1a1a1a] transition-colors group">
                  {/* Date badge */}
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="text-2xl font-bold text-white leading-none">{String(dy).padStart(2, "0")}</div>
                    <div className="text-[10px] text-[#888] uppercase mt-0.5">{MONTH_NAMES[mo - 1].slice(0, 3)}</div>
                  </div>

                  {/* Color bar */}
                  <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${cms.dot}`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cms.badge}`}>{ev.type}</span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
                    {ev.sub && <p className="text-xs text-[#888] truncate">{ev.sub}</p>}
                  </div>

                  {/* Meta */}
                  <div className="flex-shrink-0 text-right space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#666] justify-end">
                      <Clock size={11} />
                      {ev.time}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#666] justify-end">
                      <Calendar size={11} />
                      {label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Novo Compromisso */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#111] border border-[#222] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e]">
              <div>
                <h2 className="text-base font-bold text-white">Novo compromisso</h2>
                <p className="text-xs text-[#555] mt-0.5">Adicione um evento à sua agenda.</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-[#1e1e1e] text-[#555] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">Título</label>
                <input
                  className={inputCls}
                  placeholder="Ex: Visita técnica"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">Tipo</label>
                <select
                  className={inputCls}
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  {eventTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Data</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none" />
                    <input
                      type="date"
                      className={`${inputCls} pl-9`}
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">Horário</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none" />
                    <input
                      type="time"
                      className={`${inputCls} pl-9`}
                      value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                    />
                  </div>
                  {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">Local / Descrição <span className="text-[#555]">(opcional)</span></label>
                <input
                  className={inputCls}
                  placeholder="Ex: Unidade Industrial, Online…"
                  value={form.sub}
                  onChange={e => setForm({ ...form, sub: e.target.value })}
                />
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
                  className="flex-1 py-2.5 rounded-lg bg-[#f5c518] text-black text-sm font-bold hover:bg-[#e6b800] transition-colors"
                >
                  Salvar compromisso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
