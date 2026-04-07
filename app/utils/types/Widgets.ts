export interface Statistic {
  value?: number;
  type: 'amount' | 'percentage';
  positive: boolean;
}

export interface Counts {
  value: number;
  title: string;
}

export interface WidgetProps {
  title: string;
  value: number;
  statistic: Statistic;
  counts?: Counts;
}
