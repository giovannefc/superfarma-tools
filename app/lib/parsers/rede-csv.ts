import type { VendaRede } from "~/models/types";

// Parser específico para CSV da Rede que tem formato especial
export function parseRedeCSV(csvText: string): VendaRede[] {
  try {
    // Normalizar quebras de linha
    const normalizedText = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Separar header da primeira linha de dados
    const lines = normalizedText.split("\n").filter(line => line.trim());

    if (lines.length === 0) {
      throw new Error("Arquivo CSV vazio");
    }

    // Se tudo está em uma linha, precisamos quebrar pelos padrões de data
    let processedText = normalizedText;

    // Se há poucas quebras de linha, provavelmente os dados estão concatenados
    if (lines.length <= 2) {
      // Quebrar por padrões de data (mas não a primeira ocorrência)
      const datePattern = /(\d{2}\/\d{2}\/\d{4})/g;
      let matches = [...processedText.matchAll(datePattern)];

      if (matches.length > 1) {
        // Substituir a partir da segunda ocorrência
        let result = processedText;
        for (let i = matches.length - 1; i >= 1; i--) {
          const match = matches[i];
          if (match.index !== undefined) {
            result =
              result.substring(0, match.index) +
              "\n" +
              result.substring(match.index);
          }
        }
        processedText = result;
      }
    }

    const finalLines = processedText.split("\n").filter(line => line.trim());

    if (finalLines.length < 2) {
      throw new Error("Não foi possível separar header dos dados");
    }

    // Primeira linha é o header
    const headerLine = finalLines[0];
    const headers = headerLine.split(";").map(h => h.trim());

    // Verificar se temos os headers essenciais
    const requiredHeaders = [
      "data da venda",
      "hora da venda",
      "valor da venda original",
      "modalidade",
      "bandeira",
    ];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
      throw new Error(
        `Headers obrigatórios não encontrados: ${missingHeaders.join(", ")}`,
      );
    }

    // Processar linhas de dados
    const vendas: VendaRede[] = [];

    for (let i = 1; i < finalLines.length; i++) {
      const line = finalLines[i].trim();
      if (!line) continue;

      const values = line.split(";").map(v => v.trim());

      // Verificar se temos valores suficientes
      if (values.length < headers.length) {
        continue;
      }

      // Criar objeto da venda
      const venda: any = {};

      headers.forEach((header, index) => {
        venda[header] = values[index] || "";
      });

      // Validar campos essenciais
      if (
        venda["data da venda"] &&
        venda["hora da venda"] &&
        venda["valor da venda original"] &&
        venda.modalidade &&
        venda.bandeira
      ) {
        vendas.push(venda as VendaRede);
      }
    }

    return vendas;
  } catch (error) {
    console.error("Erro ao fazer parse do CSV da Rede:", error);
    throw new Error(
      `Erro ao processar CSV: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    );
  }
}
