# EduPlatform

Backend-платформа онлайн-курсов.

## Структура проекта

```
EduPlatform/
├── docs/
│   ├── BackendLab.pdf
│   └── architecture.md
├── main-api/            # Nest.js — основной API
├── image-worker/        # Express.js — обработка изображений
└── docker-compose.yml
```

### main-api

```
main-api/
└── src/
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── courses/
    │   ├── lessons/
    │   └── images/
    ├── common/
    ├── config/
    ├── app.module.ts
    └── main.ts
```

Каждый модуль: `domain/`, `application/`, `infrastructure/`, `presentation/`.

### image-worker

```
image-worker/
└── src/
    ├── kafka/
    ├── image/
    ├── database/
    ├── config/
    └── main.ts
```
