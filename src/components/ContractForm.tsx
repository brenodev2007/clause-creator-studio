import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractData } from "@/types/contract";
import { Plus, X, Upload, User, Building2, Landmark, FileEdit, ListPlus, ImagePlus } from "lucide-react";

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

  const handleContractorChange = (field: keyof ContractData["contractor"], value: string) => {
    onChange({
      ...data,
      contractor: { ...data.contractor, [field]: value },
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
      <Card className="shadow-soft border-0 bg-card rounded-2xl overflow-hidden animate-fade-in">
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="text-xl font-display font-semibold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <ImagePlus className="w-5 h-5 text-primary" />
            </div>
            Logo da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <label className="block cursor-pointer">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              data.logo 
                ? "border-primary/30 bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            }`}>
              {data.logo ? (
                <div className="flex flex-col items-center gap-4">
                  <img src={data.logo} alt="Logo" className="h-20 object-contain rounded-lg" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onChange({ ...data, logo: null });
                    }}
                    className="rounded-lg"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remover logo
                  </Button>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
                    <Upload className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground">Clique para fazer upload</p>
                  <p className="text-sm mt-1">PNG, JPG ou SVG até 5MB</p>
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
        </CardContent>
      </Card>

      {/* Contractor Info */}
      <Card className="shadow-soft border-0 bg-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: "0.05s" }}>
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="text-xl font-display font-semibold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            Dados do Contratado
            <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full ml-2">Sua Empresa</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractorName" className="text-sm font-medium">Razão Social</Label>
              <Input
                id="contractorName"
                value={data.contractor.name}
                onChange={(e) => handleContractorChange("name", e.target.value)}
                placeholder="Nome da sua empresa"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj" className="text-sm font-medium">CNPJ</Label>
              <Input
                id="cnpj"
                value={data.contractor.cnpj}
                onChange={(e) => handleContractorChange("cnpj", e.target.value)}
                placeholder="00.000.000/0000-00"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractorEmail" className="text-sm font-medium">E-mail</Label>
              <Input
                id="contractorEmail"
                type="email"
                value={data.contractor.email}
                onChange={(e) => handleContractorChange("email", e.target.value)}
                placeholder="contato@empresa.com"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractorPhone" className="text-sm font-medium">Telefone</Label>
              <Input
                id="contractorPhone"
                value={data.contractor.phone}
                onChange={(e) => handleContractorChange("phone", e.target.value)}
                placeholder="(00) 00000-0000"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractorAddress" className="text-sm font-medium">Endereço Comercial</Label>
            <Input
              id="contractorAddress"
              value={data.contractor.address}
              onChange={(e) => handleContractorChange("address", e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF, CEP"
              className="rounded-xl h-11 border-border/60 focus:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Info */}
      <Card className="shadow-soft border-0 bg-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="text-xl font-display font-semibold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <Landmark className="w-5 h-5 text-accent" />
            </div>
            Dados Bancários
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-sm font-medium">Banco</Label>
              <Input
                id="bankName"
                value={data.contractor.bankName}
                onChange={(e) => handleContractorChange("bankName", e.target.value)}
                placeholder="Nome do banco"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAgency" className="text-sm font-medium">Agência</Label>
              <Input
                id="bankAgency"
                value={data.contractor.bankAgency}
                onChange={(e) => handleContractorChange("bankAgency", e.target.value)}
                placeholder="0000"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccount" className="text-sm font-medium">Conta</Label>
              <Input
                id="bankAccount"
                value={data.contractor.bankAccount}
                onChange={(e) => handleContractorChange("bankAccount", e.target.value)}
                placeholder="00000-0"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pixKey" className="text-sm font-medium">Chave PIX</Label>
            <Input
              id="pixKey"
              value={data.contractor.pixKey}
              onChange={(e) => handleContractorChange("pixKey", e.target.value)}
              placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
              className="rounded-xl h-11 border-border/60 focus:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card className="shadow-soft border-0 bg-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: "0.15s" }}>
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="text-xl font-display font-semibold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-success/10">
              <User className="w-5 h-5 text-success" />
            </div>
            Dados do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome Completo / Razão Social</Label>
              <Input
                id="name"
                value={data.client.name}
                onChange={(e) => handleClientChange("name", e.target.value)}
                placeholder="Nome do cliente"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document" className="text-sm font-medium">CPF / CNPJ</Label>
              <Input
                id="document"
                value={data.client.document}
                onChange={(e) => handleClientChange("document", e.target.value)}
                placeholder="000.000.000-00"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={data.client.email}
                onChange={(e) => handleClientChange("email", e.target.value)}
                placeholder="email@exemplo.com"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
              <Input
                id="phone"
                value={data.client.phone}
                onChange={(e) => handleClientChange("phone", e.target.value)}
                placeholder="(00) 00000-0000"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">Endereço</Label>
            <Input
              id="address"
              value={data.client.address}
              onChange={(e) => handleClientChange("address", e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF"
              className="rounded-xl h-11 border-border/60 focus:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contract Details */}
      <Card className="shadow-soft border-0 bg-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="text-xl font-display font-semibold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-warning/10">
              <FileEdit className="w-5 h-5 text-warning" />
            </div>
            Detalhes do Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceDescription" className="text-sm font-medium">Descrição do Serviço</Label>
            <Textarea
              id="serviceDescription"
              value={data.serviceDescription}
              onChange={(e) => handleChange("serviceDescription", e.target.value)}
              placeholder="Descreva detalhadamente o serviço a ser prestado..."
              rows={4}
              className="rounded-xl border-border/60 focus:border-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Valor Total (R$)</Label>
              <Input
                id="price"
                type="number"
                value={data.price || ""}
                onChange={(e) => handleChange("price", formatCurrency(e.target.value))}
                placeholder="0,00"
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-sm font-medium">Forma de Pagamento</Label>
              <Select
                value={data.paymentMethod}
                onValueChange={(value) => handleChange("paymentMethod", value)}
              >
                <SelectTrigger className="rounded-xl h-11 border-border/60">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto Bancário</SelectItem>
                  <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                  <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                  <SelectItem value="parcelado">Parcelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={data.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium">Prazo de Entrega</Label>
              <Input
                id="deadline"
                type="date"
                value={data.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                className="rounded-xl h-11 border-border/60 focus:border-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Clauses */}
      <Card className="shadow-soft border-0 bg-card rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: "0.25s" }}>
        <CardHeader className="pb-2 pt-6 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-display font-semibold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-destructive/10">
                <ListPlus className="w-5 h-5 text-destructive" />
              </div>
              Cláusulas Adicionais
            </CardTitle>
            {data.additionalClauses.length > 0 && (
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                {data.additionalClauses.length} cláusula{data.additionalClauses.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4 space-y-4">
          <div className="flex gap-3">
            <Textarea
              value={newClause}
              onChange={(e) => setNewClause(e.target.value)}
              placeholder="Digite uma cláusula adicional para incluir no contrato..."
              rows={3}
              className="flex-1 rounded-xl border-border/60 focus:border-primary resize-none"
            />
            <Button 
              onClick={addClause} 
              size="icon" 
              className="h-auto aspect-square btn-premium rounded-xl shadow-glow"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          {data.additionalClauses.length > 0 && (
            <div className="space-y-3 pt-2">
              {data.additionalClauses.map((clause, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl animate-scale-in group hover:bg-secondary transition-colors"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm leading-relaxed pt-1">{clause}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeClause(index)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
