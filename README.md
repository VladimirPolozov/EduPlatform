# EduPlatform — Backend

Образовательная платформа. Два микросервиса:

| Сервис | Технология | Порт | Назначение |
|--------|-----------|------|-----------|
| **main-api** | Nest.js | 3000 | Auth, курсы, уроки, загрузка изображений |
| **image-worker** | Express.js | 3001 | Обработка изображений (Sharp + водяной знак) |

---

## 1. Запуск инфраструктуры (Docker)

Перед запуском сервисов:

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

## 3. Примеры запросов и ответов

### Регистрация пользователя

```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "teacher@test.com",
  "password": "password123",
  "role": "teacher"
}
```

Ожидаемый ответ (201):

```json
{
  "id": "6a36340af40c52f7bdb637af",
  "email": "teacher@test.com",
  "role": "teacher"
}
```

### Вход в систему

```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "teacher@test.com",
  "password": "password123"
}
```

Ожидаемый ответ (201):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Создание курса (преподаватель)

```
POST http://localhost:3000/courses
Content-Type: application/json
Authorization: Bearer {JWT_ТОКЕН_ПРЕПОДАВАТЕЛЯ}

{
  "title": "Основы программирования",
  "description": "Вводный курс по программированию",
  "price": 0
}
```

Ожидаемый ответ (201):

```json
{
  "id": "6a365a57adf61b49e516cdcf",
  "title": "Основы программирования",
  "description": "Вводный курс по программированию",
  "teacherId": "6a36340af40c52f7bdb637af",
  "price": 0
}
```

### Получение списка курсов (публичный)

```
GET http://localhost:3000/courses
```

Ожидаемый ответ (200):

```json
[
  {
    "id": "6a365a57adf61b49e516cdcf",
    "title": "Основы программирования",
    "description": "Вводный курс по программированию",
    "teacherId": "6a36340af40c52f7bdb637af",
    "price": 0
  }
]
```

### Получение курса по ID (публичный)

```
GET http://localhost:3000/courses/6a365a57adf61b49e516cdcf
```

Ожидаемый ответ (200):

```json
{
  "id": "6a365a57adf61b49e516cdcf",
  "title": "Основы программирования",
  "description": "Вводный курс по программированию",
  "teacherId": "6a36340af40c52f7bdb637af",
  "price": 0
}
```

### Обновление курса (преподаватель)

```
PATCH http://localhost:3000/courses/6a365a57adf61b49e516cdcf
Content-Type: application/json
Authorization: Bearer {JWT_ТОКЕН_ПРЕПОДАВАТЕЛЯ}

{
  "title": "Продвинутое программирование",
  "price": 1990
}
```

Ожидаемый ответ (200):

```json
{
  "id": "6a365a57adf61b49e516cdcf",
  "title": "Продвинутое программирование",
  "description": "Вводный курс по программированию",
  "teacherId": "6a36340af40c52f7bdb637af",
  "price": 1990
}
```

### Удаление курса (преподаватель)

```
DELETE http://localhost:3000/courses/6a365a57adf61b49e516cdcf
Authorization: Bearer {JWT_ТОКЕН_ПРЕПОДАВАТЕЛЯ}
```

Ожидаемый ответ (200):

```json
{
  "message": "Course deleted successfully"
}
```

### Запись на курс (студент)

```
POST http://localhost:3000/courses/6a365a57adf61b49e516cdcf/enroll
Authorization: Bearer {JWT_ТОКЕН_СТУДЕНТА}
```

Ожидаемый ответ (201):

```json
{
  "message": "Enrolled successfully"
}
```

### Создание урока (преподаватель)

```
POST http://localhost:3000/courses/6a365a57adf61b49e516cdcf/lessons
Content-Type: application/json
Authorization: Bearer {JWT_ТОКЕН_ПРЕПОДАВАТЕЛЯ}

{
  "title": "Введение в курс",
  "content": "Описание первого урока",
  "order": 1
}
```

Ожидаемый ответ (201):

```json
{
  "id": "6a3660a38d798372f0a0a6ad",
  "title": "Введение в курс",
  "content": "Описание первого урока",
  "order": 1,
  "courseId": "6a365a57adf61b49e516cdcf"
}
```

### Получение уроков курса

```
GET http://localhost:3000/courses/6a365a57adf61b49e516cdcf/lessons
Authorization: Bearer {JWT_ТОКЕН}
```

Ожидаемый ответ (200):

```json
[
  {
    "id": "6a3660a38d798372f0a0a6ad",
    "title": "Введение в курс",
    "content": "Описание первого урока",
    "order": 1,
    "courseId": "6a365a57adf61b49e516cdcf"
  }
]
```

### Обновление урока (преподаватель)

```
PATCH http://localhost:3000/lessons/6a3660a38d798372f0a0a6ad
Content-Type: application/json
Authorization: Bearer {JWT_ТОКЕН_ПРЕПОДАВАТЕЛЯ}

{
  "title": "Основы Javascript",
  "content": "Обновлённое содержание",
  "order": 2
}
```

Ожидаемый ответ (200):

```json
{
  "id": "6a3660a38d798372f0a0a6ad",
  "title": "Основы Javascript",
  "content": "Обновлённое содержание",
  "order": 2,
  "courseId": "6a365a57adf61b49e516cdcf"
}
```

### Замена урока (PUT) (преподаватель)

```
PUT http://localhost:3000/lessons/6a3660a38d798372f0a0a6ad
Content-Type: application/json
Authorization: Bearer {JWT_ТОКЕН_ПРЕПОДАВАТЕЛЯ}

{
  "title": "Новый заголовок",
  "content": "Новое содержание"
}
```

Ожидаемый ответ (200):

```json
{
  "id": "6a3660a38d798372f0a0a6ad",
  "title": "Новый заголовок",
  "content": "Новое содержание",
  "courseId": "6a365a57adf61b49e516cdcf"
}
```

### Удаление урока (преподаватель)

```
DELETE http://localhost:3000/lessons/6a3660a38d798372f0a0a6ad
Authorization: Bearer {JWT_ТОКЕН_ПРЕПОДАВАТЕЛЯ}
```

Ожидаемый ответ (200):

```json
{
  "message": "Lesson deleted successfully"
}
```

### Загрузка изображения (преподаватель)

```
POST http://localhost:3000/images/upload
Content-Type: multipart/form-data
Authorization: Bearer {JWT_ТОКЕН_ПРЕПОДАВАТЕЛЯ}

file: @test.png
courseId: 6a365a57adf61b49e516cdcf
```

Ожидаемый ответ (201) — сразу после загрузки:

```json
{
  "id": "6a36601538d9fc10fb2f321e",
  "filename": "test.png",
  "filepath": "D:\\projects\\main-api\\uploads\\1781948437486-371570655.png",
  "courseId": "6a365a57adf61b49e516cdcf",
  "uploadedBy": "6a36340af40c52f7bdb637af",
  "status": "processing"
}
```

### Проверка статуса курса

```
GET http://localhost:3000/health
```

Ожидаемый ответ (200):

```json
{
  "status": "ok",
  "service": "main-api"
}
```

## 4. Структура проекта

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
