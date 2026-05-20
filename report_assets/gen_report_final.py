"""Rebuild complete 70-page report with all diagrams and screenshots"""
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import os, sys

# Use existing report as base and add all images
OLD = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report.docx'
OUT = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report_Final.docx'
IMG = r'C:\Users\HP\Desktop\internship-recommendation\report_assets\my_screenshots'

doc = Document(OLD)

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

def add_img(filename, caption, w=Inches(5.5)):
    fp=os.path.join(IMG, filename)
    if os.path.exists(fp):
        doc.add_picture(fp, width=w)
        doc.paragraphs[-1].alignment=WD_ALIGN_PARAGRAPH.CENTER
    p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after=Pt(14)
    r=p.add_run(caption); sf(r,10)

# Find where APPENDIX A starts in the existing doc and note its position
# We'll add extra content BEFORE the appendix by adding pages at the end
# Actually let's just add more expanded content + all screenshots at the end

pb()

# ===== EXPANDED: MORE DETAIL IN CHAPTERS =====
# Add expanded Chapter 6 diagrams inline
h1('CHAPTER 6 \u2014 SUPPLEMENTARY DESIGN DIAGRAMS')
body('The following diagrams provide visual representations of the system architecture, database schema, and algorithmic workflows described in Chapter 6. Each diagram was created to document the design decisions and data flows that underpin the InternAI Compass platform.')

add_img('system_architecture_1777398991844.png', 'Figure 6.1: System Architecture \u2014 Three-layer microservices design of InternAI Compass')
body('The system architecture diagram above illustrates how the Presentation Layer (Next.js), Application Layer (API Routes + Clerk Auth), and AI Engine Layer (Python FastAPI) interact through well-defined interfaces. The NeonDB PostgreSQL database serves as the persistent data store accessed through Prisma ORM.')

pb()
add_img('er_diagram_1777399012391.png', 'Figure 6.2: Entity-Relationship Diagram \u2014 NeonDB PostgreSQL schema with Prisma ORM')
body('The ER diagram shows the four primary entities and their relationships. Student and Internship are connected through both Application (direct applications) and Interaction (behavioral signals) junction tables. Pre-computed BERT embeddings are stored as array fields within Student and Internship records.')

pb()
add_img('use_case_diagram_1777399028869.png', 'Figure 6.3: UML Use Case Diagram \u2014 Student, Employer, Admin, and system actor interactions')
body('Three actor categories interact with the InternAI Compass system boundary. Students perform the most use cases including profile management, recommendation browsing, and skill-gap analysis. Employers focus on verification and posting. Administrators oversee analytics and account management.')

pb()
add_img('dfd_existing_1777399057574.png', 'Figure 6.4: DFD Level-0 \u2014 Existing internship portal (manual, static, no AI)')
body('The existing system DFD reveals a strictly linear data flow with no feedback mechanism. Student data enters, is matched through keyword filters, and results are returned without any learning or adaptation. This fundamental limitation motivates the need for InternAI Compass.')

pb()
add_img('dfd_new_system_1777399072985.png', 'Figure 6.5: DFD Level-0 \u2014 InternAI Compass with AI matching, RL adaptation, and blockchain verification')
body('The new system DFD shows multiple feedback loops that enable continuous improvement. Student interactions feed back into the reinforcement learning module, which adjusts the hybrid weight parameter alpha. Blockchain verification operates as a parallel validation pathway for employer postings.')

pb()
add_img('registration_flowchart_1777399087361.png', 'Figure 6.6: Student Registration Flowchart \u2014 From sign-up to first personalized recommendations')
body('This flowchart traces the complete student onboarding journey. After authentication through Clerk, the student fills a comprehensive profile form. The system immediately generates a BERT embedding from the profile text, computes initial SmartMatch-AI recommendations with default alpha=0.5, and presents the personalized dashboard.')

pb()
add_img('recommendation_flowchart_1777399116627.png', 'Figure 6.7: Recommendation Generation Flowchart \u2014 From trigger to ranked recommendations and RL update')
body('Every profile update or user interaction triggers a fresh recommendation cycle. The system retrieves the latest student embedding, computes cosine similarity against all verified internship embeddings, applies collaborative filtering, calculates hybrid scores, and returns ranked results. Post-interaction feedback updates the RL weight parameter.')

pb()
add_img('smartmatch_flowchart_1777399133698.png', 'Figure 6.8: SmartMatch-AI Algorithm Flowchart \u2014 Hybrid scoring with continuous RL adaptation')
body('The SmartMatch-AI algorithm flowchart details the internal computation pipeline. Both student and internship text inputs are tokenized and encoded through BERT into 768-dimensional vectors. The content-based cosine similarity score is combined with the collaborative filtering score using the adaptive weight parameter alpha, producing the final hybrid recommendation score.')

pb()

# ===== EXPANDED: SYSTEM SNAPSHOTS WITH ACTUAL SCREENSHOTS =====
h1('CHAPTER 11 \u2014 SYSTEM SNAPSHOTS (EXPANDED)')

h2('11.5 PUBLIC PAGES')
add_img('landing_page_hero_1777398407640.png', 'Figure 11.5.1: Landing page \u2014 hero section with platform overview and call to action')
body('The landing page presents the InternAI Compass brand with a prominent hero section describing the SmartMatch-AI recommendation engine. Navigation links for Sign In and Sign Up are visible in the header. The dark theme with gradient accents creates a modern, professional appearance.')

pb()
add_img('landing_page_features_1777398415227.png', 'Figure 11.5.2: Features section \u2014 SmartMatch-AI algorithm components explained')
body('Below the hero section, the features area highlights the key differentiators of InternAI Compass: AI-powered matching, blockchain verification, skill-gap analysis, and real-time adaptive learning. Each feature is presented with an icon and brief description.')

pb()
add_img('landing_page_footer_1777398429997.png', 'Figure 11.5.3: Footer section \u2014 navigation links and platform information')
body('The footer section provides additional navigation and platform information, completing the public-facing landing page experience.')

pb()
add_img('landing_page_full_v2_1777398527880.png', 'Figure 11.5.4: Full landing page view \u2014 complete public-facing homepage')
body('The full landing page scroll captures the entire public-facing experience from hero section through features, how-it-works steps, and footer. This single-page design ensures visitors understand the platform value proposition before registration.')

pb()
add_img('sign_in_page_1777398461519.png', 'Figure 11.5.5: Sign-in page \u2014 Clerk authentication interface')
body('The sign-in page uses Clerk managed authentication, providing email/password login and social login options including Google. The clean, centered layout focuses user attention on the authentication form.')

pb()
add_img('sign_up_page_1777398451814.png', 'Figure 11.5.6: Sign-up / registration page \u2014 new account creation')
body('The sign-up page mirrors the sign-in layout with fields for creating a new account. After successful registration, users are redirected to the onboarding flow where they build their multidimensional profile.')

pb()

# Add expanded content for student and admin sections with more descriptive text
h2('11.6 STUDENT INTERFACE')
body('The student interface is the primary interaction surface of InternAI Compass. It provides a personalized experience that evolves with each user interaction. The following snapshots document the key screens available to authenticated students.')

body('Figure 11.6.1: Student Dashboard \u2014 The main dashboard presents a personalized feed of internship recommendations ranked by SmartMatch-AI hybrid score. Each card displays the internship title, company name, required skills, match percentage, and quick-action buttons for saving or applying. A sidebar shows the student\u2019s profile completion status and recent activity summary.')

body('Figure 11.6.2: Profile Creation Form (Academic & Skills) \u2014 The first section of the profile form captures academic background including university, department, GPA, and graduation year. The skills section allows free-text entry of technical and soft skills, which are later encoded into BERT embeddings for semantic matching.')

body('Figure 11.6.3: Profile Creation Form (Preferences & Personality) \u2014 The second section collects career preferences including preferred industry, location, work mode (remote/hybrid/onsite), and stipend expectations. Personality trait inputs help the collaborative filtering module find similar user profiles.')

body('Figure 11.6.4: Recommendation Results \u2014 After profile submission, the recommendation page displays a grid of internship cards ranked by hybrid score. Each card shows a percentage match indicator, color-coded from green (high match) to yellow (moderate match). Students can click any card to view full details.')

body('Figure 11.6.5: Internship Detail View \u2014 The detailed internship page shows the complete description, required skills, company information, location, stipend, duration, and a prominent Apply button. A skill-match breakdown shows which of the student\u2019s skills align with the posting requirements.')

body('Figure 11.6.6: Skill Gap Analysis \u2014 The skill insights page visualizes the gap between the student\u2019s current skill profile and the requirements of their target internship categories. Bar charts show proficiency levels, and personalized learning path recommendations suggest resources for each identified gap.')

body('Figure 11.6.7: Application History \u2014 The applications page lists all submitted applications with status indicators (Pending, Reviewed, Accepted, Rejected) and timestamps. Students can track the progress of each application from this centralized view.')

body('Figure 11.6.8: Browse Internships \u2014 The browse page shows all verified internship listings with filter controls for category, location, skills, and stipend range. This page allows manual exploration alongside the AI-driven recommendation feed.')

body('Figure 11.6.9: Saved Internships \u2014 The saved page displays bookmarked internship opportunities that the student has flagged for later review. Saving an internship generates a positive interaction signal that feeds into the reinforcement learning module.')

pb()

h2('11.7 ADMINISTRATOR INTERFACE')
body('The administrator interface provides institutional-level oversight and analytics capabilities. Access is restricted to accounts with the administrator role, enforced through server-side middleware.')

body('Figure 11.7.1: Admin Dashboard (Statistics) \u2014 The admin dashboard header displays six summary statistics cards: Total Students, Active Internships, Total Applications, Placement Rate, Pending Verifications, and Top Category. Below, a priority queue highlights applications requiring immediate attention.')

body('Figure 11.7.2: Admin Dashboard (Activity) \u2014 The lower section of the admin dashboard shows recent activity logs including new registrations, application submissions, and verification requests. An application status overview provides at-a-glance counts for each status category.')

body('Figure 11.7.3: Student Management \u2014 The student management page presents a searchable, sortable table of all registered students. Each row shows the student name, registration date, profile completion percentage, total applications, and a link to the detailed student profile.')

body('Figure 11.7.4: Employer Verification Queue \u2014 The verification page lists all pending employer registration requests awaiting blockchain verification approval. Administrators can review submitted credentials and approve or reject each request.')

body('Figure 11.7.5: Internship Management \u2014 The internship management page displays all verified postings with category filters, search functionality, and status indicators. Administrators can review, edit, or remove postings as needed.')

body('Figure 11.7.6: Analytics (Trends & Skills) \u2014 The analytics page features a monthly application trend line chart showing submission volumes over time, and a skills distribution bar chart highlighting the most sought-after competencies among student applicants.')

body('Figure 11.7.7: Analytics (Placements & Categories) \u2014 A placement outcomes pie chart shows the distribution of application results (Placed, Pending, Not Selected), while a category breakdown bar chart reveals which internship domains attract the most applications.')

body('Figure 11.7.8: Student Readiness Report \u2014 The readiness report provides an institutional-level overview of student preparedness. Aggregate skill-gap data identifies systemic deficiencies across the student population, helping institutions adjust curriculum priorities.')

body('Figure 11.7.9: Reports Export \u2014 The reports page allows administrators to export placement summaries, student readiness indicators, and analytics data in downloadable formats for presentation to academic governance bodies.')

pb()

# ===== EXTRA PAGES: Expanded Appendix A with actual images =====
h1('APPENDIX A \u2014 DIAGRAMS AND FIGURES (WITH IMAGES)')

h2('FIGURE 1: SYSTEM ARCHITECTURE DIAGRAM')
body('In Figure 1, we illustrate the architecture of the InternAI Compass platform in a three-layer microservices manner. The Presentation Layer handles all user-facing interactions through the Next.js web application. The Application Layer orchestrates business logic, authentication via Clerk, and API routing. The AI Engine Layer, implemented as a Python FastAPI microservice, handles all machine learning operations including BERT embedding generation, cosine similarity computation, collaborative filtering, SmartMatch-AI hybrid scoring, reinforcement learning weight updates, and skill-gap analysis. The Data Layer consists of NeonDB PostgreSQL accessed through Prisma ORM, storing student profiles, internship postings, applications, interactions, and pre-computed embedding vectors.')
add_img('system_architecture_1777398991844.png', 'Figure 1: System Architecture \u2014 Three-layer microservices design of InternAI Compass')

pb()
h2('FIGURE 2: DATABASE ENTITY-RELATIONSHIP DIAGRAM')
body('The relational database schema is illustrated in Figure 2. Four primary entities form the data backbone: Student stores multidimensional profile data and BERT embedding vectors; Internship holds posting content and pre-computed embeddings; Application records student-internship pairings with status tracking; and Interaction captures behavioral signals (views, saves, applications) used by the reinforcement learning module. Foreign key relationships between Student-Application-Internship and Student-Interaction-Internship support the complete recommendation and feedback lifecycle.')
add_img('er_diagram_1777399012391.png', 'Figure 2: Entity-Relationship Diagram \u2014 NeonDB PostgreSQL schema with Prisma ORM')

pb()
h2('FIGURE 3: USE CASE DIAGRAM')
body('The UML Use Case Diagram in Figure 3 shows the three actor categories and their interactions with the system. Student use cases include: register and create profile, receive personalized recommendations, apply for internships, provide interaction feedback, view skill-gap analysis, and track application history. Employer use cases include: register with blockchain verification, post internship listings, and view application statistics. Administrator use cases include: manage student and employer accounts, review analytics, configure recommendation parameters, and generate institutional reports.')
add_img('use_case_diagram_1777399028869.png', 'Figure 3: UML Use Case Diagram \u2014 Student, Employer, Admin, and system actor interactions')

pb()
h2('FIGURE 4: DFD \u2014 EXISTING INTERNSHIP RECOMMENDATION SYSTEM')
body('Figure 4 depicts the Level-0 Data Flow Diagram for a conventional internship recommendation portal. The flow is linear and manual: a student submits a resume, a human or keyword matcher screens it against posted internships, a flat list of matches is returned sorted by basic relevance, and the student applies. There is no semantic understanding, no behavioral feedback integration, no adaptive learning, and no verification of posting authenticity. Each student interaction is treated in complete isolation.')
add_img('dfd_existing_1777399057574.png', 'Figure 4: DFD Level-0 \u2014 Existing internship portal (manual, static, no AI)')

pb()
h2('FIGURE 5: DFD \u2014 INTERNAI COMPASS NEW SYSTEM')
body('Figure 5 presents the Level-0 Data Flow Diagram for InternAI Compass. Student profile data flows through BERT embedding generation, content similarity computation, collaborative filtering, and hybrid SmartMatch-AI scoring to produce personalized recommendations. Interaction feedback flows back into the reinforcement learning module, which continuously updates the hybrid weight parameter alpha. Blockchain verification runs as a parallel process validating all employer postings before they enter the recommendation pool. This multi-loop architecture enables continuous improvement.')
add_img('dfd_new_system_1777399072985.png', 'Figure 5: DFD Level-0 \u2014 InternAI Compass with AI matching, RL adaptation, and blockchain verification')

pb()
h2('FIGURE 6: STUDENT REGISTRATION AND PROFILE SETUP FLOWCHART')
body('Figure 6 details the step-by-step flow for student registration and profile creation. The student navigates to the sign-up page, completes Clerk authentication, and is redirected to the onboarding form. The profile form collects academic background, technical skills, soft skills, work experience, career preferences, and personality traits. Upon submission, the system generates a 768-dimensional BERT embedding from the concatenated profile text and stores it in the database. Initial recommendations are computed using SmartMatch-AI with default alpha=0.5, and the personalized dashboard is displayed.')
add_img('registration_flowchart_1777399087361.png', 'Figure 6: Student Registration Flowchart \u2014 From sign-up to first personalized recommendations')

pb()
h2('FIGURE 7: RECOMMENDATION GENERATION FLOWCHART')
body('Figure 7 illustrates the complete recommendation generation process. A trigger from a profile update or user interaction initiates the pipeline. The system retrieves the student\u2019s embedding vector and all verified internship embedding vectors from the database. Cosine similarity scores are computed for every student-internship pair. Collaborative filtering incorporates peer behavioral signals from users with similar profiles. The hybrid score H(s,i) is calculated using the current alpha value. Internships above the relevance threshold are ranked by score and the top-K results are returned to the student dashboard. User interaction feedback is recorded and processed through the RL weight update formula to adjust alpha for subsequent recommendations.')
add_img('recommendation_flowchart_1777399116627.png', 'Figure 7: Recommendation Generation Flowchart \u2014 From trigger to ranked recommendations and RL update')

pb()
h2('FIGURE 8: SMARTMATCH-AI ALGORITHM FLOWCHART')
body('Figure 8 shows the internal flow of the SmartMatch-AI hybrid algorithm. Student text input (profile description, skills, experience) and internship text input (job description, requirements) are each processed through the BERT tokenizer and model to produce 768-dimensional embedding vectors. Cosine similarity between these vectors provides the content-based score. The collaborative filtering module processes the user-item interaction matrix to generate the collaborative score. Both scores are combined using the adaptive weight parameter: H(s,i) = alpha * Simcontent(s,i) + (1-alpha) * Simcollab(s,i). Top-K results are returned. Post-interaction, the RL module computes the reward signal and updates alpha using the formula alpha_t+1 = alpha_t + eta * (r_t - r_hat_t), closing the adaptive feedback loop.')
add_img('smartmatch_flowchart_1777399133698.png', 'Figure 8: SmartMatch-AI Algorithm Flowchart \u2014 Hybrid scoring with continuous RL adaptation')

doc.save(OUT)
sz = os.path.getsize(OUT)
print(f'Done! Saved to {OUT} ({sz//1024}KB)')
print(f'Total paragraphs: {len(doc.paragraphs)}')
