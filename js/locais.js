const dadosEsportes = [
  { titulo: "União do Terrão F.C.", faixaEtaria: "Todas as idades", local: "Campo Central", telefone: "11 99999-9999", horario: "14:00 - 18:00", categoria: "futebol", tema: "laranja" },
  { titulo: "Crias do Asfalto 3x3", faixaEtaria: "Crianças e Jovens", local: "Quadra Azul", telefone: "11 99999-9999", horario: "16:00 - 20:00", categoria: "basquete", tema: "laranja" },
  { titulo: "Ritmo e Poesia Crew", faixaEtaria: "Todas as idades", local: "Galpão Cultural", telefone: "11 99999-9999", horario: "18:00 - 22:00", categoria: "dança", tema: "roxo" }
];

let filtroCategoria = "todos";
let termoBusca = "";

function renderizarCards() {
  const container = document.getElementById("listaCards");
  if (!container) return;

  const dadosFiltrados = dadosEsportes.filter(item => {
    const cat = item.categoria.toLowerCase().trim();
    const bateuCat = filtroCategoria === "todos" || cat === filtroCategoria;
    const busca = termoBusca.toLowerCase().trim();
    const bateuBusca = !busca || item.titulo.toLowerCase().includes(busca) || item.local.toLowerCase().includes(busca);
    return bateuCat && bateuBusca;
  });

  if (!dadosFiltrados.length) {
    container.innerHTML = `<p class="sem-resultados">Nenhum local encontrado para esta busca.</p>`;
    return;
  }

  container.innerHTML = dadosFiltrados.map(item => `
    <div class="card" data-theme="${item.tema}">
      <div class="card-header"><h2 class="card-title">${item.titulo}</h2></div>
      <div class="tags-container">
        <div class="tag-item"><span>${item.faixaEtaria}</span></div>
        <div class="tag-item"><span>${item.local}</span></div>
        <div class="tag-item"><span>${item.telefone}</span></div>
        <div class="tag-item"><span>${item.horario}</span></div>
      </div>
    </div>
  `).join("");
}

function inicializarLocais() {
  renderizarCards();
  document.querySelectorAll(".filtro").forEach(b => {
    b.addEventListener("click", () => {
      if (b.getAttribute("aria-label") === "Mapa") return;
      document.querySelector(".filtro.ativo")?.classList.remove("ativo");
      b.classList.add("ativo");
      filtroCategoria = b.textContent.trim().toLowerCase();
      renderizarCards();
    });
  });

  const grandeBusca = document.querySelector(".barra-pesquisa input");
  if (grandeBusca) {
    grandeBusca.addEventListener("input", (e) => {
      termoBusca = e.target.value;
      renderizarCards();
    });
  }
}

document.addEventListener("DOMContentLoaded", inicializarLocais);
