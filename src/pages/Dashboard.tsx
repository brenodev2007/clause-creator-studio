import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Folder, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Dummy data para visualização
  const stats = [
    { name: "Total de Contratos", value: "12", icon: <Folder className="w-6 h-6 text-blue-500" />, bg: "bg-blue-100" },
    { name: "Modelos Usados", value: "5", icon: <FileText className="w-6 h-6 text-purple-500" />, bg: "bg-purple-100" },
    { name: "Concluídos", value: "8", icon: <CheckCircle className="w-6 h-6 text-green-500" />, bg: "bg-green-100" },
    { name: "Pendentes", value: "4", icon: <Clock className="w-6 h-6 text-amber-500" />, bg: "bg-amber-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Olá, {user?.name || "Usuário"}!</h1>
          <p className="text-slate-500 mt-1">Bem-vindo de volta ao seu painel de contratos.</p>
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
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6">Atividade Recente</h2>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 text-center text-slate-500">
          Nenhuma atividade recente encontrada.
        </div>
      </div>
    </div>
  );
}
