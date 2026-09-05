# DIRETRIZES DE DESENVOLVIMENTO VORIXA

Este documento define as regras de arquitetura e desenvolvimento no workspace.

1. **Estrutura de Pastas Modular**:
   - Componentes em `/components`.
   - Serviços de domínio em `/services`.
   - Handlers de API/NextJS em `/app/api`.
   - Nomes de arquivos e pastas devem ser consistentes e descritivos.

2. **Gerenciamento de Dependências**:
   - Sempre documentar novas dependências adicionadas.
   - Evitar imports globais ou dependências duplicadas.

3. **Banco de Dados**:
   - Todas as modificações no banco exigem alteração no `schema.prisma`.
   - Geração de novas migrations executando scripts reprodutíveis.
   - Saneamento de dados deve ser executado com script de dry-run seguro em banco temporário.

4. **Documentação Viva e Cumulativa (MANUAL_DEV e MANUAL_USER)**:
   - Os manuais técnicos e de usuário são documentos cumulativos e nunca devem ter seus conteúdos prévios apagados ou substituídos integralmente.
   - O desenvolvedor/agente deve ler o arquivo existente e anexar/atualizar as seções do módulo modificado.
   - Nenhuma feature é dada como concluída sem a atualização concomitante de `docs/MANUAL_DEV.md` e `docs/MANUAL_USER.md`.

5. **Design System & AI Creative Premium**:
   - Todo frontend do VORIXA é tratado como produto AI Creative Premium. Nenhuma tela deve ser construída como CRUD, dashboard SaaS genérico ou template administrativo.
   - O VORIXA FLOW é a referência visual e de interação do produto. Todas as novas telas devem compartilhar a linguagem Dark Obsidian (`#070709`, `#0D0E12`, `#13141B`, bordas `#1E202E`), cinematográfica e futurista.
   - **Propósito Funcional de Animações**: Proibido criar animações gratuitas. Cada efeito, microinteração ou transição deve possuir função estrita: revelar elementos, transicionar estados, comunicar processamento, destacar resultados ou conferir sensação de profundidade espacial, respeitando `prefers-reduced-motion`.
