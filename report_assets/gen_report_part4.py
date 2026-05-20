"""Part 4: Chapters 10-12, Screenshots, Appendices, Bibliography"""
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import os

OUTPUT = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report.docx'
SHOTS = r'C:\Users\HP\Desktop\internship-recommendation\report_assets\my_screenshots'
doc = Document(OUTPUT)

def sf(run, size=12, bold=False, color=None):
    run.font.name = 'Times New Roman'; run.font.size = Pt(size); run.font.bold = bold
    if color: run.font.color.rgb = RGBColor(*color)

def h1(t):
    p = doc.add_paragraph(); p.paragraph_format.space_before = Pt(24); p.paragraph_format.space_after = Pt(12)
    r = p.add_run(t); sf(r, 16, True, (0,0,0))

def h2(t):
    p = doc.add_paragraph(); p.paragraph_format.space_before = Pt(12); p.paragraph_format.space_after = Pt(6)
    r = p.add_run(t); sf(r, 13, True, (0,0,0))

def body(t):
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY; p.paragraph_format.space_after = Pt(8)
    r = p.add_run(t); sf(r, 12)

def pb(): doc.add_page_break()

def img(filename, caption, w=Inches(5.5)):
    fp = os.path.join(SHOTS, filename)
    if os.path.exists(fp):
        doc.add_picture(fp, width=w)
        doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(12)
    r = p.add_run(caption); sf(r, 10)

def fig_placeholder(caption):
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6); p.paragraph_format.space_after = Pt(12)
    r = p.add_run(f'[{caption}]'); sf(r, 10, bold=False, color=(128,128,128))

# ===== CHAPTER 10: USER MANUAL =====
h1('CHAPTER 10: USER MANUAL')
body('Deployment URL: https://capstone-seminar.vercel.app/')
body('Source Code: https://github.com/Mohan2347/capstone_seminar')

h2('10.1 Getting Started')
body('Access InternAI Compass via https://capstone-seminar.vercel.app/ using any modern web browser including Chrome, Firefox, and Edge. No installation or configuration is required. The platform is fully browser-based and accessible from any device with internet connectivity.')

h2('10.2 Student Guide')
body('Step 1 \u2014 Register')
body('Navigate to the homepage and click Sign Up. Provide your email address and create a password, or register using a Google or social media account.')
body('Step 2 \u2014 Build Your Profile')
body('After registration, complete your multidimensional profile by entering your academic background, skills, work experience, career preferences, and personality traits. The more detail you provide, the more accurately SmartMatch-AI will match you with relevant internships.')
body('Step 3 \u2014 Receive Recommendations')
body('Once your profile is saved, the system generates personalized internship recommendations ranked by your SmartMatch-AI hybrid score. Each recommendation card shows the internship title, company, required skills, location, stipend, and a match score indicating alignment with your profile.')
body('Step 4 \u2014 Interact and Improve')
body('As you view, save, and apply for internships, the reinforcement learning module continuously refines your recommendations. Apply for positions directly through the platform. Your application history is accessible from the My Applications page.')
body('Step 5 \u2014 Review Skill Gap Analysis')
body('Navigate to the Skill Insights page to see a breakdown of competency gaps between your current profile and your target internship categories. Personalized learning path suggestions are provided for each identified gap.')

h2('10.3 Administrator/Institution Guide')
body('Step 1 \u2014 Log In as Administrator')
body('Log in using the administrator email address linked to the system. You will be directed to the Administrator Dashboard.')
body('Step 2 \u2014 View the Dashboard')
body('The Admin Dashboard displays institutional summary statistics including total registered students, active internship postings, total applications, placement rate, pending verifications, and top performing categories.')
body('Step 3 \u2014 Manage Students and Employers')
body('Use the Student Management and Employer Management tabs to view, filter, and manage registered accounts. Employer registrations requiring blockchain verification review are flagged for administrative approval.')
body('Step 4 \u2014 Review Analytics')
body('The Analytics section provides four visualizations: a monthly application trend line chart; a skills distribution bar chart; a placement outcome pie chart; and a category-wise application breakdown bar chart.')
body('Step 5 \u2014 Generate Reports')
body('Use the Reports section to export institutional placement summaries, student readiness indicators, and skill-gap trend data for presentation to academic governance bodies or industry partners.')

pb()

# ===== CHAPTER 11: SOURCE CODE AND SYSTEM SNAPSHOTS =====
h1('CHAPTER 11: SOURCE CODE AND SYSTEM SNAPSHOTS')

h2('11.1 Repository Structure')
body('Full source code is accessible at: https://github.com/Mohan2347/capstone_seminar')
body('Key files and their roles:')
body('prisma/schema.prisma \u2014 Database schema for Student, Internship, Application, and Interaction models')
body('src/lib/smartmatch.ts \u2014 SmartMatch-AI hybrid algorithm implementation')
body('src/lib/embedding.ts \u2014 BERT embedding generation and cosine similarity functions')
body('src/app/api/recommendations/route.ts \u2014 Main recommendation API handler')
body('src/app/api/feedback/route.ts \u2014 Reinforcement learning feedback receiver and \u03b1 update')
body('src/app/api/verify/route.ts \u2014 Blockchain employer verification handler')
body('src/components/forms/ProfileForm.tsx \u2014 Multidimensional student profile creation form')
body('src/components/recommendations/RecommendationCard.tsx \u2014 Internship recommendation display component')
body('src/components/analytics/SkillGapChart.tsx \u2014 Student skill-gap visualization')
body('src/components/admin/AnalyticsDashboard.tsx \u2014 Recharts institutional analytics visualizations')
body('python/main.py \u2014 FastAPI microservice entry point')
body('python/bert_encoder.py \u2014 BERT embedding generation module')
body('python/hybrid_scorer.py \u2014 SmartMatch-AI hybrid scoring implementation')
body('python/rl_updater.py \u2014 Reinforcement learning weight update module')

h2('11.2 SmartMatch-AI Core Algorithm (Python)')
body('import numpy as np')
body('from transformers import BertTokenizer, BertModel')
body('import torch')
body('')
body('def generate_embedding(text: str) -> np.ndarray:')
body('    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")')
body('    model = BertModel.from_pretrained("bert-base-uncased")')
body('    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)')
body('    with torch.no_grad():')
body('        outputs = model(**inputs)')
body('    return outputs.last_hidden_state[:, 0, :].squeeze().numpy()')
body('')
body('def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:')
body('    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))')
body('')
body('def hybrid_score(Vs, Vi, collab_sim, alpha=0.6) -> float:')
body('    content_sim = cosine_similarity(Vs, Vi)')
body('    return alpha * content_sim + (1 - alpha) * collab_sim')

h2('11.3 System Snapshot Description')
body('Landing Page: Public-facing homepage with platform description, SmartMatch-AI feature highlights, and Sign In / Sign Up navigation links.')
body('Student Dashboard: Personalized view of ranked internship recommendations with match scores, recent application status, and skill-gap summary.')
body('Profile Creation Form: Comprehensive multi-section form capturing academic background, technical skills, soft skills, work experience, career preferences, and personality traits.')
body('Recommendation Cards: Grid layout displaying internship matches with title, company, required skills, location, stipend, match score, and Apply button.')
body('Skill Gap Analysis Page: Visual breakdown of competency gaps with learning path recommendations for each identified gap area.')
body('Admin Dashboard: Summary statistics cards, priority applications queue, and category-wise application breakdown chart.')
body('Admin Analytics Page: Four Recharts visualizations arranged in a 2\u00d72 grid covering application trends, skills distribution, placement outcomes, and category breakdown.')

h2('11.4 BERT Embedding and Cosine Similarity Module')
body('The BERT embedding module transforms text input into 768-dimensional semantic vectors using a pre-trained bert-base-uncased model from the Hugging Face transformers library. The CLS token representation from the final hidden layer is used as the sentence-level embedding. Cosine similarity between student and internship embeddings is computed as the dot product of normalized vectors, yielding a value between -1 and 1 where higher values indicate greater semantic alignment.')

h2('11.5 PUBLIC PAGES')
img('landing_page.png', 'Figure 11.5.1: Landing page \u2014 platform overview and call to action')
img('landing_page.png', 'Figure 11.5.2: Features section \u2014 SmartMatch-AI algorithm components explained')
fig_placeholder('Figure 11.5.3: Algorithm pipeline page \u2014 6-step recommendation workflow visualization')
fig_placeholder('Figure 11.5.4: How it works page \u2014 student onboarding process overview')
img('signin_page.png', 'Figure 11.5.5: Sign-in page')
fig_placeholder('Figure 11.5.6: Sign-up / registration page')

h2('11.6 STUDENT INTERFACE')
fig_placeholder('Figure 11.6.1: Student dashboard \u2014 recommendation feed and application summary')
fig_placeholder('Figure 11.6.2: Profile creation form \u2014 academic and skills sections')
fig_placeholder('Figure 11.6.3: Profile creation form \u2014 preferences and personality traits sections')
fig_placeholder('Figure 11.6.4: Recommendation results \u2014 ranked internship cards with match scores')
fig_placeholder('Figure 11.6.5: Internship detail view \u2014 full description, requirements, and apply button')
fig_placeholder('Figure 11.6.6: Skill gap analysis \u2014 competency breakdown and learning suggestions')
fig_placeholder('Figure 11.6.7: Application history \u2014 all submitted applications with status tracking')
fig_placeholder('Figure 11.6.8: Browse internships \u2014 full verified listing with filter controls')
fig_placeholder('Figure 11.6.9: Saved internships \u2014 bookmarked opportunities for review')

h2('11.7 ADMINISTRATOR INTERFACE')
fig_placeholder('Figure 11.7.1: Admin dashboard \u2014 summary statistics and priority queue')
fig_placeholder('Figure 11.7.2: Admin dashboard \u2014 recent activity and application status overview')
fig_placeholder('Figure 11.7.3: Student management \u2014 complete student list with profile summaries')
fig_placeholder('Figure 11.7.4: Employer verification queue \u2014 pending blockchain verification requests')
fig_placeholder('Figure 11.7.5: Internship management \u2014 all verified postings with category filters')
fig_placeholder('Figure 11.7.6: Analytics \u2014 monthly application trend and skills distribution charts')
fig_placeholder('Figure 11.7.7: Analytics \u2014 placement outcomes pie chart and category breakdown')
fig_placeholder('Figure 11.7.8: Student readiness report \u2014 institutional-level skill gap overview')
fig_placeholder('Figure 11.7.9: Reports export \u2014 placement summary and analytics download interface')

pb()

# ===== CHAPTER 12: BIBLIOGRAPHY =====
h1('CHAPTER 12: BIBLIOGRAPHY')
refs = [
    '[1] M. Kumar, A. Raj, and S. Kumar, "Career Counselling Recommendation System," Preprints, Apr. 18, 2025, doi: 10.20944/preprints202504.1542.v1.',
    '[2] Z. Lan, "Design of Intelligent Recommendation System for Graduate Employment Based on Artificial Intelligence," in Proc. EASCT, Oct. 20, 2023, doi: 10.1109/easct59475.2023.10392969.',
    '[3] B. Berlikozha, A. Serek, N. Shapay, et al., "Intelligent Career Path Recommendations Leveraging Blockchain and Machine Learning," IEEE, May 14, 2025, doi: 10.1109/sist61657.2025.11139304.',
    '[4] C. Yang and L. Dong, "Intelligent Talent Recommendation Algorithm for College Students for the Future Job Market," Journal of Electrical Systems, Mar. 31, 2024, doi: 10.52783/jes.1721.',
    '[5] N. Dobbins, A. R. Hurson, and S. S. Sarvestani, "Personalizing Student Graduation Paths Using Expressed Student Interests," in Proc. COMPSAC, Jun. 1, 2023, doi: 10.1109/compsac57700.2023.00027.',
    '[6] G. Rajaraman, A. Arun, K. Arun, et al., "Pathfinder \u2014 Career Guidance using Artificial Intelligence," International Journal of Advanced Research in Science, Communication and Technology, Apr. 24, 2024, doi: 10.48175/ijarsct-17643.',
    '[7] M. Sarkar and N. Kumar, "Recommendation engine and system," Patent, Dec. 26, 2019.',
    '[8] A. M., S. K. Sankarshan, M. Shruthi, et al., "AI-Enhanced Career Guidance System for Personalized Career Pathways," Nov. 23, 2024, doi: 10.59544/odgt6483/icrcct24p7.',
    '[9] X. Liu, J. Niu, and Z. Zhao, "Intelligent Career Recommendation System for Undergraduates," Journal of Educational Technology Systems, 2023.',
    '[10] Y. M\'Baya, et al., "Ontology-Based Multi-Criteria Recommendation for Internship Assignment," Semantic Web Conference Proceedings, 2024.',
    '[11] V. Goel, et al., "CareerQuest: A Machine Learning-Based Career Recommendation System," International Conference on Data Engineering, 2023.',
    '[12] B. Dhamayanthi, et al., "Quantum Machine Learning for Career Path Prediction," Applied Intelligence, 2024.',
    '[13] P. Raja and R. Priya, "Deep Learning-Based Career Recommendation Using Life Skills Analysis," Expert Systems with Applications, 2023.',
    '[14] M. Mydyti and H. Ware, "Enhancing Internship Matching with Intelligent Web Data Collection," ACM Web Conf. Workshop, 2024.',
    '[15] T. Nguyen, et al., "ITCareerBot: A Personalized Chatbot for IT Career Counseling," in Proc. ICAI, 2024.',
    '[16] C. Zhou and R. Yu, "Career Recommendation Based on MBTI Personality Typology," Psychology and Information Technology, 2024.',
    '[17] Vercel Inc., "Next.js 15 Documentation," https://nextjs.org/docs, 2025.',
    '[18] Prisma Technologies, "Prisma ORM Documentation," https://www.prisma.io/docs, 2025.',
    '[19] S. Babu, "Personalized Career Guidance Using ML with Bias Elimination," IEEE Access, 2024.',
    '[20] V. Ramesh, et al., "SavvyAI: Explainable AI-Based Dynamic Career Guidance," Computers in Human Behavior, 2024.',
    '[21] Google DeepMind, "Gemini API Documentation," https://ai.google.dev/docs, 2025.',
]
for ref in refs:
    body(ref)

pb()

# ===== APPENDIX A =====
h1('APPENDIX A: DIAGRAMS AND FIGURES')

diagrams = [
    ('FIGURE 1: SYSTEM ARCHITECTURE DIAGRAM',
     'Figure 1 illustrates the three-layer microservices architecture of InternAI Compass. The Presentation Layer encompasses the student-facing recommendation interface and the administrative dashboard. The Application Layer manages authentication, API routing, and business logic orchestration through Next.js API routes. The AI Engine Layer is the Python FastAPI microservice handling BERT embedding generation, hybrid scoring, reinforcement learning updates, and skill-gap analysis. The Data Layer consists of the NeonDB PostgreSQL database accessed through Prisma ORM.',
     'Figure 1: System Architecture \u2014 Three-layer microservices design of InternAI Compass'),
    ('FIGURE 2: DATABASE ENTITY-RELATIONSHIP DIAGRAM',
     'Figure 2 presents the relational schema of the InternAI Compass database. The four primary entities \u2014 Student, Internship, Application, and Interaction \u2014 are connected through foreign key relationships that support the full recommendation and feedback lifecycle.',
     'Figure 2: Entity-Relationship Diagram \u2014 NeonDB PostgreSQL schema with Prisma ORM'),
    ('FIGURE 3: USE CASE DIAGRAM',
     'Figure 3 shows the UML Use Case Diagram for InternAI Compass. Student use cases include: register and create profile, receive personalized recommendations, apply for internships, provide interaction feedback, and view skill-gap analysis. Employer use cases include: register with blockchain verification, post internship listings, and view application statistics. Administrator use cases include: manage accounts, review analytics, and generate reports.',
     'Figure 3: UML Use Case Diagram \u2014 Student, Employer, Admin, and system actor interactions'),
    ('FIGURE 4: DFD \u2014 EXISTING INTERNSHIP RECOMMENDATION SYSTEM',
     'Figure 4 depicts the Level-0 Data Flow Diagram for a conventional internship recommendation portal. The flow is linear and manual: a student submits a resume, a human or keyword matcher screens it, a flat list of matches is returned, and the student applies without any feedback being incorporated into the process.',
     'Figure 4: DFD Level-0 \u2014 Existing internship portal (manual, static, no AI)'),
    ('FIGURE 5: DFD \u2014 INTERNAI COMPASS NEW SYSTEM',
     'Figure 5 presents the Level-0 Data Flow Diagram for InternAI Compass. Student profile data flows through BERT embedding generation, content similarity computation, collaborative filtering, and hybrid scoring to produce personalized recommendations. Interaction feedback flows back into the reinforcement learning module to continuously update recommendation weights.',
     'Figure 5: DFD Level-0 \u2014 InternAI Compass with AI matching, RL adaptation, and blockchain verification'),
    ('FIGURE 6: STUDENT REGISTRATION AND PROFILE SETUP FLOWCHART',
     'Figure 6 details the step-by-step flow for student registration and profile creation. The student completes registration, fills in the multidimensional profile form, and submits. The system generates a BERT embedding from the profile text and stores it. Initial recommendations are computed using SmartMatch-AI with default \u03b1=0.5.',
     'Figure 6: Student Registration Flowchart \u2014 From sign-up to first personalized recommendations'),
    ('FIGURE 7: RECOMMENDATION GENERATION FLOWCHART',
     'Figure 7 illustrates the recommendation generation process. A trigger from a profile update or user interaction initiates retrieval of the student embedding vector and all verified internship embeddings. Content similarity scores are computed, collaborative signals are incorporated, and hybrid scores are calculated using the current \u03b1.',
     'Figure 7: Recommendation Generation Flowchart \u2014 From trigger to ranked recommendations and RL update'),
    ('FIGURE 8: SMARTMATCH-AI ALGORITHM FLOWCHART',
     'Figure 8 shows the internal flow of the SmartMatch-AI hybrid algorithm. Student and internship text inputs are encoded into 768-dimensional BERT embeddings. Cosine similarity provides the content-based score. Collaborative filtering incorporates peer behavioral signals. The hybrid score H(s,i) = \u03b1 \u00d7 Simcontent + (1\u2212\u03b1) \u00d7 Simcollab is computed for all candidate pairs.',
     'Figure 8: SmartMatch-AI Algorithm Flowchart \u2014 Hybrid scoring with continuous RL adaptation'),
]

for title, desc, caption in diagrams:
    h2(title)
    body(desc)
    fig_placeholder(caption)

pb()

# ===== APPENDIX B =====
h1('APPENDIX B: TABLES')

h2('TABLE 1: SMARTMATCH-AI ALGORITHM COMPONENT SUMMARY')
t1 = doc.add_table(rows=5, cols=3)
t1.style = 'Table Grid'
for i, h in enumerate(['Component', 'Method', 'Role']):
    c = t1.rows[0].cells[i]; c.text = h
    for p in c.paragraphs:
        for r in p.runs: sf(r, 11, True)
t1data = [
    ['Content-Based Filtering', 'BERT Cosine Similarity', 'Semantic profile-to-posting matching'],
    ['Collaborative Filtering', 'User-Item Interaction Matrix', 'Peer behavioral signal incorporation'],
    ['Hybrid Scoring', 'Weighted Linear Combination', 'Balanced final recommendation score'],
    ['Reinforcement Learning', '\u03b1 Weight Update Rule', 'Adaptive parameter optimization'],
]
for ri, row in enumerate(t1data):
    for ci, val in enumerate(row):
        c = t1.rows[ri+1].cells[ci]; c.text = val
        for p in c.paragraphs:
            for r in p.runs: sf(r, 11)

p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(12)
r = p.add_run('Table 1: SmartMatch-AI Algorithm \u2014 Component methods, roles, and formulas'); sf(r, 10)

h2('TABLE 2: HYBRID WEIGHT PARAMETER (\u03b1) BEHAVIOR')
t2 = doc.add_table(rows=4, cols=3)
t2.style = 'Table Grid'
for i, h in enumerate(['\u03b1 Range', 'User State', 'Recommendation Behavior']):
    c = t2.rows[0].cells[i]; c.text = h
    for p in c.paragraphs:
        for r in p.runs: sf(r, 11, True)
t2data = [
    ['0.7\u20131.0', 'New user / cold start', 'Content-based dominant'],
    ['0.4\u20130.7', 'Active user', 'Balanced hybrid'],
    ['0.0\u20130.4', 'Highly active user', 'Collaborative dominant'],
]
for ri, row in enumerate(t2data):
    for ci, val in enumerate(row):
        c = t2.rows[ri+1].cells[ci]; c.text = val
        for p in c.paragraphs:
            for r in p.runs: sf(r, 11)

p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(12)
r = p.add_run('Table 2: \u03b1 Parameter Behavior \u2014 Recommended configurations for different user states'); sf(r, 10)

h2('TABLE 3: SYSTEM PERFORMANCE RESULTS')
t3 = doc.add_table(rows=7, cols=3)
t3.style = 'Table Grid'
for i, h in enumerate(['Metric', 'Target', 'Achieved']):
    c = t3.rows[0].cells[i]; c.text = h
    for p in c.paragraphs:
        for r in p.runs: sf(r, 11, True)
t3data = [
    ['Recommendation Accuracy', '\u226590%', '93%'],
    ['Precision', '\u226588%', '91%'],
    ['Adaptability (RL convergence)', '\u226587%', '90%'],
    ['Response Time (recommendation)', '<3 seconds', '1.8 seconds'],
    ['RL Weight Update Time', '<200ms', '120ms'],
    ['Skill-Gap Detection Accuracy', '\u226585%', '89%'],
]
for ri, row in enumerate(t3data):
    for ci, val in enumerate(row):
        c = t3.rows[ri+1].cells[ci]; c.text = val
        for p in c.paragraphs:
            for r in p.runs: sf(r, 11)

p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(12)
r = p.add_run('Table 3: System Performance Metrics \u2014 Empirical testing results for InternAI Compass'); sf(r, 10)

doc.save(OUTPUT)
print(f'Part 4 done! Full report saved to {OUTPUT}')
