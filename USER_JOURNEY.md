
# Elice Creator AI: Content Creation User Journey

## Introduction

![](unknown.png)
[The Course Development Process — Latest documentation](https://docs.openedx.org/en/latest/educators/concepts/instructional_design/id_course_dev_process_overview.html)

The instructional design process is a systematic methodology for creating effective and engaging learning experiences. This process can be broken down into five distinct phases, from initial information gathering to post-launch support. The Elice Creator AI platform is designed to augment and accelerate each phase of this workflow, empowering instructional designers, educators, and subject matter experts to build high-quality content with greater efficiency and creativity.

Unlike standard generative tools, Elice Creator AI acts as an **Expert Instructional Architect**. It doesn't just write text; it structures learning experiences based on rigorous educational theory. The platform embeds frameworks such as **Constructive Alignment**, **Merrill's First Principles**, **6 PoLD**, **Bloom's Taxonomy**, and **Vygotsky's Social Constructivism** directly into the generation logic, ensuring every piece of content is not just informative, but pedagogically sound and effective.

This document outlines the user journey within Elice Creator AI, mapping the platform's features to the five-phase content creation workflow.

---

## The 5-Phase Content Creation Workflow with Elice Creator AI

### Phase 1: Information Collection

**Goal:** To collect foundational information about the project, define the target audience, establish the "why" behind the course, and draft initial learning outcomes and a syllabus.

**User Journey in Elice Creator AI:**

The user begins their journey in a state of exploration and definition. The AI platform provides two primary paths for this phase:

1. **Trend-Driven Discovery:** The user navigates to the **Trending** tab. Here, they can explore real-time data on popular technologies, frameworks, and concepts across various industries (e.g., Software Development, Data Science). This helps answer the question, "What content is relevant and in-demand right now?" The user can view detailed analyses, descriptions, and sources for each trend to gather robust information for their course concept.

2. **Idea-Driven Generation:** The user navigates to the **Generation** tab. They can input a simple idea or a detailed prompt describing their course concept. For more structured projects, they can upload an existing document (such as a project specification or a draft syllabus). The AI uses this input to understand the project's core requirements.

**Output:** By the end of this phase, the user has leveraged the AI to either validate their own idea or discover a new, relevant topic. They have a clear concept and are ready to move on to designing the course structure.

### Phase 2: Designing the Course

**Goal:** To transform the initial concept into a structured course outline and immediately generate the full content.

**User Journey in Elice Creator AI:**

Based on the input from Phase 1, the AI transitions from an information gatherer to a content architect and builder in a single, streamlined step.

1. **Automated Course Design (Constructive Alignment):** The AI synthesizes the user's prompt and applies **Constructive Alignment** to design the curriculum.
   *   *Concept:* This principle ensures a "Golden Thread" connects the course components. The AI ensures that the **Intended Learning Outcomes (ILOs)** (what the student should achieve) are logically matched by the **Teaching Activities** (how they learn it) and verified by the **Assessment Tasks** (how they prove it).
   *   This outline serves as the definitive blueprint for the content.

2. **Immediate Content Generation:** The platform uses this generated blueprint to begin the building phase, strictly adhering to instructional design models:
   *   **For Courses (Merrill's First Principles):** The AI creates detailed lesson plans structured around the 5 phases of effective instruction:
        *   **Problem-centered:** The lesson frames learning within the context of a real-world problem.
        *   **Activation:** Eliciting prior knowledge to build a foundation for new info.
        *   **Demonstration:** Explicitly modeling the skill (showing "how" before asking "do").
        *   **Application:** Engaging the learner in authentic practice tasks.
        *   **Integration:** Encouraging the transfer of skills to new, personal contexts.
       *   *Cognitive Scaling:* It scales the complexity of objectives and quizzes according to **Bloom's Revised Taxonomy** (e.g., moving from "Remember/Understand" for beginners to "Evaluate/Create" for advanced learners).
   *   **For Projects (Situated Learning & Vygotsky):** The AI generates a detailed project specification and scaffolds a complete, runnable coding environment.
       *   **ZPD & Scaffolding:** The AI calibrates the difficulty to the **Zone of Proximal Development (ZPD)**. It provides **Scaffolding** (boilerplate code, hints, templates) that supports the learner without solving the problem for them.
       *   **MKO (More Knowledgeable Other):** The AI acts as the expert guide in the project brief and instructions.
       *   **Social Interaction:** It frames tasks to encourage peer review and collaboration.

**Output:** This stage concludes when the AI has finished generating all the content. The user is presented with a fully-built course or a functional project codebase that is not just text, but a structured learning experience ready for review.


### Phase 3: Review and Refinement

**Goal:** To review, test, customize, and polish the AI-generated content to ensure quality, accuracy, and alignment with learning objectives.

**User Journey in Elice Creator AI:**

With the initial content generation complete, the user's role shifts from prompter to editor, director, and quality assurance tester. The platform provides a rich interactive environment for this crucial phase.

1. **Pedagogical Verification:** Before diving into the text, the user checks the **Pedagogy Info** panel. Here, they can verify the educational soundness of the generation against four advanced frameworks:
   *   **6 PoLD (Principles of Learning Design):** The user checks if the content meets these six criteria:
       *   *Authentic:* Does it mirror real-world tasks?
       *   *Alignment:* Do objectives match assessments?
       *   *Holistic:* Does it integrate technical skills with professional values?
       *   *Feedback:* Are there mechanisms for actionable feedback?
       *   *Judgement:* Does it teach the learner to evaluate quality?
       *   *Future-oriented:* Does it foster adaptability and learning-to-learn?
   *   **David Boud’s Features of Practice:** The user ensures the learning is not abstract schooling but true practice:
       *   *Situated & Embodied:* Is the learner addressed in a specific professional role?
       *   *Materially Mediated:* Are professional tools (IDE, Git, specific libs) treated as essential parts of the learning?
       *   *Relational:* Is the work framed within a team or client context?
   *   **Stephen Billett’s Workplace Learning:**
       *   *Affordances:* Does the environment invite participation?
       *   *Guided Participation:* Does the AI provide the right level of support?
   *   **Vygotsky’s Social Constructivism:**
       *   *ZPD:* Is the challenge level appropriate (not too easy, not impossible)?
       *   *Scaffolding:* Are hints and supports provided and faded correctly?
       *   *MKO:* Does the content effectively model expert thinking?
       *   *Social Interaction:* Are there cues for collaboration or peer critique?

2. **Holistic Review and Testing:** The user navigates the content within the `LessonPlanViewer` (for courses) or the `InteractiveEnvironmentView` (for projects).
   *   **For Courses:** They read content structured by Merrill's phases, review the logic of exercises, and verify the correctness of quiz answers.
   *   **For Projects:** They inspect the generated code, check for logical errors, and ensure the project structure is sound. This acts as an integrated "beta test" for the project's foundation.

3. **AI-Assisted Iteration and Polish:** If any part of the content needs adjustment, the user has powerful tools at their disposal:
   *   **Direct Editing:** The user can directly edit any text or code, giving them granular control over the final output.
   *   **Re-generation:** For more substantial changes, the user can use the **Re-generate** feature. This allows them to ask the AI to revise a specific section (e.g., "Make this demonstration more complex" or "Change the quiz to focus on analysis") while maintaining the pedagogical context.

4. **Content Augmentation:** The user can also ask the AI to generate **new** content, such as adding an extra exercise to a lesson or a new API endpoint to a project.

**Output:** At the end of this phase, the user has a polished, tested, and finalized course package that is pedagogically rigorous and ready for delivery.


### Phase 4: The Review Phase

**Goal:** To have the course team and beta testers review the course from start to finish, test all assessments and functionalities, check for accessibility, and ensure launch readiness.

**User Journey in Elice Creator AI:**

The Elice Creator AI interface serves as the primary review and quality assurance environment.

1. **Holistic Review:** The user can navigate through each lesson in the `LessonPlanViewer` to read content as a student would. They can review the logic of exercises and the correctness of quiz answers.

2. **Functional Testing:** In the `InteractiveEnvironmentView` for projects, the user can inspect the generated code, check for logical errors, and ensure the project structure is sound. This acts as an integrated "beta test" for the project's foundation.

3. **Final Polish:** The user makes final edits and uses the **Re-generate** functionality to address any issues found during the review. They can also add personal `Notes` to the content in the **Library** for future reference or collaboration.

**Output:** A polished, tested, and finalized course package, ready for delivery to learners.

### Phase 5: Support and Evaluation (Delivery)

**Goal:** To deliver the course to learners effectively and provide ongoing support.

**User Journey in Elice Creator AI:**

The platform facilitates a seamless transition from creation to delivery.

1. **Packaging and Export:** The user saves the completed content to their **Library** for versioning and future reuse. For projects, they can download the entire scaffolded environment as a `.zip` file.
   *   **Slide Generation:** The user can also generate and download a **PowerPoint (.pptx)** slide deck. These slides are automatically designed using **Mayer's Multimedia Principles** (reducing extraneous load, signaling key points) and **Universal Design for Learning (UDL)** guidelines to ensuring clarity and accessibility.

2. **LMS Integration:** The generated content is designed for portability. The user can take the exported markdown content or project files and upload them directly into any Learning Management System (LMS). For an integrated experience, the content can be deployed to the **Elice LXP**.

3. **Streamlined Learner Experience:** By connecting Creator AI with Elice LXP, the delivery becomes exceptionally smooth.
   *   **For Courses:** Lessons are delivered through the LXP's rich learning interface.
   *   **For Projects:** The exported project ZIP file provides a standardized starting point for all students. The Elice LXP can then provide a cloud-based programming environment, completely **eliminating the friction of setting up local developer environments** on student laptops. This ensures every learner starts on a level playing field and can focus immediately on the project's learning objectives.

**Output:** A high-quality learning experience delivered efficiently to students, with robust support for complex technical projects.

---

## Conclusion

The Elice Creator AI platform fundamentally reimagines the instructional design workflow. By integrating a sophisticated AI assistant trained on frameworks like **6 PoLD**, **Merrill's First Principles**, **Bloom's Taxonomy**, and **Vygotsky's Social Constructivism**, it transforms the content creation process. It moves beyond simple text generation to true *instructional architecture*, fostering a dynamic partnership between the creator and the AI.

This user journey demonstrates a seamless, end-to-end solution that not only accelerates development timelines but also ensures the pedagogical quality and relevance of the final educational product. From discovering in-demand topics and scaffolding entire projects in minutes to providing a frictionless delivery experience via the Elice LXP, the platform empowers educators to focus on what they do best: creating impactful learning experiences. Elice Creator AI represents a significant leap forward, making the creation of high-quality, engaging, and technically robust educational content more accessible and efficient than ever before.
