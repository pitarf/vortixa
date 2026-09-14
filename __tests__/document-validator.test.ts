import { describe, it, expect } from "vitest";
import {
  cleanDocument,
  formatDocument,
  isValidCPF,
  isValidCNPJ,
  isValidDocument,
} from "@/lib/document-validator";

describe("Document Validator (CPF / CNPJ)", () => {
  it("deve limpar caracteres não numéricos", () => {
    expect(cleanDocument("123.456.789-00")).toBe("12345678900");
    expect(cleanDocument("12.345.678/0001-90")).toBe("12345678000190");
    expect(cleanDocument("")).toBe("");
    expect(cleanDocument(null)).toBe("");
  });

  it("deve aplicar máscara de CPF e CNPJ dinamicamente", () => {
    expect(formatDocument("12345678900")).toBe("123.456.789-00");
    expect(formatDocument("12345678000190")).toBe("12.345.678/0001-90");
    expect(formatDocument("12345")).toBe("123.45");
  });

  it("deve validar CPFs válidos conhecidos", () => {
    // CPFs válidos padrão de teste algorítmico
    expect(isValidCPF("52998224725")).toBe(true);
    expect(isValidCPF("529.982.247-25")).toBe(true);
  });

  it("deve rejeitar CPFs com dígitos repetidos ou cálculo incorreto", () => {
    expect(isValidCPF("11111111111")).toBe(false);
    expect(isValidCPF("00000000000")).toBe(false);
    expect(isValidCPF("12345678900")).toBe(false);
    expect(isValidCPF("12345")).toBe(false);
  });

  it("deve validar CNPJs válidos conhecidos", () => {
    // CNPJ válido padrão (ex: Banco do Brasil 00.000.000/0001-91)
    expect(isValidCNPJ("00000000000191")).toBe(true);
    expect(isValidCNPJ("00.000.000/0001-91")).toBe(true);
  });

  it("deve rejeitar CNPJs com dígitos repetidos ou cálculo incorreto", () => {
    expect(isValidCNPJ("11111111111111")).toBe(false);
    expect(isValidCNPJ("12345678000100")).toBe(false);
  });

  it("deve retornar objeto detalhado em isValidDocument", () => {
    const valid = isValidDocument("529.982.247-25");
    expect(valid.isValid).toBe(true);
    expect(valid.type).toBe("cpf");
    expect(valid.clean).toBe("52998224725");

    const invalid = isValidDocument("12345");
    expect(invalid.isValid).toBe(false);
    expect(invalid.error).toBeDefined();
  });
});
