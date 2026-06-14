# CLAUDE.md — Guia do projeto SeguraSP

> Este arquivo é a memória do projeto para o Claude (e para qualquer dev novo).
> Leia antes de mexer no código. Documentado de forma didática.

## 1. O que é o projeto

**SeguraSP** é uma ferramenta web (site estático) feita para o **Hackathon Lastro**.
É um buscador de imóveis em **São Paulo capital** cujo diferencial é filtrar
imóveis pela **segurança da região** — algo que nenhum portal imobiliário
brasileiro oferece hoje.

### Por que isso importa (resumo do case)
- Segurança é um critério de busca "órfão": o cliente faz duas pesquisas
  separadas (portal para o imóvel, Google para o bairro) e desiste no meio.
- Quem prioriza segurança costuma ser lead de **médio-alto padrão** = lead mais
  valioso para a imobiliária.
- A ferramenta, além de ajudar o cliente, **captura o perfil do lead** (o que ele
  priorizou) para entregar à imobiliária um lead com perfil já mapeado.

## 2. Stack e arquitetura

- **HTML + CSS + JavaScript puro**. Sem framework, sem build, sem npm.
- **Leaflet + OpenStreetMap** para o mapa (gratuito, **sem chave de API** — não
  usamos Google Maps justamente para evitar billing/chave).
- **Python** (`main.py`) é só um servidor local opcional; o site funciona por
  duplo-clique no `index.html`.
- **Sem backend.** Os dados ficam em arquivos `.js` que populam variáveis globais
  (`window.DISTRITOS`, `window.IMOVEIS`) — assim funciona em `file://` sem CORS.

### Estrutura de arquivos
```
HackathonLastro/
├── index.html            # estrutura: filtros + mapa + lista + modal de lead
├── css/styles.css        # estilos
├── js/app.js             # TODA a lógica
├── data/
│   ├── distritos-sp.js   # window.DISTRITOS (segurança por distrito)
│   └── imoveis.js        # window.IMOVEIS (catálogo simulado)
├── main.py               # servidor local opcional (python main.py)
├── README.md             # apresentação do projeto
└── CLAUDE.md             # este arquivo
```
A **ordem de carregamento dos scripts** no `index.html` importa:
Leaflet → distritos-sp.js → imoveis.js → app.js (o app depende dos dados e do Leaflet).

## 3. Os filtros (regra de negócio)

Há **4 filtros**, todos aplicados em conjunto (lógica AND). **REQUISITO CHAVE:**
o resultado (lista + marcadores no mapa) **só é gerado quando o usuário clica no
botão "Buscar imóveis"**. Mexer nos filtros NÃO filtra automaticamente. A função
que dispara é `buscar()` em `js/app.js`, ligada ao botão `#buscar`.

| Filtro | UI | Campo no estado | Observação |
|--------|----|----|----|
| **Tipo de negócio** | toggle lateral (Aluguel/Compra) | `estado.tipo` | filtra `imovel.tipo` |
| **Segurança** | lista `<select>` (Qualquer/Alta/Média/Baixa) | `estado.segurancaMin` | "segurança **mínima** desejada" |
| **Localização** | pin arrastável + slider de raio | `estado.pin`, `estado.raioKm` | distância via **Haversine** |
| **Orçamento** | caixa numérica float | `estado.orcamentoMax` | `null` = sem limite |

### ⚠️ Segurança x Furto são INVERSOS (ponto que mais confunde)
A métrica-fonte é **furtos por 100 mil habitantes** (`furtos_ano / populacao * 100000`).
O nível de **furto** é classificado por `SEGURANCA_LIMIARES`:
- furto **baixo**: < 1.500 → **segurança ALTA** 🟢
- furto **médio**: 1.500–3.000 → **segurança MÉDIA** 🟡
- furto **alto**: > 3.000 → **segurança BAIXA** 🔴

O mapa `FURTO_PARA_SEGURANCA` faz essa inversão em `app.js`. Na interface o usuário
vê sempre "**segurança**" (alta = bom = verde). Internamente o código ainda calcula
"furto" primeiro. **Não troque um pelo outro.**

O filtro de segurança é por **mínimo**: usar rank `baixa=1, media=2, alta=3` e
mostrar o imóvel se `rank(imovel) >= rank(selecionado)`. Ex.: escolher "Média"
mostra imóveis de segurança média **e** alta.

## 4. Dados (importante: são simulados!)

- `data/distritos-sp.js`: ~35 distritos de SP com `nome, lat, lng, populacao,
  furtos_ano`. Valores de **referência** (ordem de grandeza SSP-SP + IBGE),
  **não oficiais em tempo real**. Distritos centrais/comerciais (Sé, República)
  têm furto/100k alto por causa da população flutuante.
- `data/imoveis.js`: ~60 imóveis **fictícios** com `id, titulo, lat, lng, quartos,
  area, tipo ("aluguel"|"compra"), preco`. Para aluguel o preço é mensal; para
  compra é o valor total de venda.
- Cada imóvel é associado em runtime ao **distrito de centróide mais próximo**
  (função `distritoMaisProximo`) e herda a segurança dele.

## 5. Captura de lead

Botão "Tenho interesse" em cada card → modal coleta nome/contato e salva, junto, o
**perfil de busca** (tipo, segurança, raio, orçamento, ponto). Persistido em
`localStorage` na chave `segurasp_leads`. É o entregável de valor para a imobiliária.

## 6. Como rodar e testar

```bash
# opção 1: duplo-clique em index.html
# opção 2:
python main.py   # abre http://localhost:8000
```

Checklist de teste end-to-end:
1. Ao abrir, a lista mostra "clique em Buscar" e o mapa aparece com distritos
   coloridos por segurança. **Nada é filtrado antes de buscar.**
2. Alternar Aluguel/Compra muda o conjunto e o texto de ajuda do orçamento.
3. Selecionar segurança mínima, arrastar o pin, ajustar raio, digitar orçamento.
4. Clicar **Buscar** → lista e marcadores aparecem; contador atualiza.
5. "Tenho interesse" → modal salva lead + perfil no localStorage.

## 7. Convenções e dicas para mexer no código

- Limiares de furto: `SEGURANCA_LIMIARES` no topo de `app.js`.
- Cores de segurança: variáveis CSS `--alta/--media/--baixa` (verde/amarelo/vermelho)
  e classes CSS de mesmo nome em cards, badges, pins e legenda.
- Para trocar para Google Maps no futuro: a lógica de filtros é independente do
  mapa; só a parte de tiles/marcadores muda.
- Idioma do projeto: **português (pt-BR)** em UI, comentários e commits.
- Sem dependências novas sem necessidade — manter leve e estático.

## 8. Próximos passos / backlog

- Plugar base oficial da SSP-SP + API de população do IBGE (substituir dados de
  referência).
- Polígonos reais dos distritos (GeoJSON IBGE) no lugar dos círculos.
- Painel da imobiliária para ver os leads capturados.
- Integração com catálogo real de imóveis.
