/* ==========================================================================
   AGENTE PROBABILÍSTICO - LÓGICA E ALGORITMOS DE PALPITES INTELIGENTES
   ========================================================================== */

// Base de Dados Estatística das Loterias
const loteriasData = {
  mega: {
    nome: "Mega-Sena",
    subtitulo: "Módulo Mega-Sena 60 Dezenas",
    horaSorteio: "20h (horário de Brasília)",
    diasSorteio: "terças, quintas e sábados",
    quentes: [18, 60, 37, 12, 29, 28, 58, 36, 16, 44],
    frias: [24, 45, 42, 27, 3, 9, 10, 55, 2, 38],
    atrasadas: [7, 19, 33, 46, 52],
    repetidas: [27, 30, 35, 40, 44, 58],
    principios: [
      "Composição: 2 quentes, 2 médias e 2 frias",
      "Paridade: Exatamente 3 dezenas pares e 3 ímpares",
      "Dispersão: 3 dezenas entre 1-30 e 3 dezenas entre 31-60",
      "Base estatística fundamentada em histórico oficial Caixa"
    ],
    maxNumero: 60,
    qtdDezenas: 6,
    indicadorTexto: "Modelo Padrão: 3 pares / 3 ímpares",
    // Algoritmo específico de geração Mega-Sena
    gerar: function (medias) {
      let tentativas = 0;
      // Aumentei o limite de tentativas porque as regras agora são muito mais rígidas
      while (tentativas < 15000) {
        tentativas++;
        let dezenas = [];

        // Selecionar 2 quentes
        let q = selecionarAleatorios(this.quentes, 2);
        // Selecionar 2 frias
        let f = selecionarAleatorios(this.frias, 2);
        // Selecionar 2 médias
        let m = selecionarAleatorios(medias, 2);

        dezenas = [...q, ...f, ...m];

        // Validação de Paridade: Exatamente 3 pares e 3 ímpares
        let pares = dezenas.filter(n => n % 2 === 0).length;
        if (pares !== 3) continue;

        // Validação de Faixas: Exatamente 3 entre 1-30 e 3 entre 31-60
        let primeiraMetade = dezenas.filter(n => n <= 30).length;
        if (primeiraMetade !== 3) continue;

        // NOVA REGRA: Pelo menos 1 atrasada e 1 repetida no jogo
        let hasAtrasada = dezenas.some(n => this.atrasadas.includes(n));
        let hasRepetida = dezenas.some(n => this.repetidas.includes(n));
        if (!hasAtrasada || !hasRepetida) continue;

        // Sucesso: ordena e categoriza
        dezenas.sort((a, b) => a - b);

        // NOVA REGRA: Evitar mais de 2 sequências (3 números seguidos)
        let hasSeq3 = false;
        for (let i = 0; i < dezenas.length - 2; i++) {
          if (dezenas[i] + 1 === dezenas[i + 1] && dezenas[i + 1] + 1 === dezenas[i + 2]) {
            hasSeq3 = true;
            break;
          }
        }
        if (hasSeq3) continue;

        // NOVA REGRA: Distribuir entre quadrantes do volante (exigir pelo menos 3 quadrantes diferentes)
        // Volante Mega-Sena: Q1 (linhas 1-3, col 1-5), Q2 (linhas 1-3, col 6-10), Q3 (linhas 4-6, col 1-5), Q4 (linhas 4-6, col 6-10)
        let quadrantes = new Set();
        dezenas.forEach(n => {
          let col = (n - 1) % 10 + 1;
          let row = Math.floor((n - 1) / 10) + 1;
          let quad = (row <= 3 ? 1 : 3) + (col <= 5 ? 0 : 1);
          quadrantes.add(quad);
        });
        if (quadrantes.size < 3) continue;

        return {
          numeros: dezenas,
          detalhes: {
            composição: "2Q, 2M, 2F (c/ Atrasada e Repetida)",
            paridade: "3 Pares / 3 Ímpares (Sem Seq.)",
            distribuição: `3 Bx / 3 Al (${quadrantes.size} Quadrantes)`
          }
        };
      }
      return null;
    }
  },
  quina: {
    nome: "Quina",
    subtitulo: "Módulo Quina 80 Dezenas",
    horaSorteio: "20h (horário de Brasília)",
    diasSorteio: "segunda a sábado",
    quentes: [3, 15, 47, 62, 79, 10, 26, 33, 4, 18],
    frias: [1, 5, 12, 29, 74, 8, 19, 41, 55, 80],
    atrasadas: [2, 14, 38, 51, 76],
    repetidas: [15, 26, 41, 62],
    principios: [
      "Composição: 2 quentes, 1 média e 2 frias",
      "Paridade: Balanceamento de 3 pares/2 ímpares ou 2 pares/3 ímpares",
      "Dispersão: 3 dezenas na faixa 1-40 e 2 na faixa 41-80 (ou vice-versa)",
      "Estratégia focada na otimização de ciclos de atraso"
    ],
    maxNumero: 80,
    qtdDezenas: 5,
    indicadorTexto: "Modelo Padrão: 3 pares / 2 ímpares ou vice-versa",
    gerar: function (medias) {
      let tentativas = 0;
      while (tentativas < 15000) {
        tentativas++;
        let dezenas = [];

        let q = selecionarAleatorios(this.quentes, 2);
        let f = selecionarAleatorios(this.frias, 2);
        let m = selecionarAleatorios(medias, 1);

        dezenas = [...q, ...f, ...m];

        let pares = dezenas.filter(n => n % 2 === 0).length;
        if (pares !== 2 && pares !== 3) continue;

        let primeiraMetade = dezenas.filter(n => n <= 40).length;
        if (primeiraMetade !== 2 && primeiraMetade !== 3) continue;

        let hasAtrasada = dezenas.some(n => this.atrasadas.includes(n));
        let hasRepetida = dezenas.some(n => this.repetidas.includes(n));
        if (!hasAtrasada || !hasRepetida) continue;

        dezenas.sort((a, b) => a - b);

        let hasSeq3 = false;
        for (let i = 0; i < dezenas.length - 2; i++) {
          if (dezenas[i] + 1 === dezenas[i + 1] && dezenas[i + 1] + 1 === dezenas[i + 2]) {
            hasSeq3 = true; break;
          }
        }
        if (hasSeq3) continue;

        let quadrantes = new Set();
        dezenas.forEach(n => {
          let col = (n - 1) % 10 + 1;
          let row = Math.floor((n - 1) / 10) + 1;
          let quad = (row <= 4 ? 1 : 3) + (col <= 5 ? 0 : 1);
          quadrantes.add(quad);
        });
        if (quadrantes.size < 3) continue;

        return {
          numeros: dezenas,
          detalhes: {
            composição: "2Q, 1M, 2F (c/ Atrasada e Repetida)",
            paridade: `${pares}P / ${5 - pares}I (Sem Seq.)`,
            distribuição: `${primeiraMetade}Bx / ${5 - primeiraMetade}Al (${quadrantes.size} Quad)`
          }
        };
      }
      return null;
    }
  },
  lotofacil: {
    nome: "Lotofácil",
    subtitulo: "Módulo Lotofácil (Base: 3.745 Concursos)",
    horaSorteio: "20h (horário de Brasília)",
    diasSorteio: "segunda a sábado",
    quentes: [20, 10, 25, 11, 13, 24, 1, 14, 4, 5],
    frias: [16, 8, 23, 17, 6, 7, 21, 19, 18, 9],
    atrasadas: [3, 12, 15, 22],
    repetidas: [1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 13, 19, 21, 22, 24],
    principios: [
      "Base Analítica: Histórico completo de 3.745 concursos",
      "Composição: 8 quentes (top 10), 4 médias e 3 frias",
      "Repetidas: 8 a 10 dezenas repetidas do concurso anterior (média 9.15)",
      "Paridade: 8 ímpares / 7 pares ou 7 ímpares / 8 pares",
      "Cobertura: Dezenas distribuídas em todas as 5 linhas do volante"
    ],
    maxNumero: 25,
    qtdDezenas: 15,
    indicadorTexto: "Modelo 3.745 Concursos: 8-10 Repetidas | 8-7 Paridade | 5 Linhas",
    gerar: function (medias) {
      let tentativas = 0;
      while (tentativas < 15000) {
        tentativas++;
        let dezenas = [];

        let q = selecionarAleatorios(this.quentes, 8);
        let f = selecionarAleatorios(this.frias, 3);
        let m = selecionarAleatorios(medias, 4);

        dezenas = [...q, ...f, ...m];

        let pares = dezenas.filter(n => n % 2 === 0).length;
        if (pares !== 7 && pares !== 8) continue;

        let primeiraMetade = dezenas.filter(n => n <= 13).length;
        if (primeiraMetade !== 7 && primeiraMetade !== 8) continue;

        // Trava de Repetidas do Concurso Anterior (8 a 10 repetidas)
        let qtdRep = dezenas.filter(n => this.repetidas.includes(n)).length;
        if (qtdRep < 8 || qtdRep > 10) continue;

        dezenas.sort((a, b) => a - b);

        let seqLongo = false;
        let seqCount = 1;
        for (let i = 0; i < dezenas.length - 1; i++) {
          if (dezenas[i] + 1 === dezenas[i + 1]) {
            seqCount++;
            if (seqCount >= 7) { seqLongo = true; break; }
          } else {
            seqCount = 1;
          }
        }
        if (seqLongo) continue;

        let linhas = new Set();
        dezenas.forEach(n => {
          let row = Math.floor((n - 1) / 5) + 1;
          linhas.add(row);
        });
        if (linhas.size < 5) continue; // Exige números em todas as 5 linhas

        return {
          numeros: dezenas,
          detalhes: {
            composição: "8Q, 4M, 3F (Atr+Rep)",
            paridade: `${pares}P / ${15 - pares}I (S/ Seq>6)`,
            distribuição: `Todas 5 Linhas Ativas`
          }
        };
      }
      return null;
    }
  }
};

// Estado Global da Aplicação
let jogoAtivo = 'mega';
let palpiteAtual = [];

// Função Auxiliar: Selecionar N elementos aleatórios e únicos de um array
function selecionarAleatorios(arr, n) {
  let copiado = [...arr];
  let resultado = [];
  for (let i = 0; i < n; i++) {
    if (copiado.length === 0) break;
    let index = Math.floor(Math.random() * copiado.length);
    resultado.push(copiado.splice(index, 1)[0]);
  }
  return resultado;
}

// Obter dezenas médias (todas as possíveis menos as quentes e as frias)
function obterDezenasMedias(loteria) {
  let medias = [];
  let quentesEFrias = new Set([...loteria.quentes, ...loteria.frias]);
  for (let i = 1; i <= loteria.maxNumero; i++) {
    if (!quentesEFrias.has(i)) {
      medias.push(i);
    }
  }
  return medias;
}

// Formatação amigável para números (ex: 3 -> "03")
function formatarNumero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

// Inicializar a aplicação e carregar a Mega-Sena por padrão
window.addEventListener('DOMContentLoaded', () => {
  selecionarJogo('mega');
});

// Função para alternar entre os jogos do menu
function selecionarJogo(jogo) {
  jogoAtivo = jogo;
  const data = loteriasData[jogo];

  // 1. Atualizar Botões do Menu
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  const activeBtn = document.getElementById(`btn-${jogo}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
  }

  // 2. Atualizar Informações do Agente com Data Dinâmica
  const agentNameEl = document.getElementById('agent-name');
  if (agentNameEl) {
    agentNameEl.innerHTML = `Consultor ${data.nome} <span style="font-size: 0.72rem; font-weight: 500; color: var(--text-secondary); display: block; margin-top: 5px; letter-spacing: 0.5px; text-transform: uppercase;">Atualizado em: ${obterDataFormatadaCurta()}</span>`;
  }

  const statusText = document.getElementById('agent-status-text');
  if (statusText) {
    statusText.textContent = `Análise ${data.nome} Ativa`;
  }

  // 3. Inicializar Chat com Mensagem de Boas-vindas Personalizada e Data do Sistema
  const chatMessages = document.getElementById('chat-messages');
  if (chatMessages) {
    chatMessages.innerHTML = ''; // Limpa mensagens anteriores
    const hojeStr = obterDataFormatada();
    const temSorteio = verificarSorteioHoje(jogo);
    const avisoSorteio = temSorteio
      ? `🍀 **Hoje é ${hojeStr} e TEM SORTEIO da ${data.nome} às ${data.horaSorteio}!**`
      : `📅 **Hoje é ${hojeStr}.** (Não há sorteio regular agendado para hoje. Próximos sorteios: ${data.diasSorteio} às ${data.horaSorteio}.)`;

    adicionarMensagemChat('agente', `Olá! Sou seu **Consultor Probabilístico para a ${data.nome}**.\n\n${avisoSorteio}\n\nComo posso ajudar você hoje?\n\nPergunte-me coisas como:\n✦ *"Me dê um palpite"* \n✦ *"Quanto custa a aposta?"*\n✦ *"Hoje tem sorteio?"*\n✦ *"Quais são as dezenas quentes?"*\n✦ *"Qual a sua estratégia?"*`);
  }

  // 4. Renderizar Dezenas Quentes e Frias
  renderizarBolasFrequencia(data.quentes, 'hot-numbers', 'ball-hot');
  renderizarBolasFrequencia(data.frias, 'cold-numbers', 'ball-cold');

  if (data.atrasadas && data.repetidas) {
    document.getElementById('col-atrasadas').style.display = 'block';
    document.getElementById('col-repetidas').style.display = 'block';
    renderizarBolasFrequencia(data.atrasadas, 'atrasadas-numbers', 'ball-hot'); // usa os mesmos estilos para manter design
    renderizarBolasFrequencia(data.repetidas, 'repetidas-numbers', 'ball-cold');
  } else {
    document.getElementById('col-atrasadas').style.display = 'none';
    document.getElementById('col-repetidas').style.display = 'none';
  }

  // 5. Limpar área do palpite gerado anteriormente
  document.getElementById('palpite-balls').innerHTML = `
    <span class="placeholder-text" style="color: var(--text-secondary); font-size: 0.85rem;">Clique em "Gerar Jogo" ou peça ao Consultor via chat para rodar o algoritmo probabilístico.</span>
  `;
  document.getElementById('game-analytics').style.display = 'none';

  // Desabilitar botão de copiar
  const btnCopy = document.getElementById('btn-copy');
  if (btnCopy) btnCopy.disabled = true;
  const copyBtnText = document.getElementById('copy-btn-text');
  if (copyBtnText) copyBtnText.textContent = "Copiar Jogo";

  // 6. Atualizar indicador de rodapé
  const statusIndicator = document.getElementById('footer-indicador-texto');
  if (statusIndicator) statusIndicator.textContent = data.indicadorTexto;

  // Seção Exclusiva da Lotofácil (Diagnóstico ML)
  const lotofacilMlSec = document.getElementById('lotofacil-ml-section');
  if (lotofacilMlSec) {
    if (jogo === 'lotofacil') {
      lotofacilMlSec.style.display = 'block';
      if (typeof ApiService !== 'undefined' && ApiService.carregarMetricasLotofacilIA) {
        ApiService.carregarMetricasLotofacilIA();
      }
    } else {
      lotofacilMlSec.style.display = 'none';
    }
  }

  // 7. Carregar dados da API (se disponível) e Histórico
  if (typeof ApiService !== 'undefined') {
    ApiService.carregarUltimoResultado(jogo);
  }
  if (typeof historicoManager !== 'undefined') {
    historicoManager.renderizar(jogo);
  }
}

// Renderiza esferas na seção de frequência
function renderizarBolasFrequencia(numeros, containerId, classeBola) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  // Ordena para fins de visualização organizada
  const ordenados = [...numeros].sort((a, b) => a - b);

  ordenados.forEach(num => {
    const bola = document.createElement('div');
    bola.className = `ball ${classeBola}`;
    bola.textContent = formatarNumero(num);
    container.appendChild(bola);
  });
}

// Gera um novo palpite estatístico dinâmico
async function gerarPalpiteEstatistico() {
  const data = loteriasData[jogoAtivo];
  const medias = obterDezenasMedias(data);
  const btnGenerate = document.getElementById('btn-generate');

  // Efeito visual de loading no botão
  btnGenerate.disabled = true;
  btnGenerate.innerHTML = `
    <svg class="spin" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
    Calculando IA...
  `;

  let palpite = null;

  // Tenta integrar com backend do Lotofacil_Agent se for Lotofácil
  if (jogoAtivo === 'lotofacil' && typeof ApiService !== 'undefined') {
    const sliderParity = document.getElementById('slider-parity');
    const sliderMoldura = document.getElementById('slider-moldura');
    const selectModel = document.getElementById('select-active-model');

    const params = {
      n_games: 1,
      active_model: selectModel ? selectModel.value : 'RandomForest',
      parity_weight: sliderParity ? parseFloat(sliderParity.value) : 0.5,
      moldura_weight: sliderMoldura ? parseFloat(sliderMoldura.value) : 0.5
    };

    const apiResult = await ApiService.gerarPalpitesCustomIA(params);
    if (apiResult && apiResult.palpites && apiResult.palpites.length > 0) {
      const item = apiResult.palpites[0];
      const m = item.metricas;
      palpite = {
        numeros: item.dezenas,
        detalhes: {
          composição: `IA ${apiResult.modelo_ativo || 'ML'} (Score: ${item.score_probabilidade}%)`,
          paridade: `${m.evens} Pares / ${m.odds} Ímpares`,
          distribuição: `${m.moldura} Moldura (${m.repetition} Repetidas)`
        }
      };
    }
  }

  // Fallback local se a API não retornar
  if (!palpite) {
    palpite = data.gerar(medias);
  }

  if (palpite) {
    palpiteAtual = palpite.numeros;
    exibirPalpiteComAnimacao(palpite);

    if (typeof historicoManager !== 'undefined') {
      historicoManager.salvar(jogoAtivo, palpiteAtual, palpite.detalhes);
      mostrarToast('Palpite gerado e salvo!', 'success');
    }
  } else {
    document.getElementById('palpite-balls').innerHTML = `
      <span class="error-text" style="color: var(--neon-red); font-size: 0.85rem;">Erro de convergência no algoritmo. Tente novamente!</span>
    `;
    if (typeof mostrarToast !== 'undefined') mostrarToast('Erro ao gerar palpite.', 'error');
  }

  // Restaurar botão de gerar
  btnGenerate.disabled = false;
  btnGenerate.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
    Gerar Palpite
  `;
}

// Exibe as bolas com efeito bounce e transição suave individual
function exibirPalpiteComAnimacao(palpite) {
  const container = document.getElementById('palpite-balls');
  container.innerHTML = '';

  const data = loteriasData[jogoAtivo];
  const quentesSet = new Set(data.quentes);
  const friasSet = new Set(data.frias);

  palpite.numeros.forEach((num, index) => {
    const bola = document.createElement('div');

    // Classifica a bola para definir cores diferentes no palpite
    let classeTipo = 'medium';
    if (quentesSet.has(num)) {
      classeTipo = 'hot';
    } else if (friasSet.has(num)) {
      classeTipo = 'cold';
    }

    bola.className = `ball-palpite ${classeTipo}`;
    bola.textContent = formatarNumero(num);

    // Ajusta o atraso da animação de cada bola para que surjam uma a uma
    bola.style.animationDelay = `${index * 100}ms`;

    container.appendChild(bola);
  });

  // Renderiza detalhes estatísticos do palpite gerado
  document.getElementById('val-composition').textContent = palpite.detalhes.composição;
  document.getElementById('val-parity').textContent = palpite.detalhes.paridade;
  document.getElementById('val-distribution').textContent = palpite.detalhes.distribuição;

  // Exibe a seção de dados do palpite com fade
  const analyticsDiv = document.getElementById('game-analytics');
  analyticsDiv.style.display = 'grid';

  // Habilita botão de copiar
  const btnCopy = document.getElementById('btn-copy');
  btnCopy.disabled = false;
  document.getElementById('copy-btn-text').textContent = "Copiar Jogo";
}

// Copiar palpites gerados para área de transferência
function copiarPalpite() {
  if (palpiteAtual.length === 0) return;

  const texto = palpiteAtual.map(n => formatarNumero(n)).join(', ');

  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.getElementById('btn-copy');
    const btnText = document.getElementById('copy-btn-text');
    const copyIcon = document.getElementById('copy-icon');

    // Guardar SVG interno original
    const originalSvg = copyIcon.innerHTML;

    // Feedback Visual Premium
    copyIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    copyIcon.style.stroke = "var(--neon-green)";
    btnText.textContent = "Copiado! ✓";
    btnText.style.color = "var(--neon-green)";
    btn.style.borderColor = "var(--neon-green)";
    btn.style.boxShadow = "0 0 12px rgba(0, 255, 136, 0.25)";
    btn.style.transform = "scale(1.03)";

    // Restaurar após 2 segundos
    setTimeout(() => {
      copyIcon.innerHTML = originalSvg;
      copyIcon.style.stroke = "";
      btnText.textContent = "Copiar Jogo";
      btnText.style.color = "";
      btn.style.borderColor = "";
      btn.style.boxShadow = "";
      btn.style.transform = "";
    }, 2000);
  }).catch(err => {
    console.error('Falha ao copiar texto: ', err);
  });
}

/* ==========================================================================
   LÓGICA E INTELIGÊNCIA ARTIFICIAL LOCAL DO CHATBOT DO AGENTE
   ========================================================================== */

// Adiciona uma bolha de mensagem ao container de chat
function adicionarMensagemChat(autor, texto) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const bolha = document.createElement('div');
  bolha.className = `chat-bubble ${autor}`;

  // Converter marcações simples de negrito (**texto**) e quebras de linha para HTML
  let formatado = texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  bolha.innerHTML = formatado;
  container.appendChild(bolha);

  // Rolar para a última mensagem com comportamento suave
  container.scrollTo({
    top: container.scrollHeight,
    behavior: 'smooth'
  });
}

// Exibe indicador visual de digitação ("...")
function exibirIndicadorDigitacao() {
  const container = document.getElementById('chat-messages');
  if (!container) return null;

  const indicador = document.createElement('div');
  indicador.className = 'typing-indicator chat-bubble agent';
  indicador.id = 'typing-indicator';
  indicador.innerHTML = '<span></span><span></span><span></span>';

  container.appendChild(indicador);
  container.scrollTo({
    top: container.scrollHeight,
    behavior: 'smooth'
  });

  return indicador;
}

// Envia a mensagem digitada pelo usuário
function enviarMensagemChat() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  const texto = input.value.trim();
  if (texto === '') return;

  // Adiciona a mensagem do usuário no chat
  adicionarMensagemChat('user', texto);

  // Limpa o input
  input.value = '';

  // Processa a resposta do agente com simulação de pensamento
  const indicador = exibirIndicadorDigitacao();

  setTimeout(() => {
    if (indicador) indicador.remove();
    processarMensagemAgente(texto);
  }, 900);
}

// Base de Dados Oficial dos Próximos Concursos e Prêmios das Loterias Caixa
const concursosProximosCaixa = {
  mega: {
    nome: "Mega-Sena",
    concurso: 3039,
    premio: "R$ 100.000.000,00",
    premioExtenso: "100 Milhões de Reais",
    sorteio: "Domingo, 02/08/2026 às 11h00",
    encerramento: "5 horas e 43 minutos"
  },
  lotofacil: {
    nome: "Lotofácil",
    concurso: 3751,
    premio: "R$ 2.000.000,00",
    premioExtenso: "2 Milhões de Reais",
    sorteio: "Domingo, 02/08/2026 às 11h00",
    encerramento: "5 horas e 43 minutos"
  },
  independencia: {
    nome: "Lotofácil da Independência",
    concurso: 3780,
    premio: "R$ 300.000.000,00",
    premioExtenso: "300 Milhões de Reais",
    sorteio: "Terça-Feira, 15/09/2026 às 11h00",
    encerramento: "44 dias"
  },
  quina: {
    nome: "Quina",
    concurso: 7081,
    premio: "R$ 2.000.000,00",
    premioExtenso: "2 Milhões de Reais",
    sorteio: "Domingo, 02/08/2026 às 11h00",
    encerramento: "5 horas e 43 minutos"
  },
  milionaria: {
    nome: "+Milionária",
    concurso: 377,
    premio: "R$ 79.000.000,00",
    premioExtenso: "79 Milhões de Reais",
    sorteio: "Domingo, 02/08/2026 às 11h00",
    encerramento: "5 horas e 43 minutos"
  },
  lotomania: {
    nome: "Lotomania",
    concurso: 2958,
    premio: "R$ 6.200.000,00",
    premioExtenso: "6,2 Milhões de Reais",
    sorteio: "Segunda-Feira, 03/08/2026 às 21h00",
    encerramento: "2 dias"
  },
  timemania: {
    nome: "Timemania",
    concurso: 2423,
    premio: "R$ 6.000.000,00",
    premioExtenso: "6 Milhões de Reais",
    sorteio: "Domingo, 02/08/2026 às 11h00",
    encerramento: "5 horas e 43 minutos"
  },
  duplasena: {
    nome: "Dupla Sena",
    concurso: 2991,
    premio: "R$ 450.000,00",
    premioExtenso: "450 Mil Reais",
    sorteio: "Segunda-Feira, 03/08/2026 às 21h00",
    encerramento: "2 dias"
  },
  diadesorte: {
    nome: "Dia de Sorte",
    concurso: 1261,
    premio: "R$ 800.000,00",
    premioExtenso: "800 Mil Reais",
    sorteio: "Domingo, 02/08/2026 às 11h00",
    encerramento: "5 horas e 43 minutos"
  },
  supersete: {
    nome: "Super Sete",
    concurso: 881,
    premio: "R$ 4.500.000,00",
    premioExtenso: "4,5 Milhões de Reais",
    sorteio: "Segunda-Feira, 03/08/2026 às 21h00",
    encerramento: "2 dias"
  },
  loteca: {
    nome: "Loteca dos Pais",
    concurso: 1265,
    premio: "R$ 2.000.000,00",
    premioExtenso: "2 Milhões de Reais",
    sorteio: "Sábado, 08/08/2026 às 15h00",
    encerramento: "6 dias"
  }
};

// Processador de Linguagem Natural Local (Baseado em Intenções e Palavras-chave)
function processarMensagemAgente(pergunta) {
  const data = loteriasData[jogoAtivo];
  const medias = obterDezenasMedias(data);
  const textoMinusculo = pergunta.toLowerCase();

  let resposta = "";

  // 1. Gerar palpite / Gerar jogo
  if (textoMinusculo.match(/(gerar|palpite|jogo|gerar jogo|me dá|da um|dá um|sugestão|sortear|faz um)/)) {
    const palpite = data.gerar(medias);
    if (palpite) {
      palpiteAtual = palpite.numeros;
      exibirPalpiteComAnimacao(palpite);

      const numerosFormatados = palpite.numeros.map(n => formatarNumero(n)).join(', ');
      resposta = `Com certeza! Calculei um palpite estatístico de alta convergência para você:\n\n**${numerosFormatados}**\n\n**Composição:** ${palpite.detalhes.composição}\n**Paridade:** ${palpite.detalhes.paridade}\n**Faixas:** ${palpite.detalhes.distribuição}\n\nO palpite já está renderizado em esferas 3D no painel principal! Você pode copiá-lo clicando em *Copiar Jogo*.`;
    } else {
      resposta = `Desculpe, ocorreu um erro matemático de convergência no algoritmo. Você poderia tentar gerar novamente?`;
    }
  }
  // 2. Horário de Encerramento das Apostas / Quanto tempo falta
  else if (textoMinusculo.match(/(encerra|encerramento|quanto tempo|limite|prazo|encerram|tempo falta|faltam)/)) {
    if (textoMinusculo.includes('independência') || textoMinusculo.includes('independencia')) {
      resposta = `⏰ **Lotofácil da Independência (Concurso #${concursosProximosCaixa.independencia.concurso})**:\n\n💰 **Prêmio:** ${concursosProximosCaixa.independencia.premio}\n📅 **Sorteio:** ${concursosProximosCaixa.independencia.sorteio}\n⏳ **As apostas se encerram em:** ${concursosProximosCaixa.independencia.encerramento}!`;
    } else if (textoMinusculo.includes('loteca') || textoMinusculo.includes('pais')) {
      resposta = `⏰ **Loteca dos Pais (Concurso #${concursosProximosCaixa.loteca.concurso})**:\n\n💰 **Prêmio:** ${concursosProximosCaixa.loteca.premio}\n📅 **Apuração:** ${concursosProximosCaixa.loteca.sorteio}\n⏳ **As apostas se encerram em:** ${concursosProximosCaixa.loteca.encerramento}!`;
    } else {
      const c = concursosProximosCaixa[jogoAtivo] || concursosProximosCaixa.mega;
      resposta = `⏰ **Apostas para a ${c.nome} (Concurso #${c.concurso})**:\n\n💰 **Prêmio Estimado:** ${c.premio} (${c.premioExtenso})\n📅 **Sorteio:** ${c.sorteio}\n⌛ **As apostas se encerram em:** **${c.encerramento}**!\n\nNão deixe para a última hora! Quer um palpite gerado agora?`;
    }
  }
  // 3. Prêmios, Valores Estimados e Comparativo de Loterias
  else if (textoMinusculo.match(/(prêmio|premio|acumulou|valor|estimado|estimativa|dinheiro|pagar|milhões|milhoes|todos os prêmios|todas as loterias|maior prêmio|ranking)/)) {
    if (textoMinusculo.match(/(todos|todas|ranking|maiores|geral|lista|quais são)/)) {
      resposta = `🏆 **Próximos Prêmios Estimados das Loterias Caixa:**\n\n` +
        `🇧🇷 **Lotofácil da Independência:** R$ 300 Milhões (Conc. #3780 - 15/09)\n` +
        `💰 **Mega-Sena:** R$ 100 Milhões (Conc. #3039 - Sorteio 02/08)\n` +
        `💎 **+Milionária:** R$ 79 Milhões (Conc. #377 - Sorteio 02/08)\n` +
        `🎰 **Lotomania:** R$ 6,2 Milhões (Conc. #2958 - Sorteio 03/08)\n` +
        `🎯 **Super Sete:** R$ 4,5 Milhões (Conc. #881 - Sorteio 03/08)\n` +
        `🎟️ **Lotofácil:** R$ 2 Milhões (Conc. #3751 - Sorteio 02/08)\n` +
        `🎯 **Quina:** R$ 2 Milhões (Conc. #7081 - Sorteio 02/08)\n` +
        `⚽ **Loteca dos Pais:** R$ 2 Milhões (Conc. #1265 - Sorteio 08/08)\n` +
        `⚽ **Timemania:** R$ 6 Milhões (Conc. #2423 - Sorteio 02/08)\n` +
        `🎲 **Dia de Sorte:** R$ 800 Mil (Conc. #1261 - Sorteio 02/08)\n` +
        `✌️ **Dupla Sena:** R$ 450 Mil (Conc. #2991 - Sorteio 03/08)\n\n` +
        `Qual dessas você quer que eu analise ou gere um palpite?`;
    } else if (textoMinusculo.includes('independência') || textoMinusculo.includes('independencia')) {
      const info = concursosProximosCaixa.independencia;
      resposta = `🌟 **${info.nome} (Concurso #${info.concurso})**\n\n💎 **Prêmio Especial:** **${info.premio}** (${info.premioExtenso})\n📅 **Sorteio:** ${info.sorteio}\n⏰ **Encerramento das Apostas:** ${info.encerramento}`;
    } else {
      const c = concursosProximosCaixa[jogoAtivo] || concursosProximosCaixa.mega;
      resposta = `💰 **Prêmio Estimado para o Concurso #${c.concurso} da ${c.nome}:**\n\n🎉 **${c.premio}** (${c.premioExtenso})\n\n📅 **Sorteio:** ${c.sorteio}\n⌛ **Apostas se encerram em:** ${c.encerramento}\n\nQuer que eu calcule a melhor combinação de dezenas para este sorteio?`;
    }
  }
  // 4. Dezenas Quentes
  else if (textoMinusculo.match(/(quente|quentes|mais sorteadas|mais sairam|mais saíram|frequentes|frequência|frequencia)/)) {
    const quentesFormatadas = [...data.quentes].sort((a, b) => a - b).map(n => formatarNumero(n)).join(', ');
    resposta = `As dezenas **quentes** (historicamente mais sorteadas) para a **${data.nome}** são:\n\n**${quentesFormatadas}**\n\nNossa estratégia recomenda selecionar exatamente **${jogoAtivo === 'mega' ? '2 dezenas' : jogoAtivo === 'quina' ? '2 dezenas' : '8 dezenas'}** desse grupo para equilibrar suas probabilidades de acerto.`;
  }
  // 5. Dezenas Frias
  else if (textoMinusculo.match(/(fria|frias|atrasada|atrasadas|menos sorteadas|menos sairam|menos saíram|geladas)/)) {
    const friasFormatadas = [...data.frias].sort((a, b) => a - b).map(n => formatarNumero(n)).join(', ');
    resposta = `As dezenas **frias** (atrasadas ou com menor frequência recente) para a **${data.nome}** são:\n\n**${friasFormatadas}**\n\nNosso algoritmo estatístico insere **${jogoAtivo === 'mega' ? '2 dezenas' : jogoAtivo === 'quina' ? '2 dezenas' : '3 dezenas'}** frias no palpite para cobrir ciclos de atraso que tendem a se fechar.`;
  }
  // 6. Saudação
  else if (textoMinusculo.match(/(oi|olá|ola|bom dia|boa tarde|boa noite|hello|hey|como vai)/)) {
    const c = concursosProximosCaixa[jogoAtivo] || concursosProximosCaixa.mega;
    resposta = `Olá! Tudo bem? Sou o **Consultor Probabilístico da ${data.nome}**. 🤖\n\nO próximo concurso (#${c.concurso}) pagará **${c.premioExtenso}**! As apostas encerram em **${c.encerramento}**.\n\nComo posso te ajudar com a análise estatística hoje?`;
  }
  // 7. Data Atual, Calendário e Sorteios
  else if (textoMinusculo.match(/(hoje|data|que dia|dia de hoje|data atual|calendário|calendario|sorteio|hora|horário|horario|quando)/)) {
    const hojeStr = obterDataFormatada();
    const c = concursosProximosCaixa[jogoAtivo] || concursosProximosCaixa.mega;
    resposta = `Hoje é **${hojeStr}**.\n\n📅 **Próximo Sorteio da ${c.nome}:** ${c.sorteio} (Concurso #${c.concurso})\n💰 **Prêmio:** ${c.premio}\n⏳ **Encerramento das Apostas:** ${c.encerramento}`;
  }
  // 8. Estratégia / Como funciona
  else if (textoMinusculo.match(/(estratégia|estrategia|como funciona|algoritmo|princípios|principios|diretrizes|regra|regras)/)) {
    const principiosTexto = data.principios.map(p => `✦ ${p}`).join('\n');
    resposta = `Minha estratégia probabilística para a **${data.nome}** é baseada em:\n\n${principiosTexto}\n\nCombinando essa dispersão e paridade, conseguimos cobrir as faixas matemáticas com maior probabilidade histórica de sorteio!`;
  }
  // 9. Preço e Valores das Apostas
  else if (textoMinusculo.match(/(preço|preco|preços|precos|custa|custo|custos|valor|valores|tabela|quanto pago|quanto custa|cobrado|pagar|aposta simples|bolão|bolao)/)) {
    if (jogoAtivo === 'lotofacil' || textoMinusculo.includes('lotofácil') || textoMinusculo.includes('lotofacil')) {
      resposta = `A aposta simples da **Lotofácil** (com **15 dezenas**) custa **R$ 3,50**. 🎟️\n\nCaso queira aumentar suas chances jogando mais dezenas em um mesmo bilhete, os valores oficiais são:\n\n✦ **15 números**: R$ 3,50\n✦ **16 números**: R$ 56,00\n✦ **17 números**: R$ 476,00\n✦ **18 números**: R$ 2.856,00\n✦ **19 números**: R$ 13.566,00\n✦ **20 números**: R$ 54.264,00\n\n💡 *Dica do Consultor:* Minhas análises probabilísticas ajudam a escolher as 15 dezenas com maior probabilidade estatística para otimizar o seu investimento sem precisar gastar fortunes em bilhetes com mais números!`;
    } else if (jogoAtivo === 'mega' || textoMinusculo.includes('mega') || textoMinusculo.includes('sena')) {
      resposta = `A aposta simples da **Mega-Sena** (com **6 dezenas**) custa **R$ 6,00**. 💰\n\nSe você desejar marcar mais dezenas em um único cartão:\n\n✦ **6 números**: R$ 6,00\n✦ **7 números**: R$ 42,00\n✦ **8 números**: R$ 168,00\n✦ **9 números**: R$ 504,00\n✦ **10 números**: R$ 1.260,00\n✦ **20 números**: R$ 232.560,00\n\n👥 **Bolão Caixa:** Mínimo de R$ 18,00 (com cota mínima de R$ 7,00 por participante).`;
    } else if (jogoAtivo === 'quina' || textoMinusculo.includes('quina')) {
      resposta = `A aposta simples da **Quina** (com **5 dezenas**) custa **R$ 3,00**. 🎯\n\nVocê pode marcar de 5 a 15 números no volante. Quanto mais números marcar, maior o valor e maiores as suas chances de ganhar a Quina, Quadra, Terno ou Duque!`;
    } else {
      resposta = `Aqui estão os valores das apostas simples para as principais loterias da Caixa:\n\n🍀 **Lotofácil** (15 números): **R$ 3,50**\n💰 **Mega-Sena** (6 números): **R$ 6,00**\n🎯 **Quina** (5 números): **R$ 3,00**\n\nSe quiser saber o preço para jogar com mais números em alguma delas, é só me perguntar!`;
    }
  }
  // 10. Dezenas Médias
  else if (textoMinusculo.match(/(média|médias|medias|media|intermediária|intermediarias|intermediárias)/)) {
    const mediasFormatadas = medias.slice(0, 12).map(n => formatarNumero(n)).join(', ');
    resposta = `As dezenas **médias** (ou intermediárias) são as dezenas que não pertencem nem ao grupo das mais sorteadas (quentes) nem das mais atrasadas (frias).\n\nPara a **${data.nome}**, algumas dezenas médias são: **${mediasFormatadas}...**\n\nO algoritmo seleciona **${jogoAtivo === 'mega' ? '2' : jogoAtivo === 'quina' ? '1' : '4'}** médias para servir de âncora de dispersão neutra.`;
  }
  // 11. Jogo Responsável
  else if (textoMinusculo.match(/(ganhar|ficar rico|dinheiro|certeza|garante|garantido|100%|loteria)/)) {
    resposta = `Como um consultor estatístico matemático, preciso lembrar que **loterias são jogos de azar baseados em eventos independentes**.\n\nMinhas estratégias otimizam as suas probabilidades com base no histórico, mas **não há garantia de ganho** ou acerto de 100%. Jogue sempre com responsabilidade, focando na diversão e sob seu limite orçamentário. 🍀`;
  }
  // 12. Quem é você / Persona
  else if (textoMinusculo.match(/(quem é|quem e|seu nome|criador|ajuda|funciona|bot|agente|IA)/)) {
    resposta = `Eu sou o **Consultor Probabilístico**, um agente estatístico projetado para analisar e otimizar jogos das Loterias Caixa.\n\nPosso informar sobre prêmios, contagem regressiva para encerramento de apostas, sorteios especiais como Lotofácil da Independência, dezenas quentes/frias e gerar palpites equilibrados!`;
  }
  // Intenção padrão (Fallback)
  else {
    resposta = `Entendi a sua dúvida, mas não consegui encontrar uma estatística específica para essa pergunta.\n\nTente me perguntar sobre:\n✦ *"Qual o prêmio da Mega-Sena?"*\n✦ *"Quanto tempo falta para encerrar as apostas?"*\n✦ *"Quais são os maiores prêmios da Caixa?"*\n✦ *"Me dê um palpite para a Lotofácil"*`;
  }

  adicionarMensagemChat('agente', resposta);
}

/* ==========================================================================
   FUNÇÕES AUXILIARES DE DATA E CALENDÁRIO DE SORTEIOS
   ========================================================================== */

// Retorna a data atual por extenso construída manualmente de forma robusta e livre de falhas Unicode
function obterDataFormatada() {
  const data = new Date();
  const diasSemana = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
  ];
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];

  const diaSemana = diasSemana[data.getDay()];
  const dia = data.getDate();
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();

  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}

// Retorna a data atual no formato curto (ex: "26/05/2026")
function obterDataFormatadaCurta() {
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Verifica se há sorteio regular agendado para o dia da semana atual no Brasil
function verificarSorteioHoje(jogo) {
  const diaSemana = new Date().getDay(); // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  if (jogo === 'mega') {
    // Mega-Sena: Terças (2), Quintas (4) e Sábados (6)
    return [2, 4, 6].includes(diaSemana);
  } else if (jogo === 'quina' || jogo === 'lotofacil') {
    // Quina e Lotofácil: Segunda (1) a Sábado (6)
    return diaSemana >= 1 && diaSemana <= 6;
  }
  return false;
}

/* ==========================================================================
   INTEGRAÇÃO COM API, HISTÓRICO E TOASTS (NOVO)
   ========================================================================== */

function mostrarToast(mensagem, tipo = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.textContent = mensagem;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

const ApiService = {
  // Se estiver abrindo o arquivo direto no PC (file://), usa localhost, senão usa /api relativo do servidor unificado
  baseUrl: window.location.protocol === 'file:' ? 'http://localhost:8000/api' : '/api',

  setStatus(status) {
    const dot = document.getElementById('api-status-dot');
    const text = document.getElementById('api-status-text');
    if (!dot || !text) return;

    dot.className = `dot ${status === 'online' ? 'green' : status === 'offline' ? 'red' : 'yellow'}`;
    text.textContent = status === 'online' ? 'API Conectada' : status === 'offline' ? 'Modo Offline (Estatístico)' : 'Conectando...';
  },

  async carregarMetricasLotofacilIA() {
    try {
      const res = await fetch(`${this.baseUrl}/lotofacil/ml-metrics`);
      if (res.ok) {
        const data = await res.json();
        const mlpAcc = document.getElementById('ml-mlp-acc');
        const rfAcc = document.getElementById('ml-rf-acc');
        const clustersCount = document.getElementById('ml-clusters-count');
        const mlpAcc2 = document.getElementById('ml-mlp-acc-2');
        const rfAcc2 = document.getElementById('ml-rf-acc-2');
        const clustersCount2 = document.getElementById('ml-clusters-count-2');

        const mlpStr = `${(data.mlp_neural_network.accuracy * 100).toFixed(1)}%`;
        const rfStr = `${(data.random_forest.accuracy * 100).toFixed(1)}%`;
        const cStr = `${data.kmeans.n_clusters} Perfis`;

        if (mlpAcc) mlpAcc.textContent = mlpStr;
        if (rfAcc) rfAcc.textContent = rfStr;
        if (clustersCount) clustersCount.textContent = cStr;
        if (mlpAcc2) mlpAcc2.textContent = mlpStr;
        if (rfAcc2) rfAcc2.textContent = rfStr;
        if (clustersCount2) clustersCount2.textContent = cStr;

        if (data.kmeans && data.kmeans.cluster_profiles) {
          renderizarClustersKMeans(data.kmeans.cluster_profiles);
        }
        return data;
      }
    } catch (e) {
      console.warn("API Lotofacil ml-metrics indisponível", e);
    }
    return null;
  },

  async carregarEstatisticasLotofacilIA() {
    try {
      const res = await fetch(`${this.baseUrl}/lotofacil/stats`);
      if (res.ok) {
        const data = await res.json();
        renderizarHeatmapGrid(data.heatmaps);
        renderizarGraficoFrequencia(data.probabilidades_dezenas);
        return data;
      }
    } catch (e) {
      console.warn("API Lotofacil stats indisponível", e);
    }
    return null;
  },

  async gerarPalpitesLotofacilIA(nGames = 1) {
    try {
      const res = await fetch(`${this.baseUrl}/lotofacil/generate-palpites?n_games=${nGames}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("API Lotofacil generate-palpites indisponível", e);
    }
    return null;
  },

  async gerarPalpitesCustomIA(params) {
    try {
      const nGames = params.n_games || 1;
      const model = params.active_model || 'RandomForest';
      const parity = params.parity_weight || 0.5;
      const moldura = params.moldura_weight || 0.5;
      const url = `${this.baseUrl}/lotofacil/generate-custom?n_games=${nGames}&active_model=${model}&parity_weight=${parity}&moldura_weight=${moldura}`;
      const res = await fetch(url, { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("API Lotofacil generate-custom indisponível", e);
    }
    return null;
  },

  async atualizarBaseDadosLotofacilIA() {
    try {
      const res = await fetch(`${this.baseUrl}/lotofacil/update-dataset`, { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("API Lotofacil update-dataset indisponível", e);
    }
    return null;
  },



  async carregarUltimoResultado(jogo) {
    this.setStatus('connecting');
    const container = document.getElementById('ultimo-resultado');
    const concursoEl = document.getElementById('res-concurso');
    const dataEl = document.getElementById('res-data');
    const bolasContainer = document.getElementById('res-bolas');
    const premiosContainer = document.getElementById('res-premios');
    const acumulouBadge = document.getElementById('res-acumulou');

    if (!container) return;

    container.style.display = 'block';
    bolasContainer.innerHTML = '<span style="color:var(--text-secondary);font-size:0.8rem;">Carregando dados da Caixa...</span>';
    premiosContainer.innerHTML = '';
    acumulouBadge.style.display = 'none';

    try {
      const response = await fetch(`${this.baseUrl}/resultados/${jogo}`);
      if (!response.ok) throw new Error('API indisponível');

      const data = await response.json();
      window.ultimoResultadoCaixa = data;
      this.setStatus('online');

      concursoEl.textContent = `#${data.numero}`;
      dataEl.textContent = data.dataApuracao;

      // Renderizar bolas do sorteio oficial
      bolasContainer.innerHTML = '';
      if (data.listaDezenas && Array.isArray(data.listaDezenas)) {
        data.listaDezenas.forEach(numStr => {
          const bola = document.createElement('div');
          bola.className = 'ball ball-palpite'; // usa estilo dourado neutro
          bola.style.transform = 'scale(1)';
          bola.style.opacity = '1';
          bola.style.animation = 'none';
          bola.textContent = numStr;
          bolasContainer.appendChild(bola);
        });

        // Atualização dinâmica das dezenas repetidas (do último concurso oficial)
        if (loteriasData[jogo]) {
          loteriasData[jogo].repetidas = data.listaDezenas.map(n => parseInt(n, 10));
          if (jogoAtivo === jogo) {
            const colRep = document.getElementById('col-repetidas');
            if (colRep) colRep.style.display = 'block';
            renderizarBolasFrequencia(loteriasData[jogo].repetidas, 'repetidas-numbers', 'ball-cold');
          }
        }
      }

      // Acumulou?
      if (data.acumulado) {
        acumulouBadge.style.display = 'block';
      }

      // Premiação / Rateio
      const listaPremios = data.listaRateioPremio || data.premiacao || [];
      if (listaPremios && listaPremios.length > 0) {
        const faixas = listaPremios.slice(0, 3);
        faixas.forEach(p => {
          const valor = p.valorPremio || 0;
          const valorFmt = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          const qtd = p.numeroDeGanhadores !== undefined ? p.numeroDeGanhadores : (p.quantidadeGanhadores || 0);
          const ganhadoresTxt = qtd === 0 ? 'Ninguém acertou' : `${qtd} ganhador(es)`;
          const desc = p.descricaoFaixa || p.nome || 'Faixa';

          premiosContainer.innerHTML += `
            <div class="premio-linha">
              <span class="premio-nome">${desc} (${ganhadoresTxt})</span>
              <span class="premio-valor">${valorFmt}</span>
            </div>
          `;
        });
      }

    } catch (err) {
      console.warn('Fallback: Backend API indisponível', err);
      this.setStatus('offline');
      container.style.display = 'none'; // Oculta a seção se a API não estiver rodando
    }
  }
};

class HistoricoManager {
  constructor() {
    this.storageKey = 'palpiteiro_historico';
    this.dados = JSON.parse(localStorage.getItem(this.storageKey)) || {};
  }

  salvar(jogo, dezenas, detalhes) {
    if (!this.dados[jogo]) this.dados[jogo] = [];

    const novoPalpite = {
      id: Date.now(),
      data: new Date().toLocaleString('pt-BR'),
      dezenas: dezenas,
      detalhes: detalhes
    };

    this.dados[jogo].unshift(novoPalpite); // adiciona no início

    // Limita a 20 palpites por jogo
    if (this.dados[jogo].length > 20) {
      this.dados[jogo].pop();
    }

    this._persistir();
    this.renderizar(jogo);
  }

  limpar(jogo) {
    if (confirm('Tem certeza que deseja apagar o histórico deste jogo?')) {
      this.dados[jogo] = [];
      this._persistir();
      this.renderizar(jogo);
      mostrarToast('Histórico limpo.', 'success');
    }
  }

  exportar(jogo) {
    const lista = this.dados[jogo] || [];
    if (lista.length === 0) {
      mostrarToast('Não há palpites para exportar.', 'error');
      return;
    }

    let texto = `Histórico de Palpites - ${jogo.toUpperCase()}\n\n`;
    lista.forEach(p => {
      texto += `[${p.data}] ${p.dezenas.map(n => formatarNumero(n)).join(' - ')}\n`;
    });

    navigator.clipboard.writeText(texto).then(() => {
      mostrarToast('Histórico copiado para área de transferência!', 'success');
    });
  }

  renderizar(jogo) {
    const container = document.getElementById('historico-lista');
    const actions = document.getElementById('historico-actions');
    if (!container) return;

    const lista = this.dados[jogo] || [];

    if (lista.length === 0) {
      container.innerHTML = '<div style="color:var(--text-secondary);font-size:0.8rem;text-align:center;padding:10px;">Nenhum palpite gerado ainda.</div>';
      actions.style.display = 'none';
      return;
    }

    actions.style.display = 'flex';
    container.innerHTML = '';

    lista.forEach(p => {
      const dezenasFmt = p.dezenas.map(n => formatarNumero(n)).join('  ');
      container.innerHTML += `
        <div class="historico-item">
          <div class="historico-item-header">
            <span>${p.data}</span>
            <span>${p.detalhes.composição.split(',')[0]}</span>
          </div>
          <div class="historico-item-dezenas">${dezenasFmt}</div>
        </div>
      `;
    });
  }

  _persistir() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.dados));
  }
}

const historicoManager = new HistoricoManager();

function toggleHistorico() {
  const lista = document.getElementById('historico-lista');
  const icon = document.getElementById('historico-toggle-icon');
  if (lista.style.display === 'none') {
    lista.style.display = 'flex';
    icon.textContent = '▲';
  } else {
    lista.style.display = 'none';
    icon.textContent = '▼';
  }
}

/* ==========================================================================
   FUNÇÕES DE INTERFACE DO LOTOFACIL_AGENT (4 ABAS & HEATMAPS)
   ========================================================================== */

function trocarSubAbaLotofacil(abaNome) {
  const abas = ['dashboard', 'ml', 'palpiteiro', 'settings'];
  abas.forEach(a => {
    const btn = document.getElementById(`subtab-btn-${a}`);
    const content = document.getElementById(`subtab-${a}`);
    if (btn && content) {
      if (a === abaNome) {
        btn.classList.add('active');
        btn.style.background = 'rgba(0, 255, 170, 0.15)';
        btn.style.color = 'var(--neon-green)';
        btn.style.borderColor = 'rgba(0, 255, 170, 0.3)';
        content.style.display = 'block';
      } else {
        btn.classList.remove('active');
        btn.style.background = 'rgba(255,255,255,0.05)';
        btn.style.color = 'var(--text-secondary)';
        btn.style.borderColor = 'rgba(255,255,255,0.1)';
        content.style.display = 'none';
      }
    }
  });

  if (abaNome === 'dashboard' && typeof ApiService !== 'undefined' && ApiService.carregarEstatisticasLotofacilIA) {
    ApiService.carregarEstatisticasLotofacilIA();
  } else if (abaNome === 'ml' && typeof ApiService !== 'undefined' && ApiService.carregarMetricasLotofacilIA) {
    ApiService.carregarMetricasLotofacilIA();
  }
}

function renderizarHeatmapGrid(heatmapData) {
  const gridContainer = document.getElementById('heatmap-grid-5x5');
  if (!gridContainer || !heatmapData || !heatmapData.grid_5x5) return;

  gridContainer.innerHTML = '';
  heatmapData.grid_5x5.forEach(row => {
    row.forEach(item => {
      const cell = document.createElement('div');
      const pct = item.frequencia_pct;
      
      let bg = 'rgba(0, 255, 170, 0.1)';
      let color = '#55ffb8';
      if (pct >= 61) {
        bg = 'rgba(255, 68, 68, 0.25)';
        color = '#ff6b6b';
      } else if (pct < 58.5) {
        bg = 'rgba(85, 212, 255, 0.15)';
        color = '#55d4ff';
      }
      
      cell.style.cssText = `background: ${bg}; color: ${color}; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 4px; text-align: center; font-size: 0.72rem; font-weight: bold; display: flex; flex-direction: column; align-items: center; justify-content: center;`;
      cell.innerHTML = `<span>${String(item.numero).padStart(2, '0')}</span><span style="font-size: 0.6rem; opacity: 0.8; font-weight: normal;">${pct}%</span>`;
      gridContainer.appendChild(cell);
    });
  });
}

function renderizarGraficoFrequencia(ranking) {
  const chartContainer = document.getElementById('frequency-bar-chart');
  if (!chartContainer || !ranking) return;

  chartContainer.innerHTML = '';
  const top15 = ranking.slice(0, 15);
  const maxPct = Math.max(...top15.map(d => d.percentual));

  top15.forEach(item => {
    const bar = document.createElement('div');
    const h = (item.percentual / maxPct) * 100;
    let bg = item.status === 'Quente' ? '#ff5555' : (item.status === 'Fria' ? '#55d4ff' : '#55ffb8');
    
    bar.style.cssText = `flex: 1; height: ${h}%; background: ${bg}; border-radius: 3px 3px 0 0; position: relative; transition: height 0.5s ease;`;
    bar.title = `Dezena ${item.numero}: ${item.percentual}%`;
    chartContainer.appendChild(bar);
  });
}

function renderizarClustersKMeans(profiles) {
  const container = document.getElementById('kmeans-clusters-container');
  if (!container || !profiles) return;
  container.innerHTML = '';

  profiles.forEach(p => {
    const item = document.createElement('div');
    item.style.cssText = 'background: rgba(0,0,0,0.2); padding: 6px; border-radius: 6px; font-size: 0.72rem; display: flex; justify-content: space-between; align-items: center;';
    item.innerHTML = `
      <span style="font-weight: bold; color: #ffb855;">Cluster #${p.cluster_id + 1} (${p.pct.toFixed(1)}%)</span>
      <span style="color: var(--text-secondary);">${p.avg_evens.toFixed(1)} Pares | ${p.avg_moldura.toFixed(1)} Moldura | Soma ~${p.avg_sum.toFixed(0)}</span>
    `;
    container.appendChild(item);
  });
}

async function atualizarBaseDadosLotofacil() {
  if (typeof mostrarToast !== 'undefined') mostrarToast('Atualizando histórico e retreinando IA...', 'info');
  if (typeof ApiService !== 'undefined' && ApiService.atualizarBaseDadosLotofacilIA) {
    const res = await ApiService.atualizarBaseDadosLotofacilIA();
    if (res && res.status === 'success') {
      if (typeof mostrarToast !== 'undefined') mostrarToast(`Base atualizada! Total de ${res.total_concursos} concursos.`, 'success');
      ApiService.carregarMetricasLotofacilIA();
      ApiService.carregarEstatisticasLotofacilIA();
    } else {
      if (typeof mostrarToast !== 'undefined') mostrarToast('Erro ao atualizar base de dados.', 'error');
    }
  }
}

/* ==========================================================================
   RELÓGIO E DATA EM TEMPO REAL NO CABEÇALHO E CONSULTOR
   ========================================================================== */
function iniciarRelogioReal() {
  function atualizar() {
    const agora = new Date();
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    const agentTimeEl = document.getElementById('agent-live-datetime');

    const horaStr = agora.toLocaleTimeString('pt-BR');
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const diaSemana = diasSemana[agora.getDay()];
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const dataStr = `${diaSemana}, ${dia}/${mes}/${ano}`;

    if (clockEl) clockEl.textContent = horaStr;
    if (dateEl) dateEl.textContent = dataStr;
  }

  atualizar();
  setInterval(atualizar, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarRelogioReal);
} else {
  iniciarRelogioReal();
}


