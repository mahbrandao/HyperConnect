import Link from "next/link";
import { Mail, ArrowRight, HelpCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function RecoverPassword() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="w-72 flex-shrink-0 bg-[#0a0a0a] relative flex flex-col justify-between p-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=900&fit=crop&auto=format')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />

        {/* Lock illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 160 200" className="w-40 h-48 opacity-15">
            <circle cx="80" cy="100" r="55" fill="none" stroke="#f5c518" strokeWidth="2" />
            <rect x="55" y="95" width="50" height="45" rx="6" fill="none" stroke="#f5c518" strokeWidth="2" />
            <path d="M 65 95 Q 65 70 80 70 Q 95 70 95 95" fill="none" stroke="#f5c518" strokeWidth="2" />
            <circle cx="80" cy="115" r="5" fill="#f5c518" opacity="0.5" />
            <circle cx="40" cy="60" r="15" fill="none" stroke="#f5c518" strokeWidth="1.5" strokeDasharray="4" />
            <circle cx="120" cy="140" r="12" fill="none" stroke="#f5c518" strokeWidth="1.5" strokeDasharray="4" />
            <line x1="40" y1="60" x2="65" y2="85" stroke="#f5c518" strokeWidth="1" strokeDasharray="3" opacity="0.5" />
            <line x1="120" y1="140" x2="95" y2="125" stroke="#f5c518" strokeWidth="1" strokeDasharray="3" opacity="0.5" />
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
      <div className="flex-1 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-black mb-1">Recuperar senha</h1>
          <p className="text-[#666] text-sm mb-8 leading-relaxed">
            Informe o e-mail da sua conta que enviaremos um link para redefinir sua senha.
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">E-mail corporativo</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="exemplo@empresa.com"
                  className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#f5c518] transition-colors text-black placeholder:text-[#bbb]"
                />
                <Mail size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#f5c518] text-black font-bold py-3 rounded-lg hover:bg-[#e6b800] transition-colors text-sm"
            >
              Enviar link de recuperação
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#eee]" />
            <span className="text-xs text-[#bbb]">ou</span>
            <div className="flex-1 h-px bg-[#eee]" />
          </div>

          <Link
            href="/"
            className="w-full border border-[#ddd] rounded-lg py-3 text-sm font-medium text-black hover:bg-[#f9f9f9] transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight size={15} />
            Voltar para o login
          </Link>

          <div className="mt-6 p-4 bg-[#f9f9f9] rounded-xl border border-[#eee]">
            <div className="flex items-center gap-2 mb-1.5">
              <HelpCircle size={15} className="text-[#888]" />
              <span className="text-sm font-semibold text-black">Precisa de ajuda?</span>
            </div>
            <p className="text-xs text-[#666] mb-3 leading-relaxed">
              Se você não lembrar qual e-mail cadastrou, entre em contato com nosso suporte.
            </p>
            <a href="#" className="text-sm font-medium text-[#f5c518] hover:underline flex items-center gap-1">
              Falar com o suporte <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
