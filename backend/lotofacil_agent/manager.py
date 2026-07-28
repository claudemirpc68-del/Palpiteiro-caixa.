import time
from typing import Dict, Any, List, Optional
from .data_loader import LotofacilDataLoader
from .feature_engineering import LotofacilFeatureEngineering
from .ml_pipeline import LotofacilMLPipeline
from .probabilistic_agent import LotofacilProbabilisticAgent
from .visualizations import LotofacilVisualizations

class LotofacilAgentManager:
    """
    Orquestrador principal do Lotofacil_Agent.
    Carrega o histórico, executa o treinamento dos modelos de Machine Learning,
    mantém a inteligência probabilística pronta para atender às requisições da API.
    """
    _instance = None
    
    def __init__(self):
        self.data_loader = LotofacilDataLoader()
        self.feature_eng = LotofacilFeatureEngineering()
        self.ml_pipeline = LotofacilMLPipeline(n_clusters=4)
        self.agent = LotofacilProbabilisticAgent(ml_pipeline=self.ml_pipeline)
        self.visualizations = LotofacilVisualizations()
        
        self.df_history = None
        self.df_binary = None
        self.df_engineered = None
        self.freq_vec = None
        self.last_draw = None
        self.initialized = False
        
    def initialize(self, force_reload: bool = False):
        """Inicializa dados e realiza treinamento dos modelos (KMeans, RF, MLP)."""
        if self.initialized and not force_reload:
            return
            
        print("[Lotofacil_Agent] Inicializando pipeline e carregando historico...")
        self.df_history = self.data_loader.load_data()
        self.df_binary, self.df_engineered, self.freq_vec = self.feature_eng.build_feature_dataframe(self.df_history)
        
        self.last_draw = self.df_history.iloc[-1]['dezenas']
        
        print("[Lotofacil_Agent] Treinando modelos ML (KMeans, RandomForest, NeuralNetwork MLP)...")
        t0 = time.time()
        self.ml_pipeline.train_and_evaluate(self.df_binary, self.df_engineered)
        print(f"[Lotofacil_Agent] Treinamento concluido em {time.time() - t0:.2f}s!")
        
        self.initialized = True

    def get_full_stats(self) -> Dict[str, Any]:

        self.initialize()
        heatmap_data = self.visualizations.generate_heatmap_data(self.df_binary)
        stats_summary = self.visualizations.generate_statistics_summary(self.df_engineered)
        prob_data = self.agent.calculate_probability_distribution(self.df_binary, self.freq_vec, self.last_draw)
        
        return {
            'ultimo_concurso': int(self.df_history.iloc[-1]['concurso']),
            'dezenas_ultimo_concurso': self.last_draw,
            'estatisticas_globais': stats_summary,
            'heatmaps': heatmap_data,
            'probabilidades_dezenas': prob_data['dezenas_ranking']
        }

    def get_ml_metrics(self) -> Dict[str, Any]:
        self.initialize()
        return self.ml_pipeline.metrics

    def generate_palpites(
        self,
        n_games: int = 5,
        active_model: str = "RandomForest",
        parity_weight: float = 0.5,
        moldura_weight: float = 0.5
    ) -> Dict[str, Any]:
        self.initialize()
        prob_data = self.agent.calculate_probability_distribution(
            df_binary=self.df_binary,
            freq_vec=self.freq_vec,
            last_draw=self.last_draw,
            active_model=active_model,
            parity_weight=parity_weight,
            moldura_weight=moldura_weight
        )
        suggestions = self.agent.generate_suggestions(
            prob_vec=prob_data['probabilities_vector'],
            last_draw=self.last_draw,
            n_games=n_games
        )
        return {
            'ultimo_concurso': int(self.df_history.iloc[-1]['concurso']),
            'modelo_ativo': active_model,
            'pesos': {
                'paridade': parity_weight,
                'moldura': moldura_weight
            },
            'estrategia': f'Probabilística + ML ({active_model})',
            'total_palpites': len(suggestions),
            'palpites': suggestions
        }

    def reload_dataset(self) -> Dict[str, Any]:
        self.initialize(force_reload=True)
        return {
            'status': 'success',
            'message': 'Base de dados e modelos recarregados com sucesso!',
            'total_concursos': len(self.df_history),
            'ultimo_concurso': int(self.df_history.iloc[-1]['concurso'])
        }

# Instância Singleton global
lotofacil_manager = LotofacilAgentManager()
