import csv
import random

# ----- student_risk (50,000 rows) -----
with open('student_risk.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['roll_no','name','course','semester','attendance_pct','avg_marks','lms_engagement_score','risk_score'])
    for i in range(50000):
        roll = f'CS{2000+i}'
        name = f'Student {i+1}'
        course = random.choice(['Computer Science', 'Electrical', 'Mechanical', 'Civil'])
        sem = random.choice(['3','4','5','6'])
        att = round(random.uniform(30, 100), 1)
        marks = round(random.uniform(20, 100), 1)
        lms = round(random.uniform(0, 100), 1)
        risk = round(max(0, 100 - (att*0.4 + marks*0.4 + lms*0.2)), 1)
        w.writerow([roll, name, course, sem, att, marks, lms, risk])

print("student_risk.csv generated (50,000 rows)")

# ----- placement_readiness (50,000 rows) -----
with open('placement_readiness.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['roll_no','name','branch','cgpa','technical_score','communication_score','internship_experience','readiness_index'])
    for i in range(50000):
        roll = f'CS{2000+i}'
        name = f'Student {i+1}'
        branch = random.choice(['Computer Science', 'Electrical', 'Mechanical', 'Civil'])
        cgpa = round(random.uniform(5.0, 10.0), 1)
        tech = round(random.uniform(30, 100), 1)
        comm = round(random.uniform(30, 100), 1)
        intern = random.randint(0, 3)
        readiness = round(tech * 0.4 + comm * 0.3 + cgpa * 10 * 0.2 + intern * 10 * 0.1, 1)
        w.writerow([roll, name, branch, cgpa, tech, comm, intern, readiness])

print("placement_readiness.csv generated (50,000 rows)")

# ----- classroom_utilization (10,000 rows) -----
with open('classroom_utilization.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['room_no','date','time_slot','booked_by','capacity','occupancy','utilization_pct'])
    rooms = ['Lab 1', 'Lab 2', 'Room 101', 'Room 204', 'Seminar 1', 'Auditorium A', 'Conference 1']
    times = ['08:00', '10:00', '12:00', '14:00']
    for i in range(10000):
        room = random.choice(rooms)
        day = random.randint(1, 28)
        date = f'2026-07-{day:02d}'
        time = random.choice(times)
        cap = random.choice([30, 40, 60, 100, 200])
        occ = random.randint(0, cap)
        util = round((occ / cap) * 100, 1)
        w.writerow([room, date, time, f'Course {random.randint(101, 500)}', cap, occ, util])

print("classroom_utilization.csv generated (10,000 rows)")