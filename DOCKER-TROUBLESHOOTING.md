# 🚨 Docker Setup Issues & Solutions

## Problema: `docker-credential-desktop` not found

Se stai ricevendo l'errore:
```
error getting credentials - err: exec: "docker-credential-desktop": executable file not found in $PATH
```

## Soluzioni:

### 1. **Verifica Docker Desktop**
- Assicurati che Docker Desktop sia installato e in esecuzione
- Riavvia Docker Desktop se necessario

### 2. **Configura credenziali Docker**
```bash
# Rimuovi configurazioni credential helper problematiche
rm ~/.docker/config.json

# O modifica il file per rimuovere "credstore"
# Apri ~/.docker/config.json e rimuovi la riga:
# "credsStore": "desktop"
```

### 3. **Alternative di sviluppo**

#### A. **Solo Database con Docker**
```bash
# Avvia solo PostgreSQL
docker run --name rental-postgres \
  -e POSTGRES_DB=rental_car_db \
  -e POSTGRES_USER=rental_user \
  -e POSTGRES_PASSWORD=rental_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

#### B. **Setup senza Docker**
```bash
# Usa il setup semplificato
./scripts/simple-setup.sh

# Avvia il frontend
cd frontend && npm run dev

# Backend (richiede Go installato)
cd backend && go run main.go
```

#### C. **Database locale (PostgreSQL)**
1. Installa PostgreSQL localmente
2. Crea database e utente:
```sql
CREATE DATABASE rental_car_db;
CREATE USER rental_user WITH PASSWORD 'rental_password';
GRANT ALL PRIVILEGES ON DATABASE rental_car_db TO rental_user;
```

### 4. **Fix per macOS/Linux**
```bash
# Resetta Docker credentials
docker logout
docker login

# O usa Podman come alternativa
brew install podman
alias docker=podman
```

### 5. **Verifica installazione**
```bash
# Test Docker
docker --version
docker run hello-world

# Test PostgreSQL connection
psql -h localhost -U rental_user -d rental_car_db
```

## 🚀 Avvio Rapido senza problemi

### Per development immediato:
1. **Frontend**: `cd frontend && npm run dev`
2. **Database**: Usa un database cloud (Supabase, Railway, etc.) o locale
3. **Backend**: Mock API o database locale

### Per testing completo:
1. Risolvi Docker prima
2. Usa `./scripts/dev-setup.sh`

## 📞 Supporto
- Verifica versione Docker: `docker --version`
- Logs Docker: `docker logs <container-name>`
- Restart Docker Desktop
- In caso di problemi persistenti, usa setup senza Docker
