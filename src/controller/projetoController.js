const pool = require("../config/pool.js"); // Declarado apenas UMA VEZ no topo do arquivo!

// =========================================================================
// 1. POST - CADASTRAR NOVA PROPOSTA DE PROJETO (COM DESCRIÇÃO INCLUSA)
// =========================================================================
const cadastrarProjeto = async (req, res) => {
    try {
        const { cnpj, idade_minima, idade_maxima, local, hora_fun, telefone, email, id_user, id_mod, descricao } = req.body;

        if (!cnpj || !idade_minima || !idade_maxima || !local || !hora_fun || !telefone || !email || !id_user || !id_mod || !descricao) {
            return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos da proposta, incluindo a descrição." });
        }

        await pool.query(
            "INSERT INTO Projeto (CNPJ, idade_minima, idade_maxima, Local, hora_fun, telefone, email, id, id_mod, descricao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [cnpj, idade_minima, idade_maxima, local, hora_fun, telefone, email, id_user, id_mod, descricao]
        );

        res.status(201).json({ sucesso: true, mensagem: "Proposta de projeto salva no MySQL com descrição!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao salvar projeto", erro: error.message });
    }
};

// GET ALL - Listar todos os projetos (ativos e pendentes)
const listarProjetos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.id_proj, p.CNPJ as cnpj, p.idade_minima, p.idade_maxima, p.Local as local, p.hora_fun, p.telefone, p.email, p.descricao, p.status,
                u.nome AS nome_responsavel,
                m.modalidade AS nome_modalidade
            FROM Projeto p
            INNER JOIN cadusers u ON p.id = u.id
            INNER JOIN Modalidades m ON p.id_mod = m.id_mod
            WHERE p.ativo = true
        `);

        const projetosFormatados = rows.map(row => ({
            id_proj: row.id_proj,
            cnpj: row.cnpj,             // <-- Corrigido para minúsculo idêntico ao front!
            local: row.local,
            idade_minima: row.idade_minima,
            idade_maxima: row.idade_maxima,
            hora_fun: row.hora_fun,
            telefone: row.telefone,     // <-- Corrigido para minúsculo!
            email: row.email,           // <-- Corrigido para minúsculo!
            descricao: row.descricao || "Sem descrição informada.",
            status: row.status, 
            modalidade: { nome: row.nome_modalidade },
            usuario: { nome: row.nome_responsavel }
        }));

        res.status(200).json({ sucesso: true, total: projetosFormatados.length, dados: projetosFormatados });
    } catch (error) {
        res.status(500).json({ sucesso: false, message: "Erro ao buscar projetos", error: error.message });
    }
};

// =========================================================================
// 3. DELETE LÓGICO - DESATIVAR PROJETO DO BANCO (SOFT-DELETE)
// =========================================================================
const deletarProjeto = async (req, res) => {
    try {
        const id_proj = Number(req.params.id);

        if (isNaN(id_proj)) {
            return res.status(400).json({ sucesso: false, mensagem: "ID do projeto inválido." });
        }

        const [projetos] = await pool.query("SELECT id_proj FROM Projeto WHERE id_proj = ? AND ativo = true", [id_proj]);
        
        if (projetos.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: "Projeto não encontrado ou já desativado." });
        }

        await pool.query("UPDATE Projeto SET ativo = false WHERE id_proj = ?", [id_proj]);

        res.status(200).json({
            sucesso: true,
            mensagem: "Projeto desativado com sucesso através do Pool!"
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao desativar projeto", erro: error.message });
    }
};

// PUT - Processar Decisão do Administrador (Aprovar ou Recusar Proposta)
const decidirProposta = async (req, res) => {
    try {
        const id_proj = Number(req.params.id);
        const { decisao } = req.body; // Recebe 'aprovar' ou 'recusar'

        if (isNaN(id_proj) || !decisao) {
            return res.status(400).json({ sucesso: false, mensagem: "Dados inválidos para a decisão." });
        }

        if (decisao === "aprovar") {
            // Se aceitou, muda o status para aprovado para mover de aba
            await pool.query("UPDATE Projeto SET status = 'aprovado' WHERE id_proj = ?", [id_proj]);
            return res.status(200).json({ sucesso: true, mensagem: "Proposta aprovada com sucesso via Pool!" });
        } else {
            // Se recusou, fazemos o soft-delete desativando o projeto do sistema
            await pool.query("UPDATE Projeto SET ativo = false WHERE id_proj = ?", [id_proj]);
            return res.status(200).json({ sucesso: true, mensagem: "Proposta recusada e removida do painel." });
        }
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao processar decisão", erro: error.message });
    }
};

// ATENÇÃO: Adicione a nova função na lista de exportações lá embaixo:
// O final do seu projetoController.js precisa terminar estritamente assim:
module.exports = {
    cadastrarProjeto,
    listarProjetos,
    deletarProjeto,
    decidirProposta // <-- ESSE CARA PRECISA ESTAR AQUI DENTRO!
};

