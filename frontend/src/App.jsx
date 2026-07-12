import { useEffect, useState } from 'react';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultCard from './components/ResultCard';
import ProgressTabs from './components/ProgressTabs';
import { buscarPerguntas, enviarTentativa } from './api/client';
import './App.css';

// Estados possíveis da tela: 'inicio' -> 'jogando' -> 'resultado'
export default function App() {
  const [tela, setTela] = useState('inicio');
  const [nome, setNome] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState({}); // { pergunta_id: opcao_id }
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarPerguntas().catch(() => {
      setErro('Não consegui carregar as perguntas agora. Tenta recarregar a página em instantes.');
    }).then((dados) => {
      if (dados) setPerguntas(dados);
    });
  }, []);

  async function handleComecar() {
    setErro('');
    if (perguntas.length === 0) {
      setCarregando(true);
      try {
        const dados = await buscarPerguntas();
        setPerguntas(dados);
      } catch {
        setErro('Não consegui carregar as perguntas agora. Tenta de novo.');
        setCarregando(false);
        return;
      }
      setCarregando(false);
    }
    setTela('jogando');
  }

  function handleSelecionar(opcaoId) {
    const perguntaAtual = perguntas[indiceAtual];
    setRespostas((prev) => ({ ...prev, [perguntaAtual.id]: opcaoId }));
  }

  async function handleAvancar() {
    const ehUltima = indiceAtual === perguntas.length - 1;
    if (!ehUltima) {
      setIndiceAtual((i) => i + 1);
      return;
    }

    setCarregando(true);
    setErro('');
    try {
      const payload = Object.entries(respostas).map(([pergunta_id, opcao_id]) => ({
        pergunta_id: Number(pergunta_id),
        opcao_id: Number(opcao_id),
      }));
      const dados = await enviarTentativa({ nome_participante: nome.trim(), respostas: payload });
      setResultado(dados);
      setTela('resultado');
    } catch (err) {
      setErro(err.message || 'Não consegui enviar suas respostas. Tenta de novo.');
    } finally {
      setCarregando(false);
    }
  }

  function handleJogarNovamente() {
    setIndiceAtual(0);
    setRespostas({});
    setResultado(null);
    setTela('inicio');
  }

  return (
    <main className="pagina">
      <div className="conteudo">
        {tela === 'inicio' && (
          <StartScreen
            nome={nome}
            setNome={setNome}
            aoComecar={handleComecar}
            carregando={carregando}
            erro={erro}
          />
        )}

        {tela === 'jogando' && perguntas.length > 0 && (
          <>
            <ProgressTabs total={perguntas.length} atual={indiceAtual} />
            <QuestionCard
              pergunta={perguntas[indiceAtual]}
              indice={indiceAtual}
              selecionada={respostas[perguntas[indiceAtual].id] ?? null}
              aoSelecionar={handleSelecionar}
              aoAvancar={handleAvancar}
              ehUltima={indiceAtual === perguntas.length - 1}
            />
            {carregando && <p className="mensagem-carregando">Calculando sua nota...</p>}
            {erro && <p className="mensagem-erro" role="alert">{erro}</p>}
          </>
        )}

        {tela === 'resultado' && resultado && (
          <ResultCard nome={nome} resultado={resultado} aoJogarNovamente={handleJogarNovamente} />
        )}
      </div>
      <footer className="rodape">feito com carinho para minha mãe 💌</footer>
    </main>
  );
}
