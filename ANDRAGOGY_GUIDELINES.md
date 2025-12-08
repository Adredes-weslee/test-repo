
# Elice Creator AI: Pedagogical Framework & Generation Guidelines

This document serves as the single source of truth for the pedagogical logic driving Elice Creator AI. It synthesizes **Constructive Alignment**, **6 PoLD (Principles of Learning Design)**, **David Boud’s Features of Practice**, **Stephen Billett’s Workplace Learning**, **Bloom's Taxonomy (Revised)**, **Merrill’s First Principles of Instruction**, and **Vygotsky's Social Constructivism** into actionable guidelines for content generation.

**New Additions:**
*   **Mayer’s Multimedia Principles:** For visual content and slides.
*   **Universal Design for Learning (UDL):** For accessibility and inclusive design.

---

## 1. Overarching Philosophy: Constructive Alignment
All content must align three core components in a triangular structure:
1.  **Intended Learning Outcomes (ILOs):** What the learner should be able to do (Competence/Capability).
2.  **Teaching & Learning Activities (TLAs):** The authentic tasks and practice the learner engages in.
3.  **Assessment Tasks (ATs):** The evidence collected to verify the ILOs.

**AI Instruction:** Ensure the *verbs* in the Learning Outcomes match the *actions* in the Deliverables and the *criteria* in the Assessment.

---

## 2. The Core Framework: 6 PoLD (Principles of Learning Design)

The AI must ensure every generated artifact adheres to these six pillars:

### 1. Authentic
*   **Definition:** Use real-world practices, tools, and complexity.
*   **Implementation:** Avoid generic "FooBar" examples. Use industry-specific scenarios (e.g., "Patient Tracker" for Healthcare). Complexity should reflect reality, not oversimplified abstractions.

### 2. Alignment
*   **Definition:** Coherence between Outcomes, Activities, and Assessments.
*   **Implementation:** The difficulty level (Beginner/Advanced) must be consistent across the Tech Stack, Requirements, and Judgement Criteria.

### 3. Holistic
*   **Definition:** Integrate Knowing, Doing, Thinking, and Feeling.
*   **Implementation:** Combine technical execution (Doing) with architectural reasoning (Thinking) and professional standards (Feeling/Identity).

### 4. Feedback
*   **Definition:** Multiple-source, dialogic, and actionable.
*   **Implementation:** Hints in exercises must scaffold, not solve. Explanations in quizzes must address *why* an answer is wrong.

### 5. Judgement
*   **Definition:** Developing the learner's capability to evaluate quality.
*   **Implementation:** Include "Judgement Criteria" or self-assessment checklists. Teach the learner *how to recognize* good work.

### 6. Future-oriented
*   **Definition:** Adaptability, learning-to-learn, and sustainable assessment.
*   **Implementation:** Focus on patterns and principles that transfer. Include "Future-Oriented Elements" like dealing with ambiguity or sparse documentation.

---

## 3. Features of Practice (David Boud)

To ensure content represents *Practice* rather than just *Schooling*, it must exhibit these six features:

1.  **Embodied:** Learning involves the whole person acting in a role.
    *   *AI Check:* Address the learner as a professional (e.g., "As a Junior DevOps Engineer...").
2.  **Materially Mediated:** Practice is shaped by tools, artifacts, and the environment.
    *   *AI Check:* The `fileStructure` and `techStack` are not just details; they are the *medium* of learning. Use idiomatic, professional file layouts.
3.  **Relational:** Work happens with others.
    *   *AI Check:* Frame tasks in the context of a team, clients, or users (e.g., "Prepare this for code review").
4.  **Situated:** Context is critical.
    *   *AI Check:* Place abstract concepts into specific, named situations or industries.
5.  **Emergent:** Practice unfolds and changes; it is not rigid.
    *   *AI Check:* Allow for open-ended deliverables where learners can extend functionality.
6.  **Co-constructed:** Meaning is made together.
    *   *AI Check:* Assessment should invite the learner's perspective (e.g., self-reflection).

---

## 4. Workplace Learning (Stephen Billett)

How the AI scaffolds the learning experience:

1.  **Affordances for Learning:** The environment must invite participation.
    *   *AI Check:* Ensure tasks are challenging but doable (Zone of Proximal Development).
2.  **Guided Participation:** The expert (AI) guides the novice.
    *   *AI Check:* For Beginners, provide granular steps (high guidance). For Advanced, provide goals and constraints (low guidance).
3.  **Expert–Novice Co-participation:** Learning happens through doing alongside an expert.
    *   *AI Check:* Use an authoritative but encouraging tone. Model expert behavior in `README.md` and descriptions.

---

## 5. Bloom’s Taxonomy (Revised)

Used for shaping Learning Outcomes, Cognitive Progression, and Assessment Complexity.

**Bloom’s Levels:**
1.  **Remember:** Recall facts and basic concepts.
2.  **Understand:** Explain ideas or concepts.
3.  **Apply:** Use information in new situations.
4.  **Analyze:** Draw connections among ideas.
5.  **Evaluate:** Justify a stand or decision.
6.  **Create:** Produce new or original work.

**AI Instruction:**
*   **Beginner:** Target levels 1-3 (Remember, Understand, Apply). Verbs: Define, Describe, Implement, Use.
*   **Intermediate:** Target levels 3-5 (Apply, Analyze, Evaluate). Verbs: Execute, Debug, Differentiate, Critique.
*   **Advanced:** Target levels 4-6 (Analyze, Evaluate, Create). Verbs: Architect, Optimize, Judge, Design.

---

## 6. Merrill’s First Principles of Instruction

A problem-centered approach to instructional design that consists of five phases.

1.  **Problem-centered:** Learning is promoted when learners are engaged in solving real-world problems.
    *   *AI Check:* The `detailedDescription` must frame the entire course/project as a single cohesive problem to solve, not just isolated tasks.
2.  **Activation:** Learning is promoted when relevant previous experience is activated.
    *   *AI Check:* Ensure `learningOutcomes` build upon the defined `difficulty` level. Prerequisite knowledge should be implicitly activated by the task context.
3.  **Demonstration:** Learning is promoted when the instruction demonstrates what is to be learned.
    *   *AI Check:* The `fileStructure` and boilerplate code serve as the "Demonstration" phase—showing the learner *how* a professional project looks before they start coding.
4.  **Application:** Learning is promoted when learners are required to use their new knowledge or skill to solve problems.
    *   *AI Check:* The `projectRequirements` and `deliverables` are the "Application" phase.
5.  **Integration:** Learning is promoted when learners are encouraged to integrate (transfer) the new knowledge or skill into their everyday life.
    *   *AI Check:* Include a "Reflection Component" in the deliverables and ensured the `futureOrientedElement` helps transfer skills to new contexts.

---

## 7. Vygotsky's Social Constructivism (New)

Learning is a social process where learners build knowledge through interaction with others and culture.

1.  **Zone of Proximal Development (ZPD):** The distance between what a learner can do alone and what they can do with guidance.
    *   *AI Check:* Ensure the generated content hits this "sweet spot". For 'Beginner', provide more structure (lower end of ZPD). For 'Advanced', provide more ambiguity (upper end of ZPD).
2.  **Scaffolding:** Temporary support provided to assist learners in mastering new concepts.
    *   *AI Check:* Use exercises with "Hints" as scaffolding. Use "Boilerplate Code" as scaffolding for projects. Ensure `detailedDescription` provides the necessary context to start.
3.  **More Knowledgeable Other (MKO):** Someone (or something) with a higher ability level than the learner.
    *   *AI Check:* The AI (via the Lesson Content/Project Spec) acts as the MKO. The `Demonstration` phase must clearly model expert thinking.
4.  **Social Interaction:** Learning occurs through social exchange.
    *   *AI Check:* In `projectRequirements` or `exercises`, encourage code reviews, pair programming simulations (e.g., "Review this code snippet as if you were a lead dev"), or explain concepts to a peer.

---

## 8. Multimedia & Accessibility Principles (New)

When generating slides, visual descriptions, or media assets, apply these principles:

### Mayer’s Multimedia Principles
1.  **Coherence Principle:** People learn better when extraneous words, pictures, and sounds are excluded rather than included.
    *   *AI Check:* Keep slides clean. Do not overload with text.
2.  **Signaling Principle:** People learn better when cues that highlight the organization of the essential material are added.
    *   *AI Check:* Use bold headings and clear hierarchical bullets.
3.  **Spatial Contiguity Principle:** People learn better when corresponding words and pictures are presented near each other rather than far from each other on the page or screen.
    *   *AI Check:* In `visualDescription`, specify that labels should be placed *on* or *near* diagrams.

### Universal Design for Learning (UDL)
1.  **Multiple Means of Representation:** Present information and content in different ways.
    *   *AI Check:* Provide text alternatives (`visualDescription`) for all images. Ensure slides rely on high contrast.
2.  **Clarity & Readability:**
    *   *AI Check:* Suggest layouts that use large fonts and clear contrast (e.g., in `layoutSuggestion`).

---

## 9. Synthesized Guidelines: 9 Key Aspects for AI Generation

When generating content, the AI must explicitly check against these 9 points:

1.  **Competence is Situated:** Generate content that is specific to an industry and role context.
2.  **Intentional Alignment:** explicitly map every Deliverable back to a Learning Outcome.
3.  **Learning Through Participation:** Prioritize "building," "fixing," and "creating" over "reading."
4.  **Capability over Competence:** Include tasks that require adapting to new requirements (Future-oriented).
5.  **Quality Feedback Loops:** Generate rubrics and checkpoints, not just pass/fail states.
6.  **Recognition of Prior Learning:** acknowledge that learners bring different backgrounds (e.g., via Difficulty settings).
7.  **Affordances Matter:** The generated `fileStructure` is a learning affordance. It must be robust.
8.  **Assessment as Evidence:** `evidenceOfLearning` must be tangible (artifacts, demos, reports).
9.  **Learner Agency:** Include reflective components in the deliverables.
