import os
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def load_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def assemble_report():
    template_path = r"C:\Users\HP\Downloads\ganesh_report.docx"
    output_path = r"C:\Users\HP\Desktop\FINAL_INTERNAI_COMPASS_REPORT.docx"
    
    # Load all content
    c1_3 = load_file("Chapter_1_3.txt")
    c4_6 = load_file("Chapter_4_6.txt")
    c7_9 = load_file("Chapter_7_9.txt")
    c10_12 = load_file("Chapter_10_12.txt")
    
    doc = Document(template_path)
    
    # 1. Title Page and Identity Replacement
    replacements = {
        "AI-EMPOWERED URBAN GOVERNANCE SYSTEM": "INTERNAI COMPASS",
        "A UNIFIED FRAMEWORK FOR CIVIC ISSUE REPORTING AND RESOLUTION": "AN INTELLIGENT HYBRID RECOMMENDATION ENGINE FOR PERSONALIZED AND EQUITABLE INTERNSHIP PATHWAYS",
        "Nithesh Reddy Minam Reddy Gari": "Y.N.V. Mahesh Reddy",
        "Krishnan Guna Shaker": "T. Bhanu Prakesh",
        "S Deeraj Kumar Reddy": "G.M.V.R. Reddy",
        "Ganesh Maddala": "Vemuri Gowtham",
        "M Siva Nagi Reddy": "Dudekula Rahim",
        "Venkata Naga Chiranjeevi Kotari": "K. Venkata Sai",
        "12201492": "12201492", # Keep same or update if needed
        "Guna444/AI-Based-Civic-Issue-Reporting-System": "Mohan2347/capstone_seminar",
        "ai-civic-issue.vercel.app": "capstone-seminar.vercel.app",
        "Ms. Isha Khughar": "Ms. Isha Khughar"
    }

    for p in doc.paragraphs:
        for key, val in replacements.items():
            if key in p.text:
                for run in p.runs:
                    if key in run.text:
                        run.text = run.text.replace(key, val)

    # 2. Content Replacement (Strategic approach: replace by Chapter headings)
    content_map = {
        "CHAPTER 1:": c1_3.split("## CHAPTER 1:")[1].split("## CHAPTER 2:")[0],
        "CHAPTER 2:": c1_3.split("## CHAPTER 2:")[1].split("## CHAPTER 3:")[0],
        "CHAPTER 3:": c1_3.split("## CHAPTER 3:")[1],
        "CHAPTER 4:": c4_6.split("## CHAPTER 4:")[1].split("## CHAPTER 5:")[0],
        "CHAPTER 5:": c4_6.split("## CHAPTER 5:")[1].split("## CHAPTER 6:")[0],
        "CHAPTER 6:": c4_6.split("## CHAPTER 6:")[1],
        "CHAPTER 7:": c7_9.split("## CHAPTER 7:")[1].split("## CHAPTER 8:")[0],
        "CHAPTER 8:": c7_9.split("## CHAPTER 8:")[1].split("## CHAPTER 9:")[0],
        "CHAPTER 9:": c7_9.split("## CHAPTER 9:")[1],
        "CHAPTER 10:": c10_12.split("## CHAPTER 10:")[1].split("## CHAPTER 11:")[0],
        "CHAPTER 11:": c10_12.split("## CHAPTER 11:")[1].split("## CHAPTER 12:")[0],
        "CHAPTER 12:": c10_12.split("## CHAPTER 12:")[1]
    }

    # For each chapter, find the start and end, and replace text
    for chap_header, text in content_map.items():
        found = False
        for idx, p in enumerate(doc.paragraphs):
            if chap_header in p.text.upper():
                found = True
                # Clear all paragraphs until next chapter
                next_p_idx = idx + 1
                while next_p_idx < len(doc.paragraphs) and "CHAPTER" not in doc.paragraphs[next_p_idx].text.upper():
                    doc.paragraphs[next_p_idx].text = ""
                    next_p_idx += 1
                
                # Insert the new text into the first cleared paragraph
                doc.paragraphs[idx+1].text = text.strip()
                # Apply standard formatting
                for run in doc.paragraphs[idx+1].runs:
                    run.font.name = 'Times New Roman'
                    run.font.size = Pt(12)

    # 3. Insert Images into Chapter 6
    img_arch = r"C:\Users\HP\.gemini\antigravity\brain\4d446f91-1ec0-4bc3-8feb-b0cd1930a8ce\internai_compass_architecture_1777382356632.png"
    img_flow = r"C:\Users\HP\.gemini\antigravity\brain\4d446f91-1ec0-4bc3-8feb-b0cd1930a8ce\smartmatch_ai_flowchart_1777382377701.png"
    
    for p in doc.paragraphs:
        if "6.1 SYSTEM DESIGN" in p.text.upper():
            new_p = doc.add_paragraph()
            run = new_p.add_run()
            if os.path.exists(img_arch):
                run.add_picture(img_arch, width=Inches(5.5))
                new_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if "6.5 FLOWCHARTS" in p.text.upper():
            new_p = doc.add_paragraph()
            run = new_p.add_run()
            if os.path.exists(img_flow):
                run.add_picture(img_flow, width=Inches(5.5))
                new_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.save(output_path)
    print(f"Final perfect report saved to {output_path}")

if __name__ == "__main__":
    assemble_report()
