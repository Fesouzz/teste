// --- SISTEMA DE FILTROS DA HOME (CORRIGIDO PARA GRID SIMÉTRICO) ---
function filtrarEsporte(categoria, elemento) {
    // Gerencia a classe ativa visual das pílulas roxas
    document.querySelectorAll('.feature-card').forEach(card => card.classList.remove('active-filter'));
    if (elemento) elemento.classList.add('active-filter');

    // Localiza todos os componentes de card de grupo
    document.querySelectorAll('comuna-group-card').forEach(card => {
        // Encontra a caixinha interna gerada pelo componente
        const caixaInterna = card.querySelector('.group-card');
        if (!caixaInterna) return;

        const esporteCard = caixaInterna.getAttribute('data-sport');
        const statusDestaque = caixaInterna.getAttribute('data-destaque');

        if (categoria === 'todos') {
            // Na aba "Todos", exibe APENAS os 4 originais marcados como destaque
            if (statusDestaque === 'sim') {
                card.style.display = 'block'; // 'block' faz o componente respeitar o grid do CSS!
            } else {
                card.style.display = 'none';
            }
        } else {
            // Nas abas específicas, exibe TODOS os times daquela categoria
            if (esporteCard === categoria) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Garante que o filtro rode perfeitamente assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    const pílulaTodos = document.querySelector('.feature-card.active-filter');
    if (pílulaTodos) filtrarEsporte('todos', pílulaTodos);
});



// --- SISTEMA DE ADMINISTRAÇÃO E LOGIN (ESTRUTURA ORIGINAL DO SISTEMA UM) ---
let linhaSendoEditada = null; 

function testarLogin(event) {
    event.preventDefault(); 
    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('senha').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('adminBox').style.display = 'block';
        atualizarContadoresGerais(); 
    } else {
        alert('Login de usuário comum efetuado com sucesso! Redirecionando...');
        window.location.href = 'index.html'; 
    }
}

function logout() {
    document.getElementById('usuario').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('adminBox').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
}

function excluirGrupo(botao) {
    if (confirm("Tem certeza que deseja excluir este grupo?")) {
        botao.closest('tr').remove();
        atualizarContadoresGerais();
    }
}

function alternarAba(abaAlvo) {
    const cardAtivos = document.getElementById('cardAtivos');
    const cardSolicitacoes = document.getElementById('cardSolicitacoes');

    if (abaAlvo === 'ativos') {
        document.getElementById('secaoAtivos').style.display = 'block';
        document.getElementById('secaoSolicitacoes').style.display = 'none';
        cardAtivos.classList.add('aba-ativa');
        cardSolicitacoes.classList.remove('aba-ativa');
    } else if (abaAlvo === 'solicitacoes') {
        document.getElementById('secaoAtivos').style.display = 'none';
        document.getElementById('secaoSolicitacoes').style.display = 'block';
        cardAtivos.classList.remove('aba-ativa');
        cardSolicitacoes.classList.add('aba-ativa');
    }
}

function atualizarContadoresGerais() {
    const totalAtivos = document.querySelectorAll('#tabelaGrupos tr').length;
    document.getElementById('txtTotalAtivos').textContent = `${totalAtivos} Ativos`;

    const totalPendente = document.querySelectorAll('#tabelaSolicitacoes tr').length;
    document.getElementById('txtTotalSolicitacoes').textContent = totalPendente;
}

function abrirModalEdicao(botao) {
    linhaSendoEditada = botao.closest('tr');

    const nomeAtual = linhaSendoEditada.cells[0].innerText;
    const localizacaoAtual = linhaSendoEditada.cells[2].innerText;

    document.getElementById('editNome').value = nomeAtual;
    document.getElementById('editLocalizacao').value = localizacaoAtual;

    document.getElementById('modalEdicao').classList.add('active');
}

function fecharModal() {
    document.getElementById('modalEdicao').classList.remove('active');
    const modalProposta = document.getElementById('modalProposta');
    if (modalProposta) modalProposta.classList.remove('active');
    linhaSendoEditada = null;
}

function salvarEdicao(event) {
    event.preventDefault(); 
    if (linhaSendoEditada) {
        const novoNome = document.getElementById('editNome').value;
        const novaModalidade = document.getElementById('editModalidade').value;
        const novaLocalizacao = document.getElementById('editLocalizacao').value;

        let classeBadge = 'badge-futebol';
        if (novaModalidade === 'Basquete') classeBadge = 'badge-basquete';
        if (novaModalidade === 'Artes Marciais') classeBadge = 'badge-artes-marciais';
        if (novaModalidade === 'Vôlei') classeBadge = 'badge-volei';

        linhaSendoEditada.cells[0].innerHTML = `<strong>${novoNome}</strong>`;
        linhaSendoEditada.cells[1].innerHTML = `<span class="badge ${classeBadge}">${novaModalidade}</span>`;
        linhaSendoEditada.cells[2].innerText = novaLocalizacao;

        fecharModal();
    }
}

function abrirModalProposta(botao) {
    linhaSendoEditada = botao.closest('tr');

    const nomeSugerido = linhaSendoEditada.cells[0].innerText;
    const modalidadeSugerida = linhaSendoEditada.cells[1].innerText;
    const localSugerido = linhaSendoEditada.cells[2].innerText;

    document.getElementById('propNome').value = nomeSugerido;
    document.getElementById('propModalidade').value = modalidadeSugerida;
    document.getElementById('propLocalizacao').value = localSugerido;

    document.getElementById('modalProposta').classList.add('active');
}

function processarDecisaoModal(decisao) {
    if (!linhaSendoEditada) return;

    const nomeGrupo = document.getElementById('propNome').value;
    const modalidade = document.getElementById('propModalidade').value;
    const local = document.getElementById('propLocalizacao').value;

    if (decisao === 'aprovar') {
        let classeBadge = 'badge-futebol';
        if (modalidade.includes('Basquete')) classeBadge = 'badge-basquete';
        if (modalidade.includes('Artes Marciais')) classeBadge = 'badge-artes-marciais';
        if (modalidade.includes('Vôlei')) classeBadge = 'badge-volei';

        const tabelaAtivos = document.getElementById('tabelaGrupos');
        const novaLinha = tabelaAtivos.insertRow();
        novaLinha.innerHTML = `
            <td><strong>${nomeGrupo}</strong></td>
            <td><span class="badge ${classeBadge}">${modalidade}</span></td>
            <td>${local}</td>
            <td>
                <button onclick="abrirModalEdicao(this)" class="btn-action-text btn-edit-text">Editar</button>
                <button onclick="excluirGrupo(this)" class="btn-action-text btn-delete-text">Excluir</button>
            </td>
        `;
        alert(`Grupo "${nomeGrupo}" foi aprovado com sucesso!`);
    } else {
        alert(`A solicitação do grupo "${nomeGrupo}" foi recusada.`);
    }

    // Fechamento correto da lógica de aprovação do painel
    linhaSendoEditada.remove();
    fecharModal();
    atualizarContadoresGerais();
} 

  // --- ATIVAÇÃO DA TRANSIÇÃO DE TELA SUAVE ---
document.addEventListener("DOMContentLoaded", () => {
    // Adiciona a classe que torna o body visível suavemente
    document.body.classList.add("fade-in");
});

