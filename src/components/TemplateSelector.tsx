import { contractTemplates, ContractTemplate } from "@/data/contractTemplates";
import { Check, FileText, Briefcase, Code, LineChart, Megaphone, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateSelectorProps {
  onSelectTemplate: (template: ContractTemplate) => void;
  selectedTemplateId?: string;
  customTemplates?: ContractTemplate[];
  onDeleteTemplate?: (id: string) => void;
}

const templateIcons: Record<string, React.ReactNode> = {
  "freelancer": <Code className="w-5 h-5" />,
  "consultoria": <LineChart className="w-5 h-5" />,
  "prestacao-servicos": <Briefcase className="w-5 h-5" />,
  "desenvolvimento-software": <FileText className="w-5 h-5" />,
  "marketing-digital": <Megaphone className="w-5 h-5" />,
};

const TemplateSelector = ({ 
  onSelectTemplate, 
  selectedTemplateId, 
  customTemplates = [], 
  onDeleteTemplate 
}: TemplateSelectorProps) => {
  
  const renderTemplateCard = (template: ContractTemplate, isCustom: boolean = false) => {
    const isSelected = selectedTemplateId === template.id;
    return (
      <div 
        key={template.id}
        className={`group relative p-4 rounded-lg border text-left transition-all duration-200 hover-lift ${
          isSelected
            ? "border-foreground bg-foreground/5"
            : "border-border hover:border-foreground/30"
        }`}
      >
        <button
          onClick={() => onSelectTemplate(template)}
          className="absolute inset-0 w-full h-full z-10"
        />

        {/* Delete Button for Custom Templates */}
        {isCustom && onDeleteTemplate && (
          <Button
            variant="ghost" 
            size="icon"
            className="absolute top-2 right-2 z-20 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTemplate(template.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}

        {/* Selection Indicator */}
        {isSelected && !isCustom && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground flex items-center justify-center z-0">
            <Check className="w-3 h-3 text-background" />
          </div>
        )}

         {/* Selection Indicator for custom (since we have delete btn on top right) */}
         {isSelected && isCustom && (
          <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-foreground flex items-center justify-center z-0">
            <Check className="w-3 h-3 text-background" />
          </div>
        )}

        <div className="flex flex-col items-center text-center gap-2 pointer-events-none">
          <div className={`p-2 rounded-md transition-colors ${
            isSelected ? "bg-foreground text-background" : "bg-secondary text-foreground"
          }`}>
            {isCustom ? <FileText className="w-5 h-5" /> : (templateIcons[template.id] || <FileText className="w-5 h-5" />)}
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
      </div>
    );
  };

  return (
    <div className="border border-border rounded-lg bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Modelos</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecione um modelo para preencher as cláusulas automaticamente
          </p>
        </div>
      </div>
      
      {/* Standard Templates */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {contractTemplates.map((t) => renderTemplateCard(t))}
      </div>

       {/* Custom Templates Section */}
       {customTemplates.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            Meus Modelos
            <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {customTemplates.length}
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
             {customTemplates.map((t) => renderTemplateCard(t, true))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
