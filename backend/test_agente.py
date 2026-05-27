import requests
import json

def testar_agente():
    print("="*50)
    print("🧪 INICIANDO TESTE DO AGENTE (BACKEND API)")
    print("="*50)
    
    url = "http://127.0.0.1:8000/api/resultados/mega"
    print(f"\n[1] Tentando conectar à API Local em: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ SUCESSO! Conexão estabelecida com a API da Caixa via proxy.")
            print("\n📊 DADOS DO ÚLTIMO SORTEIO (Mega-Sena):")
            print(f"   - Concurso: {data.get('numero')}")
            print(f"   - Data: {data.get('dataApuracao')}")
            print(f"   - Dezenas Sorteadas: {', '.join(data.get('listaDezenas', []))}")
            
            valor_acumulado = data.get('valorAcumuladoProximoConcurso', 0)
            if data.get('acumulado'):
                print(f"   - Status: ACUMULOU! (R$ {valor_acumulado:,.2f})".replace(",", "X").replace(".", ",").replace("X", "."))
            else:
                print("   - Status: Houve ganhador(es)!")
                
            print("\n[2] Testando Cache...")
            # Fazemos uma segunda requisição para ver o tempo de resposta (deve ser instantâneo)
            import time
            inicio = time.time()
            requests.get(url)
            fim = time.time()
            print(f"✅ Cache funcional! Tempo de resposta da segunda chamada: {(fim - inicio)*1000:.2f} ms")
            
        else:
            print(f"\n❌ ERRO NA API! Código de retorno: {response.status_code}")
            print("Detalhes:", response.text)
            
    except requests.exceptions.ConnectionError:
        print("\n❌ ERRO DE CONEXÃO: O servidor backend não está respondendo.")
        print("Certifique-se de que o Uvicorn está rodando na porta 8000.")
    except Exception as e:
        print(f"\n❌ ERRO INESPERADO: {e}")
        
    print("\n" + "="*50)

if __name__ == "__main__":
    testar_agente()
