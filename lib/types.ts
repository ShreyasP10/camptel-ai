export interface AtRiskStudent {
  id: string;
  name: string;
  riskScore: number;
  reason: string;
}

export interface PlacementReadiness {
  studentId: string;
  readinessScore: number;
  skillGaps: string[];
}

export interface ClassroomUtilization {
  room: string;
  usagePercentage: number;
  period: string;
}

export interface AccelerationMetric {
  metric: string;
  value: number;
  benchmark: number;
}
