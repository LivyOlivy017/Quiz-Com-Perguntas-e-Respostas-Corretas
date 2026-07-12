export default function QuestionCard({ pergunta, indice, selecionada, aoSelecionar, aoAvancar, ehUltima }) {
  return (
    <div className="card pergunta-card">
      <span className="fita fita-topo" style={{ transform: `translateX(-50%) rotate(${indice % 2 === 0 ? -3 : 3}deg)` }} aria-hidden="true" />
      <span className="selo-categoria">{pergunta.categoria}</span>
      <h2 className="texto-pergunta">{pergunta.texto}</h2>

      <div className="lista-opcoes" role="radiogroup" aria-label="Alternativas">
        {pergunta.opcoes.map((op) => (
          <button
            type="button"
            key={op.id}
            role="radio"
            aria-checked={selecionada === op.id}
            className={`opcao ${selecionada === op.id ? 'opcao-selecionada' : ''}`}
            onClick={() => aoSelecionar(op.id)}
          >
            {op.texto}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="botao-principal"
        disabled={selecionada === null}
        onClick={aoAvancar}
      >
        {ehUltima ? 'Ver resultado' : 'Próxima pergunta'}
      </button>
    </div>
  );
}
