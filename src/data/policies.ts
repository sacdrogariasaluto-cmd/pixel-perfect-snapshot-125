// Conteúdo das páginas institucionais, espelhando a estrutura da área
// "Como podemos te ajudar?" da loja de referência.
// Dados de contato usam placeholders (ver company em src/data/site.ts).

export type PolicyBlock = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
};

export type PolicyPage = {
  slug: string;
  title: string;
  description: string;
  blocks: PolicyBlock[];
};

export const policyNav: { slug: string; label: string }[] = [
  { slug: "a-empresa", label: "A Empresa" },
  { slug: "politica-de-privacidade", label: "Política de Privacidade" },
  { slug: "politica-de-pagamentos", label: "Política de Pagamentos" },
  { slug: "politica-de-entrega", label: "Política de Entrega" },
  { slug: "trocas-e-devolucoes", label: "Trocas e Devoluções" },
  { slug: "duvidas", label: "Dúvidas" },
];

export const policyPages: Record<string, PolicyPage> = {
  "a-empresa": {
    slug: "a-empresa",
    title: "A Empresa",
    description: "Conheça a história da nossa farmácia e o nosso compromisso com o atendimento.",
    blocks: [
      {
        heading: "Sobre a empresa",
        paragraphs: [
          "Com décadas de atuação no varejo farmacêutico, nossa história é dedicada a proporcionar o melhor atendimento e a criar relacionamentos de confiança com clientes, fornecedores e colaboradores.",
        ],
      },
    ],
  },

  "politica-de-privacidade": {
    slug: "politica-de-privacidade",
    title: "Política de Privacidade",
    description:
      "Saiba como coletamos, utilizamos, compartilhamos e protegemos os seus dados pessoais, conforme a LGPD.",
    blocks: [
      {
        heading: "Política de Privacidade",
        paragraphs: [
          "Quando você realiza uma compra em nossa loja, você nos fornece alguns dados pessoais com o objetivo de viabilizar a sua operação. Nós prezamos pela segurança dos seus dados, pelo respeito à sua privacidade e pela transparência com você e, por isso, dedicamos este documento para explicar como os seus dados pessoais serão tratados e quais são as medidas que aplicamos para mantê-los seguros.",
          "Segundo a definição trazida pela Lei Geral de Proteção de Dados “LGPD” (Lei Federal nº 13.709/2018), na maior parte do tempo seremos o controlador das suas informações, sendo responsáveis por definir o que acontece com estes dados e por protegê-los.",
        ],
      },
      {
        heading: "- Quais dados são coletados?",
        paragraphs: [
          "Durante sua experiência em nossa loja, podemos coletar diferentes tipos de dados pessoais, de forma automática com o objetivo de conferência, monitoramento e controle, ou fornecidos diretamente por você, como por exemplo para a realização de seu cadastro. Veja abaixo quais dados pessoais podemos coletar e em cada situação:",
          "Durante o cadastro:",
        ],
        list: [
          "Nome completo;",
          "Número de CPF;",
          "Endereço de e-mail;",
          "Número de celular;",
          "Data de nascimento;",
          "Dados referentes aos seus endereços.",
        ],
      },
      {
        paragraphs: ["Durante o preenchimento do local de entrega e forma de pagamento:"],
        list: [
          "Endereço de cobrança;",
          "Endereço de entrega;",
          "Dados do cartão de crédito, quando escolhido como forma de pagamento.",
        ],
      },
      {
        paragraphs: ["Durante a análise e o monitoramento da sua compra:"],
        list: [
          "Dados cadastrais;",
          "Tipo de produto;",
          "Quantidade;",
          "Valor da mercadoria (unitário);",
          "Valor total da compra ou transação;",
          "Natureza da transação financeira.",
        ],
      },
      {
        paragraphs: ["Durante a navegação na plataforma:"],
        list: [
          "Endereço de IP;",
          "Informações sobre o dispositivo utilizado para a navegação;",
          "Produtos e categorias pesquisados ou visualizados;",
          "Contagem de visualizações;",
          "Páginas visitadas em outros sites.",
        ],
      },
      {
        paragraphs: [
          "Outras informações que somente serão acessadas se você nos autorizar. A qualquer momento, você poderá revogar essa autorização utilizando os nossos canais de atendimento:",
        ],
        list: [
          "Informações de login social, caso você realize seu cadastro por meio de uma conta em rede social e autorize essa coleta;",
          "Informações sobre você que se tornaram públicas por você ou que estejam disponíveis publicamente;",
          "Informações que coletamos de terceiros, como complementos dos seus dados cadastrais;",
          "Informações fornecidas por você voluntariamente, como comunicações em redes sociais ou em comentários e avaliações de produtos.",
        ],
      },
      {
        heading: "- Como nós utilizamos os seus dados pessoais?",
        paragraphs: [
          "Nós utilizamos os dados pessoais para garantir um atendimento de qualidade e uma melhor experiência na sua compra. Listamos abaixo as finalidades para as quais poderemos utilizar seus dados pessoais:",
          "Dados cadastrais:",
        ],
        list: [
          "Para realizar o atendimento de solicitações e dúvidas em nossa Central de Atendimento;",
          "Para identificar corretamente o usuário;",
          "Para enviar os produtos adquiridos ou comunicações de ofertas;",
          "Para entrar em contato com você, quando necessário, sobre promoções, dúvidas, reclamações, atualizações dos pedidos e informações de entrega;",
          "Para auxiliar no diagnóstico e solução de problemas técnicos;",
          "Para desenvolver novas funcionalidades e melhorias, aprimorando a sua experiência;",
          "Para realizar investigações e medidas de prevenção e combate a ilícitos, fraudes e crimes financeiros;",
          "Para garantir o cumprimento de obrigação legal ou regulatória, ou o exercício regular de direitos, inclusive em processos judiciais e administrativos;",
          "Para colaborar com o cumprimento de ordem judicial, de autoridade competente ou de órgão fiscalizador.",
        ],
      },
      {
        heading: "Com quem nós podemos compartilhar os dados pessoais",
        paragraphs: [
          "Para a execução das atividades acima listadas, sempre que necessário, poderemos compartilhar os seus dados pessoais com prestadores de serviço, parceiros ou órgãos reguladores. Jamais comercializamos dados pessoais.",
          "Prestadores de serviço: contamos com a colaboração de prestadores que tratam os dados pessoais coletados em nosso nome e de acordo com nossas instruções, principalmente para análises antifraude, intermediação de pagamentos, gestão de campanhas de marketing e armazenamento em nuvem.",
          "Autoridades judiciais, policiais ou governamentais: podemos fornecer dados pessoais em atendimento à ordem judicial, solicitações de autoridades administrativas, obrigação legal ou regulatória.",
        ],
      },
      {
        heading: "Armazenamento e segurança dos dados pessoais",
        paragraphs: [
          "Adotamos as melhores técnicas para proteger os dados pessoais coletados de acessos não autorizados, destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito, inclusive mecanismos de criptografia. Ressaltamos, contudo, que nenhuma plataforma é completamente segura. Se você tiver qualquer preocupação ou suspeita de que os seus dados estejam em risco, entre em contato conosco pelos nossos canais de atendimento.",
          "Seus dados pessoais serão mantidos durante todo o período em que você for um cliente ativo. Após esse período, podemos armazenar os seus dados por um período adicional para fins de auditoria e para o cumprimento de obrigações legais ou regulatórias, respeitando os prazos estabelecidos na legislação aplicável.",
        ],
      },
      {
        heading: "Cookies e tecnologias de monitoramento",
        paragraphs: [
          "Podemos utilizar certas tecnologias de monitoramento para coletar as informações das atividades realizadas nas nossas plataformas de forma automatizada. As informações coletadas são utilizadas para realizar métricas de performance, identificar problemas no uso, captar o comportamento dos usuários e coletar dados de impressão de conteúdos.",
        ],
        list: [
          "Cookie: um pequeno arquivo adicionado ao dispositivo do usuário para fornecer uma experiência personalizada de acesso à plataforma. Os cookies ajudam a analisar o tráfego de internet e não dão acesso ao computador nem revelam informações além das que o usuário escolhe compartilhar.",
          "Pixels: trechos de código instalados em nossas aplicações, websites ou e-mails, com a finalidade de coletar informações sobre as atividades dos usuários, permitindo identificar padrões de acesso, navegação e interesse.",
          "Ferramentas de analytics: podem coletar informações sobre a forma como os usuários visitam a loja, quando e quais páginas visitam, entre outras.",
        ],
      },
      {
        heading: "Seus direitos como titular dos dados pessoais",
        paragraphs: [
          "A transparência sobre o tratamento dos seus dados pessoais é prioridade para nós. Além das informações disponibilizadas nesta Política de Privacidade, você pode exercer os direitos previstos na Lei Geral de Proteção de Dados, entre eles:",
        ],
        list: [
          "Confirmação da existência de tratamento de dados pessoais;",
          "Acesso aos dados pessoais;",
          "Revogação do consentimento;",
          "Correção de dados pessoais incompletos, inexatos ou desatualizados;",
          "Eliminação dos dados pessoais tratados com o consentimento ou desnecessários;",
          "Informação sobre com quais empresas, parceiros e instituições podemos compartilhar dados pessoais;",
          "Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa, quando aplicável.",
        ],
      },
      {
        paragraphs: [
          "Todas as solicitações serão tratadas de forma gratuita e submetidas a uma prévia avaliação da sua identidade e da viabilidade do atendimento.",
        ],
      },
      {
        heading: "Retenção e exclusão dos seus dados pessoais",
        paragraphs: [
          "Trataremos seus dados pessoais com elevados níveis de proteção durante todo o período em que você for nosso cliente, navegando em nossas plataformas e utilizando nossos serviços.",
          "Quando aplicável, mesmo se você optar por excluir seus dados pessoais da nossa base de cadastro, poderemos reter alguns ou todos os seus dados por períodos adicionais para cumprimento de obrigações legais ou regulatórias, exercício regular de direitos, eventuais ações judiciais ou fins de auditoria.",
        ],
      },
      {
        heading: "Alterações desta política de privacidade",
        paragraphs: [
          "Estamos constantemente buscando aprimorar a experiência de nossos clientes. Assim, nossas práticas de tratamento de dados pessoais poderão sofrer alterações com a inclusão de novas funcionalidades e serviços.",
          "Toda vez que alguma condição relevante desta Política de Privacidade for alterada, essas alterações serão válidas após a nova versão ser publicada em nosso site e serão comunicadas por meio de um dos canais disponibilizados por você durante o seu cadastro (e-mail, SMS, WhatsApp e outros).",
        ],
      },
      {
        heading: "Fale conosco",
        paragraphs: [
          "Sempre que você tiver alguma dúvida sobre esta Política de Privacidade, mesmo após sua leitura, ou precisar interagir conosco sobre assuntos envolvendo os seus dados pessoais, poderá fazê-lo por meio dos nossos canais de atendimento disponíveis.",
          "Recomendamos que verifique a versão atualizada desta Política de Privacidade sempre que navegar em nossa loja virtual. Estamos sempre à disposição para esclarecer suas dúvidas e colocar você no controle dos seus dados pessoais!",
        ],
      },
    ],
  },

  "politica-de-pagamentos": {
    slug: "politica-de-pagamentos",
    title: "Política de Pagamentos",
    description: "Formas de pagamento aceitas, aprovação de pedidos, cancelamento e reembolso.",
    blocks: [
      {
        heading: "Política de Pagamentos",
        paragraphs: [
          "Aceitamos pagamento via PIX e Cartão de crédito: Visa, MasterCard, American Express, Elo, Diners e Hipercard.",
          "As compras realizadas em cartão de crédito podem ser parceladas em até 6 vezes. É possível realizar o pagamento com dois cartões de crédito.",
        ],
      },
      {
        heading: "Aprovação de Pedido",
        paragraphs: [
          "Os motivos mais comuns para que os pedidos não sejam aprovados são:",
        ],
        list: [
          "Quando não há confirmação de pagamento pela instituição financeira;",
          "Erro de digitação do número do cartão;",
          "Validade do cartão;",
          "Dados divergentes;",
          "Saldo insuficiente.",
        ],
      },
      {
        paragraphs: [
          "Se o seu pedido não foi aprovado, entre em contato com a nossa Central de Atendimento pelos nossos canais de atendimento. Atendimento de Segunda à Sexta, das 08h às 18h.",
        ],
      },
      {
        heading: "Cancelamento de pedido e prazo para reembolso",
        paragraphs: [
          "Para pedido cancelado, a restituição de valores será realizada da seguinte forma:",
          "Cartão de crédito: a solicitação de estorno será efetuada junto à administradora do cartão no momento do cancelamento do pedido. O tempo para estorno é definido de acordo com a política da emissora do cartão. Normalmente o estorno ocorre em até duas faturas subsequentes.",
          "Pix: a devolução via Pix será efetuada no momento do cancelamento do pedido.",
          "Como cancelar um pedido: para cancelamento do seu pedido, entre em contato com os nossos canais de atendimento ao cliente. Atendimento de Segunda à Sexta, das 08h às 18h.",
        ],
      },
    ],
  },

  "politica-de-entrega": {
    slug: "politica-de-entrega",
    title: "Política de Entrega",
    description: "Modalidades de entrega, prazos, valor do frete e tentativas de entrega.",
    blocks: [
      {
        heading: "Política de Entrega",
      },
      {
        heading: "Formas de Entrega",
        paragraphs: [
          "Retirada na Loja: o pedido ficará pronto para retirada até 2 horas após a confirmação do pagamento do pedido e a retirada deverá ser realizada durante o horário de funcionamento da loja selecionada no momento do pedido.",
          "Entrega Super Expressa: entregamos em até 1 hora após a confirmação do pagamento do pedido. Consulte o seu CEP para saber a disponibilidade dessa modalidade para a sua região.",
          "Entrega Expressa: entregamos em até 2 horas após a confirmação do pagamento do pedido. Consulte o seu CEP para saber a disponibilidade dessa modalidade para a sua região.",
          "Informamos que, em casos de insucesso na entrega via modalidade expressa por ausência do destinatário, o valor do reembolso será referente apenas aos produtos adquiridos, não incluindo o valor do frete.",
          "Chega Amanhã: entregamos no dia seguinte (segunda a sábado) após a confirmação do pagamento do pedido. Consulte o seu CEP para saber a disponibilidade.",
          "Entrega Terceirizada – Correios: entregamos via Correios nas opções Sedex e Pac. O prazo de entrega é definido de acordo com o seu endereço e se inicia após a aprovação do pagamento do pedido.",
          "Não realizamos entregas aos domingos e feriados.",
          "Exemplo do prazo de entrega do pedido: caso a forma de entrega selecionada seja Entrega Própria em até 2 dias úteis e seu pedido seja aprovado na sexta-feira, o prazo máximo de entrega será até a próxima terça-feira.",
        ],
      },
      {
        heading: "- Qual é o valor do frete?",
        paragraphs: [
          "O valor pode variar de acordo com a região e o peso. Para calcular o valor a ser pago e saber o prazo de entrega para a sua localidade, escolha o produto, insira o CEP e você poderá visualizar o valor total antes de finalizar seu pedido.",
        ],
      },
      {
        heading: "- São realizadas quantas tentativas de entrega?",
        paragraphs: [
          "A entrega do pedido deve ocorrer na data informada no momento da compra, mas em casos excepcionais poderão ser realizadas até 2 tentativas de entrega. Mantenha seus dados atualizados.",
        ],
      },
      {
        heading: "- Entrega aos domingos e feriados?",
        paragraphs: ["Não realizamos entregas aos domingos e feriados."],
      },
    ],
  },

  "trocas-e-devolucoes": {
    slug: "trocas-e-devolucoes",
    title: "Trocas e Devoluções",
    description: "Regras para troca e devolução de produtos comprados na loja.",
    blocks: [
      {
        heading: "Trocas e Devoluções",
      },
      {
        heading: "- Posso trocar um produto do meu pedido?",
        paragraphs: [
          "Sim, você pode trocar qualquer produto* comprado pelo site, televendas ou em uma de nossas lojas físicas em até 7 dias após a data da compra.",
          "Importante: o crédito será concedido de acordo com o valor do produto mencionado no cupom ou na nota fiscal. Se o valor do produto escolhido para a troca for diferente, será cobrada a diferença, de acordo com a política de preços vigente na loja. Caso o produto escolhido para a troca seja de valor inferior, realizaremos o estorno/reembolso do valor.",
          "*Estas regras não são válidas para medicamentos antimicrobianos e medicamentos de uso controlado, conforme o disposto na RDC 20/2011 cap. VII art. 20, art. 44 da Portaria 344/98 e art. 90 da Portaria 6/99 SVS/MS (Secretaria de Vigilância em Saúde/Ministério da Saúde), e medicamentos termolábeis.",
        ],
      },
      {
        heading: "- Posso devolver meu produto?",
        paragraphs: [
          "Sim, você pode devolver qualquer produto* comprado pelo site, televendas ou aplicativo em uma de nossas lojas físicas ou pela Central de Atendimento em até 7 dias após o recebimento do pedido. Leve o produto, um documento de identificação e a nota fiscal. Após a devolução aos estoques, será processada a solicitação de devolução do valor. A devolução poderá ser realizada apenas no caso de arrependimento (previsto no Código de Defesa do Consumidor, art. 49).",
          "Importante: o produto devolvido não pode ter indícios de uso, embalagem original aberta ou danificada.",
          "*Estas regras não são válidas para medicamentos antimicrobianos e medicamentos de uso controlado, conforme o disposto na RDC 20/2011 cap. VII art. 20, art. 44 da Portaria 344/98 e art. 90 da Portaria 6/99 SVS/MS (Secretaria de Vigilância em Saúde/Ministério da Saúde), e medicamentos termolábeis.",
        ],
      },
    ],
  },

  duvidas: {
    slug: "duvidas",
    title: "Dúvidas",
    description: "Respostas para as dúvidas mais frequentes sobre compras, nota fiscal e atendimento.",
    blocks: [
      { heading: "Dúvidas" },
      {
        heading: "- Posso solicitar segunda via da nota fiscal?",
        paragraphs: [
          "Sim, a solicitação pode ser feita através da nossa Central de Atendimento ao Cliente pelos nossos canais de atendimento. Atendimento de Segunda à Sexta, das 08h às 18h.",
          "*Lembrando que a Nota Fiscal sempre é enviada para o e-mail cadastrado. Verifique a caixa de entrada, o Spam e o Lixo Eletrônico.",
        ],
      },
      {
        heading: "- Posso comprar medicamentos controlados no site?",
        paragraphs: [
          "Não. De acordo com a Anvisa, Portaria Nº 344 de 01/02/1999 do Ministério da Saúde, é proibida a venda de medicamentos controlados através de site.",
          "Para mais informações, entre em contato através da nossa Central de Atendimento ao Cliente. Atendimento de Segunda à Sexta, das 08h às 18h.",
        ],
      },
      {
        heading: "- Posso comprar no site e retirar na loja?",
        paragraphs: ["Não, ainda não temos disponível o serviço Compre e Retire na loja."],
      },
      {
        heading: "- Esqueci minha senha de acesso, o que faço?",
        paragraphs: ["Siga os passos abaixo para recuperar sua senha:"],
        list: [
          "Acesse a opção “Minha Conta”;",
          "Clique em “Faça seu Login”;",
          "Selecione a opção “Esqueceu sua Senha”;",
          "Digite seu e-mail de cadastro.",
        ],
      },
      {
        paragraphs: ["Você receberá, em seu e-mail, um link para redefinir a senha."],
      },
      {
        heading: "- Qual o horário de funcionamento da central de atendimento?",
        paragraphs: ["Atendimento de Segunda à Sexta, das 8h às 18h."],
      },
      {
        heading: "- O valor dos produtos do site, das lojas e do televendas são os mesmos?",
        paragraphs: [
          "Os valores não são os mesmos. Devido a uma política de preço, os valores das lojas físicas e do televendas são diferentes.",
          "Para mais informações, entre em contato através da nossa Central de Atendimento ao Cliente.",
        ],
      },
      {
        heading: "- Como enviar meu currículo?",
        paragraphs: [
          "Encaminhe seu currículo para o nosso e-mail de recrutamento, disponível na Central de Atendimento, e boa sorte!",
        ],
      },
    ],
  },
};
