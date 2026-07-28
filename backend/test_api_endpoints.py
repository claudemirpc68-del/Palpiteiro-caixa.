import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from main import app

client = TestClient(app)

def test_lotofacil_stats_endpoint():
    print("\n[API TEST] Testando GET /api/lotofacil/stats...")
    response = client.get("/api/lotofacil/stats")
    if response.status_code != 200:
        print(f"Erro {response.status_code}: {response.text}")
    assert response.status_code == 200
    data = response.json()
    assert "heatmaps" in data
    assert "estatisticas_globais" in data
    assert "probabilidades_dezenas" in data
    print("[SUCCESS] GET /api/lotofacil/stats retornou 200 OK com estatisticas e heatmaps!")

def test_lotofacil_ml_metrics_endpoint():
    print("\n[API TEST] Testando GET /api/lotofacil/ml-metrics...")
    response = client.get("/api/lotofacil/ml-metrics")
    if response.status_code != 200:
        print(f"Erro {response.status_code}: {response.text}")
    assert response.status_code == 200
    data = response.json()
    assert "split" in data
    assert "mlp_neural_network" in data
    assert "random_forest" in data
    assert "kmeans" in data
    print("[SUCCESS] GET /api/lotofacil/ml-metrics retornou 200 OK com metricas do ML Pipeline!")

def test_lotofacil_generate_palpites_endpoint():
    print("\n[API TEST] Testando GET /api/lotofacil/generate-palpites...")
    response = client.get("/api/lotofacil/generate-palpites?n_games=3")
    if response.status_code != 200:
        print(f"Erro {response.status_code}: {response.text}")
    assert response.status_code == 200
    data = response.json()
    assert "palpites" in data
    assert len(data["palpites"]) == 3
    print("[SUCCESS] GET /api/lotofacil/generate-palpites retornou 200 OK com 3 jogos sugeridos!")

def test_lotofacil_custom_palpites_endpoint():
    print("\n[API TEST] Testando POST /api/lotofacil/generate-custom...")
    response = client.post("/api/lotofacil/generate-custom?n_games=2&active_model=NeuralNetwork_MLP&parity_weight=0.7&moldura_weight=0.6")
    if response.status_code != 200:
        print(f"Erro {response.status_code}: {response.text}")
    assert response.status_code == 200
    data = response.json()
    assert "palpites" in data
    assert data["modelo_ativo"] == "NeuralNetwork_MLP"
    print("[SUCCESS] POST /api/lotofacil/generate-custom retornou 200 OK com modelo NeuralNetwork_MLP!")

def test_lotofacil_update_dataset_endpoint():
    print("\n[API TEST] Testando POST /api/lotofacil/update-dataset...")
    response = client.post("/api/lotofacil/update-dataset")
    if response.status_code != 200:
        print(f"Erro {response.status_code}: {response.text}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    print("[SUCCESS] POST /api/lotofacil/update-dataset retornou 200 OK!")

if __name__ == "__main__":
    test_lotofacil_stats_endpoint()
    test_lotofacil_ml_metrics_endpoint()
    test_lotofacil_generate_palpites_endpoint()
    test_lotofacil_custom_palpites_endpoint()
    test_lotofacil_update_dataset_endpoint()
    print("\n[SUCCESS] TODOS OS ENDPOINTS DO LOTOFACIL_AGENT FORAM TESTADOS E APROVADOS!")

