import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractForm from "@/components/ContractForm";
import ContractPreview from "@/components/ContractPreview";
import ContractHistory from "@/components/ContractHistory";
import TemplateSelector from "@/components/TemplateSelector";
import TokenDisplay from "@/components/TokenDisplay";
import PricingModal from "@/components/PricingModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ContractData } from "@/types/contract";
import { ContractTemplate } from "@/data/contractTemplates";
import { useContractHistory, SavedContract } from "@/hooks/use-contract-history";
import { useTokens } from "@/hooks/use-tokens";
import { Download, Pencil, Eye, Save } from "lucide-react";
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
  clientSignature: null,
  contractorSignature: null,
};

const Index = () => {
  const [contractData, setContractData] = useState<ContractData>(initialData);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const previewRef = useRef<HTMLDivElement>(null);
  const { savedContracts, saveContract, deleteContract, clearHistory } = useContractHistory();
  const { 
    tokens,
    dailyLimit,
    showPricingModal, 
    pendingAction,
    consumeTokens, 
    upgradePlan, 
    closePricingModal,
    setShowPricingModal 
  } = useTokens();

  const handleSaveContract = () => {
    if (!consumeTokens("save-contract")) return;
    
    const saved = saveContract(contractData);
    toast({
      title: "Contrato salvo",
      description: `"${saved.name}" foi adicionado ao histórico.`,
    });
  };

  const handleLoadContract = (contract: SavedContract) => {
    if (!consumeTokens("load-contract")) return;
    
    setContractData(contract.data);
    toast({
      title: "Contrato carregado",
      description: `"${contract.name}" foi restaurado.`,
    });
  };

  const handleDeleteContract = (id: string) => {
    deleteContract(id);
    toast({
      title: "Contrato removido",
      description: "O contrato foi excluído do histórico.",
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "Histórico limpo",
      description: "Todos os contratos foram removidos.",
    });
  };

  const handleSelectTemplate = (template: ContractTemplate) => {
    if (selectedTemplateId === template.id) {
      setSelectedTemplateId(undefined);
      setContractData((prev) => ({
        ...prev,
        serviceDescription: "",
        additionalClauses: [],
      }));
      toast({
        title: "Modelo removido",
        description: "As cláusulas automáticas foram removidas.",
      });
      return;
    }

    if (!consumeTokens("apply-template")) return;

    setSelectedTemplateId(template.id);
    setContractData((prev) => ({
      ...prev,
      serviceDescription: template.defaultServiceDescription,
      additionalClauses: [...template.clauses],
    }));
    toast({
      title: "Modelo aplicado",
      description: `${template.clauses.length} cláusulas adicionadas.`,
    });
  };

  const handleUpgradePlan = (plan: import("@/hooks/use-tokens").PlanType) => {
    upgradePlan(plan);
    toast({
      title: "Plano atualizado!",
      description: `Seu plano foi atualizado com sucesso. Tokens resetam diariamente às 00:00.`,
    });
  };

  const generatePDF = async () => {
    if (!consumeTokens("export-pdf")) return;
    
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
        title: "PDF gerado",
        description: `Arquivo ${fileName} baixado. (-10 tokens)`,
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PricingModal
        open={showPricingModal}
        onClose={closePricingModal}
        onSelectPlan={handleUpgradePlan}
        pendingAction={pendingAction}
        currentTokens={tokens}
      />
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-20 md:h-20 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <TokenDisplay 
                tokens={tokens}
                dailyLimit={dailyLimit}
                onBuyTokens={() => setShowPricingModal(true)} 
              />
              <ThemeToggle />
              <Button
                onClick={handleSaveContract}
                variant="outline"
                className="h-9 px-4 rounded-md"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className="btn-primary h-9 px-4 rounded-md"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Gerando..." : "Exportar PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative border-b border-border bg-background overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/8 via-primary/4 to-transparent rounded-full blur-3xl" />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-10" />
        </div>

        <div className="max-w-5xl mx-auto px-6 py-20 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="text-xs font-medium text-foreground">Plataforma Profissional</span>
              </div>

              {/* Title with Gradient Accent */}
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                <span className="text-foreground">Crie contratos </span>
                <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  profissionais
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Preencha os dados, escolha um modelo e exporte em PDF. 
                Simples, rápido e sem complicações.
              </p>

              {/* Features List with Icons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { text: "Modelos prontos", icon: "📄" },
                  { text: "Exportação PDF", icon: "⬇️" },
                  { text: "Assinatura digital", icon: "✍️" },
                  { text: "100% seguro", icon: "🔒" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <div className="w-6 h-6 rounded-md bg-primary/5 flex items-center justify-center text-xs group-hover:bg-primary/10 transition-colors">
                      {feature.icon}
                    </div>
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Enhanced Stats */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              {/* Stat Card 1 */}
              <div className="p-6 rounded-lg border border-border bg-gradient-to-br from-card to-card/50 hover:border-foreground/20 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl font-semibold text-foreground group-hover:scale-105 transition-transform">99%</div>
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>

              {/* Stat Card 2 */}
              <div className="p-6 rounded-lg border border-border bg-gradient-to-br from-card to-card/50 hover:border-foreground/20 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl font-semibold text-foreground group-hover:scale-105 transition-transform">5min</div>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500/50" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Tempo Médio</div>
              </div>

              {/* Feature Card */}
              <div className="p-6 rounded-lg border border-border bg-gradient-to-br from-card to-card/50 hover:border-foreground/20 hover:shadow-lg transition-all col-span-2 group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Download className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground mb-0.5">Exportação Rápida</div>
                    <div className="text-sm text-muted-foreground">PDF profissional em segundos</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Controls */}
          <TabsList className="flex items-center gap-1 p-1 bg-secondary rounded-lg w-fit mb-8 h-auto">
            <TabsTrigger 
              value="edit" 
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-minimal transition-all"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-minimal transition-all"
            >
              <Eye className="w-4 h-4" />
              Visualizar
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="edit" className="animate-in space-y-6 mt-0">
            <ContractHistory
              contracts={savedContracts}
              onLoad={handleLoadContract}
              onDelete={handleDeleteContract}
              onClearAll={handleClearHistory}
            />
            <TemplateSelector 
              onSelectTemplate={handleSelectTemplate} 
              selectedTemplateId={selectedTemplateId} 
            />
            <ContractForm data={contractData} onChange={setContractData} />
          </TabsContent>

          <TabsContent value="preview" className="animate-in mt-0">
            <ContractPreview ref={previewRef} data={contractData} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="h-14 md:h-16 w-auto object-contain" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Crie contratos profissionais de forma rápida e simples. 
                Personalize, assine e exporte em PDF.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Modelos pré-configurados
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Validação de CPF/CNPJ
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Assinatura digital
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Exportação em PDF
                </li>
              </ul>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Informações</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Dados salvos localmente
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Histórico de contratos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Tema claro e escuro
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Contratos. Todos os direitos reservados.</span>
              <span className="text-xs">Feito com dedicação para simplificar sua rotina.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
