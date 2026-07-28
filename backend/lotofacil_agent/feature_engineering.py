import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple

# Conjuntos fixos da Lotofácil
MOLDURA = {1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25}
MIOLO = {7, 8, 9, 12, 13, 14, 17, 18, 19}
PRIMES = {2, 3, 5, 7, 11, 13, 17, 19, 23}
FIBONACCI = {1, 2, 3, 5, 8, 13, 21}

class LotofacilFeatureEngineering:
    """
    Engenharia de Recursos (Features) avançada para a Lotofácil.
    Calcula os 9 grupos de features exigidos pelo agente probabilístico.
    """
    def __init__(self):
        pass

    @staticmethod
    def dezenas_to_binary_vector(dezenas: List[int]) -> np.ndarray:
        """
        Converte uma lista de dezenas em um vetor binário de 25 posições (0 ou 1).
        """
        vec = np.zeros(25, dtype=int)
        for d in dezenas:
            if 1 <= d <= 25:
                vec[d - 1] = 1
        return vec

    @staticmethod
    def extract_draw_features(dezenas: List[int], prev_dezenas: List[int] = None) -> Dict[str, Any]:
        """
        Extrai todas as 9 métricas numéricas de um único concurso de dezenas.
        """
        set_dezenas = set(dezenas)
        sorted_dezenas = sorted(list(set_dezenas))
        
        # 1. Vetor Binário (25 posições)
        binary_vec = LotofacilFeatureEngineering.dezenas_to_binary_vector(sorted_dezenas)
        
        # 3. Pares vs Ímpares
        n_evens = sum(1 for d in sorted_dezenas if d % 2 == 0)
        n_odds = len(sorted_dezenas) - n_evens
        
        # 4. Moldura vs Miolo
        n_moldura = sum(1 for d in sorted_dezenas if d in MOLDURA)
        n_miolo = sum(1 for d in sorted_dezenas if d in MIOLO)
        
        # 5. Soma Total das Dezenas
        total_sum = sum(sorted_dezenas)
        
        # 6. Consecutivos (Maior Sequência Direta)
        max_seq = 1
        curr_seq = 1
        for i in range(1, len(sorted_dezenas)):
            if sorted_dezenas[i] == sorted_dezenas[i - 1] + 1:
                curr_seq += 1
                if curr_seq > max_seq:
                    max_seq = curr_seq
            else:
                curr_seq = 1
                
        # 7. Números Primos
        n_primes = sum(1 for d in sorted_dezenas if d in PRIMES)
        
        # 8. Números de Fibonacci
        n_fibonacci = sum(1 for d in sorted_dezenas if d in FIBONACCI)
        
        # 9. Repetição do Concurso Anterior
        n_repetition = 0
        if prev_dezenas:
            n_repetition = len(set_dezenas.intersection(set(prev_dezenas)))
            
        return {
            'binary_vector': binary_vec.tolist(),
            'n_evens': n_evens,
            'n_odds': n_odds,
            'n_moldura': n_moldura,
            'n_miolo': n_miolo,
            'sum_of_numbers': total_sum,
            'max_consecutives': max_seq,
            'n_primes': n_primes,
            'n_fibonacci': n_fibonacci,
            'repetition_previous': n_repetition
        }

    def build_feature_dataframe(self, df_history: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Transforma o DataFrame histórico em duas matrizes de features:
        1. X_binary: Matriz (N x 25) contendo a presença/ausência de cada dezena.
        2. X_engineered: Matriz (N x K) contendo os indicadores estatísticos detalhados.
        """
        binary_matrix = []
        engineered_matrix = []
        
        dezenas_list = df_history['dezenas'].tolist()
        
        for idx, dezenas in enumerate(dezenas_list):
            prev_dezenas = dezenas_list[idx - 1] if idx > 0 else None
            feats = self.extract_draw_features(dezenas, prev_dezenas)
            
            binary_matrix.append(feats['binary_vector'])
            
            engineered_matrix.append([
                feats['n_evens'],
                feats['n_odds'],
                feats['n_moldura'],
                feats['n_miolo'],
                feats['sum_of_numbers'],
                feats['max_consecutives'],
                feats['n_primes'],
                feats['n_fibonacci'],
                feats['repetition_previous']
            ])
            
        # Colunas Binárias (b1..b25)
        bin_cols = [f'b_{i}' for i in range(1, 26)]
        df_binary = pd.DataFrame(binary_matrix, columns=bin_cols)
        
        # Colunas Engenheiradas
        eng_cols = [
            'n_evens', 'n_odds', 'n_moldura', 'n_miolo',
            'sum_of_numbers', 'max_consecutives', 'n_primes',
            'n_fibonacci', 'repetition_previous'
        ]
        df_engineered = pd.DataFrame(engineered_matrix, columns=eng_cols)
        
        # Calcula frequências históricas acumuladas
        freq_vec = df_binary.mean(axis=0).values
        
        return df_binary, df_engineered, freq_vec
