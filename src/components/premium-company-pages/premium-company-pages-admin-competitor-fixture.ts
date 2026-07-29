import { pcpCompanyProfile, pcpCompetitorNames } from "./persona";
import { pcpAdminContentPerformanceFixture } from "./premium-company-pages-admin-content-fixture";

type CompetitorMetricTone = "negative" | "positive";

type CompetitorMetricFixture = Readonly<{
  deltaLabel: string;
  tone: CompetitorMetricTone;
  value: number;
  valueLabel: string;
}>;

type CompetitorRowFixture = Readonly<{
  comments: CompetitorMetricFixture;
  company: string;
  followersLabel: string;
  isYou?: boolean;
  newFollowers: CompetitorMetricFixture;
  posts: CompetitorMetricFixture;
  rank: number;
  reactions: CompetitorMetricFixture;
}>;

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function formatCompact(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return formatNumber(value);
}

function formatAverageReactionsPerPost(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return formatNumber(Math.round(value / 10) * 10);
}

function metric(
  value: number,
  deltaLabel: string,
  tone: CompetitorMetricTone,
  valueLabel = formatNumber(value),
): CompetitorMetricFixture {
  return {
    deltaLabel,
    tone,
    value,
    valueLabel,
  };
}

const trackedCompetitors = [
  {
    rank: 1,
    company: pcpCompetitorNames[0],
    followersLabel: "128K followers",
    isYou: false,
    newFollowers: metric(1_280, "24%", "positive"),
    posts: metric(22, "83.3%", "positive"),
    comments: metric(4_850, "18.7%", "positive"),
    reactions: metric(42_800, "32.4%", "positive", "42.8K"),
  },
  {
    rank: 2,
    company: pcpCompetitorNames[1],
    followersLabel: "104K followers",
    isYou: false,
    newFollowers: metric(940, "12.5%", "positive"),
    posts: metric(18, "50%", "positive"),
    comments: metric(3_620, "6.8%", "positive"),
    reactions: metric(31_600, "18.6%", "positive", "31.6K"),
  },
  {
    rank: 3,
    company: pcpCompetitorNames[2],
    followersLabel: "91K followers",
    isYou: false,
    newFollowers: metric(610, "7.3%", "positive"),
    posts: metric(15, "25%", "positive"),
    comments: metric(1_980, "28.8%", "negative"),
    reactions: metric(18_400, "9.2%", "positive", "18.4K"),
  },
] as const satisfies ReadonlyArray<CompetitorRowFixture>;

const velora = {
  rank: 4,
  company: pcpCompanyProfile.name,
  followersLabel: pcpCompanyProfile.followers,
  isYou: true,
  newFollowers: metric(420, "64.6%", "negative"),
  posts: metric(12, "45.5%", "negative"),
  comments: metric(
    pcpAdminContentPerformanceFixture.last30Days.comments.value,
    "73.3%",
    "negative",
    pcpAdminContentPerformanceFixture.last30Days.comments.valueLabel,
  ),
  reactions: metric(
    pcpAdminContentPerformanceFixture.last30Days.reactions.value,
    "73%",
    "negative",
    "9.2K",
  ),
} as const satisfies CompetitorRowFixture;

const rows = [...trackedCompetitors, velora] as const;

export const pcpAdminCompetitorAnalyticsFixture = {
  dateRange: "May 11, 2026 - Jun 9, 2026",
  periodDays: 30,
  periodLabel: "Last 30 days",
  starterComparisonPeriodLabel: "Last 7 days",
  rows,
  trackedCompetitorCount: trackedCompetitors.length,
  trackedCompetitors,
  velora,
  averageReactionsPerPost: rows.map((row) => {
    const value = row.reactions.value / row.posts.value;

    return {
      company: row.company,
      isYou: row.isYou ?? false,
      value,
      valueLabel: formatAverageReactionsPerPost(value),
    };
  }),
  commentsPerDay: rows.map((row) => {
    const value = Math.round(row.comments.value / 30);

    return {
      company: row.company,
      deltaLabel: row.comments.deltaLabel,
      tone: row.comments.tone,
      value,
      valueLabel: formatCompact(value),
    };
  }),
} as const;
