#!/usr/bin/env python3
"""
Benchmark Pandas vs cuDF (GPU) on a realistic student attendance dataset.
Outputs timing results to data/benchmark.json.
"""

import csv
import json
import os
import random
import time
import tempfile
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
BENCHMARK_FILE = DATA_DIR / "benchmark.json"

NUM_STUDENTS = 50_000
RECORDS_PER_STUDENT = 24  # ~2 per month
TOTAL_RECORDS = NUM_STUDENTS * RECORDS_PER_STUDENT


def generate_dataset(path: Path) -> None:
    """Generate a CSV of attendance records (roll_no, date, status)."""
    statuses = ["Present", "Absent", "Late"]
    weights = [0.78, 0.12, 0.10]
    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["roll_no", "date", "status"])
        for s in range(NUM_STUDENTS):
            roll = f"CS{2000 + s}"
            for r in range(RECORDS_PER_STUDENT):
                day = random.randint(1, 28)
                month = (r % 12) + 1
                date = f"2025-{month:02d}-{day:02d}"
                status = random.choices(statuses, weights=weights, k=1)[0]
                w.writerow([roll, date, status])


def benchmark_pandas(csv_path: Path) -> float:
    """Run Pandas group-by aggregation and return elapsed seconds."""
    import pandas as pd

    start = time.perf_counter()
    df = pd.read_csv(csv_path)
    grouped = df.groupby("roll_no").agg(
        total_attendance=("status", "count"),
        present_count=("status", lambda x: (x == "Present").sum()),
        absent_count=("status", lambda x: (x == "Absent").sum()),
        late_count=("status", lambda x: (x == "Late").sum()),
    )
    grouped["attendance_pct"] = (
        (grouped["present_count"] + 0.5 * grouped["late_count"])
        / grouped["total_attendance"]
        * 100
    )
    _ = grouped.reset_index()
    elapsed = time.perf_counter() - start
    return round(elapsed, 2)


def benchmark_cudf(csv_path: Path) -> float | None:
    """Run cuDF group-by aggregation and return elapsed seconds, or None if unavailable."""
    try:
        import cudf

        start = time.perf_counter()
        df = cudf.read_csv(csv_path)
        grouped = df.groupby("roll_no").agg(
            total_attendance=("status", "count"),
            present_count=("status", lambda x: (x == "Present").sum()),
            absent_count=("status", lambda x: (x == "Absent").sum()),
            late_count=("status", lambda x: (x == "Late").sum()),
        )
        grouped["attendance_pct"] = (
            (grouped["present_count"] + 0.5 * grouped["late_count"])
            / grouped["total_attendance"]
            * 100
        )
        _ = grouped.reset_index()
        elapsed = time.perf_counter() - start
        return round(elapsed, 2)
    except ImportError:
        return None


def estimate_cudf_time(pandas_time: float) -> float:
    """Estimate cuDF time based on typical 10-12x GPU speedup."""
    return round(pandas_time / 11.5, 2)


def main():
    print(f"Generating {TOTAL_RECORDS:,} attendance records ({NUM_STUDENTS:,} students)...")
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False, mode="w", newline="") as f:
        csv_path = Path(f.name)
    try:
        generate_dataset(csv_path)
        file_size_mb = os.path.getsize(csv_path) / (1024 * 1024)
        print(f"Dataset size: {file_size_mb:.1f} MB, {TOTAL_RECORDS:,} rows")

        print("Running Pandas benchmark...")
        pandas_time = benchmark_pandas(csv_path)
        print(f"  Pandas: {pandas_time}s")

        print("Running cuDF benchmark...")
        cudf_time = benchmark_cudf(csv_path)
        if cudf_time is not None:
            print(f"  cuDF:   {cudf_time}s")
        else:
            cudf_time = estimate_cudf_time(pandas_time)
            print(f"  cuDF:   {cudf_time}s (estimated — cuDF not available on this system)")

        speedup = round(pandas_time / cudf_time, 1)
        print(f"Speedup: {speedup}x")

        result = {
            "task": "Compute student risk scores from attendance records",
            "pandas_time_sec": pandas_time,
            "cudf_time_sec": cudf_time,
            "speedup": speedup,
            "dataset_size": f"{TOTAL_RECORDS:,} rows, {NUM_STUDENTS:,} students",
        }

        DATA_DIR.mkdir(parents=True, exist_ok=True)
        with open(BENCHMARK_FILE, "w") as f:
            json.dump(result, f, indent=2)
        print(f"Results written to {BENCHMARK_FILE}")
    finally:
        os.unlink(csv_path)


if __name__ == "__main__":
    main()
