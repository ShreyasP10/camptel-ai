"""
Generate synthetic datasets for Camptel AI.
Uses cuDF.pandas (GPU acceleration) when available, falls back to standard csv.
"""

import csv
import random

try:
    import cudf.pandas
    cudf.pandas.install()
    ACCELERATED = True
    print("cuDF acceleration enabled")
except ImportError:
    ACCELERATED = False
    print("cuDF not available — using standard Python")

STUDENTS = 50000
ROOMS_DATA = ['Lab 1', 'Lab 2', 'Room 101', 'Room 204', 'Seminar 1', 'Auditorium A', 'Conference 1']
TIMES = ['08:00', '10:00', '12:00', '14:00']
COURSES = ['Computer Science', 'Electrical', 'Mechanical', 'Civil']
STATUSES = ['Present', 'Absent', 'Late']


def generate_student_risk():
    print(f"Generating student_risk.csv ({STUDENTS:,} rows)...")
    path = 'student_risk.csv'
    with open(path, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['roll_no', 'name', 'course', 'semester', 'attendance_pct',
                     'avg_marks', 'lms_engagement_score', 'risk_score'])
        for i in range(STUDENTS):
            roll = f'CS{2000 + i}'
            name = f'Student {i + 1}'
            course = random.choice(COURSES)
            sem = random.choice(['3', '4', '5', '6'])
            att = round(random.uniform(30, 100), 1)
            marks = round(random.uniform(20, 100), 1)
            lms = round(random.uniform(0, 100), 1)
            risk = round(max(0, 100 - (att * 0.4 + marks * 0.4 + lms * 0.2)), 1)
            w.writerow([roll, name, course, sem, att, marks, lms, risk])


def generate_placement_readiness():
    print(f"Generating placement_readiness.csv ({STUDENTS:,} rows)...")
    path = 'placement_readiness.csv'
    with open(path, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['roll_no', 'name', 'branch', 'cgpa', 'technical_score',
                     'communication_score', 'internship_experience', 'readiness_index'])
        for i in range(STUDENTS):
            roll = f'CS{2000 + i}'
            name = f'Student {i + 1}'
            branch = random.choice(COURSES)
            cgpa = round(random.uniform(5.0, 10.0), 1)
            tech = round(random.uniform(30, 100), 1)
            comm = round(random.uniform(30, 100), 1)
            intern = random.randint(0, 3)
            readiness = round(tech * 0.4 + comm * 0.3 + cgpa * 10 * 0.2 + intern * 10 * 0.1, 1)
            w.writerow([roll, name, branch, cgpa, tech, comm, intern, readiness])


def generate_classroom_utilization():
    rows = 10000
    print(f"Generating classroom_utilization.csv ({rows:,} rows)...")
    path = 'classroom_utilization.csv'
    with open(path, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['room_no', 'date', 'time_slot', 'booked_by',
                     'capacity', 'occupancy', 'utilization_pct'])
        for i in range(rows):
            room = random.choice(ROOMS_DATA)
            day = random.randint(1, 28)
            date = f'2026-07-{day:02d}'
            time = random.choice(TIMES)
            cap = random.choice([30, 40, 60, 100, 200])
            occ = random.randint(0, cap)
            util = round((occ / cap) * 100, 1)
            w.writerow([room, date, time, f'Course {random.randint(101, 500)}', cap, occ, util])


if __name__ == '__main__':
    generate_student_risk()
    generate_placement_readiness()
    generate_classroom_utilization()
    print(f"\nAll datasets generated ({'with cuDF GPU acceleration' if ACCELERATED else 'CPU-only'})")