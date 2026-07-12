export default function StartScreen({ nome, setNome, aoComecar, carregando, erro }) {
  function handleSubmit(e) {
    e.preventDefault();
    if (nome.trim().length === 0) return;
    aoComecar();
  }

  return (
    <div className="card capa">
      <span className="fita fita-topo" aria-hidden="true" />
      <p className="eyebrow">um álbum com perguntas</p>
      <h1 className="titulo-capa">O Quiz da Livinha</h1>
      <p className="subtitulo-capa">
        7 perguntas que só quem realmente me conhece consegue acertar.
        Vamos ver quanto você guardou de mim? 💛
      </p>

      <form onSubmit={handleSubmit} className="form-inicio">
        <label htmlFor="nome" className="label-nome">Seu nome</label>
        <input
          id="nome"
          type="text"
          value={nome}
          maxLength={80}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como você quer aparecer no resultado?"
          className="input-nome"
          autoComplete="off"
          required
        />
        {erro && <p className="mensagem-erro" role="alert">{erro}</p>}
        <button type="submit" className="botao-principal" disabled={carregando}>
          {carregando ? 'Abrindo o álbum...' : 'Começar o quiz'}
        </button>
      </form>
    </div>
  );
}
