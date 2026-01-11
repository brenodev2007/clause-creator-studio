import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contractTemplates, ContractTemplate } from "@/data/contractTemplates";
import { FileStack, Check, Sparkles } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: ContractTemplate) => void;
  selectedTemplateId?: string;
}

const TemplateSelector = ({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) => {
  return (
    <Card className="shadow-soft border-0 bg-card rounded-2xl overflow-hidden">
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-display font-semibold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <FileStack className="w-5 h-5 text-primary" />
            </div>
            Modelos de Contrato
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            Preenche automaticamente
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground mb-5">
          Escolha um modelo para preencher as cláusulas padrão do seu contrato:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {contractTemplates.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-medium hover:-translate-y-1 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-primary flex items-center justify-center shadow-medium animate-scale-in">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="flex flex-col items-center text-center gap-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{template.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {template.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    isSelected 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                    {template.clauses.length} cláusulas
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
