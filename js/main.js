// URL base da sua API rodando em Node.js / Express com Prisma
const API_URL = "http://localhost:3000/users"; 

let linhaSendoEditada = null; 

// =========================================================================
// 1. CARREGAMENTO DINÂMICO DOS GRUPOS NA HOME E NO PAINEL (VIA PRISMA)
// =========================================================================
async function carregarProjetosDoBanco() {
    try {
        const resposta = await fetch(`${API_URL}/projetos`);
        const resultado = await resposta.json();

        if (resultado.sucesso) {
            const tabelaAtivos = document.getElementById('tabelaGrupos');
            
            // Se o usuário estiver na tela do Painel Admin, renderiza a tabela com dados do MySQL
            if (tabelaAtivos) {
                tabelaAtivos.innerHTML = ""; // Limpa dados antigos fictícios
                resultado.dados.forEach(projeto => {
                    let classeBadge = "badge-futebol";
                    if (projeto.modalidade.nome === "basquete") classeBadge = "badge-basquete";
                    if (projeto.modalidade.nome === "artes marciais") classeBadge = "badge-artes-marciais";
                    if (projeto.modalidade.nome === "vôlei") classeBadge = "badge-volei";

                    const novaLinha = tabelaAtivos.insertRow();
                    novaLinha.setAttribute("data-id-proj", projeto.id_proj);
                    novaLinha.innerHTML = `
                        <td><strong>${projeto.local}</strong></td>
                        <td><span class="badge ${classeBadge}">${projeto.modalidade.nome}</span></td>
                        <td>${projeto.hora_fun}</td>
                        <td>
                            <button onclick="abrirModalEdicao(this)" class="btn-action-text btn-edit-text">Editar</button>
                            <button onclick="excluirGrupo(this)" class="btn-action-text btn-delete-text">Excluir</button>
                        </td>
                    `;
                });
                atualizarContadoresGerais();
            }
        }
    } catch (error) {
        console.error("Erro ao carregar os dados reais do Prisma:", error);
    }
}

// Configurações iniciais ao carregar qualquer página do site
document.addEventListener("DOMContentLoaded", () => {
    // Carrega os dados reais do banco
    carregarProjetosDoBanco();
    
    // 🔥 Efeito de Transição de Tela Suave (Fade-In)
    document.body.classList.add("fade-in");
    
    // Ativa o filtro padrão da Home mostrando todos na rolagem horizontal
    const pilulaTodos = document.querySelector('.feature-card.active-filter');
    if (pilulaTodos) filtrarEsporte('todos', pilulaTodos);
    
    // Intercepta o formulário de propostas para salvar no banco se ele existir na página
    const formularioProjeto = document.querySelector('.project-form');
    if (formularioProjeto) {
        formularioProjeto.removeAttribute("onsubmit");
        formularioProjeto.addEventListener("submit", enviarPropostaProjeto);
    }
});

// =========================================================================
// 2. FILTROS INTELIGENTES DA HOME COM SUPORTE A ROLAGEM TOTAL
// =========================================================================
function filtrarEsporte(categoria, elemento) {
    document.querySelectorAll('.feature-card').forEach(card => card.classList.remove('active-filter'));
    if (elemento) elemento.classList.add('active-filter');

    document.querySelectorAll('comuna-group-card').forEach(card => {
        const caixaInterna = card.querySelector('.group-card');
        if (!caixaInterna) return;

        const esporteCard = caixaInterna.getAttribute('data-sport');

        if (categoria === 'todos') {
            // MOSTRA TODOS os 10 grupos na rolagem horizontal logo de início!
            card.style.display = 'block';
        } else {
            // Filtra por abas específicas
            if (esporteCard === categoria) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// =========================================================================
// 3. AUTENTICAÇÃO REAL DE LOGIN (CONECTADO COM O PRISMA)
// =========================================================================
async function testarLogin(event) {
    event.preventDefault(); 

    const email = document.getElementById('usuario').value; // Lê o e-mail real do banco
    const pass = document.getElementById('senha').value;

    try {
        const resposta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, senha: pass })
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {
            // Redireciona com base no tipo de acesso real cadastrado na tabela do MySQL
            if (resultado.dados.tipo_acesso === "admin") {
                document.getElementById('loginBox').style.display = 'none';
                document.getElementById('adminBox').style.display = 'block';
                carregarProjetosDoBanco();
            } else {
                alert(`Bem-vindo(a) de volta, ${resultado.dados.nome}! Redirecionando para o painel comum...`);
                window.location.href = 'index.html'; 
            }
        } else {
            alert(resultado.mensagem || "Erro na autenticação. Verifique os dados.");
        }
    } catch (error) {
        alert("Erro crítico: Servidor da API fora do ar.");
    }
}

function logout() {
    document.getElementById('usuario').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('adminBox').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
}

// =========================================================================
// 4. ENVIO REAL DE PROPOSTAS (SALVANDO NO BANCO DE DADOS)
// =========================================================================
async function enviarPropostaProjeto(event) {
    event.preventDefault();

    const contato = document.querySelector('input[placeholder*="WhatsApp ou E-mail"]').value;
    const modalidadeTexto = document.querySelector('select').value;
    const localAtividades = document.querySelector('input[placeholder*="Galpão Cultural"]').value;

    let idModalidade = 1;
    if (modalidadeTexto === "basquete") idModalidade = 2;
    if (modalidadeTexto === "artes-marciais") idModalidade = 3;
    if (modalidadeTexto === "volei") idModalidade = 4;

    const dadosProposta = {
        cnpj: "00000000000000",
        idade_minima: 10,
        idade_maxima: 17,
        local: localAtividades,
        hora_fun: "18:00",
        telefone: contato,
        email: contato.includes("@") ? contato : "contato@comunidade.com",
        id_user: 1, // Associa ao usuário de ID 1 cadastrado nas suas migrações
        id_mod: idModalidade
    };

    try {
        const resposta = await fetch(`${API_URL}/projetos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosProposta)
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {
            alert("Sua proposta foi registrada direto no banco de dados MySQL via Prisma!");
            window.location.href = 'index.html';
        } else {
            alert(resultado.mensagem);
        }
    } catch (error) {
        console.error("Erro na conexão do formulário:", error);
    }
}

// =========================================================================
// 5. REMOÇÃO LÓGICA (SOFT-DELETE VIA PRISMA)
// =========================================================================
async function excluirGrupo(botao) {
    if (confirm("Tem certeza que deseja desativar este projeto do banco de dados?")) {
        const linha = botao.closest('tr');
        const idProj = linha.getAttribute("data-id-proj");

        try {
            await fetch(`${API_URL}/projetos/${idProj}`, { method: "DELETE" });
            linha.remove();
            atualizarContadoresGerais();
            alert("Registro desativado com sucesso via Prisma!");
        } catch (error) {
            linha.remove();
            atualizarContadoresGerais();
        }
    }
}

// =========================================================================
// 6. ESTRUTURA E AUXILIARES DO PAINEL ADMIN
// =========================================================================
function alternarAba(abaAlvo) {
    const cardAtivos = document.getElementById('cardAtivos');
    const cardSolicitacoes = document.getElementById('cardSolicitacoes');

    if (abaAlvo === 'ativos') {
        document.getElementById('secaoAtivos').style.display = 'block';
        document.getElementById('secaoSolicitacoes').style.display = 'none';
        cardAtivos.classList.add('aba-ativa');
        cardSolicitacoes.classList.remove('aba-ativa');
    } else {
        document.getElementById('secaoAtivos').style.display = 'none';
        document.getElementById('secaoSolicitacoes').style.display = 'block';
        cardAtivos.classList.remove('aba-ativa');
        cardSolicitacoes.add('aba-ativa');
    }
}

function atualizarContadoresGerais() {
    const totalAtivos = document.querySelectorAll('#tabelaGrupos tr').length;
    if (document.getElementById('txtTotalAtivos')) {
        document.getElementById('txtTotalAtivos').textContent = `${totalAtivos} Ativos`;
    }

    const totalPendente = document.querySelectorAll('#tabelaSolicitacoes tr').length;
    if (document.getElementById('txtTotalSolicitacoes')) {
        document.getElementById('txtTotalSolicitacoes').textContent = totalPendente;
    }
}

function abrirModalEdicao(botao) {
    linhaSendoEditada = botao.closest('tr');
    document.getElementById('editNome').value = linhaSendoEditada.cells[0].innerText;
    document.getElementById('editLocalizacao').value = linhaSendoEditada.cells[2].innerText;
    document.getElementById('modalEdicao').classList.add('active');
}

function fecharModal() {
    document.getElementById('modalEdicao').classList.remove('active');
    linhaSendoEditada = null;
}

// =========================================================================
// 7. CONTROLE GLOBAL DO MODAL DE CONTRIBUIÇÃO (POP-UP DO PIX)
// =========================================================================
window.abrirModalContribua = function() {
    const modal = document.getElementById('modalContribua');
    if (modal) modal.classList.add('active');
}

window.fecharModalContribua = function() {
    const modal = document.getElementById('modalContribua');
    if (modal) modal.classList.remove('active');
}
