import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contractTemplates, ContractTemplate } from "@/data/contractTemplates";
import { FileStack } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: ContractTemplate) => void;
  selectedTemplateId?: string;
}

const TemplateSelector = ({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) => {
  return (
    <Card className="shadow-soft border-0 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileStack className="w-5 h-5 text-primary" />
          Modelo de Contrato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Selecione um modelo para preencher automaticamente as cláusulas padrão:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contractTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary hover:shadow-md ${
                selectedTemplateId === template.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{template.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {template.description}
                  </p>
                  <p className="text-xs text-primary mt-2">
                    {template.clauses.length} cláusulas
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
