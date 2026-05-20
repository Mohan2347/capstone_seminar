import os
import sys
import time
from dotenv import load_dotenv
import warnings

warnings.filterwarnings('ignore', category=FutureWarning)
import google.generativeai as genai

load_dotenv(r'C:\Users\HP\Desktop\internship-recommendation\.env')
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

model = genai.GenerativeModel('gemini-1.5-flash')

with open('my_report.txt', 'r', encoding='utf-8') as f:
    my_report_text = f.read()
with open('my_research.txt', 'r', encoding='utf-8') as f:
    my_research_text = f.read()
with open('my_patent.txt', 'r', encoding='utf-8') as f:
    my_patent_text = f.read()

source_material = f"""
MY REPORT:
{my_report_text}

MY RESEARCH:
{my_research_text}

MY PATENT:
{my_patent_text}
"""

chapters = [
    ('CHAPTER 1: INTRODUCTION', '1.1 OVERVIEW, 1.2 OBJECTIVE OF THE PROJECT, 1.3 DESCRIPTION OF THE PROJECT, 1.4 SCOPE OF THE PROJECT, 1.5 USE CASE MODEL, 1.6 SYSTEM DESCRIPTION, 1.7 CUSTOMER AND USER PROFILES, 1.8 ASSUMPTIONS AND DEPENDENCIES, 1.9 FUNCTIONAL REQUIREMENTS, 1.10 NON-FUNCTIONAL REQUIREMENTS.'),
    ('CHAPTER 2: PROFILE OF THE PROBLEM, RATIONALE AND SCOPE', '2.1 INTRODUCTION TO THE PROBLEM, 2.2 RATIONALE FOR THE PROPOSED SYSTEM, 2.3 PROBLEM STATEMENT, 2.4 SCOPE OF THE STUDY.'),
    ('CHAPTER 3: EXISTING SYSTEM', '3.1 INTRODUCTION, 3.2 EXISTING SOFTWARE AND PLATFORMS, 3.3 DATA FLOW DIAGRAM FOR THE EXISTING SYSTEM, 3.4 WHAT IS NEW IN THE SYSTEM TO BE DEVELOPED.'),
    ('CHAPTER 4: PROBLEM ANALYSIS', '4.1 PRODUCT DEFINITION, 4.2 FEASIBILITY ANALYSIS (Technical, Economic, Operational), 4.3 PROJECT PLAN.'),
    ('CHAPTER 5: SOFTWARE REQUIREMENT ANALYSIS', '5.1 INTRODUCTION, 5.2 GENERAL DESCRIPTION, 5.3 SPECIFIC REQUIREMENTS (Functional, Non-Functional, System).'),
    ('CHAPTER 6: DESIGN', '6.1 SYSTEM DESIGN, 6.2 DATABASE DESIGN, 6.3 DESIGN NOTATIONS, 6.4 DETAILED DESIGN, 6.5 FLOWCHARTS, 6.6 PSEUDO CODE.'),
    ('CHAPTER 7: TESTING', '7.1 FUNCTIONAL TESTING, 7.2 STRUCTURAL TESTING, 7.3 LEVELS OF TESTING, 7.4 TESTING THE PROJECT — RESULTS SUMMARY.'),
    ('CHAPTER 8: IMPLEMENTATION', '8.1 IMPLEMENTATION OF THE PROJECT, 8.2 TECHNOLOGY STACK SUMMARY, 8.3 CONVERSION PLAN, 8.4 POST-IMPLEMENTATION AND SOFTWARE MAINTENANCE.'),
    ('CHAPTER 9: PROJECT LEGACY', '9.1 CURRENT STATUS OF THE PROJECT, 9.2 REMAINING AREAS OF CONCERN, 9.3 TECHNICAL AND MANAGERIAL LESSONS LEARNED.'),
    ('CHAPTER 10: USER MANUAL', '10.1 GETTING STARTED, 10.2 STUDENT GUIDE, 10.3 ADMINISTRATOR GUIDE.'),
    ('CHAPTER 11: SOURCE CODE AND SYSTEM SNAPSHOTS', '11.1 REPOSITORY STRUCTURE, 11.2 CORE ALGORITHM, 11.3 SYSTEM SNAPSHOTS DESCRIPTION.'),
    ('CHAPTER 12: BIBLIOGRAPHY', '12 BIBLIOGRAPHY')
]

system_prompt = """You are an expert technical writer. You are writing a final capstone project report for 'InternAI Compass: An Intelligent Hybrid Recommendation Engine for Personalized and Equitable Internship Pathways'.
You must exactly match the sub-headings structure requested. Write the content entirely using my source material. Plagiarism must be < 10%.
Be detailed, formal, and academic. Ensure it is lengthy and comprehensive. Do not use markdown headers (# or ##), just type the headings in ALL CAPS so I can easily copy-paste them into Word. Use plain text formatting.
"""

output_file = 'Final_InternAI_Compass_Report.txt'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write('FINAL REPORT: INTERNAI COMPASS\n\n')

for chap_title, chap_desc in chapters:
    print(f'Generating {chap_title}...', flush=True)
    prompt = f"""{system_prompt}
    
SOURCE MATERIAL:
{source_material}

TASK:
Write {chap_title}. 
Include exactly these subheadings: {chap_desc}.
Make sure to extract relevant parts from my source material. If there are missing parts, infer them logically based on the SmartMatch-AI system, Next.js, and general software engineering practices. Make it highly professional and humanized.
"""
    try:
        response = model.generate_content(prompt)
        with open(output_file, 'a', encoding='utf-8') as f:
            f.write(f'\n\n{chap_title}\n\n')
            f.write(response.text)
        print(f'Successfully generated {chap_title}', flush=True)
    except Exception as e:
        print(f'Error generating {chap_title}: {e}', flush=True)
    time.sleep(2)

print('Generation complete!', flush=True)
