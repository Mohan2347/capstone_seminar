import os
import sys
import time
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(r'C:\Users\HP\Desktop\internship-recommendation\.env')
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

model = genai.GenerativeModel('gemini-2.0-flash')

with open('my_report.txt', 'r', encoding='utf-8') as f:
    my_report_text = f.read()
with open('my_research.txt', 'r', encoding='utf-8') as f:
    my_research_text = f.read()
with open('my_patent.txt', 'r', encoding='utf-8') as f:
    my_patent_text = f.read()

source_material = f"""
PROJECT NAME: InternAI Compass
TOPIC: Intelligent Hybrid Recommendation Engine for Personalized and Equitable Internship Pathways
TECH STACK: Next.js 15, React, TypeScript, Prisma, PostgreSQL (NeonDB), Python (FastAPI), BERT, Reinforcement Learning, Blockchain Verification.
ALGORITHM: SmartMatch-AI (Hybrid of Content-based, Collaborative filtering, and RL).
GITHUB: https://github.com/Mohan2347/capstone_seminar
VERCEL: https://capstone-seminar.vercel.app/

STUDENTS:
1. Y.N.V. Mahesh Reddy (12201492)
2. T. Bhanu Prakesh (12213376)
3. G.M.V.R. Reddy (12206674)
4. Vemuri Gowtham (12213211)
5. Dudekula Rahim (12201812)
6. K. Venkata Sai (12205733)

MENTOR: Ms. Isha Khughar

SOURCE TEXTS:
{my_report_text}
{my_research_text}
{my_patent_text}
"""

chapters = [
    ("CHAPTER 1: INTRODUCTION", "Overview, Objective, Description, Scope, Use Case Model, System Description, Profiles, Assumptions, Requirements."),
    ("CHAPTER 2: PROFILE OF THE PROBLEM, RATIONALE AND SCOPE", "Introduction to problem, Rationale, Problem statement, Scope."),
    ("CHAPTER 3: EXISTING SYSTEM", "Introduction, Existing software/platforms, DFD for existing system, Novelty."),
    ("CHAPTER 4: PROBLEM ANALYSIS", "Product definition, Feasibility (Tech/Econ/Ops), Project plan."),
    ("CHAPTER 5: SOFTWARE REQUIREMENT ANALYSIS", "Introduction, General description, Functional/Non-functional/System requirements."),
    ("CHAPTER 6: DESIGN", "System design, Database design, Design notations, Detailed design (SmartMatch-AI, Blockchain), Flowcharts (Mermaid syntax), Pseudo code."),
    ("CHAPTER 7: TESTING", "Functional/Structural/Levels of testing, Results summary (Accuracy, Precision, Recall)."),
    ("CHAPTER 8: IMPLEMENTATION", "Implementation details, Tech stack summary, Conversion plan, Maintenance."),
    ("CHAPTER 9: PROJECT LEGACY", "Current status, Concerns, Lessons learned."),
    ("CHAPTER 10: USER MANUAL", "Getting started, Student guide, Admin/Employer guide."),
    ("CHAPTER 11: SOURCE CODE AND SYSTEM SNAPSHOTS", "Repository structure, Core algorithm code snippets, Snapshot descriptions (Dashboard, Analysis, Verification)."),
    ("CHAPTER 12: BIBLIOGRAPHY", "Complete list of references from research paper.")
]

def generate_chapter(chap_title, chap_desc):
    prompt = f"""You are a professional technical writer preparing a 60-page Capstone Project Report.
The topic is 'InternAI Compass'.
The structure must match the friend's report format.
BE EXTREMELY VERBOSE AND DETAILED. Each chapter should be several pages long when printed. 
Use academic language. Do not use placeholders. 
Ensure the content is 100% human-like and passes plagiarism checks.

SOURCE MATERIAL:
{source_material}

TASK:
Write {chap_title}.
Specific headings to cover: {chap_desc}.
If information is missing, use your expert knowledge of Next.js, AI, and Software Engineering to fill it in realistically. 
Format: Plain text with headings in ALL CAPS.
"""
    for _ in range(3):
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error: {e}. Retrying...")
            time.sleep(5)
    return ""

output_file = "Detailed_InternAI_Compass_Report.txt"
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("DETAILED REPORT CONTENT\n\n")

for title, desc in chapters:
    print(f"Generating {title}...")
    content = generate_chapter(title, desc)
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write(f"\n\n--- {title} ---\n\n")
        f.write(content)
    print(f"Finished {title}")

print("All chapters generated!")
