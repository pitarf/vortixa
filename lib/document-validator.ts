/**
 * Utilitário de validação e formatação de documentos fiscais brasileiros (CPF / CNPJ).
 * Utilizado para conformidade com regras do Banco Central e adquirentes de pagamento (Vorexpay / Velana).
 */

/**
 * Remove todos os caracteres não numéricos.
 */
export function cleanDocument(val?: string | null): string {
  if (!val) return "";
  return val.replace(/\D/g, "");
}

/**
 * Aplica máscara dinâmica de CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00).
 */
export function formatDocument(val?: string | null): string {
  const digits = cleanDocument(val).slice(0, 14);

  if (digits.length <= 11) {
    // Máscara de CPF
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // Máscara de CNPJ
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
}

/**
 * Valida os dígitos verificadores de um CPF (Algoritmo Oficial Módulo 11).
 */
export function isValidCPF(cpf: string): boolean {
  const clean = cleanDocument(cpf);
  if (clean.length !== 11) return false;

  // Rejeita sequências de dígitos iguais (ex: 000.000.000-00, 111.111.111-11)
  if (/^(\d)\1{10}$/.test(clean)) return false;

  // Validação do 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10 || firstDigit === 11) firstDigit = 0;
  if (firstDigit !== parseInt(clean.charAt(9), 10)) return false;

  // Validação do 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10 || secondDigit === 11) secondDigit = 0;
  if (secondDigit !== parseInt(clean.charAt(10), 10)) return false;

  return true;
}

/**
 * Valida os dígitos verificadores de um CNPJ (Algoritmo Oficial Módulo 11).
 */
export function isValidCNPJ(cnpj: string): boolean {
  const clean = cleanDocument(cnpj);
  if (clean.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(clean)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(clean.charAt(i), 10) * weights1[i];
  }
  let firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (firstDigit !== parseInt(clean.charAt(12), 10)) return false;

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(clean.charAt(i), 10) * weights2[i];
  }
  let secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (secondDigit !== parseInt(clean.charAt(13), 10)) return false;

  return true;
}

/**
 * Valida um documento genérico (CPF ou CNPJ).
 */
export function isValidDocument(val?: string | null): {
  isValid: boolean;
  type?: "cpf" | "cnpj";
  clean: string;
  error?: string;
} {
  const clean = cleanDocument(val);

  if (!clean) {
    return { isValid: false, clean, error: "Documento não informado." };
  }

  if (clean.length === 11) {
    if (isValidCPF(clean)) {
      return { isValid: true, type: "cpf", clean };
    }
    return { isValid: false, type: "cpf", clean, error: "CPF inválido. Verifique os dígitos." };
  }

  if (clean.length === 14) {
    if (isValidCNPJ(clean)) {
      return { isValid: true, type: "cnpj", clean };
    }
    return { isValid: false, type: "cnpj", clean, error: "CNPJ inválido. Verifique os dígitos." };
  }

  return {
    isValid: false,
    clean,
    error: "Documento deve conter 11 dígitos (CPF) ou 14 dígitos (CNPJ).",
  };
}
