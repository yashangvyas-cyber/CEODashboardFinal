# Dashboard Widget Logic & Data Reference

This document serves as the master reference for developers building the final CollabCRM CEO Dashboard. It contains the exact business logic, data sources, formulas, and executive context for every widget on the dashboard.

---

## 🌍 Global Filter Rules (How the Top Bar affects Data)

1. **Business Unit Dropdown:** Affects **EVERYTHING** on the page. If a specific BU is selected (e.g., "Engineering"), the Hero Section and all Tabs must only fetch data for that BU.
2. **Date Range Filter (This Year, Last Year, etc.):** 
   - **Hero Section:** IGNORES this filter. The Hero Section is always a real-time current snapshot (e.g., Total Active Employees *today*, with a YoY trend).
   - **Module Tabs (Project Management, People, CRM):** RESPECTS this filter. Changing the date range must trigger a re-fetch of all widget data inside the tabs to reflect that specific period (e.g., "Top Effort Consumers" for "Last Quarter" vs "This Year"). 

---

## 1. Hero Section (Global Snapshot)
Always visible at the top of the dashboard. Aggregates data based on the selected Business Unit.

### 📊 Total Employees
*   **Data Source / System:** Core HR / Active Employees
*   **Formula & Logic:** 
    *   **Main Value:** `COUNT(Employee ID)` WHERE `Status = 'Active'`
    *   **Trend:** `Current Count` - `Count 12 Months Ago`
    *   **Trend %:** `(Trend / Old Count) * 100`
*   **Executive Context:** Gives the CEO an immediate pulse on company size and YoY growth.

### 💰 Revenue Pulse
*   **Data Source / System:** CRM / Finance (Invoices)
*   **Formula & Logic:** 
    *   **Value:** `SUM(Invoices Paid + Pending)` YTD
    *   **Target %:** `(YTD Revenue / Annual Target) * 100`
*   **Executive Context:** Tracks high-level financial progress against the yearly goal.

### 📥 Collection
*   **Data Source / System:** Finance
*   **Formula & Logic:** 
    *   **Value:** `(Total Invoices Paid / Total Invoices Sent) * 100`
    *   *(Segmented bar represents health tiers)*
*   **Executive Context:** Cash flow indicator; highlights if revenue is stuck in receivables.

### ⏳ Billable %
*   **Data Source / System:** PM Timesheets
*   **Formula & Logic:** 
    *   **Value:** `(Total Billable Hours Logged / Total Hours Logged) * 100`
*   **Executive Context:** Core profitability metric for a service business.

### 🚪 Open Roles
*   **Data Source / System:** ATS / Recruitment
*   **Formula & Logic:** 
    *   **Value:** `COUNT(Requisitions)` WHERE `Priority = 'Critical'` AND `Status = 'Open'`
*   **Executive Context:** Highlights severe talent gaps blocking delivery or sales.

---

## 2. Project Management Tab
Appears when the "Project Management" module is selected. Focuses on financial health, contract risk, and resource utilization across Fixed Cost, Hourly, and Hirebase.

### 🦅 Organization Resource Availability (Bird's Eye View)
*   **Data Source / System:** Resource Allocation Report (Occupancy & Availability views)
*   **Formula & Logic:** 
    *   **Availability Donut:** `(Total Unallocated Hours / Total Capacity Hours) * 100`.
    *   **By Status Donut:** Sums allocated hours grouped by project status (In Development, Paused, etc.).
    *   **By Type Donut:** Sums allocated hours grouped by assignment type (Dedicated, Fixed-Price, T&M).
    *   *Note: Detailed employee-level lists are removed from this widget to maintain a high-level executive view.*
*   **Executive Context:** Answers the critical question "Where is our technical talent right now?" Helps the CEO balance the bench vs active billable work.

### 📈 Project Delivery Health
*   **Data Source / System:** PM Reports (All 3 types)
*   **Formula & Logic:** 
    *   **Fixed Cost Portfolio Burn %:** `(Sum of Actual Spent / Sum of Total Purchased Hours) * 100` across all active projects. (Lower is better, indicates remaining aggregate budget).
    *   **Hourly Portfolio Billed %:** `(Sum of Total Billed / Sum of Actual Spent) * 100` across all active hourly projects. (Prevents small projects from skewing a simple average. Higher is better).
    *   **Hirebase Billable %:** `(Count of Billable = 'Yes' / Total active contracts) * 100`.
*   **Executive Context:** A single-glance traffic light system for the 3 core revenue streams. Red flags indicate systemic delivery issues (e.g., spending too much, not billing what was worked, or benching dedicated talent).

### ⏰ Upcoming Expirations
*   **Data Source / System:** Hirebase & Hourly Reports
*   **Formula & Logic:** 
    *   **Net Growth (Top):** Shows `# Newly Hired` vs `# Expired` Hirebase contracts this month.
    *   **Expirations List:** Lists Hirebase contracts where `End Date - Today <= 30` AND Hourly buckets where `Remaining Balance <= (Average Burn Rate * 7)` OR `Expiry Date - Today <= 30`. Sorted by least days remaining.
*   **Executive Context:** Proactive churn/revenue loss prevention. Tells Account Managers exactly who needs a renewal push this week.

### 🚨 Revenue Leakage Risk
*   **Data Source / System:** Fixed Cost & Hourly Reports
*   **Formula & Logic:** Lists projects where `Actual Spent > Target`.
    *   *Fixed Cost Target:* Total Purchased Hours.
    *   *Hourly Target:* Total Billed Hours.
    *   Sorted by highest leakage amount.
*   **Executive Context:** Identifies specific projects eating into profit margins or suffering from unbilled scope creep.

### 🔄 Organization Capacity
*   **Data Source / System:** Resource Allocation Report
*   **Formula & Logic:** 
    *   **Available %:** `(Available Bandwidth / Total Capacity) * 100`.
    *   **Missing Allocation List:** Lists employees with 100% availability and no daily allocation logs.
*   **Executive Context:** Shows the exact volume of "Bench Capacity" waiting to be sold, and flags employees slacking on daily planning.

### 🎯 Top Effort Consumers (Bottom Middle)
*   **Data Source / System:** Time Spent Report
*   **Metric:** Top 5 projects consuming the most tracked hours across the company.
*   **Executive Context:** "Where is our team spending the most time?" Shows where your team is working the most hours. Be careful if **Fixed Cost (Red)** projects are at the top—spending too much time on them kills your profit margin. Hourly projects (Yellow) at the top are good, assuming those hours are actually being billed.
*   **Formula & Logic:** Aggregates `Time Spent` by project over the selected date range. Top 5 highest sum projects.

### 📅 Timesheet Compliance
*   **Data Source / System:** Timesheet Reports
*   **Formula & Logic:** Aggregates `Unapproved` hours (for Hourly projects only) and `Missing` (00:00) timesheet logs by Department.
*   **Executive Context:** Highlights administrative bottlenecks that will delay client invoicing at the end of the month.

---

## 3. People Tab (Finalized Design)
Appears when the "People" module is selected. Focuses on retention, employee performance, skills, and availability.

### ⏳ Early Attrition
*   **Data Source / System:** HRIS (New Hires & Exits)
*   **Formula & Logic:** `(Exits within first 90 days / Total New Hires) * 100`.
*   **Visual Logic:** 
    *   **Side-by-Side Layout:** Gauge chart on left, Status Text on right.
    *   **Thresholds:** `>10%` displays "High Risk" with a `<90 Days Exit Trend` badge.
    *   **Context:** Explicit benchmark row (e.g., "Benchmark: 8%").
*   **Executive Context:** Measures the effectiveness of the onboarding process and quality of recent hires. High early attrition is classified as "Critical Attrition Zone" and requires immediate intervention in cultural integration.

### 📉 Exit Trend
*   **Data Source / System:** HRIS (Exits)
*   **Formula & Logic:** 
    *   **Bar Chart:** Total exits segmented by month, stacked by `Regrettable`, `Non-Regrettable`, and `Unspecified`.
    *   **KPIs:** `Total Exits %` vs headcount, and `Avg Monthly Exits %`.
*   **Executive Context:** Tracks if turnover is spiking and categorizes the severity of the loss. 

### 🥧 Exit by Type & Reason
*   **Data Source / System:** HRIS (Exit Interviews)
*   **Formula & Logic:** 
    *   **Tabbed Donut Chart:** Categorizes specific exit reasons (e.g., Better Opportunity, Layoff, Poor Performance) nested under parent categories (`Resignation` vs `Termination`).
*   **Executive Context:** Tells the CEO *why* talent is leaving or being let go, separated logically by the nature of the departure.

### 🏖️ Leave & Dept Overview
*   **Data Source / System:** Leave Management System
*   **Formula & Logic:** 
    *   **Company Availability:** `((Total Headcount - On Leave) / Total Headcount) * 100`.
    *   **Dept Overview:** Departments with high volumes of staff on active/upcoming leaves mapped on progress bars.
*   **Executive Context:** Operational readiness. Flags if a specific department (like Engineering) is hollowed out by vacations, creating delivery risks.

### 👁️ Manager Watchlist
*   **Data Source / System:** HRIS (Reporting Lines & Exits)
*   **Formula & Logic:** Lists managers with the highest calculated `Flight Risk Score` based on declining team performance and skipped 1-on-1s.
*   **Executive Context:** Identifies toxic managers or teams with systemic issues causing high turnover.

### 🎛️ Skills Gap
*   **Data Source / System:** Performance & Training Analytics
*   **Formula & Logic:** Aggregates employee counts across three proficiency levels per skill.
    *   **Beginner (Red):** New to skill, requires supervision.
    *   **Intermediate (Yellow):** Capable of independent work.
    *   **Experienced (Green):** Subject matter expert, can lead/coach.
*   **UX Strategy (Scalability):**
    *   **Top 5 Priority:** Default view shows the 5 skills with the lowest percentage of "Experienced" staff (Yield).
    *   **Search & Filter:** Integrated search bar allows filtering by Skill Name or Domain (Engineering, AI, etc.).
    *   **View All:** Expands to a scrollable list to handle hundreds of skills without dashboard bloat.
*   **Executive Context:** Identifies systemic talent deficits. A low "Experienced Yield" in critical domains like Cloud Arch or AI indicates a high-risk delivery bottleneck for future enterprise contracts.

### 🏆 Top Employees
*   **Data Source / System:** Reward / Performance System
*   **Formula & Logic:** Ranks the top 5 highest performing employees based on accrued 'Trophy' scores.
*   **Executive Context:** Visibility into top talent to ensure high performers are recognized and retained.

---

*Note: CRM & Invoice and Recruitment tabs will be added to this document once their respective live reports are analyzed.*
