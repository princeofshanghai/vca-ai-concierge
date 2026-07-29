type ContentPostFixture = Readonly<{
  clicks: number;
  comments: number;
  engagementRateLabel: string;
  impressions: number;
  impressionsLabel: string;
  reactions: number;
  reposts: number;
}>;

function formatCompact(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return String(value);
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function getInteractions(post: ContentPostFixture) {
  return post.clicks + post.reactions + post.comments + post.reposts;
}

const posts = {
  arborOpenEnrollment: {
    clicks: 59,
    comments: 146,
    engagementRateLabel: "8.2%",
    impressions: 18_400,
    impressionsLabel: "18.4K",
    reactions: 1_240,
    reposts: 64,
  },
  carrierReadiness: {
    clicks: 56,
    comments: 88,
    engagementRateLabel: "7.1%",
    impressions: 14_200,
    impressionsLabel: "14.2K",
    reactions: 830,
    reposts: 34,
  },
  midYearMigration: {
    clicks: 35,
    comments: 64,
    engagementRateLabel: "6.3%",
    impressions: 10_200,
    impressionsLabel: "10.2K",
    reactions: 520,
    reposts: 24,
  },
} as const satisfies Record<string, ContentPostFixture>;

const historicalPosts = {
  eligibilityCleanup: {
    clicks: 24,
    comments: 62,
    engagementRateLabel: "5.2%",
    impressions: 12_500,
    impressionsLabel: "12.5K",
    reactions: 540,
    reposts: 24,
  },
} as const satisfies Record<string, ContentPostFixture>;

const last7DayPosts = Object.values(posts);
const last7DayImpressions = last7DayPosts.reduce(
  (total, post) => total + post.impressions,
  0,
);
const last7DayInteractions = last7DayPosts.reduce(
  (total, post) => total + getInteractions(post),
  0,
);
const last7DayEngagementRate =
  last7DayInteractions / last7DayImpressions;

export const pcpAdminContentPerformanceFixture = {
  last7Days: {
    engagementRate: {
      deltaLabel: "28%",
      value: last7DayEngagementRate,
      valueLabel: `${(last7DayEngagementRate * 100).toFixed(1)}%`,
    },
    impressions: {
      deltaLabel: "18%",
      value: last7DayImpressions,
      valueLabel: formatCompact(last7DayImpressions),
    },
    postsPublished: {
      deltaLabel: "2",
      value: 3,
      valueLabel: "3",
    },
  },
  last30Days: {
    comments: {
      deltaLabel: "9.3%",
      value: 640,
      valueLabel: "640",
    },
    impressions: {
      deltaLabel: "18.4%",
      value: 164_800,
      valueLabel: formatNumber(164_800),
    },
    reactions: {
      deltaLabel: "12.7%",
      value: 9_200,
      valueLabel: formatNumber(9_200),
    },
    reposts: {
      deltaLabel: "15.6%",
      value: 216,
      valueLabel: "216",
    },
  },
  historicalPosts,
  posts,
} as const;
