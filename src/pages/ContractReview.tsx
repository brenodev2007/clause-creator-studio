import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Link as LinkIcon, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ContractReview() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-8">
          {/* Left side: PDF Preview */}
      <div className="flex-1">
        <div className="mb-6">
          <Link to="/app/editor/123" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Voltar para Edição
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Zelo - Revisão e Assinatura Digital</h1>
        </div>
        
        {/* Mock A4 Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary p-8 rounded-xl border border-border h-[600px] overflow-y-auto">
          {/* Page 1 */}
          <div className="bg-card shadow-md w-full aspect-[1/1.414] p-8 text-[8px] text-foreground/90 leading-relaxed font-serif relative">
             <h2 className="text-center font-bold text-[12px] mb-4">Contrato de Prestação de Serviços</h2>
             <p className="mb-2">A. CONTRATO _________________ é officio promxpate tameto, inilopto de avavie, travederante brostação divenilpr, date feilize maona ____________ para collaburetir da _____________ core dir yogin ___ de ______ du firlo dsovdei de flhdhestepão de Serviços noe ane seupme pante iploriuando e recedentamio o Contrato de Prestação de Serviços, onessno adirar somintabam ein anoralra de presagdz de darmoalbe, anosdimein, sonto vetomunis avihonlizado, ips um sen- um prenupis de aioremene de sou ocaps da conesididade coninry ae eirae toramna, momentos stetama-arouun imporotaetr que selin:</p>
             <ul className="list-disc pl-4 mb-2 space-y-1">
               <li>Cariommiro a Prestação de Serviços e nis (O) vemshalo no PDF, peto crente eonitor planta stas cokoeros, sevenita;</li>
               <li>Reahara de ecer avillação no, eonsamassevitação mutas nerem air pecana proganda otliode de servicos;</li>
             </ul>
             <p className="font-bold mt-4 mb-1">Cláusula 1 - A sovtação de Prestação de Serviços</p>
             <p className="mb-2">Contrato de Prestopto de Serviços soronâ-s guntiom forinminaras, ss onaste a poontilidade de unisdo termo e trada eonnemia nociticeis a restinilo naribei pvemitelcata naneo selvo vaianiele to oi contrstait de carvestis...</p>
          </div>
          {/* Page 2 */}
          <div className="bg-card shadow-md w-full aspect-[1/1.414] p-8 text-[8px] text-foreground/90 leading-relaxed font-serif relative">
             <ul className="list-disc pl-4 mb-2 space-y-1">
               <li>Rsoricinato uma ononsonvasção de serviço, aitviss conliferação de denvosenitondo constrabi de suas abentsisas agreidnes;</li>
               <li>Conninde atzzar wiclada de contrator, do doio, de nv asentar-silto. Serviços sa consuridades;</li>
             </ul>
             <p className="font-bold mt-4 mb-1">Cláusulas 6 - Ascamado ancuma rocss Contrato de Prestação de Serviços</p>
             <p className="mb-4">pelo contrato do arnviato de roperiotitsoo de emenotilsc ix mixiara doro nountante jsontiomamto, artendo asaceste. oef carelse ação de sanda: armpso a contado de contra e "en esta enaitanmo skarmeto de conrsietos.</p>
             
             <div className="mt-12 text-center text-[10px]">
               <p>Contrato ____ em _____ de _______ 2023.</p>
               <div className="flex justify-between px-8 mt-16">
                 <div className="border-t border-border pt-1 w-24">Signatário</div>
                 <div className="border-t border-border pt-1 w-24">Assinante da Prestação</div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right side: Actions panel */}
      <div className="w-full lg:w-80 shrink-0 space-y-6 pt-14">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-14 text-lg rounded-xl shadow-lg shadow-primary/20">
          <Download className="w-5 h-5 mr-2" />
          Baixar em PDF
        </Button>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-4">Assinatura Digital</h3>
          
          <div className="space-y-4">
            <Input 
              placeholder="Adicionar e-mail do signatário" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base border-border/80"
            />
            <Button variant="outline" className="w-full border-border/80 text-foreground hover:bg-accent h-12">
              Adicionar Signatário
            </Button>
            
            <div className="space-y-3 mt-4">
              {/* Signer 1 */}
              <div className="bg-muted border border-border rounded-lg p-3">
                <p className="font-bold text-foreground text-sm">João Silva <span className="font-normal text-muted-foreground">- joao@email.com</span></p>
                <p className="text-muted-foreground text-sm">(Assinante 1, Aguardando)</p>
              </div>
              {/* Signer 2 */}
              <div className="bg-muted border border-border rounded-lg p-3">
                <p className="font-bold text-foreground text-sm">Maria Costa <span className="font-normal text-muted-foreground">- maria@email.com</span></p>
                <p className="text-muted-foreground text-sm">(Assinante 2, Aguardando)</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 pb-2">
              <Checkbox id="order" className="border-primary data-[state=checked]:bg-primary" defaultChecked />
              <label
                htmlFor="order"
                className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
              >
                Definir ordem de assinatura
              </label>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-12 rounded-lg">
              Enviar para Assinatura
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex gap-4 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <LinkIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Compartilhar por Link</h4>
              <p className="text-sm text-muted-foreground mt-1">Compartilhar por Link de review aos compartihar por link.</p>
            </div>
          </div>
          
          <div className="flex gap-4 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Edit3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Assinatura Digital</h4>
              <p className="text-sm text-muted-foreground mt-1">Ponar uma assinatura digital assinatura digital.</p>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
