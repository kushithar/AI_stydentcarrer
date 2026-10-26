# Explainable AI/ML Recommendation Methodology

## 1. Overview & Principles

The recommendation engine in the **AI-Based Student Career Recommendation System** is built upon a transparent, explainable hybrid multi-attribute ranking algorithm. 

Unlike opaque black-box models or external paid LLMs, every match score and ranking position produced by this engine is deterministic, mathematically bounded between **0% and 100%**, and backed by explicit component breakdowns that explain *why* the career was recommended.

---

## 2. Multi-Component Mathematical Model

The total match score $S_{\text{match}} \in [0.0, 100.0]$ between a student profile $s$ and career profile $c$ is a convex combination of four distinct dimensions:

$$S_{\text{match}}(s, c) = 100 \times \left( w_I \cdot S_{\text{interest}} + w_S \cdot S_{\text{skill}} + w_A \cdot S_{\text{academic}} + w_W \cdot S_{\text{workstyle}} \right)$$

### Default Configurable Dimension Weights:
- **Interest Alignment ($w_I$)**: $35\%$ ($0.35$)
- **Skill Proficiency Match ($w_S$)**: $30\%$ ($0.30$)
- **Academic & Subject Fit ($w_A$)**: $20\%$ ($0.20$)
- **Work-Style & Aptitude ($w_W$)**: $15\%$ ($0.15$)

$$\sum w = 1.0$$

---

## 3. Dimensional Scoring Formulations

### A. Interest Alignment ($S_{\text{interest}}$)
Interests are mapped across the standardized domain vector space $\mathcal{D} \in \mathbb{R}^{12}$.
1. The student's interest ratings $r_i \in [1, 5]$ are normalized to the interval $[0.2, 1.0]$:
   $$\hat{r}_i = 0.2 + (r_i - 1.0) \times \frac{0.8}{4.0}$$
2. Career target vectors $\vec{v}_c$ are mapped with primary domains set to $1.0$, related domains set to $0.8$, and baseline domains set to $0.15$.
3. Using `sklearn.metrics.pairwise.cosine_similarity`:
   $$\text{CosineSim}(\vec{v}_s, \vec{v}_c) = \frac{\vec{v}_s \cdot \vec{v}_c}{\|\vec{v}_s\|_2 \|\vec{v}_c\|_2}$$
   $$S_{\text{interest}} = \max\left(0, \min\left(1, \frac{\text{CosineSim} + 1.0}{2.0}\right)\right)$$

### B. Skill Proficiency Match ($S_{\text{skill}}$) & Gap Analysis
For each skill required or preferred by career $c$:
- Let $r_{s, k}$ be the student's rating and $r_{c, k}^{\min}$ be the career's expected baseline level (default 3).
- Importance weight $w_k = \text{importance} \times (1.5 \text{ if required else } 1.0)$.
- Skill ratio: $\rho_k = \min\left(1.3, \frac{r_{s, k}}{r_{c, k}^{\min}}\right)$.
- Unreported skills are assigned a neutral prior of $0.4$, ensuring that a student is never harshly penalized or assigned zero simply because they have not encountered a tool yet.
- Overall skill score:
  $$S_{\text{skill}} = \frac{\sum_k w_k \cdot \min(1.0, \rho_k)}{\sum_k w_k}$$

### C. Academic & Subject Fit ($S_{\text{academic}}$)
Combines normalized marks benchmark with subject intersection:
- **Academic Marks Benchmark**: If the student provides marks $M_s \ge M_c^{\min}$, score scales from $0.7$ to $1.0$. If $M_s < M_c^{\min}$, mild decrease (minimum $0.4$). Missing marks are handled safely with a neutral default ($0.7$).
- **Subject Overlap**: Jaccard similarity between student preferred subjects and career subject domains.
  $$S_{\text{academic}} = 0.5 \cdot S_{\text{marks}} + 0.5 \cdot S_{\text{subjects}}$$

### D. Work-Style & Aptitude ($S_{\text{workstyle}}$)
Evaluates student preferences in Analytical Depth, Collaborative Teamwork, Creative Freedom, and Leadership Ownership against the career's work environment parameters.

---

## 4. Transparent Explainability Generation

For every recommended career, the engine synthesizes an explicit narrative comprising:
1. **Match Summary**: Clear qualitative alignment tier (Strong, Promising, Moderate Growth).
2. **Interest Context**: Specific declared student interests that motivate this pathway.
3. **Identified Strengths**: Skills where the student meets or exceeds baseline expectations.
4. **Growth Areas (Gaps)**: Prioritized list of skills requiring further study, ranked by requirement severity.
5. **Ethical Safeguard**: Explicit reminder that scores represent profile alignment, not guaranteed hiring outcomes.

---

## 5. Transitioning from Seed Data to Validated Production Datasets

The included 14 career profiles serve as illustrative, high-fidelity benchmark seeds. To train machine learning models on institutional student outcome datasets:
1. Replace seed records with institutional survey and placement outcome data (e.g. Kaggle Career datasets or university alumni records).
2. Train a supervised multi-class ranking classifier (e.g. Random Forest or Gradient Boosting) using `scikit-learn`.
3. Validate feature importance using SHAP (SHapley Additive exPlanations) values to retain full explainability.
