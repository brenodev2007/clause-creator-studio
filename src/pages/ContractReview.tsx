import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Link as LinkIcon, Edit3, Trash2, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Signer {
  id: string;
  name: string;
  email: string;
  signedAt?: string;
}

interface ContractData {
  id: string;
  title?: string;
  name?: string;
  content?: string;
  status?: string;
  updatedAt?: string;
  signers?: Signer[];
}

export default function ContractReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [contract, setContract] = useState<ContractData | null>(null);
  const [email, setEmail] = useState("");
  const [signers, setSigners] = useState<Signer[]>([]);
  const [useOrder, setUseOrder] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('zelo_saved_contracts');
    if (saved && id) {
      const contracts: ContractData[] = JSON.parse(saved);
      const found = contracts.find(c => c.id === id);
      if (found) {
        setContract(found);
        setSigners(found.signers || []);
      }
    }
  }, [id]);

  const updateContractInStorage = (updates: Partial<ContractData>) => {
    const saved = localStorage.getItem('zelo_saved_contracts');
    if (!saved || !id) return;
    const contracts: ContractData[] = JSON.parse(saved);
    const idx = contracts.findIndex(c => c.id === id);
    if (idx >= 0) {
      contracts[idx] = { ...contracts[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('zelo_saved_contracts', JSON.stringify(contracts));
      setContract(contracts[idx]);
    }
  };

  const handleAddSigner = () => {
    if (!email || !email.includes('@')) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    if (signers.some(s => s.email === email)) {
      toast.error("Este signatário já foi adicionado.");
      return;
    }

    const namePart = email.split('@')[0];
    const mockName = namePart.split(/[.\-_]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    const newSigner: Signer = {
      id: crypto.randomUUID(),
      name: mockName,
      email: email.trim()
    };

    const updated = [...signers, newSigner];
    setSigners(updated);
    setEmail("");
  };

  const handleRemoveSigner = (signerId: string) => {
    const updated = signers.filter(s => s.id !== signerId);
    setSigners(updated);
  };

  const handleSendToSignature = () => {
    if (signers.length === 0) {
      toast.error("Adicione pelo menos um signatário para enviar.");
      return;
    }
    
    // Save signers and change status to Pendente
    updateContractInStorage({ 
      status: 'Pendente', 
      signers: signers 
    });
    
    toast.success(`Contrato enviado para ${signers.length} signatário(s)!`);
    setTimeout(() => {
      navigate('/app/contratos');
    }, 1200);
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) {
      toast.error("Não foi possível gerar o PDF. Tente novamente.");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const element = previewRef.current;
      
      // Scroll to top to ensure capture starts from the beginning
      window.scrollTo(0, 0);

      // Force a fixed width so the capture is consistent regardless of screen size
      const originalWidth = element.style.width;
      const originalHeight = element.style.height;
      element.style.width = '794px'; // A4 at 96dpi = 794px

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Restore original styles
      element.style.width = originalWidth;
      element.style.height = originalHeight;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      // Scale image to fit A4 width
      const imgWidthMm = pdfWidth;
      const imgHeightMm = (canvas.height * pdfWidth) / canvas.width;

      // If content fits in one page, simple case
      if (imgHeightMm <= pdfHeight) {
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, imgWidthMm, imgHeightMm);
      } else {
        // Multi-page: slice the canvas into page-sized chunks
        const pageHeightPx = (pdfHeight / pdfWidth) * canvas.width;
        let position = 0;
        let pageNum = 0;

        while (position < canvas.height) {
          const sliceHeight = Math.min(pageHeightPx, canvas.height - position);

          // Create a canvas slice for this page
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;
          const ctx = pageCanvas.getContext("2d");
          
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0, position, canvas.width, sliceHeight,
              0, 0, canvas.width, sliceHeight
            );

            if (pageNum > 0) pdf.addPage();

            const sliceHeightMm = (sliceHeight * pdfWidth) / canvas.width;
            pdf.addImage(
              pageCanvas.toDataURL("image/jpeg", 0.95),
              "JPEG",
              0, 0,
              imgWidthMm,
              sliceHeightMm
            );
          }

          position += sliceHeight;
          pageNum++;
        }
      }

      const fileName = `${(contract?.title || 'contrato').replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

      toast.success(`PDF "${fileName}" baixado com sucesso!`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Contrato não encontrado</p>
          <p className="text-sm mt-1">Este contrato pode ter sido excluído.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/app/contratos')}>
            Voltar para Contratos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-8">
          {/* Left side: PDF Preview */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <Link to={`/app/editor/${id || 'novo'}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit mb-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar para Edição
              </Link>
              <h1 className="text-2xl font-bold text-foreground">{contract.title || "Revisão do Contrato"}</h1>
              <p className="text-sm text-muted-foreground mt-1">Revise o documento, adicione signatários ou baixe em PDF.</p>
            </div>
            
            {/* Real Contract Preview (A4-like) */}
            <div className="bg-secondary/30 p-4 md:p-12 rounded-2xl border border-border shadow-inner flex justify-center overflow-hidden">
              <div 
                className="relative bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm origin-top transition-transform duration-300"
                style={{ 
                  transform: typeof window !== 'undefined' && window.innerWidth < 1000 ? `scale(${(window.innerWidth - 100) / 794})` : 'scale(1)',
                }}
              >
                <div 
                  ref={previewRef}
                  className="bg-white text-black"
                  style={{ 
                    width: '794px',
                    minHeight: '1123px',
                    padding: '80px 90px',
                    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
                    fontSize: '14px',
                    lineHeight: '1.6',
                    backgroundColor: '#ffffff',
                    color: '#1a1a1a',
                  }}
                >
                  {contract.content ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: `
                        <style>
                          .pdf-content { font-family: 'Times New Roman', serif; }
                          .pdf-content h1 { font-size: 26px; font-weight: bold; margin-bottom: 24px; text-align: center; color: #000; text-transform: uppercase; letter-spacing: 1px; }
                          .pdf-content h2 { font-size: 18px; font-weight: bold; margin-top: 32px; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
                          .pdf-content p { margin-bottom: 16px; text-align: justify; line-height: 1.8; }
                          .pdf-content ul, .pdf-content ol { margin-left: 24px; margin-bottom: 16px; }
                          .pdf-content li { margin-bottom: 8px; text-align: justify; }
                          .pdf-content strong { font-weight: bold; color: #000; }
                          .pdf-content .variable { background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-weight: 500; font-family: monospace; color: #475569; }
                          .pdf-content img { max-width: 100%; height: auto; margin: 20px auto; display: block; }
                        </style>
                        <div class="pdf-content">${contract.content}</div>
                      ` }} 
                      style={{ 
                        color: '#1a1a1a',
                        wordBreak: 'break-word',
                      }}
                    />
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>Nenhum conteúdo disponível para visualização.</p>
                  )}

                  {/* Signature area */}
                  {signers.length > 0 && (
                    <div style={{ marginTop: '100px', paddingTop: '40px', borderTop: '2px solid #f1f5f9' }}>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '60px', textAlign: 'center', fontStyle: 'italic' }}>
                        Documento assinado digitalmente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px 40px' }}>
                        {signers.map((signer) => (
                          <div key={signer.id} style={{ textAlign: 'center' }}>
                            <div style={{ borderTop: '1px solid #000', paddingTop: '12px', marginTop: '40px' }}>
                              <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#000' }}>{signer.name}</p>
                              <p style={{ fontSize: '12px', color: '#64748b' }}>{signer.email}</p>
                              <div style={{ marginTop: '8px', fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                                Autenticado via ZELO Digital
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Actions panel */}
          <div className="w-full lg:w-80 shrink-0 space-y-6 pt-14">
            <Button 
              onClick={handleDownloadPDF} 
              disabled={isGeneratingPDF}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-14 text-lg rounded-xl shadow-lg shadow-primary/20"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Baixar em PDF
                </>
              )}
            </Button>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4">Assinatura Digital</h3>
              
              <div className="space-y-4">
                <Input 
                  placeholder="Adicionar e-mail do signatário" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSigner()}
                  className="h-12 text-base border-border/80"
                />
                <Button 
                  onClick={handleAddSigner}
                  variant="outline" 
                  className="w-full border-border/80 text-foreground hover:bg-accent h-12"
                >
                  Adicionar Signatário
                </Button>
                
                {signers.length > 0 && (
                  <div className="space-y-3 mt-4 max-h-48 overflow-y-auto pr-1">
                    {signers.map((signer, index) => (
                      <div key={signer.id} className="bg-muted border border-border rounded-lg p-3 relative group">
                        <p className="font-bold text-foreground text-sm truncate pr-6">{signer.name}</p>
                        <p className="font-normal text-muted-foreground text-xs truncate">{signer.email}</p>
                        <p className="text-xs mt-1 flex items-center gap-1">
                          {signer.signedAt ? (
                            <span className="text-green-500 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Assinado
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Assinante {index + 1} • Aguardando
                            </span>
                          )}
                        </p>
                        <button 
                          onClick={() => handleRemoveSigner(signer.id)}
                          className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remover signatário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2 pb-2">
                  <Checkbox 
                    id="order" 
                    checked={useOrder}
                    onCheckedChange={(checked) => setUseOrder(checked as boolean)}
                    className="border-primary data-[state=checked]:bg-primary" 
                  />
                  <label
                    htmlFor="order"
                    className="text-sm font-semibold leading-none cursor-pointer text-foreground"
                  >
                    Definir ordem de assinatura
                  </label>
                </div>

                <Button 
                  onClick={handleSendToSignature}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-12 rounded-lg"
                  disabled={signers.length === 0}
                >
                  Enviar para Assinatura
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex gap-4 cursor-pointer group" onClick={() => {
                const shareUrl = `${window.location.origin}/app/revisao/${id}`;
                navigator.clipboard.writeText(shareUrl);
                toast.success("Link copiado para a área de transferência!");
              }}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <LinkIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Compartilhar por Link</h4>
                  <p className="text-sm text-muted-foreground mt-1">Gere um link para revisão externa do documento.</p>
                </div>
              </div>
              
              <div className="flex gap-4 cursor-pointer group" onClick={() => navigate(`/app/editor/${id}`)}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Edit3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Voltar ao Editor</h4>
                  <p className="text-sm text-muted-foreground mt-1">Faça alterações no conteúdo do documento.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
