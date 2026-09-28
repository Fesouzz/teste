// URL base da sua API rodando em Node.js / Express com Pool MySQL
const API_URL = "http://localhost:3000/users"; 

let linhaSendoEditada = null; 

// =========================================================================
// 1. CARREGAMENTO DINÂMICO DOS GRUPOS NA HOME E NO PAINEL (VIA POOL MYSQL)
// =========================================================================
async function carregarProjetosDoBanco() {
    try {
        const resposta = await fetch(`${API_URL}/projetos`);
        const resultado = await resposta.json();

        if (resultado.sucesso) {
            const tabelaAtivos = document.getElementById('tabelaGrupos');
            const tabelaSolicitacoes = document.getElementById('tabelaSolicitacoes'); 
            
            if (tabelaAtivos) tabelaAtivos.innerHTML = ""; 
            if (tabelaSolicitacoes) tabelaSolicitacoes.innerHTML = ""; 

            // Guarda os dados da API de forma global na memória para evitar o 'undefined'
            window.listaProjetosGlobais = resultado.dados;

            resultado.dados.forEach(projeto => {
                let classeBadge = "badge-futebol";
                if (!projeto.modalidade || !projeto.modalidade.nome) return;
                
                const nomeMod = projeto.modalidade.nome.toLowerCase();
                if (nomeMod === "basquete") classeBadge = "badge-basquete";
                if (nomeMod === "artes marciais" || nomeMod === "artes-marciais") classeBadge = "badge-artes-marciais";
                if (nomeMod === "vôlei" || nomeMod === "volei") classeBadge = "badge-volei";

                // SEPARAÇÃO POR STATUS DO BANCO DE DADOS
                if (projeto.status === "pendente") {
                    if (tabelaSolicitacoes) {
                        const novaLinha = tabelaSolicitacoes.insertRow();
                        novaLinha.setAttribute("data-id-proj", projeto.id_proj);
                        
                        novaLinha.innerHTML = `
                            <td><strong>${projeto.local}</strong></td>
                            <td><span class="badge ${classeBadge}">${projeto.modalidade.nome}</span></td>
                            <td>${projeto.hora_fun}</td>
                            <td>
                                <button onclick="abrirModalProposta(${projeto.id_proj})" class="btn-action-text btn-edit-text" style="color: var(--accent-purple); border: none; background: transparent; cursor: pointer; font-weight: bold;">Analisar</button>
                            </td>
                        `;
                    }
                } else {
                    if (tabelaAtivos) {
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
                    }
                }
            });
            atualizarContadoresGerais();
        }
    } catch (error) {
        console.error("Erro ao carregar os dados reais do MySQL:", error);
    }
}

// Configurações iniciais ao carregar qualquer página do site
document.addEventListener("DOMContentLoaded", () => {
    const tabelaAtivos = document.getElementById('tabelaGrupos');
    const secaoCardsHome = document.querySelector('comuna-group-card') || document.querySelector('.features-grid');
    
    // 🔥 BLINDAGEM SUPREMA: Se estiver na página de inscrição, esconde o modal de análise para ele não invadir a tela!
    const modalPropostaInvasor = document.getElementById('modalProposta');
    if (modalPropostaInvasor && window.location.pathname.includes("inscrever-projeto.html")) {
        modalPropostaInvasor.classList.remove('active');
        modalPropostaInvasor.style.display = 'none';
    }

    // Só roda a busca do banco se encontrar as tabelas do painel ou a grade da Home
    if (tabelaAtivos || secaoCardsHome) {
        carregarProjetosDoBanco();
    }
    
    document.body.classList.add("fade-in");
    
    const pilulaTodos = document.querySelector('.feature-card.active-filter');
    if (pilulaTodos) filtrarEsporte('todos', pilulaTodos);
    
    // MONITOR GLOBAL DO FORMULÁRIO: Intercepta o envio em qualquer tela
    document.body.addEventListener("submit", (event) => {
        if (event.target && (event.target.classList.contains("project-form") || event.target.closest(".project-form"))) {
            event.preventDefault();
            enviarPropostaProjeto(event);
        }
    });
});

// =========================================================================
// 2. FILTROS INTELIGENTES DA HOME COM SUPORTE A ROLAGEM TOTAL
// =========================================================================
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
            card.style.display = 'block';
        } else {
            // 🔥 CORRIGIDO: Alterado 'category' para 'categoria' em português para alinhar com a função!
            if (esporteCard === categoria) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}



// =========================================================================
// 3. AUTENTICAÇÃO REAL DE LOGIN (CONECTADO COM O POOL MYSQL)
// =========================================================================
async function testarLogin(event) {
    event.preventDefault(); 

    // Captura o e-mail e senha digitados nos campos estilo Pinterest
    const email = document.getElementById('usuario').value; 
    const pass = document.getElementById('senha').value;

    try {
        const resposta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, senha: pass })
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {
            // 🔥 Salva a sessão na gaveta de forma limpa e imediata
            localStorage.setItem("usuarioComuna", JSON.stringify(resultado.dados));

            if (resultado.dados.tipo_acesso === "admin") {
                alert(`Painel Administrativo liberado! Bem-vindo(a), ${resultado.dados.nome}.`);
                window.location.href = 'admin.html'; 
            } else {
                alert(`Bem-vindo(a) de volta, ${resultado.dados.nome}! Redirecionando para seu Perfil...`);
                
                // 🔥 Força o redirecionamento limpando o cache da navegação atual
                window.location.assign('perfil.html');
            }
        } else {
            alert(resultado.mensagem || "Erro na autenticação. Verifique os dados.");
        }
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro crítico: Servidor da API fora do ar ou erro na requisição.");
    }
}


function logout() {
    document.getElementById('usuario').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('adminBox').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
}
// =========================================================================
// 4. ENVIO REAL DE PROPOSTAS (VERSÃO CORRIGIDA E REVISADA)
// =========================================================================
async function enviarPropostaProjeto(event) {
    event.preventDefault();

    // Captura os valores direto pelos IDs estruturados ou fallbacks antigos
    const responsavel = document.getElementById('formResponsavel')?.value || document.getElementById('respNome')?.value || "";
    const cnpj = document.getElementById('formCnpj')?.value || "00000000000000";
    const local = document.getElementById('formLocal')?.value || document.getElementById('respColetivo')?.value || "";
    const idMinRaw = document.getElementById('formIdadeMin')?.value || document.getElementById('formIdadeMin')?.value || "10";
    const idMaxRaw = document.getElementById('formIdadeMax')?.value || document.getElementById('formIdadeMax')?.value || "17";
    const hora = document.getElementById('formHora')?.value || "18:00";
    const telefone = document.getElementById('formTelefone')?.value || document.getElementById('respContato')?.value || "";
    const email = document.getElementById('formEmail')?.value || "contato@comuna.com";
    const modalidadeTexto = document.getElementById('formModalidade')?.value || document.getElementById('respModalidade')?.value || "";

    // Captura a descrição tentando IDs novos, antigos ou a tag pura do HTML
    const caixaDescricao = document.getElementById('formDescricao') || document.getElementById('respResumo') || document.querySelector('textarea');
    const descricaoOriginal = caixaDescricao ? caixaDescricao.value : "";

    // Valida se os dados cruciais para o envio estão realmente preenchidos
    if (!responsavel || !local || !modalidadeTexto || !descricaoOriginal) {
        alert("Por favor, preencha todos os campos obrigatórios do formulário.");
        return;
    }

    const idadeMin = Number(idMinRaw);
    const idadeMax = Number(idMaxRaw);

    // Validação de segurança de faixa etária batendo com o CHECK do MySQL
    if (idadeMin > idadeMax) {
        alert("Erro: A idade mínima não pode ser maior que a idade máxima!");
        return;
    }

    let idModalidade = 1;
    if (modalidadeTexto === "basquete") idModalidade = 2;
    if (modalidadeTexto === "artes-marciais") idModalidade = 3;
    if (modalidadeTexto === "volei") idModalidade = 4;

    // 🔥 NOMES DE VARIÁVEIS CORRIGIDOS: idadeMin e idadeMax batendo 100% com o escopo!
    const dadosProposta = {
        cnpj: cnpj.replace(/\D/g, ""), 
        idade_minima: idadeMin, 
        idade_maxima: idadeMax,
        local: local,
        hora_fun: hora,
        telefone: telefone,
        email: email.includes("@") ? email : "contato@comuna.com",
        id_user: 1, 
        id_mod: idModalidade,
        descricao: `Responsável: ${responsavel} | Detalhes: ${descricaoOriginal}`
    };

    try {
        const resposta = await fetch(`${API_URL}/projetos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosProposta)
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {
            alert("Sua proposta com os campos oficiais foi registrada no MySQL com sucesso!");
            window.location.href = 'index.html';
        } else {
            alert(resultado.mensagem || "Erro na validação do servidor.");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Erro crítico: Verifique se a sua API Node.js está ativa no terminal!");
    }
}


// =========================================================================
// =========================================================================
// 5. REMOÇÃO LÓGICA (SOFT-DELETE VIA POOL MYSQL)
// =========================================================================
async function excluirGrupo(botao) {
    if (confirm("Tem certeza que deseja desativar este projeto do banco de dados?")) {
        const line = botao.closest('tr');
        const idProj = line.getAttribute("data-id-proj");

        try {
            const resposta = await fetch(`${API_URL}/projetos/${idProj}`, { method: "DELETE" });
            const resultado = await resposta.json();
            
            if (resultado.sucesso) {
                line.remove();
                atualizarContadoresGerais();
                alert("Registro desativado com sucesso via Pool de Conexões!");
            } else {
                alert("Erro ao remover o projeto do banco de dados.");
            }
        } catch (error) {
            alert("Erro crítico: Não foi possível conectar ao servidor da API MySQL.");
        }
    }
}

// =========================================================================
// 6. ESTRUTURA E AUXILIARES DO PAINEL ADMIN
// =========================================================================
function alternarAba(abaAlvo) {
    const secaoAtivos = document.getElementById('secaoAtivos');
    const secaoSolicitacoes = document.getElementById('secaoSolicitacoes');
    const cardAtivos = document.getElementById('cardAtivos');
    const cardSolicitacoes = document.getElementById('cardSolicitacoes');

    if (abaAlvo === 'ativos') {
        if (secaoAtivos) secaoAtivos.style.display = 'block';
        if (secaoSolicitacoes) secaoSolicitacoes.style.display = 'none';
        if (cardAtivos) cardAtivos.classList.add('aba-ativa');
        if (cardSolicitacoes) cardSolicitacoes.classList.remove('aba-ativa');
    } else {
        if (secaoAtivos) secaoAtivos.style.display = 'none';
        if (secaoSolicitacoes) secaoSolicitacoes.style.display = 'block';
        if (cardAtivos) cardAtivos.classList.remove('aba-ativa');
        if (cardSolicitacoes) cardSolicitacoes.classList.add('aba-ativa');
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

// 🔥 FUNÇÃO DE ANÁLISE MASTER: Separa o responsável da descrição de forma inteligente!
function abrirModalProposta(idProjetoProcurado) {
    if (!window.listaProjetosGlobais) return;
    const projeto = window.listaProjetosGlobais.find(p => Number(p.id_proj) === Number(idProjetoProcurado));
    
    if (!projeto) {
        alert("Erro: Projeto não localizado na lista.");
        return;
    }

    linhaSendoEditada = document.querySelector(`#tabelaSolicitacoes tr[data-id-proj="${idProjetoProcurado}"]`);

    document.getElementById('propNome').value = projeto.local;
    document.getElementById('propModalidade').value = projeto.modalidade.nome;
    document.getElementById('propLocalizacao').value = projeto.hora_fun;
    
    // 🔮 MÁGICA DO SPLIT: Separa o Nome do Responsável e os Detalhes da Proposta que vieram juntos do MySQL!
    const textoDescricao = projeto.descricao || "";
    if (textoDescricao.includes("Responsável:") && textoDescricao.includes("Detalhes:")) {
        // Se a string contiver o padrão estruturado, separa os pedaços lindamente
        const partes = textoDescricao.split(" | ");
        const nomeLimpo = partes[0].replace("Responsável: ", "");
        const detalhesLimpos = partes[1].replace("Detalhes: ", "");

        if (document.getElementById('propResponsavel')) document.getElementById('propResponsavel').value = nomeLimpo;
        document.getElementById('propDescricao').value = detalhesLimpos;
    } else {
        // Caso seja um registro antigo do banco de dados, serve como plano B
        if (document.getElementById('propResponsavel')) document.getElementById('propResponsavel').value = projeto.usuario ? projeto.usuario.nome : "Morador Comum";
        document.getElementById('propDescricao').value = textoDescricao;
    }
    
    if (document.getElementById('propCnpj')) document.getElementById('propCnpj').value = projeto.cnpj || "";
    if (document.getElementById('propFaixaEtaria')) {
        document.getElementById('propFaixaEtaria').value = `${projeto.idade_minima} a ${projeto.idade_maxima} anos`;
    }
    if (document.getElementById('propTelefone')) document.getElementById('propTelefone').value = projeto.telefone || "";
    if (document.getElementById('propEmail')) document.getElementById('propEmail').value = projeto.email || "";

    document.getElementById('modalProposta').classList.add('active');
}

function abrirModalEdicao(botao) {
    linhaSendoEditada = botao.closest('tr');
    const idProj = linhaSendoEditada.getAttribute("data-id-proj");
    if (!window.listaProjetosGlobais) return;
    const projeto = window.listaProjetosGlobais.find(p => Number(p.id_proj) === Number(idProj));

    if (projeto) {
        document.getElementById('editNome').value = projeto.local;
        document.getElementById('editLocalizacao').value = projeto.modalidade.nome;
        document.getElementById('modalEdicao').classList.add('active');
    }
}

function fecharModal() {
    if (document.getElementById('modalEdicao')) document.getElementById('modalEdicao').classList.remove('active');
    if (document.getElementById('modalProposta')) document.getElementById('modalProposta').classList.remove('active');
    linhaSendoEditada = null;
}

async function processarDecisaoModal(decisao) {
    if (!linhaSendoEditada) return;
    const idProj = linhaSendoEditada.getAttribute("data-id-proj");

    try {
        const resposta = await fetch(`${API_URL}/projetos/${idProj}/decisao`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ decisao: decisao })
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {
            alert(decisao === "aprovar" ? "O Grupo foi aprovado com sucesso!" : "A solicitação foi recusada.");
            fecharModal();
            carregarProjetosDoBanco();
        } else {
            alert("Erro ao processar a decisão no servidor.");
        }
    } catch (error) {
        alert("Erro crítico: Não foi Autism ou possível conectar ao servidor da API MySQL.");
    }
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
