import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const companies = [
  {
    clerkId: "seed_company_techcorp",
    email: "seed_techcorp@smartmatch.dev",
    name: "TechCorp Solutions",
    industry: "Technology",
    description:
      "A leading software solutions company building enterprise-grade products used by millions worldwide. We invest heavily in talent development and offer structured mentorship programs.",
    website: "https://techcorp.example.com",
  },
  {
    clerkId: "seed_company_finedge",
    email: "seed_finedge@smartmatch.dev",
    name: "FinEdge Capital",
    industry: "Finance",
    description:
      "FinEdge is a fintech company at the intersection of machine learning and financial markets. We build quantitative trading systems, risk models, and real-time analytics platforms.",
    website: "https://finedge.example.com",
  },
  {
    clerkId: "seed_company_healthai",
    email: "seed_healthai@smartmatch.dev",
    name: "HealthAI Labs",
    industry: "Healthcare",
    description:
      "HealthAI Labs applies artificial intelligence to drug discovery, medical imaging, and patient outcome prediction. Our mission is to make precision medicine accessible to everyone.",
    website: "https://healthai.example.com",
  },
  {
    clerkId: "seed_company_greentech",
    email: "seed_greentech@smartmatch.dev",
    name: "GreenTech Ventures",
    industry: "Engineering",
    description:
      "GreenTech builds software for sustainable energy systems — from smart grid optimization to EV fleet management. Join us and use code to fight climate change.",
    website: "https://greentech.example.com",
  },
  {
    clerkId: "seed_company_designhub",
    email: "seed_designhub@smartmatch.dev",
    name: "DesignHub Studio",
    industry: "Design",
    description:
      "DesignHub is a digital product agency working with early-stage startups and Fortune 500 companies. We blend UX research, visual design, and prototyping to create products users love.",
    website: "https://designhub.example.com",
  },
  {
    clerkId: "seed_company_cloudnova",
    email: "seed_cloudnova@smartmatch.dev",
    name: "CloudNova Systems",
    industry: "Technology",
    description:
      "CloudNova builds developer-facing infrastructure products — Kubernetes operators, service meshes, and observability tooling used by engineering teams at thousands of companies worldwide. We're obsessed with developer experience and reliability.",
    website: "https://cloudnova.example.com",
  },
  {
    clerkId: "seed_company_cybershield",
    email: "seed_cybershield@smartmatch.dev",
    name: "CyberShield Security",
    industry: "Cybersecurity",
    description:
      "CyberShield is a cybersecurity firm specializing in threat detection, incident response, and zero-trust architecture. We protect critical infrastructure for Fortune 100 clients and government agencies.",
    website: "https://cybershield.example.com",
  },
  {
    clerkId: "seed_company_eduspark",
    email: "seed_eduspark@smartmatch.dev",
    name: "EduSpark Learning",
    industry: "Education",
    description:
      "EduSpark builds adaptive learning platforms powered by AI. Our personalized curricula serve 2 million learners across 50 countries. We combine pedagogy, game design, and machine learning to make education engaging and effective.",
    website: "https://eduspark.example.com",
  },
  {
    clerkId: "seed_company_retailiq",
    email: "seed_retailiq@smartmatch.dev",
    name: "RetailIQ Analytics",
    industry: "Retail",
    description:
      "RetailIQ helps global retailers make data-driven decisions through demand forecasting, inventory optimization, and customer lifetime value modeling. Our platform processes over 5 billion retail events daily.",
    website: "https://retailiq.example.com",
  },
  {
    clerkId: "seed_company_spacemind",
    email: "seed_spacemind@smartmatch.dev",
    name: "SpaceMind Robotics",
    industry: "Robotics",
    description:
      "SpaceMind develops autonomous robotics systems for warehouse automation, last-mile delivery, and space exploration payloads. Our team includes roboticists, control engineers, and AI researchers.",
    website: "https://spacemind.example.com",
  },
];

const internshipData = [
  // TechCorp Solutions
  {
    companyKey: "seed_company_techcorp",
    title: "Software Engineering Intern — Backend",
    description:
      "Join our core platform team to build and scale distributed backend services. You will design REST APIs, write production Go code, optimize database queries, and participate in code reviews. You will ship real features used by thousands of users within your first two weeks.",
    requiredSkills: ["Go", "PostgreSQL", "REST APIs", "Git"],
    preferredSkills: ["Docker", "Kubernetes", "Redis", "gRPC"],
    requiredGpa: 3.0,
    industry: "Technology",
    location: "San Francisco, CA",
    workType: "hybrid",
    duration: "3 months",
    stipend: "₹70,000/month",
    openings: 3,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_techcorp",
    title: "Frontend Engineer Intern — React",
    description:
      "Work alongside senior engineers to build beautiful, performant user interfaces. You will own complete UI features end-to-end — from Figma handoff to production deployment. We use React 19, TypeScript, and TailwindCSS.",
    requiredSkills: ["React", "TypeScript", "HTML/CSS", "Git"],
    preferredSkills: ["Next.js", "TailwindCSS", "Storybook", "Cypress"],
    requiredGpa: 2.8,
    industry: "Technology",
    location: "Remote",
    workType: "remote",
    duration: "4 months",
    stipend: "₹65,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_techcorp",
    title: "Machine Learning Infrastructure Intern",
    description:
      "Build the infrastructure that powers our ML platform — model serving pipelines, feature stores, experiment tracking, and A/B testing frameworks. You will work closely with our ML and platform teams to reduce model deployment time from days to hours.",
    requiredSkills: ["Python", "Machine Learning", "Docker", "SQL"],
    preferredSkills: ["MLflow", "Kubeflow", "Apache Kafka", "Terraform"],
    requiredGpa: 3.2,
    industry: "Technology",
    location: "New York, NY",
    workType: "hybrid",
    duration: "3 months",
    stipend: "₹80,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },

  // FinEdge Capital
  {
    companyKey: "seed_company_finedge",
    title: "Quantitative Research Intern",
    description:
      "Research and prototype algorithmic trading strategies using statistical modeling and ML. You will work with tick-level market data, backtest strategies across historical periods, and present findings to the quant research team. Strong math and coding skills required.",
    requiredSkills: ["Python", "Statistics", "Machine Learning", "SQL"],
    preferredSkills: ["R", "pandas", "NumPy", "Jupyter", "Time Series Analysis"],
    requiredGpa: 3.5,
    industry: "Finance",
    location: "Chicago, IL",
    workType: "onsite",
    duration: "10 weeks",
    stipend: "₹90,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_finedge",
    title: "Data Engineering Intern",
    description:
      "Build and maintain high-throughput data pipelines that process billions of financial events per day. You will design schemas, optimize streaming jobs, and ensure data quality for downstream analytics and ML teams.",
    requiredSkills: ["Python", "SQL", "Apache Spark", "Data Pipelines"],
    preferredSkills: ["Kafka", "dbt", "Snowflake", "Airflow", "Scala"],
    requiredGpa: 3.0,
    industry: "Finance",
    location: "Remote",
    workType: "remote",
    duration: "3 months",
    stipend: "₹75,000/month",
    openings: 3,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_finedge",
    title: "Risk Analytics Intern",
    description:
      "Develop risk measurement tools for our portfolio management system. You will implement VaR models, stress testing frameworks, and real-time risk dashboards. This role sits at the intersection of finance theory and software engineering.",
    requiredSkills: ["Python", "Statistics", "Finance", "SQL"],
    preferredSkills: ["Monte Carlo Simulation", "Excel VBA", "Tableau", "R"],
    requiredGpa: 3.3,
    industry: "Finance",
    location: "New York, NY",
    workType: "onsite",
    duration: "12 weeks",
    stipend: "₹85,000/month",
    openings: 1,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },

  // HealthAI Labs
  {
    companyKey: "seed_company_healthai",
    title: "AI Research Intern — Medical Imaging",
    description:
      "Apply deep learning to radiology image analysis — chest X-rays, MRI scans, and pathology slides. You will implement and evaluate SOTA vision models, annotate datasets, and work directly with radiologists to validate results. Publications possible.",
    requiredSkills: ["Python", "Deep Learning", "Computer Vision", "PyTorch"],
    preferredSkills: ["TensorFlow", "MONAI", "OpenCV", "DICOM", "Medical Imaging"],
    requiredGpa: 3.5,
    industry: "Healthcare",
    location: "Boston, MA",
    workType: "hybrid",
    duration: "4 months",
    stipend: "₹70,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_healthai",
    title: "Bioinformatics Intern",
    description:
      "Analyze genomic and proteomic datasets to identify drug targets and biomarkers. You will write bioinformatics pipelines, work with electronic health record data, and collaborate with computational biologists and clinical researchers.",
    requiredSkills: ["Python", "R", "Bioinformatics", "Machine Learning"],
    preferredSkills: ["Biopython", "GATK", "Pandas", "Scikit-learn", "Bash Scripting"],
    requiredGpa: 3.3,
    industry: "Healthcare",
    location: "San Diego, CA",
    workType: "hybrid",
    duration: "3 months",
    stipend: "₹60,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_healthai",
    title: "Full-Stack Engineer Intern — Healthcare Platform",
    description:
      "Build the web platform that clinicians and researchers use daily to access AI-powered insights. You will work on both the Next.js frontend and the Node.js backend, integrating with FHIR APIs and our ML inference services.",
    requiredSkills: ["React", "Node.js", "TypeScript", "REST APIs"],
    preferredSkills: ["Next.js", "PostgreSQL", "FHIR", "Docker", "GraphQL"],
    requiredGpa: 2.8,
    industry: "Healthcare",
    location: "Remote",
    workType: "remote",
    duration: "3 months",
    stipend: "₹65,000/month",
    openings: 3,
    deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
  },

  // GreenTech Ventures
  {
    companyKey: "seed_company_greentech",
    title: "Embedded Systems Intern — EV Charging",
    description:
      "Work on firmware for our next-generation EV charging controllers. You will write C/C++ for ARM microcontrollers, implement OCPP communication protocols, and test hardware in our lab environment.",
    requiredSkills: ["C", "C++", "Embedded Systems", "Microcontrollers"],
    preferredSkills: ["RTOS", "CAN Bus", "OCPP Protocol", "ARM Cortex", "Python"],
    requiredGpa: 3.0,
    industry: "Engineering",
    location: "Austin, TX",
    workType: "onsite",
    duration: "4 months",
    stipend: "₹55,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_greentech",
    title: "Data Science Intern — Grid Optimization",
    description:
      "Use optimization algorithms and ML to improve the efficiency of smart grids. You will model energy demand forecasting, implement load balancing algorithms, and analyze IoT sensor data from thousands of edge devices.",
    requiredSkills: ["Python", "Machine Learning", "Data Analysis", "SQL"],
    preferredSkills: ["TensorFlow", "Optimization Algorithms", "Time Series", "Spark"],
    requiredGpa: 3.2,
    industry: "Engineering",
    location: "Remote",
    workType: "remote",
    duration: "3 months",
    stipend: "₹60,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_greentech",
    title: "Cloud Infrastructure Intern",
    description:
      "Design and maintain the AWS infrastructure powering our IoT data ingestion pipeline, real-time analytics, and ML serving layer. You will work with Infrastructure as Code (Terraform), containerization, and CI/CD pipelines.",
    requiredSkills: ["AWS", "Docker", "Terraform", "Linux", "Python"],
    preferredSkills: ["Kubernetes", "GitHub Actions", "Prometheus", "Grafana"],
    requiredGpa: 2.8,
    industry: "Engineering",
    location: "Seattle, WA",
    workType: "hybrid",
    duration: "4 months",
    stipend: "₹70,000/month",
    openings: 1,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },

  // DesignHub Studio
  {
    companyKey: "seed_company_designhub",
    title: "UX Design Intern",
    description:
      "Work on end-to-end UX projects for our startup clients — from user research and journey mapping to wireframes, prototypes, and usability testing. You will have real ownership of projects that ship to production during your internship.",
    requiredSkills: ["Figma", "UX Research", "Wireframing", "Prototyping"],
    preferredSkills: ["Framer", "Adobe XD", "User Testing", "Design Systems", "Motion Design"],
    requiredGpa: null,
    industry: "Design",
    location: "Remote",
    workType: "remote",
    duration: "3 months",
    stipend: "₹45,000/month",
    openings: 3,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_designhub",
    title: "Frontend Developer Intern — Design Systems",
    description:
      "Help build and maintain our design system library used across 10+ client products. You will write accessible React components, document them in Storybook, and work closely with designers to ensure pixel-perfect implementation.",
    requiredSkills: ["React", "TypeScript", "CSS", "Storybook"],
    preferredSkills: ["TailwindCSS", "Radix UI", "Figma", "Accessibility (WCAG)", "Chromatic"],
    requiredGpa: 2.7,
    industry: "Design",
    location: "New York, NY",
    workType: "hybrid",
    duration: "3 months",
    stipend: "₹55,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_designhub",
    title: "Product Management Intern",
    description:
      "Own the roadmap for a feature set across one of our flagship client products. You will write PRDs, prioritize backlogs, run sprint planning, and work at the intersection of design, engineering, and business stakeholders.",
    requiredSkills: ["Product Management", "Communication", "Data Analysis", "Figma"],
    preferredSkills: ["SQL", "Mixpanel", "Jira", "A/B Testing", "User Interviews"],
    requiredGpa: 3.0,
    industry: "Design",
    location: "San Francisco, CA",
    workType: "hybrid",
    duration: "3 months",
    stipend: "₹50,000/month",
    openings: 1,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },

  // CloudNova Systems
  {
    companyKey: "seed_company_cloudnova",
    title: "Platform Engineering Intern — Kubernetes",
    description:
      "Join the core platform team to build and improve our Kubernetes operators and controllers. You will write Go-based operators using controller-runtime, implement reconciliation logic, and contribute to our open-source service mesh project with 10k+ GitHub stars.",
    requiredSkills: ["Go", "Kubernetes", "Docker", "Linux"],
    preferredSkills: ["controller-runtime", "Helm", "Prometheus", "gRPC", "Rust"],
    requiredGpa: 3.0,
    industry: "Technology",
    location: "Remote",
    workType: "remote",
    duration: "4 months",
    stipend: "₹80,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_cloudnova",
    title: "Observability Intern — Distributed Tracing",
    description:
      "Build tools that help developers understand what their distributed systems are doing. You will instrument services with OpenTelemetry, design trace sampling strategies, build alerting pipelines, and create Grafana dashboards for engineering teams.",
    requiredSkills: ["Python", "Distributed Systems", "SQL", "Linux"],
    preferredSkills: ["OpenTelemetry", "Jaeger", "Grafana", "PromQL", "Kafka"],
    requiredGpa: 2.8,
    industry: "Technology",
    location: "San Francisco, CA",
    workType: "hybrid",
    duration: "3 months",
    stipend: "₹75,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_cloudnova",
    title: "Developer Experience Intern",
    description:
      "Improve how thousands of engineers interact with CloudNova products. You will redesign CLI workflows, write developer documentation, build interactive API sandboxes, and conduct developer interviews to identify pain points in our platform.",
    requiredSkills: ["TypeScript", "Node.js", "REST APIs", "Technical Writing"],
    preferredSkills: ["React", "CLIcraft", "OpenAPI", "Docusaurus", "Shell Scripting"],
    requiredGpa: null,
    industry: "Technology",
    location: "Remote",
    workType: "remote",
    duration: "3 months",
    stipend: "₹65,000/month",
    openings: 1,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
  },

  // CyberShield Security
  {
    companyKey: "seed_company_cybershield",
    title: "Security Engineering Intern — Threat Detection",
    description:
      "Build detection rules and machine learning models to identify adversarial activity across our clients' networks. You will analyze real attacker TTPs, write YARA and Sigma rules, and develop anomaly detection pipelines processing millions of events per second.",
    requiredSkills: ["Python", "Machine Learning", "Networking", "Linux"],
    preferredSkills: ["YARA", "Sigma", "Elasticsearch", "MITRE ATT&CK", "Splunk"],
    requiredGpa: 3.2,
    industry: "Cybersecurity",
    location: "Washington, DC",
    workType: "onsite",
    duration: "12 weeks",
    stipend: "₹85,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_cybershield",
    title: "Penetration Testing Intern",
    description:
      "Conduct authorized security assessments of web applications, cloud infrastructure, and internal networks. You will write detailed reports, demonstrate exploits to clients, and help develop remediation roadmaps. Prior CTF experience strongly valued.",
    requiredSkills: ["Penetration Testing", "Networking", "Python", "Linux"],
    preferredSkills: ["Burp Suite", "Metasploit", "AWS Security", "OWASP", "Web Application Security"],
    requiredGpa: 3.0,
    industry: "Cybersecurity",
    location: "Remote",
    workType: "remote",
    duration: "3 months",
    stipend: "₹70,000/month",
    openings: 3,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_cybershield",
    title: "Cloud Security Intern",
    description:
      "Assess and harden cloud environments for our Fortune 500 clients. You will audit AWS/GCP/Azure configurations, implement CSPM policies, build security guardrails with Terraform, and help clients achieve zero-trust architecture goals.",
    requiredSkills: ["AWS", "Python", "Security", "Terraform"],
    preferredSkills: ["GCP", "Azure", "Kubernetes Security", "IAM", "CSPM Tools"],
    requiredGpa: 3.0,
    industry: "Cybersecurity",
    location: "Austin, TX",
    workType: "hybrid",
    duration: "4 months",
    stipend: "₹75,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
  },

  // EduSpark Learning
  {
    companyKey: "seed_company_eduspark",
    title: "ML Engineer Intern — Adaptive Learning",
    description:
      "Build the AI that powers personalized learning paths for millions of students. You will train knowledge tracing models, implement spaced repetition algorithms, and run A/B tests to improve learner engagement and knowledge retention.",
    requiredSkills: ["Python", "Machine Learning", "PyTorch", "SQL"],
    preferredSkills: ["Knowledge Tracing", "Bayesian Methods", "A/B Testing", "dbt", "LLMs"],
    requiredGpa: 3.3,
    industry: "Education",
    location: "Remote",
    workType: "remote",
    duration: "4 months",
    stipend: "₹65,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_eduspark",
    title: "Full-Stack Engineer Intern — Learning Platform",
    description:
      "Build interactive learning features including coding playgrounds, quiz engines, and real-time collaborative exercises. You will work across our React frontend and Python backend, shipping features that reach students in 50 countries.",
    requiredSkills: ["React", "Python", "TypeScript", "PostgreSQL"],
    preferredSkills: ["Django", "WebSockets", "Redis", "AWS", "Next.js"],
    requiredGpa: 2.8,
    industry: "Education",
    location: "New York, NY",
    workType: "hybrid",
    duration: "3 months",
    stipend: "₹60,000/month",
    openings: 3,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_eduspark",
    title: "Curriculum & Content Engineering Intern",
    description:
      "Design and build structured learning content for our CS and data science tracks. You will create interactive exercises, write auto-graders, design project rubrics, and collaborate with instructional designers to ensure pedagogical quality.",
    requiredSkills: ["Python", "Data Structures", "Algorithms", "Technical Writing"],
    preferredSkills: ["Jupyter", "React", "Testing", "Curriculum Design", "LLM Prompting"],
    requiredGpa: 3.0,
    industry: "Education",
    location: "Remote",
    workType: "remote",
    duration: "3 months",
    stipend: "₹55,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },

  // RetailIQ Analytics
  {
    companyKey: "seed_company_retailiq",
    title: "Data Scientist Intern — Demand Forecasting",
    description:
      "Build and improve forecasting models used by top global retailers to optimize $50B+ in inventory. You will work with large-scale time series data, experiment with forecasting architectures (ARIMA, Prophet, Temporal Fusion Transformers), and present results to retail executives.",
    requiredSkills: ["Python", "Machine Learning", "Time Series", "SQL"],
    preferredSkills: ["Prophet", "LightGBM", "Snowflake", "dbt", "Databricks"],
    requiredGpa: 3.2,
    industry: "Retail",
    location: "Chicago, IL",
    workType: "hybrid",
    duration: "12 weeks",
    stipend: "₹75,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_retailiq",
    title: "Analytics Engineer Intern",
    description:
      "Transform raw retail data into clean, reliable data models that power our product. You will write dbt models, define data contracts, build dashboards in Looker, and work with data engineers to improve pipeline reliability.",
    requiredSkills: ["SQL", "dbt", "Python", "Data Modeling"],
    preferredSkills: ["Snowflake", "Looker", "Airflow", "Great Expectations", "Spark"],
    requiredGpa: 3.0,
    industry: "Retail",
    location: "Remote",
    workType: "remote",
    duration: "3 months",
    stipend: "₹65,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_retailiq",
    title: "Backend Engineer Intern — Data APIs",
    description:
      "Build the APIs that serve real-time insights to retail buyers and supply chain teams. You will design GraphQL and REST endpoints, optimize database queries against billion-row tables, and implement caching strategies for low-latency analytics.",
    requiredSkills: ["Python", "PostgreSQL", "REST APIs", "GraphQL"],
    preferredSkills: ["FastAPI", "Redis", "Snowflake", "Docker", "Kubernetes"],
    requiredGpa: 2.8,
    industry: "Retail",
    location: "Seattle, WA",
    workType: "hybrid",
    duration: "3 months",
    stipend: "₹70,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },

  // SpaceMind Robotics
  {
    companyKey: "seed_company_spacemind",
    title: "Robotics Software Intern — Autonomous Navigation",
    description:
      "Develop navigation and path planning algorithms for our warehouse robots. You will implement SLAM, obstacle avoidance, and multi-robot coordination systems using ROS 2. Your code will run on actual robots in production warehouses.",
    requiredSkills: ["C++", "Python", "ROS", "Algorithms"],
    preferredSkills: ["ROS 2", "SLAM", "Computer Vision", "Gazebo", "OpenCV"],
    requiredGpa: 3.3,
    industry: "Robotics",
    location: "Boston, MA",
    workType: "onsite",
    duration: "4 months",
    stipend: "₹75,000/month",
    openings: 2,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_spacemind",
    title: "Computer Vision Intern",
    description:
      "Build the perception stack that lets our robots understand the world around them. You will train object detection models, implement depth estimation from stereo cameras, and deploy models to edge inference hardware running in warehouse environments.",
    requiredSkills: ["Python", "Computer Vision", "Deep Learning", "PyTorch"],
    preferredSkills: ["YOLO", "TensorRT", "CUDA", "OpenCV", "ONNX"],
    requiredGpa: 3.2,
    industry: "Robotics",
    location: "Boston, MA",
    workType: "onsite",
    duration: "3 months",
    stipend: "₹80,000/month",
    openings: 1,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: "seed_company_spacemind",
    title: "Controls & Simulation Intern",
    description:
      "Design and validate control systems for our next-generation robot arm. You will run physics-based simulations, tune PID and MPC controllers, implement safety constraints, and validate your work on hardware before deployment.",
    requiredSkills: ["C++", "Control Systems", "MATLAB", "Python"],
    preferredSkills: ["Simulink", "MPC", "ROS 2", "Gazebo", "Linear Algebra"],
    requiredGpa: 3.4,
    industry: "Robotics",
    location: "Pittsburgh, PA",
    workType: "onsite",
    duration: "4 months",
    stipend: "₹70,000/month",
    openings: 1,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log("Starting seed...\n");

  // 1. Seed ModelWeights if not exists
  const existingWeights = await db.modelWeights.findFirst();
  if (!existingWeights) {
    await db.modelWeights.create({
      data: {
        contentWeight: 0.6,
        collaborativeWeight: 0.4,
        threshold: 0.3,
        topK: 10,
        learningRate: 0.01,
      },
    });
    console.log("  Created ModelWeights (α=0.6, β=0.4)");
  } else {
    console.log("  ModelWeights already exist — skipping");
  }

  // 2. Seed companies + internships
  for (const companyData of companies) {
    // Check if this seed company already exists
    const existing = await db.user.findUnique({
      where: { clerkId: companyData.clerkId },
    });

    if (existing) {
      console.log(`  Company "${companyData.name}" already seeded — skipping`);
      continue;
    }

    // Create the seed user
    const user = await db.user.create({
      data: {
        clerkId: companyData.clerkId,
        email: companyData.email,
        role: "COMPANY",
      },
    });

    // Create the company profile
    const company = await db.company.create({
      data: {
        userId: user.id,
        name: companyData.name,
        industry: companyData.industry,
        description: companyData.description,
        website: companyData.website,
      },
    });

    console.log(`  Created company: ${companyData.name}`);

    // Create internships for this company
    const internships = internshipData.filter(
      (i) => i.companyKey === companyData.clerkId
    );

    for (const internship of internships) {
      const { companyKey, ...internshipFields } = internship;
      void companyKey;

      await db.internship.create({
        data: {
          companyId: company.id,
          title: internshipFields.title,
          description: internshipFields.description,
          requiredSkills: internshipFields.requiredSkills,
          preferredSkills: internshipFields.preferredSkills,
          requiredGpa: internshipFields.requiredGpa,
          industry: internshipFields.industry,
          location: internshipFields.location,
          workType: internshipFields.workType,
          duration: internshipFields.duration,
          stipend: internshipFields.stipend,
          openings: internshipFields.openings,
          deadline: internshipFields.deadline,
          isActive: true,
        },
      });

      console.log(`    + "${internshipFields.title}"`);
    }
  }

  // Summary
  const [internshipCount, companyCount] = await Promise.all([
    db.internship.count(),
    db.company.count(),
  ]);

  console.log(`\nSeed complete!`);
  console.log(`  Companies:   ${companyCount}`);
  console.log(`  Internships: ${internshipCount}`);
  console.log(`\nYou can now browse internships at /internships`);
  console.log(
    `Sign up as a student, complete your profile, and visit /recommendations to generate AI matches.\n`
  );
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
