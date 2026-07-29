type VisitorMetricTone = "negative" | "positive";

type VisitorMetricFixture = Readonly<{
  deltaLabel: string;
  label: string;
  tone: VisitorMetricTone;
  value: number;
  valueLabel: string;
}>;

type VisitorDemographicFixture = Readonly<{
  barPercent: number;
  count: number;
  countLabel: string;
  label: string;
  percentage: number;
  percentageLabel: string;
}>;

type VisitorSummaryDemographicFixture = Readonly<{
  count: number;
  countLabel: string;
  label: string;
  percentage: number;
  percentageLabel: string;
}>;

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function visitorMetric(
  label: string,
  value: number,
  deltaLabel: string,
  tone: VisitorMetricTone,
): VisitorMetricFixture {
  return {
    deltaLabel,
    label,
    tone,
    value,
    valueLabel: formatNumber(value),
  };
}

const totalUniqueVisitors = 3_180;

const industryDemographics = [
  {
    label: "Retail",
    count: 852,
    countLabel: formatNumber(852),
    percentage: 26.8,
    percentageLabel: "26.8%",
    barPercent: 100,
  },
  {
    label: "Hospitals and Health Care",
    count: 712,
    countLabel: formatNumber(712),
    percentage: 22.4,
    percentageLabel: "22.4%",
    barPercent: 84,
  },
  {
    label: "Technology, Information and Internet",
    count: 448,
    countLabel: formatNumber(448),
    percentage: 14.1,
    percentageLabel: "14.1%",
    barPercent: 53,
  },
  {
    label: "Insurance",
    count: 347,
    countLabel: formatNumber(347),
    percentage: 10.9,
    percentageLabel: "10.9%",
    barPercent: 41,
  },
  {
    label: "Manufacturing",
    count: 261,
    countLabel: formatNumber(261),
    percentage: 8.2,
    percentageLabel: "8.2%",
    barPercent: 31,
  },
  {
    label: "Others",
    count: 560,
    countLabel: formatNumber(560),
    percentage: 17.6,
    percentageLabel: "17.6%",
    barPercent: 66,
  },
] as const satisfies ReadonlyArray<VisitorDemographicFixture>;

const otherSummaryCount = industryDemographics
  .slice(3)
  .reduce((total, demographic) => total + demographic.count, 0);
const otherSummaryPercentage =
  Math.round((otherSummaryCount / totalUniqueVisitors) * 1_000) / 10;

const summaryIndustryDemographics = [
  {
    label: industryDemographics[0].label,
    count: industryDemographics[0].count,
    countLabel: industryDemographics[0].countLabel,
    percentage: industryDemographics[0].percentage,
    percentageLabel: industryDemographics[0].percentageLabel,
  },
  {
    label: industryDemographics[1].label,
    count: industryDemographics[1].count,
    countLabel: industryDemographics[1].countLabel,
    percentage: industryDemographics[1].percentage,
    percentageLabel: industryDemographics[1].percentageLabel,
  },
  {
    label: industryDemographics[2].label,
    count: industryDemographics[2].count,
    countLabel: industryDemographics[2].countLabel,
    percentage: industryDemographics[2].percentage,
    percentageLabel: industryDemographics[2].percentageLabel,
  },
  {
    label: "Other",
    count: otherSummaryCount,
    countLabel: formatNumber(otherSummaryCount),
    percentage: otherSummaryPercentage,
    percentageLabel: `${otherSummaryPercentage}%`,
  },
] as const satisfies ReadonlyArray<VisitorSummaryDemographicFixture>;

export const pcpAdminVisitorAnalyticsFixture = {
  dateRange: "May 11, 2026 - Jun 9, 2026",
  periodLabel: "Last 30 days",
  highlights: {
    pageViews: visitorMetric("Page views", 8_740, "28%", "positive"),
    uniqueVisitors: visitorMetric(
      "Unique visitors",
      totalUniqueVisitors,
      "20.2%",
      "negative",
    ),
    customButtonClicks: visitorMetric(
      "Custom button clicks",
      126,
      "33%",
      "negative",
    ),
  },
  demographicDimension: "Industry",
  industryDemographics,
  summaryIndustryDemographics,
} as const;
