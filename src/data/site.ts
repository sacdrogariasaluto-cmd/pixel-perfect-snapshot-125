// Dados de interface separados dos componentes.
// Identidade, contatos e dados fiscais são configuráveis do projeto.

export type Collection = {
  label: string;
  slug: string;
  image: string;
  intro?: string;
};

export const collections: Collection[] = [
  { label: "Mamãe e Bebê", slug: "mamae-e-bebe", image: "/img/6bb8cc33-mamae_e_bebe.svg" },
  { label: "Genéricos", slug: "genericos", image: "/img/95c69361-genericos.svg" },
  { label: "Medicamentos", slug: "medicamentos", image: "/img/c0f53b93-medicamentos.svg" },
  {
    label: "Oncológicos e Alto Custo",
    slug: "oncologicos-e-alto-custo",
    image: "/img/ffd2524d-oncologicos_e_alto_custo.svg",
  },
  {
    label: "Vitaminas e Minerais",
    slug: "vitaminas-e-minerais",
    image: "/img/96bbb751-vitaminas_e_minerais_1.svg",
  },
  {
    label: "Nutrição Esportiva",
    slug: "nutricao-esportiva",
    image: "/img/eecc4f8a-suplementos_e_vitaminas_mNTnTDk.svg",
  },
  { label: "Ortopédicos", slug: "ortopedicos", image: "/img/d6e5d199-ortopedicos.svg" },
  { label: "Sênior", slug: "senior", image: "/img/574dd9f0-nutricao_senior_menor.svg" },
  { label: "Diabetes", slug: "diabetes", image: "/img/b57de5ec-diabetes.svg" },
  { label: "Hipertensão", slug: "hipertensao", image: "/img/b57125ed-hipertensao.svg" },
  { label: "Dermo", slug: "dermocosmeticos", image: "/img/548d679b-untitled-1.svg" },
  {
    label: "Cuidados Pessoais",
    slug: "cuidados-pessoais",
    image: "/img/8b353b95-higiene_pessoal.svg",
  },
];

export const collectionBySlug = (slug: string) => collections.find((c) => c.slug === slug);

export const subCollections = [
  { label: "Acessórios para Amamentação", image: "/img/03e468ea-acessorios-amamentacao.svg" },
  { label: "Acessórios para Bebê", image: "/img/3f3e5d51-acessorios-bebe.svg" },
  { label: "Alimentação Infantil", image: "/img/d8f71a50-alimentacao-infantil.svg" },
  { label: "Higiene Infantil", image: "/img/d54a36e0-higiene-infantil.svg" },
  { label: "Troca do Bebê", image: "/img/22e7ade4-troca-bebe.svg" },
];

export type Banner = { image: string; alt: string };

export const bannersTop: Banner[] = [
  { image: "/img/272013a6-mb4719-banner-sustagen-1130x300.jpg", alt: "Sustagen Senior" },
  { image: "/img/b6e52005-11_-_banner_home_hidratantes_2025_03_1130x300.jpg", alt: "Hidratantes" },
  { image: "/img/ad83a64a-mb4719-banner-olla-play-1130x300.jpg", alt: "Olla" },
  {
    image: "/img/8c297fd0-banner-para-site_linha-performance_desktop.jpg.jpeg",
    alt: "Linha performance",
  },
  { image: "/img/9926266b-banner_site_app.jpg", alt: "Instale o aplicativo" },
  { image: "/img/89966923-banner_rede_vera_cruz_1130x300.jpg.jpeg", alt: "Sandoz" },
  { image: "/img/148486f2-banner_giorno_bagno_1130x300.png", alt: "Giorno Bagno" },
  { image: "/img/2f0b76da-banner_trabalhe_conosco_1.jpg", alt: "Trabalhe conosco" },
  { image: "/img/f8a2c108-8_-_banner_home_genericos_2025_03_1130x300.jpg", alt: "Genéricos" },
];

export const bannersMiddle: Banner[] = [
  { image: "/img/783d9623-banner_home_convenio_06-23_1130x300_v2.jpg", alt: "Convênio" },
  {
    image: "/img/2080bb58-banner_home_comemoracao_100k_pedidos_2024_07_1130x300_v2.jpg",
    alt: "Comemoração de 100 mil pedidos",
  },
  { image: "/img/e2981b41-1_-_banner_home_clinica_vera_cruz_2025_05_1130x300.jpg", alt: "Clínica" },
  {
    image: "/img/f542ff1e-16_-_banner_home_compre-e-retire_2024_03_1130x300.jpg",
    alt: "Compre e retire",
  },
];

export const brands = [
  { name: "L'Oréal", image: "/img/21a43a9e-loreal_copiar.png" },
  { name: "Novo Nordisk", image: "/img/660394ce-nordisk_copiar.png" },
  { name: "Pampers", image: "/img/26963434-pampers.png" },
  { name: "Pierre Fabre", image: "/img/114e8c65-pierre_copiar.png" },
  { name: "Rexona", image: "/img/6ca998c3-rexona_copiar.png" },
  { name: "Sundown", image: "/img/ac8097ff-sundown_copiar.png" },
  { name: "Vichy", image: "/img/e0de726d-vichy.png" },
  { name: "Cetaphil", image: "/img/0244044a-cetaphil.png" },
  { name: "Colgate", image: "/img/54c21d45-colgate_copiar.png" },
  { name: "Dove", image: "/img/ddd10efc-dove_copiar.png" },
  { name: "Johnson & Johnson", image: "/img/8b2fd9e8-johnson.png" },
];

export const departments = [
  "Dermocosméticos",
  "Beleza e Higiene",
  "Genéricos",
  "Home Care",
  "Mamãe e Bebê",
  "Medicamentos",
  "Saúde e Bem Estar",
];

export const departmentSlugs: Record<string, string> = {
  Dermocosméticos: "dermocosmeticos",
  "Beleza e Higiene": "cuidados-pessoais",
  Genéricos: "genericos",
  "Home Care": "ortopedicos",
  "Mamãe e Bebê": "mamae-e-bebe",
  Medicamentos: "medicamentos",
  "Saúde e Bem Estar": "vitaminas-e-minerais",
};

export const benefits = [
  {
    title: "Entrega rápida",
    text: "Prazos e regiões atendidas conforme configuração da loja.",
    link: "Ver condições",
  },
  {
    title: "Parcelamento",
    text: "Condições de parcelamento definidas pelo lojista.",
    link: "Ver formas de pagamento",
  },
  {
    title: "Retire na loja",
    text: "Compre pelo site e retire na unidade escolhida.",
    link: "Ver lojas",
  },
  {
    title: "Compra segura",
    text: "Políticas de privacidade e segurança do titular do projeto.",
    link: "Ver políticas",
  },
];

// Dados de identidade: substituir pelos dados reais do titular do projeto.
export const company = {
  name: "Configure a razão social",
  fantasy: "Configure o nome fantasia",
  cnpj: "Configure o CNPJ",
  ie: "Configure a inscrição estadual",
  address: "Configure o endereço completo",
  hours: "Configure o horário de atendimento",
  sac: "Configure o e-mail de atendimento",
  tech: "Configure o responsável técnico e registros (CRF/AFE/CMVS)",
  whatsapp: "#",
};

export const institutionalLinks = [
  { label: "A Empresa", to: "/ajuda/a-empresa" },
  { label: "Política de Privacidade", to: "/ajuda/politica-de-privacidade" },
  { label: "Política de Pagamentos", to: "/ajuda/politica-de-pagamentos" },
  { label: "Política de Entrega", to: "/ajuda/politica-de-entrega" },
  { label: "Trocas e Devoluções", to: "/ajuda/trocas-e-devolucoes" },
  { label: "Dúvidas", to: "/ajuda/duvidas" },
] as const;
