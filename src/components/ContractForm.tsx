import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractData } from "@/types/contract";
import { Plus, X, Upload, Pencil, Check } from "lucide-react";
import { maskCNPJ, maskCPFOrCNPJ, maskPhone, maskBankAgency, maskBankAccount } from "@/hooks/use-input-masks";

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

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="font-semibold text-foreground mb-4">{children}</h3>
  );

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <section className="border border-border rounded-lg bg-card p-6 animate-in">
        <SectionTitle>Logo da Empresa</SectionTitle>
        <label className="block cursor-pointer">
          <div className={`border border-dashed rounded-lg p-6 text-center transition-colors ${
            data.logo 
              ? "border-foreground/30 bg-foreground/5" 
              : "border-border hover:border-foreground/30"
          }`}>
            {data.logo ? (
              <div className="flex flex-col items-center gap-3">
                <img src={data.logo} alt="Logo" className="h-16 object-contain" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange({ ...data, logo: null });
                  }}
                  className="h-8 text-xs"
                >
                  <X className="w-3 h-3 mr-1.5" />
                  Remover
                </Button>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <Upload className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Clique para fazer upload</p>
                <p className="text-xs mt-1">PNG, JPG ou SVG</p>
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
      </section>

      {/* Contractor Info */}
      <section className="border border-border rounded-lg bg-card p-6 animate-in">
        <SectionTitle>Dados do Contratado</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contractorName" className="text-sm">Razão Social</Label>
            <Input
              id="contractorName"
              value={data.contractor.name}
              onChange={(e) => handleContractorChange("name", e.target.value)}
              placeholder="Nome da empresa"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj" className="text-sm">CNPJ</Label>
            <Input
              id="cnpj"
              value={data.contractor.cnpj}
              onChange={(e) => handleContractorChange("cnpj", maskCNPJ(e.target.value))}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractorEmail" className="text-sm">E-mail</Label>
            <Input
              id="contractorEmail"
              type="email"
              value={data.contractor.email}
              onChange={(e) => handleContractorChange("email", e.target.value)}
              placeholder="contato@empresa.com"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractorPhone" className="text-sm">Telefone</Label>
            <Input
              id="contractorPhone"
              value={data.contractor.phone}
              onChange={(e) => handleContractorChange("phone", maskPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className="h-10"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contractorAddress" className="text-sm">Endereço</Label>
            <Input
              id="contractorAddress"
              value={data.contractor.address}
              onChange={(e) => handleContractorChange("address", e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF, CEP"
              className="h-10"
            />
          </div>
        </div>
      </section>

      {/* Bank Info */}
      <section className="border border-border rounded-lg bg-card p-6 animate-in">
        <SectionTitle>Dados Bancários</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankName" className="text-sm">Banco</Label>
            <Input
              id="bankName"
              value={data.contractor.bankName}
              onChange={(e) => handleContractorChange("bankName", e.target.value)}
              placeholder="Nome do banco"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankAgency" className="text-sm">Agência</Label>
            <Input
              id="bankAgency"
              value={data.contractor.bankAgency}
              onChange={(e) => handleContractorChange("bankAgency", maskBankAgency(e.target.value))}
              placeholder="0000-0"
              maxLength={6}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankAccount" className="text-sm">Conta</Label>
            <Input
              id="bankAccount"
              value={data.contractor.bankAccount}
              onChange={(e) => handleContractorChange("bankAccount", maskBankAccount(e.target.value))}
              placeholder="00000-0"
              maxLength={14}
              className="h-10"
            />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="pixKey" className="text-sm">Chave PIX</Label>
            <Input
              id="pixKey"
              value={data.contractor.pixKey}
              onChange={(e) => handleContractorChange("pixKey", e.target.value)}
              placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
              className="h-10"
            />
          </div>
        </div>
      </section>

      {/* Client Info */}
      <section className="border border-border rounded-lg bg-card p-6 animate-in">
        <SectionTitle>Dados do Cliente</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Nome / Razão Social</Label>
            <Input
              id="name"
              value={data.client.name}
              onChange={(e) => handleClientChange("name", e.target.value)}
              placeholder="Nome do cliente"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document" className="text-sm">CPF / CNPJ</Label>
            <Input
              id="document"
              value={data.client.document}
              onChange={(e) => handleClientChange("document", maskCPFOrCNPJ(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={18}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={data.client.email}
              onChange={(e) => handleClientChange("email", e.target.value)}
              placeholder="email@exemplo.com"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm">Telefone</Label>
            <Input
              id="phone"
              value={data.client.phone}
              onChange={(e) => handleClientChange("phone", maskPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className="h-10"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address" className="text-sm">Endereço</Label>
            <Input
              id="address"
              value={data.client.address}
              onChange={(e) => handleClientChange("address", e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF"
              className="h-10"
            />
          </div>
        </div>
      </section>

      {/* Contract Details */}
      <section className="border border-border rounded-lg bg-card p-6 animate-in">
        <SectionTitle>Detalhes do Contrato</SectionTitle>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceDescription" className="text-sm">Descrição do Serviço</Label>
            <Textarea
              id="serviceDescription"
              value={data.serviceDescription}
              onChange={(e) => handleChange("serviceDescription", e.target.value)}
              placeholder="Descreva detalhadamente o serviço..."
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm">Valor Total (R$)</Label>
              <Input
                id="price"
                type="number"
                value={data.price || ""}
                onChange={(e) => handleChange("price", formatCurrency(e.target.value))}
                placeholder="0,00"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-sm">Forma de Pagamento</Label>
              <Select
                value={data.paymentMethod}
                onValueChange={(value) => handleChange("paymentMethod", value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="startDate" className="text-sm">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={data.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm">Prazo de Entrega</Label>
              <Input
                id="deadline"
                type="date"
                value={data.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                className="h-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Clauses */}
      <section className="border border-border rounded-lg bg-card p-6 animate-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Cláusulas</h3>
          {data.additionalClauses.length > 0 && (
            <span className="tag-minimal">
              {data.additionalClauses.length} cláusula{data.additionalClauses.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Add new clause */}
        <div className="mb-4">
          <div className="flex gap-2">
            <Textarea
              value={newClause}
              onChange={(e) => setNewClause(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  addClause();
                }
              }}
              placeholder="Digite o texto da cláusula... (Ctrl+Enter para adicionar)"
              rows={2}
              className="flex-1 resize-none text-sm"
            />
            <Button 
              onClick={addClause}
              disabled={!newClause.trim()}
              variant="outline"
              className="h-auto px-4"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Clauses list */}
        {data.additionalClauses.length > 0 && (
          <div className="space-y-2">
            {data.additionalClauses.map((clause, index) => (
              <div
                key={index}
                className={`rounded-lg border transition-colors ${
                  editingIndex === index 
                    ? 'border-foreground bg-foreground/5' 
                    : 'border-border bg-secondary/30'
                }`}
              >
                {editingIndex === index ? (
                  <div className="p-4 space-y-3">
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
                      rows={3}
                      className="resize-none text-sm"
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Ctrl+Enter para salvar
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditClause}
                          className="h-8"
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={saveEditClause}
                          disabled={!editingText.trim()}
                          className="h-8 btn-primary"
                        >
                          <Check className="w-3 h-3 mr-1.5" />
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded bg-foreground/10 flex items-center justify-center text-xs font-medium text-foreground">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-sm leading-relaxed text-foreground/80">{clause}</p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditClause(index)}
                        className="h-7 w-7"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeClause(index)}
                        className="h-7 w-7 text-destructive hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
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
            <p className="text-sm">Nenhuma cláusula adicionada</p>
            <p className="text-xs mt-1">Selecione um modelo ou adicione manualmente</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ContractForm;
