# VORIXA - Testes e Funcionalidades Pendentes de Segurança

Este arquivo rastreia itens de segurança identificados durante as auditorias que requerem validação ou implementação futura, pois dependem de credenciais reais, integração futura, ou ampliariam o escopo da auditoria no momento de sua descoberta.

## Regra Absoluta

Nunca remover um item deste arquivo simplesmente porque foi analisado.
Um item só pode sair da lista depois de:
1. ser efetivamente implementado;
2. ser efetivamente testado;
3. possuir evidência;
4. ser marcado como concluído;
5. ter o registro da data/fase/auditoria que o validou.

---

## 1. Timeout e Controle de Recursos no StorageService (Auditoria 14.4.2)
- **Descoberta:** O `StorageService` realiza o download de imagens e vídeos externos via `fetch()`. No entanto, não há um timeout absoluto rigoroso configurado nativamente nem um controle explícito do tamanho do `Buffer` (`response.arrayBuffer()`) processado em memória ou bloqueio de downloads muito grandes (evitando exaustão de memória/disco em casos onde o provider envie gigabytes de dados).
- **Ação Pendente:** Implementar restrições de tamanho na stream ou limites de memória com `AbortController` durante o consumo da resposta HTTP da fal.ai, e validar este limite.
- **Status:** Pendente de implementação e teste em fase futura.
