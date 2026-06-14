# Backlog — Descoberta Visual de Imóveis (Lastro / SeguraSP)

> Backlog pronto para colar no **Notion** (a tabela vira um *database* / tabela ao colar).
> Segue o mesmo formato do case do Hackathon Lastro: **ÉPICO · Funcionalidade ·
> História do Usuário · Critérios de Aceite & Regras de Negócio · Complexidade**.

## Visão geral

**Épico:** Descoberta Visual de Imóveis
**Objetivo:** reduzir a fricção do lead leigo. Ao acessar o site, ele descobre o
imóvel **pelas imagens** (curtir/descartar) e recebe recomendações em **regiões e
valores parecidos** — ou fecha a janela e usa os filtros manuais. O perfil curtido
é capturado como valor extra para a imobiliária.

**Princípio de implementação (RN global):** a feature vive 100% na pasta nova
`descobrir/`. Nenhum arquivo de `js/`, `css/` ou `data/` é alterado; a única
interligação são 3 linhas (`<link>` + 2 `<script>`) no `index.html`. As
recomendações disparam **somente via `buscar()`**, preservando o requisito do
projeto de que o output só aparece após buscar.

---

## Backlog (tabela Notion)

| ÉPICO | Funcionalidade | História do Usuário | Critérios de Aceite & Regras de Negócio | Complexidade |
|---|---|---|---|---|
| Descoberta Visual | Janela de boas-vindas com 2 caminhos | Como usuário, ao abrir o site quero uma janela que me deixe escolher entre descobrir pelas imagens ou usar os filtros, para começar do jeito que eu preferir | • Janela aparece sobreposta ao carregar; • Botão "Descobrir pelas imagens" inicia o deck; • Botão "Prefiro usar os filtros" fecha a janela; • Botão ✕ e clique fora também fecham; • RN: fechar NÃO altera o fluxo de filtros atual; • RN: a janela é injetada via JS, sem mudar a estrutura do `index.html` | Baixa |
| Descoberta Visual | Deck de cards visuais (placeholder CSS/SVG) | Como usuário, quero ver cada imóvel com imagem, descrição, localização, preço e quartos, para avaliar rapidamente se gosto | • Card mostra placeholder visual (gradiente por segurança + ícone por tipo), título, descrição, distrito, preço formatado em BRL e nº de quartos; • Badge de segurança no card; • RN: descrição vem de `conteudo-imoveis.js`; sem entrada, é gerada a partir dos dados do imóvel; • RN: 100% offline (sem foto externa) | Média |
| Descoberta Visual | Interação swipe (curtir/descartar) com progresso | Como usuário, quero curtir (❤️) ou descartar (✕) um imóvel por vez, vendo meu progresso, para montar meu gosto sem esforço | • Um card por vez; ❤️ guarda o imóvel, ✕ pula; • Animação de saída ao decidir; • Contador "Imóvel X de N" + barra de progresso + nº de curtidos; • Botão "Ver recomendações" habilita com ≥1 curtida; • RN: deck tem até 10 imóveis embaralhados e variados | Média |
| Descoberta Visual | Motor de recomendação (região + valor) reutilizando `buscar()` | Como usuário, quero que, ao terminar, apareçam imóveis em regiões e faixas de preço parecidas com o que curti, para não recomeçar do zero | • Tipo = modalidade mais curtida; • Ponto = centróide das regiões curtidas; • Raio = maior distância aos curtidos + margem (3–20 km); • Orçamento = 1,2× o maior preço curtido; • Aplica no `estado`/UI e chama `buscar()`; • RN: output só via `buscar()`; • RN: não mistura aluguel e compra | Alta |
| Descoberta Visual | Persistência do perfil de preferências | Como imobiliária, quero receber o perfil que o usuário montou nas curtidas, para qualificar melhor o lead | • Salva em `localStorage` chave `segurasp_preferencias` (tipo, ponto, raio, orçamento, ids curtidos, origem); • RN: NÃO altera a chave `segurasp_leads` existente; • RN: falha de storage não quebra a busca | Baixa |
| Descoberta Visual | Reabertura e integração não-intrusiva | Como usuário, quero reabrir a descoberta quando quiser, sem atrapalhar a busca manual | • Botão flutuante "✨ Descobrir meu imóvel" reabre a janela; • Aparece após o primeiro fechamento; • RN: a descoberta apenas escreve no `estado`/UI e dispara `buscar()` — nenhuma função de `app.js` é modificada | Baixa |

---

## Próximos passos / evolução (fora do MVP)

- Trocar placeholders por fotos reais quando houver catálogo com imagens.
- Pesar a similaridade também por nº de quartos/área (não só região e preço).
- "Refinar gosto": rodada extra de cards a partir das primeiras recomendações.
- Enviar o perfil de preferências junto do lead no painel da imobiliária.
- Permitir arrastar o card (gesto de swipe) além dos botões ❤️/✕.
