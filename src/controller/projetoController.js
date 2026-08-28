const prisma = require("../config/prisma.js");

// POST - Criar Proposta de Projeto
const cadastrarProjeto = async (req, res) => {
    try {
        const { cnpj, idade_minima, idade_maxima, local, hora_fun, telefone, email, id_user, id_mod } = req.body;

        // Validação preventiva de campos obrigatórios
        if (!cnpj || !idade_minima || !idade_maxima || !local || !hora_fun || !telefone || !email || !id_user || !id_mod) {
            return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos da proposta." });
        }

        // Validação da regra de negócio de faixa etária (Regra do banco)
        if (Number(idade_minima) > Number(idade_maxima)) {
            return res.status(400).json({ sucesso: false, mensagem: "A idade mínima não pode ser maior que a idade máxima." });
        }

        // Cria o registro no banco mapeando as chaves estrangeiras com o Prisma
        const novoProjeto = await prisma.projeto.create({
            data: {
                cnpj,
                idade_minima: Number(idade_minima),
                idade_maxima: Number(idade_maxima),
                local,
                hora_fun,
                telefone,
                email,
                id_user: Number(id_user),
                id_mod: Number(id_mod)
            }
        });

        res.status(201).json({
            sucesso: true,
            mensagem: "Proposta de projeto enviada com sucesso!",
            dados: novoProjeto
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar projeto", erro: error.message });
    }
};

// GET ALL - Listar projetos ativos (com inclusão dos dados do responsável e da modalidade)
const listarProjetos = async (req, res) => {
    try {
        const projetos = await prisma.projeto.findMany({
            where: { ativo: true },
            include: {
                usuario: { // Faz o "INNER JOIN" automático trazendo os dados do usuário responsável
                    select: { nome: true, email: true }
                },
                modalidade: { // Faz o "INNER JOIN" trazendo a modalidade atrelada
                    select: { nome: true }
                }
            }
        });

        res.status(200).json({
            sucesso: true,
            total: projetos.length,
            dados: projetos
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao listar projetos", erro: error.message });
    }
};

module.exports = {
    cadastrarProjeto,
    listarProjetos
};
