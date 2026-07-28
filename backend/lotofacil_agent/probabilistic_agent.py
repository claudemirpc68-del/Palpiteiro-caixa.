import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
from .feature_engineering import LotofacilFeatureEngineering, MOLDURA, MIOLO, PRIMES, FIBONACCI

# Top 10 Dezenas Quentes e Frias (Skill Especialista Lotofácil - 3745 concursos)
HOT_NUMBERS = {20, 10, 25, 11, 13, 24, 1, 14, 4, 5}
MEDIUM_NUMBERS = {2, 3, 12, 15, 22}
COLD_NUMBERS = {16, 8, 23, 17, 6, 7, 21, 19, 18, 9}

# Linhas do Volante
LINHAS = [
    set(range(1, 6)),    # Linha 1 (1-5)
    set(range(6, 11)),   # Linha 2 (6-10)
    set(range(11, 16)),  # Linha 3 (11-15)
    set(range(16, 21)),  # Linha 4 (16-20)
    set(range(21, 26))   # Linha 5 (21-25)
]

class LotofacilProbabilisticAgent:
    """
    Agente Probabilístico e Palpiteiro Inteligente para a Lotofácil.
    Combina a distribuição probabilística calculada pelos modelos de ML,
    frequência histórica acumulada e filtros estatísticos rigorosos.
    """
    def __init__(self, ml_pipeline=None):
        self.ml_pipeline = ml_pipeline
        self.feature_eng = LotofacilFeatureEngineering()
        
    def calculate_probability_distribution(
        self,
        df_binary: pd.DataFrame,
        freq_vec: np.ndarray,
        last_draw: List[int] = None,
        active_model: str = "RandomForest",
        parity_weight: float = 0.5,
        moldura_weight: float = 0.5
    ) -> Dict[str, Any]:
        """
        Calcula a distribuição probabilística final para as 25 dezenas (1 a 25).
        Suporta escolha do modelo ativo (RandomForest, NeuralNetwork_MLP, KMeans) e ajuste de pesos.
        """
        n_draws = len(df_binary)
        base_prob = freq_vec.copy()
        recent_window = df_binary.iloc[-10:].mean(axis=0).values if n_draws >= 10 else base_prob
        
        # Predição de ML baseada no modelo escolhido
        if self.ml_pipeline and self.ml_pipeline.is_trained and last_draw is not None:
            last_bin = LotofacilFeatureEngineering.dezenas_to_binary_vector(last_draw)
            X_in = last_bin.reshape(1, -1)
            
            if active_model == "NeuralNetwork_MLP" and self.ml_pipeline.mlp_model:
                mlp_p = self.ml_pipeline.mlp_model.predict_proba(X_in)
                ml_prob = np.array([p[0, 1] if p.shape[1] > 1 else 0.5 for p in mlp_p]) if isinstance(mlp_p, list) else mlp_p[0]
            elif active_model == "KMeans" and self.ml_pipeline.kmeans_model:
                # Usa centroide do cluster mais próximo
                cluster_id = self.ml_pipeline.kmeans_model.predict(X_in[:, :25])[0]
                cluster_centroid = self.ml_pipeline.kmeans_model.cluster_centers_[cluster_id][:25]
                ml_prob = np.clip(cluster_centroid, 0.05, 0.95)
            else:
                # Padrão: RandomForest
                rf_p = self.ml_pipeline.rf_model.predict_proba(X_in)
                ml_prob = np.array([p[0, 1] if p.shape[1] > 1 else 0.5 for p in rf_p]) if isinstance(rf_p, list) else rf_p[0]
        else:
            ml_prob = base_prob

        # Ajusta viés por pesos customizados de paridade e moldura
        bias = np.zeros(25)
        for i in range(25):
            num = i + 1
            if num % 2 == 0:
                bias[i] += (parity_weight - 0.5) * 0.1
            else:
                bias[i] += (0.5 - parity_weight) * 0.1
                
            if num in MOLDURA:
                bias[i] += (moldura_weight - 0.5) * 0.1
            else:
                bias[i] += (0.5 - moldura_weight) * 0.1

        # Fusão Probabilística Ponderada
        final_probs = (0.35 * base_prob) + (0.45 * ml_prob) + (0.20 * recent_window) + bias
        final_probs = np.clip(final_probs, 0.01, 0.99)
        final_probs = final_probs / final_probs.sum()  # Normaliza
        
        prob_dict = {
            f"dezena_{i+1:02d}": {
                'numero': i + 1,
                'probabilidade': round(float(final_probs[i]), 4),
                'percentual': round(float(final_probs[i] * 100), 2),
                'status': 'Quente' if (i+1) in HOT_NUMBERS else ('Fria' if (i+1) in COLD_NUMBERS else 'Média')
            }
            for i in range(25)
        }
        
        sorted_ranking = sorted(prob_dict.values(), key=lambda x: x['probabilidade'], reverse=True)
        
        return {
            'probabilities_vector': final_probs,
            'dezenas_ranking': sorted_ranking,
            'modelo_ativo': active_model
        }

    def validate_game_rules(self, dezenas: List[int], last_draw: List[int] = None) -> Tuple[bool, Dict[str, Any]]:
        """
        Valida se o palpite de 15 dezenas atende a todos os critérios e filtros da Skill Especialista:
        - Exact 15 dezenas
        - Paridade: 7 ímpares / 8 pares OU 8 ímpares / 7 pares
        - Moldura: 9 a 11 dezenas na moldura
        - Repetição: 8 a 10 dezenas repetidas do concurso anterior
        - Linhas: Todas as 5 linhas contêm pelo menos 1 dezena
        - Sequências: Sem sequências diretas >= 7 números
        """
        if len(dezenas) != 15:
            return False, {'motivo': 'Jogo deve conter exatamente 15 dezenas'}
            
        s_dezenas = set(dezenas)
        sorted_d = sorted(dezenas)
        
        # 1. Paridade (Pares/Ímpares)
        evens = sum(1 for d in sorted_d if d % 2 == 0)
        odds = 15 - evens
        valid_parity = (evens in [7, 8]) and (odds in [7, 8])
        
        # 2. Moldura x Miolo
        moldura_count = sum(1 for d in sorted_d if d in MOLDURA)
        valid_moldura = 9 <= moldura_count <= 11
        
        # 3. Repetição do Concurso Anterior (se disponível)
        valid_repetition = True
        rep_count = 0
        if last_draw:
            rep_count = len(s_dezenas.intersection(set(last_draw)))
            valid_repetition = (8 <= rep_count <= 10)
            
        # 4. Presença em todas as 5 linhas
        lines_covered = all(any(d in linha for d in sorted_d) for linha in LINHAS)
        
        # 5. Controle de Sequências consecutivas (< 7)
        max_seq = 1
        curr_seq = 1
        for i in range(1, len(sorted_d)):
            if sorted_d[i] == sorted_d[i-1] + 1:
                curr_seq += 1
                if curr_seq > max_seq:
                    max_seq = curr_seq
            else:
                curr_seq = 1
        valid_sequence = max_seq < 7
        
        # Distribuição Quentes / Médias / Frias
        n_hot = sum(1 for d in sorted_d if d in HOT_NUMBERS)
        n_med = sum(1 for d in sorted_d if d in MEDIUM_NUMBERS)
        n_cold = sum(1 for d in sorted_d if d in COLD_NUMBERS)
        
        is_approved = (
            valid_parity and 
            valid_moldura and 
            valid_repetition and 
            lines_covered and 
            valid_sequence
        )
        
        details = {
            'is_approved': is_approved,
            'evens': evens,
            'odds': odds,
            'moldura': moldura_count,
            'miolo': 15 - moldura_count,
            'repetition': rep_count,
            'max_sequence': max_seq,
            'lines_covered': lines_covered,
            'hot_count': n_hot,
            'medium_count': n_med,
            'cold_count': n_cold
        }
        
        return is_approved, details

    def generate_suggestions(
        self,
        prob_vec: np.ndarray,
        last_draw: List[int] = None,
        n_games: int = 5,
        max_attempts: int = 1000
    ) -> List[Dict[str, Any]]:
        """
        Gera n_games palpites de 15 dezenas com pontuação probabilística e aprovação nos filtros estatísticos.
        """
        suggestions = []
        attempts = 0
        p_dist = prob_vec / prob_vec.sum()
        
        np.random.seed(None)  # Garante sorteio aleatório renovável
        
        while len(suggestions) < n_games and attempts < max_attempts:
            attempts += 1
            
            # Sorteia 15 dezenas ponderadas pelas probabilidades dos modelos ML
            candidate = np.random.choice(np.arange(1, 26), size=15, replace=False, p=p_dist)
            candidate = sorted(list(map(int, candidate)))
            
            is_approved, details = self.validate_game_rules(candidate, last_draw)
            
            if is_approved or attempts > (max_attempts - 50):
                # Calcula Score Probabilístico do jogo (0 a 100)
                game_prob_sum = sum(p_dist[d - 1] for d in candidate)
                score = round(min(99.8, (game_prob_sum / 15.0) * 100 * 20.0), 1)
                
                # Evita jogos duplicados na lista de sugestões
                if not any(s['dezenas'] == candidate for s in suggestions):
                    suggestions.append({
                        'jogo_id': len(suggestions) + 1,
                        'dezenas': candidate,
                        'score_probabilidade': score,
                        'qualidade': 'Excepcional' if score >= 85 else 'Alta',
                        'metricas': details
                    })
                    
        return suggestions
