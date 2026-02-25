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

### Total Employees
*   **Data Source / System:** Core HR / Active Employees
*   **Formula & Logic:** 
    *   **Main Value:** `COUNT(Employee ID)` WHERE `Status = 'Active'`
    *   **Trend:** `Current Count` - `Count 12 Months Ago`
    *   **Trend %:** `(Trend / Old Count) * 100`
*   **Purpose:** Gives the CEO an immediate pulse on company size and YoY growth.

### Revenue Pulse
*   **Data Source / System:** CRM / Finance (Invoices)
*   **Formula & Logic:** 
    *   **Value:** `SUM(Invoices Paid + Pending)` YTD
    *   **Target %:** `(YTD Revenue / Annual Target) * 100`
*   **Purpose:** Tracks high-level financial progress against the yearly goal.

### Collection
*   **Data Source / System:** Finance
*   **Formula & Logic:** 
    *   **Value:** `(Total Invoices Paid / Total Invoices Sent) * 100`
    *   *(Segmented bar represents health tiers)*
*   **Purpose:** Cash flow indicator; highlights if revenue is stuck in receivables.

### Billable %
*   **Data Source / System:** PM Timesheets
*   **Formula & Logic:** 
    *   **Value:** `(Total Billable Hours Logged / Total Hours Logged) * 100`
*   **Purpose:** Core profitability metric for a service business.

### Open Roles
*   **Data Source / System:** ATS / Recruitment
*   **Formula & Logic:** 
    *   **Value:** `COUNT(Requisitions)` WHERE `Priority = 'Critical'` AND `Status = 'Open'`
*   **Purpose:** Highlights severe talent gaps blocking delivery or sales.

### 30-Day Cash Forecast
*   **Data Source / System:** Finance / Invoice Due Dates
*   **Formula & Logic:**
    *   **Value:** `SUM(Invoice Amount)` WHERE `Due Date - Today <= 30` AND `Status = 'Unpaid'`
    *   **Trend %:** `(Projected Collections This Month - Projected Last Month) / Projected Last Month * 100`
*   **Export Fields:** `Invoice_ID`, `Client_Name`, `Invoice_Amount`, `Due_Date`, `Days_Remaining`, `Status`
*   **Purpose:** Projected liquidity for the next 30 days. Helps the CEO anticipate cash shortfalls before they occur, rather than reacting after month-end.

---

## 2. Project Management Tab
Appears when the "Project Management" module is selected. Focuses on financial health, contract risk, and resource utilization across Fixed Cost, Hourly, and Hirebase.

### PM Summary Cards
*   **Data Source / System:** PM Reports & Project Tracking
*   **Metrics Displayed:**
    *   **Active Projects**: Count of projects starting or ongoing in the selected period.
    *   **On-Time Delivery**: % of project milestones successfully completed by their target date in this window.
    *   **Budget Variance**: Aggregate difference between planned budget and actual costs incurred in this period.
    *   **Resource Utilization**: % of available staff hours that were logged as billable in the selected period.
*   **Purpose:** Provides the CEO with an immediate gauge of operational velocity, delivery reliability, and financial leakage across the entire delivery portfolio.

### Organization Resource Availability
*   **Data Source / System:** Resource Allocation Report (Occupancy & Availability views)
*   **Formula & Logic:** 
    *   **Availability Donut:** `(Total Unallocated Hours / Total Capacity Hours) * 100`.
    *   **By Status Donut:** Sums allocated hours grouped by project status (In Development, Paused, etc.).
    *   **By Type Donut:** Sums allocated hours grouped by assignment type (Dedicated, Fixed-Price, T&M).
    *   *Note: Detailed employee-level lists are removed from this widget to maintain a high-level executive view.*
*   **Purpose:** Answers the critical question "Where is our technical talent right now?" Helps the CEO balance the bench vs active billable work.

### Project Delivery Health
*   **Data Source / System:** PM Reports (All 3 types)
*   **Formula & Logic:** 
    *   **Fixed Cost Portfolio Burn %:** `(Sum of Actual Spent / Sum of Total Purchased Hours) * 100` across all active projects. (Lower is better, indicates remaining aggregate budget).
    *   **Hourly Portfolio Billed %:** `(Sum of Total Billed / Sum of Actual Spent) * 100` across all active hourly projects. (Prevents small projects from skewing a simple average. Higher is better).
    *   **Hirebase Billable %:** `(Count of Billable = 'Yes' / Total active contracts) * 100`.
*   **Warning Thresholds & Color Logic (Traffic Light System):**
    *   **Fixed Cost (Red / Green):** Hard capital risk. If burn > 80%, the gauge turns **Red** (Warning) because profit margins are actively bleeding. Otherwise, it is **Green** (Healthy).
        * *Example:* If your team has logged 850 hours against a 1000-hour fixed budget (85%), it turns Red. The budget is nearly exhausted before delivery.
    *   **Hourly (Orange / Green):** Efficiency risk. If billed hours < 80% of worked hours, the gauge turns **Orange** (Warning) indicating revenue leakage (unbilled time). Otherwise, it is **Green**.
        * *Example:* If developers logged 100 hours but PMs only invoiced the client for 39 hours (39%), it turns Orange. You paid for 100 hours of labor but barely billed any of it.
    *   **Hirebase (Orange / Green):** Utilization risk. If active/billable contracts < 85%, the gauge turns **Orange** (Warning) because dedicated resources are sitting idle on the bench. Otherwise, it is **Green**.
        * *Example:* If you have 25 Hirebase staff, but only 20 are currently assigned to active paying clients (80%), it turns Orange. 5 staff are eating payroll without generating monthly revenue.
*   **Purpose:** A single-glance traffic light system for the 3 core revenue streams. Red flags indicate a direct loss of capital (burning fixed budgets), while Orange flags indicate lost potential revenue (unbilled hours or benched talent).

### Upcoming Expirations
*   **Data Source / System:** Hirebase & Hourly Reports
*   **Formula & Logic:** 
    *   **Net Growth (Top):** Shows `# Newly Hired` vs `# Expired` Hirebase contracts this month.
    *   **Expirations List:** Lists Hirebase contracts where `End Date - Today <= 30` AND Hourly buckets where `Remaining Balance <= (Average Burn Rate * 7)` OR `Expiry Date - Today <= 30`. Sorted by least days remaining.
*   **Purpose:** Proactive churn/revenue loss prevention. Tells Account Managers exactly who needs a renewal push this week.

### Revenue Leakage Risk
*   **Data Source / System:** Fixed Cost & Hourly Reports
*   **Formula & Logic:** Lists projects where `Actual Spent > Target`.
    *   *Fixed Cost Target:* Total Purchased Hours.
    *   *Hourly Target:* Total Billed Hours.
    *   Sorted by highest leakage amount.
*   **Purpose:** Identifies specific projects eating into profit margins or suffering from unbilled scope creep.

### Organization Capacity
*   **Data Source / System:** Resource Allocation Report
*   **Formula & Logic:** 
    *   **Available %:** `(Available Bandwidth / Total Capacity) * 100`.
    *   **Missing Allocation List:** Lists employees with 100% availability and no daily allocation logs.
*   **Purpose:** Shows the exact volume of "Bench Capacity" waiting to be sold, and flags employees slacking on daily planning.

### Top Effort Consumers
*   **Data Source / System:** Time Spent Report
*   **Metric:** Top 5 projects consuming the most tracked hours across the company.
*   **Purpose:** "Where is our team spending the most time?" Shows where your team is working the most hours. Be careful if **Fixed Cost (Red)** projects are at the top—spending too much time on them kills your profit margin. Hourly projects (Yellow) at the top are good, assuming those hours are actually being billed.
*   **Formula & Logic:** Aggregates `Time Spent` by project over the selected date range. Top 5 highest sum projects.

### Timesheet Compliance
*   **Data Source / System:** Timesheet Reports
*   **Formula & Logic:** Aggregates `Unapproved` hours (for Hourly projects only) and `Missing` (00:00) timesheet logs by Department.
*   **Purpose:** Highlights administrative bottlenecks that will delay client invoicing at the end of the month.

---

## 3. People Tab (Finalized Design)
Appears when the "People" module is selected. Focuses on retention, employee performance, skills, and availability.

### People Summary Cards
*   **Data Source / System:** HRIS (Add Employee Form, Reporting Lines, Exits)
*   **Metrics Displayed:**
    *   **Total Headcount**: Snapshot of active staff at the end of the selected period.
    *   **Net Change**: Difference between new hires and exits (Highlights real organizational growth).
    *   **Attrition Rate**: % of personnel loss relative to headcount in the period.
    *   **Shadow-to-Expert Ratio**: `Count(Exp < 1yr) / Count(Exp > 5yrs)` (Derived from 'Previous Experience' + 'Experience @ Yopmails'). Target is 1:3.
    *   **Span of Control**: `Total Headcount / Unique Managers` (Derived from the 'Reporting To' field). Target is 1:7.
*   **Purpose:** Moves beyond basic HR metrics to show the CEO the true "Business Readiness" of the organization—measuring growth, talent pipeline health, and management overhead efficiency.

### Early Attrition
*   **Data Source / System:** HRIS (New Hires & Exits)
*   **Formula & Logic:** `(Exits within first 90 days / Total New Hires) * 100`.
*   **Visual Logic:** 
    *   **Side-by-Side Layout:** Gauge chart on left, Status Text on right.
    *   **Thresholds:** `>10%` displays "High Risk" with a `<90 Days Exit Trend` badge.
    *   **Context:** Explicit benchmark row (e.g., "Benchmark: 8%").
*   **Purpose:** Measures the effectiveness of the onboarding process and quality of recent hires. High early attrition is classified as "Critical Attrition Zone" and requires immediate intervention in cultural integration.

### Exit Trend
*   **Data Source / System:** HRIS (Exits)
*   **Formula & Logic:** 
    *   **Bar Chart:** Total exits segmented by month, stacked by `Regrettable`, `Non-Regrettable`, and `Unspecified`.
    *   **KPIs:** `Total Exits %` vs headcount, and `Avg Monthly Exits %`.
*   **Purpose:** Tracks if turnover is spiking and categorizes the severity of the loss. 

### Exit by Type & Reason
*   **Data Source / System:** HRIS (Exit Interviews)
*   **Formula & Logic:** 
    *   **Tabbed Donut Chart:** Categorizes specific exit reasons (e.g., Better Opportunity, Layoff, Poor Performance) nested under parent categories (`Resignation` vs `Termination`).
*   **Purpose:** Tells the CEO *why* talent is leaving or being let go, separated logically by the nature of the departure.

### Leave & Dept Overview
*   **Data Source / System:** Leave Management System
*   **Formula & Logic:** 
    *   **Company Availability:** `((Total Headcount - On Leave) / Total Headcount) * 100`.
    *   **Dept Overview:** Departments with high volumes of staff on active/upcoming leaves mapped on progress bars.
*   **Purpose:** Operational readiness. Flags if a specific department (like Engineering) is hollowed out by vacations, creating delivery risks.

### Manager Watchlist
*   **Data Source / System:** HRIS (Reporting Lines & Exits)
*   **Formula & Logic:** Lists managers with the highest calculated `Flight Risk Score` based on declining team performance and skipped 1-on-1s.
*   **Purpose:** Identifies toxic managers or teams with systemic issues causing high turnover.

### Skills Gap
*   **Data Source / System:** Performance & Training Analytics
*   **Formula & Logic:** Aggregates employee counts across three proficiency levels per skill.
    *   **Beginner (Red):** New to skill, requires supervision.
    *   **Intermediate (Yellow):** Capable of independent work.
    *   **Experienced (Green):** Subject matter expert, can lead/coach.
*   **UX Strategy (Scalability):**
    *   **Top 5 Priority:** Default view shows the 5 skills with the lowest percentage of "Experienced" staff (Yield).
    *   **Search & Filter:** Integrated search bar allows filtering by Skill Name or Domain (Engineering, AI, etc.).
    *   **View All:** Expands to a scrollable list to handle hundreds of skills without dashboard bloat.
*   **Purpose:** Identifies systemic talent deficits. A low "Experienced Yield" in critical domains like Cloud Arch or AI indicates a high-risk delivery bottleneck for future enterprise contracts.

### Top Employees
*   **Data Source / System:** Reward / Performance System
*   **Formula & Logic:** Ranks the top 5 highest performing employees based on accrued 'Trophy' scores.
*   **Purpose:** Visibility into top talent to ensure high performers are recognized and retained.

---

## 4. CRM & Invoice Tab
Appears when the "CRM & Invoice" module is selected. Focuses on revenue performance, collection health, pipeline management, and deal analysis.

### CRM Summary Cards
*   **Data Source / System:** CRM (Deals) + Finance (Invoices)
*   **Metrics Displayed:**
    | Metric | Formula | Export Fields |
    |---|---|---|
    | **Total Won** | `SUM(Deal Value)` WHERE `Stage = 'Closed Won'` | `Deal ID`, `Client`, `Value`, `Close Date`, `Owner` |
    | **Invoiced** | `SUM(Invoice Amount)` WHERE `Linked Deal = Won` | `Invoice ID`, `Deal ID`, `Amount`, `Issue Date` |
    | **Collected** | `SUM(Payment Amount)` WHERE `Status = 'Paid'` | `Payment ID`, `Invoice ID`, `Amount`, `Pay Date` |
    | **Outstanding** | `Invoiced - Collected` | Derived from above |
*   **Purpose:** The top-line financial snapshot of the revenue cycle from lead to cash in hand.

### Revenue vs Target
*   **Data Source / System:** Finance / CRM Revenue Target Settings
*   **Formula & Logic:**
    *   **Value:** `SUM(Revenue YTD)` — total invoiced or collected depending on config
    *   **Achievement %:** `(YTD Revenue / Annual Target) * 100`
    *   **Growth Forecast:** `((This Year Revenue Rate - Last Year Revenue) / Last Year Revenue) * 100`
*   **Export Fields:** `Period`, `Revenue_YTD`, `Annual_Target`, `Achievement_Pct`, `Growth_Forecast_Pct`
*   **Purpose:** Single most important financial chart. Tells the CEO if the company is on track for its annual revenue goal.

### Revenue Trend
*   **Data Source / System:** CRM (Won) + Finance (Invoiced, Collected)
*   **Formula & Logic:** Monthly aggregations with 3 lines:
    *   `Won`: `SUM(Deal Value)` grouped by `Close Date Month`
    *   `Invoiced`: `SUM(Invoice Amount)` grouped by `Issue Date Month`
    *   `Collected`: `SUM(Payment Amount)` grouped by `Pay Date Month`
*   **Export Fields:** `Month`, `Won_Amount`, `Invoiced_Amount`, `Collected_Amount`
*   **Purpose:** Shows the revenue pipeline lag — the gap between winning deals, invoicing, and actually receiving cash. A growing gap signals collection problems.

### Collection Efficiency
*   **Data Source / System:** Finance (Invoices + Payments)
*   **Formula & Logic:**
    *   **Score:** `(Total Collected / Total Invoiced) * 100`
    *   **Trend:** Month-on-month change in the efficiency score
    *   **Sparkline:** Last 6 months of monthly efficiency scores
*   **Export Fields:** `Month`, `Invoiced_Amount`, `Collected_Amount`, `Efficiency_Pct`
*   **Purpose:** Measures how well the business converts issued invoices into actual cash. Below 85% signals systemic collection issues.

### Receivables Aging
*   **Data Source / System:** Finance (Outstanding Invoices)
*   **Formula & Logic:** Groups unpaid invoices by age bucket:
    *   **1–15 Days:** `SUM(Amount)` WHERE `Overdue Days BETWEEN 1 AND 15`
    *   **16–30 Days:** `SUM(Amount)` WHERE `Overdue Days BETWEEN 16 AND 30`
    *   **31–45 Days:** `SUM(Amount)` WHERE `Overdue Days BETWEEN 31 AND 45`
    *   **45+ Days:** `SUM(Amount)` WHERE `Overdue Days > 45` *(Red — high risk)*
    *   **Unbilled:** `SUM(Deal Value)` WHERE `Stage = 'Won'` AND `Invoice Status = 'Not Raised'`
*   **Export Fields:** `Invoice ID`, `Client`, `Amount`, `Invoice Date`, `Overdue Days`, `Age Bucket`
*   **Purpose:** Classic AR aging report. The 45+ bucket in red directly highlights bad debt risk and cash flow threats.

### Revenue Source Mix
*   **Data Source / System:** CRM (Deals tagged by Client Type)
*   **Formula & Logic:**
    *   **New Client Revenue:** `SUM(Invoice Amount)` WHERE `Client Type = 'New'` / `Total Invoiced * 100`
    *   **Existing Client Revenue:** `SUM(Invoice Amount)` WHERE `Client Type = 'Existing'` / `Total Invoiced * 100`
*   **Export Fields:** `Period`, `New_Client_Revenue`, `New_Client_Pct`, `Existing_Client_Revenue`, `Existing_Client_Pct`
*   **Purpose:** A healthy business grows via existing clients (upsell/renewal) AND acquires new logos. Over-dependence on new clients indicates lack of retention; over-dependence on existing clients signals stagnant growth.

### Lost Deal Analysis
*   **Data Source / System:** CRM (Lost Deals + Exit Reason Tags)
*   **Formula & Logic:** Groups lost deals by `Loss Reason` tag:
    *   `Competitor`, `Budget`, `Timing/Delayed`, `Other`
    *   Shows `COUNT` and `%` of total losses per reason
*   **Export Fields:** `Deal ID`, `Client`, `Deal Value`, `Stage_Lost_At`, `Loss_Reason`, `Closed Date`, `Owner`
*   **Purpose:** Tells the sales team and CEO *why* deals are being lost — enabling targeted corrective action (e.g., if "Competitor" is dominant, investigate product/pricing gaps).

### Top Revenue Contributors
*   **Data Source / System:** Finance (Invoices) + CRM (Clients)
*   **Formula & Logic:** Top 5 clients ranked by `SUM(Invoice Amount)` for the selected period.
    *   Each client shows: invoiced amount, collection progress bar (%), and payment status badge (`GOOD`, `PARTIAL`, `LATE`, `COMPLETED`)
*   **Export Fields:** `Client_Name`, `Invoiced_Amount`, `Collected_Amount`, `Collection_Pct`, `Payment_Status`
*   **Purpose:** Identifies top revenue accounts. High-value clients with `LATE` status are priority escalation cases.

### Sales Performance
*   **Data Source / System:** CRM (Won Deals)
*   **Formula & Logic:**
    *   **Avg Deal Size:** `SUM(Won Deal Value) / COUNT(Won Deals)`
    *   **Trend:** `(Current Period Avg - Previous Period Avg) / Previous Period Avg * 100`
    *   **Sales Cycle:** `AVG(Close Date - Lead Created Date)` in days, compared against target SLA
*   **Export Fields:** `Period`, `Avg_Deal_Size`, `Deal_Count`, `Avg_Sales_Cycle_Days`, `Sales_Cycle_Target_Days`
*   **Purpose:** Increasing deal size indicates upselling success; a shortening sales cycle means the team is qualifying leads faster. Sales Cycle exceeding target is an efficiency red flag.

### Avg Days to Pay
*   **Data Source / System:** Finance (Invoices + Payments)
*   **Formula & Logic:** `AVG(Payment Date - Invoice Issue Date)` in days, for all Paid invoices in the period.
*   **Export Fields:** `Client`, `Invoice ID`, `Issue Date`, `Payment Date`, `Days_to_Pay`
*   **Purpose:** Tracks client payment discipline. Rising averages indicate clients are stretching payment terms, which pressures cash flow.

### CRM Pipeline Summaries / Funnel Switcher
*   **Data Source / System:** CRM (Active Deals by Stage)
*   **Formula & Logic:**
    *   Groups all active deals by `Stage` (e.g., Lead, Qualified, Proposal, Negotiation, Closed)
    *   **Value:** `SUM(Deal Value)` per stage
    *   **Count:** `COUNT(Deals)` per stage
    *   **Win Probability:** Weighted by stage-level close probability settings
*   **Export Fields:** `Deal_ID`, `Client`, `Stage`, `Deal_Value`, `Probability_Pct`, `Expected_Value`, `Owner`, `Close_Date`
*   **Purpose:** The full sales pipeline view. Allows the CEO to see how much revenue is in each stage and forecast next period's closings.

---

## 5. Recruitment Tab
Appears when the "Recruitment" module is selected. Focuses on hiring funnel efficiency, sourcing effectiveness, and pipeline health.

### Recruitment Summary Cards
*   **Data Source / System:** ATS (Applicant Tracking System)
*   **Metrics Displayed:**
    | Metric | Formula | Export Fields |
    |---|---|---|
    | **Total Candidates** | `COUNT(Applicant ID)` in current pipeline | `Applicant_ID`, `Name`, `Role`, `Stage`, `Source` |
    | **Total Hires** | `COUNT(Applicants)` WHERE `Stage = 'Joined'` | `Applicant_ID`, `Name`, `Role`, `Join_Date`, `Department` |
    | **Open Roles** | `COUNT(Job Requisitions)` WHERE `Status = 'Open'` | `Req_ID`, `Role`, `Department`, `Priority`, `Posted_Date` |
    | **Time-to-Hire** | `AVG(Offer Accept Date - Req Open Date)` in days | `Req_ID`, `Role`, `Open_Date`, `Offer_Date`, `Days_Taken` |
    | **Accept Rate** | `(Offers Accepted / Total Offers Extended) * 100` | `Applicant_ID`, `Offer_Date`, `Status` (Accepted/Declined) |
    | **Hire Ratio** | `(Total Hires / Total Candidates Screened) * 100` | Derived from Candidates + Hires counts |
*   **Purpose:** The headline metrics provide a quick assessment of recruiting velocity and efficiency.

### Stage Conversion Rate
*   **Data Source / System:** ATS (Applicant Stage History)
*   **Formula & Logic:**
    *   **Funnel Stages:** Sourced → Screened → Assessment → Interview → Offered → Joined
    *   **Overall %:** `(Stage Count / Top Stage Count) * 100`
    *   **Stagewise %:** `(Stage Count / Previous Stage Count) * 100`
*   **Export Fields:** `Stage_Name`, `Candidate_Count`, `Overall_Conversion_Pct`, `Stagewise_Conversion_Pct`
*   **Purpose:** Identifies exactly where in the hiring funnel candidates are being lost. A low Interview-to-Offer rate signals assessment issues; a low Offer-to-Join rate indicates a compensation or competitor problem.

### Job Status Breakdown
*   **Data Source / System:** ATS (Job Requisitions)
*   **Formula & Logic:**
    *   Groups requisitions by status: `Open`, `On Hold`, `Closed`, `Filled`
    *   Shows `COUNT` and donut chart visualization
*   **Export Fields:** `Req_ID`, `Role_Title`, `Department`, `Status`, `Posted_Date`, `Closed_Date`
*   **Purpose:** Gives the CEO a full picture of open vs. paused vs. filled positions. A high "On Hold" count may indicate budget freezes or organizational indecision.

### Offer Acceptance Breakdown
*   **Data Source / System:** ATS (Offer History)
*   **Formula & Logic:**
    *   Groups offers by status: `Accepted`, `Declined`, `Pending`
    *   Shows `COUNT` and donut chart visualization
*   **Export Fields:** `Applicant_ID`, `Role`, `Offer_Date`, `Offer_Amount`, `Offer_Status`, `Decline_Reason`
*   **Purpose:** Tracks offer conversion quality. A high Declined % signals offers are not competitive on salary, role scope, or company perception vs. competitors.

### Overall Hire Ratio Card
*   **Data Source / System:** ATS
*   **Formula & Logic:** `(Total Hires / Total Applicants Screened) * 100`
    *   Displayed as a large single KPI — a summary score for the recruitment team's efficiency.
*   **Export Fields:** `Period`, `Total_Applicants`, `Total_Hires`, `Hire_Ratio_Pct`
*   **Purpose:** A single benchmark number (e.g., 9%) that measures how selective or efficient the hiring process is. An extremely low ratio may indicate poor sourcing quality or overly strict screening.

---
