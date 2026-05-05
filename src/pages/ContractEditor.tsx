import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Folder, ChevronDown, ChevronRight, FileText, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Comece a digitar o seu contrato...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px]',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const insertClause = (clauseText: string) => {
    editor.chain().focus().insertContent(`
      <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
        ${clauseText}
      </div>
    `).run();
  };

  const handleSaveDraft = () => {
    if (!editor) return;
    const htmlContent = editor.getHTML();
    const newDraft = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name: `Rascunho - ${new Date().toLocaleDateString()}`,
      content: htmlContent,
      status: 'Rascunho'
    };
    
    const saved = localStorage.getItem('zelo_saved_contracts');
    const existingContracts = saved ? JSON.parse(saved) : [];
    
    localStorage.setItem('zelo_saved_contracts', JSON.stringify([newDraft, ...existingContracts]));
    toast.success("Rascunho salvo com sucesso!");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 h-16 shrink-0 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary font-bold text-2xl italic">
            <span className="text-primary">Z</span> Zelo
          </div>
          <div className="h-6 w-px bg-slate-300 mx-2" />
          <span className="font-semibold text-slate-700">Editor de Cláusulas</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/app/contratos" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Meus Contratos</Link>
          <Link to="/app/modelos" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Modelos</Link>
          <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Configurações</Link>
          
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-colors border border-slate-300 ml-4">
             <User className="w-4 h-4 text-slate-600" />
          </div>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Clause Library */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
        <div className="p-6 bg-slate-900 text-white rounded-tr-3xl rounded-br-3xl mr-4 my-4">
          <h2 className="text-lg font-bold mb-4">Biblioteca de Cláusulas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar" 
              className="pl-9 bg-white text-slate-900 border-none h-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="foro" className="border-none">
              <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-md hover:bg-slate-100 font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Foro e Jurisdição
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-2">
                Conteúdo de Foro
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="rescisao" className="border-none">
              <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-md hover:bg-slate-100 font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Rescisão Contratual
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pt-2 pb-4">
                <button 
                  onClick={() => insertClause('<p><strong>[Cláusula de Aviso Prévio]</strong></p><p>Qualquer das partes poderá rescindir o contrato com aviso de 30 dias.</p>')}
                  className="text-left px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3 h-3" /> Cláusula de Aviso Prévio
                </button>
                <button 
                  onClick={() => insertClause('<p><strong>[Rescisão Imediata]</strong></p><p>Em caso de quebra de sigilo, o contrato será rescindido imediatamente.</p>')}
                  className="text-left px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3 h-3" /> Rescisão Imediata
                </button>
                <button 
                  className="text-left px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3 h-3" /> Indenização
                </button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pagamento" className="border-none">
              <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-md hover:bg-slate-100 font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Pagamento e Faturamento
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-2">
                Conteúdo de Pagamento
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="confidencialidade" className="border-none">
              <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-md hover:bg-slate-100 font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Confidencialidade
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-2">
                Conteúdo de Confidencialidade
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="objeto" className="border-none">
              <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-md hover:bg-slate-100 font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Objeto do Contrato
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-2">
                Conteúdo de Objeto
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </aside>

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Novo Contrato de Prestação de Serviços</h1>
          <div className="flex items-center gap-3">
            <Button onClick={handleSaveDraft} variant="outline" className="bg-slate-900 text-white hover:bg-slate-800 hover:text-white border-none font-medium px-6">
              Salvar Rascunho
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6" onClick={() => navigate('/app/revisao/123')}>
              Avançar e Baixar PDF
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="border-b border-slate-200 p-2 flex items-center gap-1 bg-white">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('bold') ? 'bg-slate-100 font-bold' : ''}`}
            >
              <span className="font-bold font-serif text-lg leading-none">B</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('italic') ? 'bg-slate-100 font-bold' : ''}`}
            >
              <span className="italic font-serif text-lg leading-none">I</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('underline') ? 'bg-slate-100 font-bold' : ''}`}
            >
              <span className="underline font-serif text-lg leading-none">U</span>
            </button>
            
            <div className="w-px h-6 bg-slate-200 mx-2" />
            
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-100' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-100' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="3" y1="12" y2="12"/><line x1="21" x2="3" y1="18" y2="18"/></svg>
            </button>
            
            <div className="w-px h-6 bg-slate-200 mx-2" />
            
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('bulletList') ? 'bg-slate-100' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('orderedList') ? 'bg-slate-100' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
            </button>
            
            <div className="w-px h-6 bg-slate-200 mx-2" />
            
            <button
              onClick={() => editor.chain().focus().insertContent('<span style="background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px; font-weight: 500; font-family: monospace;">[Nova Variável]</span>').run()}
              className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm font-medium text-slate-700"
            >
              <span className="font-mono text-xs bg-slate-200 px-1 rounded">&lt;/&gt;</span> Variável
            </button>
          </div>

          {/* Editor Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <EditorContent editor={editor} />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
