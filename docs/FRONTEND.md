# FRONTEND ARCHITECTURE - VORIXA

Este documento descreve as diretrizes visuais, estruturais e de interface do usuário para a construção do Frontend no Next.js (React).

## 1. Stack e Ferramentas

* **CSS / Estilização**: Tailwind CSS. Toda a paleta de cores e comportamento responsivo deve ser definida nas classes do Tailwind, evitando estilos inline.
* **Componentes**: Baseados em **shadcn/ui** (utilizando componentes Radix UI acessíveis).
* **Alertas e Toasts**: Proibido utilizar `alert()` nativo. Utilizar a biblioteca **Sonner** para toasts de status de sucesso, processamento e erro de forma integrada.
* **Ícones**: **Lucide React**.

## 2. Layout do Dashboard

O dashboard autenticado do usuário é composto por três áreas principais:
1. **Sidebar (Navegação)**:
   * Contém links para as Ferramentas, Galeria/Histórico, Painel Administrativo (se o usuário for ADMIN) e Configurações de Perfil.
   * Oculta-se automaticamente no mobile, acionada por um menu hambúrguer no Header.
2. **Header (Cabeçalho)**:
   * Exibe o saldo de créditos atual do usuário com um botão de ação rápida "Adicionar Créditos" (abre modal de checkout).
   * Menu Dropdown do Perfil (Logout, Configurações).
3. **Main Content Area (Conteúdo Principal)**:
   * Layout responsivo de grid adaptável para exibição dos painéis das ferramentas de IA.

---

## 3. Diretriz Mobile-First e Responsividade

O design deve ser impecável e testado em celulares antes do desktop. Não consideramos um design pronto apenas por adaptar e ocultar overflows; ele deve ser usável por toque de forma nativa.

* **Navegação Móvel**: A sidebar fixa do desktop deve ser convertida em uma barra inferior de navegação rápida (bottom navigation) ou em uma gaveta lateral recolhível por toque (`Sheet` do shadcn) de fácil ativação com o polegar.
* **Componentes de Toque**: Botões, inputs e links devem respeitar as diretrizes de acessibilidade WCAG 2.1:
  * Área de toque mínima de **`44px`** de altura por **`44px`** de largura.
  * Espaçamento mínimo de **`8px`** entre links interativos ou botões próximos para evitar cliques acidentais.
  * Funcionalidade completa sem depender exclusivamente do comportamento de "hover" (passar o mouse), fornecendo feedback visual de toque imediato (`active:` e `focus:` visíveis).
* **Tabelas de Histórico**: É terminantemente proibido exibir tabelas nativas de múltiplas colunas em telas pequenas. No mobile, as informações da tabela devem ser reestruturadas e exibidas na forma de **Cards Empilhados**, **Accordions** ou **Listas Dinâmicas**, garantindo que nenhum dado crítico ou botão de ação seja omitido da interface móvel.
* **Formulários e Inputs**: No desktop, formulários complexos podem utilizar grids de múltiplas colunas. No mobile, devem ser empilhados estritamente na vertical com espaçamentos adequados de margem, facilitando a navegação via scroll.
* **Validação Multi-dispositivos**: Toda nova tela criada deve ser validada nos seguintes breakpoints de tamanho:
  * Mobile pequeno (ex: iPhone SE / 320px)
  * Mobile grande (ex: iPhone Pro Max / 428px)
  * Tablet (ex: iPad / 768px)
  * Notebook (1366px)
  * Desktop (1920px)

---

## 4. Estados da Interface (Design de Experiência)

* **Loading States**: Exibir skeleton loaders específicos para listas de histórico de geração e galeria.
* **Empty States**: Exibir ilustrações limpas e mensagens amigáveis de CTA (ex: "Você ainda não gerou nenhum vídeo. Comece agora!").
* **Error States**: Feedbacks explícitos com toasts contendo a explicação exata do problema (ex: "Falha ao enviar arquivo: Limite de 20MB excedido").

---

## 5. Captura de Rastreamento de Marketing (UTMs)

Para apoiar as estratégias de tráfego pago, o frontend da Landing Page pública e do fluxo de cadastro deve capturar e propagar os parâmetros de campanha de forma silenciosa:

1. **Script de Inicialização (Middleware do Cliente/Layout principal)**:
   * Verifica a URL atual em busca de chaves UTM: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, bem como o cabeçalho `document.referrer`.
   * Se presentes, salva as informações em **Cookies seguros** (com expiração de 30 dias) ou no `sessionStorage`.
2. **Propagação no Cadastro**:
   * O formulário de registro de novos usuários lê os cookies/sessionStorage e envia os campos de UTM juntamente com o payload do formulário para `/api/auth/register`.
   * Garante a atribuição correta das campanhas de tráfego pago no banco de dados.

