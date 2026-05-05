import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Pencil, Trash2, Send, FileText, Plus, Eye, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Contract {
  id: string;
  title?: string;
  name?: string; // legacy
  content?: string;
  status?: string;
  updatedAt?: string;
  date?: string; // legacy
  createdAt?: string;
  signers?: string[];
}

export default function ContratosList() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Todos os Contratos");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = () => {
    const saved = localStorage.getItem('zelo_saved_contracts');
    if (saved) {
      const parsed: Contract[] = JSON.parse(saved);
      // Normalize legacy fields
      const normalized = parsed.map(c => ({
        ...c,
        title: c.title || c.name || "Contrato Sem Título",
        updatedAt: c.updatedAt || c.date || new Date().toISOString(),
        status: c.status || "Rascunho",
      }));
      normalized.sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime());
      setContracts(normalized);
    }
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    const updated = contracts.filter(c => c.id !== deletingId);
    setContracts(updated);
    localStorage.setItem('zelo_saved_contracts', JSON.stringify(updated));
    setDeletingId(null);
    toast.success("Contrato excluído com sucesso.");
  };

  const handleChangeStatus = (id: string, newStatus: string) => {
    const updated = contracts.map(c => 
      c.id === id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c
    );
    setContracts(updated);
    localStorage.setItem('zelo_saved_contracts', JSON.stringify(updated));
    toast.success(`Status alterado para "${newStatus}".`);
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = (contract.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = 
      activeTab === "Todos os Contratos" || contract.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = ["Todos os Contratos", "Concluído", "Pendente", "Rascunho"];
  const statusCounts = {
    "Todos os Contratos": contracts.length,
    "Concluído": contracts.filter(c => c.status === "Concluído").length,
    "Pendente": contracts.filter(c => c.status === "Pendente").length,
    "Rascunho": contracts.filter(c => c.status === "Rascunho").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'Pendente':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto w-full px-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir contrato</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este contrato permanentemente? Esta ação não pode ser desfeita.
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

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Contratos</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os seus documentos e acompanhe o status de assinaturas.</p>
        </div>
        <Link to="/app/editor/novo">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 gap-2">
            <Plus className="w-4 h-4" />
            Novo Contrato
          </Button>
        </Link>
      </motion.div>

      {/* Table Card */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
            <Input 
              placeholder="Pesquisar por nome..." 
              className="pl-9 bg-card border-border h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-1 w-full sm:w-auto">
            {tabs.map(tab => (
              <Button 
                key={tab}
                variant={activeTab === tab ? "secondary" : "ghost"}
                className={`rounded-lg px-3 h-9 whitespace-nowrap text-xs font-medium ${
                  activeTab === tab 
                    ? 'bg-background text-foreground shadow-sm border border-border' 
                    : 'text-muted-foreground hover:bg-accent'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {statusCounts[tab as keyof typeof statusCounts]}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/30 uppercase border-b border-border">
              <tr>
                <th className="px-6 py-3.5 font-medium">Nome do Contrato</th>
                <th className="px-6 py-3.5 font-medium">Data de Atualização</th>
                <th className="px-6 py-3.5 font-medium">Signatários</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
                <th className="px-6 py-3.5 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="w-10 h-10 mb-3 opacity-30" />
                      <p className="font-medium">Nenhum contrato encontrado</p>
                      <p className="text-xs mt-1">
                        {searchTerm 
                          ? "Tente ajustar os filtros de busca." 
                          : "Clique em \"Novo Contrato\" para começar."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-semibold text-foreground">{contract.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {new Date(contract.updatedAt || Date.now()).toLocaleDateString('pt-BR', { 
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {(contract as any).signers?.length > 0 ? (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          {(contract as any).signers.length} signatário(s)
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(contract.status || 'Rascunho')}`}>
                        {contract.status || 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/80 outline-none">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/app/editor/${contract.id}`)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Continuar Edição
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/app/revisao/${contract.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Revisar / Baixar PDF
                          </DropdownMenuItem>
                          {contract.status === "Rascunho" && (
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleChangeStatus(contract.id, "Pendente")}>
                              <Send className="w-4 h-4 mr-2" />
                              Enviar para Assinatura
                            </DropdownMenuItem>
                          )}
                          {contract.status === "Pendente" && (
                            <DropdownMenuItem className="cursor-pointer text-green-600" onClick={() => handleChangeStatus(contract.id, "Concluído")}>
                              <Send className="w-4 h-4 mr-2" />
                              Marcar como Concluído
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => setDeletingId(contract.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir Contrato
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
