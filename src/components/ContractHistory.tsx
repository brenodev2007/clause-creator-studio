import { SavedContract } from "@/hooks/use-contract-history";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { History, Trash2, FileText, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContractHistoryProps {
  contracts: SavedContract[];
  onLoad: (contract: SavedContract) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const ContractHistory = ({
  contracts,
  onLoad,
  onDelete,
  onClearAll,
}: ContractHistoryProps) => {
  if (contracts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <History className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground text-sm">
            Nenhum contrato salvo ainda.
          </p>
          <p className="text-muted-foreground/70 text-xs mt-1">
            Clique em "Salvar" para guardar contratos no histórico.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <History className="w-4 h-4" />
            Histórico ({contracts.length})
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-8">
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Limpar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar histórico?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todos os {contracts.length} contratos salvos serão removidos permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Limpar tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="flex items-center justify-between p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <button
                onClick={() => onLoad(contract)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div className="w-8 h-8 rounded bg-background flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{contract.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(contract.savedAt), "dd MMM yyyy, HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir contrato?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O contrato "{contract.name}" será removido permanentemente do histórico.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(contract.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractHistory;
