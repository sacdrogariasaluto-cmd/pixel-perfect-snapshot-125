# Painel administrativo inspirado na referência

## Objetivo
Recriar o painel administrativo com a mesma estrutura visual do print: barra superior fina, menu lateral fixo, área central compacta e dashboard em grade com muitos indicadores.

## O que será alterado
- Refazer a navegação lateral com seções, ícones, item ativo verde-claro e versão adaptada para telas menores.
- Refazer o topo com marca da loja, busca, indicadores e perfil.
- Reorganizar o dashboard em cartões compactos para vendas, lucro estimado, ticket médio, conversões, andamento dos pedidos, pagamentos, parcelamentos, estados, cancelamentos e produtos mais vendidos.
- Usar os dados reais já disponíveis; indicadores sem fonte no sistema serão mostrados como indisponíveis, sem inventar resultados.
- Harmonizar Pedidos, Clientes e Cupons com a mesma linguagem visual do novo painel.
- Manter login, permissões, pedidos, clientes, cupons e alterações de status funcionando como hoje.

## Detalhes técnicos
- Reaproveitar as consultas administrativas atuais e ampliar apenas os agrupamentos necessários no servidor.
- Construir os gráficos com a biblioteca já instalada.
- Usar os tokens de cor existentes da loja e controles acessíveis do projeto.
- Adicionar títulos e descrições próprios às páginas administrativas.
- Validar o painel em desktop e celular, além de conferir erros de execução e compilação.
