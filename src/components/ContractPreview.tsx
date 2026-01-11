import { forwardRef } from "react";
import { ContractData } from "@/types/contract";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContractPreviewProps {
  data: ContractData;
}

const ContractPreview = forwardRef<HTMLDivElement, ContractPreviewProps>(
  ({ data }, ref) => {
    const formatDate = (dateString: string) => {
      if (!dateString) return "___/___/______";
      try {
        return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      } catch {
        return dateString;
      }
    };

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };

    const paymentMethodLabels: Record<string, string> = {
      pix: "PIX",
      boleto: "Boleto Bancário",
      cartao: "Cartão de Crédito",
      transferencia: "Transferência Bancária",
      parcelado: "Parcelado",
    };

    const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    return (
      <div
        ref={ref}
        className="bg-white p-8 md:p-12 shadow-medium rounded-lg max-w-4xl mx-auto"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {/* Header with Logo */}
        <div className="text-center mb-8 border-b-2 border-primary pb-6">
          {data.logo && (
            <img
              src={data.logo}
              alt="Logo"
              className="h-20 object-contain mx-auto mb-4"
            />
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-wide">
            CONTRATO DE PRESTAÇÃO DE SERVIÇOS
          </h1>
        </div>

        {/* Contract Body */}
        <div className="space-y-6 text-foreground leading-relaxed">
          {/* Parties */}
          <section>
            <h2 className="text-lg font-bold mb-3 text-primary">DAS PARTES</h2>
            <p className="text-justify">
              <strong>CONTRATANTE:</strong> {data.client.name || "[Nome do Cliente]"},{" "}
              inscrito(a) no CPF/CNPJ sob o nº {data.client.document || "[Documento]"},{" "}
              residente e domiciliado(a) em {data.client.address || "[Endereço]"},{" "}
              com e-mail {data.client.email || "[E-mail]"} e telefone{" "}
              {data.client.phone || "[Telefone]"}.
            </p>
          </section>

          {/* Object */}
          <section>
            <h2 className="text-lg font-bold mb-3 text-primary">DO OBJETO</h2>
            <p className="text-justify">
              <strong>Cláusula 1ª:</strong> O presente contrato tem como objeto a
              prestação dos seguintes serviços:
            </p>
            <p className="mt-2 p-4 bg-muted rounded-lg text-justify">
              {data.serviceDescription || "[Descrição do serviço]"}
            </p>
          </section>

          {/* Price */}
          <section>
            <h2 className="text-lg font-bold mb-3 text-primary">DO VALOR E PAGAMENTO</h2>
            <p className="text-justify">
              <strong>Cláusula 2ª:</strong> Pelos serviços prestados, o CONTRATANTE pagará
              ao CONTRATADO o valor total de{" "}
              <strong>{formatCurrency(data.price || 0)}</strong>{" "}
              ({data.price ? extenso(data.price) : "zero reais"}), a ser pago via{" "}
              <strong>{paymentMethodLabels[data.paymentMethod] || "[Forma de pagamento]"}</strong>.
            </p>
          </section>

          {/* Deadline */}
          <section>
            <h2 className="text-lg font-bold mb-3 text-primary">DO PRAZO</h2>
            <p className="text-justify">
              <strong>Cláusula 3ª:</strong> O presente contrato terá início em{" "}
              <strong>{formatDate(data.startDate)}</strong> e prazo de entrega até{" "}
              <strong>{formatDate(data.deadline)}</strong>.
            </p>
          </section>

          {/* Additional Clauses */}
          {data.additionalClauses.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 text-primary">CLÁUSULAS ADICIONAIS</h2>
              {data.additionalClauses.map((clause, index) => (
                <p key={index} className="text-justify mb-2">
                  <strong>Cláusula {4 + index}ª:</strong> {clause}
                </p>
              ))}
            </section>
          )}

          {/* General Provisions */}
          <section>
            <h2 className="text-lg font-bold mb-3 text-primary">DISPOSIÇÕES GERAIS</h2>
            <p className="text-justify">
              <strong>Cláusula {4 + data.additionalClauses.length}ª:</strong> As partes
              elegem o foro da comarca do CONTRATADO para dirimir quaisquer questões
              oriundas deste contrato, com renúncia expressa a qualquer outro, por mais
              privilegiado que seja.
            </p>
          </section>

          {/* Signature */}
          <section className="mt-12 pt-8 border-t">
            <p className="text-center mb-12">
              E, por estarem assim justas e contratadas, as partes assinam o presente
              instrumento em duas vias de igual teor e forma.
            </p>
            <p className="text-center mb-16">
              _________________, {today}
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div className="text-center">
                <div className="border-t border-foreground pt-2 mx-8">
                  <p className="font-bold">CONTRATANTE</p>
                  <p className="text-sm text-muted-foreground">
                    {data.client.name || "[Nome]"}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-foreground pt-2 mx-8">
                  <p className="font-bold">CONTRATADO</p>
                  <p className="text-sm text-muted-foreground">
                    [Nome do Contratado]
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
);

// Helper function to convert number to words in Portuguese (simplified)
function extenso(valor: number): string {
  if (valor === 0) return "zero reais";
  
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const especiais = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  const parteInteira = Math.floor(valor);
  
  if (parteInteira === 100) return "cem reais";
  
  let resultado = "";
  
  if (parteInteira >= 1000) {
    const milhares = Math.floor(parteInteira / 1000);
    resultado += milhares === 1 ? "mil" : `${extensoAux(milhares)} mil`;
    const resto = parteInteira % 1000;
    if (resto > 0) {
      resultado += resto < 100 ? " e " : " ";
    }
  }
  
  const resto = parteInteira % 1000;
  if (resto > 0) {
    resultado += extensoAux(resto);
  }
  
  resultado += parteInteira === 1 ? " real" : " reais";
  
  return resultado;
  
  function extensoAux(n: number): string {
    if (n === 0) return "";
    if (n === 100) return "cem";
    
    let s = "";
    
    if (n >= 100) {
      s += centenas[Math.floor(n / 100)];
      n = n % 100;
      if (n > 0) s += " e ";
    }
    
    if (n >= 20) {
      s += dezenas[Math.floor(n / 10)];
      n = n % 10;
      if (n > 0) s += " e ";
    } else if (n >= 10) {
      s += especiais[n - 10];
      return s;
    }
    
    if (n > 0) {
      s += unidades[n];
    }
    
    return s;
  }
}

ContractPreview.displayName = "ContractPreview";

export default ContractPreview;
