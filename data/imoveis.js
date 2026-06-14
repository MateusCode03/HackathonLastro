/*
 * data/imoveis.js
 * -------------------------------------------------------------------------
 * Catálogo SIMULADO de imóveis para aluguel na cidade de São Paulo.
 *
 * Não existe API pública gratuita de imóveis (ZAP/Viva Real são fechadas),
 * então este catálogo é fictício — coordenadas reais espalhadas por SP,
 * preços e características plausíveis. Serve para demonstrar a combinação
 * dos 3 filtros (segurança + localização + orçamento).
 *
 * O nível de segurança de cada imóvel é calculado em runtime (app.js),
 * associando o imóvel ao DISTRITO de centróide mais próximo.
 *
 * Campos: id, titulo, lat, lng, preco (aluguel mensal em R$), quartos,
 * area (m²), tipo.
 * -------------------------------------------------------------------------
 */
window.IMOVEIS = [
  // Centro
  { id: 1,  titulo: "Studio reformado na República",        lat: -23.5435, lng: -46.6415, preco: 1900,  quartos: 1, area: 38,  tipo: "aluguel" },
  { id: 2,  titulo: "Apartamento 2Q próximo à Sé",          lat: -23.5510, lng: -46.6340, preco: 2300,  quartos: 2, area: 62,  tipo: "aluguel" },
  { id: 3,  titulo: "Loft na Santa Cecília",                lat: -23.5385, lng: -46.6565, preco: 2700,  quartos: 1, area: 45,  tipo: "aluguel" },
  { id: 4,  titulo: "Apartamento amplo na Bela Vista",      lat: -23.5575, lng: -46.6455, preco: 3100,  quartos: 2, area: 70,  tipo: "aluguel" },
  { id: 5,  titulo: "Cobertura na Consolação",              lat: -23.5535, lng: -46.6605, preco: 5200,  quartos: 3, area: 120, tipo: "aluguel" },

  // Zona Oeste nobre
  { id: 6,  titulo: "Apartamento moderno em Pinheiros",     lat: -23.5665, lng: -46.7015, preco: 4800,  quartos: 2, area: 78,  tipo: "aluguel" },
  { id: 7,  titulo: "Studio em Pinheiros",                  lat: -23.5680, lng: -46.7000, preco: 3200,  quartos: 1, area: 42,  tipo: "aluguel" },
  { id: 8,  titulo: "Apto alto padrão no Itaim Bibi",       lat: -23.5845, lng: -46.6775, preco: 8500,  quartos: 3, area: 140, tipo: "aluguel" },
  { id: 9,  titulo: "Flat no Itaim Bibi",                   lat: -23.5860, lng: -46.6760, preco: 4500,  quartos: 1, area: 48,  tipo: "aluguel" },
  { id: 10, titulo: "Apartamento no Jardim Paulista",       lat: -23.5705, lng: -46.6645, preco: 6200,  quartos: 3, area: 110, tipo: "aluguel" },
  { id: 11, titulo: "Studio no Jardim Paulista",            lat: -23.5695, lng: -46.6660, preco: 3500,  quartos: 1, area: 40,  tipo: "aluguel" },
  { id: 12, titulo: "Apartamento charmoso em Perdizes",     lat: -23.5345, lng: -46.6775, preco: 3900,  quartos: 2, area: 75,  tipo: "aluguel" },
  { id: 13, titulo: "Casa em Perdizes",                     lat: -23.5360, lng: -46.6760, preco: 7000,  quartos: 4, area: 220, tipo: "aluguel" },
  { id: 14, titulo: "Apto na Lapa",                         lat: -23.5275, lng: -46.7045, preco: 2600,  quartos: 2, area: 64,  tipo: "aluguel" },
  { id: 15, titulo: "Apartamento no Butantã",               lat: -23.5715, lng: -46.7075, preco: 2400,  quartos: 2, area: 58,  tipo: "aluguel" },
  { id: 16, titulo: "Casa térrea no Butantã",               lat: -23.5700, lng: -46.7090, preco: 4200,  quartos: 3, area: 160, tipo: "aluguel" },

  // Zona Sul nobre
  { id: 17, titulo: "Apartamento no Morumbi",               lat: -23.6225, lng: -46.7225, preco: 5500,  quartos: 3, area: 130, tipo: "aluguel" },
  { id: 18, titulo: "Casa em condomínio no Morumbi",        lat: -23.6240, lng: -46.7210, preco: 12000, quartos: 4, area: 320, tipo: "aluguel" },
  { id: 19, titulo: "Apto em Moema",                        lat: -23.5995, lng: -46.6655, preco: 4900,  quartos: 2, area: 82,  tipo: "aluguel" },
  { id: 20, titulo: "Studio em Moema",                      lat: -23.6010, lng: -46.6640, preco: 3300,  quartos: 1, area: 44,  tipo: "aluguel" },
  { id: 21, titulo: "Apartamento na Vila Mariana",          lat: -23.5885, lng: -46.6345, preco: 3700,  quartos: 2, area: 68,  tipo: "aluguel" },
  { id: 22, titulo: "Apto reformado na Vila Mariana",       lat: -23.5895, lng: -46.6330, preco: 4100,  quartos: 3, area: 88,  tipo: "aluguel" },
  { id: 23, titulo: "Apartamento no Campo Belo",            lat: -23.6205, lng: -46.6695, preco: 4300,  quartos: 2, area: 76,  tipo: "aluguel" },
  { id: 24, titulo: "Cobertura no Campo Belo",              lat: -23.6195, lng: -46.6705, preco: 7800,  quartos: 3, area: 150, tipo: "aluguel" },
  { id: 25, titulo: "Apto na Saúde",                        lat: -23.6175, lng: -46.6395, preco: 2800,  quartos: 2, area: 60,  tipo: "aluguel" },
  { id: 26, titulo: "Apartamento em Santo Amaro",           lat: -23.6535, lng: -46.7085, preco: 2500,  quartos: 2, area: 62,  tipo: "aluguel" },

  // Zona Leste
  { id: 27, titulo: "Apto no Tatuapé",                      lat: -23.5405, lng: -46.5765, preco: 2900,  quartos: 2, area: 66,  tipo: "aluguel" },
  { id: 28, titulo: "Apartamento novo no Tatuapé",          lat: -23.5395, lng: -46.5755, preco: 3600,  quartos: 3, area: 84,  tipo: "aluguel" },
  { id: 29, titulo: "Apto na Mooca",                        lat: -23.5565, lng: -46.6005, preco: 2700,  quartos: 2, area: 64,  tipo: "aluguel" },
  { id: 30, titulo: "Loft industrial na Mooca",             lat: -23.5550, lng: -46.5995, preco: 3400,  quartos: 1, area: 52,  tipo: "aluguel" },
  { id: 31, titulo: "Apartamento na Penha",                 lat: -23.5265, lng: -46.5435, preco: 1800,  quartos: 2, area: 58,  tipo: "aluguel" },
  { id: 32, titulo: "Casa na Penha",                        lat: -23.5255, lng: -46.5425, preco: 2600,  quartos: 3, area: 140, tipo: "aluguel" },
  { id: 33, titulo: "Apto na Vila Prudente",                lat: -23.5845, lng: -46.5815, preco: 2200,  quartos: 2, area: 56,  tipo: "aluguel" },
  { id: 34, titulo: "Apartamento em Itaquera",              lat: -23.5405, lng: -46.4565, preco: 1500,  quartos: 2, area: 50,  tipo: "aluguel" },
  { id: 35, titulo: "Casa em Itaquera",                     lat: -23.5390, lng: -46.4550, preco: 2100,  quartos: 3, area: 120, tipo: "aluguel" },
  { id: 36, titulo: "Apto em São Mateus",                   lat: -23.6085, lng: -46.4765, preco: 1400,  quartos: 2, area: 48,  tipo: "aluguel" },
  { id: 37, titulo: "Casa em Cidade Tiradentes",            lat: -23.5895, lng: -46.4035, preco: 1300,  quartos: 3, area: 110, tipo: "aluguel" },
  { id: 38, titulo: "Apartamento em Guaianases",            lat: -23.5415, lng: -46.4145, preco: 1250,  quartos: 2, area: 46,  tipo: "aluguel" },

  // Zona Norte
  { id: 39, titulo: "Apto em Santana",                      lat: -23.5045, lng: -46.6285, preco: 3000,  quartos: 2, area: 68,  tipo: "aluguel" },
  { id: 40, titulo: "Apartamento amplo em Santana",         lat: -23.5035, lng: -46.6275, preco: 3800,  quartos: 3, area: 90,  tipo: "aluguel" },
  { id: 41, titulo: "Apto no Tucuruvi",                     lat: -23.4795, lng: -46.6045, preco: 2300,  quartos: 2, area: 60,  tipo: "aluguel" },
  { id: 42, titulo: "Casa no Tucuruvi",                     lat: -23.4785, lng: -46.6035, preco: 3200,  quartos: 3, area: 150, tipo: "aluguel" },
  { id: 43, titulo: "Apartamento na Freguesia do Ó",        lat: -23.5005, lng: -46.6905, preco: 1900,  quartos: 2, area: 54,  tipo: "aluguel" },
  { id: 44, titulo: "Apto em Pirituba",                     lat: -23.4875, lng: -46.7255, preco: 1700,  quartos: 2, area: 52,  tipo: "aluguel" },
  { id: 45, titulo: "Casa em Pirituba",                     lat: -23.4865, lng: -46.7245, preco: 2500,  quartos: 3, area: 130, tipo: "aluguel" },
  { id: 46, titulo: "Apartamento na Brasilândia",           lat: -23.4665, lng: -46.6905, preco: 1450,  quartos: 2, area: 48,  tipo: "aluguel" },

  // Zona Sul periférica
  { id: 47, titulo: "Apto no Campo Limpo",                  lat: -23.6475, lng: -46.7595, preco: 1600,  quartos: 2, area: 50,  tipo: "aluguel" },
  { id: 48, titulo: "Casa no Campo Limpo",                  lat: -23.6465, lng: -46.7585, preco: 2200,  quartos: 3, area: 115, tipo: "aluguel" },
  { id: 49, titulo: "Apartamento no Capão Redondo",         lat: -23.6685, lng: -46.7805, preco: 1350,  quartos: 2, area: 46,  tipo: "aluguel" },
  { id: 50, titulo: "Casa no Jardim Ângela",               lat: -23.6905, lng: -46.7605, preco: 1500,  quartos: 3, area: 100, tipo: "aluguel" },
  { id: 51, titulo: "Apto no Grajaú",                       lat: -23.7605, lng: -46.7005, preco: 1300,  quartos: 2, area: 48,  tipo: "aluguel" },
  { id: 52, titulo: "Casa no Grajaú",                       lat: -23.7595, lng: -46.6995, preco: 1900,  quartos: 3, area: 110, tipo: "aluguel" },

  // Mais opções variadas
  { id: 53, titulo: "Studio compacto na Consolação",        lat: -23.5525, lng: -46.6610, preco: 2400,  quartos: 1, area: 36,  tipo: "aluguel" },
  { id: 54, titulo: "Apartamento family em Moema",          lat: -23.6005, lng: -46.6660, preco: 6500,  quartos: 4, area: 145, tipo: "aluguel" },
  { id: 55, titulo: "Apto duplex em Pinheiros",             lat: -23.5660, lng: -46.7025, preco: 6800,  quartos: 3, area: 125, tipo: "aluguel" },
  { id: 56, titulo: "Kitnet no Ipiranga",                   lat: -23.5925, lng: -46.6015, preco: 1600,  quartos: 1, area: 32,  tipo: "aluguel" },
  { id: 57, titulo: "Apartamento no Ipiranga",              lat: -23.5915, lng: -46.6005, preco: 2800,  quartos: 2, area: 66,  tipo: "aluguel" },
  { id: 58, titulo: "Cobertura na Vila Mariana",            lat: -23.5880, lng: -46.6350, preco: 9000,  quartos: 4, area: 200, tipo: "aluguel" },
  { id: 59, titulo: "Apto garden no Morumbi",               lat: -23.6235, lng: -46.7215, preco: 8800,  quartos: 4, area: 240, tipo: "aluguel" },
  { id: 60, titulo: "Apartamento no Jardim Paulista",       lat: -23.5710, lng: -46.6640, preco: 7500,  quartos: 4, area: 160, tipo: "aluguel" }
];
