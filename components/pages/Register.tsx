"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Building2, FileText, Phone, Lock, ShieldCheck } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="w-72 flex-shrink-0 bg-[#0a0a0a] relative flex flex-col justify-between p-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&h=900&fit=crop&auto=format')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />

        {/* Lightning illustration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg viewBox="0 0 200 300" className="w-40 h-60">
            <polygon points="120,20 60,150 100,150 80,280 150,120 110,120" fill="none" stroke="#f5c518" strokeWidth="3" />
          </svg>
        </div>

        <div className="relative z-10">
          <Logo />
          <p className="text-[#888] text-xs mt-1">ENERGIA SOLAR E AUTOMAÇÃO</p>
        </div>

        <div className="relative z-10">
          <p className="text-white text-2xl font-bold leading-tight mb-2">
            Tecnologia que<br />move o <span className="text-[#f5c518]">futuro.</span>
          </p>
          <p className="text-[#888] text-sm leading-relaxed">
            Soluções completas em energia solar e automação para impulsionar o seu negócio.
          </p>
        </div>

        <div className="relative z-10 text-[#555] text-xs">
          © 2024 HyperZ. Todos os direitos reservados.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-white flex items-center justify-center p-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-black mb-1">Criar conta</h1>
          <p className="text-[#666] text-sm mb-6">Preencha os dados abaixo para criar sua conta na HyperZ.</p>

          <form onSubmit={(e) => { e.preventDefault(); router.push("/"); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Nome completo</label>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#f5c518] transition-colors text-black placeholder:text-[#bbb]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">E-mail corporativo</label>
              <input
                type="email"
                placeholder="exemplo@empresa.com"
                className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#f5c518] transition-colors text-black placeholder:text-[#bbb]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Telefone</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#f5c518] transition-colors text-black placeholder:text-[#bbb]"
                />
                <Phone size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Empresa</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nome da sua empresa"
                  className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#f5c518] transition-colors text-black placeholder:text-[#bbb]"
                />
                <Building2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">CNPJ</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#f5c518] transition-colors text-black placeholder:text-[#bbb]"
                />
                <FileText size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Crie uma senha forte"
                  className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 pr-16 text-sm outline-none focus:border-[#f5c518] transition-colors text-black placeholder:text-[#bbb]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Lock size={14} className="text-[#bbb]" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-[#999]">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="mt-2 p-2.5 bg-[#f9f9f9] rounded-lg border border-[#eee]">
                <p className="text-xs text-[#666] flex items-center gap-1 mb-1">
                  <ShieldCheck size={12} className="text-[#888]" />
                  A senha deve conter:
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs text-[#888]">
                  <span>• Mín. 8 caracteres</span>
                  <span>• Letra maiúscula</span>
                  <span>• Número</span>
                  <span>• Caractere especial</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Confirmar senha</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 pr-16 text-sm outline-none focus:border-[#f5c518] transition-colors text-black placeholder:text-[#bbb]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Lock size={14} className="text-[#bbb]" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#999]">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-[#f5c518]" />
              <span className="text-xs text-[#666]">
                Li e aceito os{" "}
                <a href="#" className="text-[#f5c518] hover:underline">Termos de Uso</a>
                {" "}e a{" "}
                <a href="#" className="text-[#f5c518] hover:underline">Política de Privacidade</a>
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-[#f5c518] text-black font-bold py-3 rounded-lg hover:bg-[#e6b800] transition-colors text-sm"
            >
              Criar conta
            </button>
          </form>

          <p className="text-center text-sm text-[#888] mt-4">
            Já tem uma conta?{" "}
            <Link href="/" className="text-[#f5c518] font-semibold hover:underline">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
