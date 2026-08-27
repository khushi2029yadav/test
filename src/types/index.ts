export type StationStatus = 'NORMAL' | 'SUSPICIOUS' | 'ANOMALY';

export type ParameterType = 'TEMPERATURE' | 'PRESSURE' | 'HUMIDITY' | 'WIND_SPEED' | 'PRECIPITATION' | 'SOLAR_IRRADIANCE';

export type RootCauseType = 
  | 'SPIKE' 
  | 'FREEZE' 
  | 'DRIFT' 
  | 'BIAS' 
  | 'NOISE' 
  | 'DROPOUT' 
  | 'GENUINE_WEATHER' 
  | 'CALIBRATION';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type WeatherVsFaultType = 'LIKELY_SENSOR_FAULT' | 'LIKELY_GENUINE_WEATHER' | 'AMBIGUOUS';

export interface SpatialNeighborEvidence {
  stationId: string;
  name: string;
  distanceKm: number;
  observedVal: number;
  delta: number;
  status: 'AGREE' | 'DISAGREE' | 'UNKNOWN';
}

export interface EvidencePillars {
  temporal: {
    score: number; // 0 to 1 (1 = strong anomaly)
    zScore: number;
    rateOfChange: number; // e.g. °C/min
    threshold: number;
    description: string;
    status: 'PASS' | 'WARN' | 'FAIL';
  };
  statistical: {
    score: number;
    madScore: number; // Median Absolute Deviation
    distributionPercentile: number; // e.g. 99.8th percentile
    description: string;
    status: 'PASS' | 'WARN' | 'FAIL';
  };
  ml: {
    score: number;
    isolationForestScore: number;
    autoencoderReconLoss: number;
    modelConfidence: number;
    description: string;
    status: 'PASS' | 'WARN' | 'FAIL';
  };
  spatial: {
    score: number;
    neighborAgreementPercent: number; // e.g. 12% agreement
    krigingExpectedVal: number;
    neighbors: SpatialNeighborEvidence[];
    description: string;
    status: 'PASS' | 'WARN' | 'FAIL' | 'NEUTRAL';
  };
  multivariate: {
    score: number;
    dewPointConsistency: boolean;
    vaporPressureCoherence: boolean;
    solarThermalCorrelated: boolean;
    description: string;
    status: 'PASS' | 'WARN' | 'FAIL';
  };
  fusion: {
    overallConfidence: number; // 0 to 100
    hardConfidence: number; // Physical hard rules
    softConfidence: number; // ML / Statistical
    spatialWeight: number;
    finalClassification: WeatherVsFaultType;
    verdict: string;
  };
}

export interface CorrectionAdvisory {
  originalValue: number;
  suggestedValue: number;
  unit: string;
  method: 'Spatial Kriging Interpolation' | 'Temporal Kalman Spline' | 'Multivariate Autoencoder Imputation' | 'Neighbor Ensemble Average';
  confidence: number; // percentage e.g. 97.4%
  provenanceHash: string;
  timestamp: string;
  isAdvisoryOnly: boolean; // Always true: Raw value preserved!
  status: 'PENDING_REVIEW' | 'ADVISED' | 'ACCEPTED_DOWNSTREAM';
}

export interface TelemetryReading {
  timestamp: string;
  temperature: number; // °C
  pressure: number; // hPa
  humidity: number; // %
  windSpeed: number; // m/s
  windDirection?: number; // deg
  solarIrradiance?: number; // W/m²
  precipitation?: number; // mm/h
  isAnomaly?: boolean;
  anomalyType?: RootCauseType;
  confidence?: number;
  expectedRanges?: {
    tempMin: number;
    tempMax: number;
    pressMin: number;
    pressMax: number;
    rhMin: number;
    rhMax: number;
  };
}

export interface AnomalyAlert {
  id: string;
  stationId: string;
  stationName: string;
  region: string;
  parameter: ParameterType;
  rawValue: number;
  unit: string;
  expectedValue: number;
  rootCause: RootCauseType;
  severity: AlertSeverity;
  status: 'CRITICAL' | 'SUSPICIOUS' | 'RESOLVED';
  weatherVsFault: WeatherVsFaultType;
  confidence: number; // e.g. 0.96
  timestamp: string;
  humanReadableExplanation: string;
  recommendedAction: string;
  evidence: EvidencePillars;
  correction: CorrectionAdvisory;
}

export interface Station {
  id: string; // ST-104
  code: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  elevationM: number;
  status: StationStatus;
  healthScore: number; // 0 to 100
  lastSeen: string;
  batteryPercent: number;
  solarWatts: number;
  signalSNR: number; // dB
  hardwareModel: string;
  firmwareVersion: string;
  currentReadings: {
    temperature: number;
    pressure: number;
    humidity: number;
    windSpeed: number;
    solarIrradiance: number;
    precipitation: number;
  };
  activeAlertCount: number;
  recentFaultType?: RootCauseType;
}

export interface SensorHealthRecord {
  stationId: string;
  stationName: string;
  overallScore: number;
  trendDirection: 'STABLE' | 'DEGRADING' | 'CRITICAL' | 'IMPROVING';
  degradationRatePerMonth: number; // e.g. -2.4% / month
  predictedMTBFDays: number;
  maintenancePriority: 'URGENT' | 'HIGH' | 'ROUTINE' | 'OPTIMAL';
  lastCalibrated: string;
  nextCalibrationDue: string;
  subsystems: {
    tempRTD: { score: number; driftRate: string; noiseFloor: string; status: 'GOOD' | 'WARN' | 'CRITICAL' };
    barometerMEMS: { score: number; driftRate: string; noiseFloor: string; status: 'GOOD' | 'WARN' | 'CRITICAL' };
    hygrometerCapacitive: { score: number; driftRate: string; noiseFloor: string; status: 'GOOD' | 'WARN' | 'CRITICAL' };
    anemometerSonic: { score: number; driftRate: string; noiseFloor: string; status: 'GOOD' | 'WARN' | 'CRITICAL' };
    powerSystem: { score: number; batteryHealth: string; solarEfficiency: string; status: 'GOOD' | 'WARN' | 'CRITICAL' };
  };
  faultHistory: {
    id: string;
    date: string;
    faultType: RootCauseType;
    parameter: ParameterType;
    durationMinutes: number;
    resolvedBy: string;
  }[];
}

export interface FaultInjectionConfig {
  stationId: string;
  parameter: ParameterType;
  faultType: RootCauseType;
  severityPercent: number;
  durationSeconds: number;
  customValue?: number;
}

export interface PipelineStep {
  id: string;
  name: string;
  label: string;
  status: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FLAGGED';
  latencyMs: number;
  outputSummary: string;
  timestamp: string;
}

export interface SystemService {
  id: string;
  name: string;
  category: 'Ingestion' | 'Database' | 'ML Engine' | 'Fusion Engine' | 'Realtime Bus' | 'Quality Control';
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  throughput: string;
  uptime: string;
  lastHeartbeat: string;
  details: Record<string, string | number>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  stationContextId?: string;
  alertContextId?: string;
  evidenceSnippets?: {
    pillar: string;
    detail: string;
    badge: string;
  }[];
  suggestedActions?: {
    label: string;
    actionType: 'NAVIGATE' | 'INJECT_FAULT' | 'APPLY_CORRECTION' | 'DISPATCH_TECH';
    payload: any;
  }[];
}

export type PageId = 
  | 'dashboard' 
  | 'stations' 
  | 'station-detail' 
  | 'alerts' 
  | 'alert-detail' 
  | 'analytics' 
  | 'health' 
  | 'health-detail' 
  | 'simulator' 
  | 'copilot' 
  | 'system';
