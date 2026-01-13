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
        className="bg-white p-10 md:p-12 border border-border rounded-lg max-w-3xl mx-auto"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {/* Header */}
        <div className="text-center mb-10 pb-8 border-b border-border">
          {data.logo && (
            <img
              src={data.logo}
              alt="Logo"
              className="h-16 object-contain mx-auto mb-6"
            />
          )}
          <h1 className="text-xl font-bold tracking-wide uppercase text-foreground">
            Contrato de Prestação de Serviços
          </h1>
        </div>

        {/* Contract Body */}
        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          {/* Parties */}
          <section>
            <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">
              Das Partes
            </h2>
            <div className="space-y-3">
              <p className="text-justify">
                <strong>CONTRATADO:</strong> {data.contractor.name || "[Nome da Empresa]"},{" "}
                inscrito no CNPJ sob o nº {data.contractor.cnpj || "[CNPJ]"},{" "}
                com sede em {data.contractor.address || "[Endereço Comercial]"},{" "}
                e-mail {data.contractor.email || "[E-mail]"} e telefone{" "}
                {data.contractor.phone || "[Telefone]"}.
              </p>
              <p className="text-justify">
                <strong>CONTRATANTE:</strong> {data.client.name || "[Nome do Cliente]"},{" "}
                inscrito no CPF/CNPJ sob o nº {data.client.document || "[Documento]"},{" "}
                residente e domiciliado em {data.client.address || "[Endereço]"},{" "}
                e-mail {data.client.email || "[E-mail]"} e telefone{" "}
                {data.client.phone || "[Telefone]"}.
              </p>
            </div>
          </section>

          {/* Object */}
          <section>
            <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">
              Do Objeto
            </h2>
            <p className="text-justify">
              <strong>Cláusula 1ª:</strong> O presente contrato tem como objeto a
              prestação dos seguintes serviços:
            </p>
            <div className="mt-3 p-4 bg-secondary/50 rounded text-justify">
              {data.serviceDescription || "[Descrição do serviço a ser prestado]"}
            </div>
          </section>

          {/* Price */}
          <section>
            <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">
              Do Valor e Pagamento
            </h2>
            <p className="text-justify">
              <strong>Cláusula 2ª:</strong> Pelos serviços prestados, o CONTRATANTE pagará
              ao CONTRATADO o valor total de{" "}
              <strong>{formatCurrency(data.price || 0)}</strong>{" "}
              ({data.price ? extenso(data.price) : "zero reais"}), a ser pago via{" "}
              <strong>{paymentMethodLabels[data.paymentMethod] || "[Forma de pagamento]"}</strong>.
            </p>
            {(data.contractor.bankName || data.contractor.pixKey) && (
              <div className="mt-3 p-4 bg-secondary/50 rounded">
                <p className="font-semibold mb-2">Dados para Pagamento:</p>
                {data.contractor.bankName && (
                  <p>
                    Banco: {data.contractor.bankName} | Agência: {data.contractor.bankAgency || "-"} | Conta: {data.contractor.bankAccount || "-"}
                  </p>
                )}
                {data.contractor.pixKey && (
                  <p className="mt-1">
                    Chave PIX: {data.contractor.pixKey}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Deadline */}
          <section>
            <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">
              Do Prazo
            </h2>
            <p className="text-justify">
              <strong>Cláusula 3ª:</strong> O presente contrato terá início em{" "}
              <strong>{formatDate(data.startDate)}</strong> e prazo de entrega até{" "}
              <strong>{formatDate(data.deadline)}</strong>.
            </p>
          </section>

          {/* Additional Clauses */}
          {data.additionalClauses.length > 0 && (
            <section>
              <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">
                Cláusulas Adicionais
              </h2>
              <div className="space-y-3">
                {data.additionalClauses.map((clause, index) => (
                  <p key={index} className="text-justify">
                    <strong>Cláusula {4 + index}ª:</strong> {clause}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* General Provisions */}
          <section>
            <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">
              Disposições Gerais
            </h2>
            <p className="text-justify">
              <strong>Cláusula {4 + data.additionalClauses.length}ª:</strong> As partes
              elegem o foro da comarca do CONTRATADO para dirimir quaisquer questões
              oriundas deste contrato, com renúncia expressa a qualquer outro, por mais
              privilegiado que seja.
            </p>
          </section>

          {/* Signature */}
          <section className="mt-12 pt-8 border-t border-border">
            <p className="text-center mb-10 italic text-muted-foreground">
              E, por estarem assim justas e contratadas, as partes assinam o presente
              instrumento em duas vias de igual teor e forma.
            </p>
            <p className="text-center mb-12">
              _________________, {today}
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div className="text-center">
                {data.clientSignature ? (
                  <div className="mb-2">
                    <img 
                      src={data.clientSignature} 
                      alt="Assinatura do Contratante" 
                      className="h-16 object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="h-16 mb-2" />
                )}
                <div className="border-t border-foreground pt-3 mx-4">
                  <p className="font-bold">CONTRATANTE</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.client.name || "[Nome]"}
                  </p>
                </div>
              </div>
              <div className="text-center">
                {data.contractorSignature ? (
                  <div className="mb-2">
                    <img 
                      src={data.contractorSignature} 
                      alt="Assinatura do Contratado" 
                      className="h-16 object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="h-16 mb-2" />
                )}
                <div className="border-t border-foreground pt-3 mx-4">
                  <p className="font-bold">CONTRATADO</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.contractor.name || "[Nome do Contratado]"}
                  </p>
                  {data.contractor.cnpj && (
                    <p className="text-xs text-muted-foreground">
                      CNPJ: {data.contractor.cnpj}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
);

// Helper function to convert number to words in Portuguese
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
