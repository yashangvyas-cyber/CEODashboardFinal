# Functional Specification: CEO Dashboard

## Document Control
**Version:** 2.0
**Date:** Current
**Author:** Engineering Team
**Role:** Technical Documentation

---

## 1. Report Overview
**Purpose**
This dashboard serves as the organization's "Executive Command Center". It bridges the gap between organizational health (People), delivery velocity (Project Management), revenue realization (CRM & Invoice), and talent acquisition (Recruitment).

---

## 2. Global Controls
**A. Select Business Unit**
*   **Source:** All Business Units Dropdown
*   **Logic:** Affects **EVERYTHING** on the page. If a specific BU is selected (e.g., "Engineering"), the Hero Section and all subsequent Tabs must only fetch data for that BU.

**B. Date Range Filter**
*   **Source:** Date Range Dropdown (e.g., This Year, Last Year, Last Quarter)
*   **Logic:**
    *   **Hero Section:** IGNORES this filter. The Hero Section is always a real-time current snapshot.
    *   **Module Tabs (People, PM, CRM, Recruitment):** RESPECTS this filter. Changing the date range must trigger a re-fetch of all widget data inside the tabs to reflect that specific historical period.

---

## 3. The Live Forecast (Hero Ticker)

**Card: Total Employees**
*   **Source:** Reports > People > Headcount Diversity > Total Employees
*   **Logic:** Status = 'Active'
*   **Calculation / Formula:** 
    *   Headcount Difference: Current Count - Baseline Count
    *   Growth Percentage: (Headcount Difference / Baseline Count) * 100
*   **Example:** If we had 354 and now have 363, show: `+9 (2.54%)`
*   **Visual / Thresholds:** Positive trend is Green, negative trend is red.

**Card: Revenue Pulse**
*   **Source:** CRM & Invoices > Goal Tracker > Collections Goal
*   **Logic:** All YTD revenue
*   **Calculation / Formula:** Use Existing.
*   **Example:** If we made $1M and our goal is $2M, the progress bar shows 50% full.
*   **Visual / Thresholds:** Shows as a percentage progress bar towards the annual target.

**Card: Collection**
*   **Source:** Reports > CRM & Invoice > Collections
*   **Logic:** Health metric showing how much billed money we actually collected.
*   **Calculation / Formula:** (Total Received Amount / Total Invoiced Amount) * 100
*   **Example:** If we sent invoices for $100k and collected $90k, show: `90%`
*   **Visual / Thresholds:** Below 80% shows as Amber/Red risk.

**Card: Open Roles**
*   **Source:** Recruitment > Jobs > Open Jobs
*   **Logic:** Only Open Jobs.
*   **Calculation / Formula:** Simple count of those jobs.
*   **Example:** If we have 10 open jobs show: `10`

**Card: 30-Day Cash Forecast**
*   **Source:** Reports > Finance > Expected Cash flow
*   **Logic:** Add up all invoices due in the next 30 days that are still 'Unpaid' or 'Partially Paid'.
*   **Calculation / Formula:** Sum of those invoice amounts.
*   **Example:** If 5 invoices are due next week totaling $50,000, show: `$50k Incoming`
*   **Visual / Thresholds:** Green text for healthy positive cash flow.

---

## 4. People Tab 
**A. Card: People Summary Cards**
*   **Source:** 
*   **Logic:** Aggregated KPIs for the selected period.
*   **Calculation / Formula:**
    *   Headcount: Total active end of period.
    *   Net Change: `Hires - Exits`.
    *   Attrition Rate: `(Exits / Headcount) * 100`.
    *   Experience Ratio: `Count(Exp < 1yr) / Count(Exp > 5yrs)`.
    *   Span of Control: `Headcount / Unique Managers`.

**B. Chart: Early Attrition**
*   **Source:** HRIS (New Hires & Exits)
*   **Logic:** Exits occurring within 90 days of join date in the selected period.
*   **Calculation / Formula:** `(Exits < 90 days / Total New Hires) * 100`.
*   **Visual / Thresholds:** Gauge Chart. Risk threshold > 10% (Red/Critical).

**C. Chart: Exit Trend**
*   **Source:** HRIS (Exits)
*   **Logic:** Grouped by month over the selected period.
*   **Calculation / Formula:** Stacked bar chart mapping `Regrettable` vs `Non-Regrettable` exits.

**D. Chart: Exit by Type & Reason**
*   **Source:** HRIS (Exit Interviews)
*   **Logic:** Categorizes exits in the selected period.
*   **Calculation / Formula:** Tabbed Donut Chart splitting Resignations from Terminations with specific root causes.

**E. Chart: Skills Gap**
*   **Source:** Performance & Training Analytics
*   **Logic:** Skill proficiency per employee active in the selected period.
*   **Calculation / Formula:** Ranks Top 5 skills mapping % of staff at Beginner, Intermediate, and Experienced levels.

**F. Chart: Manager Watchlist**
*   **Source:** HRIS (Reporting Lines & Exits)
*   **Logic:** Managers associated with highest turnover in the selected period.
*   **Calculation / Formula:** List of managers sorted by Flight Risk Score (attrition + skipped 1v1s).

**G. Chart: Top Employees**
*   **Source:** Reward / Performance System
*   **Logic:** Ranking of high performers in the selected period.
*   **Calculation / Formula:** Highest sum of Trophy scores.

---

## 5. Project Management Tab

**A. Card: PM Summary Cards**
*   **Source:** PM Reports
*   **Logic:** Aggregated performance covering the selected period.
*   **Calculation / Formula:**
    *   Active Projects: Started or ongoing in period.
    *   Projects Closed: Final status achieved in period.
    *   Resource Utilization: `% Billable / Total Available Hours`.

**B. Chart: Project Portfolio Status**
*   **Source:** PM Reports (Projects)
*   **Logic:** Projects where active dates overlap the selected period.
*   **Calculation / Formula:** Horizontal stacked bars. Y-axis: Type (Fixed, T&M, Hirebase). X-axis: Dynamic array of Status counts.

**C. Chart: Project Delivery Health**
*   **Source:** PM Reports (3 Billing Models)
*   **Logic:** Triple-gauge summarizing portfolio margin health.
*   **Calculation / Formula:**
    *   **Fixed Cost Burn:** `Spent Hours / Estimated Hours`. Red if > 80%.
    *   **Hourly Billed:** `Billed Hours / Purchased Hours`. Amber if < 80%.
    *   **Hirebase Billable:** `Billable=Yes / Total Hirebase Contracts`. Amber if < 85%.

**D. Chart: Revenue Leakage**
*   **Source:** Fixed Cost & Hourly Reports
*   **Logic:** Projects exceeding budget thresholds.
*   **Calculation / Formula:** `Actual Spent > Target (Purchased/Billed)`. Shows amount over run. Visual pulse effect for >100% overrun.

**E. Chart: Top Effort Consumers**
*   **Source:** Time Spent Report
*   **Logic:** Projects with highest logged hours in the selected period.
*   **Calculation / Formula:** Top 5 highest `SUM(Time Spent)`.

**F. Chart: Contract Adjustments**
*   **Source:** Hirebase Resource Allocation
*   **Logic:** Hirebase contracts initiating or terminating in the period.
*   **Calculation / Formula:** Status marked as `Hired` (Start Date in range), `Expired` (End Date in range), or both.

**G. Chart: Top Skills Demand**
*   **Source:** Hirebase Report (Hired For column)
*   **Logic:** Active contracts occurring in the selected period.
*   **Calculation / Formula:** Parses comma-separated skill tags. Count of occurrences per unique skill. Top ranked horizontal bars.

**H. Chart: Hirebase by Department**
*   **Source:** Hirebase Report
*   **Logic:** Active contracts grouped by resource department.
*   **Calculation / Formula:** Stacked bars splitting Billable (Yes/No) headcount per department.

---

## 6. CRM & Invoice Tab

**A. Card: CRM Summary Cards**
*   **Source:** CRM Deals & Finance Invoices
*   **Logic:** Financial progress in the selected period.
*   **Calculation / Formula:**
    *   Total Won: `SUM(Deal Value)` for Won Deals.
    *   Invoiced: `SUM(Amount)` for Issued invoices.
    *   Collected: `SUM(Amount)` for Paid status.
    *   Outstanding: `Invoiced - Collected`.

**B. Chart: Revenue vs Target**
*   **Source:** Finance Targets
*   **Logic:** Annual achievement.
*   **Calculation / Formula:** `(YTD Revenue / Target) * 100`. Includes YoY Growth forecast.

**C. Chart: Revenue Trend**
*   **Source:** CRM Win & Finance Invoice/Payment Dates
*   **Logic:** Monthly lines over the selected period.
*   **Calculation / Formula:** 3 Line chart (Won, Invoiced, Collected) mapping the cash flow lag.

**D. Chart: Collection Goal**
*   **Source:** Finance
*   **Logic:** Progress against raw collection number.
*   **Calculation / Formula:** Gauge mapping Collected vs Goal for selected period.

**E. Chart: Avg. Days to Pay**
*   **Source:** Finance (Payments)
*   **Logic:** Speed of cash turnover for invoices paid in period.
*   **Calculation / Formula:** `AVG(Payment Date - Invoice Issue Date)`.

**F. Chart: Pipeline Summaries / Funnel**
*   **Source:** CRM Deals
*   **Logic:** Snapshot of active deal pipeline stages.
*   **Calculation / Formula:** `SUM(Value)` and `COUNT` mapped by funnel stage.

**G. Chart: Lost Deal Analysis**
*   **Source:** CRM Lost Deals
*   **Logic:** Categorization of losses for the period.
*   **Calculation / Formula:** Grouped by 'Loss Reason'.

**H. Chart: Revenue Source Mix**
*   **Source:** Finance
*   **Logic:** Mix of New vs Existing logos invoiced in period.
*   **Calculation / Formula:** % split.

**I. Chart: Top Revenue Contributors**
*   **Source:** Finance
*   **Logic:** Top 5 clients by Invoiced Amount in period.
*   **Calculation / Formula:** Sorted by largest `SUM(Invoiced)`.

**J. Chart: Key Collections**
*   **Source:** Finance Payments
*   **Logic:** Largest single cash occurrences.
*   **Calculation / Formula:** Sorting top 5 individual payment inflows in the selected period.

**K. Chart: Multi-Currency Cash Flow**
*   **Source:** Finance Payments
*   **Logic:** Inflows separated by currency.
*   **Calculation / Formula:** `SUM(Amount)` grouped by base currency.

---

## 7. Recruitment Tab

**A. Card: Recruitment Summary Cards**
*   **Source:** ATS
*   **Logic:** Pipeline health in the selected period.
*   **Calculation / Formula:** Total Candidates, Total Hires, Open Roles, Time-to-Hire, Accept Rate (Offers), Hire Ratio.

**B. Chart: Stage Conversion**
*   **Source:** ATS Funnel
*   **Logic:** Applicant flow through interviewing stages.
*   **Calculation / Formula:** % drop-off between Top-Of-Funnel and sequential stages.

**C. Chart: Recruitment Velocity**
*   **Source:** ATS
*   **Logic:** Speed of candidate movement in the period.
*   **Calculation / Formula:** Line/Bar hybrid charting `TimeToHire` against volume.

**D. Chart: Job Status**
*   **Source:** ATS Requisitions
*   **Logic:** All requisitions touched in the period.
*   **Calculation / Formula:** Breakdown of Open, Closed, On Hold positions.

**E. Chart: Offer Acceptance**
*   **Source:** ATS Offers
*   **Logic:** Ratio of offer states in the period.
*   **Calculation / Formula:** Pie/Donut mapping Accepted vs Pending vs Declined offers.
