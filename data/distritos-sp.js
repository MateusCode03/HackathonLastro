/*
 * data/distritos-sp.js
 * -------------------------------------------------------------------------
 * Base de segurança por distrito da cidade de São Paulo.
 *
 * Métrica: FURTOS POR 100 MIL HABITANTES (furtos_ano / populacao * 100000).
 * O nível (baixo / médio / alto) é derivado em runtime no app.js a partir
 * dos limiares configuráveis (SEGURANCA_LIMIARES).
 *
 * IMPORTANTE: os valores abaixo são de REFERÊNCIA, em ordem de grandeza
 * baseada em dados públicos da SSP-SP (boletins de ocorrência de furto) e
 * população estimada do IBGE. NÃO são números oficiais em tempo real — o
 * objetivo é demonstrar a ferramenta. Para produção, plugar a base oficial
 * da SSP-SP (https://www.ssp.sp.gov.br/estatistica/) + população IBGE.
 *
 * Observação metodológica: distritos centrais e comerciais (Sé, República)
 * têm taxa de FURTO por habitante muito alta por causa da grande população
 * flutuante (trabalhadores, comércio), enquanto distritos residenciais
 * periféricos têm taxa de furto menor — esse é justamente o dado que a
 * ferramenta expõe ao cliente.
 *
 * lat/lng = centróide aproximado do distrito.
 * -------------------------------------------------------------------------
 */
window.DISTRITOS = [
  // ---- Centro / comercial (furto/100k alto) ----
  { nome: "Sé",                lat: -23.5505, lng: -46.6333, populacao: 24000,  furtos_ano: 2280 },
  { nome: "República",         lat: -23.5430, lng: -46.6420, populacao: 57000,  furtos_ano: 4446 },
  { nome: "Santa Cecília",     lat: -23.5380, lng: -46.6560, populacao: 84000,  furtos_ano: 3528 },
  { nome: "Bela Vista",        lat: -23.5580, lng: -46.6450, populacao: 71000,  furtos_ano: 2698 },
  { nome: "Consolação",        lat: -23.5530, lng: -46.6600, populacao: 58000,  furtos_ano: 2088 },
  { nome: "Santo Amaro",       lat: -23.6540, lng: -46.7080, populacao: 72000,  furtos_ano: 2376 },
  { nome: "Pinheiros",         lat: -23.5670, lng: -46.7020, populacao: 65000,  furtos_ano: 2080 },
  { nome: "Itaim Bibi",        lat: -23.5850, lng: -46.6770, populacao: 92000,  furtos_ano: 2852 },

  // ---- Zonas residenciais médias (furto/100k médio) ----
  { nome: "Jardim Paulista",   lat: -23.5700, lng: -46.6650, populacao: 88000,  furtos_ano: 2552 },
  { nome: "Tatuapé",           lat: -23.5400, lng: -46.5760, populacao: 91000,  furtos_ano: 2366 },
  { nome: "Lapa",              lat: -23.5280, lng: -46.7040, populacao: 65000,  furtos_ano: 1560 },
  { nome: "Mooca",             lat: -23.5560, lng: -46.6000, populacao: 75000,  furtos_ano: 1725 },
  { nome: "Vila Mariana",      lat: -23.5890, lng: -46.6340, populacao: 130000, furtos_ano: 2860 },
  { nome: "Moema",             lat: -23.6000, lng: -46.6650, populacao: 84000,  furtos_ano: 1764 },
  { nome: "Santana",           lat: -23.5040, lng: -46.6280, populacao: 118000, furtos_ano: 2360 },
  { nome: "Ipiranga",          lat: -23.5920, lng: -46.6010, populacao: 107000, furtos_ano: 1926 },
  { nome: "Penha",             lat: -23.5260, lng: -46.5430, populacao: 127000, furtos_ano: 2159 },
  { nome: "Vila Prudente",     lat: -23.5840, lng: -46.5810, populacao: 103000, furtos_ano: 1648 },
  { nome: "Campo Belo",        lat: -23.6200, lng: -46.6700, populacao: 65000,  furtos_ano: 1008 },

  // ---- Zonas residenciais / periféricas (furto/100k baixo) ----
  { nome: "Saúde",             lat: -23.6180, lng: -46.6390, populacao: 119000, furtos_ano: 1666 },
  { nome: "Perdizes",          lat: -23.5350, lng: -46.6770, populacao: 110000, furtos_ano: 1485 },
  { nome: "Morumbi",           lat: -23.6230, lng: -46.7220, populacao: 47000,  furtos_ano: 611 },
  { nome: "Tucuruvi",          lat: -23.4790, lng: -46.6040, populacao: 99000,  furtos_ano: 1238 },
  { nome: "Butantã",           lat: -23.5710, lng: -46.7080, populacao: 54000,  furtos_ano: 1026 },
  { nome: "Itaquera",          lat: -23.5400, lng: -46.4560, populacao: 204000, furtos_ano: 2448 },
  { nome: "Freguesia do Ó",    lat: -23.5000, lng: -46.6900, populacao: 159000, furtos_ano: 1829 },
  { nome: "Pirituba",          lat: -23.4870, lng: -46.7250, populacao: 167000, furtos_ano: 1837 },
  { nome: "Campo Limpo",       lat: -23.6470, lng: -46.7590, populacao: 211000, furtos_ano: 2216 },
  { nome: "Capão Redondo",     lat: -23.6680, lng: -46.7800, populacao: 240000, furtos_ano: 2400 },
  { nome: "São Mateus",        lat: -23.6090, lng: -46.4760, populacao: 155000, furtos_ano: 1519 },
  { nome: "Brasilândia",       lat: -23.4660, lng: -46.6900, populacao: 264000, furtos_ano: 2508 },
  { nome: "Jardim Ângela",     lat: -23.6900, lng: -46.7600, populacao: 295000, furtos_ano: 2655 },
  { nome: "Grajaú",            lat: -23.7600, lng: -46.7000, populacao: 360000, furtos_ano: 3060 },
  { nome: "Cidade Tiradentes", lat: -23.5900, lng: -46.4030, populacao: 211000, furtos_ano: 1688 },
  { nome: "Guaianases",        lat: -23.5410, lng: -46.4140, populacao: 268000, furtos_ano: 2090 }
];
