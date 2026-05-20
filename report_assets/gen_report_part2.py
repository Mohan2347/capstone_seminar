"""Part 2: Add all chapters to the report"""
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import os

OUTPUT = r'C:\Users\HP\Downloads\InternAI_Compass_Capstone_Report.docx'
SHOTS = r'C:\Users\HP\Desktop\internship-recommendation\report_assets\my_screenshots'
doc = Document(OUTPUT)

def sf(run, name='Times New Roman', size=12, bold=False, color=None):
    run.font.name = name; run.font.size = Pt(size); run.font.bold = bold
    if color: run.font.color.rgb = RGBColor(*color)

def h1(text):
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(24); p.paragraph_format.space_after = Pt(12)
    r = p.add_run(text); sf(r, size=16, bold=True, color=(0,0,0)); return p

def h2(text):
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(12); p.paragraph_format.space_after = Pt(6)
    r = p.add_run(text); sf(r, size=13, bold=True, color=(0,0,0)); return p

def body(text):
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run(text); sf(r, size=12); return p

def pb(): doc.add_page_break()

def img(path, caption, w=Inches(5.5)):
    fp = os.path.join(SHOTS, path)
    if os.path.exists(fp):
        doc.add_picture(fp, width=w)
        doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(caption); sf(r, size=10); p.paragraph_format.space_after = Pt(12)

# ===== CHAPTER 1 =====
h1('CHAPTER 1: INTRODUCTION')
h2('1.1 Overview')
body('Internship placement has long been a critical milestone in a student\u2019s transition from academic learning to professional practice. However, the process of matching students with the right internship opportunities has historically suffered from inefficiencies rooted in outdated methods of evaluation. Most conventional systems rely on academic metrics such as GPA and standardized scores, which capture only a narrow slice of a student\u2019s actual potential. Soft skills, extracurricular achievements, personality traits, and career aspirations remain largely invisible to these systems, resulting in mismatched placements that leave both students and employers dissatisfied.')
body('The growing availability of artificial intelligence, machine learning, and natural language processing now enables a fundamentally different approach. By modeling student profiles as multidimensional vectors and using contextual understanding to compare them with internship descriptions, it becomes possible to generate recommendations that are both highly personalized and dynamically evolving.')
body('InternAI Compass was created to address exactly this gap. The platform introduces a hybrid intelligent recommendation engine, called SmartMatch-AI, that combines content-based filtering, collaborative filtering, and reinforcement learning to deliver internship matches tailored to every student\u2019s unique profile. Rather than treating student data as static, the system continuously learns from user interactions \u2014 likes, applications, and rejections \u2014 to refine its understanding and improve the relevance of future suggestions.')
body('The platform further distinguishes itself through blockchain-based verification of employer postings, ensuring that all opportunities presented to students are authentic and tamper-proof. A predictive analytics module identifies individual skill gaps and recommends targeted learning paths to enhance employability preparedness. Together, these features create a comprehensive career intelligence ecosystem that bridges the persistent divide between academic preparation and industry requirements.')
body('The platform is live at https://capstone-seminar.vercel.app/ and the source code is publicly accessible at https://github.com/Mohan2347/capstone_seminar.')

h2('1.2 Objective of the Project')
body('The primary objective of this project was to design and deploy an intelligent, AI-driven internship recommendation system that moves beyond conventional academic-metric-based matching. The system achieves this by analyzing multidimensional student profiles \u2014 encompassing skills, academic history, personality traits, and long-term career goals \u2014 using transformer-based NLP embeddings and a hybrid scoring algorithm.')
body('Secondary objectives include the implementation of a reinforcement learning feedback loop that allows the system to adaptively improve its recommendations in real time, the integration of blockchain-based employer verification to eliminate fraudulent postings, and the development of a skill-gap prediction module that provides students with actionable guidance for professional growth. An additional goal was to provide educational institutions with analytics capabilities to monitor placement trends and optimize career development strategies.')

h2('1.3 Description of the Project')
body('The platform serves two primary user groups: students seeking internship placements, and institutional administrators who oversee career development activities. Students interact with a personalized dashboard that presents ranked internship recommendations, skill-gap insights, and career analytics. Administrators access a management interface for monitoring application trends, reviewing student profiles, and generating institutional placement reports.')
body('From the moment a student creates a profile, the system begins building a comprehensive representation of their academic background, skills, preferences, and behavioral interactions. Internship listings are processed using BERT-based transformer embeddings that capture the semantic meaning of job descriptions. The SmartMatch-AI algorithm then computes a hybrid similarity score combining content-based cosine similarity with collaborative signals drawn from the preferences of similar users. A reinforcement learning mechanism continuously adjusts the internal weighting parameter based on live feedback, ensuring that recommendations evolve alongside the student\u2019s growing profile.')

h2('1.4 Scope of the Project')
body('The scope of InternAI Compass encompasses the complete internship recommendation lifecycle, from student registration and profile creation to intelligent matching, real-time feedback integration, and institutional analytics. Key capabilities within scope include BERT-based semantic embedding of student and internship data, hybrid scoring using content and collaborative signals, reinforcement learning-based weight adaptation, blockchain verification of employer authenticity, skill-gap prediction with personalized learning path recommendations, and a real-time analytics dashboard for students and institutions.')
body('The current deployment targets desktop browser access. Future enhancements may include native mobile applications, multi-language support, integration with university ERP systems, and federated learning across institutions to preserve student data privacy while enabling cross-institutional intelligence.')

h2('1.5 Use Case Model')
body('The system involves three categories of actors. The Student actor can register and build a profile, browse and receive personalized internship recommendations, apply for internships, provide interaction feedback, view skill-gap analysis, and track application history. The Employer actor can register and verify their organization through blockchain, post internship opportunities, and monitor application statistics. The Administrator actor can manage student and employer accounts, access institutional analytics, configure recommendation parameters, and generate placement reports.')

h2('1.6 System Description')
body('InternAI Compass is a full-stack web application built on Next.js with a Python-powered AI backend. The frontend presents a responsive, user-friendly interface optimized for desktop browsers. The AI engine operates through a dedicated microservice that handles embedding generation, similarity computation, collaborative filtering, and reinforcement learning updates. Authentication is managed through a secure identity provider, while persistent data is stored in a PostgreSQL database accessed via an ORM layer. The blockchain verification module interfaces with a distributed ledger to validate employer credentials and internship posting integrity.')

h2('1.7 Customer and User Profiles')
body('Primary Users: Students in undergraduate or postgraduate programs who are actively seeking internship opportunities. These users may range from first-year students exploring career options to final-year students seeking industry placements aligned with their specialization. The system is designed to be accessible without requiring prior technical knowledge.')
body('Secondary Users: Career counselors, placement officers, and institutional administrators who use the analytics module to track student readiness, application patterns, and placement outcomes. These users require moderate digital literacy but no specialized technical skills.')

h2('1.8 Assumptions and Dependencies')
body('The system assumes that students possess access to a modern web browser and an internet connection. Profile data, including resume upload and self-reported skills, is assumed to be provided honestly by users. The recommendation engine\u2019s accuracy is dependent on the quality and completeness of submitted profiles.')
body('Key external dependencies include the Gemini API for analytics and generative features, the Hugging Face BERT model for embedding generation, the Vercel platform for deployment, and the NeonDB serverless PostgreSQL database. Continued availability of these services at agreed service levels is assumed.')

h2('1.9 Functional Requirements')
body('Students shall be able to register through email/password or social login and complete a multidimensional profile including academic records, skills, work experience, and personality preferences.')
body('The system shall generate contextual embeddings for student profiles and internship descriptions using a transformer-based NLP model.')
body('The system shall compute cosine similarity between student and internship embeddings as the primary content-based matching score.')
body('The system shall apply collaborative filtering to incorporate behavioral signals from similar users into the recommendation score.')
body('The SmartMatch-AI algorithm shall combine content-based and collaborative scores using an adaptive hybrid weight parameter.')
body('A reinforcement learning mechanism shall update the hybrid weight parameter in response to user interactions including views, saves, and applications.')
body('The system shall verify employer registrations and internship postings through a blockchain-based authentication process.')
body('Students shall receive skill-gap analysis and personalized learning path recommendations based on their profile and target internship categories.')
body('Administrators shall have access to institutional analytics including placement trends, student readiness indicators, and category-wise application statistics.')

h2('1.10 Non-Functional Requirements')
body('The recommendation generation process shall complete within three seconds from profile update or user interaction trigger.')
body('The system shall support concurrent access by multiple users without performance degradation through a serverless architecture.')
body('All non-public routes shall require authenticated sessions using role-based access control.')
body('The system shall maintain a recommendation accuracy above 90% as measured against expert-curated matching benchmarks.')
body('The reinforcement learning weight update shall complete within 200 milliseconds of receiving user feedback.')
body('All employer postings shall undergo blockchain verification before becoming visible to students.')

pb()

# ===== CHAPTER 2 =====
h1('CHAPTER 2: PROFILE OF THE PROBLEM, RATIONALE AND SCOPE')
h2('2.1 Introduction to the Problem')
body('The challenge of matching students with appropriate internship opportunities has persisted as a structural problem within higher education for decades. Despite the proliferation of online job boards and placement portals, the fundamental methodology underlying most internship matching processes has changed very little. Academic transcripts, resumes, and brief cover letters remain the primary instruments by which students are evaluated, while the matching itself is often performed manually by placement officers or through rudimentary filter-based search systems.')
body('This approach introduces several compounding inefficiencies. Students who possess exceptional practical skills, creativity, or leadership qualities but carry an average academic record are routinely overlooked by systems optimized to rank by GPA. Conversely, students who meet academic thresholds may be matched with roles misaligned with their personal interests or long-term career goals, leading to low engagement and poor performance. The absence of adaptive feedback means that these mismatches are repeated rather than corrected over time.')
body('The problem is further exacerbated by the lack of verification mechanisms in most internship platforms, exposing students to fraudulent or misleading postings. Educational institutions, meanwhile, receive insufficient data to identify systemic skill gaps across their student population, limiting their ability to adjust curriculum or provide targeted support.')

h2('2.2 Rationale for the Proposed System')
body('The rationale for developing InternAI Compass stems from the convergence of three forces: the demonstrated limitations of existing platforms, the maturity of AI and NLP technologies sufficient for production-grade personalization, and the growing expectation among students and institutions for data-driven, equitable career support.')
body('Transformer-based language models such as BERT have demonstrated the ability to extract nuanced semantic meaning from unstructured text, making it possible to match student profiles with internship descriptions at a depth no keyword-based system can achieve. Collaborative filtering, when combined with content-based approaches, allows the system to surface opportunities that students may not have identified themselves. Reinforcement learning ensures the system grows smarter with every interaction rather than remaining static. Blockchain verification addresses the trust problem that undermines confidence in existing platforms.')
body('Together, these technologies make it possible to build a system that is not only more accurate than existing alternatives but also more equitable, transparent, and continuously improving.')

h2('2.3 Problem Statement')
body('Existing internship recommendation systems are constrained by four interrelated limitations: heavy reliance on static academic metrics that fail to capture the full dimensionality of student potential; absence of adaptive learning mechanisms that prevent the system from improving through user feedback; lack of verification infrastructure that exposes students to fraudulent postings; and insufficient analytics tools for institutions to monitor and address placement-related skill gaps. InternAI Compass is designed to resolve all four limitations through a unified, AI-powered recommendation ecosystem.')

h2('2.4 Scope of the Study')
body('This study covers the design, development, and evaluation of the InternAI Compass system, with particular focus on the SmartMatch-AI hybrid recommendation algorithm. The scope includes the implementation of BERT-based embedding generation, content-based and collaborative filtering, reinforcement learning adaptation, blockchain employer verification, skill-gap prediction, and institutional analytics.')
body('The study is bounded by web-based interaction from desktop browsers for the current release. Future enhancements identified as out of scope for this version include mobile application development, multi-language support, psychometric profiling integration, federated learning across multiple institutions, and multi-agent group recommendation models.')

pb()

# ===== CHAPTER 3 =====
h1('CHAPTER 3: EXISTING SYSTEM')
h2('3.1 Introduction')
body('Before designing InternAI Compass, an extensive survey of existing career and internship recommendation platforms was conducted to understand the current state of the art, identify recurring limitations, and determine the specific innovations required to advance beyond them. The analysis encompassed both commercial platforms and academic implementations.')

h2('3.2 Existing Software and Platforms')
body('LinkedIn\u2019s job recommendation engine is among the most widely used career matching systems globally. It leverages collaborative filtering based on connections, endorsements, and application history. However, it relies heavily on user-maintained profiles and is primarily optimized for full-time employment rather than student internships. Its matching logic is opaque and does not incorporate transformer-based semantic understanding of skill descriptions.')
body('Internshala, a platform widely used in India for student internships, offers keyword-based search and manual filtering by domain, location, and stipend. It provides no personalization based on student profile depth, no skill-gap analysis, and no adaptive learning. Postings are moderated manually, making fraud prevention dependent on human review.')
body('Handshake, used primarily at North American universities, provides role-based recommendations informed by institutional partnerships. While it performs better than general job boards for students, it lacks the semantic depth of transformer-based matching and does not incorporate reinforcement learning.')
body('Academic implementations have explored individual components of the personalization problem. Works by Kumar et al. on career counselling recommendation systems and Rajaraman et al. on AI-guided career pathways have demonstrated promising results using rule-based and machine learning approaches. However, these systems treat student profiles as static, do not integrate behavioral feedback, and lack blockchain verification for employer authenticity.')

h2('3.3 Data Flow Diagram for the Existing System')
body('In a conventional internship recommendation system, the data flow follows a linear and largely manual path. A student submits their resume and academic details through a portal. An administrator or automated keyword matcher scans the submission against a database of posted internships. Matches are returned in a flat list sorted by basic relevance criteria such as category or date. The student applies, the employer responds, and the process ends without any feedback being incorporated into future recommendations.')
body('Critical weaknesses in this flow include the absence of semantic understanding in the matching process, no mechanism for learning from user behavior, no real-time re-ranking, and no verification of internship posting authenticity. Each student interaction is treated in isolation, preventing the system from accumulating intelligence over time.')

h2('3.4 What Is New in the System to be Developed')
body('InternAI Compass introduces three foundational innovations that distinguish it from all reviewed existing systems.')
body('First, the use of BERT-based transformer embeddings for both student profiles and internship descriptions enables semantic matching that captures contextual nuance beyond surface-level keyword similarity.')
body('Second, the SmartMatch-AI hybrid algorithm dynamically balances content-based and collaborative signals using an adaptive weight parameter that is continuously adjusted by a reinforcement learning module.')
body('Third, blockchain-based verification of employer registrations and internship postings provides a trust layer absent from all reviewed existing platforms.')

pb()

# ===== CHAPTER 4 =====
h1('CHAPTER 4: PROBLEM ANALYSIS')
h2('4.1 Product Definition')
body('The product is a web-based intelligent internship recommendation platform named InternAI Compass. It is built on a Next.js frontend with a Python AI microservice backend and a PostgreSQL database hosted on NeonDB. The system serves two primary user classes \u2014 students and institutional administrators \u2014 and supports an employer registration workflow with blockchain verification.')
body('Core deliverables include: a student-facing profile creation and recommendation interface; the SmartMatch-AI hybrid algorithm for generating personalized internship matches; BERT-based embedding generation for semantic profile-to-posting comparison; a reinforcement learning module for adaptive weight adjustment; a blockchain-based employer verification layer; a skill-gap prediction and learning path recommendation module; and an administrative analytics dashboard.')

h2('4.2 Feasibility Analysis')
h2('4.2.1 TECHNICAL FEASIBILITY')
body('All required components are available as mature, well-maintained technologies. BERT embeddings are accessible through the Hugging Face transformers library. Cosine similarity and collaborative filtering are standard operations in the scikit-learn and PyTorch ecosystems. Reinforcement learning mechanisms can be implemented using standard Python libraries without requiring specialized hardware. Next.js 15 provides a robust framework for the full-stack web interface.')

h2('4.2.2 ECONOMIC FEASIBILITY')
body('The system was developed at minimal financial cost. Deployment is handled through Vercel\u2019s free tier, database hosting through NeonDB\u2019s serverless free plan, and authentication through a managed identity service. The Gemini API is accessible through a developer tier sufficient for demonstration purposes.')

h2('4.2.3 OPERATIONAL FEASIBILITY')
body('The student interface requires no technical expertise. Profile creation, browsing recommendations, and applying for internships are all intuitive workflows achievable within minutes. The administrative dashboard requires moderate digital literacy but no programming knowledge.')

h2('4.3 Project Plan')
body('Development was structured across six phases spanning twelve weeks.')
body('Stage 1 (Weeks 1\u20132): Requirements and Design \u2014 Identification of user roles, use case scenarios, technology stack selection, database schema design, and wireframe development.')
body('Stage 2 (Weeks 3\u20134): Core Development \u2014 Project scaffolding with Next.js and TypeScript, authentication integration, Prisma schema implementation.')
body('Stage 3 (Weeks 5\u20136): AI Engine \u2014 Integration of BERT embedding generation, implementation of cosine similarity and collaborative filtering, development of the SmartMatch-AI hybrid scoring algorithm.')
body('Stage 4 (Weeks 7\u20138): Additional Features \u2014 Blockchain employer verification module, skill-gap prediction algorithm, learning path recommendation generation.')
body('Stage 5 (Weeks 9\u201310): Administrative Dashboard and Analytics \u2014 Institutional analytics charts, student readiness indicators, placement trend visualizations.')
body('Stage 6 (Weeks 11\u201312): Testing and Deployment \u2014 Functional and structural testing, accuracy benchmarking, deployment to Vercel, documentation and report preparation.')

pb()

doc.save(OUTPUT)
print('Part 2 done - chapters 1-4 added')
