import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background relative overflow-hidden mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col items-start space-y-6">
            <img src="/logo.png" alt="Logo" className="h-24 w-auto object-contain" />
            <p className="text-base text-muted-foreground leading-relaxed">
              Crie contratos profissionais de forma rápida e simples. 
              Personalize, assine e exporte em PDF com validade jurídica.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Recursos Essenciais</h4>
            <ul className="space-y-4 text-base text-muted-foreground">
              {['Modelos pré-configurados', 'Validação de CPF/CNPJ', 'Assinatura digital', 'Exportação em PDF'].map((item, i) => (
                <motion.li 
                  key={i}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 cursor-default"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Informações</h4>
            <ul className="space-y-4 text-base text-muted-foreground">
              {['Dados salvos localmente', 'Histórico de contratos', 'Tema claro e escuro'].map((item, i) => (
                <motion.li 
                  key={i}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 cursor-default"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span className="font-medium">© {new Date().getFullYear()} Contratos. Todos os direitos reservados.</span>
            <span className="flex items-center gap-2">
              Feito pela CodeWork
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
