import React from "react";
import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso & Políticas de Privacidade (LGPD)",
  description: "Termos de serviço, direitos de uso de conteúdo gerado por IA e diretrizes de privacidade em conformidade com a LGPD no VORTIXIA.",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 font-sans selection:bg-violet-500/30 selection:text-white">
      {/* Header Minimalista */}
      <header className="border-b border-[#1E202E] bg-[#0D0E12]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
              VORTIXIA
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              LGPD Compliance
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Hero Section */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/25">
            <Shield className="w-3.5 h-3.5" />
            <span>Última atualização: 05 de Setembro de 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-heading">
            Termos de Uso & Política de Privacidade
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            Transparência absoluta sobre os seus direitos, propriedade intelectual das criações geradas por IA e o tratamento rigoroso de dados pessoais nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
          </p>
        </div>

        {/* Blocos de Destaque Rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-[#1E202E] bg-[#0D0E12] p-5 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Uso Comercial Total</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Você detém 100% dos direitos patrimoniais sobre as imagens, vídeos e áudios gerados na plataforma. Sem marcas d'água.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1E202E] bg-[#0D0E12] p-5 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Proteção LGPD</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seus dados, prompts e mídias de referência são protegidos por criptografia de ponta a ponta e nunca são comercializados.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1E202E] bg-[#0D0E12] p-5 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Transparência de Saldo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cada geração possui custo fixo e visível em créditos. Toda transação é registrada em Ledger imutável para auditoria do usuário.
            </p>
          </div>
        </div>

        {/* Artigos e Cláusulas Detalhadas */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed border-t border-[#1E202E] pt-8">
          
          {/* Seção 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="font-mono text-cyan-400">1.</span>
              <span>Aceitação dos Termos</span>
            </h2>
            <p>
              Ao se cadastrar, acessar ou utilizar o ecossistema <strong>VORTIXIA AI Creative OS</strong>, você declara ter capacidade civil plena e expressa concordância integral com estes Termos de Uso e com a nossa Política de Privacidade. Caso não concorde com qualquer disposição aqui estabelecida, solicitamos que não utilize a plataforma.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="font-mono text-cyan-400">2.</span>
              <span>Propriedade Intelectual & Direitos sobre Criações Geradas por IA</span>
            </h2>
            <p>
              O VORTIXIA disponibiliza acesso a motores de ponta de Inteligência Artificial generativa (FLUX.1, Google Imagen 3, Kling AI, LivePortrait, entre outros).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong>Propriedade dos Resultados:</strong> O usuário detém todos os direitos de exploração comercial, reprodução, distribuição e monetização sobre os conteúdos visuais e audiovisuais gerados a partir dos seus comandos (prompts).
              </li>
              <li>
                <strong>Ausência de Marcas d'Água:</strong> Todas as renderizações oficiais são entregues limpas, sem marcas d'água da VORTIXIA.
              </li>
              <li>
                <strong>Responsabilidade pelo Conteúdo:</strong> O usuário é o único responsável legal pelos textos, imagens de referência e arquivos carregados para processamento. É terminantemente vedada a geração de materiais que promovam discurso de ódio, difamação, violência explícita ou infração direta de direitos autorais de terceiros.
              </li>
            </ul>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="font-mono text-cyan-400">3.</span>
              <span>Tratamento de Dados Pessoais (LGPD - Lei nº 13.709/2018)</span>
            </h2>
            <p>
              Em estrita conformidade com a LGPD, informamos de forma clara e transparente as práticas de tratamento dos seus dados:
            </p>
            <div className="space-y-3 pl-2 border-l-2 border-violet-500/40">
              <div>
                <strong className="text-white">A. Dados Coletados:</strong>
                <p className="text-slate-400">
                  Nome completo, endereço de e-mail, senha criptografada (hash seguro via bcrypt), registros de conexão (endereço IP, data e hora) e dados de transação financeira necessários para recarga de créditos.
                </p>
              </div>
              <div>
                <strong className="text-white">B. Finalidade do Tratamento:</strong>
                <p className="text-slate-400">
                  Autenticação segura, liberação de créditos de geração, prevenção contra fraudes e cumprimento de obrigações legais impostas pelo Marco Civil da Internet (Lei nº 12.965/2014).
                </p>
              </div>
              <div>
                <strong className="text-white">C. Direitos do Titular de Dados:</strong>
                <p className="text-slate-400">
                  Conforme o Art. 18 da LGPD, você pode, a qualquer momento mediante solicitação, requisitar a confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos ou a <strong>exclusão definitiva</strong> da sua conta e de todos os seus ativos armazenados.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="font-mono text-cyan-400">4.</span>
              <span>Uso de Cookies e Tecnologias de Sessão</span>
            </h2>
            <p>
              Nossa plataforma utiliza estritamente cookies necessários para autenticação de sessão criptografada (tokens JWT seguros), proteção contra ataques CSRF e preferências de interface (modo escuro Dark Obsidian). Não comercializamos perfis comportamentais para corretores de dados (data brokers).
            </p>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="font-mono text-cyan-400">5.</span>
              <span>Créditos, Pagamentos e Reconciliação</span>
            </h2>
            <p>
              O ecossistema VORTIXIA opera através de créditos digitais. Cada ferramenta deduz créditos em tempo real mediante confirmação de início de inferência. Na eventualidade de uma falha de renderização por parte dos servidores de GPU, os créditos são estornados de forma automática e instantânea para a carteira do usuário via transação atômica de banco de dados.
            </p>
          </section>

          {/* Seção 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="font-mono text-cyan-400">6.</span>
              <span>Contato do Encarregado de Dados (DPO)</span>
            </h2>
            <p>
              Para exercer qualquer um dos seus direitos garantidos pela LGPD ou sanar dúvidas sobre estes Termos de Uso, entre em contato com nosso Encarregado de Proteção de Dados através do suporte oficial:
            </p>
            <div className="p-4 rounded-xl bg-[#0D0E12] border border-[#1E202E] font-mono text-xs text-slate-300 space-y-1">
              <p>Canal de Privacidade: <span className="text-cyan-400">privacidade@vortixia.com.br</span></p>
              <p>Jurisdição: Foro da Comarca de São Paulo / Brasil</p>
            </div>
          </section>

        </div>

        {/* Rodapé da Página de Termos */}
        <div className="pt-8 border-t border-[#1E202E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 VORTIXIA AI Creative OS. Todos os direitos reservados.</p>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-colors font-semibold cursor-pointer"
          >
            Criar Conta Gratuita
          </Link>
        </div>
      </main>
    </div>
  );
}
