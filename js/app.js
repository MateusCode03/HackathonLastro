/* ============================================================
   SeguraSP — lógica do app
   Mapa (Leaflet/OSM) + filtros + captura de lead.

   IMPORTANTE (requisito do projeto): a lista de imóveis (o "output")
   só é gerada quando o usuário clica em "Buscar imóveis". Mexer nos
   filtros NÃO filtra automaticamente — apenas o botão Buscar aplica.
   ============================================================ */

/* ---------- Configuração ---------- */
const SP_CENTRO = [-23.5805, -46.6500];

// Limiares de ranqueamento por FURTOS / 100 MIL HABITANTES.
// Edite aqui para recalibrar os 3 níveis de furto.
const SEGURANCA_LIMIARES = {
  baixo: 1500, // < 1500   -> furto baixo
  medio: 3000  // 1500-3000 -> furto médio ; > 3000 -> furto alto
};

/*
 * SEGURANÇA x FURTO (atenção, são inversos!):
 *   furto baixo  -> segurança ALTA  (região mais segura)
 *   furto médio  -> segurança MÉDIA
 *   furto alto   -> segurança BAIXA (região menos segura)
 */
const FURTO_PARA_SEGURANCA = { baixo: "alta", medio: "media", alto: "baixa" };

// Cores por nível de SEGURANÇA (verde = seguro, vermelho = inseguro).
const CORES = { alta: "#1ca35a", media: "#e8a200", baixa: "#d63b3b" };
const ROTULO_SEG = { alta: "Segurança alta", media: "Segurança média", baixa: "Segurança baixa" };
// Ranking para o filtro "segurança mínima desejada".
const RANK_SEG = { baixa: 1, media: 2, alta: 3 };

/* ---------- Utilidades ---------- */

// Fórmula de Haversine: distância em km entre dois pontos (lat/lng).
function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // raio da Terra em km
  const toRad = (g) => (g * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Furtos por 100 mil habitantes de um distrito.
function furtosPor100k(d) {
  return (d.furtos_ano / d.populacao) * 100000;
}

// Classifica o FURTO de um distrito em baixo / medio / alto a partir da taxa.
function nivelFurto(d) {
  const taxa = furtosPor100k(d);
  if (taxa < SEGURANCA_LIMIARES.baixo) return "baixo";
  if (taxa <= SEGURANCA_LIMIARES.medio) return "medio";
  return "alto";
}

// Segurança do distrito (inverso do furto): alta / media / baixa.
function segurancaDoDistrito(d) {
  return FURTO_PARA_SEGURANCA[nivelFurto(d)];
}

// Distrito mais próximo de um imóvel (associação por centróide).
function distritoMaisProximo(lat, lng) {
  let melhor = null;
  let menor = Infinity;
  for (const d of window.DISTRITOS) {
    const dist = distanciaKm(lat, lng, d.lat, d.lng);
    if (dist < menor) {
      menor = dist;
      melhor = d;
    }
  }
  return melhor;
}

function formatBRL(v) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/* ---------- Pré-processamento dos imóveis ---------- */
// Anexa a cada imóvel o distrito e a segurança correspondente.
const IMOVEIS = window.IMOVEIS.map((im) => {
  const d = distritoMaisProximo(im.lat, im.lng);
  return {
    ...im,
    distrito: d.nome,
    seguranca: segurancaDoDistrito(d),
    furtos_100k: Math.round(furtosPor100k(d))
  };
});

/* ---------- Estado dos filtros ---------- */
const estado = {
  tipo: "aluguel",       // "aluguel" | "compra"
  segurancaMin: "",       // "" (qualquer) | "alta" | "media" | "baixa"
  raioKm: 5,
  orcamentoMax: null,     // null = sem limite
  pin: { lat: SP_CENTRO[0], lng: SP_CENTRO[1] }
};

/* ---------- Mapa ---------- */
const map = L.map("map").setView(SP_CENTRO, 11);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map);

// Camada com os círculos de segurança dos distritos (choropleth simplificado).
const camadaDistritos = L.layerGroup().addTo(map);
function desenharDistritos() {
  camadaDistritos.clearLayers();
  for (const d of window.DISTRITOS) {
    const seg = segurancaDoDistrito(d);
    L.circle([d.lat, d.lng], {
      radius: 900,
      color: CORES[seg],
      fillColor: CORES[seg],
      fillOpacity: 0.25,
      weight: 1
    })
      .bindTooltip(
        `<strong>${d.nome}</strong><br>${Math.round(furtosPor100k(d))} furtos/100 mil hab.<br>${ROTULO_SEG[seg]}`
      )
      .addTo(camadaDistritos);
  }
}
desenharDistritos();

// Pin arrastável (o "boneco" do ponto de interesse).
const pin = L.marker(SP_CENTRO, { draggable: true }).addTo(map);
pin.bindPopup("📍 Arraste-me para seu ponto de interesse").openPopup();

// Círculo do raio de busca.
const circuloRaio = L.circle(SP_CENTRO, {
  radius: estado.raioKm * 1000,
  color: "#14306b",
  fillColor: "#14306b",
  fillOpacity: 0.06,
  weight: 2,
  dashArray: "6 6"
}).addTo(map);

// Camada dos marcadores de imóveis filtrados (só após Buscar).
const camadaImoveis = L.layerGroup().addTo(map);

// Arrastar o pin atualiza apenas o visual do raio (não filtra ainda).
pin.on("drag", (e) => {
  const p = e.target.getLatLng();
  estado.pin = { lat: p.lat, lng: p.lng };
  circuloRaio.setLatLng(p);
});

/* ---------- Aplicação dos filtros ---------- */
function imovelPassa(im) {
  // Filtro: tipo de negócio (aluguel / compra)
  if (im.tipo !== estado.tipo) return false;
  // Filtro: segurança mínima desejada
  if (estado.segurancaMin && RANK_SEG[im.seguranca] < RANK_SEG[estado.segurancaMin]) return false;
  // Filtro: orçamento (caixa float; null = sem limite)
  if (estado.orcamentoMax !== null && im.preco > estado.orcamentoMax) return false;
  // Filtro: localização (raio a partir do pin)
  const dist = distanciaKm(estado.pin.lat, estado.pin.lng, im.lat, im.lng);
  if (dist > estado.raioKm) return false;
  im._distPin = dist;
  return true;
}

// IMPORTANTE: só roda quando o usuário clica em "Buscar imóveis".
let jaBuscou = false;
function buscar() {
  jaBuscou = true;
  const filtrados = IMOVEIS.filter(imovelPassa).sort((a, b) => a._distPin - b._distPin);
  renderMarcadores(filtrados);
  renderLista(filtrados);
  document.getElementById("counter").textContent =
    `${filtrados.length} imóvel(is) encontrado(s)`;
}

/* ---------- Render no mapa ---------- */
function renderMarcadores(lista) {
  camadaImoveis.clearLayers();
  for (const im of lista) {
    const icone = L.divIcon({
      className: "",
      html: `<div class="pin-imovel ${im.seguranca}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 16]
    });
    const valorTxt = im.tipo === "aluguel" ? `R$ ${formatBRL(im.preco)} / mês` : `R$ ${formatBRL(im.preco)}`;
    L.marker([im.lat, im.lng], { icon: icone })
      .bindPopup(
        `<strong>${im.titulo}</strong><br>` +
          `${im.distrito} • ${ROTULO_SEG[im.seguranca]}<br>` +
          `${im.furtos_100k} furtos/100 mil hab.<br>` +
          `<strong>${valorTxt}</strong>`
      )
      .addTo(camadaImoveis);
  }
}

/* ---------- Render da lista lateral ---------- */
function renderLista(lista) {
  const el = document.getElementById("lista");
  if (lista.length === 0) {
    el.innerHTML =
      '<div class="empty">Nenhum imóvel atende a todos os filtros.<br>Tente aumentar o raio, ajustar o orçamento ou reduzir a exigência de segurança.</div>';
    return;
  }
  el.innerHTML = lista
    .map((im) => {
      const unidade = im.tipo === "aluguel" ? "<small>/ mês</small>" : "<small>à vista</small>";
      return `
    <article class="imovel-card ${im.seguranca}">
      <span class="badge ${im.seguranca}">${ROTULO_SEG[im.seguranca]} • ${im.furtos_100k}/100 mil</span>
      <h3>${im.titulo}</h3>
      <div class="imovel-meta">
        ${im.distrito} • ${im.quartos} quarto(s) • ${im.area} m² • ${im._distPin.toFixed(1)} km do pin
      </div>
      <div class="card-footer">
        <span class="imovel-preco">R$ ${formatBRL(im.preco)} ${unidade}</span>
        <button class="btn-primary" data-id="${im.id}">Tenho interesse</button>
      </div>
    </article>`;
    })
    .join("");

  // Liga os botões "Tenho interesse".
  el.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () =>
      abrirModal(IMOVEIS.find((x) => x.id === Number(btn.dataset.id)))
    );
  });
}

/* ---------- Controles dos filtros (NÃO disparam busca) ---------- */

// Toggle lateral aluguel / compra
const toggle = document.getElementById("toggle-negocio");
toggle.querySelectorAll(".toggle-opt").forEach((btn) => {
  btn.addEventListener("click", () => {
    toggle.querySelectorAll(".toggle-opt").forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    estado.tipo = btn.dataset.tipo;
    // Ajusta o texto de ajuda do orçamento conforme o tipo.
    document.getElementById("orcamento-hint").textContent =
      estado.tipo === "aluguel"
        ? "Valor máximo do aluguel mensal (R$). Deixe em branco para qualquer valor."
        : "Valor máximo de venda (R$). Deixe em branco para qualquer valor.";
    document.getElementById("orcamento").placeholder =
      estado.tipo === "aluguel" ? "Ex.: 3500,00" : "Ex.: 800000,00";
  });
});

// Lista de segurança
document.getElementById("seguranca").addEventListener("change", (e) => {
  estado.segurancaMin = e.target.value;
});

// Raio (atualiza visual do círculo na hora; só filtra no Buscar)
const raio = document.getElementById("raio");
raio.addEventListener("input", (e) => {
  estado.raioKm = Number(e.target.value);
  document.getElementById("raio-valor").textContent = estado.raioKm;
  circuloRaio.setRadius(estado.raioKm * 1000);
});

// Orçamento (caixa float)
document.getElementById("orcamento").addEventListener("input", (e) => {
  const v = e.target.value.trim();
  estado.orcamentoMax = v === "" ? null : parseFloat(v.replace(",", "."));
});

// Reset do pin
document.getElementById("reset-pin").addEventListener("click", () => {
  pin.setLatLng(SP_CENTRO);
  circuloRaio.setLatLng(SP_CENTRO);
  estado.pin = { lat: SP_CENTRO[0], lng: SP_CENTRO[1] };
  map.setView(SP_CENTRO, 11);
});

// Botão BUSCAR — único gatilho do output.
document.getElementById("buscar").addEventListener("click", buscar);

/* ---------- Modal de captura de lead ---------- */
let imovelSelecionado = null;

function resumoPerfil() {
  return [
    `Tipo de negócio: ${estado.tipo === "aluguel" ? "Aluguel" : "Venda"}`,
    `Segurança mínima desejada: ${estado.segurancaMin ? ROTULO_SEG[estado.segurancaMin] : "qualquer"}`,
    `Raio de busca: até ${estado.raioKm} km do ponto de interesse`,
    `Orçamento máximo: ${estado.orcamentoMax === null ? "qualquer valor" : "R$ " + formatBRL(estado.orcamentoMax)}`,
    `Ponto de interesse: ${estado.pin.lat.toFixed(4)}, ${estado.pin.lng.toFixed(4)}`
  ];
}

function abrirModal(im) {
  imovelSelecionado = im;
  const valorTxt = im.tipo === "aluguel" ? `R$ ${formatBRL(im.preco)}/mês` : `R$ ${formatBRL(im.preco)}`;
  document.getElementById("modal-imovel").textContent =
    `${im.titulo} — ${im.distrito} (${valorTxt})`;
  const ul = document.getElementById("perfil-resumo");
  ul.innerHTML = resumoPerfil().map((l) => `<li>${l}</li>`).join("");
  document.getElementById("modal-overlay").hidden = false;
}

function fecharModal() {
  document.getElementById("modal-overlay").hidden = true;
  document.getElementById("lead-form").reset();
}

document.getElementById("modal-close").addEventListener("click", fecharModal);
document.getElementById("modal-overlay").addEventListener("click", (e) => {
  if (e.target.id === "modal-overlay") fecharModal();
});

document.getElementById("lead-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const lead = {
    nome: document.getElementById("lead-nome").value,
    contato: document.getElementById("lead-contato").value,
    imovel: imovelSelecionado ? imovelSelecionado.titulo : null,
    imovelId: imovelSelecionado ? imovelSelecionado.id : null,
    perfil: {
      tipo: estado.tipo,
      segurancaMin: estado.segurancaMin,
      raioKm: estado.raioKm,
      orcamentoMax: estado.orcamentoMax,
      pin: { ...estado.pin }
    }
  };
  // Persiste o lead com perfil mapeado (entregável para a imobiliária).
  const leads = JSON.parse(localStorage.getItem("segurasp_leads") || "[]");
  leads.push(lead);
  localStorage.setItem("segurasp_leads", JSON.stringify(leads));

  fecharModal();
  mostrarToast("✅ Lead enviado com perfil mapeado!");
});

/* ---------- Toast ---------- */
function mostrarToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.hidden = false;
  setTimeout(() => (t.hidden = true), 2800);
}

/* ---------- Estado inicial: SEM resultados até o usuário buscar ---------- */
document.getElementById("counter").textContent = "Defina os filtros e clique em Buscar";
document.getElementById("lista").innerHTML =
  '<div class="empty">👈 Defina seus filtros (tipo, segurança, localização e orçamento) e clique em <strong>Buscar imóveis</strong> para ver os resultados.</div>';
