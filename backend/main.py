import os
import time
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

app = FastAPI(title="Proxy API - Palpiteiro Jogos Caixa")

# Configuração de CORS para permitir requisições do frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique a URL do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URLs base
CAIXA_API_URL = "https://servicebus2.caixa.gov.br/portaldeloterias/api"
NEWS_API_URL = "https://newsapi.org/v2/everything"
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# Cache simples em memória
CACHE_TTL = 7200  # 2 horas em segundos
cache: Dict[str, Dict[str, Any]] = {}

def get_from_cache(key: str) -> Optional[Any]:
    if key in cache:
        item = cache[key]
        if time.time() - item["timestamp"] < CACHE_TTL:
            return item["data"]
    return None

def set_in_cache(key: str, data: Any):
    cache[key] = {
        "timestamp": time.time(),
        "data": data
    }

import subprocess

# Mapeamento de nomes de loterias do frontend para a API da Caixa
LOTERIAS_MAP = {
    "mega": "megasena",
    "quina": "quina",
    "lotofacil": "lotofacil"
}

@app.get("/api/test-curl")
def test_curl():
    try:
        url = "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena"
        result = subprocess.run(
            ["curl", "-k", "-s", "-i", "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", url],
            capture_output=True,
            text=True,
            timeout=10
        )
        return {
            "stdout": result.stdout[:2000],
            "stderr": result.stderr,
            "returncode": result.returncode
        }
    except Exception as e:
        return {"error": str(e)}


@app.get("/api/resultados/{jogo}")
def obter_ultimo_resultado(jogo: str):
    """Busca o último resultado oficial da Caixa para a loteria especificada"""
    jogo_api = LOTERIAS_MAP.get(jogo, jogo)
    
    # Verifica cache
    cache_key = f"resultado_{jogo_api}_ultimo"
    cached_data = get_from_cache(cache_key)
    if cached_data:
        return cached_data

    url = f"{CAIXA_API_URL}/{jogo_api}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, verify=False, timeout=10) # verify=False contorna alguns problemas de SSL da Caixa
        response.raise_for_status()
        data = response.json()
        
        # Salva no cache
        set_in_cache(cache_key, data)
        return data
    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar API da Caixa: {e}")
        raise HTTPException(status_code=503, detail="Serviço de resultados indisponível")

@app.get("/api/resultados/{jogo}/{concurso}")
def obter_resultado_concurso(jogo: str, concurso: int):
    """Busca um concurso específico"""
    jogo_api = LOTERIAS_MAP.get(jogo, jogo)
    
    cache_key = f"resultado_{jogo_api}_{concurso}"
    cached_data = get_from_cache(cache_key)
    if cached_data:
        return cached_data

    url = f"{CAIXA_API_URL}/{jogo_api}/{concurso}"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(url, headers=headers, verify=False, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Cache permanente para concursos passados
        cache[cache_key] = {"timestamp": time.time() + 999999999, "data": data}
        return data
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=404, detail="Concurso não encontrado ou serviço indisponível")

@app.get("/api/noticias/{jogo}")
def obter_noticias(jogo: str):
    """Busca notícias recentes sobre a loteria (requer NEWS_API_KEY)"""
    if not NEWS_API_KEY or NEWS_API_KEY == "sua_chave_aqui":
        return {"status": "disabled", "articles": []}

    nome_formatado = "Mega-Sena" if jogo == "mega" else jogo.capitalize()
    
    cache_key = f"noticias_{jogo}"
    cached_data = get_from_cache(cache_key)
    if cached_data:
        return cached_data

    query = f"Loterias Caixa {nome_formatado}"
    params = {
        "q": query,
        "apiKey": NEWS_API_KEY,
        "language": "pt",
        "sortBy": "publishedAt",
        "pageSize": 5
    }

    try:
        response = requests.get(NEWS_API_URL, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        set_in_cache(cache_key, data)
        return data
    except requests.exceptions.RequestException:
        # Fallback silencioso em caso de erro na API de notícias
        return {"status": "error", "articles": []}

from fastapi.staticfiles import StaticFiles

# Servir a pasta raiz do projeto como estática na raiz (/) da API
app.mount("/", StaticFiles(directory="../", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
