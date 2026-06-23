from fastapi import APIRouter, UploadFile, File
import shutil
# import detector lazily inside handler to avoid heavy startup work
    from core.detector import detect_vehicles

router = APIRouter()


@router.post("/analyze")
async def analyze_traffic(file: UploadFile = File(...)):
    # Сохраняем входящий файл во временную папку
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Считаем машины
    count = detect_vehicles(temp_filename)

    # В идеале здесь нужно удалить temp_filename через os.remove()
    return {"traffic_count": count, "filename": file.filename}