<img width="800" height="600" alt="607631656-ebfa2537-09f5-4dfa-b9d4-eb2384f3800e" src="https://github.com/user-attachments/assets/a989f9c0-1421-460f-b520-d06ff71a6c60" />
# Local Civic Engagement Hub

> **AI-powered constituency planning platform that transforms scattered citizen feedback into verified, evidence-based development priorities.**

![Status](https://img.shields.io/badge/Status-Hackathon-blue)
![Built With](https://img.shields.io/badge/Built%20With-Next.js-black)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

##  Overview

Local governments often receive hundreds of complaints regarding roads, water supply, drainage, streetlights, waste management, and other civic issues. Unfortunately these complaints are:

* Repetitive
* Unverified
* Difficult to prioritize
* Scattered across different channels

This leads to inefficient allocation of public funds and delayed infrastructure development.

**Local Civic Engagement Hub** uses AI to convert raw citizen submissions into a structured, transparent, and evidence-driven planning system for constituency planners.

---

# 🚨 Problem

Current civic feedback systems suffer from:

* Duplicate complaints flooding the system
* Lack of verification of local residents
* Popularity-driven prioritization instead of impact-driven decisions
* No transparency regarding project progress
* Poor citizen engagement due to outdated interfaces

---

# 💡 Solution

Our platform enables verified local citizens to report and verify civic issues while AI automatically organizes, deduplicates, and prioritizes them.

Instead of showing officials thousands of complaints...

It shows:

> **"Here are the five most critical infrastructure issues affecting your constituency and why they should be addressed first."**

---

# ✨ Features

## 📍 Geofenced Participation

Only verified residents within a constituency can:

* Submit issues
* Support issues
* Verify existing reports

Everyone else has read-only access.

---

## 🤖 AI Issue Deduplication

Multiple reports about the same issue are intelligently merged.

Example

Instead of

```
Road has potholes

Road broken

Bad road

Street damaged

Pothole here
```

AI creates

```
Road Damage
Ward 5
142 Supporting Reports
Confidence: 96%
```

---

## 📊 Smart Priority Engine

Issues are ranked using multiple signals instead of simple vote counts.

Factors include:

* Community support
* AI severity analysis
* Verification confidence
* Issue age
* Population impact (future scope)

This ensures critical issues receive attention before merely popular ones.

---

## 📝 AI Evidence Summary

Every issue includes an automatically generated summary.

Example:

> **"This issue has been verified by 43 local residents. It affects approximately two schools and has remained unresolved for 18 days. High priority is recommended."**

---

## 📈 Public Accountability Timeline

Every project progresses through a transparent lifecycle.

```
Proposed

↓

Community Verified

↓

Planner Review

↓

Approved

↓

In Progress

↓

Completed
```

Citizens always know the current status.

---

# ⚙️ System Workflow

```
Citizen

↓

Submit Issue
(Text + Image + Location)

↓

Gemini AI

↓

Duplicate Detection

↓

Category Classification

↓

Severity Analysis

↓

Priority Engine

↓

Planner Dashboard

↓

Project Status Updates

↓

Citizen Transparency Portal
```

---

# 🏗 Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS
* Framer Motion

---

### Backend

* Node.js
* Express.js

---

### Database

* PostgreSQL
* Supabase

---

### AI

* Google Gemini API

Used for:

* Semantic deduplication
* Issue categorization
* Severity estimation
* AI-generated summaries

---

### Deployment

* Vercel
* Render

---

# 🧠 AI Pipeline

```
Citizen Submission

↓

Language Detection

↓

Semantic Similarity Check

↓

Duplicate Detection

↓

Category Prediction

↓

Severity Classification

↓

Priority Scoring

↓

Evidence Summary Generation
```

---

# 📊 Database

```
Users

Issues

Votes

Issue Verifications

Project Timeline
```

---

# 🔐 Security

* JWT Authentication
* Geofenced access
* Verified citizen participation
* Duplicate vote prevention

---

# 🎯 Why This Matters

Rather than asking

> "Which issue has the most complaints?"

Our platform asks

> **"Which issue has the greatest verified impact on the community?"**

This enables planners to make fairer, evidence-based decisions.

---

# 🚀 Future Scope

* DigiLocker/Aadhaar verification
* WhatsApp complaint integration
* Voice-based multilingual reporting
* GIS heatmaps
* Smart budget allocation recommendations
* Department-wise workflow automation
* Mobile application
* Open Government API integration

---

# 📸 Screenshots

```
/screenshots

home.png

dashboard.png

issue-page.png

planner-dashboard.png
```

---

# 👥 Team

**Team Name:** *[Dead_Pixel]*

| Name          | Role               |
| ------------- | ------------------ |
| Om Rai       -  Frontend / UI & UX |
| Saksham Wadhankar -  Backend & Database |
| Animesh yadav - AI Integration     |

---

# 🌍 Vision

We believe civic participation should be **verified, transparent, and data-driven**.

Instead of overwhelming planners with thousands of disconnected complaints, **Local Civic Engagement Hub** converts community feedback into actionable intelligence—helping governments allocate resources where they create the greatest public impact.

---

## ⭐ Our Goal

> **Transform scattered citizen complaints into verified, AI-powered development priorities that enable smarter, faster, and more transparent constituency planning.**
