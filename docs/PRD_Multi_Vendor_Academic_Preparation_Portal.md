# Product Requirements Document (PRD)

## Multi-Vendor Academic Preparation Portal

| Field | Value |
|--------|--------|
| **Source** | Client requirement document (printed concept, journey, sitemap, IA, and feature pages) |
| **Scope** | Requirements as stated in client materials only |

---

## 1. Product vision

The platform is a **centralized digital portal** for students exploring career paths including **Medicine, Engineering, Law, Management, and International Studies**.

Students use the portal to discover:

- **Competitive exams** required for those careers  
- **Study materials** and preparation courses  
- **Coaching institutes and vendors** offering those resources  

The product is positioned as a **discovery, comparison, and enrollment marketplace** connecting students with education vendors.

**Illustrative examples cited by the client**

- **Vendors:** Coaching institutes such as ALLEN Career Institute, Aakash Institute, and international test prep providers.  
- **Exams:** NEET, CLAT, LSAT, and SAT.

---

## 2. Core objectives

### 2.1 For students

- Discover career streams.  
- Understand required entrance exams.  
- Compare study material and coaching providers.  
- Select preferred vendors.  
- Access courses, notes, mock tests, and tutoring.

### 2.2 For vendors

- Showcase courses and study materials.  
- Acquire student enrollments.  
- Provide online or offline coaching.

---

## 3. Student user journey

### Step 1: Student registration / account creation

The student creates an account and enters:

- Grade / class  
- Target career  
- Country preference (India / Abroad)  
- Preferred study mode (online / offline)

### Step 2: Select career stream

Example streams listed in the client materials:

- Medicine  
- Engineering  
- Law  
- Business & Management  
- Liberal Arts  
- International Undergraduate Programs  

*(Related client sitemap copy also references Business and International Study as stream labels; treat stream taxonomy as client-defined content to align in UX copy.)*

### Step 3: View required exams

Once a stream is selected, relevant exams are shown. **Example mappings provided:**

| Stream | Exams |
|--------|--------|
| Medicine | NEET |
| Engineering | JEE Main, JEE Advanced |
| Law | CLAT, LSAT |
| International programs | SAT, ACT |

### Step 4: Select preparation resources

**Context:** The student chooses the type of support they need.

**Options:**

- Coaching classes  
- Study material  
- Mock tests  
- Recorded courses  
- Personal tutoring  

### Step 5: Vendor marketplace

A **list of vendors** appears, including (per client doc):

- Merrakii (described as the platform’s own offering)  
- ALLEN  
- Aakash  
- Independent tutors  
- EdTech companies  

**Filters:**

- Price  
- Online / offline  
- Ratings  
- Success rate  
- Location  

### Step 6: Compare and enroll

Student actions:

- Compare vendors  
- Add courses to cart  
- Enroll  
- Access learning dashboard  

---

## 4. Key platform modules (site sitemap summary)

| Module | Purpose |
|--------|---------|
| **Career exploration** | Helps students explore career paths (header implied as “Career Explorer” in client sitemap note). |
| **Exam navigator** | Shows required exams for each career. |
| **Vendor marketplace** | Aggregates coaching institutes and study material providers. |
| **Course comparison tool** | Compare price, reviews, and outcomes. |
| **Student dashboard** | Access purchased courses and learning progress. |
| **Vendor portal** | Allows institutes to upload courses and manage students. |

**Additional named capability in client materials**

- **Career discovery engine** (listed under “Key Platform Features”; detail beyond the name was not visible in the provided pages).

---

## 5. Simplified information architecture (client tree)

```
Home
├── Career Streams
│   ├── Medicine → NEET
│   ├── Engineering → JEE
│   ├── Law → CLAT, LSAT
│   └── International Studies → SAT
├── Exams
│   ├── NEET
│   ├── CLAT
│   ├── LSAT
│   └── SAT
├── Study Resources
│   ├── Coaching Classes
│   ├── Study Material
│   ├── Mock Tests
│   └── Tutoring
├── Vendors
│   ├── Merrakii
│   ├── ALLEN
│   └── Aakash
├── Compare Courses
├── Blog / Guidance
├── Student Dashboard
└── Vendor Dashboard
```

---

## 6. Functional requirements by area

### 6.1 Suggested website sitemap — Homepage

- **Search bar** with prompt: *“What do you want to prepare for?”*  
- **Career streams** section  
- **Popular exams** section  
- **Top vendors** section  
- **Featured courses** section  

### 6.2 Career streams (section pages)

**Streams referenced in suggested sitemap:** Medicine, Engineering, Law, Business, International Study.

**Each stream page includes:**

- Career overview  
- Required exams  
- Recommended preparation  

### 6.3 Exams (detail pages)

**Example exams:** NEET, CLAT, LSAT, SAT (with expansions noted where provided: e.g., NEET — National Eligibility cum Entrance Test).

**Each exam page includes:**

- Exam overview  
- Eligibility  
- Syllabus  
- Preparation resources  
- Vendor offerings (courses/products from vendors for that exam)  

### 6.4 Study resources

**Description:** Filterable marketplace.

**Categories:**

- Coaching programs  
- Study material  
- Mock tests  
- Online courses  
- Tutoring  

### 6.5 Vendors

**Description:** Vendor listing pages.

**Each vendor profile includes:**

- Overview  
- Courses offered  
- Student ratings  
- Success statistics  
- Pricing  

### 6.6 Compare courses

**Description:** Side-by-side comparison tool.

### 6.7 Student dashboard (post-login)

- My courses  
- My exams  
- My vendors  
- Progress tracking  
- Mock test results  

### 6.8 Vendor dashboard

For coaching institutes:

- Upload courses  
- Manage enrollments  
- Student analytics  
- Payments  

### 6.9 Blog / guidance

Articles on:

- Exam preparation strategies  
- Career guidance  
- Study plans  

---

## 7. Client annotations on printed materials (capture as open notes)

The following appeared as **handwritten notes** on the client’s printed document. They are **not expanded into full specs** in the source pages; track them as clarification items with the client.

| Note | Interpretation / follow-up |
|------|----------------------------|
| **DAU** (near “Core Objectives”) | Likely interest in **Daily Active Users** as a success metric; definition and targets not specified in the typed requirements. |
| **U → (A) → R** (near “For Vendors,” with “A” circled) | Suggests a **multi-step vendor lifecycle** (e.g., user → approval/admin → registered/active); exact meaning not defined in typed text. |
| **“AWS vendor”** (near student journey) | Possible **infrastructure or vendor-integration preference**; no technical detail in the typed requirements. |

---

## 8. Explicit out-of-scope in source materials

The provided requirement screenshots do **not** specify:

- Non-functional requirements (performance, security, accessibility, SLAs)  
- Data model, APIs, or third-party integrations (except the AWS annotation above)  
- Payment provider, refund policy, or legal/compliance flows  
- Admin tooling beyond what is implied by vendor/student dashboards  
- Content authoring workflow, moderation, or SEO rules  
- Mobile vs. web vs. native delivery  

These should be addressed in a subsequent requirements pass or discovery.

---

## 9. Traceability

This PRD is derived **only** from the client’s attached requirement pages covering: refined concept, student journey (steps 1–6), site sitemap, simplified IA, suggested website sitemap (homepage, streams, exams), and numbered feature sections (study resources through blog/guidance), plus visible handwritten annotations.
