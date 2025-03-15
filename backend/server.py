from datetime import datetime

from fastapi import FastAPI
from pydantic import BaseModel, Field


class EngineDiagnostics(BaseModel):
    rpm: int = Field(ge=0, le=8000)
    temperature: int = Field(ge=0, le=120)


class BatteryDiagnostics(BaseModel):
    voltage: float = Field(gt=0, lt=15)


class FuelDiagnostics(BaseModel):
    level: int = Field(ge=0, le=100)


class VehicleDiagnostics(BaseModel):
    vehicle_id: str = Field(pattern=r"[A-Z]{3}-\d{3}")
    timestamp: datetime
    engine: EngineDiagnostics
    battery: BatteryDiagnostics
    fuel: FuelDiagnostics


app = FastAPI()


@app.post("/diagnostics/process")
def process_diagnostics(diagnostics: VehicleDiagnostics):
    engine_overheating = diagnostics.engine.temperature >= 100
    battery_faulty = not (12.0 <= diagnostics.battery.voltage <= 14.5)
    low_fuel = diagnostics.fuel.level < 15

    return {
        "vehicle_id": diagnostics.vehicle_id,
        "timestamp": diagnostics.timestamp.isoformat(),
        "engine": {
            "status": "Overheating" if engine_overheating else "Normal",
        },
        "battery": {
            "status": "Check Battery" if battery_faulty else "Normal",
        },
        "fuel": {
            "status": "Low" if low_fuel else "Sufficient",
        },
        "overall_status": "Attention Required" if engine_overheating or battery_faulty or low_fuel else "OK",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
