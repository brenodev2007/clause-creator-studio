import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");
    
    if (paymentId) {
      // Verify payment status
      fetch(`http://localhost:5000/api/payment/verify/${paymentId}`)
        .then(res => res.json())
        .then(data => {
          setPaymentStatus(data.status);
          setVerifying(false);
        })
        .catch(err => {
          console.error("Error verifying payment:", err);
          setVerifying(false);
        });
    } else {
      setVerifying(false);
    }
  }, [searchParams]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Verificando pagamento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Pagamento Aprovado!</CardTitle>
          <CardDescription>
            Seu plano foi atualizado com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Status do Pagamento</p>
            <p className="text-lg font-semibold text-green-600">
              {paymentStatus === "approved" ? "Aprovado" : "Processando"}
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Seus novos tokens já estão disponíveis. Aproveite todos os recursos do seu plano!
          </p>

          <Button 
            onClick={() => navigate("/")} 
            className="w-full"
          >
            Voltar ao Início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
