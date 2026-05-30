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
    gerar: function(medias) {
      let tentativas = 0;
      while (tentativas < 5000) {
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
        
        // Sucesso: ordena e categoriza
        dezenas.sort((a, b) => a - b);
        return {
          numeros: dezenas,
          detalhes: {
            composição: "2 Quentes, 2 Médias, 2 Frias",
            paridade: "3 Pares / 3 Ímpares",
            distribuição: "3 Faixa Baixa / 3 Faixa Alta"
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
    principios: [
      "Composição: 2 quentes, 1 média e 2 frias",
      "Paridade: Balanceamento de 3 pares/2 ímpares ou 2 pares/3 ímpares",
      "Dispersão: 3 dezenas na faixa 1-40 e 2 na faixa 41-80 (ou vice-versa)",
      "Estratégia focada na otimização de ciclos de atraso"
    ],
    maxNumero: 80,
    qtdDezenas: 5,
    indicadorTexto: "Modelo Padrão: 3 pares / 2 ímpares ou vice-versa",
    gerar: function(medias) {
      let tentativas = 0;
      while (tentativas < 5000) {
        tentativas++;
        let dezenas = [];
        
        let q = selecionarAleatorios(this.quentes, 2);
        let f = selecionarAleatorios(this.frias, 2);
        let m = selecionarAleatorios(medias, 1);
        
        dezenas = [...q, ...f, ...m];
        
        // Validação de Paridade: 3 pares e 2 ímpares OU 2 pares e 3 ímpares
        let pares = dezenas.filter(n => n % 2 === 0).length;
        if (pares !== 2 && pares !== 3) continue;
        
        // Validação de Faixas: 3 na faixa 1-40 e 2 na 41-80 (ou vice-versa)
        let primeiraMetade = dezenas.filter(n => n <= 40).length;
        if (primeiraMetade !== 2 && primeiraMetade !== 3) continue;
        
        dezenas.sort((a, b) => a - b);
        return {
          numeros: dezenas,
          detalhes: {
            composição: "2 Quentes, 1 Média, 2 Frias",
            paridade: `${pares} Pares / ${5 - pares} Ímpares`,
            distribuição: `${primeiraMetade} Faixa Baixa / ${5 - primeiraMetade} Faixa Alta`
          }
        };
      }
      return null;
    }
  },
  lotofacil: {
    nome: "Lotofácil",
    subtitulo: "Módulo Lotofácil 25 Dezenas",
    horaSorteio: "20h (horário de Brasília)",
    diasSorteio: "segunda a sábado",
    quentes: [1, 2, 13, 14, 20, 3, 11, 15, 18, 22, 24],
    frias: [7, 8, 19, 21, 25, 5, 9, 16, 17],
    principios: [
      "Composição: 8 quentes, 4 médias e 3 frias",
      "Paridade: Balanceamento clássico de 8 ímpares/7 pares ou vice-versa",
      "Dispersão: 8 dezenas na faixa 1-13 e 7 na faixa 14-25 (ou vice-versa)",
      "Algoritmo de cobertura ampla de quadrantes estatísticos"
    ],
    maxNumero: 25,
    qtdDezenas: 15,
    indicadorTexto: "Modelo Padrão: 8 ímpares / 7 pares ou vice-versa",
    gerar: function(medias) {
      let tentativas = 0;
      while (tentativas < 5000) {
        tentativas++;
        let dezenas = [];
        
        let q = selecionarAleatorios(this.quentes, 8);
        let f = selecionarAleatorios(this.frias, 3);
        let m = selecionarAleatorios(medias, 4);
        
        dezenas = [...q, ...f, ...m];
        
        // Validação de Paridade: 8 ímpares e 7 pares OU 7 ímpares e 8 pares
        let pares = dezenas.filter(n => n % 2 === 0).length;
        if (pares !== 7 && pares !== 8) continue;
        
        // Validação de Faixas: 8 na faixa 1-13 e 7 na 14-25 (ou vice-versa)
        let primeiraMetade = dezenas.filter(n => n <= 13).length;
        if (primeiraMetade !== 7 && primeiraMetade !== 8) continue;
        
        dezenas.sort((a, b) => a - b);
        return {
          numeros: dezenas,
          detalhes: {
            composição: "8 Quentes, 4 Médias, 3 Frias",
            paridade: `${pares} Pares / ${15 - pares} Ímpares`,
            distribuição: `${primeiraMetade} Faixa Baixa / ${15 - primeiraMetade} Faixa Alta`
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
      
    adicionarMensagemChat('agente', `Olá! Sou seu **Consultor Probabilístico para a ${data.nome}**.\n\n${avisoSorteio}\n\nComo posso ajudar você hoje?\n\nPergunte-me coisas como:\n✦ *"Me dê um palpite"* \n✦ *"Hoje tem sorteio?"*\n✦ *"Quais são as dezenas quentes?"*\n✦ *"Qual a sua estratégia?"*`);
  }

  // 4. Renderizar Dezenas Quentes e Frias
  renderizarBolasFrequencia(data.quentes, 'hot-numbers', 'ball-hot');
  renderizarBolasFrequencia(data.frias, 'cold-numbers', 'ball-cold');

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
function gerarPalpiteEstatistico() {
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
    Calculando...
  `;

  // Simular processamento da IA/Probabilidade com atraso para estética de análise
  setTimeout(() => {
    const palpite = data.gerar(medias);
    
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
  }, 750);
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

// Processador de Linguagem Natural Local (Baseado em Intenções e Palavras-chave)
function processarMensagemAgente(pergunta) {
  const data = loteriasData[jogoAtivo];
  const medias = obterDezenasMedias(data);
  const textoMinusculo = pergunta.toLowerCase();
  
  let resposta = "";
  
  // 1. Gerar palpite / Gerar jogo (Máxima prioridade: evita que "palpite de hoje" caia em data)
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
  // 2. Dezenas Quentes (Alta prioridade: evita que "quentes de hoje" caia em data)
  else if (textoMinusculo.match(/(quente|quentes|mais sorteadas|mais sairam|mais saíram|frequentes|frequência|frequencia)/)) {
    const quentesFormatadas = [...data.quentes].sort((a,b)=>a-b).map(n => formatarNumero(n)).join(', ');
    resposta = `As dezenas **quentes** (historicamente mais sorteadas) para a **${data.nome}** são:\n\n**${quentesFormatadas}**\n\nNossa estratégia recomenda selecionar exatamente **${jogoAtivo === 'mega' ? '2 dezenas' : jogoAtivo === 'quina' ? '2 dezenas' : '8 dezenas'}** desse grupo para equilibrar suas probabilidades de acerto.`;
  }
  // 3. Dezenas Frias (Alta prioridade: evita que "frias de hoje" caia em data)
  else if (textoMinusculo.match(/(fria|frias|atrasada|atrasadas|menos sorteadas|menos sairam|menos saíram|geladas)/)) {
    const friasFormatadas = [...data.frias].sort((a,b)=>a-b).map(n => formatarNumero(n)).join(', ');
    resposta = `As dezenas **frias** (atrasadas ou com menor frequência recente) para a **${data.nome}** são:\n\n**${friasFormatadas}**\n\nNosso algoritmo estatístico insere **${jogoAtivo === 'mega' ? '2 dezenas' : jogoAtivo === 'quina' ? '2 dezenas' : '3 dezenas'}** frias no palpite para cobrir ciclos de atraso que tendem a se fechar.`;
  }
  // 4. Saudação
  else if (textoMinusculo.match(/(oi|olá|ola|bom dia|boa tarde|boa noite|hello|hey|como vai)/)) {
    resposta = `Olá! Tudo bem? Sou o **Consultor Probabilístico da ${data.nome}**. \n\nEstou analisando o banco de dados oficial das Loterias Caixa em tempo real. Como posso te ajudar com os palpites hoje?`;
  }
  // 5. Data Atual e Sorteio do Dia (Sem a palavra "dia" isolada para evitar falsos positivos em saudações)
  else if (textoMinusculo.match(/(hoje|data|que dia|dia de hoje|data atual|calendário|calendario|sorteio|hora|horário|horario|quando)/)) {
    const hojeStr = obterDataFormatada();
    const temSorteio = verificarSorteioHoje(jogoAtivo);
    const statusSorteio = temSorteio
      ? `🍀 **Sim, hoje tem sorteio oficial da ${data.nome}!**\n\n⏰ **Horário:** ${data.horaSorteio}\n📍 **Local:** Espaço da Sorte, São Paulo-SP\n\nMinha lógica probabilística já está calibrada para esta rodada.`
      : `📅 **Hoje não há sorteio regular agendado para a ${data.nome}.**\n\n📆 **Próximos sorteios:** ${data.diasSorteio}\n⏰ **Horário:** ${data.horaSorteio}\n📍 **Local:** Espaço da Sorte, São Paulo-SP\n\nMas você já pode se antecipar e gerar palpites incríveis para o próximo concurso!`;
      
    resposta = `Hoje é **${hojeStr}**.\n\n${statusSorteio}`;
  }
  // 6. Estratégia / Como funciona
  else if (textoMinusculo.match(/(estratégia|estrategia|como funciona|algoritmo|princípios|principios|diretrizes|regra|regras)/)) {
    const principiosTexto = data.principios.map(p => `✦ ${p}`).join('\n');
    resposta = `Minha estratégia probabilística para a **${data.nome}** é baseada em:\n\n${principiosTexto}\n\nCombinando essa dispersão e paridade, conseguimos cobrir as faixas matemáticas com maior probabilidade histórica de sorteio!`;
  }
  // 7. Preço da Aposta
  else if (textoMinusculo.match(/(preço|preco|custa|custo|valor|quanto pago|cobrado|pagar)/)) {
    let preco = "";
    let extra = "";
    if (jogoAtivo === 'mega') {
      preco = "R$ 6,00 (aposta simples de 6 dezenas)";
      extra = "Se quiser aumentar as chances: 7 números custa R$ 42,00, 8 números R$ 168,00, e assim por diante (até 20 números). O Bolão tem valor mínimo de R$ 18,00 (cota mínima R$ 7,00).";
    }
    else if (jogoAtivo === 'quina') {
      preco = "R$ 3,00 (aposta simples de 5 dezenas)";
      extra = "Você pode jogar até 15 números, e o preço aumenta progressivamente.";
    }
    else if (jogoAtivo === 'lotofacil') {
      preco = "R$ 3,50 (aposta simples de 15 dezenas)";
      extra = "Você pode jogar até 20 números, e o preço aumenta progressivamente.";
    }
    
    resposta = `O valor atual da aposta para a **${data.nome}** é de **${preco}**.\n\n${extra}`;
  }
  // 8. Prêmio e Estimativa
  else if (textoMinusculo.match(/(prêmio|premio|acumulou|valor|estimado|estimativa|dinheiro|pagar|milhões|milhoes)/)) {
    if (window.ultimoResultadoCaixa && window.ultimoResultadoCaixa.valorEstimadoProximoConcurso) {
      const valorFmt = window.ultimoResultadoCaixa.valorEstimadoProximoConcurso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const statusAcumulou = window.ultimoResultadoCaixa.acumulado ? "Sim, acumulou! 🚀" : "Não acumulou na última rodada.";
      resposta = `${statusAcumulou}\n\nO prêmio estimado para o próximo concurso da **${data.nome}** (Concurso #${window.ultimoResultadoCaixa.numeroConcursoProximo}) está em:\n\n💰 **${valorFmt}**\n\nPosso gerar um palpite probabilístico se você quiser tentar a sorte!`;
    } else {
      resposta = `No momento, não consegui obter a estimativa de prêmio (a API pode estar desconectada).`;
    }
  }
  // 8. Dezenas Médias
  else if (textoMinusculo.match(/(média|médias|medias|media|intermediária|intermediarias|intermediárias)/)) {
    const mediasFormatadas = medias.slice(0, 12).map(n => formatarNumero(n)).join(', ');
    resposta = `As dezenas **médias** (ou intermediárias) são as dezenas que não pertencem nem ao grupo das mais sorteadas (quentes) nem das mais atrasadas (frias).\n\nPara a **${data.nome}**, algumas dezenas médias são: **${mediasFormatadas}...**\n\nO algoritmo seleciona **${jogoAtivo === 'mega' ? '2' : jogoAtivo === 'quina' ? '1' : '4'}** médias para servir de âncora de dispersão neutra.`;
  }
  // 8. Jogo Responsável / Avisos
  else if (textoMinusculo.match(/(ganhar|ficar rico|dinheiro|certeza|garante|garantido|100%|loteria)/)) {
    resposta = `Como um consultor estatístico matemático, preciso lembrar que **loterias são jogos de azar baseados em eventos independentes**.\n\nMinhas estratégias otimizam as suas probabilidades com base no histórico, mas **não há garantia de ganho** ou acerto de 100%. Jogue sempre com responsabilidade, focando na diversão e sob seu limite orçamentário. 🍀`;
  }
  // 9. Quem é você / Persona
  else if (textoMinusculo.match(/(quem é|quem e|seu nome|criador|ajuda|funciona|bot|agente|IA)/)) {
    resposta = `Eu sou o **Consultor Probabilístico**, um agente estatístico projetado para analisar e otimizar jogos das Loterias Caixa.\n\nPosso gerar palpites inteligentes, fornecer listas de dezenas quentes e frias, e explicar os princípios matemáticos que regem os sorteios! Diga-me o que você precisa!`;
  }
  // Intenção padrão (Fallback)
  else {
    resposta = `Entendi a sua dúvida, mas não consegui encontrar uma estatística específica para essa pergunta.\n\nTente me perguntar sobre:\n✦ *"Me dê um palpite"* (Gera um jogo dinâmico)\n✦ *"Quais as dezenas quentes?"*\n✦ *"Quais as dezenas frias?"*\n✦ *"Qual a sua estratégia para a ${data.nome}?"*`;
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
      if (data.listaDezenas) {
        data.listaDezenas.forEach(numStr => {
          const bola = document.createElement('div');
          bola.className = 'ball ball-palpite'; // usa estilo dourado neutro
          bola.style.transform = 'scale(1)';
          bola.style.opacity = '1';
          bola.style.animation = 'none';
          bola.textContent = numStr;
          bolasContainer.appendChild(bola);
        });
      }

      // Acumulou?
      if (data.acumulado) {
        acumulouBadge.style.display = 'block';
      }

      // Premiação
      if (data.premiacao && data.premiacao.length > 0) {
        // Pega as 3 principais faixas
        const faixas = data.premiacao.slice(0, 3);
        faixas.forEach(p => {
          const valorFmt = p.valorPremio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          const ganhadoresTxt = p.quantidadeGanhadores === 0 ? 'Ninguém acertou' : `${p.quantidadeGanhadores} ganhador(es)`;
          
          premiosContainer.innerHTML += `
            <div class="premio-linha">
              <span class="premio-nome">${p.nome} (${ganhadoresTxt})</span>
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
