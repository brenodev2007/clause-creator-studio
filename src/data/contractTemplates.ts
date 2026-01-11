// Contract templates with pre-defined clauses

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultServiceDescription: string;
  clauses: string[];
}

export const contractTemplates: ContractTemplate[] = [
  {
    id: "freelancer",
    name: "Freelancer",
    description: "Contrato para trabalhos freelance e projetos pontuais",
    icon: "💻",
    defaultServiceDescription: "Prestação de serviços de desenvolvimento/design conforme escopo definido entre as partes.",
    clauses: [
      "O CONTRATADO realizará o trabalho de forma autônoma, sem vínculo empregatício com o CONTRATANTE, podendo definir seus próprios horários e métodos de trabalho.",
      "O CONTRATADO se compromete a manter sigilo sobre todas as informações confidenciais do CONTRATANTE às quais tiver acesso durante a execução do serviço.",
      "Todas as revisões e ajustes solicitados dentro do escopo original serão realizados sem custo adicional. Alterações fora do escopo acordado serão orçadas separadamente.",
      "Os direitos autorais e de propriedade intelectual do trabalho desenvolvido serão transferidos ao CONTRATANTE após a quitação integral do pagamento.",
      "Em caso de cancelamento pelo CONTRATANTE, será devido o pagamento proporcional ao trabalho já executado, mais 20% do valor restante a título de compensação.",
      "O CONTRATADO poderá utilizar o trabalho desenvolvido em seu portfólio profissional, salvo acordo em contrário firmado por escrito.",
    ],
  },
  {
    id: "consultoria",
    name: "Consultoria",
    description: "Contrato para serviços de consultoria especializada",
    icon: "📊",
    defaultServiceDescription: "Prestação de serviços de consultoria especializada, incluindo análise, diagnóstico e recomendações estratégicas.",
    clauses: [
      "A consultoria será prestada de forma independente, cabendo ao CONTRATADO a liberdade técnica para conduzir os trabalhos segundo as melhores práticas do mercado.",
      "O CONTRATANTE disponibilizará todas as informações e acessos necessários para a execução da consultoria, responsabilizando-se pela veracidade dos dados fornecidos.",
      "Os pareceres, relatórios e recomendações emitidos pelo CONTRATADO são de natureza consultiva, cabendo ao CONTRATANTE a decisão final sobre sua implementação.",
      "O CONTRATADO se compromete a manter absoluto sigilo sobre todas as informações estratégicas e confidenciais do CONTRATANTE, durante e após a vigência do contrato.",
      "Reuniões presenciais ou virtuais serão agendadas com antecedência mínima de 48 horas, salvo acordo entre as partes.",
      "O pagamento será realizado conforme cronograma acordado, sendo que atrasos superiores a 15 dias autorizam a suspensão dos trabalhos.",
      "Despesas com deslocamento, hospedagem e alimentação para atendimento presencial correrão por conta do CONTRATANTE, mediante aprovação prévia.",
    ],
  },
  {
    id: "prestacao-servicos",
    name: "Prestação de Serviços",
    description: "Contrato geral para prestação de serviços diversos",
    icon: "📋",
    defaultServiceDescription: "Prestação de serviços especializados conforme especificações acordadas entre as partes.",
    clauses: [
      "O CONTRATADO prestará os serviços descritos neste contrato com zelo, diligência e em conformidade com as normas técnicas aplicáveis.",
      "O CONTRATANTE se obriga a fornecer todas as condições necessárias para a execução dos serviços, incluindo acesso, informações e materiais quando aplicável.",
      "Os serviços serão executados no prazo acordado, podendo haver prorrogação mediante acordo formal entre as partes e, quando aplicável, reajuste de valores.",
      "Em caso de impossibilidade de execução dos serviços por motivo de força maior, o CONTRATADO comunicará imediatamente o CONTRATANTE, ficando suspenso o prazo até a normalização.",
      "O CONTRATADO responde pela qualidade dos serviços prestados, obrigando-se a refazer, sem custo adicional, serviços que apresentarem defeitos ou não conformidades.",
      "O presente contrato poderá ser rescindido por qualquer das partes, mediante notificação prévia de 30 dias, ressalvado o direito ao pagamento pelos serviços já executados.",
      "O CONTRATADO se compromete a cumprir todas as normas de segurança e saúde aplicáveis durante a execução dos serviços.",
    ],
  },
  {
    id: "desenvolvimento-software",
    name: "Desenvolvimento de Software",
    description: "Contrato específico para desenvolvimento de sistemas e aplicativos",
    icon: "🖥️",
    defaultServiceDescription: "Desenvolvimento de software/sistema/aplicativo conforme especificações técnicas definidas no escopo do projeto.",
    clauses: [
      "O CONTRATADO desenvolverá o software conforme especificações técnicas acordadas, seguindo as melhores práticas de desenvolvimento e padrões de qualidade.",
      "O código-fonte será entregue ao CONTRATANTE ao final do projeto, após quitação integral do pagamento, juntamente com documentação técnica básica.",
      "O CONTRATADO oferece garantia de 90 dias para correção de bugs e falhas identificadas após a entrega final, desde que não decorram de uso indevido ou alterações por terceiros.",
      "Novas funcionalidades, alterações de escopo ou customizações não previstas inicialmente serão orçadas em aditivo contratual.",
      "O CONTRATANTE é responsável por fornecer hosting, domínio e demais infraestruturas necessárias para operação do sistema, salvo acordo em contrário.",
      "O CONTRATADO se compromete a não utilizar códigos maliciosos, backdoors ou qualquer elemento que possa comprometer a segurança do sistema.",
      "Dados e informações inseridos no sistema pelo CONTRATANTE são de sua propriedade e responsabilidade, devendo o CONTRATADO manter backup durante o desenvolvimento.",
      "A aceitação final do projeto se dará mediante homologação formal pelo CONTRATANTE, que terá prazo de 10 dias úteis para reportar inconsistências após cada entrega.",
    ],
  },
  {
    id: "marketing-digital",
    name: "Marketing Digital",
    description: "Contrato para serviços de marketing e gestão de redes sociais",
    icon: "📱",
    defaultServiceDescription: "Prestação de serviços de marketing digital, incluindo gestão de redes sociais, criação de conteúdo e estratégias de divulgação.",
    clauses: [
      "O CONTRATADO será responsável pela criação, planejamento e publicação de conteúdo nas plataformas digitais acordadas, seguindo a identidade visual e tom de voz do CONTRATANTE.",
      "O CONTRATANTE fornecerá acesso às contas de redes sociais e aprovará previamente os conteúdos antes da publicação, quando solicitado.",
      "Relatórios de desempenho serão apresentados mensalmente, contendo métricas de alcance, engajamento e demais indicadores relevantes acordados.",
      "Investimentos em mídia paga (anúncios) não estão inclusos no valor deste contrato, devendo ser definidos e pagos separadamente pelo CONTRATANTE.",
      "O CONTRATADO não garante resultados específicos de vendas ou conversões, sendo responsável apenas pela execução das estratégias acordadas.",
      "Imagens, vídeos e materiais fornecidos pelo CONTRATANTE devem estar livres de direitos autorais de terceiros, isentando o CONTRATADO de responsabilidade.",
      "O contrato tem vigência mínima de 3 meses, renovando-se automaticamente por período igual, salvo manifestação contrária com 30 dias de antecedência.",
    ],
  },
];

export const getTemplateById = (id: string): ContractTemplate | undefined => {
  return contractTemplates.find((template) => template.id === id);
};
