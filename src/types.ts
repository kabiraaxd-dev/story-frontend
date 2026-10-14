export interface Option {
  id: number;
  name: string;
  slug: string;
}
export interface AgeGroup {
  id: number;
  label: string;
}

export interface StorySummary {
  id: number;
  title: string;
  slug: string;
  summary: string;
  mainImageUrl: string | null;
  audioUrl: string | null;
  category: { name: string; slug: string };
  ageGroup: AgeGroup;
  author: { name: string };
  tags: { name: string; slug: string }[];
  readingMinutes: number;
}

export interface StoryDetail extends StorySummary {
  content: string;
}
export interface StoryList {
  items: StorySummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PillItem {
  value: string;
  label: string;
  aria?: string;
}