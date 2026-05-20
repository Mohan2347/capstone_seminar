"""Trim the massive report to exactly match the length of Ganesh's report (~71 pages)"""
from docx import Document
import os

SRC = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report_Final.docx'
DST = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report_Exact71.docx'

doc = Document(SRC)

# Ganesh's report had 699 paragraphs. 
# We'll target 710 paragraphs to account for potential differences in table/image density.
TARGET_PARAGRAPHS = 715

print(f"Current paragraph count: {len(doc.paragraphs)}")

if len(doc.paragraphs) > TARGET_PARAGRAPHS:
    # Delete paragraphs from the end until we reach the target
    paragraphs = doc.paragraphs
    for i in range(len(paragraphs) - 1, TARGET_PARAGRAPHS - 1, -1):
        p = paragraphs[i]
        p._element.getparent().remove(p._element)

# Also check tables. Ganesh had 5. Our final has 13. 
# Let's keep the first 6 tables and remove the rest.
if len(doc.tables) > 6:
    for i in range(len(doc.tables) - 1, 5, -1):
        t = doc.tables[i]
        t._element.getparent().remove(t._element)

doc.save(DST)
print(f"Final paragraph count: {len(doc.paragraphs)}")
print(f"Final table count: {len(doc.tables)}")
print(f"Saved to {DST}")
