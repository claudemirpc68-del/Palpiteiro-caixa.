FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar os requisitos primeiro para aproveitar o cache do Docker
COPY backend/requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo o projeto (frontend e backend)
COPY . .

# Expor a porta que a API vai rodar
EXPOSE 8000

# Mudar para a pasta backend para executar o servidor
WORKDIR /app/backend

# Comando para iniciar o servidor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
