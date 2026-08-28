// ==========================================
// 1. COMPONENTE: MENU SUPERIOR (NAVBAR)
// ==========================================
class ComunaNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="navbar">
            <a href="index.html">
                <img src="imagens/logo.png" alt="Logo Comuna Esportes" class="logo-img">
            </a>
            <nav class="nav-links">
                <a href="index.html" id="nav-inicio">Início</a>
                <a href="quem-somos.html" id="nav-quem-somos">Quem Somos</a>
                <a href="noticias.html" id="nav-noticias">Notícias</a>
                <a href="contato.html" id="nav-contato">Contato</a>
                <a href="login.html" class="btn-entrar">Entrar</a>
                <button class="btn-contribua" onclick="abrirModalContribua()">Contribua</button>
            </nav>
        </header>
        `;
        
        const paginaAtual = window.location.pathname.split("/").pop();
        if (paginaAtual === "index.html" || paginaAtual === "") {
            document.getElementById("nav-inicio")?.classList.add("active");
        } else if (paginaAtual === "quem-somos.html") {
            document.getElementById("nav-quem-somos")?.classList.add("active");
        } else if (paginaAtual === "noticias.html") {
            document.getElementById("nav-noticias")?.classList.add("active");
        } else if (paginaAtual === "contato.html") {
            document.getElementById("nav-contato")?.classList.add("active");
        }
    }
}
customElements.define('comuna-navbar', ComunaNavbar);

// ==========================================
// 2. COMPONENTE: RODAPÉ GLOBAL (FOOTER)
// ==========================================
class ComunaFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <div class="footer-nav">
                <a href="quem-somos.html">Quem Somos</a>
                <a href="contato.html">Contato</a>
            </div>
            <div class="map-box">
                <iframe src="https://google.com" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </footer>
        `;
    }
}
customElements.define('comuna-footer', ComunaFooter);

// ==========================================
// 3. COMPONENTE: PÍLULAS DE FILTRO DA HOME
// ==========================================
class ComunaFilters extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="features-grid">
            <div class="feature-card active-filter" onclick="filtrarEsporte('todos', this)">
                <i class="fas fa-th-large feature-icon"></i>
                <span class="feature-text">Todos os Grupos</span>
            </div>
            <div class="feature-card" onclick="filtrarEsporte('futebol', this)">
                <i class="fas fa-futbol feature-icon"></i>
                <span class="feature-text">Futebol</span>
            </div>
            <div class="feature-card" onclick="filtrarEsporte('basquete', this)">
                <i class="fas fa-basketball-ball feature-icon"></i>
                <span class="feature-text">Basquete</span>
            </div>
            <div class="feature-card" onclick="filtrarEsporte('artes-marciais', this)">
                <i class="fas fa-user-ninja feature-icon"></i>
                <span class="feature-text">Artes Marciais</span>
            </div>
            <div class="feature-card" onclick="filtrarEsporte('volei', this)">
                <i class="fas fa-volleyball feature-icon"></i>
                <span class="feature-text">Vôlei</span>
            </div>
        </div>
        `;
    }
}
customElements.define('comuna-filters', ComunaFilters);

// ==========================================
// 4. COMPONENTE: CARD DE GRUPO DINÂMICO (TRAVADO E ALINHADO)
// ==========================================
// ==========================================
// 4. COMPONENTE: CARD DE GRUPO DINÂMICO (COM SUPORTE A DESTAQUE)
// ==========================================
class ComunaGroupCard extends HTMLElement {
    connectedCallback() {
        const emoji = this.getAttribute('emoji') || '⚽';
        const name = this.getAttribute('name') || 'Nome do Grupo';
        const sport = this.getAttribute('sport') || 'todos';
        const meta = this.getAttribute('meta') || '';
        const url = this.getAttribute('url') || '#';
        // Captura o atributo destaque (sim/nao) informado na tag HTML
        const destaque = this.getAttribute('destaque') || 'nao';

        this.innerHTML = `
        <div class="group-card" data-sport="${sport}" data-destaque="${destaque}" onclick="window.location.href='${url}'" style="display: flex; align-items: center; height: 110px; box-sizing: border-box; width: 100%; padding: 16px;">
            <div class="group-emoji" style="flex-shrink: 0; margin-right: 12px; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">${emoji}</div>
            <div class="group-info" style="display: flex; flex-direction: column; justify-content: center; gap: 2px; min-width: 0; flex: 1;">
                <span class="group-name" style="display: block; line-height: 1.2; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 800;">${name}</span>
                <span class="group-meta" style="display: block; line-height: 1.3; font-size: 0.8rem; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${meta}</span>
            </div>
        </div>
        `;
    }
}
customElements.define('comuna-group-card', ComunaGroupCard);


// ==========================================
// 5. COMPONENTE: CARD DE AGENDA DE JOGOS
// Atributos aceitos: date, team1, team2, location
// ==========================================
class ComunaMatchCard extends HTMLElement {
  // ... código anterior que você colou ...
    connectedCallback() {
        const date = this.getAttribute('date') || '';
        const team1 = this.getAttribute('team1') || '';
        const team2 = this.getAttribute('team2') || '';
        const location = this.getAttribute('location') || '';

        this.innerHTML = `
        <div class="group-card" style="flex-direction: column; text-align: center; gap: 12px; width: 100%;">
            <div class="match-date">${date}</div>
            <div style="font-weight: 800; font-size: 1rem; text-transform: uppercase;">
                <span>${team1}</span> <span style="color: var(--text-dim); font-weight: 400;">VS</span> <span>${team2}</span>
            </div>
            <div class="group-meta"><i class="fas fa-map-marker-alt"></i> ${location}</div>
        </div>
        `;
    }
}
customElements.define('comuna-match-card', ComunaMatchCard);

// 🔥 AS FUNÇÕES DE CONTROLE ENTRAM EXATAMENTE AQUI EMBAIXO:

window.abrirModalContribua = function() {
    const modal = document.getElementById('modalContribua');
    if (modal) {
        modal.classList.add('active');
    } else {
        console.error("Erro: O bloco HTML do modalContribua não foi encontrado no final desta página!");
    }
}

window.fecharModalContribua = function() {
    const modal = document.getElementById('modalContribua');
    if (modal) {
        modal.classList.remove('active');
    }
}
