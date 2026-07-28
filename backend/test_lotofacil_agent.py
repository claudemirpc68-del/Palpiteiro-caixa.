import sys
import os

# Adiciona o diretório atual ao PYTHONPATH e configura UTF-8 no terminal Windows
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from lotofacil_agent.manager import lotofacil_manager

def test_pipeline():
    print("="*60)
    print("[TEST] INICIANDO TESTE COMPLETO DO LOTOFACIL_AGENT")
    print("="*60)
    
    # 1. Teste de Inicialização e ML Pipeline
    lotofacil_manager.initialize()
    
    print("\n[ML] 1. METRICAS DE MACHINE LEARNING:")
    ml_metrics = lotofacil_manager.get_ml_metrics()
    print(f"   - Split: {ml_metrics['split']}")
    print(f"   - Amostras Treino: {ml_metrics['train_samples']} | Teste: {ml_metrics['test_samples']}")
    print(f"   - Rede Neural MLP Accuracy: {ml_metrics['mlp_neural_network']['accuracy']} | ROC-AUC: {ml_metrics['mlp_neural_network']['roc_auc']}")
    print(f"   - RandomForest Accuracy: {ml_metrics['random_forest']['accuracy']} | F1-Score: {ml_metrics['random_forest']['f1_score']}")
    print(f"   - KMeans Clusters: {len(ml_metrics['kmeans']['cluster_profiles'])} perfis gerados")

    # 2. Teste de Estatísticas e Heatmaps
    print("\n[STATS] 2. ESTATISTICAS E MAPAS DE CALOR:")
    full_stats = lotofacil_manager.get_full_stats()
    print(f"   - Ultimo Concurso: {full_stats['ultimo_concurso']}")
    print(f"   - Dezenas Sorteadas: {full_stats['dezenas_ultimo_concurso']}")
    top3_quentes = full_stats['probabilidades_dezenas'][:3]
    print(f"   - Top 3 Dezenas Provaveis: {[d['numero'] for d in top3_quentes]}")

    # 3. Geração de Palpites Probabilísticos
    print("\n[PALPITES] 3. PALPITES GERADOS PELO AGENTE:")
    palpites_res = lotofacil_manager.generate_palpites(n_games=3)
    for p in palpites_res['palpites']:
        print(f"\n   -> JOGO #{p['jogo_id']} [Score IA: {p['score_probabilidade']}% - {p['qualidade']}]:")
        print(f"      Dezenas ({len(p['dezenas'])}): {p['dezenas']}")
        m = p['metricas']
        print(f"      Metricas: Pares/Impares: {m['evens']}/{m['odds']} | Moldura: {m['moldura']} | Repetidas: {m['repetition']} | Maior Seq: {m['max_sequence']}")

    print("\n" + "="*60)
    print("[SUCCESS] TESTE DO LOTOFACIL_AGENT CONCLUIDO COM SUCESSO!")
    print("="*60)

if __name__ == '__main__':
    test_pipeline()
