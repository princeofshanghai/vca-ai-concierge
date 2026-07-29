# LinkedIn Visitor Taxonomy Reference

Use this reference when writing PCP visitor-intelligence cards, AI responses, and mock analytics data. The goal is to keep the prototype grounded in LinkedIn-style demographic dimensions instead of invented audience buckets.

## Why This Matters

Visitor insights should feel defensible in product and data reviews. Avoid labels that sound useful but do not map cleanly to standardized LinkedIn analytics fields, such as "benefits operations leaders" or "people operations buyers."

Instead, build insights from standardized dimensions like job function, seniority, industry, company size, location, and opted-in company/person identity.

## Approved Dimensions

### Job Function

Use standardized function labels, not free-form job descriptions.

Examples:

- Human Resources
- Operations
- Finance
- Engineering
- Sales
- Marketing
- Information Technology
- Legal

Good:

- `Human Resources`
- `Operations`

Avoid:

- `Benefits operations`
- `People operations`
- `Carrier coordination teams`

### Seniority

Use standardized seniority levels.

Examples:

- Entry
- Senior
- Manager
- Director
- VP
- CXO
- Owner
- Partner

Good:

- `Director`
- `VP`
- `Director+`

Avoid:

- `Benefits leaders`
- `CHRO / VP` as a single mixed bucket
- `Decision makers`

### Industry

Use LinkedIn-style company industry labels.

Examples:

- Insurance
- Hospitals and Health Care
- Retail
- Financial Services
- Software Development
- IT Services and IT Consulting
- Technology, Information and Internet
- Transportation, Logistics, Supply Chain and Storage

Good:

- `Insurance`
- `Hospitals and Health Care`
- `Retail`
- `Technology, Information and Internet`
- `Transportation, Logistics, Supply Chain and Storage`

Avoid:

- `Benefits-heavy companies`
- `Enterprise HR teams`
- `Carrier ecosystem`
- Shortening or rewriting a taxonomy label inside structured UI

Use the exact current LinkedIn industry label in cards and analytics tables. In a production system, store the taxonomy identifier as the stable value and treat the display label as changeable reference data.

### Company Size

Use fixed employee bands.

Examples:

- 1-10 employees
- 11-50 employees
- 51-200 employees
- 201-500 employees
- 501-1,000 employees
- 1,001-5,000 employees
- 5,001-10,000 employees
- 10,001+ employees

Good:

- `10,001+ employees`
- `1,001-5,000 employees`

Avoid:

- `Enterprise buyers`
- `Large employers`
- `Mid-market companies` as a raw data label

### Location

Use region, country, metro, or city-style location labels.

Examples:

- United States
- Canada
- San Francisco Bay Area
- New York City Metropolitan Area

### Company Name

Use company name only when the prototype is explicitly showing named, opted-in visitor identity.

Good:

- `Arbor Retail Group`
- `Calico Health Network`

Avoid implying that every anonymous visitor can be identified by company or person.

## Recommended Insight Pattern

Use a simple structure:

1. Show the top-level signal.
2. Explain which standardized dimensions power the signal.
3. Interpret the meaning cautiously.

Example:

```text
64% of people who viewed your Page match Velora's target audience, up from 52% last month.

The strongest signals are job function, seniority, and company size.

More visitors now match Velora's core audience profile: Human Resources roles, Director+ seniority, and companies with 10,001+ employees.
```

## Card Copy Guidance

Use taxonomy-based labels in structured cards:

- `Job function` / `Human Resources`
- `Seniority` / `Director+`
- `Industry` / `Hospitals and Health Care`
- `Company size` / `10,001+ employees`
- `Job function` / `38% Human Resources visitors`

Avoid domain-specific invented labels in card rows:

- `Benefits operations`
- `People operations`
- `Carrier coordination`

For compact Audience cards, prefer one demographic dimension per row. If the percentage would be ambiguous as a right-aligned value, make the row label a short evidence sentence such as `38% Human Resources visitors`. Combined labels like `Human Resources · Director+` are acceptable when defining a specific audience segment, but they can be harder to scan when mixed with single-dimension rows.

## Person Card Guidance

Person cards can show high-level behavior signals, but should avoid overly specific tracking language.

Good behavior tags:

- `Returned this week`
- `Viewed multiple posts`
- `Recent visitor`
- `Visited twice`

Avoid:

- `Viewed carrier coordination post at 9:37 AM`
- `Asked about eligibility cleanup`
- `High intent buyer`

## Tone Guidance

- Say `suggests`, `signals`, or `may indicate` when interpreting behavior.
- Do not overclaim intent from page views alone.
- Keep demographic explanations simple and tied to real taxonomy fields.
- Let response cards carry the structured data; let AI text explain why it matters.

## Prototype Caveat

This document is a prototype-content guide, not a production data contract. Before using these labels in production-facing specs, confirm exact taxonomy names and availability with the relevant LinkedIn analytics/data partners.
