import os
import re
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def load_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def assemble_perfect_report():
    template_path = r"C:\Users\HP\Downloads\ganesh_report.docx"
    output_path = r"C:\Users\HP\Desktop\FINAL_INTERNAI_COMPASS_PERFECT_REPORT.docx"
    
    # Load all content
    c1_3 = load_file("Chapter_1_3.txt")
    c4_6 = load_file("Chapter_4_6.txt")
    c7_9 = load_file("Chapter_7_9.txt")
    c10_12 = load_file("Chapter_10_12.txt")
    
    doc = Document(template_path)
    
    # 1. Identity Replacements
    replacements = {
        "AI-EMPOWERED URBAN GOVERNANCE SYSTEM": "INTERNAI COMPASS",
        "A UNIFIED FRAMEWORK FOR CIVIC ISSUE REPORTING AND RESOLUTION": "AN INTELLIGENT HYBRID RECOMMENDATION ENGINE FOR PERSONALIZED AND EQUITABLE INTERNSHIP PATHWAYS",
        "Nithesh Reddy Minam Reddy Gari": "Y.N.V. Mahesh Reddy",
        "Krishnan Guna Shaker": "T. Bhanu Prakesh",
        "S Deeraj Kumar Reddy": "G.M.V.R. Reddy",
        "Ganesh Maddala": "Vemuri Gowtham",
        "M Siva Nagi Reddy": "Dudekula Rahim",
        "Venkata Naga Chiranjeevi Kotari": "K. Venkata Sai",
        "Guna444/AI-Based-Civic-Issue-Reporting-System": "Mohan2347/capstone_seminar",
        "ai-civic-issue.vercel.app": "capstone-seminar.vercel.app",
        "Ms. Isha Khughar": "Ms. Isha Khughar"
    }

    for p in doc.paragraphs:
        for key, val in replacements.items():
            if key in p.text:
                p.text = p.text.replace(key, val)
                for run in p.runs:
                    run.font.color.rgb = RGBColor(0, 0, 0)
                    run.bold = False # Reset bold unless it's a heading

    # 2. Map Content Chunks
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

    # 3. Replace Chapter Content
    # We will find the chapter headings and replace everything until the next one
    current_chapter_key = None
    paragraphs_to_remove = []
    
    for i, p in enumerate(doc.paragraphs):
        text = p.text.upper().strip()
        
        # Check if this paragraph is a chapter start
        found_new = False
        for key in content_map.keys():
            if key in text and len(text) < 50:
                current_chapter_key = key
                found_new = True
                # Insert the content right after this heading paragraph
                p.text = current_chapter_key + " " + (re.sub(r'CHAPTER \d+:', '', p.text.upper())).strip()
                # Clear following text until next chapter
                break
        
        if not found_new and current_chapter_key:
            # This is a paragraph inside a chapter. We'll clear it.
            # But we only want to write the new content ONCE at the start of the chapter.
            if i > 0 and current_chapter_key in doc.paragraphs[i-1].text.upper():
                p.text = content_map[current_chapter_key].strip()
                # Force styling
                for run in p.runs:
                    run.font.name = 'Times New Roman'
                    run.font.size = Pt(12)
                    run.font.color.rgb = RGBColor(0, 0, 0)
                    run.bold = False
            else:
                p.text = "" # Clear it to remove friend's text

    # 4. Insert Screenshots and Diagrams
    img_dir = r"C:\Users\HP\.gemini\antigravity\brain\4d446f91-1ec0-4bc3-8feb-b0cd1930a8ce"
    images = {
        "ARCH": os.path.join(img_dir, "internai_compass_architecture_1777382356632.png"),
        "FLOW": os.path.join(img_dir, "smartmatch_ai_flowchart_1777382377701.png"),
        "LAND": os.path.join(img_dir, "landing_1777382830873.png"),
        "AUTH": os.path.join(img_dir, "auth_1777382859992.png"),
        "DASH": os.path.join(img_dir, "dashboard_1777382894561.png")
    }

    # Helper to insert image after a specific text
    def insert_img(trigger_text, img_path, caption):
        for i, p in enumerate(doc.paragraphs):
            if trigger_text in p.text.upper():
                new_p = doc.paragraphs[i+1] # Next paragraph
                run = new_p.add_run()
                if os.path.exists(img_path):
                    run.add_picture(img_path, width=Inches(5.5))
                    new_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    caption_p = doc.add_paragraph(caption)
                    caption_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                break

    insert_img("6.1 SYSTEM DESIGN", images["ARCH"], "Figure 6.1: InternAI Compass System Architecture")
    insert_img("6.5 FLOWCHARTS", images["FLOW"], "Figure 6.2: SmartMatch-AI Algorithm Flowchart")
    insert_img("11.3 SYSTEM SNAPSHOTS", images["LAND"], "Figure 11.1: Project Landing Page")
    insert_img("11.3 SYSTEM SNAPSHOTS", images["AUTH"], "Figure 11.2: Authentication Interface")
    insert_img("11.3 SYSTEM SNAPSHOTS", images["DASH"], "Figure 11.3: Internship Discovery Dashboard")

    doc.save(output_path)
    print(f"Perfectly styled report with diagrams saved to {output_path}")

if __name__ == "__main__":
    assemble_perfect_report()
