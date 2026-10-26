"""
Database Seeding Script
Populates verified skills, industry careers, career-skill mappings,
and accredited free/open learning resources.
"""

import json
from app.extensions import db
from app.models.user import User
from app.models.career import Career, Skill, CareerSkill
from app.models.course import Course, CareerCourse
from app.models.student import StudentProfile

SKILLS_SEED = [
    # Technical
    {"name": "Python", "category": "Technical", "description": "General purpose scripting, backend development, and data manipulation."},
    {"name": "JavaScript", "category": "Technical", "description": "Interactive web development, front-end frameworks, and asynchronous programming."},
    {"name": "SQL & Relational Databases", "category": "Technical", "description": "Relational data querying, schema normalization, indexing, and joins."},
    {"name": "HTML5 & Modern CSS", "category": "Technical", "description": "Responsive layout styling, flexbox, CSS grid, and semantic DOM structure."},
    {"name": "React.js", "category": "Technical", "description": "Component-based declarative frontend architectures and reactive state management."},
    {"name": "Machine Learning Algorithms", "category": "Technical", "description": "Supervised and unsupervised scikit-learn models, validation, and evaluation."},
    {"name": "Deep Learning & Neural Networks", "category": "Technical", "description": "PyTorch/TensorFlow, convolution, recurrent networks, and transformers."},
    {"name": "Cloud Computing & AWS", "category": "Technical", "description": "Cloud architecture, compute, object storage, serverless, and IAM security."},
    {"name": "Network Security & Cryptography", "category": "Technical", "description": "Protocols, firewalls, encryption ciphers, vulnerability scanning, and hardening."},
    {"name": "Docker & Containerization", "category": "Technical", "description": "Container virtualization, images, multi-stage builds, and deployment."},
    {"name": "API & Microservice Design", "category": "Technical", "description": "RESTful endpoints, JSON schemas, authentication, and HTTP status codes."},

    # Analytical
    {"name": "Statistical Analysis & Hypothesis Testing", "category": "Analytical", "description": "Inferential statistics, distributions, p-values, ANOVA, and regression."},
    {"name": "Data Visualization & Dashboards", "category": "Analytical", "description": "Executive visual reporting, Tableau, Power BI, and interactive charts."},
    {"name": "Financial Modeling & Valuation", "category": "Analytical", "description": "DCF models, sensitivity analysis, corporate statements, and capital budgeting."},
    {"name": "Algorithmic Problem Solving", "category": "Analytical", "description": "Data structures, Big-O computational complexity, and dynamic programming."},

    # Design
    {"name": "UI/UX & Wireframing", "category": "Design", "description": "User personas, wireframing, Figma components, and interaction patterns."},
    {"name": "Design Systems & Accessibility", "category": "Design", "description": "Atomic UI tokens, WCAG 2.1 accessibility, and typography hierarchies."},

    # Business & Soft Skills
    {"name": "Product Strategy & Roadmapping", "category": "Business", "description": "Value proposition mapping, PRD drafting, and KPI definition."},
    {"name": "Digital Marketing & SEO", "category": "Business", "description": "Search engine optimization, content strategy, funnel attribution, and CRO."},
    {"name": "Technical Writing & Documentation", "category": "Communication", "description": "Clear architectural documentation, API specs, and user guides."},
    {"name": "Agile Teamwork & Collaboration", "category": "Communication", "description": "Scrum ceremonies, cross-functional sprints, Git workflows, and code reviews."},
    {"name": "Project Leadership & Organization", "category": "Leadership", "description": "Resource planning, risk mitigation, mentoring, and stakeholder management."}
]

CAREERS_SEED = [
    {
        "title": "Software Developer",
        "category": "Technology",
        "description": "Architects, writes, and tests software applications, operating systems, and backend services to power modern digital enterprises.",
        "typical_responsibilities": json.dumps([
            "Develop clean, maintainable, and well-tested code for web and desktop applications.",
            "Collaborate with product designers and engineers in Agile sprint cycles.",
            "Optimize backend database queries, API latency, and application throughput.",
            "Participate in code reviews and automate CI/CD release pipelines."
        ]),
        "required_skills_summary": "Object-oriented programming, data structures, relational databases, Git version control.",
        "preferred_skills_summary": "Docker containerization, cloud deployment, automated integration testing.",
        "relevant_subjects": json.dumps(["Computer Science", "Mathematics", "Algorithms", "Software Engineering"]),
        "prerequisites": "Proficiency in at least one modern backend programming language (Python, Java, C++, or Go).",
        "min_academic_percentage": 55.0,
        "average_salary_range": "$80,000 - $130,000",
        "job_outlook": "High Demand (17% 10-year growth)",
        "work_environment": "Hybrid / Collaborative / Engineering team",
        "skills": [
            {"name": "Python", "designation": "required", "importance": 1.5, "min_rating": 3},
            {"name": "SQL & Relational Databases", "designation": "required", "importance": 1.4, "min_rating": 3},
            {"name": "Algorithmic Problem Solving", "designation": "required", "importance": 1.3, "min_rating": 3},
            {"name": "API & Microservice Design", "designation": "required", "importance": 1.2, "min_rating": 3},
            {"name": "Docker & Containerization", "designation": "preferred", "importance": 1.0, "min_rating": 2},
            {"name": "Agile Teamwork & Collaboration", "designation": "preferred", "importance": 1.0, "min_rating": 3}
        ]
    },
    {
        "title": "Web Developer",
        "category": "Technology",
        "description": "Designs and builds interactive, responsive websites and web applications with seamless frontend experiences and robust API integrations.",
        "typical_responsibilities": json.dumps([
            "Translate UI/UX wireframes into responsive, accessible web interfaces.",
            "Build reactive stateful components utilizing React or modern JavaScript.",
            "Connect client applications to RESTful and GraphQL backend endpoints.",
            "Audit web performance, Core Web Vitals, and browser compatibility."
        ]),
        "required_skills_summary": "HTML5, CSS3, JavaScript, React.js, responsive layouts.",
        "preferred_skills_summary": "TypeScript, CSS frameworks, Node.js, basic web security.",
        "relevant_subjects": json.dumps(["Web Technology", "Computer Science", "Information Systems"]),
        "prerequisites": "Solid foundation in semantic HTML, CSS layout algorithms, and modern JavaScript.",
        "min_academic_percentage": 50.0,
        "average_salary_range": "$70,000 - $115,000",
        "job_outlook": "Very High Growth (16% growth)",
        "work_environment": "Remote / Hybrid / Fast-paced web team",
        "skills": [
            {"name": "JavaScript", "designation": "required", "importance": 1.6, "min_rating": 3},
            {"name": "HTML5 & Modern CSS", "designation": "required", "importance": 1.5, "min_rating": 3},
            {"name": "React.js", "designation": "required", "importance": 1.4, "min_rating": 3},
            {"name": "UI/UX & Wireframing", "designation": "preferred", "importance": 1.1, "min_rating": 2},
            {"name": "API & Microservice Design", "designation": "preferred", "importance": 1.0, "min_rating": 2}
        ]
    },
    {
        "title": "Data Analyst",
        "category": "Data & AI",
        "description": "Inspects, cleans, transforms, and models data to uncover meaningful operational insights, trends, and strategic business intelligence.",
        "typical_responsibilities": json.dumps([
            "Extract and synthesize raw transaction data from complex SQL databases.",
            "Perform statistical data cleansing, reconciliation, and validation.",
            "Design dynamic executive KPI dashboards in Tableau, Power BI, or Python.",
            "Deliver structured analytical presentations to cross-functional stakeholders."
        ]),
        "required_skills_summary": "SQL, Excel/Sheets, data visualization, exploratory analysis.",
        "preferred_skills_summary": "Python pandas, statistical hypothesis testing, business acumen.",
        "relevant_subjects": json.dumps(["Statistics", "Mathematics", "Business Analytics", "Information Systems"]),
        "prerequisites": "Working knowledge of spreadsheet pivot tables and relational database querying.",
        "min_academic_percentage": 55.0,
        "average_salary_range": "$65,000 - $95,000",
        "job_outlook": "Rapid Expansion (23% growth)",
        "work_environment": "Office / Analytical / Business Intelligence team",
        "skills": [
            {"name": "SQL & Relational Databases", "designation": "required", "importance": 1.6, "min_rating": 3},
            {"name": "Data Visualization & Dashboards", "designation": "required", "importance": 1.5, "min_rating": 3},
            {"name": "Statistical Analysis & Hypothesis Testing", "designation": "required", "importance": 1.3, "min_rating": 3},
            {"name": "Python", "designation": "preferred", "importance": 1.1, "min_rating": 2},
            {"name": "Technical Writing & Documentation", "designation": "preferred", "importance": 1.0, "min_rating": 3}
        ]
    },
    {
        "title": "Data Scientist",
        "category": "Data & AI",
        "description": "Applies rigorous statistical modeling, feature engineering, and predictive algorithms to solve ambiguous, high-impact business problems.",
        "typical_responsibilities": json.dumps([
            "Formulate mathematical hypotheses and design exploratory feature sets.",
            "Train, validate, and tune machine learning regression and classification models.",
            "Analyze large unstructured datasets to identify behavioral inflection points.",
            "Present model interpretations and actionable strategic recommendations."
        ]),
        "required_skills_summary": "Python (pandas, NumPy, scikit-learn), inferential statistics, linear algebra, SQL.",
        "preferred_skills_summary": "Big data processing, cloud ML pipelines, deep learning foundations.",
        "relevant_subjects": json.dumps(["Statistics", "Linear Algebra", "Computer Science", "Calculus"]),
        "prerequisites": "Strong grounding in calculus, linear algebra, and Python programming.",
        "min_academic_percentage": 65.0,
        "average_salary_range": "$95,000 - $150,000",
        "job_outlook": "Exceptionally High Growth (35% growth)",
        "work_environment": "Hybrid / Analytical & Research focused",
        "skills": [
            {"name": "Python", "designation": "required", "importance": 1.6, "min_rating": 4},
            {"name": "Statistical Analysis & Hypothesis Testing", "designation": "required", "importance": 1.5, "min_rating": 4},
            {"name": "Machine Learning Algorithms", "designation": "required", "importance": 1.5, "min_rating": 3},
            {"name": "SQL & Relational Databases", "designation": "required", "importance": 1.2, "min_rating": 3},
            {"name": "Data Visualization & Dashboards", "designation": "preferred", "importance": 1.0, "min_rating": 3}
        ]
    },
    {
        "title": "AI/ML Engineer",
        "category": "Data & AI",
        "description": "Constructs, deploys, and monitors scalable artificial intelligence systems, neural networks, and automated inference services in production.",
        "typical_responsibilities": json.dumps([
            "Architect deep learning neural pipelines for vision, NLP, and tabular data.",
            "Optimize model training performance, GPU memory utilization, and quantization.",
            "Deploy low-latency machine learning inference microservices via Docker.",
            "Implement continuous model monitoring, data drift detection, and retraining."
        ]),
        "required_skills_summary": "Python, Deep Learning (PyTorch/TensorFlow), ML Algorithms, Docker, API design.",
        "preferred_skills_summary": "CUDA optimization, distributed training, cloud compute infrastructure.",
        "relevant_subjects": json.dumps(["Artificial Intelligence", "Linear Algebra", "Data Structures", "Probability"]),
        "prerequisites": "Advanced Python programming, data structures, and mathematical optimization.",
        "min_academic_percentage": 65.0,
        "average_salary_range": "$110,000 - $175,000",
        "job_outlook": "Explosive Demand (40% growth)",
        "work_environment": "Hybrid / High-tech AI Research & Development",
        "skills": [
            {"name": "Python", "designation": "required", "importance": 1.6, "min_rating": 4},
            {"name": "Deep Learning & Neural Networks", "designation": "required", "importance": 1.6, "min_rating": 3},
            {"name": "Machine Learning Algorithms", "designation": "required", "importance": 1.4, "min_rating": 3},
            {"name": "Docker & Containerization", "designation": "required", "importance": 1.2, "min_rating": 3},
            {"name": "Cloud Computing & AWS", "designation": "preferred", "importance": 1.1, "min_rating": 2}
        ]
    },
    {
        "title": "Cybersecurity Analyst",
        "category": "Technology",
        "description": "Safeguards information systems, networks, and confidential data by monitoring threats, performing vulnerability audits, and responding to security incidents.",
        "typical_responsibilities": json.dumps([
            "Monitor network traffic and intrusion detection alerts for anomalous signatures.",
            "Conduct automated and manual security vulnerability assessments on web apps.",
            "Enforce security baseline standards, access controls, and TLS encryption.",
            "Coordinate incident triage, forensic log investigation, and post-mortems."
        ]),
        "required_skills_summary": "Network protocols, security frameworks, Linux, vulnerability scanning.",
        "preferred_skills_summary": "Python scripting, SIEM tooling, ethical hacking, digital forensics.",
        "relevant_subjects": json.dumps(["Computer Networks", "Cybersecurity", "Operating Systems"]),
        "prerequisites": "Understanding of TCP/IP networking, OSI model, and operating system permissions.",
        "min_academic_percentage": 55.0,
        "average_salary_range": "$85,000 - $135,000",
        "job_outlook": "Crucial Demand (32% growth)",
        "work_environment": "Office / Security Operations Center (SOC)",
        "skills": [
            {"name": "Network Security & Cryptography", "designation": "required", "importance": 1.7, "min_rating": 4},
            {"name": "Python", "designation": "preferred", "importance": 1.2, "min_rating": 2},
            {"name": "Cloud Computing & AWS", "designation": "preferred", "importance": 1.2, "min_rating": 2},
            {"name": "Algorithmic Problem Solving", "designation": "preferred", "importance": 1.0, "min_rating": 3}
        ]
    },
    {
        "title": "Cloud Engineer",
        "category": "Technology",
        "description": "Architects, automates, and maintains highly available, resilient cloud computing infrastructure, serverless workflows, and DevOps CI/CD pipelines.",
        "typical_responsibilities": json.dumps([
            "Provision scalable virtual infrastructure using Infrastructure as Code (Terraform).",
            "Maintain containerized Kubernetes orchestration clusters and load balancers.",
            "Implement cloud network topologies, VPC security groups, and storage policies.",
            "Establish automated continuous deployment and cloud observability monitoring."
        ]),
        "required_skills_summary": "Cloud platforms (AWS/Azure/GCP), Docker, Linux, CI/CD, scripting.",
        "preferred_skills_summary": "Terraform, Kubernetes, serverless event-driven architecture.",
        "relevant_subjects": json.dumps(["Distributed Systems", "Cloud Computing", "Computer Networks"]),
        "prerequisites": "Linux command line proficiency and foundational networking concepts.",
        "min_academic_percentage": 55.0,
        "average_salary_range": "$95,000 - $145,000",
        "job_outlook": "High Demand (25% growth)",
        "work_environment": "Remote / Cloud Operations team",
        "skills": [
            {"name": "Cloud Computing & AWS", "designation": "required", "importance": 1.7, "min_rating": 4},
            {"name": "Docker & Containerization", "designation": "required", "importance": 1.5, "min_rating": 3},
            {"name": "Python", "designation": "required", "importance": 1.2, "min_rating": 3},
            {"name": "Network Security & Cryptography", "designation": "preferred", "importance": 1.1, "min_rating": 2}
        ]
    },
    {
        "title": "UI/UX Designer",
        "category": "Design",
        "description": "Crafts intuitive, accessible, and delightful digital user interfaces through rigorous user research, wireframing, and interactive design systems.",
        "typical_responsibilities": json.dumps([
            "Conduct qualitative user interviews, usability tests, and empathy mapping.",
            "Synthesize research into low-fidelity wireframes and user flow diagrams.",
            "Produce pixel-perfect, high-fidelity prototypes and design system libraries in Figma.",
            "Validate accessibility contrast ratios and review implemented interfaces with engineers."
        ]),
        "required_skills_summary": "Figma, wireframing, user empathy, accessibility guidelines, typography.",
        "preferred_skills_summary": "HTML/CSS comprehension, micro-interaction animations, UX writing.",
        "relevant_subjects": json.dumps(["Graphic Design", "Human-Computer Interaction", "Psychology"]),
        "prerequisites": "Strong visual design sensibilities and passion for human-centered problem solving.",
        "min_academic_percentage": 50.0,
        "average_salary_range": "$70,000 - $115,000",
        "job_outlook": "Steady Growth (14% growth)",
        "work_environment": "Creative Studio / Product Design team",
        "skills": [
            {"name": "UI/UX & Wireframing", "designation": "required", "importance": 1.7, "min_rating": 4},
            {"name": "Design Systems & Accessibility", "designation": "required", "importance": 1.5, "min_rating": 3},
            {"name": "HTML5 & Modern CSS", "designation": "preferred", "importance": 1.2, "min_rating": 2},
            {"name": "Agile Teamwork & Collaboration", "designation": "preferred", "importance": 1.1, "min_rating": 3}
        ]
    },
    {
        "title": "Business Analyst",
        "category": "Business & Management",
        "description": "Bridges business goals with technological execution by analyzing processes, defining functional requirements, and identifying strategic opportunities.",
        "typical_responsibilities": json.dumps([
            "Elicit functional and technical requirements from business stakeholders.",
            "Map current and future-state operational business processes (BPMN).",
            "Synthesize detailed user stories, acceptance criteria, and system workflows.",
            "Evaluate operational data to quantify ROI and eliminate process bottlenecks."
        ]),
        "required_skills_summary": "Requirements gathering, process modeling, SQL, stakeholder communication.",
        "preferred_skills_summary": "Agile/Scrum ceremonies, data visualization, business case financial modeling.",
        "relevant_subjects": json.dumps(["Business Administration", "Commerce", "Economics", "Management"]),
        "prerequisites": "Critical analytical thinking and clear verbal/written communication.",
        "min_academic_percentage": 55.0,
        "average_salary_range": "$75,000 - $110,000",
        "job_outlook": "Strong Growth (14% growth)",
        "work_environment": "Corporate / Cross-functional team",
        "skills": [
            {"name": "Technical Writing & Documentation", "designation": "required", "importance": 1.5, "min_rating": 3},
            {"name": "SQL & Relational Databases", "designation": "required", "importance": 1.3, "min_rating": 2},
            {"name": "Data Visualization & Dashboards", "designation": "required", "importance": 1.2, "min_rating": 3},
            {"name": "Project Leadership & Organization", "designation": "preferred", "importance": 1.2, "min_rating": 3}
        ]
    },
    {
        "title": "Digital Marketing Specialist",
        "category": "Business & Management",
        "description": "Drives brand awareness, qualified customer acquisition, and organic conversion through multi-channel content, SEO, and paid performance campaigns.",
        "typical_responsibilities": json.dumps([
            "Formulate and execute search engine optimization (SEO) content strategies.",
            "Manage paid acquisition ad campaigns across Google Ads and social channels.",
            "Track conversion funnels, bounce rates, and attribution in Google Analytics.",
            "Conduct A/B testing on marketing landing pages to maximize conversion rate (CRO)."
        ]),
        "required_skills_summary": "SEO, Google Analytics, content marketing, copywriting, campaign management.",
        "preferred_skills_summary": "Basic HTML/CSS, marketing automation, multivariate testing.",
        "relevant_subjects": json.dumps(["Marketing", "Media Communications", "Business Studies"]),
        "prerequisites": "Persuasive writing skills and fundamental understanding of web search intent.",
        "min_academic_percentage": 50.0,
        "average_salary_range": "$55,000 - $85,000",
        "job_outlook": "High Demand (10% growth)",
        "work_environment": "Digital Agency / In-house Growth team",
        "skills": [
            {"name": "Digital Marketing & SEO", "designation": "required", "importance": 1.7, "min_rating": 4},
            {"name": "Technical Writing & Documentation", "designation": "required", "importance": 1.3, "min_rating": 3},
            {"name": "Data Visualization & Dashboards", "designation": "preferred", "importance": 1.1, "min_rating": 2},
            {"name": "HTML5 & Modern CSS", "designation": "preferred", "importance": 1.0, "min_rating": 2}
        ]
    },
    {
        "title": "Financial Analyst",
        "category": "Finance",
        "description": "Analyzes financial performance, builds predictive valuation models, evaluates investment viability, and provides data-driven financial advice.",
        "typical_responsibilities": json.dumps([
            "Build dynamic 3-statement corporate financial models and forecasts in Excel.",
            "Perform valuation analyses using DCF, comparable companies, and precedent transactions.",
            "Monitor macroeconomic indicators, industry benchmarks, and capital market trends.",
            "Prepare executive board investment memorandums and variance analyses."
        ]),
        "required_skills_summary": "Financial modeling, DCF valuation, Excel, accounting, financial reporting.",
        "preferred_skills_summary": "Python for finance, SQL, CFA level knowledge.",
        "relevant_subjects": json.dumps(["Finance", "Accounting", "Economics", "Mathematics"]),
        "prerequisites": "Sound understanding of balance sheets, income statements, and cash flows.",
        "min_academic_percentage": 60.0,
        "average_salary_range": "$80,000 - $125,000",
        "job_outlook": "Steady Growth (9% growth)",
        "work_environment": "Corporate Finance / Investment Banking / Advisory",
        "skills": [
            {"name": "Financial Modeling & Valuation", "designation": "required", "importance": 1.7, "min_rating": 4},
            {"name": "Statistical Analysis & Hypothesis Testing", "designation": "required", "importance": 1.3, "min_rating": 3},
            {"name": "SQL & Relational Databases", "designation": "preferred", "importance": 1.1, "min_rating": 2},
            {"name": "Technical Writing & Documentation", "designation": "preferred", "importance": 1.0, "min_rating": 3}
        ]
    },
    {
        "title": "Researcher",
        "category": "Education & Research",
        "description": "Investigates theoretical and empirical questions, designs rigorous experiments, collects data, and publishes scholarly findings in peer-reviewed journals.",
        "typical_responsibilities": json.dumps([
            "Conduct systematic literature reviews to identify state-of-the-art research gaps.",
            "Formulate empirical hypotheses, methodology designs, and ethical review protocols.",
            "Collect and statistically validate quantitative and qualitative data.",
            "Draft and submit research manuscripts to peer-reviewed international journals."
        ]),
        "required_skills_summary": "Research methodologies, statistical analysis, academic writing, critical review.",
        "preferred_skills_summary": "Python/R statistical computing, peer-review experience, grant writing.",
        "relevant_subjects": json.dumps(["Research Methodology", "Statistics", "Domain Science"]),
        "prerequisites": "Inquisitive analytical mindset and thorough academic foundation.",
        "min_academic_percentage": 65.0,
        "average_salary_range": "$65,000 - $110,000",
        "job_outlook": "Steady Academic Demand",
        "work_environment": "University / Research Institute / R&D Laboratory",
        "skills": [
            {"name": "Statistical Analysis & Hypothesis Testing", "designation": "required", "importance": 1.6, "min_rating": 4},
            {"name": "Technical Writing & Documentation", "designation": "required", "importance": 1.5, "min_rating": 4},
            {"name": "Python", "designation": "preferred", "importance": 1.2, "min_rating": 3},
            {"name": "Algorithmic Problem Solving", "designation": "preferred", "importance": 1.1, "min_rating": 3}
        ]
    },
    {
        "title": "Teacher or Educator",
        "category": "Education & Research",
        "description": "Inspires, guides, and educates students by designing curriculum, delivering engaging instructional lessons, and assessing learning outcomes.",
        "typical_responsibilities": json.dumps([
            "Develop scaffolded curriculum modules, lesson plans, and practical learning tasks.",
            "Deliver interactive lectures, workshops, and individualized mentoring sessions.",
            "Design fair formative assessments, rubric scoring, and remediation feedback.",
            "Foster inclusive, motivating, and collaborative classroom environments."
        ]),
        "required_skills_summary": "Pedagogy, public speaking, curriculum design, patience, classroom leadership.",
        "preferred_skills_summary": "EdTech platforms, instructional media creation, student analytics.",
        "relevant_subjects": json.dumps(["Education", "Subject Specialization", "Psychology"]),
        "prerequisites": "Passion for mentorship, clear articulation, and deep mastery of subject matter.",
        "min_academic_percentage": 55.0,
        "average_salary_range": "$50,000 - $80,000",
        "job_outlook": "Steady Community Demand",
        "work_environment": "School / College / EdTech Institution",
        "skills": [
            {"name": "Technical Writing & Documentation", "designation": "required", "importance": 1.6, "min_rating": 4},
            {"name": "Project Leadership & Organization", "designation": "required", "importance": 1.4, "min_rating": 3},
            {"name": "Agile Teamwork & Collaboration", "designation": "preferred", "importance": 1.2, "min_rating": 3}
        ]
    },
    {
        "title": "Product Manager",
        "category": "Business & Management",
        "description": "Steers the product strategy, vision, execution, and launch, aligning engineering, design, and business goals to deliver high-value customer products.",
        "typical_responsibilities": json.dumps([
            "Define product vision, quarterly roadmap themes, and measurable OKRs.",
            "Prioritize feature backlogs balancing customer impact with technical feasibility.",
            "Author comprehensive Product Requirement Documents (PRDs) and user stories.",
            "Analyze product usage telemetry, conversion funnels, and retention retention cohorts."
        ]),
        "required_skills_summary": "Product roadmapping, prioritization frameworks, stakeholder management, analytics.",
        "preferred_skills_summary": "Technical background, Figma fluency, SQL data extraction.",
        "relevant_subjects": json.dumps(["Business Administration", "Computer Science", "Economics"]),
        "prerequisites": "Strong cross-functional leadership, empathy, and strategic prioritization acumen.",
        "min_academic_percentage": 60.0,
        "average_salary_range": "$100,000 - $160,000",
        "job_outlook": "High Demand (12% growth)",
        "work_environment": "Hybrid / Collaborative Product leadership",
        "skills": [
            {"name": "Product Strategy & Roadmapping", "designation": "required", "importance": 1.7, "min_rating": 4},
            {"name": "Project Leadership & Organization", "designation": "required", "importance": 1.5, "min_rating": 4},
            {"name": "Agile Teamwork & Collaboration", "designation": "required", "importance": 1.4, "min_rating": 4},
            {"name": "Data Visualization & Dashboards", "designation": "preferred", "importance": 1.1, "min_rating": 2},
            {"name": "UI/UX & Wireframing", "designation": "preferred", "importance": 1.0, "min_rating": 2}
        ]
    }
]

COURSES_SEED = [
    {
        "title": "Scientific Computing with Python",
        "provider": "freeCodeCamp",
        "description": "Comprehensive certification covering Python fundamentals, data structures, algorithms, and 5 required practical projects.",
        "url": "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
        "difficulty": "Beginner",
        "duration": "300 hours",
        "skill_taught": "Python",
        "cost_type": "Free",
        "career_links": ["Software Developer", "Data Analyst", "Data Scientist", "AI/ML Engineer"]
    },
    {
        "title": "Responsive Web Design Certification",
        "provider": "freeCodeCamp",
        "description": "Learn semantic HTML5, modern CSS flexbox and grid, typography, and responsive web accessibility with 5 real project submissions.",
        "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
        "difficulty": "Beginner",
        "duration": "300 hours",
        "skill_taught": "HTML5 & Modern CSS",
        "cost_type": "Free",
        "career_links": ["Web Developer", "UI/UX Designer"]
    },
    {
        "title": "Intro to Machine Learning",
        "provider": "Kaggle Learn",
        "description": "Practical hands-on course covering decision trees, random forests, model validation, underfitting/overfitting, and scikit-learn.",
        "url": "https://www.kaggle.com/learn/intro-to-machine-learning",
        "difficulty": "Intermediate",
        "duration": "5 hours",
        "skill_taught": "Machine Learning Algorithms",
        "cost_type": "Free",
        "career_links": ["Data Scientist", "AI/ML Engineer", "Data Analyst"]
    },
    {
        "title": "Intro to SQL",
        "provider": "Kaggle Learn",
        "description": "Master SQL querying using BigQuery, SELECT, WHERE, GROUP BY, HAVING, and relational JOIN operations on massive datasets.",
        "url": "https://www.kaggle.com/learn/intro-to-sql",
        "difficulty": "Beginner",
        "duration": "4 hours",
        "skill_taught": "SQL & Relational Databases",
        "cost_type": "Free",
        "career_links": ["Data Analyst", "Software Developer", "Business Analyst", "Data Scientist"]
    },
    {
        "title": "MDN Web Docs: JavaScript Guide",
        "provider": "MDN Web Docs",
        "description": "Authoritative open documentation and tutorials on modern ECMAScript, asynchronous programming, closures, and the DOM.",
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        "difficulty": "Beginner-Intermediate",
        "duration": "Self-paced",
        "skill_taught": "JavaScript",
        "cost_type": "Free",
        "career_links": ["Web Developer", "Software Developer"]
    },
    {
        "title": "Microsoft Learn: Azure Cloud Fundamentals",
        "provider": "Microsoft Learn",
        "description": "Official path exploring cloud concepts, core architecture components, storage models, security, and governance.",
        "url": "https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/",
        "difficulty": "Beginner",
        "duration": "10 hours",
        "skill_taught": "Cloud Computing & AWS",
        "cost_type": "Free",
        "career_links": ["Cloud Engineer", "Cybersecurity Analyst", "Software Developer"]
    },
    {
        "title": "AWS Skill Builder: Cloud Essentials",
        "provider": "AWS Skill Builder",
        "description": "Interactive foundational learning on AWS cloud global infrastructure, compute, security, and networking primitives.",
        "url": "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials",
        "difficulty": "Beginner",
        "duration": "6 hours",
        "skill_taught": "Cloud Computing & AWS",
        "cost_type": "Free",
        "career_links": ["Cloud Engineer", "Software Developer"]
    },
    {
        "title": "Google Cloud Cybersecurity Certificate Guide",
        "provider": "Coursera / Google",
        "description": "Professional training on identifying common security threats, SIEM tools, network defense, and incident escalation protocols.",
        "url": "https://www.coursera.org/professional-certificates/google-cybersecurity",
        "difficulty": "Beginner-Intermediate",
        "duration": "3-6 months",
        "skill_taught": "Network Security & Cryptography",
        "cost_type": "Freemium",
        "career_links": ["Cybersecurity Analyst"]
    },
    {
        "title": "Figma for Beginners & Design Systems",
        "provider": "Figma Learn",
        "description": "Official tutorials on auto-layout, interactive component variants, design tokens, responsive constraints, and design handoff.",
        "url": "https://help.figma.com/hc/en-us/categories/360002051613-Figma-Design",
        "difficulty": "Beginner",
        "duration": "8 hours",
        "skill_taught": "UI/UX & Wireframing",
        "cost_type": "Free",
        "career_links": ["UI/UX Designer", "Product Manager", "Web Developer"]
    }
]

def seed_database():
    """Seeds skills, careers, career_skills, and courses into the configured database"""
    # 1. Seed Skills
    skill_objs = {}
    for s_data in SKILLS_SEED:
        existing = Skill.query.filter_by(name=s_data['name']).first()
        if not existing:
            new_s = Skill(
                name=s_data['name'],
                category=s_data['category'],
                description=s_data['description']
            )
            db.session.add(new_s)
            db.session.flush()
            skill_objs[new_s.name] = new_s
        else:
            skill_objs[existing.name] = existing

    # 2. Seed Careers
    career_objs = {}
    for c_data in CAREERS_SEED:
        existing = Career.query.filter_by(title=c_data['title']).first()
        if not existing:
            c = Career(
                title=c_data['title'],
                category=c_data['category'],
                description=c_data['description'],
                typical_responsibilities=c_data['typical_responsibilities'],
                required_skills_summary=c_data['required_skills_summary'],
                preferred_skills_summary=c_data['preferred_skills_summary'],
                relevant_subjects=c_data['relevant_subjects'],
                prerequisites=c_data['prerequisites'],
                min_academic_percentage=c_data['min_academic_percentage'],
                average_salary_range=c_data['average_salary_range'],
                job_outlook=c_data['job_outlook'],
                work_environment=c_data['work_environment'],
                is_active=True
            )
            db.session.add(c)
            db.session.flush()
            career_objs[c.title] = c

            # Attach career skills
            for cs_data in c_data.get('skills', []):
                s_name = cs_data['name']
                s_obj = skill_objs.get(s_name)
                if s_obj:
                    db.session.add(CareerSkill(
                        career_id=c.id,
                        skill_id=s_obj.id,
                        designation=cs_data['designation'],
                        importance_weight=cs_data['importance'],
                        minimum_rating=cs_data['min_rating']
                    ))
        else:
            career_objs[existing.title] = existing

    # 3. Seed Courses
    for course_data in COURSES_SEED:
        existing = Course.query.filter_by(title=course_data['title']).first()
        if not existing:
            new_course = Course(
                title=course_data['title'],
                provider=course_data['provider'],
                description=course_data['description'],
                url=course_data['url'],
                difficulty=course_data['difficulty'],
                duration=course_data['duration'],
                skill_taught=course_data['skill_taught'],
                cost_type=course_data['cost_type'],
                is_active=True
            )
            db.session.add(new_course)
            db.session.flush()

            # Map to careers
            for c_title in course_data.get('career_links', []):
                c_obj = career_objs.get(c_title)
                if c_obj:
                    db.session.add(CareerCourse(
                        career_id=c_obj.id,
                        course_id=new_course.id,
                        relevance_stage="Core"
                    ))

    db.session.commit()
    print("Database successfully seeded with skills, careers, and learning resources!")

def create_admin_user(email="admin@careerai.com", password="AdminPassword123!", name="System Administrator"):
    """Creates initial administrative account safely"""
    existing = User.query.filter_by(email=email.strip().lower()).first()
    if existing:
        existing.set_password(password)
        existing.role = 'admin'
        existing.account_status = 'active'
        db.session.commit()
        print(f"Admin user {email} password updated and active.")
        return existing

    admin = User(
        full_name=name,
        email=email.strip().lower(),
        role='admin',
        account_status='active'
    )
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()
    print(f"Administrator account created: {email}")
    return admin

def create_demo_student(email="student@test.com", password="Password123!", name="Demo Student"):
    """Creates a seeded student account with an initial profile"""
    existing = User.query.filter_by(email=email.strip().lower()).first()
    if existing:
        existing.set_password(password)
        existing.role = 'student'
        existing.account_status = 'active'
        db.session.commit()
        return existing

    student = User(
        full_name=name,
        email=email.strip().lower(),
        role='student',
        account_status='active'
    )
    student.set_password(password)
    db.session.add(student)
    db.session.flush()

    # Create profile
    profile = StudentProfile(
        user_id=student.id,
        education_level="Undergraduate",
        course_stream="B.Tech Computer Science",
        academic_percentage=84.5,
        preferred_subjects=json.dumps(["Computer Science", "Mathematics", "Algorithms"]),
        profile_completion=85
    )
    db.session.add(profile)
    db.session.commit()
    print(f"Demo student account created: {email}")
    return student
