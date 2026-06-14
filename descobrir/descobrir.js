/* ============================================================
   Descoberta Visual de Imóveis — lógica (feature isolada)
   ------------------------------------------------------------
   Onboarding em estilo "swipe": ao abrir o site, o usuário pode
   descobrir o imóvel pelas imagens (curtir ❤️ / descartar ✕) ou
   fechar e usar os filtros manuais. A partir das curtidas, infere
   o perfil e mostra imóveis de REGIÃO e VALOR parecidos via buscar().

   Imagens: pasta descobrir/img/  — nomenclatura por tier de preço:
     pobre_N.jpg  → aluguel ≤ R$1.000  | compra ≤ R$60.000
     medio_N.jpg  → aluguel R$1.001–1.999 | compra R$80.001–200.000
     rico_N.jpg   → aluguel ≥ R$2.000  | compra > R$200.000
   Se a imagem não carregar, exibe gradiente CSS como fallback.

   IMPORTANTE: carregado DEPOIS de js/app.js — usa os globais
   (IMOVEIS, estado, buscar, pin, circuloRaio, map, formatBRL,
   distanciaKm, ROTULO_SEG, mostrarToast) sem modificar nenhum deles.
   ============================================================ */
(function () {
  "use strict";

  if (typeof IMOVEIS === "undefined" || typeof buscar !== "function") {
    console.warn("[descobrir] app.js não carregou antes — feature desativada.");
    return;
  }

  var CONTEUDO = window.CONTEUDO_IMOVEIS || {};
  var IMG_DIR = "descobrir/img/";
  var MARGEM_RAIO_KM = 1;
  var FATOR_ORCAMENTO = 1.2;

  /* ---------- Catálogo de imagens por tier ----------
     Adicione mais arquivos ao array para ampliar o deck.
     O deck mostrará no máximo um card por imagem disponível.
  ---------------------------------------------------- */
  var IMGS_TIER = {
    pobre: ["pobre_1.jpg", "pobre_2.jpg"],
    medio: ["medio_1.jpg", "medio_2.jpg"],
    rico:  ["rico_1.jpg", "rico_2.jpg", "rico_3.jpg", "rico_4.jpg", "rico_5.jpg"]
  };

  /* ---------- Tier de preço de um imóvel ---------- */
  function tierDe(im) {
    if (im.tipo === "aluguel") {
      if (im.preco <= 1000) return "pobre";
      if (im.preco < 2000)  return "medio";
      return "rico";
    }
    // compra
    if (im.preco <= 60000)  return "pobre";
    if (im.preco <= 200000) return "medio";
    return "rico";
  }

  /* ---------- Monta o deck: máx. 1 card por imagem disponível ----------
     Garante que cada imagem de um tier seja usada no máximo uma vez.
     O deck é embaralhado para variar a ordem a cada visita.
  ---------------------------------------------------------------------- */
  function montarDeck() {
    var usados = { pobre: 0, medio: 0, rico: 0 };
    var embaralhados = embaralhar(IMOVEIS);
    var deck = [];
    for (var i = 0; i < embaralhados.length; i++) {
      var im = embaralhados[i];
      var tier = tierDe(im);
      if (usados[tier] < IMGS_TIER[tier].length) {
        // Clona para não poluir o objeto global com _imgIdx
        var card = Object.assign({}, im, { _tier: tier, _imgIdx: usados[tier] });
        usados[tier]++;
        deck.push(card);
      }
      // Encerra quando todos os tiers estão esgotados
      var totalDisp = IMGS_TIER.pobre.length + IMGS_TIER.medio.length + IMGS_TIER.rico.length;
      if (deck.length >= totalDisp) break;
    }
    return deck;
  }

  /* ---------- Utilidades visuais ---------- */

  function descricaoDe(im) {
    if (CONTEUDO[im.id] && CONTEUDO[im.id].descricao) return CONTEUDO[im.id].descricao;
    return im.titulo + ": " + im.quartos + " quarto(s), " + im.area +
      " m² em " + im.distrito + " (" + ROTULO_SEG[im.seguranca].toLowerCase() + ").";
  }

  function iconeFallback(im) {
    var t = im.titulo.toLowerCase();
    if (t.indexOf("casa") === 0)   return "🏡";
    if (t.indexOf("cobertura") !== -1) return "🏙️";
    if (t.indexOf("studio") !== -1 || t.indexOf("kitnet") !== -1 ||
        t.indexOf("loft") !== -1   || t.indexOf("flat") !== -1) return "🛋️";
    return "🏢";
  }

  function precoTxt(im) {
    return im.tipo === "aluguel"
      ? "R$ " + formatBRL(im.preco) + " <small>/ mês</small>"
      : "R$ " + formatBRL(im.preco) + " <small>à vista</small>";
  }

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
          '<span id="descobrir-contagem">—</span>' +
          '<span class="curtidas">❤️ <span id="descobrir-ncurtidas">0</span> curtido(s)</span>' +
        '</div>' +
        '<div class="descobrir-barra"><i id="descobrir-barra"></i></div>' +
        '<div id="descobrir-card-slot"></div>' +
        '<div class="descobrir-acoes">' +
          '<button class="descartar" id="descobrir-descartar" type="button" aria-label="Descartar">✕</button>' +
          '<button class="curtir"   id="descobrir-curtir"    type="button" aria-label="Curtir">❤️</button>' +
        '</div>' +
        '<button class="descobrir-ver-recs" id="descobrir-ver-recs" type="button" disabled>Ver recomendações</button>' +
      '</div>' +

    '</div>';
  document.body.appendChild(overlay);

  var btnReabrir = document.createElement("button");
  btnReabrir.className = "descobrir-reabrir";
  btnReabrir.id = "descobrir-reabrir";
  btnReabrir.type = "button";
  btnReabrir.textContent = "✨ Descobrir meu imóvel";
  btnReabrir.hidden = true;
  document.body.appendChild(btnReabrir);

  var elIntro     = document.getElementById("descobrir-intro");
  var elDeck      = document.getElementById("descobrir-deck");
  var elSlot      = document.getElementById("descobrir-card-slot");
  var elContagem  = document.getElementById("descobrir-contagem");
  var elNcurtidas = document.getElementById("descobrir-ncurtidas");
  var elBarra     = document.getElementById("descobrir-barra");
  var elVerRecs   = document.getElementById("descobrir-ver-recs");

  /* ---------- Estado do deck ---------- */
  var baralho = [];
  var indice  = 0;
  var curtidos = [];

  /* ---------- Abertura / fechamento ---------- */
  function abrirJanela() {
    elDeck.classList.remove("ativo");
    elIntro.style.display = "";
    overlay.hidden = false;
  }
  function fecharJanela() {
    overlay.hidden = true;
    btnReabrir.hidden = false;
  }

  /* ---------- Deck de swipe ---------- */
  function iniciarDeck() {
    baralho  = montarDeck();
    indice   = 0;
    curtidos = [];
    elNcurtidas.textContent = "0";
    elVerRecs.disabled = true;
    elIntro.style.display = "none";
    elDeck.classList.add("ativo");
    renderCard();
  }

  function renderCard() {
    if (indice >= baralho.length) { finalizar(); return; }
    var im    = baralho[indice];
    var total = baralho.length;
    elContagem.textContent = "Imóvel " + (indice + 1) + " de " + total;
    elBarra.style.width = ((indice / total) * 100) + "%";

    var imgSrc = IMG_DIR + IMGS_TIER[im._tier][im._imgIdx];

    elSlot.innerHTML =
      '<article class="descobrir-card" id="descobrir-card">' +
        '<div class="descobrir-card-img ' + im.seguranca + '">' +
          // Imagem local (fallback: gradiente + emoji via onerror)
          '<img class="descobrir-card-foto"' +
               ' src="' + imgSrc + '"' +
               ' alt="' + im.titulo + '"' +
               ' onerror="this.style.display=\'none\'"' +
          '/>' +
          '<span class="badge ' + im.seguranca + '">' + ROTULO_SEG[im.seguranca] + '</span>' +
          '<span class="descobrir-card-icone">' + iconeFallback(im) + '</span>' +
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
    setTimeout(function () { renderCard(); }, 220);
  }

  function finalizar() {
    if (curtidos.length === 0) { abrirJanela(); return; }
    gerarRecomendacoes(curtidos);
  }

  /* ---------- Motor de recomendação ---------- */
  function tipoDominante(lista) {
    var aluguel = 0, compra = 0;
    lista.forEach(function (im) { im.tipo === "aluguel" ? aluguel++ : compra++; });
    return compra > aluguel ? "compra" : "aluguel";
  }

  function gerarRecomendacoes(lista) {
    var tipo = tipoDominante(lista);
    var base = lista.filter(function (im) { return im.tipo === tipo; });
    if (base.length === 0) base = lista;

    var lat = 0, lng = 0;
    base.forEach(function (im) { lat += im.lat; lng += im.lng; });
    lat /= base.length; lng /= base.length;

    var maxDist = 0;
    base.forEach(function (im) {
      var d = distanciaKm(lat, lng, im.lat, im.lng);
      if (d > maxDist) maxDist = d;
    });
    var raio = Math.min(20, Math.max(3, Math.ceil(maxDist) + MARGEM_RAIO_KM));

    var maxPreco = 0;
    base.forEach(function (im) { if (im.preco > maxPreco) maxPreco = im.preco; });
    var orcamento = Math.round(maxPreco * FATOR_ORCAMENTO);

    aplicarPerfil(tipo, lat, lng, raio, orcamento);
    salvarPreferencias(tipo, lat, lng, raio, orcamento, lista);

    fecharJanela();
    buscar();
    if (typeof mostrarToast === "function") {
      mostrarToast("✨ Recomendações geradas a partir das suas curtidas!");
    }
  }

  function aplicarPerfil(tipo, lat, lng, raio, orcamento) {
    var optTipo = document.querySelector('.toggle-opt[data-tipo="' + tipo + '"]');
    if (optTipo && !optTipo.classList.contains("ativo")) optTipo.click();

    estado.pin = { lat: lat, lng: lng };
    pin.setLatLng([lat, lng]);
    circuloRaio.setLatLng([lat, lng]);
    map.setView([lat, lng], 12);

    var raioEl = document.getElementById("raio");
    raioEl.value = raio;
    raioEl.dispatchEvent(new Event("input"));

    var orcEl = document.getElementById("orcamento");
    orcEl.value = orcamento;
    orcEl.dispatchEvent(new Event("input"));
  }

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

  /* ---------- Eventos ---------- */
  document.getElementById("descobrir-comecar").addEventListener("click", iniciarDeck);
  document.getElementById("descobrir-pular").addEventListener("click", fecharJanela);
  document.getElementById("descobrir-fechar").addEventListener("click", fecharJanela);
  document.getElementById("descobrir-descartar").addEventListener("click", function () { avancar(false); });
  document.getElementById("descobrir-curtir").addEventListener("click", function () { avancar(true); });
  elVerRecs.addEventListener("click", function () { finalizar(); });
  btnReabrir.addEventListener("click", abrirJanela);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) fecharJanela();
  });

  abrirJanela();
})();
