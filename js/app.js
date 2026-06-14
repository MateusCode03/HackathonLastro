/* ============================================================
   SeguraSP — lógica do app
   Mapa (Leaflet/OSM) + 3 filtros combinados + captura de lead.
   ============================================================ */

/* ---------- Configuração ---------- */
const SP_CENTRO = [-23.5805, -46.6500];

// Limiares de ranqueamento por FURTOS / 100 MIL HABITANTES.
// Edite aqui para recalibrar os 3 níveis.
const SEGURANCA_LIMIARES = {
  baixo: 1500,   // < 1500  -> baixo risco (mais seguro)
  medio: 3000    // 1500-3000 -> médio ; > 3000 -> alto
};

const CORES = { baixo: "#1ca35a", medio: "#e8a200", alto: "#d63b3b" };
const ROTULO_NIVEL = { baixo: "Baixo risco", medio: "Médio risco", alto: "Alto risco" };

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

// Classifica um distrito em baixo / medio / alto a partir da taxa.
function nivelDoDistrito(d) {
  const taxa = furtosPor100k(d);
  if (taxa < SEGURANCA_LIMIARES.baixo) return "baixo";
  if (taxa <= SEGURANCA_LIMIARES.medio) return "medio";
  return "alto";
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
  return v.toLocaleString("pt-BR");
}

/* ---------- Pré-processamento dos imóveis ---------- */
// Anexa a cada imóvel o distrito e o nível de segurança correspondente.
const IMOVEIS = window.IMOVEIS.map((im) => {
  const d = distritoMaisProximo(im.lat, im.lng);
  return {
    ...im,
    distrito: d.nome,
    nivel: nivelDoDistrito(d),
    furtos_100k: Math.round(furtosPor100k(d))
  };
});

/* ---------- Estado dos filtros ---------- */
const estado = {
  niveis: { baixo: true, medio: true, alto: true },
  raioKm: 5,
  orcamentoMax: 15000,
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
    const nivel = nivelDoDistrito(d);
    L.circle([d.lat, d.lng], {
      radius: 900,
      color: CORES[nivel],
      fillColor: CORES[nivel],
      fillOpacity: 0.25,
      weight: 1
    })
      .bindTooltip(
        `<strong>${d.nome}</strong><br>${Math.round(furtosPor100k(d))} furtos/100 mil hab.<br>${ROTULO_NIVEL[nivel]}`
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

// Camada dos marcadores de imóveis filtrados.
const camadaImoveis = L.layerGroup().addTo(map);

pin.on("drag", (e) => {
  const p = e.target.getLatLng();
  estado.pin = { lat: p.lat, lng: p.lng };
  circuloRaio.setLatLng(p);
});
pin.on("dragend", aplicarFiltros);

/* ---------- Aplicação dos filtros ---------- */
function imovelPassa(im) {
  // Filtro 1: segurança
  if (!estado.niveis[im.nivel]) return false;
  // Filtro 3: orçamento
  if (im.preco > estado.orcamentoMax) return false;
  // Filtro 2: localização (raio a partir do pin)
  const dist = distanciaKm(estado.pin.lat, estado.pin.lng, im.lat, im.lng);
  if (dist > estado.raioKm) return false;
  im._distPin = dist;
  return true;
}

function aplicarFiltros() {
  const filtrados = IMOVEIS.filter(imovelPassa).sort(
    (a, b) => a._distPin - b._distPin
  );
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
      html: `<div class="pin-imovel ${im.nivel}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 16]
    });
    L.marker([im.lat, im.lng], { icon: icone })
      .bindPopup(
        `<strong>${im.titulo}</strong><br>` +
          `${im.distrito} • ${ROTULO_NIVEL[im.nivel]}<br>` +
          `${im.furtos_100k} furtos/100 mil hab.<br>` +
          `<strong>R$ ${formatBRL(im.preco)}</strong> / mês`
      )
      .addTo(camadaImoveis);
  }
}

/* ---------- Render da lista lateral ---------- */
function renderLista(lista) {
  const el = document.getElementById("lista");
  if (lista.length === 0) {
    el.innerHTML =
      '<div class="empty">Nenhum imóvel atende a todos os filtros.<br>Tente aumentar o raio, o orçamento ou incluir mais níveis de segurança.</div>';
    return;
  }
  el.innerHTML = lista
    .map(
      (im) => `
    <article class="imovel-card ${im.nivel}">
      <span class="badge ${im.nivel}">${ROTULO_NIVEL[im.nivel]} • ${im.furtos_100k}/100 mil</span>
      <h3>${im.titulo}</h3>
      <div class="imovel-meta">
        ${im.distrito} • ${im.quartos} quarto(s) • ${im.area} m² • ${im._distPin.toFixed(1)} km do pin
      </div>
      <div class="card-footer">
        <span class="imovel-preco">R$ ${formatBRL(im.preco)} <small>/ mês</small></span>
        <button class="btn-primary" data-id="${im.id}">Tenho interesse</button>
      </div>
    </article>`
    )
    .join("");

  // Liga os botões "Tenho interesse".
  el.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () =>
      abrirModal(IMOVEIS.find((x) => x.id === Number(btn.dataset.id)))
    );
  });
}

/* ---------- Controles dos filtros ---------- */
function ligarFiltro(id, nivel) {
  document.getElementById(id).addEventListener("change", (e) => {
    estado.niveis[nivel] = e.target.checked;
    aplicarFiltros();
  });
}
ligarFiltro("lvl-baixo", "baixo");
ligarFiltro("lvl-medio", "medio");
ligarFiltro("lvl-alto", "alto");

const raio = document.getElementById("raio");
raio.addEventListener("input", (e) => {
  estado.raioKm = Number(e.target.value);
  document.getElementById("raio-valor").textContent = estado.raioKm;
  circuloRaio.setRadius(estado.raioKm * 1000);
  aplicarFiltros();
});

const orcamento = document.getElementById("orcamento");
orcamento.addEventListener("input", (e) => {
  estado.orcamentoMax = Number(e.target.value);
  document.getElementById("orcamento-valor").textContent = formatBRL(estado.orcamentoMax);
  aplicarFiltros();
});

document.getElementById("reset-pin").addEventListener("click", () => {
  pin.setLatLng(SP_CENTRO);
  circuloRaio.setLatLng(SP_CENTRO);
  estado.pin = { lat: SP_CENTRO[0], lng: SP_CENTRO[1] };
  map.setView(SP_CENTRO, 11);
  aplicarFiltros();
});

/* ---------- Modal de captura de lead ---------- */
let imovelSelecionado = null;

function resumoPerfil() {
  const niveisAtivos = Object.keys(estado.niveis)
    .filter((n) => estado.niveis[n])
    .map((n) => ROTULO_NIVEL[n])
    .join(", ");
  return [
    `Prioriza segurança: ${niveisAtivos || "nenhum nível selecionado"}`,
    `Raio de busca: até ${estado.raioKm} km do ponto de interesse`,
    `Orçamento máximo: R$ ${formatBRL(estado.orcamentoMax)} / mês`,
    `Ponto de interesse: ${estado.pin.lat.toFixed(4)}, ${estado.pin.lng.toFixed(4)}`
  ];
}

function abrirModal(im) {
  imovelSelecionado = im;
  document.getElementById("modal-imovel").textContent =
    `${im.titulo} — ${im.distrito} (R$ ${formatBRL(im.preco)}/mês)`;
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
      niveis: { ...estado.niveis },
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

/* ---------- Inicialização ---------- */
aplicarFiltros();
