import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractForm from "@/components/ContractForm";
import ContractPreview from "@/components/ContractPreview";
import { ContractData } from "@/types/contract";
import { Download, FileText, Edit, Eye } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "@/hooks/use-toast";

const initialData: ContractData = {
  client: {
    name: "",
    document: "",
    email: "",
    phone: "",
    address: "",
  },
  price: 0,
  paymentMethod: "",
  deadline: "",
  startDate: "",
  serviceDescription: "",
  additionalClauses: [],
  logo: null,
};

const Index = () => {
  const [contractData, setContractData] = useState<ContractData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const previewRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    setActiveTab("preview");
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!previewRef.current) return;

    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      pdf.addImage(imgData, "PNG", imgX, 0, imgWidth * ratio, imgHeight * ratio);

      const clientName = contractData.client.name || "contrato";
      const fileName = `${clientName.replace(/\s+/g, "_")}_contrato.pdf`;
      
      pdf.save(fileName);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: `O arquivo ${fileName} foi baixado.`,
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero text-primary-foreground py-8 md:py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Gerador de Contratos
            </h1>
          </div>
          <p className="text-center text-primary-foreground/80 max-w-2xl mx-auto">
            Crie contratos profissionais em minutos. Preencha os dados, visualize
            o resultado e exporte em PDF.
          </p>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Editar
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Visualizar
              </TabsTrigger>
            </TabsList>
            
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              className="gradient-primary hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? "Gerando..." : "Baixar PDF"}
            </Button>
          </div>

          <TabsContent value="edit" className="animate-fade-in">
            <ContractForm data={contractData} onChange={setContractData} />
          </TabsContent>

          <TabsContent value="preview" className="animate-fade-in">
            <ContractPreview ref={previewRef} data={contractData} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="container max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Gerador de Contratos Online © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
