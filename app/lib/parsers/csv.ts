// Alternativa leve ao papaparse para parsing de CSV
export interface CSVParseOptions {
  header?: boolean;
  skipEmptyLines?: boolean;
  delimiter?: string;
}

export interface CSVParseResult<T = any> {
  data: T[];
  errors: string[];
  meta: {
    fields?: string[];
    lineCount: number;
  };
}

// Função para normalizar CSV da Rede que vem em formato especial
function normalizeRedeCSV(csvText: string): string {
  // Se o CSV tem apenas uma linha muito longa, precisamos quebrar corretamente
  if (csvText.split("\n").length <= 2) {
    // Procurar por padrões de data para quebrar as linhas
    const datePattern = /(\d{2}\/\d{2}\/\d{4})/g;
    let normalized = csvText;

    // Substituir padrões de data por quebra de linha + data (exceto a primeira)
    let isFirst = true;
    normalized = normalized.replace(datePattern, match => {
      if (isFirst) {
        isFirst = false;
        return match;
      }
      return "\n" + match;
    });

    return normalized;
  }

  return csvText;
}

export function parseCSV<T = any>(
  csvText: string,
  options: CSVParseOptions = {},
): CSVParseResult<T> {
  const {
    header = true,
    skipEmptyLines = true,
    delimiter = ";", // Mudado para ponto e vírgula como padrão
  } = options;

  const errors: string[] = [];

  // Normalizar o CSV da Rede se necessário
  const normalizedCSV = normalizeRedeCSV(csvText);
  const lines = normalizedCSV.split("\n");

  if (lines.length === 0) {
    return { data: [], errors: ["Arquivo CSV vazio"], meta: { lineCount: 0 } };
  }

  // Filtrar linhas vazias se necessário
  const filteredLines = skipEmptyLines
    ? lines.filter(line => line.trim().length > 0)
    : lines;

  if (filteredLines.length === 0) {
    return {
      data: [],
      errors: ["Nenhuma linha válida encontrada"],
      meta: { lineCount: 0 },
    };
  }

  // Função para fazer parse de uma linha CSV (lida com aspas e delimitadores)
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result.filter(item => item !== ""); // Remove campos vazios
  };

  try {
    const headers = header ? parseLine(filteredLines[0]) : [];
    const dataLines = header ? filteredLines.slice(1) : filteredLines;

    const data: T[] = dataLines
      .map((line, index) => {
        try {
          const values = parseLine(line);

          if (header) {
            // Criar objeto com headers como chaves
            const obj: any = {};
            headers.forEach((header, i) => {
              obj[header] = values[i] || "";
            });
            return obj as T;
          } else {
            // Retornar array de valores
            return values as unknown as T;
          }
        } catch (error) {
          errors.push(`Erro na linha ${index + 1}: ${error}`);
          return null;
        }
      })
      .filter(Boolean) as T[];

    return {
      data,
      errors,
      meta: {
        fields: header ? headers : undefined,
        lineCount: filteredLines.length,
      },
    };
  } catch (error) {
    return {
      data: [],
      errors: [`Erro ao processar CSV: ${error}`],
      meta: { lineCount: filteredLines.length },
    };
  }
}

// Função helper para ler arquivo como texto
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      const result = event.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Erro ao ler arquivo"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler arquivo"));
    };

    reader.readAsText(file, "UTF-8");
  });
}
