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
    alert('Redirecionando usuário comum...');
    window.location.href = 'index.html';
  }
}

function logout() {
  document.getElementById('usuario').value = '';
  document.getElementById('senha').value = '';
  document.getElementById('adminBox').style.display = 'none';
  document.getElementById('loginBox').style.display = 'block';
}

function alternarAba(abaAlvo) {
  document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('active'));
  if (abaAlvo === 'ativos') {
    document.getElementById('cardAtivos').classList.add('active');
    document.getElementById('secaoAtivos').style.display = 'block';
    document.getElementById('secaoSolicitacoes').style.display = 'none';
  } else {
    document.getElementById('cardSolicitacoes').classList.add('active');
    document.getElementById('secaoAtivos').style.display = 'none';
    document.getElementById('secaoSolicitacoes').style.display = 'block';
  }
}

function atualizarContadoresGerais() {
  document.getElementById('txtTotalAtivos').textContent = `${document.querySelectorAll('#tabelaGrupos tr').length} Ativos`;
  document.getElementById('txtTotalSolicitacoes').textContent = document.querySelectorAll('#tabelaSolicitacoes tr').length;
}

function excluirGrupo(b) {
  if (confirm("Deseja excluir este grupo?")) {
    b.closest('tr').remove();
    atualizarContadoresGerais();
  }
}

function abrirModalEdicao(b) {
  linhaSendoEditada = b.closest('tr');
  document.getElementById('editNome').value = linhaSendoEditada.cells[0].innerText;
  document.getElementById('editModalidade').value = linhaSendoEditada.cells[1].innerText;
  document.getElementById('editLocalizacao').value = linhaSendoEditada.cells[2].innerText;
  document.getElementById('modalEdicao').classList.add('active');
}

function abrirModalProposta(b) {
  linhaSendoEditada = b.closest('tr');
  document.getElementById('propNome').value = linhaSendoEditada.cells[0].innerText;
  document.getElementById('propModalidade').value = linhaSendoEditada.cells[1].innerText;
  document.getElementById('propLocalizacao').value = linhaSendoEditada.cells[2].innerText;
  document.getElementById('modalProposta').classList.add('active');
}

function fecharModal() {
  document.getElementById('modalEdicao').classList.remove('active');
  document.getElementById('modalProposta').classList.remove('active');
  linhaSendoEditada = null;
}

function salvarEdicao(event) {
  event.preventDefault();
  if (linhaSendoEditada) {
    const m = document.getElementById('editModalidade').value;
    const classe = m === 'Basquete' ? 'badge-basquete' : m === 'Dança' ? 'badge-danca' : 'badge-futebol';
    linhaSendoEditada.cells[0].innerHTML = `<strong>${document.getElementById('editNome').value}</strong>`;
    linhaSendoEditada.cells[1].innerHTML = `<span class="badge ${classe}">${m}</span>`;
    linhaSendoEditada.cells[2].innerText = document.getElementById('editLocalizacao').value;
    fecharModal();
  }
}

function processarDecisaoModal(decisao) {
  if (!linhaSendoEditada) return;
  if (decisao === 'aprovar') {
    const nome = document.getElementById('propNome').value;
    const mod = document.getElementById('propModalidade').value;
    const loc = document.getElementById('propLocalizacao').value;
    const classe = mod.includes('Basquete') ? 'badge-basquete' : mod.includes('Dança') ? 'badge-danca' : 'badge-futebol';

    document.getElementById('tabelaGrupos').insertAdjacentHTML('beforeend', `
      <tr>
        <td><strong>${nome}</strong></td>
        <td><span class="badge ${classe}">${mod}</span></td>
        <td>${loc}</td>
        <td>
          <button onclick="abrirModalEdicao(this)" class="btn-action-text btn-edit-text">Editar</button>
          <button onclick="excluirGrupo(this)" class="btn-action-text btn-delete-text">Excluir</button>
        </td>
      </tr>
    `);
  }
  linhaSendoEditada.remove();
  fecharModal();
  atualizarContadoresGerais();
}
