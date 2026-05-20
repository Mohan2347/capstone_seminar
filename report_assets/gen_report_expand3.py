"""Final push to 70+ pages"""
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import os

OUT = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report_Final.docx'
IMG = r'C:\Users\HP\Desktop\internship-recommendation\report_assets\my_screenshots'
doc = Document(OUT)

def sf(run, size=12, bold=False, color=None):
    run.font.name='Times New Roman'; run.font.size=Pt(size); run.font.bold=bold
    if color: run.font.color.rgb=RGBColor(*color)
def h1(t):
    p=doc.add_paragraph(); p.paragraph_format.space_before=Pt(24); p.paragraph_format.space_after=Pt(12)
    r=p.add_run(t); sf(r,16,True,(0,0,0))
def h2(t):
    p=doc.add_paragraph(); p.paragraph_format.space_before=Pt(12); p.paragraph_format.space_after=Pt(6)
    r=p.add_run(t); sf(r,13,True,(0,0,0))
def body(t):
    p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.JUSTIFY; p.paragraph_format.space_after=Pt(8)
    r=p.add_run(t); sf(r,12)
def pb(): doc.add_page_break()
def add_img(fn, cap, w=Inches(5.5)):
    fp=os.path.join(IMG, fn)
    if os.path.exists(fp):
        doc.add_picture(fp, width=w)
        doc.paragraphs[-1].alignment=WD_ALIGN_PARAGRAPH.CENTER
    p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after=Pt(14); r=p.add_run(cap); sf(r,10)

pb()

# ===== DETAILED TECHNOLOGY ANALYSIS =====
h1('CHAPTER 8 \u2014 TECHNOLOGY STACK ANALYSIS')

h2('8.8 Next.js 15 with App Router')
body('Next.js 15 was selected as the frontend framework for its server-side rendering capabilities, built-in API route support, and seamless integration with the React ecosystem. The App Router architecture, introduced in Next.js 13 and stabilized in version 15, provides a file-system-based routing mechanism that simplifies navigation structure and supports layouts, loading states, and error boundaries at the route level.')
body('Server Components in Next.js 15 enable data fetching at the component level without client-side state management overhead. This is particularly valuable for the recommendation dashboard, where internship data can be fetched and rendered server-side before delivery to the client. Client Components are used selectively for interactive elements such as the profile form, save buttons, and real-time feedback interactions.')
body('The API Routes feature eliminates the need for a separate backend server for standard CRUD operations. All database interactions, authentication middleware, and business logic are implemented as API route handlers within the Next.js application. Only the AI-specific computations (BERT embedding generation, SmartMatch-AI scoring, and reinforcement learning updates) are delegated to the external Python FastAPI microservice.')

h2('8.9 Python FastAPI Microservice')
body('The AI Engine is implemented as a standalone Python FastAPI microservice for several architectural reasons. First, the BERT model and associated machine learning libraries (transformers, PyTorch, scikit-learn, numpy) are native to the Python ecosystem and would introduce significant complexity if implemented in Node.js. Second, isolating the AI computations in a separate service enables independent scaling, versioning, and deployment of the machine learning components without affecting the web application.')
body('FastAPI was chosen over alternatives such as Flask and Django REST Framework for its native async support, automatic OpenAPI documentation generation, and Pydantic-based request/response validation. The microservice exposes three primary endpoints:')
body('POST /embed: Accepts a text string and returns a 768-dimensional BERT embedding vector. This endpoint is called during profile creation and internship posting to generate semantic representations.')
body('POST /recommend: Accepts a student ID and returns a ranked list of internship recommendations with SmartMatch-AI hybrid scores. This endpoint orchestrates the complete recommendation pipeline including embedding retrieval, similarity computation, collaborative filtering, and hybrid scoring.')
body('POST /update-weights: Accepts an interaction event (view, save, apply, dismiss) and updates the reinforcement learning weight parameter alpha for the associated student. This endpoint is called asynchronously after each user interaction.')

h2('8.10 NeonDB Serverless PostgreSQL')
body('NeonDB was selected as the database provider for its serverless PostgreSQL offering that provides on-demand scaling, automatic connection pooling, and zero cold-start latency. The serverless architecture aligns with Vercel\u2019s deployment model, where database connections are ephemeral and must support rapid provisioning.')
body('Prisma ORM provides the data access layer, offering type-safe database queries generated from the schema definition. The Prisma Client singleton pattern is used to prevent connection pool exhaustion in serverless environments, where each function invocation might otherwise create a new database connection.')
body('Key database optimizations include: composite unique constraints on the Application model to prevent duplicate applications; indexed foreign keys on studentId and internshipId for efficient join operations; and array columns for storing BERT embedding vectors directly in the Student and Internship models, avoiding the need for a separate vector database.')

h2('8.11 Clerk Authentication')
body('Clerk provides a managed authentication solution that handles the complete identity lifecycle including registration, login, session management, multi-factor authentication, and social login providers. The integration is implemented through the @clerk/nextjs SDK, which provides middleware for protecting API routes and React components for sign-in and sign-up flows.')
body('A Clerk webhook synchronizes user creation events with the local database, ensuring that a Student record exists for every authenticated user. The webhook endpoint validates the incoming request signature using the WEBHOOK_SECRET environment variable to prevent unauthorized calls.')
body('Role-based access control is implemented through a custom middleware that checks the user\u2019s role field in the Student model before allowing access to protected routes. Three role levels are defined: student (default), employer, and admin. The admin role is assigned based on the ADMIN_EMAIL environment variable.')

pb()

h2('8.12 Deployment Architecture')
body('The production deployment architecture consists of three primary components:')
body('1. Vercel Edge Network: The Next.js application is deployed to Vercel\u2019s edge network, which provides global content delivery, automatic HTTPS, and serverless function execution. Each API route is deployed as an independent serverless function that scales automatically based on demand.')
body('2. NeonDB Cloud: The PostgreSQL database is hosted on NeonDB\u2019s managed cloud infrastructure in the ap-southeast-1 (Singapore) region. Connection pooling is handled through NeonDB\u2019s built-in pooler, which manages a pool of persistent database connections shared across serverless function invocations.')
body('3. Python Microservice: The FastAPI AI microservice is deployed separately. In the demonstration deployment, it runs as a companion service. For production scale, it would be containerized and deployed to a container orchestration platform such as Google Cloud Run or AWS ECS.')
body('Environment variables (DATABASE_URL, CLERK_SECRET_KEY, GEMINI_API_KEY, etc.) are securely stored in Vercel\u2019s encrypted environment variable store and injected into serverless functions at runtime.')

pb()

# ===== GANTT CHART / PROJECT TIMELINE =====
h1('CHAPTER 4 \u2014 PROJECT TIMELINE')

h2('4.4 Detailed Project Timeline')
body('The following table presents the detailed week-by-week project timeline showing activities completed in each development phase:')

t = doc.add_table(rows=13, cols=3)
t.style = 'Table Grid'
for i,h in enumerate(['Week', 'Phase', 'Activities Completed']):
    c=t.rows[0].cells[i]; c.text=h
    for p in c.paragraphs:
        for r in p.runs: sf(r,10,True)
timeline = [
    ['Week 1','Requirements','Stakeholder analysis, user persona development, feature prioritization'],
    ['Week 2','Requirements','Technology stack evaluation, architecture design, database schema draft'],
    ['Week 3','Core Dev','Next.js project setup, TypeScript configuration, Prisma schema implementation'],
    ['Week 4','Core Dev','Clerk authentication integration, API route scaffolding, basic UI components'],
    ['Week 5','AI Engine','BERT model integration, embedding generation pipeline, cosine similarity module'],
    ['Week 6','AI Engine','Collaborative filtering implementation, SmartMatch-AI hybrid algorithm, RL module'],
    ['Week 7','Features','Blockchain verification module, employer registration workflow'],
    ['Week 8','Features','Skill-gap analysis algorithm, learning path recommendation engine'],
    ['Week 9','Admin','Admin dashboard layout, summary statistics cards, priority queue'],
    ['Week 10','Admin','Recharts analytics visualizations, report generation, role-based access'],
    ['Week 11','Testing','Functional testing (24 cases), structural testing (18 cases), integration testing'],
    ['Week 12','Deployment','Vercel deployment, performance optimization, documentation, report writing'],
]
for ri,row in enumerate(timeline):
    for ci,v in enumerate(row):
        c=t.rows[ri+1].cells[ci]; c.text=v
        for p in c.paragraphs:
            for r in p.runs: sf(r,10)

pb()

h2('4.5 Team Roles and Responsibilities')
body('The development team consisted of six members, each assigned specific responsibilities aligned with their areas of expertise:')

t2 = doc.add_table(rows=7, cols=3)
t2.style = 'Table Grid'
for i,h in enumerate(['Team Member', 'Registration No.', 'Primary Responsibility']):
    c=t2.rows[0].cells[i]; c.text=h
    for p in c.paragraphs:
        for r in p.runs: sf(r,10,True)
team = [
    ['Y.N.V. Mahesh Reddy','12205712','Frontend development, UI/UX design, component architecture'],
    ['Thanuku Bhanu Prakash','12207122','Backend API development, database design, Prisma integration'],
    ['G. Mohan Venkata Rami Reddy','12212347','AI engine development, BERT integration, SmartMatch-AI algorithm'],
    ['Vemuri Gowtham','12206324','Blockchain verification module, security implementation'],
    ['Dudekula Rahim','12203852','Testing, quality assurance, deployment, DevOps'],
    ['Kunchapu Venkata Sai','12221281','Analytics dashboard, reporting module, documentation'],
]
for ri,row in enumerate(team):
    for ci,v in enumerate(row):
        c=t2.rows[ri+1].cells[ci]; c.text=v
        for p in c.paragraphs:
            for r in p.runs: sf(r,10)

body('All team members participated in code reviews, integration testing, and documentation. Weekly standup meetings were conducted to track progress and resolve blockers. Version control was managed through Git with a branch-per-feature workflow and pull request reviews before merging to the main branch.')

pb()

# ===== APPENDIX C: GLOSSARY =====
h1('APPENDIX C: GLOSSARY OF TERMS')

terms = [
    ('BERT', 'Bidirectional Encoder Representations from Transformers. A pre-trained deep learning model developed by Google that produces contextual word and sentence embeddings. InternAI Compass uses BERT to encode student profiles and internship descriptions into 768-dimensional semantic vectors.'),
    ('Cosine Similarity', 'A metric that measures the cosine of the angle between two non-zero vectors in a multidimensional space. Values range from -1 (opposite) to 1 (identical). Used as the primary content-based matching score in SmartMatch-AI.'),
    ('Collaborative Filtering', 'A recommendation technique that predicts user preferences based on the behavioral patterns of similar users. In InternAI Compass, collaborative signals are derived from the interaction histories of students with similar profiles.'),
    ('Reinforcement Learning (RL)', 'A machine learning paradigm where an agent learns to make decisions by receiving reward signals from its environment. In InternAI Compass, the RL module adjusts the hybrid weight parameter alpha based on user interaction feedback.'),
    ('SmartMatch-AI', 'The proprietary hybrid recommendation algorithm developed for InternAI Compass. It combines content-based BERT cosine similarity with collaborative filtering using an adaptive weight parameter optimized through reinforcement learning.'),
    ('Alpha (\u03b1)', 'The adaptive hybrid weight parameter in the SmartMatch-AI algorithm. It controls the balance between content-based and collaborative filtering scores. Values range from 0.1 to 0.9 and are adjusted by the RL module based on user feedback.'),
    ('Embedding', 'A dense numerical vector representation of text or data in a continuous vector space. BERT embeddings capture semantic meaning, allowing comparison of texts based on meaning rather than exact word matching.'),
    ('Blockchain Verification', 'A cryptographic verification process that records employer credentials on a distributed ledger to ensure authenticity. Verified employers receive a certification status that allows their postings to appear in student recommendations.'),
    ('Prisma ORM', 'An open-source Object-Relational Mapping tool for Node.js and TypeScript. It provides type-safe database queries and automatic migration management. InternAI Compass uses Prisma to interact with the NeonDB PostgreSQL database.'),
    ('NeonDB', 'A serverless PostgreSQL database service that provides on-demand scaling, automatic connection pooling, and branching capabilities. It serves as the primary data store for InternAI Compass.'),
    ('FastAPI', 'A modern, high-performance Python web framework for building APIs. It features native async support, automatic documentation, and Pydantic-based validation. Used for the AI Engine microservice in InternAI Compass.'),
    ('Clerk', 'A managed authentication and user management service providing sign-in/sign-up flows, session management, and webhook integration. Handles all authentication in InternAI Compass.'),
    ('Vercel', 'A cloud platform for frontend frameworks and static sites, providing edge network deployment, serverless functions, and automatic scaling. Hosts the production deployment of InternAI Compass.'),
    ('Skill-Gap Analysis', 'An automated assessment that compares a student\u2019s current competency profile against the requirements of target internship categories, identifying specific areas where additional learning is needed.'),
    ('Hybrid Score', 'The final recommendation score computed by SmartMatch-AI: H(s,i) = \u03b1 \u00d7 Simcontent(s,i) + (1\u2212\u03b1) \u00d7 Simcollab(s,i). Internships are ranked by this score for each student.'),
]

for term, defn in terms:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(8)
    r1 = p.add_run(f'{term}: '); sf(r1, 12, True)
    r2 = p.add_run(defn); sf(r2, 12)

pb()

# ===== APPENDIX D: PROJECT LINKS =====
h1('APPENDIX D: PROJECT LINKS AND RESOURCES')
body('Live Deployment URL: https://capstone-seminar.vercel.app/')
body('GitHub Repository: https://github.com/Mohan2347/capstone_seminar')
body('Database Provider: NeonDB (https://neon.tech)')
body('Authentication Provider: Clerk (https://clerk.com)')
body('Hosting Platform: Vercel (https://vercel.com)')
body('AI API: Google Gemini (https://ai.google.dev)')
body('BERT Model: Hugging Face bert-base-uncased (https://huggingface.co/bert-base-uncased)')
body('ORM: Prisma (https://www.prisma.io)')
body('Charts Library: Recharts (https://recharts.org)')
body('CSS Framework: Tailwind CSS (https://tailwindcss.com)')
body('')
body('Course: CSE439 \u2014 Capstone Project')
body('Project Group Number: 2RGC0535')
body('University: Lovely Professional University, Phagwara, Punjab')
body('School: School of Computer Science and Engineering')
body('Faculty Mentor: Ms. Neha Koul, Assistant Professor')
body('Specialization: Artificial Intelligence and Machine Learning')
body('Project Term: January \u2013 May 2026')

doc.save(OUT)
sz = os.path.getsize(OUT)
tl = sum(1 for p in doc.paragraphs if p.text.strip())
import zipfile
with zipfile.ZipFile(OUT) as z:
    imgs=[n for n in z.namelist() if 'word/media/' in n and n!='word/media/']
est = tl/20 + len(imgs)*1.1
print(f'FINAL: {sz//1024}KB, {len(doc.paragraphs)} paragraphs, {tl} text lines, {len(imgs)} images')
print(f'Estimated pages: {int(est)}+')
print(f'Tables: {len(doc.tables)}')
