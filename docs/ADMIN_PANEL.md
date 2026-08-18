# ADMIN PANEL & BRANDING - VORIXA

Este documento descreve a estrutura de controle do painel administrativo do VORIXA.

## 1. Módulos do Painel Admin

O painel de administração é restrito a usuários com `role === 'ADMIN'`.

### 1.1 Gerenciamento de Usuários
* **Lista e Busca**: Visualização tabular de todos os usuários com paginação, busca por e-mail/nome e filtros por cargo ou status.
* **Detalhes do Consumo**: Exibição detalhada do histórico de transações de crédito, jobs executados e pagamentos efetuados pelo usuário selecionado.
* **Ajuste de Créditos**: Botões de ação rápida para creditar ou debitar saldo, e alternar a chave de créditos ilimitados (`isUnlimited`).

### 1.2 Controle de Ferramentas e Modelos
* **Parâmetros Técnicos**: Edição dos custos de crédito internos, status de ativação das ferramentas e associação a modelos de IA.
* **Controle de Custo**: O administrador pode alterar o custo em créditos internos para reajustar margens de lucro sem alterar código.

### 1.3 Histórico de Transações e Logs
* **Métricas Financeiras**: Relatório com valores transacionados e taxas de conversão de checkouts pendentes vs pagos.
* **Visualizador de Jobs**: Lista contendo status em tempo real de todas as gerações da fal.ai, duração e logs de erro associados.

---

## 2. Configurações de Branding e SEO Dinâmico (Regra Obrigatória)

Para possibilitar o gerenciamento de branding pelo cliente final, o VORIXA implementa uma página de configurações no Painel Admin que atualiza a tabela `SystemSetting` no banco de dados.

### Configurações Editáveis
1. **Título do Site (`siteTitle`)**: Nome principal do site injetado na tag `<title>`.
2. **Descrição do Site (`siteDescription`)**: Texto descritivo indexado por motores de busca (`meta name="description"`).
3. **Keywords (`siteKeywords`)**: Palavras-chave separadas por vírgula.
4. **Favicon (`faviconUrl`)**: Campo de upload do arquivo `.ico` ou `.png`.
5. **Open Graph Image (`ogImageUrl`)**: URL absoluta da imagem de compartilhamento.

### Gerenciador de Metadados (MetadataManager)
O frontend Next.js buscará no carregamento das rotas públicas (Landing Page, Checkout) os dados da tabela `SystemSetting`. Se não houver configurações, utilizará fallbacks definidos na aplicação.

```typescript
// Exemplo de busca de SEO dinâmico no Next.js App Router
export async function generateMetadata() {
  const settings = await prisma.systemSetting.findMany();
  const siteTitle = settings.find(s => s.key === "siteTitle")?.value || "VORIXA";
  const siteDescription = settings.find(s => s.key === "siteDescription")?.value || "Plataforma de IA";
  const faviconUrl = settings.find(s => s.key === "faviconUrl")?.value || "/favicon.ico";

  return {
    title: siteTitle,
    description: siteDescription,
    icons: {
      icon: faviconUrl,
    },
  };
}
```

> [!IMPORTANT]
> As áreas internas logadas (Dashboard/Painel Admin) recebem automaticamente no cabeçalho a tag `<meta name="robots" content="noindex, nofollow">` para garantir segurança de dados e privacidade contra indexação.
