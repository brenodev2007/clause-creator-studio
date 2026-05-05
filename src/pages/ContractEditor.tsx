import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search, Folder, ChevronDown, ChevronRight, FileText, User, PanelLeftClose, PanelLeftOpen, LibraryBig } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { ImagePlus } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, Cloud, Loader2, Trash2 } from "lucide-react";

const initialContent = `
<h2>CLÁUSULA 1: OBJETO DO CONTRATO.</h2>
<p>O presente contrato tem por objeto a prestação de serviços de ....................................................................................., mediante emissão de nota fiscal, no valor de R$ <span style="background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px;">[Valor]</span> (reais).</p>
<br/>
<div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px;">
<p><strong>[Cláusula de Pagamento e Faturamento]</strong></p>
<p>O pagamento será realizado mensalmente, até o dia 5 (cinco) de cada mês, mediante emissão de nota fiscal, no valor de R$ <span style="background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px;">[Valor]</span> (reais).</p>
</div>
<br/>
<h2>CLÁUSULA 2: PRAZO.</h2>
<p>O contrato terá vigência de 12 (doze) meses, iniciando-se em .....................................................................................</p>
`;

export default function ContractEditor() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("");
  const [customClauses, setCustomClauses] = useState<{category: string, title: string, content: string}[]>([]);
  const { id } = useParams();

  const clauseLibrary = useMemo(() => {
    const base: Record<string, {title: string, content: string}[]> = {
      "Foro e Jurisdição": [
        { title: "Foro Padrão (São Paulo)", content: "<p><strong>[Foro de Eleição]</strong></p><p>Fica eleito o foro da comarca da Capital do Estado de São Paulo para dirimir quaisquer dúvidas originárias deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.</p>" },
        { title: "Foro - Cláusula Arbitral", content: "<p><strong>[Cláusula Arbitral]</strong></p><p>Qualquer litígio ou controvérsia decorrente deste contrato será resolvido por arbitragem, administrada pela Câmara de Mediação e Arbitragem, de acordo com suas regras.</p>" }
      ],
      "Rescisão Contratual": [
        { title: "Aviso Prévio 30 Dias", content: "<p><strong>[Cláusula de Aviso Prévio]</strong></p><p>Qualquer das partes poderá rescindir o contrato mediante notificação prévia de 30 (trinta) dias, por escrito.</p>" },
        { title: "Rescisão Imediata (Quebra de Sigilo)", content: "<p><strong>[Rescisão Imediata]</strong></p><p>Em caso de quebra de sigilo ou violação de confidencialidade, o contrato será rescindido imediatamente, sem prejuízo de perdas e danos.</p>" },
        { title: "Multa por Rescisão Antecipada", content: "<p><strong>[Multa Rescisória]</strong></p><p>A rescisão imotivada antes do término do prazo implicará no pagamento de multa equivalente a 20% sobre o saldo devedor do contrato.</p>" }
      ],
      "Pagamento e Faturamento": [
        { title: "Pagamento Mensal", content: "<p><strong>[Pagamento Mensal]</strong></p><p>O pagamento será realizado mensalmente, até o dia 5 (cinco) de cada mês, mediante emissão de nota fiscal.</p>" },
        { title: "Pagamento por Marcos", content: "<p><strong>[Pagamento por Marcos de Entrega]</strong></p><p>O pagamento será efetuado conforme a entrega e aprovação dos marcos definidos no anexo, com faturamento em até 10 dias úteis após a aprovação.</p>" },
        { title: "Juros e Correção", content: "<p><strong>[Atraso no Pagamento]</strong></p><p>O atraso no pagamento acarretará multa de 2% (dois por cento) e juros moratórios de 1% (um por cento) ao mês, pro rata die.</p>" }
      ],
      "Confidencialidade": [
        { title: "Confidencialidade Padrão", content: "<p><strong>[Confidencialidade]</strong></p><p>As partes obrigam-se a manter absoluto sigilo sobre as informações trocadas durante a execução deste contrato, por um período de 5 (cinco) anos após seu término.</p>" },
        { title: "Devolução de Informações", content: "<p><strong>[Devolução de Materiais]</strong></p><p>Ao término do contrato, a parte receptora deverá devolver ou destruir, sob comprovação, todos os materiais e documentos confidenciais recebidos.</p>" }
      ],
      "Objeto do Contrato": [
        { title: "Prestação de Serviços Genérica", content: "<p><strong>[Objeto]</strong></p><p>O presente contrato tem por objeto a prestação de serviços de <span style=\"background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px;\">[Descrição do Serviço]</span>, conforme detalhado no Anexo I.</p>" },
        { title: "Licenciamento de Software", content: "<p><strong>[Objeto]</strong></p><p>O objeto deste contrato é a concessão de licença de uso, em caráter não exclusivo e intransferível, do software <span style=\"background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px;\">[Nome do Software]</span>.</p>" }
      ]
    };

    const combined: Record<string, {title: string, content: string}[]> = { ...base };
    
    customClauses.forEach(clause => {
      if (!combined[clause.category]) {
        combined[clause.category] = [];
      }
      combined[clause.category].push({ title: clause.title, content: clause.content });
    });

    return combined;
  }, [customClauses]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Comece a digitar o seu contrato...',
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px]',
      },
    },
  });

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          editor?.chain().focus().setImage({ src: event.target.result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const insertClause = (clauseText: string) => {
    editor?.chain().focus().insertContent(`
      <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
        ${clauseText}
      </div>
    `).run();
  };

  useEffect(() => {
    const saved = localStorage.getItem('zelo_saved_clauses');
    if (saved) {
      setCustomClauses(JSON.parse(saved));
    }
  }, []);

  // Load contract content
  useEffect(() => {
    if (editor && id && id !== 'novo') {
      const saved = localStorage.getItem('zelo_saved_contracts');
      if (saved) {
        const contracts = JSON.parse(saved);
        const contract = contracts.find((c: any) => c.id === id);
        if (contract && contract.content) {
          editor.commands.setContent(contract.content);
        }
      }
    }
  }, [id, editor]);

  // Auto-save logic
  useEffect(() => {
    if (!editor || !id) return;

    const timer = setTimeout(() => {
      const htmlContent = editor.getHTML();
      
      // Don't auto-save if it's the initial dummy content or empty
      if (id === 'novo' && (htmlContent.length < 50)) return;

      const saved = localStorage.getItem('zelo_saved_contracts');
      const contracts = saved ? JSON.parse(saved) : [];
      
      let currentId = id;
      let shouldNavigate = false;

      if (id === 'novo') {
        setIsSaving(true);
        currentId = crypto.randomUUID();
        shouldNavigate = true;
        const newContract = {
          id: currentId,
          title: `Contrato - ${new Date().toLocaleDateString('pt-BR')}`,
          content: htmlContent,
          status: 'Rascunho',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        contracts.unshift(newContract);
        localStorage.setItem('zelo_saved_contracts', JSON.stringify(contracts));
      } else {
        const idx = contracts.findIndex((c: any) => c.id === id);
        if (idx >= 0 && contracts[idx].content !== htmlContent) {
          setIsSaving(true);
          contracts[idx] = {
            ...contracts[idx],
            content: htmlContent,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem('zelo_saved_contracts', JSON.stringify(contracts));
        } else {
          return; // No changes to save
        }
      }
      
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        if (shouldNavigate) {
          navigate(`/app/editor/${currentId}`, { replace: true });
        }
      }, 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, [editor?.getHTML(), id]);



  const handleSaveDraft = () => {
    if (!editor) return;
    const htmlContent = editor.getHTML();
    const now = new Date().toISOString();
    const newDraft = {
      id: crypto.randomUUID(),
      title: `Rascunho - ${new Date().toLocaleDateString('pt-BR')}`,
      content: htmlContent,
      status: 'Rascunho',
      createdAt: now,
      updatedAt: now,
    };
    
    const saved = localStorage.getItem('zelo_saved_contracts');
    const existingContracts = saved ? JSON.parse(saved) : [];
    
    localStorage.setItem('zelo_saved_contracts', JSON.stringify([newDraft, ...existingContracts]));
    toast.success("Rascunho salvo com sucesso!");
  };

  const handleSaveTemplate = () => {
    if (!editor) return;
    const htmlContent = editor.getHTML();
    const newTemplate = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name: `Modelo Personalizado - ${new Date().toLocaleDateString()}`,
      content: htmlContent,
      type: 'template'
    };
    
    const saved = localStorage.getItem('zelo_saved_templates');
    const existingTemplates = saved ? JSON.parse(saved) : [];
    
    localStorage.setItem('zelo_saved_templates', JSON.stringify([newTemplate, ...existingTemplates]));
    toast.success("Modelo salvo com sucesso na sua galeria!");
  };

  const handleAdvanceToReview = () => {
    if (!editor) return;
    const htmlContent = editor.getHTML();
    const now = new Date().toISOString();
    
    const saved = localStorage.getItem('zelo_saved_contracts');
    const existingContracts: any[] = saved ? JSON.parse(saved) : [];
    
    // Check if we're editing an existing contract (from URL params)
    const urlId = window.location.pathname.split('/editor/')[1];
    const existingIndex = existingContracts.findIndex((c: any) => c.id === urlId);
    
    let contractId: string;
    
    if (existingIndex >= 0) {
      // Update existing
      existingContracts[existingIndex] = {
        ...existingContracts[existingIndex],
        content: htmlContent,
        updatedAt: now,
      };
      contractId = existingContracts[existingIndex].id;
    } else {
      // Create new
      contractId = crypto.randomUUID();
      existingContracts.unshift({
        id: contractId,
        title: `Contrato - ${new Date().toLocaleDateString('pt-BR')}`,
        content: htmlContent,
        status: 'Rascunho',
        createdAt: now,
        updatedAt: now,
      });
    }
    
    localStorage.setItem('zelo_saved_contracts', JSON.stringify(existingContracts));
    navigate(`/app/revisao/${contractId}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Clause Library */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 320 : 80 }} // 320 = w-80, 80 = w-20
        className="bg-card border-r border-border flex flex-col h-full shrink-0 relative overflow-hidden group"
      >
        <div className={`p-6 bg-muted text-foreground rounded-tr-3xl rounded-br-3xl mr-4 my-4 transition-all duration-300 flex flex-col ${isSidebarOpen ? '' : 'items-center px-2 mr-2'}`}>
          <div className="flex items-center gap-2 mb-4 whitespace-nowrap min-h-[28px]">
            {!isSidebarOpen ? (
               <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors mt-2" title="Abrir Biblioteca">
                  <LibraryBig className="w-5 h-5" />
               </button>
            ) : (
               <h2 className="text-lg font-bold">Biblioteca de Cláusulas</h2>
            )}
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                <Input 
                  placeholder="Buscar" 
                  className="pl-9 bg-card text-foreground border-none h-10"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-[250px]">
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(clauseLibrary).map(([category, clauses]) => (
                    <AccordionItem key={category} value={category} className="border-none">
                      <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-md hover:bg-accent font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4 shrink-0" />
                          <span className="truncate">{category}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-2 pt-2 pb-4">
                        {clauses.map((clause) => (
                          <button 
                            key={clause.title}
                            onClick={() => insertClause(clause.content)}
                            className="text-left px-4 py-2 text-sm text-muted-foreground bg-secondary hover:bg-primary/10 hover:text-primary rounded-md transition-colors flex items-center gap-2 group"
                          >
                            <FileText className="w-3 h-3 shrink-0 group-hover:text-primary transition-colors" />
                            <span className="truncate">{clause.title}</span>
                          </button>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Collapse Toggle */}
        <div className="p-4 border-t border-border mt-auto relative z-10 flex justify-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300 w-full ${isSidebarOpen ? 'gap-3' : ''}`}
            title={isSidebarOpen ? "Recolher biblioteca" : "Expandir biblioteca"}
          >
            <div className="transition-transform duration-300">
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </div>
            {isSidebarOpen && <span className="text-sm font-medium">Recolher</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-muted p-6">
        <div className="flex flex-col gap-2 mb-6">
          <button 
            onClick={() => navigate('/app/modelos')} 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <ChevronDown className="w-4 h-4 rotate-90" /> Voltar para Modelos
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Novo Contrato de Prestação de Serviços</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mr-2">
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Salvando...
                  </>
                ) : lastSaved ? (
                  <>
                    <Cloud className="w-3 h-3 text-green-500" />
                    Salvo às {lastSaved}
                  </>
                ) : null}
              </div>
              <Button onClick={handleSaveTemplate} variant="outline" className="bg-card text-foreground hover:bg-accent font-medium px-4">
                Salvar Modelo
              </Button>
              <Button onClick={handleSaveDraft} variant="outline" className="bg-muted text-foreground hover:bg-muted/80 hover:text-foreground border-none font-medium px-4">
                Salvar Rascunho
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6" onClick={handleAdvanceToReview}>
                Avançar e Baixar PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="border-b border-border p-2 flex items-center gap-1 bg-card">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-accent ${editor.isActive('bold') ? 'bg-secondary font-bold' : ''}`}
            >
              <span className="font-bold font-serif text-lg leading-none">B</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-accent ${editor.isActive('italic') ? 'bg-secondary font-bold' : ''}`}
            >
              <span className="italic font-serif text-lg leading-none">I</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-accent ${editor.isActive('underline') ? 'bg-secondary font-bold' : ''}`}
            >
              <span className="underline font-serif text-lg leading-none">U</span>
            </button>
            
            <div className="w-px h-6 bg-secondary mx-2" />
            
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-accent ${editor.isActive({ textAlign: 'left' }) ? 'bg-secondary' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-accent ${editor.isActive({ textAlign: 'center' }) ? 'bg-secondary' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="3" y1="12" y2="12"/><line x1="21" x2="3" y1="18" y2="18"/></svg>
            </button>
            
            <div className="w-px h-6 bg-secondary mx-2" />
            
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-accent ${editor.isActive('bulletList') ? 'bg-secondary' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-accent ${editor.isActive('orderedList') ? 'bg-secondary' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
            </button>
            
            <div className="w-px h-6 bg-secondary mx-2" />
            
            <button
              onClick={addImage}
              className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-accent text-sm font-medium text-foreground"
              title="Inserir Imagem / Logo"
            >
              <ImagePlus className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-secondary mx-2" />
            
            <button
              onClick={() => editor.chain().focus().insertContent('<span style="background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px; font-weight: 500; font-family: monospace;">[Nova Variável]</span>').run()}
              className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-accent text-sm font-medium text-foreground"
            >
              <span className="font-mono text-xs bg-secondary px-1 rounded">&lt;/&gt;</span> Variável
            </button>
          </div>

          {/* Editor Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {editor && (
              <BubbleMenu 
                editor={editor} 
                tippyOptions={{ duration: 100 }} 
                shouldShow={({ editor }) => editor.isActive('image')}
              >
                <div className="bg-white border border-border shadow-xl rounded-xl p-1 flex gap-1 animate-in fade-in zoom-in duration-200">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => editor.chain().focus().deleteSelection().run()}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 font-semibold"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" /> Remover Imagem
                  </Button>
                </div>
              </BubbleMenu>
            )}
            <EditorContent editor={editor} />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
