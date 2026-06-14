/*
 * data/imoveis.js
 * -------------------------------------------------------------------------
 * Catálogo SIMULADO de imóveis na cidade de São Paulo.
 *
 * Não existe API pública gratuita de imóveis (ZAP/Viva Real são fechadas),
 * então este catálogo é fictício — coordenadas reais espalhadas por SP,
 * preços e características plausíveis. Serve para demonstrar a combinação
 * dos filtros (segurança + localização + orçamento + tipo).
 *
 * O nível de segurança de cada imóvel é calculado em runtime (app.js),
 * associando o imóvel ao DISTRITO de centróide mais próximo.
 *
 * Campos:
 *   id, titulo, lat, lng, quartos, area (m²),
 *   tipo  -> "aluguel" (preço = valor mensal) ou "compra" (preço = valor total)
 *   preco -> número (R$). Para aluguel é mensal; para compra é o valor de venda.
 * -------------------------------------------------------------------------
 */
window.IMOVEIS = [
  // Centro
  { id: 1,  titulo: "Studio reformado na República",        lat: -23.5435, lng: -46.6415, quartos: 1, area: 38,  tipo: "aluguel", preco: 1900 },
  { id: 2,  titulo: "Apartamento 2Q próximo à Sé",          lat: -23.5510, lng: -46.6340, quartos: 2, area: 62,  tipo: "compra",  preco: 520000 },
  { id: 3,  titulo: "Loft na Santa Cecília",                lat: -23.5385, lng: -46.6565, quartos: 1, area: 45,  tipo: "aluguel", preco: 2700 },
  { id: 4,  titulo: "Apartamento amplo na Bela Vista",      lat: -23.5575, lng: -46.6455, quartos: 2, area: 70,  tipo: "compra",  preco: 690000 },
  { id: 5,  titulo: "Cobertura na Consolação",              lat: -23.5535, lng: -46.6605, quartos: 3, area: 120, tipo: "aluguel", preco: 5200 },

  // Zona Oeste nobre
  { id: 6,  titulo: "Apartamento moderno em Pinheiros",     lat: -23.5665, lng: -46.7015, quartos: 2, area: 78,  tipo: "compra",  preco: 850000 },
  { id: 7,  titulo: "Studio em Pinheiros",                  lat: -23.5680, lng: -46.7000, quartos: 1, area: 42,  tipo: "aluguel", preco: 3200 },
  { id: 8,  titulo: "Apto alto padrão no Itaim Bibi",       lat: -23.5845, lng: -46.6775, quartos: 3, area: 140, tipo: "compra",  preco: 1850000 },
  { id: 9,  titulo: "Flat no Itaim Bibi",                   lat: -23.5860, lng: -46.6760, quartos: 1, area: 48,  tipo: "aluguel", preco: 4500 },
  { id: 10, titulo: "Apartamento no Jardim Paulista",       lat: -23.5705, lng: -46.6645, quartos: 3, area: 110, tipo: "compra",  preco: 1250000 },
  { id: 11, titulo: "Studio no Jardim Paulista",            lat: -23.5695, lng: -46.6660, quartos: 1, area: 40,  tipo: "aluguel", preco: 3500 },
  { id: 12, titulo: "Apartamento charmoso em Perdizes",     lat: -23.5345, lng: -46.6775, quartos: 2, area: 75,  tipo: "compra",  preco: 780000 },
  { id: 13, titulo: "Casa em Perdizes",                     lat: -23.5360, lng: -46.6760, quartos: 4, area: 220, tipo: "aluguel", preco: 7000 },
  { id: 14, titulo: "Apto na Lapa",                         lat: -23.5275, lng: -46.7045, quartos: 2, area: 64,  tipo: "compra",  preco: 540000 },
  { id: 15, titulo: "Apartamento no Butantã",               lat: -23.5715, lng: -46.7075, quartos: 2, area: 58,  tipo: "aluguel", preco: 2400 },
  { id: 16, titulo: "Casa térrea no Butantã",               lat: -23.5700, lng: -46.7090, quartos: 3, area: 160, tipo: "compra",  preco: 720000 },

  // Zona Sul nobre
  { id: 17, titulo: "Apartamento no Morumbi",               lat: -23.6225, lng: -46.7225, quartos: 3, area: 130, tipo: "aluguel", preco: 5500 },
  { id: 18, titulo: "Casa em condomínio no Morumbi",        lat: -23.6240, lng: -46.7210, quartos: 4, area: 320, tipo: "compra",  preco: 2400000 },
  { id: 19, titulo: "Apto em Moema",                        lat: -23.5995, lng: -46.6655, quartos: 2, area: 82,  tipo: "aluguel", preco: 4900 },
  { id: 20, titulo: "Studio em Moema",                      lat: -23.6010, lng: -46.6640, quartos: 1, area: 44,  tipo: "compra",  preco: 690000 },
  { id: 21, titulo: "Apartamento na Vila Mariana",          lat: -23.5885, lng: -46.6345, quartos: 2, area: 68,  tipo: "aluguel", preco: 3700 },
  { id: 22, titulo: "Apto reformado na Vila Mariana",       lat: -23.5895, lng: -46.6330, quartos: 3, area: 88,  tipo: "compra",  preco: 760000 },
  { id: 23, titulo: "Apartamento no Campo Belo",            lat: -23.6205, lng: -46.6695, quartos: 2, area: 76,  tipo: "aluguel", preco: 4300 },
  { id: 24, titulo: "Cobertura no Campo Belo",              lat: -23.6195, lng: -46.6705, quartos: 3, area: 150, tipo: "compra",  preco: 1450000 },
  { id: 25, titulo: "Apto na Saúde",                        lat: -23.6175, lng: -46.6395, quartos: 2, area: 60,  tipo: "aluguel", preco: 2800 },
  { id: 26, titulo: "Apartamento em Santo Amaro",           lat: -23.6535, lng: -46.7085, quartos: 2, area: 62,  tipo: "compra",  preco: 480000 },

  // Zona Leste
  { id: 27, titulo: "Apto no Tatuapé",                      lat: -23.5405, lng: -46.5765, quartos: 2, area: 66,  tipo: "aluguel", preco: 2900 },
  { id: 28, titulo: "Apartamento novo no Tatuapé",          lat: -23.5395, lng: -46.5755, quartos: 3, area: 84,  tipo: "compra",  preco: 690000 },
  { id: 29, titulo: "Apto na Mooca",                        lat: -23.5565, lng: -46.6005, quartos: 2, area: 64,  tipo: "aluguel", preco: 2700 },
  { id: 30, titulo: "Loft industrial na Mooca",             lat: -23.5550, lng: -46.5995, quartos: 1, area: 52,  tipo: "compra",  preco: 560000 },
  { id: 31, titulo: "Apartamento na Penha",                 lat: -23.5265, lng: -46.5435, quartos: 2, area: 58,  tipo: "aluguel", preco: 1800 },
  { id: 32, titulo: "Casa na Penha",                        lat: -23.5255, lng: -46.5425, quartos: 3, area: 140, tipo: "compra",  preco: 430000 },
  { id: 33, titulo: "Apto na Vila Prudente",                lat: -23.5845, lng: -46.5815, quartos: 2, area: 56,  tipo: "aluguel", preco: 2200 },
  { id: 34, titulo: "Apartamento em Itaquera",              lat: -23.5405, lng: -46.4565, quartos: 2, area: 50,  tipo: "compra",  preco: 320000 },
  { id: 35, titulo: "Casa em Itaquera",                     lat: -23.5390, lng: -46.4550, quartos: 3, area: 120, tipo: "aluguel", preco: 2100 },
  { id: 36, titulo: "Apto em São Mateus",                   lat: -23.6085, lng: -46.4765, quartos: 2, area: 48,  tipo: "compra",  preco: 280000 },
  { id: 37, titulo: "Casa em Cidade Tiradentes",            lat: -23.5895, lng: -46.4035, quartos: 3, area: 110, tipo: "aluguel", preco: 1300 },
  { id: 38, titulo: "Apartamento em Guaianases",            lat: -23.5415, lng: -46.4145, quartos: 2, area: 46,  tipo: "compra",  preco: 250000 },

  // Zona Norte
  { id: 39, titulo: "Apto em Santana",                      lat: -23.5045, lng: -46.6285, quartos: 2, area: 68,  tipo: "aluguel", preco: 3000 },
  { id: 40, titulo: "Apartamento amplo em Santana",         lat: -23.5035, lng: -46.6275, quartos: 3, area: 90,  tipo: "compra",  preco: 620000 },
  { id: 41, titulo: "Apto no Tucuruvi",                     lat: -23.4795, lng: -46.6045, quartos: 2, area: 60,  tipo: "aluguel", preco: 2300 },
  { id: 42, titulo: "Casa no Tucuruvi",                     lat: -23.4785, lng: -46.6035, quartos: 3, area: 150, tipo: "compra",  preco: 580000 },
  { id: 43, titulo: "Apartamento na Freguesia do Ó",        lat: -23.5005, lng: -46.6905, quartos: 2, area: 54,  tipo: "aluguel", preco: 1900 },
  { id: 44, titulo: "Apto em Pirituba",                     lat: -23.4875, lng: -46.7255, quartos: 2, area: 52,  tipo: "compra",  preco: 360000 },
  { id: 45, titulo: "Casa em Pirituba",                     lat: -23.4865, lng: -46.7245, quartos: 3, area: 130, tipo: "aluguel", preco: 2500 },
  { id: 46, titulo: "Apartamento na Brasilândia",           lat: -23.4665, lng: -46.6905, quartos: 2, area: 48,  tipo: "compra",  preco: 290000 },

  // Zona Sul periférica
  { id: 47, titulo: "Apto no Campo Limpo",                  lat: -23.6475, lng: -46.7595, quartos: 2, area: 50,  tipo: "aluguel", preco: 1600 },
  { id: 48, titulo: "Casa no Campo Limpo",                  lat: -23.6465, lng: -46.7585, quartos: 3, area: 115, tipo: "compra",  preco: 380000 },
  { id: 49, titulo: "Apartamento no Capão Redondo",         lat: -23.6685, lng: -46.7805, quartos: 2, area: 46,  tipo: "aluguel", preco: 1350 },
  { id: 50, titulo: "Casa no Jardim Ângela",               lat: -23.6905, lng: -46.7605, quartos: 3, area: 100, tipo: "compra",  preco: 330000 },
  { id: 51, titulo: "Apto no Grajaú",                       lat: -23.7605, lng: -46.7005, quartos: 2, area: 48,  tipo: "aluguel", preco: 1300 },
  { id: 52, titulo: "Casa no Grajaú",                       lat: -23.7595, lng: -46.6995, quartos: 3, area: 110, tipo: "compra",  preco: 360000 },

  // Mais opções variadas
  { id: 53, titulo: "Studio compacto na Consolação",        lat: -23.5525, lng: -46.6610, quartos: 1, area: 36,  tipo: "aluguel", preco: 2400 },
  { id: 54, titulo: "Apartamento family em Moema",          lat: -23.6005, lng: -46.6660, quartos: 4, area: 145, tipo: "compra",  preco: 1450000 },
  { id: 55, titulo: "Apto duplex em Pinheiros",             lat: -23.5660, lng: -46.7025, quartos: 3, area: 125, tipo: "aluguel", preco: 6800 },
  { id: 56, titulo: "Kitnet no Ipiranga",                   lat: -23.5925, lng: -46.6015, quartos: 1, area: 32,  tipo: "compra",  preco: 350000 },
  { id: 57, titulo: "Apartamento no Ipiranga",              lat: -23.5915, lng: -46.6005, quartos: 2, area: 66,  tipo: "aluguel", preco: 2800 },
  { id: 58, titulo: "Cobertura na Vila Mariana",            lat: -23.5880, lng: -46.6350, quartos: 4, area: 200, tipo: "compra",  preco: 1900000 },
  { id: 59, titulo: "Apto garden no Morumbi",               lat: -23.6235, lng: -46.7215, quartos: 4, area: 240, tipo: "aluguel", preco: 8800 },
  { id: 60, titulo: "Apartamento no Jardim Paulista",       lat: -23.5710, lng: -46.6640, quartos: 4, area: 160, tipo: "compra",  preco: 1750000 }
];
