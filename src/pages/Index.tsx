import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ContractForm from "@/components/ContractForm";
import ContractPreview from "@/components/ContractPreview";
import ContractHistory from "@/components/ContractHistory";
import TemplateSelector from "@/components/TemplateSelector";
import TokenDisplay from "@/components/TokenDisplay";

import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ContractData } from "@/types/contract";
import { ContractTemplate } from "@/data/contractTemplates";
import { useContractHistory, SavedContract } from "@/hooks/use-contract-history";
import { useTokens } from "@/hooks/use-tokens";
import { Download, Pencil, Eye, Save, Shield } from "lucide-react";
import { motion } from "framer-motion";
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

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Necessário",
        description: "Você precisa entrar na sua conta para realizar esta ação.",
        variant: "default",
      });
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    action();
  };

  const validateRequiredFields = (): boolean => {
    const requiredFields = [
      { value: contractData.contractor.name, label: "Razão Social do Contratado" },
      { value: contractData.contractor.cnpj, label: "CNPJ" },
      { value: contractData.contractor.email, label: "E-mail do Contratado" },
      { value: contractData.contractor.phone, label: "Telefone do Contratado" },
      { value: contractData.contractor.address, label: "Endereço do Contratado" },
      { value: contractData.contractor.bankName, label: "Banco" },
      { value: contractData.contractor.bankAgency, label: "Agência" },
      { value: contractData.contractor.bankAccount, label: "Conta" },
      { value: contractData.contractor.pixKey, label: "Chave PIX" },
      { value: contractData.client.name, label: "Nome do Cliente" },
      { value: contractData.client.document, label: "CPF/CNPJ do Cliente" },
      { value: contractData.client.email, label: "E-mail do Cliente" },
      { value: contractData.client.phone, label: "Telefone do Cliente" },
      { value: contractData.client.address, label: "Endereço do Cliente" },
      { value: contractData.serviceDescription, label: "Descrição do Serviço" },
      { value: contractData.price > 0 ? "valid" : "", label: "Valor Total" },
      { value: contractData.paymentMethod, label: "Forma de Pagamento" },
      { value: contractData.startDate, label: "Data de Início" },
      { value: contractData.deadline, label: "Prazo de Entrega" },
    ];

    const emptyFields = requiredFields.filter(field => !field.value || field.value.trim() === "");

    if (emptyFields.length > 0) {
      const fieldsList = emptyFields.map(f => f.label).join(", ");
      toast({
        title: "Campos obrigatórios não preenchidos",
        description: `Por favor, preencha: ${fieldsList}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveContract = () => {
    if (!validateRequiredFields()) return;
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
    if (!validateRequiredFields()) return;
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
      {/* Application Navbar */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="relative h-10 w-32 md:w-40 shrink-0">
              <img src="/logo.png" alt="Logo" className="absolute top-1/2 left-0 -translate-y-1/2 h-24 md:h-28 w-auto object-contain pointer-events-none" />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <>
                  <TokenDisplay 
                    tokens={tokens}
                    dailyLimit={dailyLimit}
                  />
                  {user?.is_admin && (
                    <Button
                      onClick={() => navigate('/admin')}
                      variant="secondary"
                      className="h-9 px-4 rounded-md hidden sm:flex border border-primary/20 text-primary"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  
                  {/* Profile Dropdown or Link */}
                  <Link to="/app/configuracoes">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">
                       <span className="text-sm font-bold text-primary">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Entrar</Button>
                  </Link>
                   <Link to="/register">
                    <Button className="h-9 px-4 rounded-md shadow-lg shadow-primary/20">Criar Conta</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Re-added as requested */}
      <div className="border-b border-border/50">
        <Hero />
      </div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-10 -mt-12"
      >
        {/* Background panel to give a minimal glass effect to the main app area */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl border border-border/40 rounded-t-3xl shadow-2xl -z-10" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full relative px-2 md:px-6 pt-8 pb-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Workspace de Contratos
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">Sua mesa de trabalho digital. Crie e exporte em segundos.</p>
          </div>
          
          <TabsList className="flex items-center p-1.5 bg-secondary/80 backdrop-blur-lg rounded-xl h-auto border border-border shadow-lg">
            <TabsTrigger 
              value="edit" 
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-primary transition-all"
            >
              <Pencil className="w-4 h-4" />
              Editor Inteligente
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-primary transition-all"
            >
              <Eye className="w-4 h-4" />
              Visualização Final
            </TabsTrigger>
          </TabsList>
        </div>
          {/* Tab Content */}
          <TabsContent value="edit" className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Sidebar / History & Templates */}
              <div className="lg:col-span-4 space-y-6">
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
              </div>

              {/* Right Column: Main Form */}
              <div className="lg:col-span-8">
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-secondary/30 px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Formulário de Contrato</h2>
                  </div>
                  <div className="p-6">
                    <ContractForm data={contractData} onChange={setContractData} />
                  </div>
                  
                  {/* Sticky Action Footer */}
                  <div className="sticky bottom-0 z-10 bg-card/95 backdrop-blur-md border-t border-border p-4 flex items-center justify-end gap-3 rounded-b-xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                    <Button onClick={() => requireAuth(handleSaveContract)} variant="outline" className="h-10 px-6">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Rascunho
                    </Button>
                    <Button onClick={() => setActiveTab('preview')} className="btn-primary h-10 px-6 shadow-md shadow-primary/20">
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar Contrato
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-0">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-secondary/30 px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold">Pré-visualização do Documento</h2>
              </div>
              <div className="p-6 bg-muted/50">
                <ContractPreview ref={previewRef} data={contractData} />
              </div>
              
              {/* Sticky Action Footer for Preview */}
              <div className="sticky bottom-0 z-10 bg-card/95 backdrop-blur-md border-t border-border p-4 flex items-center justify-between gap-3 rounded-b-xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                <Button onClick={() => setActiveTab('edit')} variant="outline" className="h-10 px-6">
                  <Pencil className="w-4 h-4 mr-2" />
                  Voltar para Edição
                </Button>
                <Button 
                  onClick={() => requireAuth(generatePDF)} 
                  disabled={isGenerating} 
                  className="btn-primary h-11 px-8 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isGenerating ? "Gerando PDF..." : "Exportar Contrato em PDF"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.main>

      <Footer />
    </div>
  );
};

export default Index;
