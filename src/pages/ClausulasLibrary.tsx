import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FolderPlus, FileText, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

export default function ClausulasLibrary() {
  const categories = [
    { name: "Foro e Jurisdição", count: 3 },
    { name: "Rescisão Contratual", count: 8 },
    { name: "Pagamento e Faturamento", count: 5 },
    { name: "Confidencialidade", count: 4 },
    { name: "Objeto do Contrato", count: 2 },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Categorias */}
      <div className="w-full md:w-64 shrink-0 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Categorias</h2>
        
        <div className="space-y-1">
          <button className="w-full flex items-center justify-between px-3 py-2 bg-primary/10 text-primary font-medium rounded-lg">
            <span>Todas as Cláusulas</span>
            <span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs">22</span>
          </button>
          
          {categories.map(cat => (
            <button key={cat.name} className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors">
              <span className="text-sm">{cat.name}</span>
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">{cat.count}</span>
            </button>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4 border-dashed border-2 text-slate-500 hover:text-primary">
          <FolderPlus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Main Area */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar cláusulas..." 
              className="pl-9 bg-white border-slate-200 h-11"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 h-11 shrink-0">
            <FileText className="w-4 h-4 mr-2" />
            Criar Cláusula
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-900">Cláusula de Aviso Prévio</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 -mr-2 -mt-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-slate-600 text-sm line-clamp-3">
              Qualquer das partes poderá rescindir o contrato mediante notificação prévia de 30 (trinta) dias, por escrito.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Rescisão Contratual</span>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.1}} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-900">Foro de Eleição</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 -mr-2 -mt-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-slate-600 text-sm line-clamp-3">
              Fica eleito o foro da comarca da Capital do Estado de São Paulo para dirimir quaisquer dúvidas originárias deste contrato.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Foro e Jurisdição</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
