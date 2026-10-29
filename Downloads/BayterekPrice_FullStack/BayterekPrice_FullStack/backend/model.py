import os
import pandas as pd

def estimate_apartment_price(district, area, rooms, floor, total_floors, year, condition):
    csv_path = os.path.join(os.path.dirname(__file__), "apartments_astana.csv")
    df = pd.read_csv(csv_path)

    district_rates = {
        'Есиль': 550000,
        'Нура': 510000,
        'Алматы': 460000,
        'Сарыарка': 420000,
        'Байконыр': 390000
    }

    base_rate = district_rates.get(district, 450000)

    year_coeff = 1.15 if year >= 2020 else (1.05 if year >= 2010 else 0.90)
    
    condition_coeffs = {
        'черновая': 0.82,
        'улучшенная черновая': 0.90,
        'чистовая': 1.05,
        'дизайнерский': 1.25
    }
    cond_coeff = condition_coeffs.get(condition, 1.0)

    final_rate = base_rate * year_coeff * cond_coeff
    total_price = final_rate * area

    return {
        "price_per_meter": round(final_rate),
        "total_price": round(total_price)
    }

if __name__ == "__main__":
    result = estimate_apartment_price("Есиль", 82, 3, 4, 9, 2015, "чистовая")
    print(f"Оценка квартиры через Python-модель: {result['total_price']:,} ₸ ({result['price_per_meter']:,} ₸/м²)")
