# EduPlatform — Backend

Образовательная платформа. Два микросервиса:

| Сервис | Технология | Порт | Назначение |
|--------|-----------|------|-----------|
| **main-api** | Nest.js | 3000 | Auth, курсы, уроки, загрузка изображений |
| **image-worker** | Express.js | 3001 | Обработка изображений (Sharp + водяной знак) |

---

## 1. Запуск инфраструктуры (Docker)

Перед запуском сервисов подними зависимости:

```bash
cd EduPlatform/docs
docker compose up -d
```

| Сервис | Порт | Проверка |
|--------|------|----------|
| MongoDB | 27017 | `docker compose ps` |
| Redis | 6379 | `redis-cli ping` → PONG |
| Zookeeper | 2181 | `docker compose ps` |
| Kafka | 9092 | `docker compose ps` |

Остановка:

```bash
docker compose down
```

---

## 2. Запуск сервисов

### main-api

```bash
cd EduPlatform/main-api
cp .env.example .env        # если нет .env
npm install
npm run build
npm run start               # или npm run start:dev (watch)
```

Проверка:

```bash
curl http://localhost:3000/health
# → {"status":"ok","service":"main-api"}
```

### image-worker

```bash
cd EduPlatform/image-worker
cp .env.example .env
npm install
npm run build
npm run start
```

Проверка:

```bash
curl http://localhost:3001/health
# → {"status":"ok"}
```

---

## 3. Если что-то не запускается

### Порт занят (EADDRINUSE)

```powershell
# Найти процесс на порту 3000
$pid = (netstat -ano | Select-String ":3000").ForEach({ [int]($_ -replace '.*\s(\d+)\s*$','$1') }) | Select-Object -First 1
if ($pid) { Stop-Process -Id $pid -Force }
```

Повторить для порта 3001, заменив `:3000` на `:3001`.

### Kafka: топики не создаются

Ошибки `"Topic creation errors"` или `"There is no leader for this topic-partition"` — нормально при первом запуске. Kafka создаёт топики автоматически при первой отправке сообщения. Если consumer не подключается:

```powershell
docker compose restart kafka
```

### MongoDB не коннектится

Проверь, что MongoDB запущен:

```powershell
docker compose ps
```

Если MongoDB в контейнере, но main-api не подключается — проверь `.env`:

```
MONGODB_URI=mongodb://localhost:27017/eduplatform
```

### Redis не отвечает

```powershell
redis-cli ping
# → PONG
```

Если нет `redis-cli`, проверь контейнер:

```powershell
docker compose ps | Select-String redis
```

### Sharp падает с libpng error

Исходное изображение повреждено. Загрузи нормальный PNG/JPG.

---

## 4. Примеры запросов и ответов

### Регистрация учителя

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"password123","role":"teacher"}'
```

```json
{
  "id": "6a36340af40c52f7bdb637af",
  "email": "teacher@test.com",
  "role": "teacher"
}
```

### Логин

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"password123"}'
```

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Создание курса (teacher)

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Мой курс","description":"Описание курса","price":0}'
```

```json
{
  "id": "6a365a57adf61b49e516cdcf",
  "title": "Мой курс",
  "description": "Описание курса",
  "teacherId": "6a36340af40c52f7bdb637af",
  "price": 0
}
```

### Список курсов (публичный)

```bash
curl http://localhost:3000/courses
```

### Получить курс по ID (публичный)

```bash
curl http://localhost:3000/courses/6a365a57adf61b49e516cdcf
```

### Запись студента на курс

```bash
TOKEN="<student_token>"
curl -X POST http://localhost:3000/courses/6a365a57adf61b49e516cdcf/enroll \
  -H "Authorization: Bearer $TOKEN"
```

### Создание урока

```bash
TOKEN="<teacher_token>"
curl -X POST http://localhost:3000/courses/6a365a57adf61b49e516cdcf/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Урок 1","content":"Материал урока"}'
```

```json
{
  "id": "6a3660a38d798372f0a0a6ad",
  "title": "Урок 1",
  "content": "Материал урока",
  "courseId": "6a365a57adf61b49e516cdcf"
}
```

### Загрузка изображения (teacher) — полный flow

```bash
# 1. Создать тестовое изображение (через Sharp или любой файл)
node -e "
  const sharp = require('sharp');
  sharp({ create: { width: 600, height: 400, channels: 3, background: { r: 66, g: 133, b: 244 } } })
    .png().toFile('test.png').then(() => console.log('OK'))
"

# 2. Загрузить
TOKEN="<teacher_token>"
COURSE_ID="<course_id>"
curl -s -X POST http://localhost:3000/images/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.png" \
  -F "courseId=${COURSE_ID}"
```

**Ответ (сразу после загрузки):**

```json
{
  "id": "6a36601538d9fc10fb2f321e",
  "filename": "test.png",
  "filepath": "D:\\...\\main-api\\uploads\\1781948437486-371570655.png",
  "courseId": "6a365a57adf61b49e516cdcf",
  "uploadedBy": "6a36340af40c52f7bdb637af",
  "status": "processing"
}
```

**Через 3-5 секунд статус изменится на `ready`** — image-worker обработает файл (resize 800px + водяной знак) и обновит запись.

Проверить статус:

```powershell
node -e "
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/eduplatform').then(async () => {
    const doc = await mongoose.connection.db.collection('images')
      .findOne({}, {sort: {createdAt: -1}});
    console.log(JSON.stringify({status: doc.status, processedPath: doc.processedPath}, null, 2));
    mongoose.disconnect();
  })
"
```

```json
{
  "status": "ready",
  "processedPath": "D:\\...\\image-worker\\processed\\test-processed.png"
}
```

---

## 5. Полный image pipeline

```
POST /images/upload (teacher)
        │
        ▼
  main-api: сохраняет файл → uploads/
        │
        ▼
  MongoDB: статус = "processing"
        │
        ▼
  Kafka: image.uploaded { imageId, filepath, filename }
        │
        ▼
  image-worker: consumer
        │
        ▼
  Sharp: resize 800px + watermark "EduPlatform"
        │
        ▼
  Сохранение → processed/
        │
        ▼
  MongoDB: статус = "ready", processedPath
        │
        ▼
  Kafka: image.processed { imageId, processedPath }
        │
        ▼
  main-api: consumer → подтверждение
```

## 6. Структура проекта

```
EduPlatform/
├── docs/
│   ├── architecture.md           # Правила архитектуры
│   ├── development.md            # Правила разработки
│   ├── progress.md               # Прогресс реализации
│   └── docker-compose.yml        # Инфраструктура (Mongo, Redis, Kafka)
├── main-api/                     # Nest.js (порт 3000)
│   └── src/
│       ├── config/               # Конфигурация
│       ├── common/               # Health controller
│       ├── modules/
│       │   ├── auth/             # JWT, роли, guards
│       │   ├── users/            # Пользователи
│       │   ├── courses/          # CRUD курсов + Redis кэш
│       │   ├── lessons/          # CRUD уроков
│       │   └── images/           # Upload + Kafka producer/consumer
│       └── app.module.ts
└── image-worker/                 # Express.js (порт 3001)
    └── src/
        ├── config/               # Конфигурация
        ├── database/             # MongoDB подключение
        ├── image/                # Sharp обработка
        ├── kafka/                # Consumer + producer
        └── main.ts
```
