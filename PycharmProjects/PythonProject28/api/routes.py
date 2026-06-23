from fastapi import APIRouter, UploadFile, File
import shutil


router = APIRouter()


@router.post("/analyze")
async def analyze_traffic(file: UploadFile = File(...)):
    # Сохраняем входящий файл во временную папку
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Считаем машины
    from core.detector import detect_vehicles

    result = detect_vehicles(temp_filename)
    total = result.get("total", 0)
    details = result.get("details", {})

    # Записываем в базу: одну запись для total и по одной на тип объекта
    from app.db import insert_detection
    try:
        insert_detection(total, "total")
        for obj_type, c in details.items():
            insert_detection(c, obj_type)
    except Exception as e:
        # Не прерываем ответ пользователю при ошибке БД, но логгируем в консоль
        print("DB insert error:", e)

    # В идеале здесь нужно удалить temp_filename через os.remove()
    return {"traffic_count": total, "details": details, "filename": file.filename}