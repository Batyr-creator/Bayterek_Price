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

    count = detect_vehicles(temp_filename)

    # В идеале здесь нужно удалить temp_filename через os.remove()
    return {"traffic_count": count, "filename": file.filename}