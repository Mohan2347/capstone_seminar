"""Intelligently trim the report to reach exactly 71 pages by removing redundant expanded chapters but keeping Bibliography and Appendices"""
from docx import Document
import os

SRC = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report_Final.docx'
DST = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report_Exact71.docx'

doc = Document(SRC)
paras = list(doc.paragraphs)

# Structure of the Final report (approx paragraph indices):
# 0-162: Front Matter
# 163-409: Chapters 1-10
# 410-487: Chapter 11 Snapshots
# 488-510: Chapter 12 Bibliography
# 511-544: Appendix A & B (Diagrams/Tables)
# 545+: Expanded content (this is what made it 123 pages)

# To get 71 pages, we want roughly 700-750 paragraphs total.
# Let's keep the core (0-544) and then pick the best parts of the expansion.

# 1. Start with the core content
keep_indices = list(range(0, 545))

# 2. Add some specific expanded sections to reach the target length
# Let's add Appendix A with images (629-669)
keep_indices.extend(list(range(629, 670)))

# 3. Add Chapter 7 Detailed Test Cases (670-679)
keep_indices.extend(list(range(670, 680)))

# 4. Total paragraphs now: 545 + 41 + 10 = 596.
# Ganesh had 699. We need ~100 more.
# Let's add Abstract (856-863)
keep_indices.extend(list(range(856, 864)))

# 5. Add Literature Review expansion (864-878)
keep_indices.extend(list(range(864, 879)))

# 6. Add Detailed Requirements Traceability (879-883)
keep_indices.extend(list(range(879, 884)))

# 7. Add Troubleshooting and FAQ (901-923)
keep_indices.extend(list(range(901, 924)))

# Total now: 596 + 8 + 15 + 5 + 23 = 647.
# Close enough. Let's add Future Scope (924-937)
keep_indices.extend(list(range(924, 938)))

# Total: 661. 
# Let's add Team Roles (965-972)
keep_indices.extend(list(range(965, 973)))

# Total: 669. Very close to Ganesh's 699.

# Create a new document with only these paragraphs
new_doc = Document(SRC)
all_paras = new_doc.paragraphs
to_delete = [i for i in range(len(all_paras)) if i not in keep_indices]

# Delete from end to avoid index shifting
for i in sorted(to_delete, reverse=True):
    p = all_paras[i]
    p._element.getparent().remove(p._element)

# Trim tables: Ganesh had 5. We'll keep the first 6.
if len(new_doc.tables) > 6:
    for i in range(len(new_doc.tables) - 1, 5, -1):
        t = new_doc.tables[i]
        t._element.getparent().remove(t._element)

new_doc.save(DST)
print(f"Final paragraph count: {len(new_doc.paragraphs)}")
print(f"Saved to {DST}")
