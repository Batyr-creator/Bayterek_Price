from fastapi import FastAPI
from api.routes import router

app = FastAPI(title="Transport Monitoring System")

# Подключаем маршруты
app.include_router(router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "System Online", "description": "Система мониторинга транспортных потоков"}