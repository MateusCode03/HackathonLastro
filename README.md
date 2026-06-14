# SeguraSP 🛡️ — Busca de imóveis por segurança

Ferramenta do **Hackathon Lastro**. É o primeiro filtro de imóveis brasileiro que coloca a **segurança da região** no centro da busca.

## 🎯 O problema (do case)

Nenhum portal imobiliário brasileiro permite filtrar imóveis por segurança da região. O cliente que preza por isso hoje faz **duas buscas separadas** — uma no portal para o imóvel, outra no Google para o bairro — e frequentemente desiste no meio.

Esse lead que prioriza segurança costuma ser de **médio-alto padrão**, com decisão mais racional e ticket maior — ou seja, é o lead **mais valioso** para a imobiliária. Mas hoje ela não consegue identificá-lo: o CRM sabe que o cliente quer "2 quartos em Pinheiros", mas não sabe que segurança é o critério número um dele.

## 💡 A solução

Uma única tela que combina **3 filtros** e, de quebra, **captura o perfil do lead**:

| # | Filtro | Como funciona |
|---|--------|---------------|
| 1 | **Segurança** | Ranqueia regiões por **furtos a cada 100 mil habitantes** em 3 níveis: **baixo**, **médio** e **alto** risco (verde / amarelo / vermelho). |
| 2 | **Localização** | A pessoa **arrasta um pin** ("boneco") no mapa para o ponto de interesse e escolhe o **raio máximo** (1–20 km). Só aparecem imóveis dentro do raio. |
| 3 | **Orçamento** | Slider de **valor máximo** de aluguel mensal. |

Os três filtros são aplicados em conjunto e atualizam o mapa e a lista em tempo real.

Ao clicar em **"Tenho interesse"**, o sistema registra o lead **junto com o perfil de busca** (níveis de segurança escolhidos, raio, orçamento e ponto) — entregando à imobiliária um lead com **perfil já mapeado**.

## 🧮 Como o nível de segurança é calculado

```
furtos por 100 mil hab. = (furtos no ano / população) × 100.000
```

| Nível | Faixa (furtos / 100 mil hab.) |
|-------|-------------------------------|
| 🟢 Baixo risco | menor que 1.500 |
| 🟡 Médio risco | 1.500 a 3.000 |
| 🔴 Alto risco | maior que 3.000 |

Os limiares são configuráveis no topo de [js/app.js](js/app.js) (`SEGURANCA_LIMIARES`).

> ⚠️ **Sobre os dados:** os valores de furto são de **referência**, em ordem de grandeza baseada em dados públicos da **SSP-SP** + população do **IBGE**, e os imóveis são **simulados** para a demonstração. A arquitetura está pronta para plugar as bases oficiais. Observação metodológica: distritos centrais/comerciais (Sé, República) têm taxa de furto por habitante alta por causa da grande população flutuante.

## 🛠️ Tecnologias

- **HTML + CSS + JavaScript** puro (site estático, sem build, sem backend)
- **[Leaflet](https://leafletjs.com/) + OpenStreetMap** para o mapa (gratuito, sem chave de API)
- **Python** apenas como servidor local opcional

## ▶️ Como executar

**Opção 1 — duplo-clique:** abra o arquivo [index.html](index.html) no navegador.

**Opção 2 — servidor local (recomendado):**
```bash
python main.py
```
Depois acesse <http://localhost:8000>.

## 📁 Estrutura

```
HackathonLastro/
├── index.html            # estrutura: filtros + mapa + lista + modal de lead
├── css/styles.css        # estilos
├── js/app.js             # lógica: mapa, filtros, Haversine, captura de lead
├── data/
│   ├── distritos-sp.js   # distritos de SP: população, furtos, furto/100k
│   └── imoveis.js        # catálogo simulado de imóveis
├── main.py               # servidor local opcional
└── README.md
```

## 🚧 Próximos passos

- Conectar à base oficial da SSP-SP (atualização periódica) e à API de população do IBGE.
- Polígonos reais dos distritos (GeoJSON do IBGE) no lugar dos círculos.
- Painel da imobiliária para visualizar os leads capturados com perfil mapeado.
- Integração com catálogo real de imóveis.

## 👥 Time

- MateusCode03

---

*Projeto desenvolvido para o Hackathon Lastro.*
