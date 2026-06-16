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
- `Human Resources · Director+`

Avoid:

- `Benefits leaders`
- `CHRO / VP` as a single mixed bucket
- `Decision makers`

### Industry

Use LinkedIn-style company industry labels.

Examples:

- Insurance
- Hospital & Health Care
- Retail
- Financial Services
- Computer Software
- Information Technology & Services

Good:

- `Insurance · Hospital & Health Care`
- `Retail`

Avoid:

- `Benefits-heavy companies`
- `Enterprise HR teams`
- `Carrier ecosystem`

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

That match is based on LinkedIn demographic signals like job function, seniority, industry, company size, and location.

The biggest shift is quality: more visitors are in Human Resources roles at Director+ seniority, and more are coming from companies with 10,001+ employees.
```

## Card Copy Guidance

Use taxonomy-based labels in structured cards:

- `Human Resources · Director+`
- `Insurance · Hospital & Health Care`
- `10,001+ employees`

Avoid domain-specific invented labels in card rows:

- `Benefits operations`
- `People operations`
- `Carrier coordination`

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
