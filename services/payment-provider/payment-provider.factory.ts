import { PaymentProvider } from "./payment-provider.interface";
import { MockPaymentProvider } from "./mock-payment-provider.service";
import { MercadoPagoProvider } from "./mercadopago.provider";
import { StripeProvider } from "./stripe.provider";

export class PaymentProviderFactory {
  private static providers: Map<string, PaymentProvider> = new Map();

  static getProvider(name?: string): PaymentProvider {
    const configuredProvider = (
      name ||
      process.env.PAYMENT_PROVIDER ||
      process.env.PAYMENT_GATEWAY ||
      "mock_gateway"
    ).toLowerCase();

    if (this.providers.has(configuredProvider)) {
      return this.providers.get(configuredProvider)!;
    }

    let provider: PaymentProvider;

    switch (configuredProvider) {
      case "mercadopago":
      case "mp":
        provider = new MercadoPagoProvider();
        break;
      case "stripe":
        provider = new StripeProvider();
        break;
      case "mock_gateway":
      case "mock":
      case "vorexpay":
      default:
        provider = new MockPaymentProvider();
        break;
    }

    this.providers.set(configuredProvider, provider);
    return provider;
  }

  static registerProvider(name: string, provider: PaymentProvider): void {
    this.providers.set(name.toLowerCase(), provider);
  }

  static reset(): void {
    this.providers.clear();
  }
}
