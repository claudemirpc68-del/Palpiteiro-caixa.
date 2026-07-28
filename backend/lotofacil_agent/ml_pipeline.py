import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, List
from sklearn.model_selection import train_test_split
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

class LotofacilMLPipeline:
    """
    Pipeline de Machine Learning para a Lotofácil.
    Executa Preprocessamento, Divisão Train/Test (80/20), Treinamento do KMeans,
    RandomForestClassifier e Redes Neurais MLP.
    """
    def __init__(self, n_clusters: int = 4, random_state: int = 42):
        self.n_clusters = n_clusters
        self.random_state = random_state
        
        self.kmeans_model: KMeans = None
        self.rf_model: RandomForestClassifier = None
        self.mlp_model: MLPClassifier = None
        
        self.is_trained = False
        self.metrics: Dict[str, Any] = {}

    def prepare_dataset(self, df_binary: pd.DataFrame, window_size: int = 1) -> Tuple[np.ndarray, np.ndarray]:
        """
        Cria o dataset de aprendizado supervisionado (X_t-1 -> Y_t).
        Prever o vetor binário do próximo concurso baseado no concurso anterior.
        """
        X = df_binary.values[:-window_size]
        Y = df_binary.values[window_size:]
        return X, Y

    def train_and_evaluate(self, df_binary: pd.DataFrame, df_engineered: pd.DataFrame) -> Dict[str, Any]:
        """
        Treina e avalia os 3 modelos de ML (KMeans, RandomForest e MLP).
        Split de Validação: 80% treino / 20% teste.
        """
        # 1. KMeans Clustering sobre as features estruturais
        combined_features = pd.concat([df_binary, df_engineered], axis=1).values
        self.kmeans_model = KMeans(n_clusters=self.n_clusters, random_state=self.random_state, n_init=10)
        cluster_labels = self.kmeans_model.fit_predict(combined_features)
        
        # Perfil dos Clusters (Resumo estrutural de cada grupo)
        cluster_profiles = []
        for c in range(self.n_clusters):
            mask = (cluster_labels == c)
            c_eng = df_engineered[mask]
            cluster_profiles.append({
                'cluster_id': c,
                'count': int(mask.sum()),
                'pct': float(mask.mean() * 100),
                'avg_evens': float(c_eng['n_evens'].mean()),
                'avg_moldura': float(c_eng['n_moldura'].mean()),
                'avg_sum': float(c_eng['sum_of_numbers'].mean()),
                'avg_primes': float(c_eng['n_primes'].mean()),
                'avg_repetition': float(c_eng['repetition_previous'].mean())
            })

        # 2. Preparação Supervisada (80/20 Split)
        X, Y = self.prepare_dataset(df_binary)
        X_train, X_test, Y_train, Y_test = train_test_split(
            X, Y, test_size=0.20, random_state=self.random_state, shuffle=False
        )

        # 3. Treinamento da Rede Neural (NeuralNetwork MLP)
        self.mlp_model = MLPClassifier(
            hidden_layer_sizes=(128, 64),
            activation='relu',
            max_iter=300,
            random_state=self.random_state,
            early_stopping=True
        )
        self.mlp_model.fit(X_train, Y_train)
        
        # Avaliação da Rede Neural no Test Set (20%)
        mlp_preds = self.mlp_model.predict(X_test)
        mlp_probs = self.mlp_model.predict_proba(X_test)
        
        # Converte lista de probabilidades para matriz N x 25
        if isinstance(mlp_probs, list):
            mlp_probs_matrix = np.column_stack([p[:, 1] if p.shape[1] > 1 else np.zeros(len(p)) for p in mlp_probs])
        else:
            mlp_probs_matrix = mlp_probs

        mlp_acc = float(accuracy_score(Y_test.flatten(), mlp_preds.flatten()))
        mlp_f1 = float(f1_score(Y_test.flatten(), mlp_preds.flatten(), average='macro'))
        
        try:
            mlp_roc = float(roc_auc_score(Y_test.flatten(), mlp_probs_matrix.flatten()))
        except Exception:
            mlp_roc = 0.5

        # 4. Treinamento do RandomForestClassifier
        self.rf_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=8,
            random_state=self.random_state,
            n_jobs=-1
        )
        self.rf_model.fit(X_train, Y_train)
        
        rf_preds = self.rf_model.predict(X_test)
        rf_acc = float(accuracy_score(Y_test.flatten(), rf_preds.flatten()))
        rf_f1 = float(f1_score(Y_test.flatten(), rf_preds.flatten(), average='macro'))

        # Importância relativa das dezenas no RandomForest
        feature_importances = self.rf_model.feature_importances_
        if len(feature_importances) == 25:
            rf_importances = {f"dezena_{i+1}": float(feature_importances[i]) for i in range(25)}
        else:
            rf_importances = {f"dezena_{i+1}": float(1.0/25) for i in range(25)}

        self.is_trained = True
        
        self.metrics = {
            'split': 'train_test_split 80/20',
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'kmeans': {
                'n_clusters': self.n_clusters,
                'cluster_profiles': cluster_profiles
            },
            'mlp_neural_network': {
                'accuracy': round(mlp_acc, 4),
                'f1_score': round(mlp_f1, 4),
                'roc_auc': round(mlp_roc, 4),
                'status': 'Treinado e validado'
            },
            'random_forest': {
                'accuracy': round(rf_acc, 4),
                'f1_score': round(rf_f1, 4),
                'top_importances': rf_importances
            }
        }
        
        return self.metrics

    def predict_next_probabilities(self, last_binary_draw: np.ndarray) -> np.ndarray:
        """
        Prevê a distribuição probabilística das 25 dezenas para o próximo concurso.
        Combina a saída da Rede Neural MLP e do RandomForest Classifier.
        """
        if not self.is_trained:
            return np.ones(25) / 25.0
            
        X_in = last_binary_draw.reshape(1, -1)
        
        # Probabilidades do MLP
        mlp_p = self.mlp_model.predict_proba(X_in)
        if isinstance(mlp_p, list):
            probs_mlp = np.array([p[0, 1] if p.shape[1] > 1 else 0.5 for p in mlp_p])
        else:
            probs_mlp = mlp_p[0]
            
        # Probabilidades do RandomForest
        rf_p = self.rf_model.predict_proba(X_in)
        if isinstance(rf_p, list):
            probs_rf = np.array([p[0, 1] if p.shape[1] > 1 else 0.5 for p in rf_p])
        else:
            probs_rf = rf_p[0]
            
        # Média ponderada (60% MLP + 40% RF)
        combined_prob = (0.6 * probs_mlp) + (0.4 * probs_rf)
        
        # Suavização para garantir probabilidades positivas válidas
        combined_prob = np.clip(combined_prob, 0.05, 0.95)
        return combined_prob
