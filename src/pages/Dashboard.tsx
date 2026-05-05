import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Folder, CheckCircle, Coins, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  
  const [contracts, setContracts] = useState<any[]>([]);
  const [templatesCount, setTemplatesCount] = useState(0);

  useEffect(() => {
    const savedContracts = localStorage.getItem('zelo_saved_contracts');
    if (savedContracts) {
      const parsed = JSON.parse(savedContracts);
      // Normalize legacy fields
      const normalized = parsed.map((c: any) => ({
        ...c,
        title: c.title || c.name || "Contrato Sem Título",
        updatedAt: c.updatedAt || c.date || new Date().toISOString(),
        status: c.status || "Rascunho",
      }));
      normalized.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setContracts(normalized);
    }

    const savedTemplates = localStorage.getItem('zelo_saved_templates');
    if (savedTemplates) {
      setTemplatesCount(JSON.parse(savedTemplates).length);
    }
  }, []);

  const completedCount = contracts.filter((c: any) => c.status === "Concluído").length;
  
  const stats = [
    { name: "Total de Contratos", value: contracts.length.toString(), icon: <Folder className="w-6 h-6 text-blue-500 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-500/20" },
    { name: "Modelos Salvos", value: templatesCount.toString(), icon: <FileText className="w-6 h-6 text-purple-500 dark:text-purple-400" />, bg: "bg-purple-100 dark:bg-purple-500/20" },
    { name: "Concluídos", value: completedCount.toString(), icon: <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />, bg: "bg-green-100 dark:bg-green-500/20" },
    { name: "Tokens Disponíveis", value: (user?.daily_tokens || 10).toString(), icon: <Coins className="w-6 h-6 text-amber-500 dark:text-amber-400" />, bg: "bg-amber-100 dark:bg-amber-500/20" },
  ];

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('pt-BR', { 
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const recentContracts = contracts.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Olá, {user?.name?.split(' ')[0] || "Usuário"}!</h1>
          <p className="text-muted-foreground mt-1">Bem-vindo de volta ao seu painel de contratos.</p>
        </div>
        <Link to="/app/editor/novo">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 h-11">
            Novo Contrato
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.name} 
            className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Atividade Recente</h2>
        {contracts.length > 0 && (
          <Link to="/app/contratos" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {recentContracts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
            <Folder className="w-12 h-12 mb-4 opacity-20" />
            <p>Nenhuma atividade recente encontrada.</p>
            <p className="text-sm mt-1">Crie seu primeiro contrato para ver estatísticas aqui.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentContracts.map((contract, i) => (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                key={contract.id} 
                className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{contract.title || "Contrato Sem Título"}</h4>
                    <p className="text-xs text-muted-foreground">Atualizado em {formatDate(contract.updatedAt)}</p>
                  </div>
                </div>
                <Link to={`/app/editor/${contract.id}`}>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    Continuar Edição
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
