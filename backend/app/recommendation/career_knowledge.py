"""
Career Knowledge Base & Metadata
Provides roadmap templates, curated portfolio projects, subject mappings,
and benchmark profiles for the explainable recommendation engine.
"""

CAREER_PROJECTS = {
    "Software Developer": [
        {"title": "Full-Stack Task & Project Management System", "difficulty": "Intermediate", "tech": "Python, React, SQL", "description": "Build a responsive web application featuring role-based authentication, real-time status updates, and relational data modeling."},
        {"title": "Distributed File Sharing REST API", "difficulty": "Advanced", "tech": "Python, Docker, Redis", "description": "Design a high-throughput REST API supporting chunked file uploads, rate limiting, and background queue workers."}
    ],
    "Web Developer": [
        {"title": "E-Commerce Storefront with Shopping Cart", "difficulty": "Intermediate", "tech": "HTML5, CSS3, JavaScript, React", "description": "Implement an interactive, mobile-responsive e-commerce interface with state management, product filtering, and checkout validation."},
        {"title": "Real-Time Collaborative Markdown Editor", "difficulty": "Advanced", "tech": "WebSocket, React, Node.js", "description": "Develop a real-time collaborative document editor with instant syntax preview and version history."}
    ],
    "Data Analyst": [
        {"title": "Global E-Commerce Sales & Churn Analytics Dashboard", "difficulty": "Beginner-Intermediate", "tech": "Python, pandas, SQL, Tableau/PowerBI", "description": "Analyze customer retention and transactional patterns across 50,000+ orders, presenting actionable executive KPI charts."},
        {"title": "Public Health Trends Exploratory Data Analysis", "difficulty": "Intermediate", "tech": "NumPy, pandas, Matplotlib, Seaborn", "description": "Clean, reshape, and statistically analyze multi-year healthcare datasets to uncover demographic risk correlations."}
    ],
    "Data Scientist": [
        {"title": "Predictive Customer Lifetime Value (CLV) Modeling", "difficulty": "Intermediate", "tech": "scikit-learn, pandas, XGBoost", "description": "Engineer behavioral features and train regression/classification models to forecast customer lifetime value with 85%+ accuracy."},
        {"title": "Healthcare Diagnostic Prediction Pipeline", "difficulty": "Advanced", "tech": "Python, scikit-learn, SHAP, Flask", "description": "Build an end-to-end ML prediction pipeline featuring cross-validation, hyperparameter tuning, and explainable feature importances."}
    ],
    "AI/ML Engineer": [
        {"title": "Medical Image Classification with Convolutional Networks", "difficulty": "Advanced", "tech": "PyTorch, Torchvision, OpenCV", "description": "Train and evaluate deep convolutional neural networks with transfer learning and data augmentation for medical anomaly detection."},
        {"title": "Semantic Document Search & Question Answering System", "difficulty": "Advanced", "tech": "Python, Sentence-Transformers, Vector DB", "description": "Implement dense passage retrieval and semantic ranking to search technical knowledge repositories with sub-second latency."}
    ],
    "Cybersecurity Analyst": [
        {"title": "Network Intrusion & Threat Log Analyzer", "difficulty": "Intermediate", "tech": "Python, Wireshark, Snort, Linux", "description": "Automate parsing and detection of malicious traffic anomalies, port scans, and brute-force patterns from PCAP network logs."},
        {"title": "Automated Web Application Vulnerability Scanner", "difficulty": "Advanced", "tech": "Python, OWASP ZAP, Security Headers", "description": "Develop a script to scan endpoints for SQL injection vulnerabilities, XSS reflections, and misconfigured TLS headers."}
    ],
    "Cloud Engineer": [
        {"title": "Multi-Tier Web Infrastructure as Code (IaC)", "difficulty": "Intermediate", "tech": "Terraform, AWS/Azure, Docker", "description": "Provision reproducible virtual private clouds, auto-scaling compute clusters, and secured database subnets."},
        {"title": "Serverless Event-Driven Image Processing Pipeline", "difficulty": "Advanced", "tech": "AWS Lambda, S3, SQS, CloudWatch", "description": "Architect a serverless pipeline that automatically resizes, optimizes, and indexes incoming media upon cloud bucket trigger."}
    ],
    "UI/UX Designer": [
        {"title": "Mobile Healthcare Patient Companion App Design", "difficulty": "Beginner-Intermediate", "tech": "Figma, User Research, Wireframing", "description": "Conduct persona interviews, map user journeys, and produce accessible, high-fidelity interactive design prototypes adhering to WCAG 2.1 AA."},
        {"title": "SaaS Design System & Reusable Component Library", "difficulty": "Intermediate", "tech": "Figma, Design Tokens, Micro-interactions", "description": "Create a unified design system comprising atomic components, color palettes, typography hierarchies, and dark mode variants."}
    ],
    "Business Analyst": [
        {"title": "Enterprise Process Optimization & Workflow Automation Spec", "difficulty": "Intermediate", "tech": "BPMN, Excel, SQL, User Stories", "description": "Map legacy operational workflows, calculate bottleneck cycle times, and draft comprehensive functional requirements documents (FRD)."},
        {"title": "Market Entry Feasibility & Financial Sensitivity Model", "difficulty": "Intermediate", "tech": "Excel Financial Modeling, Tableau", "description": "Model customer acquisition costs, projected revenues, and break-even timelines for a new digital product launch."}
    ],
    "Digital Marketing Specialist": [
        {"title": "Omnichannel B2B Content Strategy & SEO Growth Audit", "difficulty": "Beginner-Intermediate", "tech": "Google Analytics, SEO Tools, Content Hub", "description": "Perform comprehensive keyword intent research, optimize technical meta architecture, and design a 6-month organic growth funnel."},
        {"title": "Performance Marketing A/B Testing & Attribution Campaign", "difficulty": "Intermediate", "tech": "Meta Ads Manager, Google Ads, SQL", "description": "Design multivariate landing page experiments, measure conversion lifts, and compute multi-touch marketing attribution."}
    ],
    "Financial Analyst": [
        {"title": "Three-Statement Corporate Financial & DCF Valuation Model", "difficulty": "Intermediate", "tech": "Excel, Python for Finance, SQL", "description": "Build an integrated Income Statement, Balance Sheet, and Cash Flow model forecasting 5-year discounted cash flows (DCF)."},
        {"title": "Algorithmic Portfolio Risk & Modern Portfolio Theory (MPT) Optimizer", "difficulty": "Advanced", "tech": "Python, pandas, NumPy, SciPy", "description": "Simulate Monte Carlo asset allocations to calculate Sharpe ratios, value-at-risk (VaR), and the efficient portfolio frontier."}
    ],
    "Researcher": [
        {"title": "Systematic Literature Review & Meta-Analysis Framework", "difficulty": "Intermediate", "tech": "Zotero, LaTeX, Statistical Testing", "description": "Synthesize 80+ peer-reviewed academic papers in a specialized domain, extracting comparative metrics and theoretical gaps."},
        {"title": "Experimental Hypothesis Testing & Statistical Validation Suite", "difficulty": "Advanced", "tech": "Python, SciPy, statsmodels, R", "description": "Design controlled empirical experiments, conduct ANOVA and non-parametric hypothesis tests, and prepare publication-ready figures."}
    ],
    "Teacher or Educator": [
        {"title": "Interactive STEM Curriculum & Formative Assessment Portal", "difficulty": "Beginner-Intermediate", "tech": "Pedagogical Design, EdTech, Rubrics", "description": "Develop a 12-week modular learning curriculum with differentiated instruction, video micro-lessons, and scaffolded quizzes."},
        {"title": "Adaptive Student Learning Analytics & Remediation System", "difficulty": "Intermediate", "tech": "LMS Integration, Formative Analytics", "description": "Analyze assessment outcome distributions to identify concept misconceptions and design targeted remediation exercises."}
    ],
    "Product Manager": [
        {"title": "Comprehensive Product Requirement Document (PRD) & MVP Roadmap", "difficulty": "Intermediate", "tech": "PRD Templates, User Journeys, Jira", "description": "Define product vision, user personas, key performance indicators (KPIs), functional user stories, and acceptance criteria for an AI product."},
        {"title": "Feature Prioritization Matrix & Product Opportunity Tree", "difficulty": "Intermediate", "tech": "RICE Framework, MoSCoW, Figma", "description": "Evaluate 25+ product feature requests using the RICE scoring model to balance engineering effort against business value."}
    ]
}

ROADMAP_TEMPLATES = {
    "Technology": [
        {"phase": "Phase 1: Foundations", "duration": "Weeks 1-4", "focus": "Core programming principles, data structures, algorithms, version control (Git)."},
        {"phase": "Phase 2: Core Engineering", "duration": "Weeks 5-10", "focus": "System architecture, relational databases, backend APIs, clean code and unit testing."},
        {"phase": "Phase 3: Applied Projects", "duration": "Weeks 11-16", "focus": "Building end-to-end full-stack applications, containerization (Docker), deployment."},
        {"phase": "Phase 4: Specialization & Portfolio", "duration": "Weeks 17-24", "focus": "Performance tuning, cloud infrastructure, open-source contributions, technical interviews."}
    ],
    "Data & AI": [
        {"phase": "Phase 1: Foundations", "duration": "Weeks 1-4", "focus": "Python programming, mathematical foundations (Linear Algebra, Calculus), descriptive statistics."},
        {"phase": "Phase 2: Data Wrangling & Analysis", "duration": "Weeks 5-10", "focus": "pandas, NumPy, advanced SQL querying, data cleaning, exploratory data analysis."},
        {"phase": "Phase 3: Machine Learning & Modeling", "duration": "Weeks 11-16", "focus": "Supervised/unsupervised scikit-learn models, validation techniques, feature engineering, model evaluation."},
        {"phase": "Phase 4: Advanced Specialization", "duration": "Weeks 17-24", "focus": "Deep learning/NLP, model deployment (API/Docker), monitoring, Kaggle competitions, portfolio presentations."}
    ],
    "Design": [
        {"phase": "Phase 1: Design Principles", "duration": "Weeks 1-4", "focus": "Visual hierarchy, typography, color theory, accessibility standards (WCAG), user psychology."},
        {"phase": "Phase 2: UX Research & Wireframing", "duration": "Weeks 5-10", "focus": "User interviews, persona building, information architecture, wireframing, usability testing."},
        {"phase": "Phase 3: High-Fidelity UI & Prototyping", "duration": "Weeks 11-16", "focus": "Mastering Figma, interactive component variants, design systems, micro-interactions."},
        {"phase": "Phase 4: Case Studies & Portfolio", "duration": "Weeks 17-24", "focus": "Documenting 3 in-depth end-to-end product design case studies, design handoff to developers."}
    ],
    "Business & Management": [
        {"phase": "Phase 1: Business Fundamentals", "duration": "Weeks 1-4", "focus": "Organizational strategy, financial acumen, stakeholder communication, market dynamics."},
        {"phase": "Phase 2: Analytics & Requirements", "duration": "Weeks 5-10", "focus": "Data-driven decision making, SQL/Excel modeling, user stories, process mapping (BPMN)."},
        {"phase": "Phase 3: Product Strategy & Execution", "duration": "Weeks 11-16", "focus": "Agile/Scrum ceremonies, product roadmapping, feature prioritization frameworks (RICE)."},
        {"phase": "Phase 4: Leadership & Portfolio", "duration": "Weeks 17-24", "focus": "Launch readiness, go-to-market strategies, executive presentations, mock product reviews."}
    ],
    "Default": [
        {"phase": "Phase 1: Foundational Core", "duration": "Weeks 1-4", "focus": "Fundamental principles, terminologies, and prerequisite domain knowledge."},
        {"phase": "Phase 2: Skill Acquisition", "duration": "Weeks 5-10", "focus": "Hands-on tools, frameworks, and standardized industry workflows."},
        {"phase": "Phase 3: Practical Projects", "duration": "Weeks 11-16", "focus": "Independent portfolio project implementation addressing real-world problem sets."},
        {"phase": "Phase 4: Industry Readiness", "duration": "Weeks 17-24", "focus": "Portfolio synthesis, certification, interview preparation, and peer networking."}
    ]
}
