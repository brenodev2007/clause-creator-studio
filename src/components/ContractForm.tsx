import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractData } from "@/types/contract";
import { Plus, X, Upload, User, Building2, Landmark, FileEdit, ListPlus, ImagePlus, Pencil, Check, GripVertical } from "lucide-react";

interface ContractFormProps {
  data: ContractData;
  onChange: (data: ContractData) => void;
}

const ContractForm = ({ data, onChange }: ContractFormProps) => {
  const [newClause, setNewClause] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

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

  const startEditClause = (index: number) => {
    setEditingIndex(index);
    setEditingText(data.additionalClauses[index]);
  };

  const saveEditClause = () => {
    if (editingIndex !== null && editingText.trim()) {
      const updatedClauses = [...data.additionalClauses];
      updatedClauses[editingIndex] = editingText.trim();
      onChange({
        ...data,
        additionalClauses: updatedClauses,
      });
      setEditingIndex(null);
      setEditingText("");
    }
  };

  const cancelEditClause = () => {
    setEditingIndex(null);
    setEditingText("");
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
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-xl font-display font-semibold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <ListPlus className="w-5 h-5 text-accent" />
              </div>
              Cláusulas do Contrato
            </CardTitle>
            {data.additionalClauses.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                  {data.additionalClauses.length} cláusula{data.additionalClauses.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4 space-y-5">
          {/* Add new clause */}
          <div className="p-4 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-accent/20">
            <Label className="text-sm font-medium text-foreground mb-3 block">Adicionar nova cláusula</Label>
            <div className="flex gap-3">
              <Textarea
                value={newClause}
                onChange={(e) => setNewClause(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    addClause();
                  }
                }}
                placeholder="Digite o texto da cláusula aqui... (Ctrl+Enter para adicionar)"
                rows={3}
                className="flex-1 rounded-xl border-border/60 focus:border-accent bg-background resize-none"
              />
              <Button 
                onClick={addClause}
                disabled={!newClause.trim()}
                className="h-auto px-5 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1"
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs font-medium">Adicionar</span>
              </Button>
            </div>
          </div>

          {/* Clauses list */}
          {data.additionalClauses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Clique no ícone de lápis para editar</span>
              </div>
              {data.additionalClauses.map((clause, index) => (
                <div
                  key={index}
                  className={`rounded-xl border transition-all duration-300 ${
                    editingIndex === index 
                      ? 'border-primary bg-primary/5 shadow-glow' 
                      : 'border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-border'
                  }`}
                >
                  {editingIndex === index ? (
                    /* Editing mode */
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-primary">
                        <Pencil className="w-3.5 h-3.5" />
                        Editando cláusula {index + 1}
                      </div>
                      <Textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            saveEditClause();
                          }
                          if (e.key === 'Escape') {
                            cancelEditClause();
                          }
                        }}
                        rows={4}
                        className="rounded-xl border-primary/30 focus:border-primary bg-background resize-none"
                        autoFocus
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Ctrl+Enter para salvar • Esc para cancelar
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEditClause}
                            className="rounded-lg h-9 px-4"
                          >
                            <X className="w-4 h-4 mr-1.5" />
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={saveEditClause}
                            disabled={!editingText.trim()}
                            className="rounded-lg h-9 px-4 bg-primary hover:bg-primary/90"
                          >
                            <Check className="w-4 h-4 mr-1.5" />
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div className="flex items-start gap-3 p-4 group">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab" />
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                          {index + 1}
                        </span>
                      </div>
                      <p className="flex-1 text-sm leading-relaxed pt-1 text-foreground/90">{clause}</p>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditClause(index)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeClause(index)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {data.additionalClauses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ListPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma cláusula adicionada ainda</p>
              <p className="text-xs mt-1">Selecione um modelo ou adicione cláusulas personalizadas acima</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractForm;
