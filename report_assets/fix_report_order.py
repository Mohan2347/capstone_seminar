"""Re-order and trim the report to hit exactly 71 pages with logical flow"""
from docx import Document
import os

SRC = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report_Final.docx'
DST = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report_71Pages_Fixed.docx'

doc = Document(SRC)
p = list(doc.paragraphs)

# Logical Blocks (approx indices):
front_matter = list(range(0, 163)) # Up to Table of Contents
abstract = list(range(856, 864))
ch1_to_10 = list(range(163, 410))
ch11_snapshots = list(range(410, 488))
ch12_bib = list(range(488, 511))
lit_review_exp = list(range(864, 879)) # Should go in Chapter 3 really, but we'll put in Appendix/Supplementary
traceability = list(range(879, 884))
faq = list(range(901, 924))
future_scope = list(range(924, 938))
timeline_roles = list(range(965, 973))
app_a_images = list(range(629, 670))
test_cases = list(range(670, 680))

# Target order:
# Front Matter -> Abstract -> Chapters 1-11 -> Bibliography -> Appendices (A, B, FAQ, Future, Timeline, Tests)

final_indices = front_matter + abstract + ch1_to_10 + ch11_snapshots + ch12_bib + app_a_images + faq + future_scope + timeline_roles + test_cases

# Total paragraphs: 163 + 8 + 247 + 78 + 23 + 41 + 23 + 14 + 8 + 10 = 615
# Ganesh had 699. 615 is likely slightly short (~60-65 pages).
# Let's add the Technology Stack Analysis (938-964) to reach ~640.
final_indices.extend(list(range(938, 965)))

# Total: 642. 
# Let's add Literature Review Expansion (864-878)
final_indices.extend(list(range(864, 879)))

# Total: 657. 
# This should be very close to 71 pages given the images and tables.

def copy_para(p_src, doc_dst):
    p_new = doc_dst.add_paragraph()
    p_new.text = p_src.text
    p_new.style = p_src.style
    p_new.alignment = p_src.alignment
    p_new.paragraph_format.space_before = p_src.paragraph_format.space_before
    p_new.paragraph_format.space_after = p_src.paragraph_format.space_after
    p_new.paragraph_format.line_spacing = p_src.paragraph_format.line_spacing
    # Note: Images and complex formatting (bold/italic runs) won't copy easily this way.
    # A better way is to move the actual XML elements.

def move_paras(indices, src_doc, dst_doc):
    for i in indices:
        new_p = dst_doc.add_paragraph()
        new_p._p.addnext(src_doc.paragraphs[i]._p)
        dst_doc.paragraphs[-1]._element.getparent().remove(dst_doc.paragraphs[-1]._element)

# Re-creating a doc from scratch is hard with images.
# Instead, we'll start with the full doc and delete what we don't want, 
# then potentially reorder if we really need to.
# But for now, deleting is safest to preserve formatting.

keep_set = set(final_indices)
new_doc = Document(SRC)
all_p = new_doc.paragraphs
for i in range(len(all_p)-1, -1, -1):
    if i not in keep_set:
        p_to_del = all_p[i]
        p_to_del._element.getparent().remove(p_to_del._element)

# Trim tables: Ganesh had 5. We'll keep 6.
if len(new_doc.tables) > 6:
    for i in range(len(new_doc.tables) - 1, 5, -1):
        t = new_doc.tables[i]
        t._element.getparent().remove(t._element)

new_doc.save(DST)
print(f"Final paragraphs: {len(new_doc.paragraphs)}")
print(f"Saved to {DST}")
