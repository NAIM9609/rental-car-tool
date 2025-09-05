# Rental Car Tool

Un sistema di noleggio auto completo con frontend Next.js, backend Go, e infrastruttura AWS gestita con Terraform.

## 🚀 Caratteristiche

### Frontend (Next.js + TypeScript)
- **Vista utente visitatore**: Lista di auto con cards informative
- **Sistema di prenotazione**: Calendario per selezione date con disponibilità in tempo reale
- **Pricing dinamico**: Sovrapprezzi per festivi, domeniche, e fuori orario
- **Consegna aeroporti**: Opzioni di consegna per Catania, Palermo, e Messina
- **Design responsive**: Interfaccia moderna con Tailwind CSS

### Backend (Go + PostgreSQL)
- **API RESTful**: Gestione completa di auto, prenotazioni, e aeroporti
- **Database PostgreSQL**: Persistenza dati con GORM
- **Calcolo prezzi**: Sistema avanzato di calcolo con modificatori
- **Autenticazione JWT**: Sistema di sicurezza per operazioni admin
- **Health checks**: Monitoraggio stato applicazione

### Infrastruttura (Terraform + AWS)
- **ECS Fargate**: Container orchestration serverless
- **Application Load Balancer**: Distribuzione del traffico
- **RDS Aurora Serverless**: Database PostgreSQL scalabile
- **ECR**: Repository per immagini Docker
- **VPC**: Rete privata virtuale con subnet pubbliche e private
- **Secrets Manager**: Gestione sicura delle credenziali

## 🏗️ Architettura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Load Balancer │    │   Backend       │
│   (Next.js)     │◄──►│   (ALB)         │◄──►│   (Go)          │
│   Port: 3000    │    │   Port: 80/443  │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   Database      │
                                              │   (PostgreSQL)  │
                                              │   Port: 5432    │
                                              └─────────────────┘
```

## 🚀 Quick Start

### Sviluppo Locale con Docker

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd rental-car-tool
   ```

2. **Setup ambiente di sviluppo**
   ```bash
   chmod +x scripts/dev-setup.sh
   ./scripts/dev-setup.sh
   ```

3. **Accedi all'applicazione**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Health check: http://localhost:8080/health

### ⚠️ Problemi con Docker?

Se riscontri errori con Docker (es. `docker-credential-desktop` not found):

1. **Setup alternativo senza Docker**:
   ```bash
   ./scripts/simple-setup.sh
   cd frontend && npm run dev  # Terminal 1
   # Avvia PostgreSQL manualmente o usa database cloud
   ```

2. **Solo database con Docker**:
   ```bash
   docker run --name rental-postgres \
     -e POSTGRES_DB=rental_car_db \
     -e POSTGRES_USER=rental_user \
     -e POSTGRES_PASSWORD=rental_password \
     -p 5432:5432 -d postgres:15-alpine
   ```

3. **Consulta la guida completa**: [DOCKER-TROUBLESHOOTING.md](DOCKER-TROUBLESHOOTING.md)

### Deployment su AWS

1. **Prerequisiti**
   - AWS CLI configurato
   - Terraform installato
   - Docker installato

2. **Deploy su AWS**
   ```bash
   chmod +x scripts/aws-deploy.sh
   ./scripts/aws-deploy.sh
   ```

## 📁 Struttura del Progetto

```
rental-car-tool/
├── frontend/                 # Applicazione Next.js
│   ├── app/
│   │   ├── components/      # Componenti React
│   │   ├── booking/         # Pagine di prenotazione
│   │   └── types/           # Definizioni TypeScript
│   ├── package.json
│   └── next.config.js
├── backend/                 # API Go
│   ├── internal/
│   │   ├── handlers/        # Handler HTTP
│   │   ├── models/          # Modelli database
│   │   ├── database/        # Configurazione DB
│   │   └── middleware/      # Middleware autenticazione
│   ├── main.go
│   └── go.mod
├── infrastructure/          # Infrastruttura Terraform
│   ├── main.tf             # Configurazione principale
│   ├── ecs.tf              # Servizi ECS
│   ├── rds.tf              # Database PostgreSQL
│   └── outputs.tf          # Output Terraform
├── docker/                 # File Docker
│   ├── docker-compose.yml  # Ambiente sviluppo
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
└── scripts/                # Script di deployment
    ├── dev-setup.sh        # Setup sviluppo
    └── aws-deploy.sh       # Deploy AWS
```

## 🔧 Configurazione

### Variabili Ambiente Backend
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=rental_user
DB_PASSWORD=rental_password
DB_NAME=rental_car_db
JWT_SECRET=your-secret-key
PORT=8080
```

### Variabili Ambiente Frontend
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

## 📊 API Endpoints

### Auto
- `GET /api/cars` - Lista tutte le auto disponibili
- `GET /api/cars/:id` - Dettagli auto specifica
- `POST /api/cars` - Crea nuova auto (admin)
- `PUT /api/cars/:id` - Aggiorna auto (admin)
- `DELETE /api/cars/:id` - Elimina auto (admin)

### Prenotazioni
- `GET /api/cars/:id/bookings` - Prenotazioni per auto specifica
- `POST /api/bookings` - Crea nuova prenotazione
- `GET /api/bookings/:id` - Dettagli prenotazione
- `PUT /api/bookings/:id` - Aggiorna prenotazione (admin)
- `DELETE /api/bookings/:id` - Elimina prenotazione (admin)

### Aeroporti
- `GET /api/airports` - Lista aeroporti disponibili

## 💰 Sistema di Pricing

Il sistema calcola automaticamente i prezzi con i seguenti modificatori:

- **Prezzo base**: Prezzo giornaliero per auto
- **Sovrapprezzo domenica**: +20%
- **Sovrapprezzo festivi**: +30%
- **Sovrapprezzo fuori orario**: +15% (9-13 e 16:30-20)
- **Consegna aeroporto**: 
  - Catania: +€15
  - Palermo: +€20
  - Messina: +€12

## 🔐 Sicurezza

- **JWT Authentication**: Per operazioni amministrative
- **CORS configurato**: Protezione richieste cross-origin
- **Secrets Manager**: Gestione sicura credenziali AWS
- **VPC private subnets**: Isolamento servizi backend
- **Security Groups**: Firewall configurato per ogni servizio

## 📈 Monitoraggio

- **CloudWatch Logs**: Logging centralizzato
- **Health Checks**: Endpoint `/health` per monitoraggio
- **ECS Service Discovery**: Auto-recovery dei servizi
- **Load Balancer Health Checks**: Verifica stato applicazioni

## 🚀 Scalabilità

- **ECS Fargate**: Scalabilità automatica container
- **Aurora Serverless**: Database che scala automaticamente
- **Application Load Balancer**: Distribuzione carico
- **Multi-AZ deployment**: Alta disponibilità

## 🛠️ Sviluppo

### Comandi Docker Compose

```bash
# Avvia tutti i servizi
docker-compose up -d

# Visualizza logs
docker-compose logs -f

# Riavvia servizi
docker-compose restart

# Ferma tutti i servizi
docker-compose down

# Rebuilda immagini
docker-compose up --build
```

### Gestione Database

```bash
# Connetti al database
docker-compose exec postgres psql -U rental_user -d rental_car_db

# Backup database
docker-compose exec postgres pg_dump -U rental_user rental_car_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U rental_user rental_car_db < backup.sql
```

## 📝 TODO

- [ ] Sistema di autenticazione utenti
- [ ] Dashboard amministratore
- [ ] Sistema di pagamenti
- [ ] Notifiche email
- [ ] Mobile app
- [ ] Sistema di recensioni
- [ ] Integrazione mappe
- [ ] Multi-lingua

## 🤝 Contribuire

1. Fork del progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## 📄 Licenza

Questo progetto è licenziato sotto la licenza MIT - vedi il file [LICENSE](LICENSE) per dettagli.

## 🆘 Supporto

Per supporto o domande:
- Apri un Issue
- Consulta la documentazione
- Verifica i logs con `docker-compose logs`

---

Sviluppato con ❤️ usando Next.js, Go, PostgreSQL, Docker e AWS.