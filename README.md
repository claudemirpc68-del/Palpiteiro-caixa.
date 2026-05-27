# 🎰 Palpiteiro Jogos Caixa — Agente Probabilístico v2.0

> **Módulo de Análise Estatística para Loterias da Caixa Econômica Federal**

Uma aplicação web premium de análise probabilística que gera palpites inteligentes para as principais loterias da Caixa, combinando estatísticas históricas, algoritmos de balanceamento, um chatbot consultor interativo e **integração com resultados ao vivo da API da Caixa**.

---

## 📸 Preview

![Dashboard do Agente Probabilístico](./dashboard-agente-probabilistico.png)

---

## 🎯 Novidades da Versão 2.0

- 🔗 **API Integrada:** Busca os resultados oficiais e prêmios do último concurso ao vivo (via proxy FastAPI local).
- 💾 **Histórico Local:** Seus palpites gerados são salvos automaticamente no navegador (localStorage) para você não perder nenhuma combinação.
- 🔔 **Sistema de Toasts:** Notificações flutuantes elegantes e informativas.
- 🟢 **Status de Conexão:** Indicador em tempo real informando se você está online (recebendo dados reais da Caixa) ou em modo offline estatístico.

## 🎯 Funcionalidades

### 🎲 Loterias Suportadas
| Loteria | Dezenas | Universo | Dias de Sorteio |
|---|---|---|---|
| **Mega-Sena** | 6 | 1 a 60 | Terças, Quintas e Sábados |
| **Quina** | 5 | 1 a 80 | Segunda a Sábado |
| **Lotofácil** | 15 | 1 a 25 | Segunda a Sábado |

### 🤖 Chatbot Consultor Probabilístico
- **Linguagem Natural Local** — Responde a perguntas em português sem necessidade de API externa
- **Intenções reconhecidas:**
  - Geração de palpites via chat (`"me dê um palpite"`, `"gerar jogo"`, etc.)
  - Consulta de dezenas quentes e frias
  - Informações de sorteio do dia
  - Estratégias e princípios do algoritmo
  - Dezenas médias/intermediárias
  - Avisos de jogo responsável
- **Indicador de digitação animado** — Simula tempo de "raciocínio" do agente
- **Formatação rich** — Suporte a **negrito**, *itálico* e emojis nas respostas

### 📊 Análise e Estatísticas
- **Último Sorteio Oficial** — Dezenas, valores arrecadados, prêmios e se o jogo "ACUMULOU" (atualizado em tempo real).
- **Dezenas Quentes** — As mais sorteadas historicamente.
- **Dezenas Frias** — As mais atrasadas ou com menor frequência recente.
- Exibição em esferas 3D estilizadas com cores distintas por categoria.

### ⚡ Gerador de Palpites Estatísticos
- Algoritmo de geração com **até 5.000 tentativas** por rodada para garantir convergência
- Validação multicritério antes de aceitar um palpite:
  - ✅ Composição (quentes + médias + frias) conforme proporção
  - ✅ Paridade (equilíbrio pares/ímpares)
  - ✅ Distribuição por faixas numéricas (baixas/altas)
- Animação de bolas surgindo **uma a uma** com delay escalonado
- **Cópia para área de transferência** com feedback visual premium e botões de **Exportar Histórico**.

---

## 🏗️ Arquitetura do Projeto

```
PALPITEIRO JOGOS CAIXA/
│
├── index.html                  # Estrutura HTML principal (SPA)
├── style.css                   # Estilos premium com glassmorphism e animações
├── app.js                      # Lógica de interface, chatbot, histórico e chamadas à API
│
├── backend/                    # Módulo Python (FastAPI) para proxy da API Caixa
│   ├── main.py                 # Servidor de API local e controle de Cache
│   ├── requirements.txt        # Dependências do Python
│   └── .env.example            # Template de variáveis de ambiente
│
└── dashboard-agente-probabilistico.png   # Imagem de fundo do painel visual
```

---

## 💻 Tecnologias

| Tecnologia | Finalidade |
|---|---|
| **HTML5 / CSS3 / JS Vanilla** | Front-end rápido, sem frameworks, com Glassmorphism. |
| **Python 3 / FastAPI** | Back-end rápido para gerenciar as requisições CORS e cache. |
| **LocalStorage** | Armazenamento persistente no navegador para histórico de palpites. |
| **Google Fonts (Outfit)** | Tipografia premium moderna. |

---

## 🚀 Como Executar o Projeto com Dados ao Vivo

Para ter acesso aos **resultados mais recentes da Caixa Econômica Federal**, o projeto agora utiliza um pequeno servidor Backend em Python. Siga os passos:

### Passo 1: Inicializando o Backend (Proxy da API)
1. Certifique-se de ter o **Python** instalado na sua máquina.
2. Abra o terminal na pasta `backend` do projeto:
   ```bash
   cd "PALPITEIRO JOGOS CAIXA/backend"
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Execute o servidor:
   ```bash
   python -m uvicorn main:app --reload
   ```
   *O terminal informará que a API está rodando em `http://localhost:8000` ou `http://0.0.0.0:8000`.*

### Passo 2: Acessando o Aplicativo (Frontend)
1. Simplesmente abra o arquivo `index.html` em seu navegador favorito.
2. Pronto! O sistema já detectará o backend rodando e mostrará "API Conectada" no rodapé.

> 💡 **Modo Offline:** Se você não quiser (ou não puder) rodar o backend em Python, **não tem problema!** Basta abrir o arquivo `index.html` normalmente. O aplicativo detectará que a API está ausente e entrará em "Modo Offline (Estatístico)", mantendo a geração de palpites, histórico e cálculos estatísticos 100% funcionais!

---

## ⚠️ Aviso Legal

> Este projeto é desenvolvido **exclusivamente para fins de entretenimento e análise estatística educacional**.
> Loterias são jogos de azar baseados em eventos aleatórios e independentes.
> **Não há qualquer garantia de ganho ou acerto.**
> Jogue com responsabilidade e dentro dos seus limites financeiros.

---

## 📄 Licença

© 2026 Agente Probabilístico Caixa v2.0. Todos os direitos reservados.
