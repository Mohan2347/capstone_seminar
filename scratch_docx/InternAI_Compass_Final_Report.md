# CAPSTONE PROJECT REPORT

(Project Term: January – May 2026)

INTERNAI COMPASS:
AN INTELLIGENT HYBRID RECOMMENDATION ENGINE FOR PERSONALIZED AND EQUITABLE INTERNSHIP PATHWAYS

---

## CHAPTER 1: INTRODUCTION

### 1.1 OVERVIEW
The rapid development of artificial intelligence (AI), machine learning (ML), and data-driven decision technologies has radically altered how students navigate educational and professional career paths. Despite these advancements, students worldwide continue to face significant difficulties in securing meaningful internship experiences. Most current systems rely heavily on static academic measures, such as grades or institutional reputation, neglecting crucial non-academic aspects like soft skills, character traits, extracurricular activities, and long-term career goals. This disconnect between student potential and available internship opportunities leads to poor matchmaking, diminished learner satisfaction, and inefficient hiring processes. Furthermore, traditional recommendation tools lack dynamic feedback loops, resulting in static and linear suggestions that fail to adapt to varying market requirements. InternAI Compass addresses this gap by introducing a hybrid recommendation algorithm, SmartMatch-AI, which increases the accuracy, flexibility, and equity of internship matching through deep semantic embeddings and reinforcement learning.

### 1.2 OBJECTIVE OF THE PROJECT
The primary objective of the InternAI Compass project is to design and implement an intelligent recommendation engine that accurately maps students to relevant internship opportunities based on a multidimensional representation of their skills, aspirations, and personal attributes. A core goal is to develop a hybrid recommendation framework combining content-based filtering, collaborative filtering, and reinforcement learning. SmartMatch-AI leverages transformer-based models (e.g., BERT) to interpret student profiles and internship descriptions with deep contextual accuracy. Furthermore, the project aims to enhance transparency and trust by integrating blockchain verification to ensure all internship postings undergo rigorous authenticity checks. Additionally, the project seeks to provide analytical insights to help students identify skill gaps and explore adaptive learning paths, culminating in a scalable, modular platform suitable for universities and recruitment agencies.

### 1.3 DESCRIPTION OF THE PROJECT
InternAI Compass is an AI-driven platform that utilizes hybrid filtering, natural language understanding, and reinforcement learning to generate highly personalized internship pathways. It collects structured data (grades, certifications) and unstructured data (resumes, personality traits) to generate contextual embeddings. At the system's core lies SmartMatch-AI, an algorithm that fuses content-based similarity metrics with collaborative behavioral patterns to compute a comprehensive match score. A unique adaptive weighting parameter (α) dynamically adjusts based on user engagement history. The system incorporates reinforcement learning, meaning every user interaction (clicks, applications, rejections) acts as a feedback signal to refine future recommendations. Additionally, the project employs blockchain-based authenticity verification to validate employer identities and prevent fraudulent listings, alongside a predictive analytics module for skill gap identification.

### 1.4 SCOPE OF THE PROJECT
The scope spans technical functionality, end-user accessibility, industry integration, and institutional deployment. Technically, it encompasses hybrid recommendation mechanisms, NLP-based semantic processing, collaborative filtering, blockchain verification, and reinforcement learning. Functionally, it provides personalized internship recommendations across disciplines, supporting profile creation, analytics visualization, and skill-gap identification. Institutionally, it equips placement cells with tools to monitor student readiness, identify cohort trends, and optimize internship allocations. The scope also extends to industry partners, allowing employers to submit blockchain-verified opportunities and access structured candidate insights.

### 1.5 USE CASE MODEL
The system involves three primary actors: Students, Administrators, and Employers. Students interact with the system to create profiles, view recommendations, analyze insights, and provide feedback. Administrators oversee system operations, access cohort analytics, validate institutional data, and coordinate with employers. Employers submit internship listings (which undergo blockchain verification) and access AI-generated candidate recommendations. The central system manages these interactions, interpreting data via NLP models, computing hybrid similarity scores, updating parameters through reinforcement learning, and validating postings.

### 1.6 SYSTEM DESCRIPTION
The InternAI Compass system integrates AI algorithms, real-time behavioral analysis, and secure data verification. It operates by transforming multidimensional user data into high-quality embeddings using transformer-based NLP models. The architecture centers around the SmartMatch-AI algorithm, fusing content-based filtering, collaborative similarity modeling, and reinforcement learning feedback loops. This hybrid approach ensures semantic relevance and alignment with user behavior. Blockchain verification mechanisms authenticate employer details, ensuring tamper-proof and genuine postings. The platform also features a user-centric dashboard providing real-time insights into compatibility, skill gaps, and learning strategies.

### 1.7 CUSTOMER AND USER PROFILES
The primary user groups are students, institutional administrators, and employers. Students (from first-years to graduating seniors) input academic and experiential data to receive tailored internship pathways. Institutional Administrators act as overseers, utilizing analytics to make strategic placement decisions, monitor engagement, and design training initiatives. Employers function as opportunity providers, submitting verified postings and relying on the platform to efficiently identify candidates whose skills and professional behavior match organizational needs.

### 1.8 ASSUMPTIONS AND DEPENDENCIES
The system assumes that students provide accurate, updated data regarding their background and preferences, and that they engage with the platform consistently to generate meaningful feedback for reinforcement learning. It also assumes employers submit authentic, detailed internship postings. The system's performance depends on stable access to robust computational resources and updated NLP models (such as BERT). Institutional support is critical for validating accounts and overseeing collaborations. Dependencies include modern web browsers, internet connectivity, secure API integrations, and robust database infrastructures.

### 1.9 FUNCTIONAL REQUIREMENTS
1. **User Registration & Profile Management**: Students, administrators, and employers must be able to create and manage accounts and profiles.
2. **Data Preprocessing & Feature Extraction**: The system must process structured and unstructured data using NLP models to generate embeddings.
3. **Recommendation Generation**: The system must compute hybrid scores using SmartMatch-AI, combining content-based and collaborative similarities.
4. **Reinforcement Learning Feedback**: The system must capture user interactions and dynamically adjust weight parameters.
5. **Blockchain Verification**: The system must validate employer credentials and internship postings via a distributed ledger.
6. **Analytics Dashboards**: The platform must provide insights on skill readiness, cohort trends, and candidate matching for all stakeholder types.

### 1.10 NON-FUNCTIONAL REQUIREMENTS
1. **Performance**: The system must process large datasets efficiently and generate recommendations within 1-2 seconds.
2. **Security & Privacy**: Strong encryption, secure authentication, and blockchain integrity must be implemented.
3. **Usability**: Interfaces must be intuitive, accessible, and responsive across devices.
4. **Reliability**: High availability, fault tolerance, and redundant servers must ensure minimal downtime.
5. **Extensibility**: The modular architecture must allow for future algorithmic updates and API integrations without disruption.

---

## CHAPTER 2: PROFILE OF THE PROBLEM, RATIONALE AND SCOPE

### 2.1 INTRODUCTION TO THE PROBLEM
Internship and placement management processes currently suffer from severe inefficiencies and inequities. Conventional platforms rely heavily on narrow, static academic indicators, failing to capture a student's holistic capabilities, including soft skills, extracurricular achievements, and long-term career aspirations. This leads to mismatched placements and diminished satisfaction for both students and employers. Furthermore, traditional systems are static; they do not learn from user interactions or adapt to evolving market trends. Compounding this issue is the prevalence of unverified, fraudulent, or poor-quality internship postings, which subject students to misinformation and potentially exploitative conditions. 

### 2.2 RATIONALE FOR THE PROPOSED SYSTEM
The rationale for InternAI Compass stems from the urgent need to bridge the disconnect between academic preparation and professional opportunity. By integrating advanced hybrid AI methodologies (NLP, collaborative filtering, and reinforcement learning), the system can interpret unstructured data (like resumes) with human-like comprehension. This ensures recommendations are highly personalized. Furthermore, the inclusion of blockchain technology addresses the critical trust deficit in modern job portals by guaranteeing the authenticity of employer postings. The system's predictive analytics also provide prescriptive guidance, helping students proactively address skill gaps before entering the job market.

### 2.3 PROBLEM STATEMENT
The present systems for handling internship recommendations face interlinked drawbacks: static, rule-based filtering leading to poor matchmaking; a lack of adaptive learning mechanisms to evolve with user preferences; vulnerability to fraudulent employer postings; and inadequate visibility into student skill gaps for institutions. InternAI Compass resolves these issues by deploying a dynamic, blockchain-verified, hybrid AI recommendation engine that provides personalized, equitable, and continually evolving internship pathways.

### 2.4 SCOPE OF THE STUDY
The study encompasses the development and validation of the SmartMatch-AI algorithm, evaluating its accuracy, precision, and adaptability across varied student profiles. It covers the integration of transformer-based NLP for semantic extraction, the design of reinforcement learning loops for behavioral adaptation, and the implementation of cryptographic hashing for blockchain employer verification. The scope also includes the creation of actionable dashboards for students, employers, and placement cells to facilitate data-driven decision-making in the internship recruitment process.

---

## CHAPTER 3: EXISTING SYSTEM

### 3.1 INTRODUCTION
A survey of existing career counseling and internship recommendation platforms reveals critical gaps in personalization, adaptability, and security. While some platforms have adopted basic machine learning classifiers or knowledge-based reasoning, they predominantly treat student data as static and fail to incorporate multi-layered semantic understanding or real-time behavioral feedback.

### 3.2 EXISTING SOFTWARE AND PLATFORMS
Current platforms and prior patents reveal distinct limitations:
1. **Hybrid Systems (e.g., US 2022/0351021 A1)**: Existing hybrid systems focus on general shopping or movies. They do not handle the specific needs of internship matching (psychometrics, soft skills, academic progress) nor do they verify authenticity.
2. **Job Transition Predictors (e.g., US 11954590 B2)**: Systems like Indeed's patent focus on job-to-job transition using graphs, but miss semantic understanding of resumes, student-focused features, fairness controls, and blockchain verification.
3. **Business Opportunity Matching (e.g., US 11295251 B2)**: IBM's patent matches business opportunities to teams based on past performance, lacking internship-specific constraints like mentorship, academic credits, and skill-gap guidance.
4. **Social Network Job Similarity (e.g., US 2018/0253695 A1)**: LinkedIn's patent surfaces jobs similar to other job postings. It does not utilize transformer-based semantic understanding of student resumes, nor does it offer adaptive learning or employer verification.

### 3.3 DATA FLOW DIAGRAM FOR THE EXISTING SYSTEM
In traditional systems, the data flow is linear and inefficient. A student uploads a resume and enters basic academic metrics. The system uses simple keyword matching or rule-based filters (e.g., "Computer Science" + "GPA > 3.0") against a database of unverified employer postings. The system outputs a static list of matches. If the student applies or ignores the recommendations, the system does not record this feedback to improve future matches. Employers receive a flood of resumes without any intelligent ranking of candidate soft skills or cultural fit.

### 3.4 WHAT IS NEW IN THE SYSTEM TO BE DEVELOPED
InternAI Compass introduces several novelties:
1. **Dynamic Hybrid Intelligence**: Fuses transformer-based semantic similarity (BERT) with collaborative behavioral similarity.
2. **Reinforcement Learning**: Continuously updates similarity weights (α) based on user interactions.
3. **Blockchain-Based Verification**: Generates cryptographic hashes for employer submissions, ensuring tamper-proof, verified listings.
4. **Holistic User Modeling**: Integrates personality traits, soft skills, and long-term goals alongside traditional academic data.
5. **Skill-Gap Prediction**: Acts as a career assistant by predicting missing competencies and providing curated upskilling pathways.

---

## CHAPTER 4: PROBLEM ANALYSIS

### 4.1 PRODUCT DEFINITION
InternAI Compass is an intelligent web application designed to connect students with optimal internship opportunities. It utilizes a Next.js full-stack architecture, an AI recommendation microservice powered by SmartMatch-AI, and a blockchain validation layer. The platform serves three distinct users: students seeking personalized career pathways, employers seeking verified and ranked talent, and administrators monitoring institutional placement performance.

### 4.2 FEASIBILITY ANALYSIS

**4.2.1 TECHNICAL FEASIBILITY**
The required technologies are highly accessible and proven. Transformer-based models (BERT) and generative AI APIs are readily available for NLP tasks. Next.js provides a robust framework for the user interface, while database solutions like PostgreSQL easily handle relational data. Blockchain hashing for verification can be implemented using standard cryptographic libraries or lightweight smart contracts, making the project technically feasible within the timeframe.

**4.2.2 ECONOMIC FEASIBILITY**
The initial prototype can be developed using open-source tools, free-tier cloud hosting (e.g., Vercel, NeonDB), and developer-tier AI APIs, resulting in minimal financial expense. Scaling the system for enterprise university deployment will require premium cloud and API subscriptions, but these costs are offset by the significant value provided to placement cells and recruiting employers.

**4.2.3 OPERATIONAL FEASIBILITY**
The user interfaces are designed to be intuitive, requiring no technical expertise from students or employers. Administrators can easily interpret the generated analytics without deep data science knowledge. The automated nature of the SmartMatch-AI algorithm reduces manual workload for university placement staff, ensuring high operational feasibility and easy adoption.

### 4.3 PROJECT PLAN
The project follows an iterative cycle:
- **Phase 1 (Weeks 1-2):** Requirement gathering, stakeholder discussions, ER models, and system architecture layouts.
- **Phase 2 (Weeks 3-5):** System design, database schema definition, API route planning, and UI wireframing.
- **Phase 3 (Weeks 6-8):** Core development, integrating Next.js, SmartMatch-AI algorithm logic (NLP embeddings, collaborative filtering), and user authentication.
- **Phase 4 (Weeks 9-10):** Implementation of reinforcement learning feedback loops and blockchain cryptographic verification modules.
- **Phase 5 (Weeks 11-12):** Comprehensive testing (unit, integration, UAT), performance tuning, and final deployment to cloud infrastructure.

---

## CHAPTER 5: SOFTWARE REQUIREMENT ANALYSIS

### 5.1 INTRODUCTION
Software requirements were gathered by analyzing the shortcomings of existing placement platforms and identifying the specific needs of modern students and academic institutions. The requirements emphasize the necessity of AI-driven personalization, data security, and real-time adaptability.

### 5.2 GENERAL DESCRIPTION
InternAI Compass is a browser-based application accessible from any modern device. Users authenticate securely and are routed to their respective dashboards (Student, Employer, or Admin). The system ingests student data, processes it via the SmartMatch-AI microservice, and outputs ranked internship pathways. Blockchain verification runs concurrently during employer posting submissions. The system continually recalculates priority weights based on user feedback.

### 5.3 SPECIFIC REQUIREMENTS

**5.3.1 FUNCTIONAL REQUIREMENTS**
- **Authentication:** Secure registration for Students, Employers, and Admins.
- **Profile Ingestion:** Capability to parse resumes and accept manual inputs for skills and psychometrics.
- **SmartMatch-AI Processing:** Computation of cosine similarity (content) and behavioral similarity (collaborative), combined via an adaptive weight (α).
- **Feedback Loop:** System must record likes, applications, and rejections to adjust the reinforcement learning reward signal.
- **Blockchain Hashing:** Cryptographic validation of employer identities and internship descriptions.
- **Analytics:** Generation of skill-gap reports and cohort dashboards.

**5.3.2 NON-FUNCTIONAL REQUIREMENTS**
- **Latency:** AI processing and recommendation generation must occur within 2 seconds.
- **Accuracy:** The algorithm must maintain a matching accuracy of over 90%.
- **Security:** Strict role-based access control (RBAC) and data encryption in transit and at rest.
- **Scalability:** Horizontal scalability to support thousands of concurrent students during placement seasons.

**5.3.3 SYSTEM REQUIREMENTS**
- **Frontend/Backend:** Node.js 18+ and Next.js 15.
- **Database:** PostgreSQL (NeonDB serverless).
- **AI Services:** Python microservices for BERT embeddings and reinforcement learning logic; Gemini API integration.
- **Client:** Modern web browsers (Chrome, Edge, Safari).

---

## CHAPTER 6: DESIGN

### 6.1 SYSTEM DESIGN
The architecture follows a microservices approach across three layers: a Next.js full-stack application for the UI and API orchestration; a PostgreSQL database accessed via Prisma ORM; and a dedicated AI microservice (Python) managing NLP embeddings, hybrid scoring, and reinforcement updates. A role-based access control system cleanly segregates the public routes, student dashboards, and administrator/employer portals.

### 6.2 DATABASE DESIGN
The relational schema comprises key models:
- **Student:** Stores academic performance, skills, preferences, and embedding vectors.
- **Internship:** Stores job roles, descriptions, required skills, and blockchain verification status.
- **Employer:** Manages company credentials and validation logs.
- **Application/Feedback:** Links Students to Internships, capturing interaction data (likes, applies) to feed the reinforcement learning model.

### 6.3 DESIGN NOTATIONS
The system utilizes standard TypeScript interfaces for strict typing. Database operations are centralized through a Prisma singleton. The SmartMatch-AI logic and blockchain hashing utilities are modularized in dedicated service directories to ensure clean separation of concerns.

### 6.4 DETAILED DESIGN
**SmartMatch-AI Pipeline:**
1. **Embedding Generation:** Resumes and descriptions are converted to contextual embeddings using BERT.
2. **Content Similarity:** Computes cosine similarity between student and job embeddings.
3. **Collaborative Similarity:** Identifies similar user clusters based on behavioral matrices.
4. **Hybrid Score:** Fuses content and collaborative scores using weight parameter α.
5. **Reinforcement Update:** Adjusts α based on user interaction (reward/penalty) using the formula: `α_new = α_old + η * (Actual_Feedback - Predicted_Feedback)`.

**Blockchain Verification:** Generates a SHA-256 cryptographic hash of the employer's details and posting content, storing it on a decentralized ledger to guarantee tamper-proof authenticity.

### 6.5 FLOWCHARTS
The primary flow involves:
1. Student inputs data -> System generates BERT embeddings.
2. Employer posts internship -> System performs Blockchain verification.
3. SmartMatch-AI calculates Hybrid Score -> Ranks Internships.
4. Student interacts (Applies/Rejects) -> Reinforcement Learning updates weight α -> Model refines future recommendations.

### 6.6 PSEUDO CODE
```text
FUNCTION generate_recommendation(student_profile, internships):
  student_vector = generate_embeddings(student_profile.resume, student_profile.skills)
  FOR EACH job IN internships:
    IF NOT verify_blockchain_hash(job): CONTINUE
    job_vector = generate_embeddings(job.description, job.requirements)
    content_score = cosine_similarity(student_vector, job_vector)
    collab_score = compute_behavioral_similarity(student_profile.id, job.id)
    hybrid_score = (alpha * content_score) + ((1 - alpha) * collab_score)
    job.final_score = hybrid_score
  RETURN rank_descending(internships_by_score)

FUNCTION update_weights(student_id, job_id, user_action):
  reward = calculate_reward(user_action)  // e.g., Apply = 1.0, Reject = -1.0
  predicted = get_previous_prediction(student_id, job_id)
  alpha = alpha + learning_rate * (reward - predicted)
  SAVE alpha
```

---

## CHAPTER 7: TESTING

### 7.1 FUNCTIONAL TESTING
Functional testing verified that all core features operate according to requirements. This included testing user registration, resume parsing accuracy, and the successful execution of the SmartMatch-AI algorithm. The blockchain verification module was rigorously tested by attempting to inject altered internship postings, confirming that the system correctly rejected tampered data.

### 7.2 STRUCTURAL TESTING
Structural (white-box) testing focused on the internal logic of the hybrid algorithm. Test cases evaluated the cosine similarity mathematical outputs, the matrix factorization for collaborative filtering, and the proper updating of the reinforcement learning parameter (α) across multiple simulated feedback iterations.

### 7.3 LEVELS OF TESTING
Testing progressed through standard phases:
- **Unit Testing:** Validated individual functions like embedding generation and hash creation.
- **Integration Testing:** Ensured the Next.js API properly orchestrated data between PostgreSQL and the Python AI microservice.
- **System Testing:** Evaluated end-to-end performance under load.
- **User Acceptance Testing (UAT):** Conducted with a sample group of students to ensure UI usability and recommendation relevance.

### 7.4 TESTING THE PROJECT — RESULTS SUMMARY
Experimental evaluations utilized a dataset of 1,200 synthetic student profiles and 350 internships. The SmartMatch-AI algorithm demonstrated superior performance compared to traditional rule-based systems:
- **Accuracy:** Reached 93% (compared to 62-74% for traditional models).
- **Precision vs. Recall:** Precision improved from 78% to 91% after five reinforcement iterations, maintaining an 87% recall rate. The optimal balance occurred when α and feedback depth were properly balanced, preventing overfitting.
- **Adaptability:** Scored 90% in adapting to new user preferences dynamically.
- **Security:** Achieved a 100% success rate in identifying and blocking unverified or tampered employer listings via the blockchain module. Processing times remained highly efficient, generating recommendations in 0.8–1.4 seconds.

---

## CHAPTER 8: IMPLEMENTATION

### 8.1 IMPLEMENTATION OF THE PROJECT
Implementation involved deploying the front-end application via Vercel, ensuring global edge caching and fast rendering. The database was instantiated on NeonDB for serverless PostgreSQL scalability. The SmartMatch-AI microservice, containing the transformer models and reinforcement logic, was deployed on dedicated compute instances capable of handling vector processing. API integrations with Clerk for authentication and Gemini for supplementary NLP tasks were successfully configured.

### 8.2 TECHNOLOGY STACK SUMMARY
- **Frontend:** Next.js 15, React, Tailwind CSS.
- **Backend:** Node.js API Routes, Python FastAPI (Microservice).
- **Database/ORM:** PostgreSQL, NeonDB, Prisma.
- **AI/ML:** HuggingFace Transformers (BERT), Custom Reinforcement Learning module, Google Gemini SDK.
- **Security:** Blockchain cryptographic hashing, Clerk Authentication.
- **Deployment:** Vercel, Docker.

### 8.3 CONVERSION PLAN
Deploying InternAI Compass in a university setting involves a phased conversion. Phase 1 includes migrating historical student placement data and digitizing existing employer connections. Phase 2 involves onboarding a pilot cohort of students and active employers to establish baseline collaborative filtering data. Phase 3 entails full institutional rollout, shifting entirely away from legacy manual placement portals.

### 8.4 POST-IMPLEMENTATION AND SOFTWARE MAINTENANCE
Post-implementation focuses on algorithmic tuning. The NLP models require periodic fine-tuning as industry terminology evolves. The reinforcement learning module's learning rate (η) will be continually monitored to prevent model drift. Standard software maintenance includes updating npm packages, monitoring database query performance, and scaling cloud infrastructure during peak placement seasons.

---

## CHAPTER 9: PROJECT LEGACY

### 9.1 CURRENT STATUS OF THE PROJECT
The InternAI Compass prototype is fully operational. The core SmartMatch-AI algorithm, incorporating semantic embeddings and reinforcement learning, successfully generates highly accurate recommendations. The blockchain verification pipeline securely validates employer postings, and the student dashboards actively display skill-gap analytics. 

### 9.2 REMAINING AREAS OF CONCERN
While the system performs excellently on medium datasets, scaling the collaborative filtering matrix to millions of users will require transitioning to advanced distributed computing frameworks (e.g., Apache Spark). Additionally, handling "cold-start" problems for entirely new domains or highly niche degrees requires further refinement of the baseline content-matching fallback logic.

### 9.3 TECHNICAL AND MANAGERIAL LESSONS LEARNED
Technically, integrating synchronous web applications with computationally intensive AI models highlighted the necessity of asynchronous processing and decoupled microservices. Managerially, the project reinforced the importance of iterative testing and continuous feedback. We learned that transparency (Explainable AI) is crucial; students trust recommendations far more when the system provides a clear rationale (e.g., "Matched due to your proficiency in React and UI/UX").

---

## CHAPTER 10: USER MANUAL

### 10.1 GETTING STARTED
Users navigate to the InternAI Compass web portal and register using their academic email or social logins via Clerk. The system provides an interactive onboarding wizard to guide users through their initial profile setup.

### 10.2 STUDENT GUIDE
1. **Profile Setup:** Upload your latest resume. The system will automatically extract skills and experiences. Manually verify and add long-term career aspirations and psychometric data.
2. **Dashboard:** View your personalized "Compass Dashboard" to see your current employability score and skill gaps.
3. **Recommendations:** Browse the AI-ranked internship pathways. Click on a match to read the "Why this fits you" AI-generated explanation.
4. **Interaction:** Click "Apply", "Save", or "Not Interested". These actions train the system to provide better recommendations tomorrow.

### 10.3 ADMINISTRATOR GUIDE
1. **Employer Verification:** Monitor the blockchain validation queue. Verify that all corporate entities are legitimate.
2. **Cohort Analytics:** Access the admin dashboard to view macro-level data. Identify which skills are most demanded by employers versus which skills your students currently possess.
3. **Intervention:** Use predictive analytics to flag students who are struggling to find matches and provide targeted academic counseling.

---

## CHAPTER 11: SOURCE CODE AND SYSTEM SNAPSHOTS

### 11.1 REPOSITORY STRUCTURE
The codebase follows a modular monorepo structure:
- `/app`: Next.js frontend pages and dashboard layouts.
- `/api`: Backend REST routes handling data requests.
- `/components`: Reusable React UI elements (tables, charts, forms).
- `/lib`: Singleton instances for Prisma, Gemini, and utility functions.
- `/ai-service`: Python FastAPI microservice containing the SmartMatch-AI algorithm and NLP models.

### 11.2 SMARTMATCH-AI CORE ALGORITHM
The core algorithm is implemented in Python, utilizing `SentenceTransformers` for embedding generation and custom NumPy matrix operations for calculating the combined hybrid score. The reinforcement learning updater runs asynchronously via background workers, recalculating the `alpha` weights in the PostgreSQL database using Prisma triggers.

### 11.3 SYSTEM SNAPSHOTS DESCRIPTION
The system UI is designed with a modern, clean aesthetic:
- **Student Dashboard:** Features radar charts displaying the student's current skill levels mapped against industry demands, alongside a carousel of top-ranked internship cards.
- **Explanation UI:** A detailed view showing exactly why a student matched with a role, highlighting overlapping skills in green and missing skills in red.
- **Admin Analytics:** Comprehensive graphical representations (bar charts, line graphs) showing placement rates, trending technologies, and employer engagement metrics.
- **Verification Badge:** A clear, cryptographic verification badge displayed on employer postings, assuring students of the listing's authenticity.

---

## CHAPTER 12: BIBLIOGRAPHY
1. M. Kumar, A. Raj, and S. Kumar, "Career Counselling Recommendation System," Preprints, 2024.
2. Z. Lan, "Design of Intelligent Recommendation System for Graduate Employment Based on Artificial Intelligence," Proc. EASCT, 2023.
3. B. Berlikozha et al., "Intelligent Career Path Recommendations Leveraging Blockchain and Machine Learning," IEEE, 2025.
4. C. Yang and L. Dong, "Intelligent Talent Recommendation Algorithm for College Students," Journal of Electrical Systems, 2024.
5. N. Dobbins et al., "Personalizing Student Graduation Paths Using Expressed Student Interests," Proc. COMPSAC, 2023.
6. G. Rajaraman et al., "Pathfinder–Career Guidance using Artificial Intelligence," IJARSCT, 2024.
7. M. Sarkar and N. Kumar, "Recommendation engine and system," Patent, 2019.
8. A. M. et al., "AI-Enhanced Career Guidance System for Personalized Career Pathways," 2024.
9. W. Liu et al., "Framework Design of Intelligent Career Recommendation System for Undergraduates," Proc. IEIR, 2022.
10. A. M'Baya et al., "Ontology based multi criteria recommendation system to guide internship assignment process," 2016.
11. P. K. Goel et al., "CareerQuest," Advances in Computational Intelligence and Robotics, 2025.
12. D. Dhamayanthi et al., "Career Path Recommender Using Quantum Machine Learning," 2024.
13. S. Raja and M. Priya, "Optimizing Career Pathways: A Deep Learning-Based Framework," IEEE, 2025.
14. H. Mydyti and A. Ware, "Integrating Intelligent Web Scraping Techniques in Internship Management," AETIC, 2025.
15. D. C. Nguyen et al., "ITCareerBot: A Personalized Career Counselling Chatbot," Lecture Notes in Networks and Systems, 2022.
16. Y. Zhou and S. Yu, "Research on the Design of an AI Career Path Recommendation System," AITR, 2024.
17. W. Xie et al., "Career path recommendation engine," Patent, 2019.
18. A. H. Jaber, "The method of building an intelligent system of recommendations," Optiko-elektronnì, 2023.
19. K. K. Babu, "AI Based Personalized Recommendation of Career Guidance for Students," IJIRIS, 2024.
20. V. Ramesh et al., "SavvyAI: AI Enhanced Personalized Career Guidance System," IEEE, 2025.
