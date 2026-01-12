import { contractTemplates, ContractTemplate } from "@/data/contractTemplates";
import { Check, FileText, Briefcase, Code, LineChart, Megaphone } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: ContractTemplate) => void;
  selectedTemplateId?: string;
}

const templateIcons: Record<string, React.ReactNode> = {
  "freelancer": <Code className="w-5 h-5" />,
  "consultoria": <LineChart className="w-5 h-5" />,
  "prestacao-servicos": <Briefcase className="w-5 h-5" />,
  "desenvolvimento-software": <FileText className="w-5 h-5" />,
  "marketing-digital": <Megaphone className="w-5 h-5" />,
};

const TemplateSelector = ({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) => {
  return (
    <div className="border border-border rounded-lg bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-foreground">Modelos</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecione um modelo para preencher as cláusulas automaticamente
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {contractTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`group relative p-4 rounded-lg border text-left transition-all duration-200 hover-lift ${
                isSelected
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                  <Check className="w-3 h-3 text-background" />
                </div>
              )}
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`p-2 rounded-md transition-colors ${
                  isSelected ? "bg-foreground text-background" : "bg-secondary text-foreground"
                }`}>
                  {templateIcons[template.id] || <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm">
                    {template.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {template.description}
                  </p>
                </div>
                <span className="tag-minimal">
                  {template.clauses.length} cláusulas
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
