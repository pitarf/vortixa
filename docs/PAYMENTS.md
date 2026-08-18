# PAYMENTS - VORIXA

Este documento detalha o sistema de pagamentos, o fluxo de compras de créditos e a integração com o gateway de pagamento.

## 1. Abstração de Gateways de Pagamento

A plataforma é projetada com uma interface abstrata para gateways de pagamento (`IPaymentProvider`), permitindo que a substituição ou adição de novos meios (ex: Stripe, Mercado Pago ou Asaas) seja feita sem afetar o fluxo de negócios central.

```typescript
export interface CreatePaymentResult {
  paymentId: string; // ID da transação interna
  checkoutUrl: string; // URL para redirecionamento do checkout
  gatewayTxId: string; // ID retornado pelo gateway
}

export interface IPaymentProvider {
  createTransaction(userId: string, amountBRL: number, credits: number): Promise<CreatePaymentResult>;
  verifyWebhook(headers: Record<string, string>, rawBody: string): Promise<{ gatewayTxId: string; status: 'PAID' | 'FAILED' }>;
}
```

---

## 2. Gateway do MVP: VorexPay

O gateway inicial configurado será o **VorexPay**. A integração envolve:
1. **Geração do Pedido**: O cliente clica no pacote de créditos na Landing Page ou Dashboard. O backend registra um registro em `Payment` com status `PENDING` e chama a API do VorexPay para obter o link de checkout.
2. **Redirecionamento**: O cliente é redirecionado ao link de checkout do VorexPay para pagar via Pix, Boleto ou Cartão de Crédito.
3. **Webhook de Confirmação**: Assim que o pagamento é liquidado, o VorexPay dispara uma notificação via webhook para `/api/webhooks/vorexpay`.

---

## 3. Segurança Contra Fraudes e Reprocessamento

> [!CAUTION]
> A liberação de créditos NUNCA deve ocorrer baseada em interações de frontend. Ela é operada exclusivamente pelo webhook do backend.

Para evitar falhas graves ou fraudes, os seguintes mecanismos devem ser aplicados no processamento do webhook:
1. **Idempotência (Webhook Duplicado)**: 
   * Todo webhook recebido deve ser verificado contra a tabela `PaymentWebhook` usando o ID único do evento (`gatewayEventId`).
   * Se o ID já existir no banco, a requisição é ignorada e responde-se com HTTP 200 (para evitar que o gateway continue tentando enviar).
2. **Proteção Contra Pagamento Falso**:
   * O backend deve validar a assinatura criptográfica do webhook enviada no header do VorexPay usando o `VOREXPAY_WEBHOOK_SECRET` do arquivo `.env`.
3. **Mecanismo Transacional Seguro**:
   * A liberação de créditos deve ser feita através de `prisma.$transaction`.
   * Atualiza-se o status de `Payment` para `PAID`, altera-se o saldo na tabela `CreditBalance` e insere-se um registro do tipo `PURCHASE` na tabela `CreditTransaction`.

---

## 4. Máquina de Estados e Validação de Pagamentos

Qualquer fatura ou transação de pagamento obedece a uma máquina de estados estrita para evitar fraudes ou alterações de estado indevidas via frontend:

* **Estados Válidos**:
  ```text
  PENDING -> PAID
  PENDING -> FAILED
  PENDING -> CANCELLED
  ```
* **Transições Proibidas**: Uma transação no estado `PAID`, `FAILED` ou `CANCELLED` é final e nunca pode ser revertida para `PENDING` ou alternada entre si.
* **Zero Trust no Webhook**: O backend valida as seguintes propriedades antes de consolidar o pagamento:
  1. A assinatura do webhook deve ser válida.
  2. O valor recebido (`amountBRL`) deve corresponder exatamente ao valor registrado no banco para aquele pedido.
  3. A moeda da transação deve ser estritamente BRL.
  4. O status de pagamento retornado pelo gateway deve ser verificado diretamente em seus servidores se houver qualquer suspeita de payload malformado.
  5. A recarga de créditos deve ocorrer apenas se a fatura ainda estiver como `PENDING`.
