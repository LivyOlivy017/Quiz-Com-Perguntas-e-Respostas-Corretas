function obterFaixa(pct) {
  if (pct >= 90) {
    return {
      titulo: 'Nível Álbum de Família',
      mensagem: 'Você me conhece de cor e salteado. Nem parece que teve chance de errar.',
    };
  }
  if (pct >= 70) {
    return {
      titulo: 'Quase um álbum inteiro',
      mensagem: 'Faltou só revisar algumas fotos mais antigas, mas você manda muito bem.',
    };
  }
  if (pct >= 40) {
    return {
      titulo: 'Conhece o essencial',
      mensagem: 'Pegou o principal, mas ainda tem histórias que eu não te contei direito.',
    };
  }
  return {
    titulo: 'Hora de um café',
    mensagem: 'Bora marcar uma conversa daquelas pra colocar o papo em dia?',
  };
}

export default function ResultCard({ nome, resultado, aoJogarNovamente }) {
  const pct = resultado.pontuacao_pct;
  const faixa = obterFaixa(pct);

  return (
    <div className="card resultado-card">
      <span className="fita fita-topo" aria-hidden="true" />
      <span className="selo-resultado" aria-hidden="true">{Math.round(pct)}%</span>
      <p className="eyebrow">resultado de {nome}</p>
      <h2 className="titulo-resultado">{faixa.titulo}</h2>
      <p className="mensagem-resultado">{faixa.mensagem}</p>
      <p className="detalhe-resultado">
        {resultado.total_acertos} de {resultado.total_perguntas} perguntas certas
      </p>
      <button type="button" className="botao-secundario" onClick={aoJogarNovamente}>
        Jogar de novo
      </button>
    </div>
  );
}
