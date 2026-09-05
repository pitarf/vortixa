import nodemailer from "nodemailer";

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

// SMTP Email Provider direto (Hostinger / Custom SMTP)
export class SMTPEmailProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;
  private senderEmail: string;
  private senderName: string;

  constructor() {
    const host = process.env.SMTP_HOST || "smtp.hostinger.com";
    const port = Number(process.env.SMTP_PORT) || 465;
    const user = process.env.SMTP_USER || "contato@vortixia.com.br";
    const pass = process.env.SMTP_PASS || "";
    const isSecure = port === 465;

    this.senderEmail = process.env.SMTP_FROM || user;
    this.senderName = process.env.SMTP_SENDER_NAME || "VORIXA AI";

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure, // true para porta 465 com SSL/TLS
      auth: {
        user,
        pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    if (!process.env.SMTP_PASS && !process.env.SMTP_USER) {
      console.warn("[SMTPEmailProvider] Credenciais SMTP ausentes. Ignorando envio real.");
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.senderName}" <${this.senderEmail}>`,
        to,
        subject,
        html: htmlContent,
      });

      console.log(`✅ [SMTPEmailProvider] E-mail enviado com sucesso! MessageId: ${info.messageId} | Para: ${to}`);
      return true;
    } catch (error) {
      console.error("❌ [SMTPEmailProvider] Erro ao enviar e-mail via SMTP direto:", error);
      return false;
    }
  }
}

export class EmailService {
  private static getProvider(): IEmailProvider {
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NODE_ENV !== "test") {
      return new SMTPEmailProvider();
    }
    return new MockEmailProvider();
  }

  private static customProvider: IEmailProvider | null = null;

  static setProvider(newProvider: IEmailProvider) {
    this.customProvider = newProvider;
  }

  private static buildBaseEmailTemplate(title: string, bodyHtml: string): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f1f5f9;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070709; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0d0e12; border: 1px solid #1e202e; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Top Glow Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #7c3aed 0%, #4f46e5 50%, #06b6d4 100%);"></td>
          </tr>

          <!-- Header com Logo VORIXA -->
          <tr>
            <td style="padding: 36px 36px 20px 36px; text-align: center;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <!-- Ícone estilizado do VORIXA (Zap/Spark) -->
                    <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #7c3aed, #4f46e5, #06b6d4); display: inline-block; text-align: center; line-height: 44px; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);">
                      <span style="font-size: 22px; color: #ffffff; font-weight: 900;">✦</span>
                    </div>
                  </td>
                  <td style="vertical-align: middle; text-align: left;">
                    <div style="font-size: 22px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; font-family: 'Segoe UI', sans-serif;">
                      VORIXA
                    </div>
                    <div style="font-size: 10px; letter-spacing: 2px; color: #a78bfa; text-transform: uppercase; font-family: monospace; font-weight: 700; margin-top: -2px;">
                      AI Workspace
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Corpo da Mensagem -->
          <tr>
            <td style="padding: 10px 36px 36px 36px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Rodapé Cinematográfico -->
          <tr>
            <td style="padding: 24px 36px; background-color: #08090c; border-top: 1px solid #161822; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px;">
                © ${new Date().getFullYear()} VORIXA Inc. Todos os direitos reservados.
              </p>
              <p style="margin: 0; color: #475569; font-size: 11px; line-height: 1.5;">
                Plataforma de criação audiovisual e inteligência artificial generativa.<br>
                Enviado com segurança via Hostinger SMTP Direct.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  static async sendPasswordRecovery(to: string, token: string): Promise<boolean> {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005";
    const recoveryLink = `${baseUrl}/recovery-password?token=${token}`;
    const subject = "Recuperação de Senha — VORIXA AI";

    const bodyHtml = `
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">Redefinição de Senha</h2>
        <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.5;">
          Você solicitou a recuperação de acesso da sua conta.
        </p>
      </div>

      <div style="background-color: #13141b; border: 1px solid #1e202e; border-radius: 12px; padding: 20px; margin-bottom: 28px; text-align: left;">
        <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6; margin: 0 0 12px 0;">
          Para cadastrar uma nova senha e continuar criando no <strong>VORIXA</strong>, clique no botão abaixo:
        </p>
        <div style="text-align: center; margin: 24px 0 12px 0;">
          <a href="${recoveryLink}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.45); letter-spacing: 0.5px;">
            Redefinir Senha
          </a>
        </div>
        <p style="color: #64748b; font-size: 11px; text-align: center; margin: 8px 0 0 0;">
          Este link expira em 60 minutos por questões de segurança.
        </p>
      </div>

      <p style="color: #475569; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
        Se você não solicitou esta alteração, nenhuma ação é necessária. Sua conta permanece segura.
      </p>
    `;

    const htmlContent = this.buildBaseEmailTemplate(subject, bodyHtml);
    const provider = this.customProvider || this.getProvider();
    return provider.sendEmail(to, subject, htmlContent);
  }

  static async sendTestEmail(to: string): Promise<boolean> {
    const subject = "✦ Bem-vindo ao VORIXA AI — Teste de Conexão Oficial";

    const bodyHtml = `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; background-color: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.3); color: #a78bfa; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
          Conexão SMTP Hostinger Ativa
        </span>
        <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 8px 0;">Identidade Visual Validada</h2>
        <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.6;">
          Este é um e-mail de teste disparado com a paleta oficial <strong>Dark Obsidian & Purple Cosmic</strong> do VORIXA.
        </p>
      </div>

      <div style="background-color: #13141b; border: 1px solid #1e202e; border-radius: 14px; padding: 24px; margin-bottom: 24px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 14px; border-bottom: 1px solid #1e202e;">
              <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">Servidor de Saída:</span>
              <div style="color: #f1f5f9; font-size: 14px; font-weight: 600; margin-top: 2px;">smtp.hostinger.com (Porta 465 SSL)</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid #1e202e;">
              <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">Remetente Oficial:</span>
              <div style="color: #f1f5f9; font-size: 14px; font-weight: 600; margin-top: 2px;">contato@vortixia.com.br</div>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 14px;">
              <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-family: monospace;">Status da Autenticação:</span>
              <div style="color: #10b981; font-size: 14px; font-weight: 700; margin-top: 2px;">✓ Conectado & Criptografado</div>
            </td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0 10px 0;">
        <a href="http://localhost:3005/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.45); letter-spacing: 0.5px;">
          Acessar Painel VORIXA
        </a>
      </div>
    `;

    const htmlContent = this.buildBaseEmailTemplate(subject, bodyHtml);
    const provider = this.customProvider || this.getProvider();
    return provider.sendEmail(to, subject, htmlContent);
  }
}
