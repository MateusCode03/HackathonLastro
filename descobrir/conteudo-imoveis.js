/*
 * descobrir/conteudo-imoveis.js
 * -------------------------------------------------------------------------
 * Conteúdo editorial da feature "Descoberta Visual" (pasta descobrir/).
 *
 * Mesmo padrão dos arquivos data/*.js: popula uma variável global
 * (window.CONTEUDO_IMOVEIS) para funcionar em file:// sem backend/CORS.
 *
 * NÃO altera data/imoveis.js — apenas ENRIQUECE cada imóvel (por id) com uma
 * descrição curta usada nos cards de swipe. Ids sem entrada aqui recebem uma
 * descrição gerada em runtime por descobrir.js (função descricaoDe).
 *
 * Formato:  id -> { descricao: "frase curta de marketing" }
 * -------------------------------------------------------------------------
 */
window.CONTEUDO_IMOVEIS = {
  1:  { descricao: "Studio compacto e reformado no coração do Centro, a passos do metrô e da vida cultural." },
  2:  { descricao: "Dois dormitórios pertinho da Praça da Sé, ideal para quem quer tudo a pé." },
  3:  { descricao: "Loft arejado na boêmia Santa Cecília, com pé-direito alto e bairro em alta." },
  4:  { descricao: "Amplos 70 m² na Bela Vista, entre o Bixiga e a Avenida Paulista." },
  5:  { descricao: "Cobertura de 3 quartos na Consolação, vista aberta e a um quarteirão da Paulista." },
  6:  { descricao: "Apartamento moderno em Pinheiros, cercado de bares, mercados e estações de metrô." },
  7:  { descricao: "Studio funcional em Pinheiros para quem quer morar no agito da Zona Oeste." },
  8:  { descricao: "Alto padrão no Itaim Bibi: 140 m², acabamento fino e perto da Faria Lima." },
  9:  { descricao: "Flat prático no Itaim Bibi, perfeito para executivos que valorizam localização." },
  10: { descricao: "Clássico Jardim Paulista com 3 quartos, ruas arborizadas e ótima infraestrutura." },
  11: { descricao: "Studio elegante nos Jardins, a poucos passos da Oscar Freire." },
  12: { descricao: "Charme em Perdizes: 2 quartos em bairro residencial e bem servido de comércio." },
  13: { descricao: "Casa espaçosa de 4 quartos em Perdizes, ideal para famílias que querem espaço." },
  14: { descricao: "Apartamento na Lapa com bom custo-benefício e fácil acesso a trem e metrô." },
  15: { descricao: "Dois quartos no Butantã, perto da USP e do metrô, ótimo para estudantes." },
  16: { descricao: "Casa térrea de 3 quartos no Butantã, com quintal e tranquilidade de bairro." },
  17: { descricao: "Apartamento de 130 m² no Morumbi, área nobre e arborizada da Zona Sul." },
  18: { descricao: "Casa em condomínio fechado no Morumbi: 4 suítes, segurança e lazer completo." },
  19: { descricao: "Moema clássica: 2 quartos perto do Parque Ibirapuera e da boa gastronomia." },
  20: { descricao: "Studio compacto em Moema para investir ou morar num dos melhores bairros de SP." },
  21: { descricao: "Vila Mariana com 2 quartos, perto do metrô e do Parque do Ibirapuera." },
  22: { descricao: "Apartamento reformado de 3 quartos na Vila Mariana, bairro pedido e central." },
  23: { descricao: "Campo Belo: 2 quartos em bairro tranquilo, bem localizado e valorizado." },
  24: { descricao: "Cobertura de 150 m² no Campo Belo, com terraço e ótima vizinhança." },
  25: { descricao: "Apartamento na Saúde, ao lado do metrô e com comércio farto no entorno." },
  26: { descricao: "Santo Amaro com bom preço: 2 quartos e fácil acesso à Marginal Pinheiros." },
  27: { descricao: "Tatuapé prático: 2 quartos perto de shoppings e do metrô da Zona Leste." },
  28: { descricao: "Apartamento novo de 3 quartos no Tatuapé, bairro completo e bem conectado." },
  29: { descricao: "Mooca tradicional: 2 quartos em bairro com forte identidade e boa oferta de serviços." },
  30: { descricao: "Loft de estilo industrial na Mooca, charmoso e em região em transformação." },
  31: { descricao: "Penha com 2 quartos e preço acessível, perto do metrô e do comércio local." },
  32: { descricao: "Casa de 3 quartos na Penha, com espaço e excelente custo-benefício." },
  33: { descricao: "Vila Prudente: 2 quartos próximos do metrô e do monotrilho da Zona Leste." },
  34: { descricao: "Apartamento econômico em Itaquera, perto da estação e da Arena Corinthians." },
  35: { descricao: "Casa de 3 quartos em Itaquera com bom espaço e aluguel acessível." },
  36: { descricao: "São Mateus com preço convidativo: 2 quartos para o primeiro imóvel." },
  37: { descricao: "Casa de 3 quartos em Cidade Tiradentes, espaçosa e de aluguel econômico." },
  38: { descricao: "Guaianases acessível: 2 quartos ideais para começar a investir." },
  39: { descricao: "Santana na Zona Norte: 2 quartos perto do metrô e do Campo de Marte." },
  40: { descricao: "Amplos 90 m² em Santana, bairro consolidado e bem servido de comércio." },
  41: { descricao: "Tucuruvi tranquilo: 2 quartos ao lado do metrô na Zona Norte." },
  42: { descricao: "Casa de 3 quartos no Tucuruvi, com quintal e clima de bairro residencial." },
  43: { descricao: "Freguesia do Ó com 2 quartos e bom preço, perto de parques e comércio." },
  44: { descricao: "Pirituba acessível: 2 quartos com fácil acesso à Marginal Tietê." },
  45: { descricao: "Casa de 3 quartos em Pirituba, espaço para a família e aluguel justo." },
  46: { descricao: "Brasilândia econômica: 2 quartos para quem busca o primeiro apartamento." },
  47: { descricao: "Campo Limpo com 2 quartos e ótimo custo-benefício na Zona Sul." },
  48: { descricao: "Casa de 3 quartos no Campo Limpo, espaçosa e bem localizada para a região." },
  49: { descricao: "Capão Redondo acessível: 2 quartos ideais para sair do aluguel caro." },
  50: { descricao: "Casa de 3 quartos no Jardim Ângela, com espaço e preço convidativo." },
  51: { descricao: "Grajaú econômico: 2 quartos para o primeiro imóvel na Zona Sul." },
  52: { descricao: "Casa de 3 quartos no Grajaú, ampla e com excelente custo-benefício." },
  53: { descricao: "Studio compacto na Consolação, pertinho da Paulista e da vida noturna." },
  54: { descricao: "Apartamento family de 4 quartos em Moema, espaço e endereço premium." },
  55: { descricao: "Duplex de 125 m² em Pinheiros, moderno e no melhor da Zona Oeste." },
  56: { descricao: "Kitnet enxuta no Ipiranga, ótima para investir perto do Museu e do parque." },
  57: { descricao: "Ipiranga com 2 quartos, bairro histórico e bem servido de transporte." },
  58: { descricao: "Cobertura de 200 m² na Vila Mariana, sofisticada e super central." },
  59: { descricao: "Garden de 240 m² no Morumbi, com amplo espaço externo e muito verde." },
  60: { descricao: "Apartamento de 4 quartos no Jardim Paulista, espaço nobre no coração dos Jardins." }
};
