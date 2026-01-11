import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractData } from "@/types/contract";
import { Plus, X, Upload, FileText } from "lucide-react";

interface ContractFormProps {
  data: ContractData;
  onChange: (data: ContractData) => void;
}

const ContractForm = ({ data, onChange }: ContractFormProps) => {
  const [newClause, setNewClause] = useState("");

  const handleClientChange = (field: keyof ContractData["client"], value: string) => {
    onChange({
      ...data,
      client: { ...data.client, [field]: value },
    });
  };

  const handleChange = (field: keyof ContractData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  const addClause = () => {
    if (newClause.trim()) {
      onChange({
        ...data,
        additionalClauses: [...data.additionalClauses, newClause.trim()],
      });
      setNewClause("");
    }
  };

  const removeClause = (index: number) => {
    onChange({
      ...data,
      additionalClauses: data.additionalClauses.filter((_, i) => i !== index),
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = value.replace(/\D/g, "");
    return numValue ? parseFloat(numValue) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <Card className="shadow-soft border-0 animate-fade-in">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Logo da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                {data.logo ? (
                  <div className="flex items-center justify-center gap-4">
                    <img src={data.logo} alt="Logo" className="h-16 object-contain" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        onChange({ ...data, logo: null });
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p>Clique para fazer upload do logo</p>
                    <p className="text-sm">PNG, JPG até 5MB</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card className="shadow-soft border-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Dados do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo / Razão Social</Label>
              <Input
                id="name"
                value={data.client.name}
                onChange={(e) => handleClientChange("name", e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">CPF / CNPJ</Label>
              <Input
                id="document"
                value={data.client.document}
                onChange={(e) => handleClientChange("document", e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={data.client.email}
                onChange={(e) => handleClientChange("email", e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={data.client.phone}
                onChange={(e) => handleClientChange("phone", e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={data.client.address}
              onChange={(e) => handleClientChange("address", e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contract Details */}
      <Card className="shadow-soft border-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Detalhes do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceDescription">Descrição do Serviço</Label>
            <Textarea
              id="serviceDescription"
              value={data.serviceDescription}
              onChange={(e) => handleChange("serviceDescription", e.target.value)}
              placeholder="Descreva o serviço a ser prestado..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Valor Total (R$)</Label>
              <Input
                id="price"
                type="number"
                value={data.price || ""}
                onChange={(e) => handleChange("price", formatCurrency(e.target.value))}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select
                value={data.paymentMethod}
                onValueChange={(value) => handleChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                  <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                  <SelectItem value="parcelado">Parcelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={data.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo de Entrega</Label>
              <Input
                id="deadline"
                type="date"
                value={data.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Clauses */}
      <Card className="shadow-soft border-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Cláusulas Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              value={newClause}
              onChange={(e) => setNewClause(e.target.value)}
              placeholder="Digite uma cláusula adicional..."
              rows={2}
              className="flex-1"
            />
            <Button onClick={addClause} size="icon" className="h-auto gradient-primary">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          {data.additionalClauses.length > 0 && (
            <div className="space-y-2">
              {data.additionalClauses.map((clause, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-secondary rounded-lg animate-scale-in"
                >
                  <span className="flex-1 text-sm">{clause}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeClause(index)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractForm;
