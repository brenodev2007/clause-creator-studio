import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings, Home, FileText, Lock, Users, Briefcase, Plus, Star, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

export default function ModelosGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);

  // Edit state
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [editName, setEditName] = useState("");

  // Delete state
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('zelo_saved_templates');
    if (saved) {
      const parsed = JSON.parse(saved);
      const formatted = parsed.map((t: any) => ({
        id: t.id,
        icon: <FileText className="w-6 h-6 text-foreground" />,
        name: t.name,
        category: "Meus Modelos",
        description: "Modelo personalizado salvo pelo usuário.",
        iconBg: "bg-muted",
        popular: false,
        isCustom: true,
      }));
      setCustomTemplates(formatted);
    }
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeletingTemplateId(id);
  };

  const confirmDelete = () => {
    if (!deletingTemplateId) return;
    const saved = localStorage.getItem('zelo_saved_templates');
    if (saved) {
      const parsed = JSON.parse(saved);
      const filtered = parsed.filter((t: any) => t.id !== deletingTemplateId);
      localStorage.setItem('zelo_saved_templates', JSON.stringify(filtered));
      setCustomTemplates(customTemplates.filter(t => t.id !== deletingTemplateId));
      toast.success("Modelo excluído com sucesso!");
    }
    setDeletingTemplateId(null);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setEditName(template.name);
  };

  const handleSaveEdit = () => {
    if (!editingTemplate || !editName.trim()) return;
    const saved = localStorage.getItem('zelo_saved_templates');
    if (saved) {
      const parsed = JSON.parse(saved);
      const updated = parsed.map((t: any) => {
        if (t.id === editingTemplate.id) {
          return { ...t, name: editName };
        }
        return t;
      });
      localStorage.setItem('zelo_saved_templates', JSON.stringify(updated));
      
      setCustomTemplates(customTemplates.map(t => {
        if (t.id === editingTemplate.id) {
          return { ...t, name: editName };
        }
        return t;
      }));
      toast.success("Nome do modelo atualizado!");
      setEditingTemplate(null);
    }
  };

  const categories = ["Todos", "Serviços", "Imobiliário", "Empresarial", "Trabalhista", "Meus Modelos"];

  const defaultTemplates = [
    {
      id: "prestacao-servicos",
      icon: <Settings className="w-6 h-6 text-primary" />,
      name: "Prestação de Serviços",
      category: "Serviços",
      description: "Contrato padrão para prestação de serviços gerais entre empresas ou profissionais autônomos.",
      iconBg: "bg-primary/10",
      popular: true,
      isCustom: false,
    },
    {
      id: "aluguel-residencial",
      icon: <Home className="w-6 h-6 text-blue-500" />,
      name: "Aluguel Residencial",
      category: "Imobiliário",
      description: "Modelo completo de locação de imóveis residenciais com garantias locatícias.",
      iconBg: "bg-blue-500/10",
      popular: true,
      isCustom: false,
    },
    {
      id: "nda",
      icon: <Lock className="w-6 h-6 text-purple-500" />,
      name: "Acordo de Confidencialidade",
      category: "Empresarial",
      description: "Proteja informações sensíveis da sua empresa (NDA) antes de fechar negócios ou parcerias.",
      iconBg: "bg-purple-500/10",
      popular: false,
      isCustom: false,
    },
    {
      id: "trabalho-clt",
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      name: "Contrato de Trabalho (CLT)",
      category: "Trabalhista",
      description: "Contrato de admissão de funcionários pelo regime CLT com banco de horas e confidencialidade.",
      iconBg: "bg-emerald-500/10",
      popular: false,
      isCustom: false,
    },
    {
      id: "parceria-comercial",
      icon: <Briefcase className="w-6 h-6 text-amber-500" />,
      name: "Parceria Comercial",
      category: "Empresarial",
      description: "Estabeleça regras claras de comissionamento e responsabilidades entre parceiros.",
      iconBg: "bg-amber-500/10",
      popular: true,
      isCustom: false,
    },
    {
      id: "desenvolvimento-software",
      icon: <FileText className="w-6 h-6 text-cyan-500" />,
      name: "Desenvolvimento de Software",
      category: "Serviços",
      description: "Focado em dev, define escopo, prazos, PI (Propriedade Intelectual) e garantias.",
      iconBg: "bg-cyan-500/10",
      popular: false,
      isCustom: false,
    }
  ];

  const templates = [...customTemplates, ...defaultTemplates];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTemplateId} onOpenChange={(open) => !open && setDeletingTemplateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir modelo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este modelo permanentemente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingTemplateId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear Modelo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nome do modelo"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingTemplate(null)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Galeria de Modelos</h1>
          <p className="text-muted-foreground">Escolha um modelo pronto para começar ou crie um do zero.</p>
        </div>
        <Link to="/app/editor/novo">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 h-11 shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            Criar do Zero
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:max-w-sm shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Buscar por nome ou palavra-chave..." 
            className="pl-9 bg-card border-border h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className={`rounded-full shrink-0 ${activeCategory === cat ? 'shadow-sm' : 'bg-transparent'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground mb-1">Nenhum modelo encontrado</h3>
          <p className="text-muted-foreground">Tente buscar com outros termos ou crie um contrato do zero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={template.id} 
              className="group bg-card border border-border hover:border-primary/50 transition-all duration-300 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md"
            >
              {template.popular && (
                <div className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-current" /> Popular
                </div>
              )}

              {template.isCustom && (
                <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary bg-background/50 backdrop-blur-sm shadow-sm" 
                    onClick={(e) => { e.preventDefault(); handleEdit(template); }}
                    title="Renomear"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive bg-background/50 backdrop-blur-sm shadow-sm" 
                    onClick={(e) => { e.preventDefault(); handleDeleteClick(template.id); }}
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${template.iconBg}`}>
                  {template.icon}
                </div>
                <div className="pt-1 w-full pr-16">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    {template.category}
                  </span>
                  <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3">
                {template.description}
              </p>
              
              <Link to={`/app/editor/${template.id}`} className="mt-auto">
                <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  Usar Este Modelo
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
