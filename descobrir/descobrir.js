/* ============================================================
   Descoberta Visual de Imóveis — lógica (feature isolada)
   ------------------------------------------------------------
   Onboarding em estilo "swipe": ao abrir o site, o usuário pode
   descobrir o imóvel pelas imagens (cards placeholder com descrição,
   localização, preço e quartos) OU fechar e usar os filtros manuais.
   A partir das curtidas, infere o perfil e mostra imóveis de REGIÃO e
   VALOR parecidos REUTILIZANDO a busca existente (buscar() de app.js).

   IMPORTANTE: este arquivo é carregado DEPOIS de js/app.js e só LÊ/USA
   os globais já existentes (IMOVEIS, estado, buscar, pin, circuloRaio,
   map, formatBRL, distanciaKm, ROTULO_SEG, mostrarToast). NÃO modifica
   nenhuma função existente — apenas dirige o fluxo e dispara buscar().
   ============================================================ */
(function () {
  "use strict";

  // Se o app principal não carregou (ordem de scripts errada), aborta em silêncio.
  if (typeof IMOVEIS === "undefined" || typeof buscar !== "function") {
    console.warn("[descobrir] app.js não carregou antes — feature desativada.");
    return;
  }

  var CONTEUDO = window.CONTEUDO_IMOVEIS || {};
  var TOTAL_CARDS = Math.min(10, IMOVEIS.length); // quantos cards no deck
  var MARGEM_RAIO_KM = 1;   // folga no raio para cobrir os curtidos
  var FATOR_ORCAMENTO = 1.2; // teto = 1,2x o maior preço curtido

  /* ---------- Utilidades ---------- */

  // Descrição: usa a editorial (conteudo-imoveis.js) ou gera uma a partir dos dados.
  function descricaoDe(im) {
    if (CONTEUDO[im.id] && CONTEUDO[im.id].descricao) return CONTEUDO[im.id].descricao;
    return im.titulo + ": " + im.quartos + " quarto(s), " + im.area +
      " m² em " + im.distrito + " (" + ROTULO_SEG[im.seguranca].toLowerCase() + ").";
  }

  // Ícone-placeholder por tipo de moradia (sem foto real).
  function iconeDe(im) {
    var t = im.titulo.toLowerCase();
    if (t.indexOf("casa") === 0 || t.indexOf("casa ") === 0) return "🏡";
    if (t.indexOf("cobertura") !== -1) return "🏙️";
    if (t.indexOf("studio") !== -1 || t.indexOf("kitnet") !== -1 ||
        t.indexOf("loft") !== -1 || t.indexOf("flat") !== -1) return "🛋️";
    return "🏢";
  }

  function precoTxt(im) {
    return im.tipo === "aluguel"
      ? "R$ " + formatBRL(im.preco) + " <small>/ mês</small>"
      : "R$ " + formatBRL(im.preco) + " <small>à vista</small>";
  }

  // Embaralha uma cópia do array (Fisher–Yates).
  function embaralhar(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* ---------- DOM da janela (injetado no body) ---------- */
  var overlay = document.createElement("div");
  overlay.className = "descobrir-overlay";
  overlay.id = "descobrir-overlay";
  overlay.innerHTML =
    '<div class="descobrir-modal">' +
      '<button class="descobrir-fechar" id="descobrir-fechar" type="button" aria-label="Fechar">✕</button>' +

      // Tela 1: boas-vindas
      '<div class="descobrir-intro" id="descobrir-intro">' +
        '<span class="selo">✨ Novo</span>' +
        '<h2>Descubra seu imóvel ideal</h2>' +
        '<p>Curta os imóveis que mais combinam com você e a Lastro encontra ' +
          'opções em <strong>regiões e valores parecidos</strong> — já filtradas ' +
          'pela <strong>segurança da área</strong>.</p>' +
        '<div class="acoes-intro">' +
          '<button class="descobrir-btn-primario" id="descobrir-comecar" type="button">📸 Descobrir pelas imagens</button>' +
          '<button class="descobrir-btn-secundario" id="descobrir-pular" type="button">Prefiro usar os filtros</button>' +
        '</div>' +
      '</div>' +

      // Tela 2: deck de swipe
      '<div class="descobrir-deck" id="descobrir-deck">' +
        '<div class="descobrir-progresso">' +
          '<span id="descobrir-contagem">Imóvel 1 de ' + TOTAL_CARDS + '</span>' +
          '<span class="curtidas">❤️ <span id="descobrir-ncurtidas">0</span> curtido(s)</span>' +
        '</div>' +
        '<div class="descobrir-barra"><i id="descobrir-barra"></i></div>' +
        '<div id="descobrir-card-slot"></div>' +
        '<div class="descobrir-acoes">' +
          '<button class="descartar" id="descobrir-descartar" type="button" aria-label="Descartar">✕</button>' +
          '<button class="curtir" id="descobrir-curtir" type="button" aria-label="Curtir">❤️</button>' +
        '</div>' +
        '<button class="descobrir-ver-recs" id="descobrir-ver-recs" type="button" disabled>Ver recomendações</button>' +
      '</div>' +

    '</div>';
  document.body.appendChild(overlay);

  // Botão flutuante para reabrir a descoberta.
  var btnReabrir = document.createElement("button");
  btnReabrir.className = "descobrir-reabrir";
  btnReabrir.id = "descobrir-reabrir";
  btnReabrir.type = "button";
  btnReabrir.textContent = "✨ Descobrir meu imóvel";
  btnReabrir.hidden = true;
  document.body.appendChild(btnReabrir);

  // Atalhos para elementos.
  var elIntro = document.getElementById("descobrir-intro");
  var elDeck = document.getElementById("descobrir-deck");
  var elSlot = document.getElementById("descobrir-card-slot");
  var elContagem = document.getElementById("descobrir-contagem");
  var elNcurtidas = document.getElementById("descobrir-ncurtidas");
  var elBarra = document.getElementById("descobrir-barra");
  var elVerRecs = document.getElementById("descobrir-ver-recs");

  /* ---------- Estado do deck ---------- */
  var baralho = [];
  var indice = 0;
  var curtidos = [];

  /* ---------- Abertura / fechamento da janela ---------- */
  function abrirJanela() {
    // Reinicia para a tela de boas-vindas.
    elDeck.classList.remove("ativo");
    elIntro.style.display = "";
    overlay.hidden = false;
  }
  function fecharJanela() {
    overlay.hidden = true;
    btnReabrir.hidden = false; // libera o botão flutuante
  }

  /* ---------- Deck de swipe ---------- */
  function iniciarDeck() {
    baralho = embaralhar(IMOVEIS).slice(0, TOTAL_CARDS);
    indice = 0;
    curtidos = [];
    elNcurtidas.textContent = "0";
    elVerRecs.disabled = true;
    elIntro.style.display = "none";
    elDeck.classList.add("ativo");
    renderCard();
  }

  function renderCard() {
    if (indice >= baralho.length) { finalizar(); return; }
    var im = baralho[indice];
    elContagem.textContent = "Imóvel " + (indice + 1) + " de " + baralho.length;
    elBarra.style.width = ((indice / baralho.length) * 100) + "%";

    elSlot.innerHTML =
      '<article class="descobrir-card" id="descobrir-card">' +
        '<div class="descobrir-card-img ' + im.seguranca + '">' +
          '<span class="badge ' + im.seguranca + '">' + ROTULO_SEG[im.seguranca] + '</span>' +
          '<span class="descobrir-card-icone">' + iconeDe(im) + '</span>' +
        '</div>' +
        '<div class="descobrir-card-info">' +
          '<h3>' + im.titulo + '</h3>' +
          '<p class="descobrir-card-desc">' + descricaoDe(im) + '</p>' +
          '<div class="descobrir-card-meta">' +
            '<span>📍 ' + im.distrito + '</span>' +
            '<span>🛏️ ' + im.quartos + ' quarto(s)</span>' +
            '<span>📐 ' + im.area + ' m²</span>' +
          '</div>' +
          '<div class="descobrir-card-preco">' + precoTxt(im) + '</div>' +
        '</div>' +
      '</article>';
  }

  function avancar(curtiu) {
    if (curtiu) {
      curtidos.push(baralho[indice]);
      elNcurtidas.textContent = String(curtidos.length);
      elVerRecs.disabled = false;
    }
    var card = document.getElementById("descobrir-card");
    if (card) card.classList.add(curtiu ? "sai-direita" : "sai-esquerda");

    indice++;
    // Aguarda a animação antes de trocar o card.
    setTimeout(function () { renderCard(); }, 220);
  }

  function finalizar() {
    if (curtidos.length === 0) {
      // Sem curtidas: volta à intro para o usuário escolher de novo.
      abrirJanela();
      return;
    }
    gerarRecomendacoes(curtidos);
  }

  /* ---------- Motor de recomendação (regiões + valores parecidos) ---------- */
  function tipoDominante(lista) {
    var aluguel = 0, compra = 0;
    lista.forEach(function (im) { im.tipo === "aluguel" ? aluguel++ : compra++; });
    return compra > aluguel ? "compra" : "aluguel";
  }

  function gerarRecomendacoes(lista) {
    var tipo = tipoDominante(lista);
    // Considera só os curtidos do tipo dominante (não misturar aluguel/compra).
    var base = lista.filter(function (im) { return im.tipo === tipo; });
    if (base.length === 0) base = lista;

    // Centróide das regiões curtidas.
    var lat = 0, lng = 0;
    base.forEach(function (im) { lat += im.lat; lng += im.lng; });
    lat /= base.length; lng /= base.length;

    // Raio = maior distância do centróide a um curtido (+ margem), limitado 3–20 km.
    var maxDist = 0;
    base.forEach(function (im) {
      var d = distanciaKm(lat, lng, im.lat, im.lng);
      if (d > maxDist) maxDist = d;
    });
    var raio = Math.min(20, Math.max(3, Math.ceil(maxDist) + MARGEM_RAIO_KM));

    // Orçamento = 1,2x o maior preço curtido (valores parecidos).
    var maxPreco = 0;
    base.forEach(function (im) { if (im.preco > maxPreco) maxPreco = im.preco; });
    var orcamento = Math.round(maxPreco * FATOR_ORCAMENTO);

    aplicarPerfil(tipo, lat, lng, raio, orcamento);
    salvarPreferencias(tipo, lat, lng, raio, orcamento, lista);

    fecharJanela();
    buscar(); // único gatilho do output — reutiliza lista + mapa existentes
    if (typeof mostrarToast === "function") {
      mostrarToast("✨ Recomendações geradas a partir das suas curtidas!");
    }
  }

  // Escreve o perfil no estado + UI reusando os handlers existentes de app.js.
  function aplicarPerfil(tipo, lat, lng, raio, orcamento) {
    // Tipo: clicar no toggle reaproveita o handler (ajusta estado.tipo + hints).
    var optTipo = document.querySelector('.toggle-opt[data-tipo="' + tipo + '"]');
    if (optTipo && !optTipo.classList.contains("ativo")) optTipo.click();

    // Ponto de interesse: reposiciona pin, círculo e mapa.
    estado.pin = { lat: lat, lng: lng };
    pin.setLatLng([lat, lng]);
    circuloRaio.setLatLng([lat, lng]);
    map.setView([lat, lng], 12);

    // Raio: dispara o handler 'input' para sincronizar estado + visual.
    var raioEl = document.getElementById("raio");
    raioEl.value = raio;
    raioEl.dispatchEvent(new Event("input"));

    // Orçamento: idem.
    var orcEl = document.getElementById("orcamento");
    orcEl.value = orcamento;
    orcEl.dispatchEvent(new Event("input"));
  }

  // Persiste o perfil de preferências (valor extra p/ a imobiliária).
  // Chave própria — NÃO toca em "segurasp_leads".
  function salvarPreferencias(tipo, lat, lng, raio, orcamento, lista) {
    try {
      var pref = {
        origem: "descoberta-visual",
        tipo: tipo,
        pin: { lat: lat, lng: lng },
        raioKm: raio,
        orcamentoMax: orcamento,
        curtidosIds: lista.map(function (im) { return im.id; })
      };
      var todas = JSON.parse(localStorage.getItem("segurasp_preferencias") || "[]");
      todas.push(pref);
      localStorage.setItem("segurasp_preferencias", JSON.stringify(todas));
    } catch (e) {
      console.warn("[descobrir] não foi possível salvar preferências:", e);
    }
  }

  /* ---------- Ligações de eventos ---------- */
  document.getElementById("descobrir-comecar").addEventListener("click", iniciarDeck);
  document.getElementById("descobrir-pular").addEventListener("click", fecharJanela);
  document.getElementById("descobrir-fechar").addEventListener("click", fecharJanela);
  document.getElementById("descobrir-descartar").addEventListener("click", function () { avancar(false); });
  document.getElementById("descobrir-curtir").addEventListener("click", function () { avancar(true); });
  elVerRecs.addEventListener("click", function () { finalizar(); });
  btnReabrir.addEventListener("click", abrirJanela);

  // Fecha ao clicar fora da janela.
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) fecharJanela();
  });

  /* ---------- Abre a janela ao carregar ---------- */
  abrirJanela();
})();
