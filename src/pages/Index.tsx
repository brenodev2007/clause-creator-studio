import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractForm from "@/components/ContractForm";
import ContractPreview from "@/components/ContractPreview";
import TemplateSelector from "@/components/TemplateSelector";
import { ContractData } from "@/types/contract";
import { ContractTemplate } from "@/data/contractTemplates";
import { Download, FileText, Edit, Eye, Sparkles, CheckCircle2 } from "lucide-react";
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
  contractor: {
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    address: "",
    bankName: "",
    bankAgency: "",
    bankAccount: "",
    pixKey: "",
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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const previewRef = useRef<HTMLDivElement>(null);

  const handleSelectTemplate = (template: ContractTemplate) => {
    setSelectedTemplateId(template.id);
    setContractData((prev) => ({
      ...prev,
      serviceDescription: template.defaultServiceDescription,
      additionalClauses: [...template.clauses],
    }));
    toast({
      title: `Modelo "${template.name}" aplicado!`,
      description: `${template.clauses.length} cláusulas foram adicionadas automaticamente.`,
    });
  };

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

  const features = [
    "Modelos prontos para uso",
    "Exportação em PDF",
    "Dados bancários inclusos",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="gradient-hero text-primary-foreground relative">
        <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Ferramenta Profissional</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-6 animate-slide-up">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                <FileText className="w-10 h-10 md:w-12 md:h-12" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
                Gerador de Contratos
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Crie contratos profissionais em minutos. Preencha os dados, 
              escolha um modelo e exporte em PDF.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="absolute bottom-0 w-full h-full"
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,156.63,69.08,321.39,56.44Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8 md:py-12 -mt-4 relative z-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-4 bg-card rounded-2xl shadow-soft">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-secondary/50 p-1 rounded-xl">
              <TabsTrigger 
                value="edit" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-soft px-6 py-3 font-medium transition-all"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-soft px-6 py-3 font-medium transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Visualizar</span>
              </TabsTrigger>
            </TabsList>
            
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              size="lg"
              className="btn-premium text-white font-semibold px-8 py-6 rounded-xl shadow-glow hover:shadow-strong transition-all duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              {isGenerating ? "Gerando..." : "Baixar PDF"}
            </Button>
          </div>

          {/* Tab Content */}
          <TabsContent value="edit" className="animate-fade-in space-y-6 mt-0">
            <TemplateSelector 
              onSelectTemplate={handleSelectTemplate} 
              selectedTemplateId={selectedTemplateId} 
            />
            <ContractForm data={contractData} onChange={setContractData} />
          </TabsContent>

          <TabsContent value="preview" className="animate-fade-in mt-0">
            <ContractPreview ref={previewRef} data={contractData} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16 bg-card/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg font-semibold">Contract Generator</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Gerador de Contratos Online. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
