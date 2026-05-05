import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, FolderPlus, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const defaultClauses = [
  { id: "1", title: "Foro Padrão (São Paulo)", content: "<p><strong>[Foro de Eleição]</strong></p><p>Fica eleito o foro da comarca da Capital do Estado de São Paulo para dirimir quaisquer dúvidas originárias deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.</p>", category: "Foro e Jurisdição", isCustom: false },
  { id: "2", title: "Foro - Cláusula Arbitral", content: "<p><strong>[Cláusula Arbitral]</strong></p><p>Qualquer litígio ou controvérsia decorrente deste contrato será resolvido por arbitragem, administrada pela Câmara de Mediação e Arbitragem, de acordo com suas regras.</p>", category: "Foro e Jurisdição", isCustom: false },
  { id: "3", title: "Aviso Prévio 30 Dias", content: "<p><strong>[Cláusula de Aviso Prévio]</strong></p><p>Qualquer das partes poderá rescindir o contrato mediante notificação prévia de 30 (trinta) dias, por escrito.</p>", category: "Rescisão Contratual", isCustom: false },
  { id: "4", title: "Rescisão Imediata (Quebra de Sigilo)", content: "<p><strong>[Rescisão Imediata]</strong></p><p>Em caso de quebra de sigilo ou violação de confidencialidade, o contrato será rescindido imediatamente, sem prejuízo de perdas e danos.</p>", category: "Rescisão Contratual", isCustom: false },
  { id: "5", title: "Multa por Rescisão Antecipada", content: "<p><strong>[Multa Rescisória]</strong></p><p>A rescisão imotivada antes do término do prazo implicará no pagamento de multa equivalente a 20% sobre o saldo devedor do contrato.</p>", category: "Rescisão Contratual", isCustom: false },
  { id: "6", title: "Pagamento Mensal", content: "<p><strong>[Pagamento Mensal]</strong></p><p>O pagamento será realizado mensalmente, até o dia 5 (cinco) de cada mês, mediante emissão de nota fiscal.</p>", category: "Pagamento e Faturamento", isCustom: false },
  { id: "7", title: "Pagamento por Marcos", content: "<p><strong>[Pagamento por Marcos de Entrega]</strong></p><p>O pagamento será efetuado conforme a entrega e aprovação dos marcos definidos no anexo, com faturamento em até 10 dias úteis após a aprovação.</p>", category: "Pagamento e Faturamento", isCustom: false },
  { id: "8", title: "Juros e Correção", content: "<p><strong>[Atraso no Pagamento]</strong></p><p>O atraso no pagamento acarretará multa de 2% (dois por cento) e juros moratórios de 1% (um por cento) ao mês, pro rata die.</p>", category: "Pagamento e Faturamento", isCustom: false },
  { id: "9", title: "Confidencialidade Padrão", content: "<p><strong>[Confidencialidade]</strong></p><p>As partes obrigam-se a manter absoluto sigilo sobre as informações trocadas durante a execução deste contrato, por um período de 5 (cinco) anos após seu término.</p>", category: "Confidencialidade", isCustom: false },
  { id: "10", title: "Devolução de Informações", content: "<p><strong>[Devolução de Materiais]</strong></p><p>Ao término do contrato, a parte receptora deverá devolver ou destruir, sob comprovação, todos os materiais e documentos confidenciais recebidos.</p>", category: "Confidencialidade", isCustom: false },
  { id: "11", title: "Prestação de Serviços Genérica", content: "<p><strong>[Objeto]</strong></p><p>O presente contrato tem por objeto a prestação de serviços de <span style=\"background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px;\">[Descrição do Serviço]</span>, conforme detalhado no Anexo I.</p>", category: "Objeto do Contrato", isCustom: false },
  { id: "12", title: "Licenciamento de Software", content: "<p><strong>[Objeto]</strong></p><p>O objeto deste contrato é a concessão de licença de uso, em caráter não exclusivo e intransferível, do software <span style=\"background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px;\">[Nome do Software]</span>.</p>", category: "Objeto do Contrato", isCustom: false }
];

export default function ClausulasLibrary() {
  const [customClauses, setCustomClauses] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todas as Cláusulas");
  const [searchTerm, setSearchTerm] = useState("");

  // Create/Edit State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClause, setEditingClause] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", category: "", content: "" });

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('zelo_saved_clauses');
    if (saved) {
      setCustomClauses(JSON.parse(saved));
    }
  }, []);

  const allClauses = useMemo(() => [...defaultClauses, ...customClauses], [customClauses]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    allClauses.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [allClauses]);

  const filteredClauses = useMemo(() => {
    return allClauses.filter(c => {
      const matchesCat = activeCategory === "Todas as Cláusulas" || c.category === activeCategory;
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [allClauses, activeCategory, searchTerm]);

  const handleOpenCreate = () => {
    setEditingClause(null);
    setFormData({ title: "", category: "", content: "" });
    setIsDialogOpen(true);
  };

  const htmlToPlainText = (html: string) => {
    let text = html;
    // Replace adjacent paragraphs with double newline
    text = text.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
    // Replace breaks with newline
    text = text.replace(/<br\s*\/?>/gi, '\n');
    // Extract variables with or without spans/strongs back to [Var]
    text = text.replace(/<strong><span[^>]*>\[(.*?)\]<\/span><\/strong>/gi, '[$1]');
    text = text.replace(/<span[^>]*>\[(.*?)\]<\/span>/gi, '[$1]');
    text = text.replace(/<strong>\[(.*?)\]<\/strong>/gi, '[$1]');
    // Strip all remaining HTML tags
    text = text.replace(/<[^>]*>?/gm, '');
    return text.trim();
  };

  const handleOpenEdit = (clause: any) => {
    setEditingClause(clause);
    setFormData({ 
      title: clause.title, 
      category: clause.category, 
      content: htmlToPlainText(clause.content) 
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.category || !formData.content) {
      toast.error("Preencha todos os campos!");
      return;
    }

    // Convert plain text back to HTML for the editor
    const htmlContent = formData.content
      .split('\n')
      .map(line => {
        if (!line.trim()) return '<br/>';
        // Auto-format [Variables] nicely
        let processedLine = line.replace(/\[(.*?)\]/g, '<strong><span style="background-color: #e2e8f0; padding: 2px 4px; border-radius: 4px;">[$1]</span></strong>');
        return `<p>${processedLine}</p>`;
      })
      .join('');

    const clauseData = {
      title: formData.title,
      category: formData.category,
      content: htmlContent
    };

    let updatedCustom;
    if (editingClause) {
      updatedCustom = customClauses.map(c => c.id === editingClause.id ? { ...c, ...clauseData } : c);
      toast.success("Cláusula atualizada com sucesso!");
    } else {
      const newClause = {
        id: crypto.randomUUID(),
        ...clauseData,
        isCustom: true
      };
      updatedCustom = [...customClauses, newClause];
      toast.success("Nova cláusula criada com sucesso!");
    }

    setCustomClauses(updatedCustom);
    localStorage.setItem('zelo_saved_clauses', JSON.stringify(updatedCustom));
    setIsDialogOpen(false);
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    const updatedCustom = customClauses.filter(c => c.id !== deletingId);
    setCustomClauses(updatedCustom);
    localStorage.setItem('zelo_saved_clauses', JSON.stringify(updatedCustom));
    toast.success("Cláusula excluída com sucesso!");
    setDeletingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row gap-8">
      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cláusula</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir esta cláusula permanentemente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingClause ? "Editar Cláusula" : "Criar Nova Cláusula"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título da Cláusula</label>
              <Input 
                placeholder="Ex: Multa por Atraso" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Input 
                placeholder="Ex: Pagamento e Faturamento" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                list="category-options"
              />
              <datalist id="category-options">
                {categories.map(c => <option key={c.name} value={c.name} />)}
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Texto da Cláusula</label>
              <Textarea 
                placeholder="Escreva o texto da sua cláusula aqui..." 
                className="min-h-[200px] text-sm"
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
              />
              <p className="text-xs text-muted-foreground flex flex-col gap-1 mt-2">
                <span>• Pule linhas para criar novos parágrafos.</span>
                <span>• Coloque palavras entre <strong>[colchetes]</strong> para criar campos variáveis destacáveis (ex: <strong>[Valor da Multa]</strong>).</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sidebar Categorias */}
      <div className="w-full md:w-64 shrink-0 space-y-4">
        <h2 className="text-xl font-bold text-foreground mb-4">Categorias</h2>
        
        <div className="space-y-1">
          <button 
            onClick={() => setActiveCategory("Todas as Cláusulas")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              activeCategory === "Todas as Cláusulas" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <span>Todas as Cláusulas</span>
            <span className="bg-card text-primary px-2 py-0.5 rounded-full text-xs shadow-sm">{allClauses.length}</span>
          </button>
          
          {categories.map(cat => (
            <button 
              key={cat.name} 
              onClick={() => setActiveCategory(cat.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                activeCategory === cat.name ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <span className="text-sm truncate mr-2 text-left">{cat.name}</span>
              <span className="bg-secondary text-muted-foreground px-2 py-0.5 rounded-full text-xs shadow-sm">{cat.count}</span>
            </button>
          ))}
        </div>

        <Button onClick={handleOpenCreate} variant="outline" className="w-full mt-4 border-dashed border-2 text-muted-foreground hover:text-primary">
          <FolderPlus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Main Area */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
            <Input 
              placeholder="Buscar cláusulas..." 
              className="pl-9 bg-card border-border h-11"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleOpenCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 h-11 shrink-0">
            <FileText className="w-4 h-4 mr-2" />
            Criar Cláusula
          </Button>
        </div>

        {filteredClauses.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-foreground mb-1">Nenhuma cláusula encontrada</h3>
            <p className="text-muted-foreground">Não há cláusulas correspondentes à sua busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredClauses.map((clause, idx) => (
              <motion.div 
                key={clause.id}
                initial={{opacity:0, y: 10}} 
                animate={{opacity:1, y: 0}} 
                transition={{delay: idx * 0.05}} 
                className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-foreground leading-tight">{clause.title}</h3>
                  {clause.isCustom && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-accent shrink-0 -mr-2 -mt-2">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(clause)} className="cursor-pointer">
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeletingId(clause.id)} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {/* Strip HTML tags for preview using a simple regex replace */}
                <p className="text-muted-foreground text-sm line-clamp-3 flex-1 mb-4" dangerouslySetInnerHTML={{ __html: clause.content.replace(/<[^>]*>?/gm, ' ') }} />
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-md truncate max-w-[80%]">
                    {clause.category}
                  </span>
                  {clause.isCustom && (
                    <span className="text-[10px] uppercase font-bold text-primary/70 tracking-wider">Custom</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
