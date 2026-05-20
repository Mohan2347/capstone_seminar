"""
Part 1: Generate the InternAI Compass DOCX report using Ganesh's formatting.
This script clones Ganesh's doc structure and replaces content with our project data.
"""
from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn
import os, copy

OUTPUT = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report.docx'
SCREENSHOTS = r'C:\Users\HP\Desktop\internship-recommendation\report_assets\my_screenshots'

doc = Document()

# ---- Page Setup (A4, Ganesh margins) ----
section = doc.sections[0]
section.page_width = Inches(8.27)
section.page_height = Inches(11.69)
section.left_margin = Inches(1.5)
section.right_margin = Inches(1.0)
section.top_margin = Inches(1.0)
section.bottom_margin = Inches(1.0)

# ---- Helper functions ----
def set_font(run, name='Times New Roman', size=12, bold=False, color=None):
    run.font.name = name
    run.font.size = Pt(size)
    run.font.bold = bold
    if color:
        run.font.color.rgb = RGBColor(*color)

def add_para(text, size=12, bold=False, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=Pt(6), space_before=Pt(0), color=None):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_after = space_after
    p.paragraph_format.space_before = space_before
    run = p.add_run(text)
    set_font(run, size=size, bold=bold, color=color)
    return p

def add_heading_styled(text, level=1):
    """Add heading matching Ganesh's format: Times New Roman, bold, black"""
    p = doc.add_paragraph()
    if level == 1:
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(24)
        p.paragraph_format.space_after = Pt(12)
        run = p.add_run(text)
        set_font(run, size=16, bold=True, color=(0,0,0))
    else:
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(6)
        run = p.add_run(text)
        set_font(run, size=13, bold=True, color=(0,0,0))
    return p

def add_body(text):
    return add_para(text, size=12, bold=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=Pt(8))

def add_image_with_caption(img_path, caption, width=Inches(5.5)):
    if os.path.exists(img_path):
        doc.add_picture(img_path, width=width)
        last_paragraph = doc.paragraphs[-1]
        last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap = doc.add_paragraph()
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = cap.add_run(caption)
        set_font(run, size=10, bold=False)
        cap.paragraph_format.space_after = Pt(12)
    else:
        p = add_para(f'[Screenshot: {caption}]', size=10, align=WD_ALIGN_PARAGRAPH.CENTER)

def page_break():
    doc.add_page_break()

# ===================== COVER PAGE =====================
add_para('', size=12)  # spacing
add_para('CAPSTONE PROJECT REPORT', size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(4))
add_para('(Project Term: January \u2013 May 2026)', size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(20))
add_para('', size=12)
add_para('AN INTELLIGENT HYBRID RECOMMENDATION ENGINE FOR', size=14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(2))
add_para('PERSONALIZED AND EQUITABLE INTERNSHIP PATHWAYS', size=14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(20))
add_para('', size=12)
add_para('Submitted by', size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(12))
add_para('', size=6)

students = [
    ('Y.N.V. Mahesh Reddy', '12205712'),
    ('Thanuku Bhanu Prakash', '12207122'),
    ('Gudibandi Mohan Venkata Rami Reddy', '12212347'),
    ('Vemuri Gowtham', '12206324'),
    ('Dudekula Rahim', '12203852'),
    ('Kunchapu Venkata Sai', '12221281'),
]
for name, reg in students:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(f'{name:<50} Registration Number: {reg}')
    set_font(run, size=12, bold=True)
    p.paragraph_format.space_after = Pt(2)

add_para('', size=6)
add_para('Project Group Number: 2RGC0535', size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(2))
add_para('Course Code: CSE439', size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(12))
add_para('', size=6)
add_para('Under the Guidance of', size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(4))
add_para('Ms. Neha Koul', size=12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(2))
add_para('Assistant Professor', size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(2))
add_para('Area of Specialization: Artificial Intelligence and Machine Learning', size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(20))
add_para('', size=12)
add_para('School of Computer Science and Engineering', size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=Pt(6))
add_para('', size=6)
add_para('Lovely Professional University, Phagwara, Punjab', size=12, align=WD_ALIGN_PARAGRAPH.CENTER)

page_break()

# ===================== PAC FORM =====================
add_heading_styled('PAC FORM')
add_para('(To be attached as per university format)', size=12, align=WD_ALIGN_PARAGRAPH.CENTER)

page_break()

# ===================== DECLARATION =====================
add_heading_styled('DECLARATION')
add_body('We hereby declare that the project work entitled "An Intelligent Hybrid Recommendation Engine for Personalized and Equitable Internship Pathways" is an authentic record of our own work carried out as requirements of Capstone Project for the award of B.Tech degree in Computer Science and Engineering from Lovely Professional University, Phagwara, under the guidance of Ms. Neha Koul, during January to May 2026. All the information furnished in this capstone project report is based on our own intensive work and is genuine.')
add_para('', size=6)
add_para('Project Group Number: 2RGC0535', size=12, bold=False)
add_para('', size=6)

for i, (name, reg) in enumerate(students):
    add_para(f'Name of Student: {name}', size=12)
    add_para(f'Registration Number: {reg}', size=12, space_after=Pt(4))
    add_para('', size=4)

for i in range(1, 7):
    add_para(f'              (Signature of Student {i})', size=12, space_after=Pt(2))
    add_para('               Date:', size=12, space_after=Pt(8))

page_break()

# ===================== CERTIFICATE =====================
add_heading_styled('CERTIFICATE')
add_body('This is to certify that the declaration statement made by this group of students is correct to the best of my knowledge and belief. They have completed this Capstone Project under my guidance and supervision. The present work is the result of their original investigation, effort and study. No part of the work has ever been submitted for any other degree at any University. The Capstone Project is fit for the submission and partial fulfillment of the conditions for the award of B.Tech degree in Computer Science and Engineering from Lovely Professional University, Phagwara.')
add_para('', size=12)
add_para('Signature and Name of the Mentor', size=12)
add_para('', size=6)
add_para('Designation', size=12)
add_para('', size=6)
add_para('School of Computer Science and Engineering,', size=12)
add_para('Lovely Professional University,', size=12, space_after=Pt(2))
add_para('Phagwara, Punjab.', size=12)
add_para('', size=6)
add_para('Date:', size=12)

page_break()

# ===================== ACKNOWLEDGEMENT =====================
add_heading_styled('ACKNOWLEDGEMENT')
add_body('This project would not have been possible without the support and encouragement of several individuals, and we sincerely take this opportunity to express our gratitude to each of them.')
add_body('We extend our heartfelt thanks to our faculty mentor, Ms. Neha Koul, Assistant Professor, School of Computer Science and Engineering, Lovely Professional University, for her consistent guidance, academic insight, and unwavering support throughout every stage of this project. Her constructive feedback and depth of knowledge in artificial intelligence and machine learning helped us refine our design, overcome technical challenges, and produce a research-quality outcome.')
add_body('We are deeply grateful to the School of Computer Science and Engineering and Lovely Professional University for providing us with an enriching academic environment, computational resources, and the intellectual freedom to pursue a project of this magnitude.')
add_body('Our sincere thanks go to the open-source communities behind Next.js, Python, and the broader AI and machine learning ecosystems \u2014 including the contributors to BERT, TensorFlow, and the Hugging Face library. Without these tools, building a system of this complexity within our timeline would not have been achievable.')
add_body('We also acknowledge Google for providing access to the Gemini API, which powered key components of our intelligent recommendation and analytics layer, and to Vercel for their reliable hosting platform that made our live deployment possible.')
add_body('Finally, we thank our families and peers for their patience, encouragement, and moral support. This project began with ambition and uncertainty; it concludes with a working system we are genuinely proud of.')

page_break()

# ===================== TABLE OF CONTENTS =====================
add_heading_styled('TABLE OF CONTENTS')
add_para('', size=6)

toc_items = [
    ('Inner first page', '(i)'),
    ('PAC form', '(ii)'),
    ('Declaration', '(iii)'),
    ('Certificate', '(iv)'),
    ('Acknowledgement', '(v)'),
    ('Table of Contents', '(vi)'),
]
for item, pg in toc_items:
    p = doc.add_paragraph()
    run = p.add_run(f'{item}{"."*60}{pg}')
    set_font(run, size=12)

add_para('', size=6)

toc_chapters = [
    ('1.', 'Introduction', '9'),
    ('', '1.1. Overview', '9'),
    ('', '1.2. Objective of the Project', '10'),
    ('', '1.3. Description of the Project', '10'),
    ('', '1.4. Scope of the Project', '11'),
    ('', '1.5. Use Case Model', '11'),
    ('', '1.6. System Description', '11'),
    ('', '1.7. Customer and User Profiles', '12'),
    ('', '1.8. Assumptions and Dependencies', '12'),
    ('', '1.9. Functional Requirements', '12'),
    ('', '1.10. Non-Functional Requirements', '13'),
    ('2.', 'PROFILE OF THE PROBLEM, RATIONALE AND SCOPE', '13'),
    ('', '2.1. Introduction to the Problem', '13'),
    ('', '2.2. Rationale for the Proposed System', '14'),
    ('', '2.3. Problem Statement', '14'),
    ('', '2.4. Scope of the Study', '14'),
    ('3.', 'EXISTING SYSTEM', '15'),
    ('', '3.1. Introduction', '15'),
    ('', '3.2. Existing Software and Platforms', '15'),
    ('', '3.3. Data Flow Diagram for the Existing System', '16'),
    ('', '3.4. What Is New in the System to be Developed', '16'),
    ('4.', 'PROBLEM ANALYSIS', '17'),
    ('', '4.1. Product Definition', '17'),
    ('', '4.2. Feasibility Analysis', '17'),
    ('', '4.3. Project Plan', '18'),
    ('5.', 'SOFTWARE REQUIREMENT ANALYSIS', '19'),
    ('', '5.1. Introduction', '19'),
    ('', '5.2. General Description', '19'),
    ('', '5.3. Specific Requirements', '20'),
    ('6.', 'DESIGN', '22'),
    ('', '6.1. System Design', '22'),
    ('', '6.2. Database Design', '23'),
    ('', '6.3. Design Notations', '23'),
    ('', '6.4. Detailed Design', '23'),
    ('', '6.5. Flowcharts', '25'),
    ('', '6.6. Pseudo Code', '26'),
    ('7.', 'TESTING', '27'),
    ('', '7.1. Functional Testing', '27'),
    ('', '7.2. Structural Testing', '27'),
    ('', '7.3. Levels of Testing', '28'),
    ('', '7.4. Testing the Project \u2014 Results Summary', '29'),
    ('8.', 'IMPLEMENTATION', '30'),
    ('', '8.1. Implementation of the Project', '30'),
    ('', '8.2. Technology Stack Summary', '31'),
    ('', '8.3. Conversion Plan', '31'),
    ('', '8.4. Post-Implementation and Software Maintenance', '32'),
    ('9.', 'PROJECT LEGACY', '32'),
    ('', '9.1. Current Status of the Project', '32'),
    ('', '9.2. Remaining Areas of Concern', '33'),
    ('', '9.3. Technical and Managerial Lessons Learnt', '33'),
    ('10.', 'USER MANUAL', '34'),
    ('', '10.1. Getting Started', '34'),
    ('', '10.2. Student Guide', '34'),
    ('', '10.3. Administrator/Institution Guide', '35'),
    ('11.', 'SOURCE CODE AND SYSTEM SNAPSHOTS', '37'),
    ('', '11.1. Repository Structure', '38'),
    ('', '11.2. SmartMatch-AI Core Algorithm (Python)', '38'),
    ('', '11.3. System Snapshot Description', '39'),
    ('', '11.4. BERT Embedding and Cosine Similarity Module', '40'),
    ('', '11.5. Public Pages', '40'),
    ('', '11.6. Student Interface', '42'),
    ('', '11.7. Administrator Interface', '51'),
    ('12.', 'BIBLIOGRAPHY', '60'),
    ('', 'APPENDIX A: DIAGRAMS AND FIGURES', '62'),
    ('', 'APPENDIX B: TABLES', '70'),
]
for num, title, pg in toc_chapters:
    prefix = f'{num}     ' if num else '       '
    p = doc.add_paragraph()
    dots = '.' * max(5, 60 - len(prefix + title))
    run = p.add_run(f'{prefix}{title}{dots}{pg}')
    set_font(run, size=12)
    p.paragraph_format.space_after = Pt(1)

page_break()

# Save intermediate
doc.save(OUTPUT)
print(f'Part 1 done - saved to {OUTPUT}')
