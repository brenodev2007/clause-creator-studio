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
        className="bg-white p-10 md:p-14 shadow-strong rounded-2xl max-w-4xl mx-auto"
        style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
      >
        {/* Header with Logo */}
        <div className="text-center mb-10 pb-8 border-b-2" style={{ borderColor: 'hsl(221, 83%, 53%)' }}>
          {data.logo && (
            <img
              src={data.logo}
              alt="Logo"
              className="h-24 object-contain mx-auto mb-6"
            />
          )}
          <h1 
            className="text-2xl md:text-3xl font-bold tracking-wider uppercase"
            style={{ color: 'hsl(221, 83%, 53%)' }}
          >
            Contrato de Prestação de Serviços
          </h1>
        </div>

        {/* Contract Body */}
        <div className="space-y-8 leading-relaxed" style={{ color: 'hsl(222, 47%, 11%)' }}>
          {/* Parties */}
          <section>
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b"
              style={{ color: 'hsl(221, 83%, 53%)', borderColor: 'hsl(221, 83%, 53%, 0.2)' }}
            >
              Das Partes
            </h2>
            <div className="space-y-4">
              <p className="text-justify leading-7">
                <strong className="font-semibold">CONTRATADO:</strong> {data.contractor.name || "[Nome da Empresa]"},{" "}
                inscrito no CNPJ sob o nº {data.contractor.cnpj || "[CNPJ]"},{" "}
                com sede em {data.contractor.address || "[Endereço Comercial]"},{" "}
                e-mail {data.contractor.email || "[E-mail]"} e telefone{" "}
                {data.contractor.phone || "[Telefone]"}.
              </p>
              <p className="text-justify leading-7">
                <strong className="font-semibold">CONTRATANTE:</strong> {data.client.name || "[Nome do Cliente]"},{" "}
                inscrito no CPF/CNPJ sob o nº {data.client.document || "[Documento]"},{" "}
                residente e domiciliado em {data.client.address || "[Endereço]"},{" "}
                e-mail {data.client.email || "[E-mail]"} e telefone{" "}
                {data.client.phone || "[Telefone]"}.
              </p>
            </div>
          </section>

          {/* Object */}
          <section>
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b"
              style={{ color: 'hsl(221, 83%, 53%)', borderColor: 'hsl(221, 83%, 53%, 0.2)' }}
            >
              Do Objeto
            </h2>
            <p className="text-justify leading-7">
              <strong className="font-semibold">Cláusula 1ª:</strong> O presente contrato tem como objeto a
              prestação dos seguintes serviços:
            </p>
            <div 
              className="mt-4 p-5 rounded-xl text-justify leading-7"
              style={{ backgroundColor: 'hsl(220, 25%, 97%)' }}
            >
              {data.serviceDescription || "[Descrição do serviço a ser prestado]"}
            </div>
          </section>

          {/* Price */}
          <section>
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b"
              style={{ color: 'hsl(221, 83%, 53%)', borderColor: 'hsl(221, 83%, 53%, 0.2)' }}
            >
              Do Valor e Pagamento
            </h2>
            <p className="text-justify leading-7">
              <strong className="font-semibold">Cláusula 2ª:</strong> Pelos serviços prestados, o CONTRATANTE pagará
              ao CONTRATADO o valor total de{" "}
              <strong className="font-semibold">{formatCurrency(data.price || 0)}</strong>{" "}
              ({data.price ? extenso(data.price) : "zero reais"}), a ser pago via{" "}
              <strong className="font-semibold">{paymentMethodLabels[data.paymentMethod] || "[Forma de pagamento]"}</strong>.
            </p>
            {(data.contractor.bankName || data.contractor.pixKey) && (
              <div 
                className="mt-4 p-5 rounded-xl"
                style={{ backgroundColor: 'hsl(220, 25%, 97%)' }}
              >
                <p className="font-semibold mb-3" style={{ color: 'hsl(221, 83%, 53%)' }}>
                  Dados para Pagamento:
                </p>
                {data.contractor.bankName && (
                  <p className="leading-7">
                    <strong>Banco:</strong> {data.contractor.bankName}{" "}
                    &nbsp;•&nbsp; <strong>Agência:</strong> {data.contractor.bankAgency || "-"}{" "}
                    &nbsp;•&nbsp; <strong>Conta:</strong> {data.contractor.bankAccount || "-"}
                  </p>
                )}
                {data.contractor.pixKey && (
                  <p className="leading-7 mt-1">
                    <strong>Chave PIX:</strong> {data.contractor.pixKey}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Deadline */}
          <section>
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b"
              style={{ color: 'hsl(221, 83%, 53%)', borderColor: 'hsl(221, 83%, 53%, 0.2)' }}
            >
              Do Prazo
            </h2>
            <p className="text-justify leading-7">
              <strong className="font-semibold">Cláusula 3ª:</strong> O presente contrato terá início em{" "}
              <strong className="font-semibold">{formatDate(data.startDate)}</strong> e prazo de entrega até{" "}
              <strong className="font-semibold">{formatDate(data.deadline)}</strong>.
            </p>
          </section>

          {/* Additional Clauses */}
          {data.additionalClauses.length > 0 && (
            <section>
              <h2 
                className="text-xl font-bold mb-4 pb-2 border-b"
                style={{ color: 'hsl(221, 83%, 53%)', borderColor: 'hsl(221, 83%, 53%, 0.2)' }}
              >
                Cláusulas Adicionais
              </h2>
              <div className="space-y-4">
                {data.additionalClauses.map((clause, index) => (
                  <p key={index} className="text-justify leading-7">
                    <strong className="font-semibold">Cláusula {4 + index}ª:</strong> {clause}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* General Provisions */}
          <section>
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b"
              style={{ color: 'hsl(221, 83%, 53%)', borderColor: 'hsl(221, 83%, 53%, 0.2)' }}
            >
              Disposições Gerais
            </h2>
            <p className="text-justify leading-7">
              <strong className="font-semibold">Cláusula {4 + data.additionalClauses.length}ª:</strong> As partes
              elegem o foro da comarca do CONTRATADO para dirimir quaisquer questões
              oriundas deste contrato, com renúncia expressa a qualquer outro, por mais
              privilegiado que seja.
            </p>
          </section>

          {/* Signature */}
          <section className="mt-16 pt-10 border-t-2" style={{ borderColor: 'hsl(220, 13%, 91%)' }}>
            <p className="text-center mb-12 leading-7 italic" style={{ color: 'hsl(220, 9%, 46%)' }}>
              E, por estarem assim justas e contratadas, as partes assinam o presente
              instrumento em duas vias de igual teor e forma.
            </p>
            <p className="text-center mb-16 font-medium">
              _________________, {today}
            </p>
            <div className="grid grid-cols-2 gap-16">
              <div className="text-center">
                <div 
                  className="border-t-2 pt-4 mx-4"
                  style={{ borderColor: 'hsl(222, 47%, 11%)' }}
                >
                  <p className="font-bold text-lg">CONTRATANTE</p>
                  <p className="text-sm mt-2" style={{ color: 'hsl(220, 9%, 46%)' }}>
                    {data.client.name || "[Nome]"}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="border-t-2 pt-4 mx-4"
                  style={{ borderColor: 'hsl(222, 47%, 11%)' }}
                >
                  <p className="font-bold text-lg">CONTRATADO</p>
                  <p className="text-sm mt-2" style={{ color: 'hsl(220, 9%, 46%)' }}>
                    {data.contractor.name || "[Nome do Contratado]"}
                  </p>
                  {data.contractor.cnpj && (
                    <p className="text-xs mt-1" style={{ color: 'hsl(220, 9%, 56%)' }}>
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
