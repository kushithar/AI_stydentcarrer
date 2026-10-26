-- Seed Data for MySQL Database
USE student_career_db;

-- 1. Insert Core Skills
INSERT IGNORE INTO skills (name, category, description) VALUES
('Python', 'Technical', 'General purpose scripting, backend development, and data manipulation.'),
('JavaScript', 'Technical', 'Interactive web development, front-end frameworks, and asynchronous programming.'),
('SQL & Relational Databases', 'Technical', 'Relational data querying, schema normalization, indexing, and joins.'),
('HTML5 & Modern CSS', 'Technical', 'Responsive layout styling, flexbox, CSS grid, and semantic DOM structure.'),
('React.js', 'Technical', 'Component-based declarative frontend architectures and reactive state management.'),
('Machine Learning Algorithms', 'Technical', 'Supervised and unsupervised scikit-learn models, validation, and evaluation.'),
('Deep Learning & Neural Networks', 'Technical', 'PyTorch/TensorFlow, convolution, recurrent networks, and transformers.'),
('Cloud Computing & AWS', 'Technical', 'Cloud architecture, compute, object storage, serverless, and IAM security.'),
('Network Security & Cryptography', 'Technical', 'Protocols, firewalls, encryption ciphers, vulnerability scanning, and hardening.'),
('Docker & Containerization', 'Technical', 'Container virtualization, images, multi-stage builds, and deployment.'),
('API & Microservice Design', 'Technical', 'RESTful endpoints, JSON schemas, authentication, and HTTP status codes.'),
('Statistical Analysis & Hypothesis Testing', 'Analytical', 'Inferential statistics, distributions, p-values, ANOVA, and regression.'),
('Data Visualization & Dashboards', 'Analytical', 'Executive visual reporting, Tableau, Power BI, and interactive charts.'),
('Financial Modeling & Valuation', 'Analytical', 'DCF models, sensitivity analysis, corporate statements, and capital budgeting.'),
('Algorithmic Problem Solving', 'Analytical', 'Data structures, Big-O computational complexity, and dynamic programming.'),
('UI/UX & Wireframing', 'Design', 'User personas, wireframing, Figma components, and interaction patterns.'),
('Design Systems & Accessibility', 'Design', 'Atomic UI tokens, WCAG 2.1 accessibility, and typography hierarchies.'),
('Product Strategy & Roadmapping', 'Business', 'Value proposition mapping, PRD drafting, and KPI definition.'),
('Digital Marketing & SEO', 'Business', 'Search engine optimization, content strategy, funnel attribution, and CRO.'),
('Technical Writing & Documentation', 'Communication', 'Clear architectural documentation, API specs, and user guides.'),
('Agile Teamwork & Collaboration', 'Communication', 'Scrum ceremonies, cross-functional sprints, Git workflows, and code reviews.'),
('Project Leadership & Organization', 'Leadership', 'Resource planning, risk mitigation, mentoring, and stakeholder management.');

-- 2. Insert Core Careers
INSERT IGNORE INTO careers (id, title, category, description, min_academic_percentage, average_salary_range, job_outlook, work_environment, is_active) VALUES
(1, 'Software Developer', 'Technology', 'Architects, writes, and tests software applications, operating systems, and backend services to power modern digital enterprises.', 55.0, '$80,000 - $130,000', 'High Demand (17% growth)', 'Hybrid / Collaborative / Engineering team', TRUE),
(2, 'Web Developer', 'Technology', 'Designs and builds interactive, responsive websites and web applications with seamless frontend experiences and robust API integrations.', 50.0, '$70,000 - $115,000', 'Very High Growth (16% growth)', 'Remote / Hybrid / Fast-paced web team', TRUE),
(3, 'Data Analyst', 'Data & AI', 'Inspects, cleans, transforms, and models data to uncover meaningful operational insights, trends, and strategic business intelligence.', 55.0, '$65,000 - $95,000', 'Rapid Expansion (23% growth)', 'Office / Analytical / Business Intelligence team', TRUE),
(4, 'Data Scientist', 'Data & AI', 'Applies rigorous statistical modeling, feature engineering, and predictive algorithms to solve ambiguous, high-impact business problems.', 65.0, '$95,000 - $150,000', 'Exceptionally High Growth (35% growth)', 'Hybrid / Analytical & Research focused', TRUE),
(5, 'AI/ML Engineer', 'Data & AI', 'Constructs, deploys, and monitors scalable artificial intelligence systems, neural networks, and automated inference services in production.', 65.0, '$110,000 - $175,000', 'Explosive Demand (40% growth)', 'Hybrid / High-tech AI Research & Development', TRUE),
(6, 'Cybersecurity Analyst', 'Technology', 'Safeguards information systems, networks, and confidential data by monitoring threats, performing vulnerability audits, and responding to security incidents.', 55.0, '$85,000 - $135,000', 'Crucial Demand (32% growth)', 'Office / Security Operations Center (SOC)', TRUE),
(7, 'Cloud Engineer', 'Technology', 'Architects, automates, and maintains highly available, resilient cloud computing infrastructure, serverless workflows, and DevOps CI/CD pipelines.', 55.0, '$95,000 - $145,000', 'High Demand (25% growth)', 'Remote / Cloud Operations team', TRUE),
(8, 'UI/UX Designer', 'Design', 'Crafts intuitive, accessible, and delightful digital user interfaces through rigorous user research, wireframing, and interactive design systems.', 50.0, '$70,000 - $115,000', 'Steady Growth (14% growth)', 'Creative Studio / Product Design team', TRUE),
(9, 'Business Analyst', 'Business & Management', 'Bridges business goals with technological execution by analyzing processes, defining functional requirements, and identifying strategic opportunities.', 55.0, '$75,000 - $110,000', 'Strong Growth (14% growth)', 'Corporate / Cross-functional team', TRUE),
(10, 'Digital Marketing Specialist', 'Business & Management', 'Drives brand awareness, qualified customer acquisition, and organic conversion through multi-channel content, SEO, and paid performance campaigns.', 50.0, '$55,000 - $85,000', 'High Demand (10% growth)', 'Digital Agency / In-house Growth team', TRUE),
(11, 'Financial Analyst', 'Finance', 'Analyzes financial performance, builds predictive valuation models, evaluates investment viability, and provides data-driven financial advice.', 60.0, '$80,000 - $125,000', 'Steady Growth (9% growth)', 'Corporate Finance / Investment Banking', TRUE),
(12, 'Researcher', 'Education & Research', 'Investigates theoretical and empirical questions, designs rigorous experiments, collects data, and publishes scholarly findings in peer-reviewed journals.', 65.0, '$65,000 - $110,000', 'Steady Academic Demand', 'University / Research Institute / R&D Laboratory', TRUE),
(13, 'Teacher or Educator', 'Education & Research', 'Inspires, guides, and educates students by designing curriculum, delivering engaging instructional lessons, and assessing learning outcomes.', 55.0, '$50,000 - $80,000', 'Steady Community Demand', 'School / College / EdTech Institution', TRUE),
(14, 'Product Manager', 'Business & Management', 'Steers the product strategy, vision, execution, and launch, aligning engineering, design, and business goals to deliver high-value customer products.', 60.0, '$100,000 - $160,000', 'High Demand (12% growth)', 'Hybrid / Collaborative Product leadership', TRUE);

-- 3. Insert Accredited Courses
INSERT IGNORE INTO courses (title, provider, description, url, difficulty, duration, skill_taught, cost_type, is_active) VALUES
('Scientific Computing with Python', 'freeCodeCamp', 'Comprehensive certification covering Python fundamentals, data structures, algorithms, and 5 practical projects.', 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', 'Beginner', '300 hours', 'Python', 'Free', TRUE),
('Responsive Web Design Certification', 'freeCodeCamp', 'Learn semantic HTML5, modern CSS flexbox and grid, typography, and responsive web accessibility.', 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', 'Beginner', '300 hours', 'HTML5 & Modern CSS', 'Free', TRUE),
('Intro to Machine Learning', 'Kaggle Learn', 'Practical hands-on course covering decision trees, random forests, model validation, and scikit-learn.', 'https://www.kaggle.com/learn/intro-to-machine-learning', 'Intermediate', '5 hours', 'Machine Learning Algorithms', 'Free', TRUE),
('Intro to SQL', 'Kaggle Learn', 'Master SQL querying using BigQuery, SELECT, WHERE, GROUP BY, HAVING, and relational JOIN operations.', 'https://www.kaggle.com/learn/intro-to-sql', 'Beginner', '4 hours', 'SQL & Relational Databases', 'Free', TRUE),
('MDN Web Docs: JavaScript Guide', 'MDN Web Docs', 'Authoritative open documentation on modern ECMAScript, asynchronous programming, closures, and DOM.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'Beginner-Intermediate', 'Self-paced', 'JavaScript', 'Free', TRUE),
('Azure Cloud Fundamentals', 'Microsoft Learn', 'Official path exploring cloud concepts, core architecture components, storage models, and security.', 'https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/', 'Beginner', '10 hours', 'Cloud Computing & AWS', 'Free', TRUE),
('Figma for Beginners & Design Systems', 'Figma Learn', 'Official tutorials on auto-layout, interactive component variants, design tokens, and design handoff.', 'https://help.figma.com/hc/en-us/categories/360002051613-Figma-Design', 'Beginner', '8 hours', 'UI/UX & Wireframing', 'Free', TRUE);
