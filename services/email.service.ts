export interface IEmailProvider {
  sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean>;
}

// Mock Email Provider para desenvolvimento local e testes
export class MockEmailProvider implements IEmailProvider {
  async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    console.log(`[MOCK EMAIL] Para: ${to} | Assunto: ${subject}`);
    console.log(`[MOCK EMAIL] Conteúdo: ${htmlContent}`);
    return true;
  }
}

// Brevo Email Provider preparado para futura integração
export class BrevoEmailProvider implements IEmailProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || "";
  }

  async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    if (!this.apiKey) {
      console.warn("[BrevoEmailProvider] Chave API da Brevo ausente. Ignorando envio real.");
      return false;
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
        },
        body: JSON.stringify({
          sender: { name: "VORIXA AI", email: "noreply@vorixa.com" },
          to: [{ email: to }],
          subject: subject,
          htmlContent: htmlContent,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("[BrevoEmailProvider] Erro ao disparar e-mail pela Brevo:", error);
      return false;
    }
  }
}

export class EmailService {
  private static provider: IEmailProvider = new MockEmailProvider();

  static setProvider(newProvider: IEmailProvider) {
    this.provider = newProvider;
  }

  static async sendPasswordRecovery(to: string, token: string): Promise<boolean> {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const recoveryLink = `${baseUrl}/recovery-password?token=${token}`;
    const subject = "Recuperação de Senha - VORIXA";
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #6366f1;">VORIXA AI</h2>
        <p>Você solicitou a recuperação de senha para sua conta no VORIXA.</p>
        <p>Clique no botão abaixo para redefinir sua senha. Este link expira em 1 hora.</p>
        <a href="${recoveryLink}" style="display: inline-block; background-color: #6366f1; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0;">Redefinir Senha</a>
        <p style="color: #666; font-size: 12px;">Se você não realizou esta solicitação, ignore este e-mail.</p>
      </div>
    `;
    return this.provider.sendEmail(to, subject, htmlContent);
  }
}
