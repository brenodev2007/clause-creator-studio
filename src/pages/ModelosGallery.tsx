import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings, Home, FileText, Lock, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function ModelosGallery() {
  const templates = [
    {
      id: "freelancer",
      icon: <Settings className="w-8 h-8 text-primary" />,
      name: "Prestação de Serviços",
      description: "Um contrato de prestação de serviços, em onara, uiromairo e pentional do proferto de tensa.",
      iconBg: "bg-primary/10"
    },
    {
      id: "aluguel",
      icon: <Home className="w-8 h-8 text-primary" />,
      name: "Contrato de Aluguel",
      description: "Contrato de aluguel civiá peis omrõesvicas contendo com pesoinda para o mantum estas de contrato.",
      iconBg: "bg-primary/10"
    },
    {
      id: "nda",
      icon: <Lock className="w-8 h-8 text-primary" />,
      name: "Acordo de Confidencialidade (NDA)",
      description: "Acordo de confidencialidade (NDA) arrco um profissional clienex a em acurta de dentiinhs e entre os reais dacidas.",
      iconBg: "bg-primary/10"
    },
    {
      id: "trabalho",
      icon: <Users className="w-8 h-8 text-primary" />,
      name: "Contrato de Trabalho",
      description: "Contrato de trabalho stirá estimilanar uma contrato qualinais e organizaçinn, de tipo do contrato de trabalho.",
      iconBg: "bg-primary/10"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar modelos de contrato..." 
            className="pl-9 bg-white border-slate-200 h-11"
          />
        </div>
        <Link to="/app/editor/novo">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 h-11">
            Criar Contrato do Zero
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">Galeria de Modelos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border-2 border-primary/20 hover:border-primary transition-colors rounded-xl p-6 flex flex-col items-start shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${template.iconBg}`}>
                {template.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{template.name}</h3>
            </div>
            <p className="text-slate-600 text-sm mb-6 flex-1">
              {template.description}
            </p>
            <Link to={`/app/editor/${template.id}`}>
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium">
                Usar Modelo
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
