import { motion } from "framer-motion";
import { Download } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative w-full bg-background overflow-hidden min-h-[90vh] flex items-center">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-blue-600/10 via-primary/5 to-transparent rounded-full blur-[100px] mix-blend-screen" />
        
        {/* Subtle animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)] opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs md:text-sm font-semibold text-primary tracking-wide uppercase">O Futuro dos Contratos</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              <span className="block text-foreground mb-2">Descomplique</span>
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Seus Contratos
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Crie acordos blindados juridicamente em minutos. 
              Nossa tecnologia preenche, valida e exporta seus contratos automaticamente. Sem burocracia, sem dores de cabeça.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-secondary/50 border border-border backdrop-blur-md">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-amber-500">
                    {'★★★★★'}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-1">Mais de 10.000 usuários</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Visual (Modern UI Mockup) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden md:block"
          >
            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/20 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/10 rounded-full animate-[spin_90s_linear_infinite_reverse]" />

            <div className="relative w-full max-w-md mx-auto aspect-[3/4] preserve-3d perspective-1000">
              {/* Main Document Mockup */}
              <motion.div 
                animate={{ y: [-10, 10, -10], rotateX: [2, -2, 2], rotateY: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute inset-0 bg-card rounded-3xl border border-border/60 shadow-2xl overflow-hidden backdrop-blur-xl z-20 flex flex-col"
              >
                {/* Header */}
                <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-secondary/30">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="h-2 w-24 bg-muted rounded-full" />
                </div>
                
                {/* Body Content (Skeleton) */}
                <div className="flex-1 p-8 space-y-8 relative">
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-primary/20 rounded-full" />
                    <div className="h-4 w-1/2 bg-muted rounded-full" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-muted rounded-full" />
                    <div className="h-2 w-full bg-muted rounded-full" />
                    <div className="h-2 w-5/6 bg-muted rounded-full" />
                    <div className="h-2 w-4/6 bg-muted rounded-full" />
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="h-2 w-full bg-muted rounded-full" />
                    <div className="h-2 w-11/12 bg-muted rounded-full" />
                    <div className="h-2 w-3/4 bg-muted rounded-full" />
                  </div>

                  {/* Signature Area */}
                  <div className="absolute bottom-12 left-8 right-8 flex justify-between items-end">
                     <div className="w-32 border-b-2 border-muted pb-2">
                       <svg className="w-24 h-8 text-primary" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M10,30 Q30,10 50,25 T90,15" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                     </div>
                     <div className="w-24 h-24 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center relative translate-x-4 translate-y-4 shadow-lg shadow-green-500/20">
                       <span className="text-green-500 font-bold rotate-[-15deg] uppercase tracking-wider">Aprovado</span>
                     </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 1 - Notification */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" }}
                className="absolute top-12 -right-12 bg-background p-4 rounded-2xl border border-border shadow-xl z-30 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">PDF Gerado</div>
                  <div className="text-xs text-muted-foreground">Há 2 segundos</div>
                </div>
              </motion.div>

              {/* Floating Element 2 - Secure */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 2, ease: "easeInOut" }}
                className="absolute bottom-20 -left-16 bg-background p-4 rounded-2xl border border-border shadow-xl z-30 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="text-sm font-bold text-foreground">Assinatura Válida</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
