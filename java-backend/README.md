# Java Backend: Data Structures API

This Spring Boot backend demonstrates the use of Stack, PriorityQueue, and HashMap via REST APIs.

## Endpoints

### Stack
- `POST /api/stack/push` (body: string) — Push value to stack
- `GET /api/stack/pop` — Pop value from stack

### PriorityQueue
- `POST /api/queue/add` (body: string) — Add value to queue
- `GET /api/queue/poll` — Poll value from queue

### HashMap
- `POST /api/map/put?key=yourKey` (body: string) — Put key-value in map
- `GET /api/map/get?key=yourKey` — Get value by key

## How to Run

1. Make sure you have Java 17+ and Maven installed.
2. In this folder, run:

```
mvn spring-boot:run
```

The server will start on port 8080 by default.

---

You can now integrate this backend with your frontend or test it using Postman/curl.
