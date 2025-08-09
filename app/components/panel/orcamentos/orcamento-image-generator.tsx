import { toPng } from "html-to-image";
import { Copy, Download, Image as ImageIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Orcamento } from "~/models/types";

import { OrcamentoImageTemplate } from "./orcamento-image-template";

interface OrcamentoImageGeneratorProps {
  orcamento: Orcamento;
  onClose?: () => void;
}

export function OrcamentoImageGenerator({
  orcamento,
  onClose,
}: OrcamentoImageGeneratorProps) {
  const templateRef = useRef<HTMLDivElement>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Função para gerar a imagem
  const generateImage = useCallback(async () => {
    if (!templateRef.current) return;

    setIsGenerating(true);

    try {
      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = await toPng(templateRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      setImageDataUrl(dataUrl);
      toast.success("Imagem pronta para baixar!");
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast.error("Erro ao gerar imagem");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    // Pequeno delay para garantir que o DOM foi renderizado
    const timer = setTimeout(() => {
      generateImage();
    }, 100);
    return () => clearTimeout(timer);
  }, [orcamento, generateImage]);

  const handleDownload = useCallback(() => {
    if (!imageDataUrl) return;

    try {
      const link = document.createElement("a");
      link.download = `orcamento-${orcamento.codigo}.png`;
      link.href = imageDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Imagem baixada com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar imagem:", error);
      toast.error("Erro ao baixar imagem");
    }
  }, [imageDataUrl, orcamento.codigo]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!imageDataUrl) return;

    // Verificar se clipboard API está disponível
    if (!navigator.clipboard || !navigator.clipboard.write) {
      toast.error("Clipboard não suportado neste navegador");
      return;
    }

    try {
      const response = await fetch(imageDataUrl);
      if (!response.ok) throw new Error("Falha ao processar imagem");

      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      toast.success("Imagem copiada para área de transferência!");
    } catch (error) {
      console.error("Erro ao copiar imagem:", error);
      toast.error("Erro ao copiar imagem. Tente fazer o download.");
    }
  }, [imageDataUrl]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Imagem do Orçamento #{orcamento.codigo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status da geração */}
        {isGenerating && (
          <div className="py-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Preparando imagem para baixar...
            </div>
          </div>
        )}
        {imageDataUrl && !isGenerating && (
          <div className="mb-4 flex justify-center gap-2">
            <Button
              onClick={handleDownload}
              disabled={isGenerating || !imageDataUrl}
              className="max-w-xs flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Imagem
            </Button>

            <Button
              onClick={handleCopyToClipboard}
              disabled={isGenerating || !imageDataUrl}
              variant="outline"
              className="max-w-xs flex-1"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>
          </div>
        )}
        {/* Template HTML que será convertido para imagem */}
        <div className="mb-4 flex justify-center">
          <div ref={templateRef}>
            <OrcamentoImageTemplate orcamento={orcamento} />
          </div>
        </div>

        {onClose && (
          <div className="flex justify-center">
            <Button onClick={onClose} variant="ghost">
              Fechar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
