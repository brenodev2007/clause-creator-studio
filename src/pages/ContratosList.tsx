import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ContratosList() {
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('zelo_saved_contracts');
    if (saved) {
      setContracts(JSON.parse(saved));
    }
  }, []);
  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Contratos</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os seus documentos e acompanhe o status de assinaturas.</p>
        </div>
        <Link to="/app/editor/novo">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6">
            Novo Contrato
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
            <Input 
              placeholder="Pesquisar por nome, cliente..." 
              className="pl-9 bg-card border-border"
            />
          </div>
          
          <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <Button variant="secondary" className="bg-secondary text-foreground/90 hover:bg-secondary/80 rounded-md px-4 h-9">
              Todos os Contratos
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:bg-accent rounded-md px-4 h-9">
              Concluído
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:bg-accent rounded-md px-4 h-9">
              Pendente
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:bg-accent rounded-md px-4 h-9">
              Rascunho
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Nome do Contrato</th>
                <th className="px-6 py-4 font-semibold">Data de Criação</th>
                <th className="px-6 py-4 font-semibold">Signatários</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum contrato encontrado. Crie um novo contrato para começar.
                  </td>
                </tr>
              ) : (
                contracts.map((contract: any) => (
                  <tr key={contract.id} className="bg-card hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{contract.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(contract.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {/* Mostrar os nomes de cliente/contratado caso seja do sistema antigo, senao usar placeholder */}
                      {contract.data?.client?.name || "Não definido"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contract.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                        contract.status === 'Pendente' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {contract.status || 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/80">
                        <span className="text-xl leading-none -mt-2">...</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
