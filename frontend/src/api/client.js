// Base da API vem de variável de ambiente do Vite (configurada no Vercel).
// Em desenvolvimento local, cai para localhost:3001.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function tratarResposta(res) {
  const dados = await res.json().catch(() => ({}));
  if (!res.ok) {
    const mensagem = dados?.erro || 'Algo deu errado. Tenta de novo em instantes.';
    throw new Error(mensagem);
  }
  return dados;
}

export async function buscarPerguntas() {
  const res = await fetch(`${API_BASE}/api/perguntas`);
  const dados = await tratarResposta(res);
  return dados.perguntas;
}

export async function enviarTentativa({ nome_participante, respostas }) {
  const res = await fetch(`${API_BASE}/api/tentativas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome_participante, respostas }),
  });
  return tratarResposta(res);
}
