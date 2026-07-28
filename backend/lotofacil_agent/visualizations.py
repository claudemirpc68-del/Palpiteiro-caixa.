import numpy as np
import pandas as pd
from typing import Dict, Any, List

class LotofacilVisualizations:
    """
    Gerador de dados estruturados para estatísticas, mapas de calor (heatmaps),
    matrizes de correlação e perfis de clusters para consumo do Frontend visual.
    """
    def __init__(self):
        pass

    @staticmethod
    def generate_heatmap_data(df_binary: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera matriz de calor de frequência para o volante 5x5 (Dezenas 1 a 25)
        e a matriz de correlação de co-ocorrência entre dezenas.
        """
        # 1. Frequências Absolutas e Relativas das 25 Dezenas
        freq_abs = df_binary.sum(axis=0).values.tolist()
        n_draws = len(df_binary)
        freq_pct = [(val / n_draws) * 100 for val in freq_abs]
        
        # Grade 5x5 do Volante (Linhas 1-5, Colunas 1-5)
        grid_5x5 = []
        for r in range(5):
            row_data = []
            for c in range(5):
                num = r * 5 + c + 1
                row_data.append({
                    'numero': num,
                    'frequencia_abs': freq_abs[num - 1],
                    'frequencia_pct': round(freq_pct[num - 1], 2),
                    'intensidade': round(freq_pct[num - 1] / max(freq_pct), 2)
                })
            grid_5x5.append(row_data)

        # 2. Matriz de Correlação Top Co-ocorrências
        corr_matrix = df_binary.corr().values
        top_pairs = []
        for i in range(25):
            for j in range(i + 1, 25):
                top_pairs.append({
                    'dezena1': i + 1,
                    'dezena2': j + 1,
                    'correlacao': round(float(corr_matrix[i, j]), 4)
                })
        top_pairs = sorted(top_pairs, key=lambda x: x['correlacao'], reverse=True)[:10]

        return {
            'total_concursos_analisados': n_draws,
            'grid_5x5': grid_5x5,
            'top_duplas_correlacionadas': top_pairs
        }

    @staticmethod
    def generate_statistics_summary(df_engineered: pd.DataFrame) -> Dict[str, Any]:
        """
        Gera histogramas e métricas resumidas de Paridade, Moldura, Soma e Repetição.
        """
        n = len(df_engineered)
        
        # Distribuição de Paridade (Ímpares / Pares)
        parity_dist = df_engineered['n_odds'].value_counts().to_dict()
        parity_formatted = {
            f"{odds} Ímpares / {15-odds} Pares": {
                'quantidade': int(count),
                'percentual': round((count / n) * 100, 2)
            }
            for odds, count in sorted(parity_dist.items())
        }
        
        # Distribuição de Moldura
        moldura_dist = df_engineered['n_moldura'].value_counts().to_dict()
        moldura_formatted = {
            f"{m} na Moldura / {15-m} no Miolo": {
                'quantidade': int(count),
                'percentual': round((count / n) * 100, 2)
            }
            for m, count in sorted(moldura_dist.items())
        }
        
        # Estatísticas da Soma Total
        sum_stats = {
            'min': int(df_engineered['sum_of_numbers'].min()),
            'max': int(df_engineered['sum_of_numbers'].max()),
            'media': round(float(df_engineered['sum_of_numbers'].mean()), 1),
            'mediana': round(float(df_engineered['sum_of_numbers'].median()), 1),
            'faixa_ideal': '180 a 210'
        }
        
        # Estatísticas de Repetição do Concurso Anterior
        rep_dist = df_engineered['repetition_previous'].value_counts().to_dict()
        rep_formatted = {
            f"{rep} Repetidas": {
                'quantidade': int(count),
                'percentual': round((count / n) * 100, 2)
            }
            for rep, count in sorted(rep_dist.items()) if rep > 0
        }

        return {
            'paridade': parity_formatted,
            'moldura_miolo': moldura_formatted,
            'soma_dezenas': sum_stats,
            'repeticao_anterior': rep_formatted
        }
