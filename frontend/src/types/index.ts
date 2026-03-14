export type Ambience = 'forest' | 'ocean' | 'mountain';

export type AnalysisResult = {
  emotion: string;
  keywords: string[];
  summary: string;
};

export type JournalEntry = {
  id: string;
  userId: string;
  ambience: Ambience;
  text: string;
  createdAt: string;
  analysis?: AnalysisResult;
};

export type Insights = {
  totalEntries: number;
  topEmotion: string;
  mostUsedAmbience: string;
  recentKeywords: string[];
};

