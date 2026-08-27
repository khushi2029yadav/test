import type { 
  Station, 
  AnomalyAlert, 
  TelemetryReading, 
  SensorHealthRecord, 
  SystemService
} from '../types';

export const INITIAL_STATIONS: Station[] = [
  {
    id: 'ST-104',
    code: 'AWS-HRD-04',
    name: 'Haridwar Foothills AWS',
    region: 'Uttarakhand Valley',
    lat: 29.9457,
    lng: 78.1642,
    elevationM: 314,
    status: 'ANOMALY',
    healthScore: 68,
    lastSeen: '1 sec ago',
    batteryPercent: 88,
    solarWatts: 42.5,
    signalSNR: 28.4,
    hardwareModel: 'Vaisala AWS-310 Smart Series',
    firmwareVersion: 'v4.18.2-rtos',
    currentReadings: {
      temperature: 55.2, // Hero Case 1: Spike
      pressure: 1008.4,
      humidity: 12.0,
      windSpeed: 2.1,
      solarIrradiance: 780,
      precipitation: 0.0
    },
    activeAlertCount: 1,
    recentFaultType: 'SPIKE'
  },
  {
    id: 'ST-101',
    code: 'AWS-DDN-01',
    name: 'Dehradun Valley AWS',
    region: 'Uttarakhand Valley',
    lat: 30.3165,
    lng: 78.0322,
    elevationM: 640,
    status: 'NORMAL',
    healthScore: 96,
    lastSeen: '2 sec ago',
    batteryPercent: 94,
    solarWatts: 58.2,
    signalSNR: 32.1,
    hardwareModel: 'Campbell CR1000X MicroMet',
    firmwareVersion: 'v5.02.1',
    currentReadings: {
      temperature: 28.1,
      pressure: 945.2,
      humidity: 58.4,
      windSpeed: 3.4,
      solarIrradiance: 810,
      precipitation: 0.0
    },
    activeAlertCount: 0
  },
  {
    id: 'ST-102',
    code: 'AWS-MUS-02',
    name: 'Mussoorie Ridge Station',
    region: 'Garhwal Himalayas',
    lat: 30.4598,
    lng: 78.0644,
    elevationM: 2005,
    status: 'NORMAL',
    healthScore: 92,
    lastSeen: '3 sec ago',
    batteryPercent: 91,
    solarWatts: 51.0,
    signalSNR: 26.8,
    hardwareModel: 'Vaisala AWS-310 Smart Series',
    firmwareVersion: 'v4.18.2-rtos',
    currentReadings: {
      temperature: 24.2,
      pressure: 802.1,
      humidity: 64.2,
      windSpeed: 5.8,
      solarIrradiance: 890,
      precipitation: 0.0
    },
    activeAlertCount: 0
  },
  {
    id: 'ST-103',
    code: 'AWS-RSK-03',
    name: 'Rishikesh Ganga Basin',
    region: 'Uttarakhand Valley',
    lat: 30.0869,
    lng: 78.2676,
    elevationM: 372,
    status: 'NORMAL',
    healthScore: 94,
    lastSeen: '1 sec ago',
    batteryPercent: 96,
    solarWatts: 56.4,
    signalSNR: 31.0,
    hardwareModel: 'Campbell CR1000X MicroMet',
    firmwareVersion: 'v5.02.1',
    currentReadings: {
      temperature: 28.8,
      pressure: 1004.8,
      humidity: 56.1,
      windSpeed: 2.8,
      solarIrradiance: 825,
      precipitation: 0.0
    },
    activeAlertCount: 0
  },
  {
    id: 'ST-105',
    code: 'AWS-SHM-05',
    name: 'Shimla Central Ridge',
    region: 'Himachal Highlands',
    lat: 31.1048,
    lng: 77.1734,
    elevationM: 2205,
    status: 'SUSPICIOUS',
    healthScore: 79,
    lastSeen: '4 sec ago',
    batteryPercent: 82,
    solarWatts: 38.0,
    signalSNR: 24.2,
    hardwareModel: 'Vaisala AWS-310 Smart Series',
    firmwareVersion: 'v4.16.0',
    currentReadings: {
      temperature: 21.4,
      pressure: 782.5,
      humidity: 71.0,
      windSpeed: 4.1,
      solarIrradiance: 710,
      precipitation: 0.2
    },
    activeAlertCount: 1,
    recentFaultType: 'DRIFT'
  },
  {
    id: 'ST-106',
    code: 'AWS-MNL-06',
    name: 'Manali Alpine Pass',
    region: 'Himachal Highlands',
    lat: 32.2396,
    lng: 77.1887,
    elevationM: 2050,
    status: 'NORMAL',
    healthScore: 90,
    lastSeen: '2 sec ago',
    batteryPercent: 89,
    solarWatts: 47.2,
    signalSNR: 27.5,
    hardwareModel: 'Campbell CR1000X MicroMet',
    firmwareVersion: 'v5.02.1',
    currentReadings: {
      temperature: 18.6,
      pressure: 798.2,
      humidity: 78.4,
      windSpeed: 6.2,
      solarIrradiance: 680,
      precipitation: 1.4
    },
    activeAlertCount: 0
  },
  {
    id: 'ST-107',
    code: 'AWS-NNT-07',
    name: 'Nainital Lake Catchment',
    region: 'Kumaon Hills',
    lat: 29.3919,
    lng: 79.4542,
    elevationM: 1938,
    status: 'NORMAL',
    healthScore: 95,
    lastSeen: '2 sec ago',
    batteryPercent: 93,
    solarWatts: 54.1,
    signalSNR: 30.2,
    hardwareModel: 'Vaisala AWS-310 Smart Series',
    firmwareVersion: 'v4.18.2-rtos',
    currentReadings: {
      temperature: 23.5,
      pressure: 812.0,
      humidity: 68.2,
      windSpeed: 3.1,
      solarIrradiance: 790,
      precipitation: 0.0
    },
    activeAlertCount: 0
  },
  {
    id: 'ST-108',
    code: 'AWS-LEH-08',
    name: 'Leh High-Altitude Plateau',
    region: 'Ladakh Trans-Himalayas',
    lat: 34.1526,
    lng: 77.5771,
    elevationM: 3524,
    status: 'NORMAL',
    healthScore: 88,
    lastSeen: '5 sec ago',
    batteryPercent: 85,
    solarWatts: 62.0,
    signalSNR: 22.8,
    hardwareModel: 'RuggedMet Extreme Cryo-90',
    firmwareVersion: 'v3.8.4',
    currentReadings: {
      temperature: 11.2,
      pressure: 672.4,
      humidity: 22.1,
      windSpeed: 8.4,
      solarIrradiance: 1040,
      precipitation: 0.0
    },
    activeAlertCount: 0
  },
  {
    id: 'ST-109',
    code: 'AWS-PUN-09',
    name: 'Pune Western Ghats AgroMet',
    region: 'Maharashtra Deccan',
    lat: 18.5204,
    lng: 73.8567,
    elevationM: 560,
    status: 'NORMAL', // Hero Case 2: Genuine Weather 45°C
    healthScore: 98,
    lastSeen: '1 sec ago',
    batteryPercent: 98,
    solarWatts: 72.4,
    signalSNR: 34.5,
    hardwareModel: 'Campbell CR1000X MicroMet',
    firmwareVersion: 'v5.02.1',
    currentReadings: {
      temperature: 45.4, // Genuine Heatwave
      pressure: 952.1,
      humidity: 19.8,
      windSpeed: 4.8,
      solarIrradiance: 980,
      precipitation: 0.0
    },
    activeAlertCount: 0
  },
  {
    id: 'ST-110',
    code: 'AWS-CHP-10',
    name: 'Cherrapunji Pluviometric Base',
    region: 'Meghalaya Plateau',
    lat: 25.2986,
    lng: 91.7303,
    elevationM: 1484,
    status: 'NORMAL',
    healthScore: 91,
    lastSeen: '3 sec ago',
    batteryPercent: 90,
    solarWatts: 28.0,
    signalSNR: 25.1,
    hardwareModel: 'HydroMet RainMaster Pro',
    firmwareVersion: 'v4.02.0',
    currentReadings: {
      temperature: 22.8,
      pressure: 852.4,
      humidity: 98.2,
      windSpeed: 7.2,
      solarIrradiance: 210,
      precipitation: 34.6 // Extreme Monsoon rainfall
    },
    activeAlertCount: 0
  }
];

export const HERO_ALERT_SPIKE: AnomalyAlert = {
  id: 'ALT-2026-8801',
  stationId: 'ST-104',
  stationName: 'Haridwar Foothills AWS',
  region: 'Uttarakhand Valley',
  parameter: 'TEMPERATURE',
  rawValue: 55.2,
  unit: '°C',
  expectedValue: 28.4,
  rootCause: 'SPIKE',
  severity: 'CRITICAL',
  status: 'CRITICAL',
  weatherVsFault: 'LIKELY_SENSOR_FAULT',
  confidence: 0.968, // 96.8%
  timestamp: 'Just now (14:48:12 IST)',
  humanReadableExplanation: 'Instantaneous temperature jump of +26.8°C within 120 seconds. All 3 regional neighbor stations (ST-101, ST-102, ST-103) report 24.2°C to 28.8°C. Multivariable physical laws violated: relative humidity drop contradicts atmospheric enthalpy equilibrium. Diagnosed as local RTD transducer open-circuit / hardware thermal shield transient fault.',
  recommendedAction: 'Suppress raw 55.2°C value from public forecast feeds. Ingest advisory value 28.4°C into numerical weather prediction (NWP) model. Dispatch field engineer for PT100 RTD sensor replacement & cable grounding check.',
  evidence: {
    temporal: {
      score: 0.98,
      zScore: 5.82,
      rateOfChange: 13.4, // °C/min
      threshold: 1.5,
      description: 'Temporal rate-of-change (+13.4°C/min) exceeds physical maximum thermodynamic limit for mountain foothills (+1.5°C/min).',
      status: 'FAIL'
    },
    statistical: {
      score: 0.96,
      madScore: 6.42,
      distributionPercentile: 99.98,
      description: 'Median Absolute Deviation (MAD) is 6.42σ away from running 24h Gaussian median (28.2°C).',
      status: 'FAIL'
    },
    ml: {
      score: 0.94,
      isolationForestScore: 0.942,
      autoencoderReconLoss: 8.74,
      modelConfidence: 0.96,
      description: 'Autoencoder neural network reconstruction loss is 8.7x above the dynamic alert threshold; Isolation Forest anomaly probability 94.2%.',
      status: 'FAIL'
    },
    spatial: {
      score: 0.97,
      neighborAgreementPercent: 4.2, // only 4.2% agreement
      krigingExpectedVal: 28.4,
      neighbors: [
        { stationId: 'ST-101', name: 'Dehradun Valley AWS', distanceKm: 24.5, observedVal: 28.1, delta: 27.1, status: 'DISAGREE' },
        { stationId: 'ST-103', name: 'Rishikesh Ganga Basin', distanceKm: 18.2, observedVal: 28.8, delta: 26.4, status: 'DISAGREE' },
        { stationId: 'ST-102', name: 'Mussoorie Ridge', distanceKm: 38.6, observedVal: 24.2, delta: 31.0, status: 'DISAGREE' }
      ],
      description: 'Spatial Kriging interpolation predicts 28.4°C (±0.6°C). 0 out of 3 surrounding stations show matching thermal spikes.',
      status: 'FAIL'
    },
    multivariate: {
      score: 0.92,
      dewPointConsistency: false,
      vaporPressureCoherence: false,
      solarThermalCorrelated: false,
      description: 'Severe thermodynamic divergence: Rapid temperature spike without corresponding adiabatic pressure drop or solar flux burst.',
      status: 'FAIL'
    },
    fusion: {
      overallConfidence: 96.8,
      hardConfidence: 99.1,
      softConfidence: 94.5,
      spatialWeight: 0.45,
      finalClassification: 'LIKELY_SENSOR_FAULT',
      verdict: 'Confirmed Sensor Malfunction (Spike Fault). Raw value unsafe for numerical ingestion.'
    }
  },
  correction: {
    originalValue: 55.2,
    suggestedValue: 28.4,
    unit: '°C',
    method: 'Spatial Kriging Interpolation',
    confidence: 97.4,
    provenanceHash: '0x8f2a9c33e14b7218d6a057bf2c08',
    timestamp: '2026-08-27T14:48:12.441Z',
    isAdvisoryOnly: true,
    status: 'ADVISED'
  }
};

export const HERO_ALERT_GENUINE_WEATHER: AnomalyAlert = {
  id: 'ALT-2026-8802',
  stationId: 'ST-109',
  stationName: 'Pune Western Ghats AgroMet',
  region: 'Maharashtra Deccan',
  parameter: 'TEMPERATURE',
  rawValue: 45.4,
  unit: '°C',
  expectedValue: 44.9,
  rootCause: 'GENUINE_WEATHER',
  severity: 'HIGH',
  status: 'SUSPICIOUS',
  weatherVsFault: 'LIKELY_GENUINE_WEATHER',
  confidence: 0.942, // 94.2% genuine
  timestamp: '12 min ago (14:36:00 IST)',
  humanReadableExplanation: 'Extreme temperature reading of 45.4°C recorded during regional synoptic heat dome. 4 adjacent regional stations (Ahmednagar 44.8°C, Solapur 46.1°C, Satara 44.2°C) confirm widespread regional heating. Rate of temperature climb aligns with diurnal solar radiation curve. Thermodynamic consistency verified. System categorized this as Genuine Severe Weather — sensor fault escalation suppressed.',
  recommendedAction: 'DO NOT ESCALATE SENSOR FAULT. Preserve raw 45.4°C reading. Transmit Red Heatwave Alert to State Disaster Management Authority & public health advisories.',
  evidence: {
    temporal: {
      score: 0.22,
      zScore: 2.14,
      rateOfChange: 0.4, // °C/min (normal diurnal)
      threshold: 1.5,
      description: 'Diurnal slope (+0.4°C/10min) is physically smooth and synchronizes with solar noon zenith angle.',
      status: 'PASS'
    },
    statistical: {
      score: 0.65,
      madScore: 2.8,
      distributionPercentile: 98.2,
      description: 'Elevated vs 30-year climatological baseline, but fits regional synoptic heatwave envelope.',
      status: 'WARN'
    },
    ml: {
      score: 0.31,
      isolationForestScore: 0.28,
      autoencoderReconLoss: 1.12,
      modelConfidence: 0.94,
      description: 'Multivariate Autoencoder validates co-movement of solar flux (980 W/m²), ambient pressure (952 hPa), and humidity drop (19.8%).',
      status: 'PASS'
    },
    spatial: {
      score: 0.12,
      neighborAgreementPercent: 94.8, // 94.8% agreement
      krigingExpectedVal: 44.9,
      neighbors: [
        { stationId: 'ST-111', name: 'Ahmednagar IMD AWS', distanceKm: 68.2, observedVal: 44.8, delta: 0.6, status: 'AGREE' },
        { stationId: 'ST-112', name: 'Solapur Synoptic AWS', distanceKm: 114.0, observedVal: 46.1, delta: 0.7, status: 'AGREE' },
        { stationId: 'ST-113', name: 'Satara Valley AWS', distanceKm: 52.4, observedVal: 44.2, delta: 1.2, status: 'AGREE' }
      ],
      description: 'Spatial consensus: 3 of 3 regional neighbors confirm identical extreme heatwave gradient (44.2°C – 46.1°C). Spatial delta < 1.2°C.',
      status: 'PASS'
    },
    multivariate: {
      score: 0.15,
      dewPointConsistency: true,
      vaporPressureCoherence: true,
      solarThermalCorrelated: true,
      description: 'Physical atmospheric laws obeyed: Clausius-Clapeyron vapor pressure and dry adiabatic lapse rates perfectly correlate.',
      status: 'PASS'
    },
    fusion: {
      overallConfidence: 94.2,
      hardConfidence: 98.0,
      softConfidence: 91.5,
      spatialWeight: 0.50,
      finalClassification: 'LIKELY_GENUINE_WEATHER',
      verdict: 'High-confidence Genuine Weather Event (Synoptic Heat Dome). Sensor integrity verified as 100% operational.'
    }
  },
  correction: {
    originalValue: 45.4,
    suggestedValue: 45.4,
    unit: '°C',
    method: 'Neighbor Ensemble Average',
    confidence: 99.1,
    provenanceHash: '0x33b817f09c2a8e449176da5c1109',
    timestamp: '2026-08-27T14:36:00.000Z',
    isAdvisoryOnly: true,
    status: 'ACCEPTED_DOWNSTREAM'
  }
};

export const INITIAL_ALERTS: AnomalyAlert[] = [
  HERO_ALERT_SPIKE,
  HERO_ALERT_GENUINE_WEATHER,
  {
    id: 'ALT-2026-8803',
    stationId: 'ST-105',
    stationName: 'Shimla Central Ridge',
    region: 'Himachal Highlands',
    parameter: 'PRESSURE',
    rawValue: 782.5,
    unit: 'hPa',
    expectedValue: 796.8,
    rootCause: 'DRIFT',
    severity: 'MEDIUM',
    status: 'SUSPICIOUS',
    weatherVsFault: 'LIKELY_SENSOR_FAULT',
    confidence: 0.842,
    timestamp: '42 min ago (14:06:15 IST)',
    humanReadableExplanation: 'Barometric sensor exhibits a persistent downward baseline drift of -0.42 hPa per hour over the last 18 hours, uncorroborated by surrounding mountain stations.',
    recommendedAction: 'Apply Kalman drift compensator advisory. Schedule zero-point barometric recalibration.',
    evidence: {
      temporal: {
        score: 0.78,
        zScore: 3.12,
        rateOfChange: -0.42,
        threshold: 0.2,
        description: 'Monotonic downward drift slope violates static hydrostatic equilibrium.',
        status: 'WARN'
      },
      statistical: {
        score: 0.82,
        madScore: 3.45,
        distributionPercentile: 96.4,
        description: 'Persistent baseline shift detected via CUSUM (cumulative sum) control chart.',
        status: 'FAIL'
      },
      ml: {
        score: 0.81,
        isolationForestScore: 0.81,
        autoencoderReconLoss: 4.12,
        modelConfidence: 0.84,
        description: 'LSTM autoencoder flagged persistent temporal trend mismatch.',
        status: 'FAIL'
      },
      spatial: {
        score: 0.79,
        neighborAgreementPercent: 18.4,
        krigingExpectedVal: 796.8,
        neighbors: [
          { stationId: 'ST-106', name: 'Manali Alpine Pass', distanceKm: 92.4, observedVal: 798.2, delta: 15.7, status: 'DISAGREE' }
        ],
        description: 'Regional barometric field is stable; ST-105 is the sole outlier.',
        status: 'FAIL'
      },
      multivariate: {
        score: 0.65,
        dewPointConsistency: true,
        vaporPressureCoherence: false,
        solarThermalCorrelated: true,
        description: 'Pressure drop occurs without storm precipitation or cloud cover changes.',
        status: 'WARN'
      },
      fusion: {
        overallConfidence: 84.2,
        hardConfidence: 80.0,
        softConfidence: 88.0,
        spatialWeight: 0.40,
        finalClassification: 'LIKELY_SENSOR_FAULT',
        verdict: 'Barometer MEMS Transducer Diaphragm Drift detected.'
      }
    },
    correction: {
      originalValue: 782.5,
      suggestedValue: 796.8,
      unit: 'hPa',
      method: 'Temporal Kalman Spline',
      confidence: 91.2,
      provenanceHash: '0x99e821fa0c345100ba2876ccf105',
      timestamp: '2026-08-27T14:06:15.000Z',
      isAdvisoryOnly: true,
      status: 'ADVISED'
    }
  }
];

export const SENSOR_HEALTH_DATA: Record<string, SensorHealthRecord> = {
  'ST-104': {
    stationId: 'ST-104',
    stationName: 'Haridwar Foothills AWS',
    overallScore: 68,
    trendDirection: 'DEGRADING',
    degradationRatePerMonth: -4.8,
    predictedMTBFDays: 14,
    maintenancePriority: 'URGENT',
    lastCalibrated: '2025-11-14',
    nextCalibrationDue: 'OVERDUE (2026-05-14)',
    subsystems: {
      tempRTD: { score: 42, driftRate: '+0.85°C/mo', noiseFloor: 'High (0.42°C)', status: 'CRITICAL' },
      barometerMEMS: { score: 88, driftRate: '-0.02 hPa/mo', noiseFloor: 'Nominal', status: 'GOOD' },
      hygrometerCapacitive: { score: 71, driftRate: '-1.4% RH/mo', noiseFloor: 'Moderate', status: 'WARN' },
      anemometerSonic: { score: 94, driftRate: '0.0 m/s', noiseFloor: 'Low', status: 'GOOD' },
      powerSystem: { score: 86, batteryHealth: 'Good (88%)', solarEfficiency: '92%', status: 'GOOD' }
    },
    faultHistory: [
      { id: 'FH-901', date: '2026-08-27', faultType: 'SPIKE', parameter: 'TEMPERATURE', durationMinutes: 12, resolvedBy: 'AI Auto-Quarantined' },
      { id: 'FH-842', date: '2026-08-14', faultType: 'NOISE', parameter: 'TEMPERATURE', durationMinutes: 180, resolvedBy: 'Filter Adjusted' },
      { id: 'FH-711', date: '2026-07-02', faultType: 'DROPOUT', parameter: 'HUMIDITY', durationMinutes: 45, resolvedBy: 'Auto Reconnect' }
    ]
  },
  'ST-101': {
    stationId: 'ST-101',
    stationName: 'Dehradun Valley AWS',
    overallScore: 96,
    trendDirection: 'STABLE',
    degradationRatePerMonth: -0.2,
    predictedMTBFDays: 320,
    maintenancePriority: 'OPTIMAL',
    lastCalibrated: '2026-06-10',
    nextCalibrationDue: '2026-12-10 (105 days)',
    subsystems: {
      tempRTD: { score: 98, driftRate: '0.01°C/mo', noiseFloor: 'Clean', status: 'GOOD' },
      barometerMEMS: { score: 97, driftRate: '0.00 hPa/mo', noiseFloor: 'Nominal', status: 'GOOD' },
      hygrometerCapacitive: { score: 95, driftRate: '-0.1% RH/mo', noiseFloor: 'Clean', status: 'GOOD' },
      anemometerSonic: { score: 96, driftRate: '0.0 m/s', noiseFloor: 'Clean', status: 'GOOD' },
      powerSystem: { score: 94, batteryHealth: 'Excellent (94%)', solarEfficiency: '98%', status: 'GOOD' }
    },
    faultHistory: [
      { id: 'FH-650', date: '2026-05-18', faultType: 'DROPOUT', parameter: 'WIND_SPEED', durationMinutes: 10, resolvedBy: 'Solar Reset' }
    ]
  },
  'ST-109': {
    stationId: 'ST-109',
    stationName: 'Pune Western Ghats AgroMet',
    overallScore: 98,
    trendDirection: 'STABLE',
    degradationRatePerMonth: -0.1,
    predictedMTBFDays: 410,
    maintenancePriority: 'OPTIMAL',
    lastCalibrated: '2026-07-01',
    nextCalibrationDue: '2027-01-01 (127 days)',
    subsystems: {
      tempRTD: { score: 99, driftRate: '0.00°C/mo', noiseFloor: 'Clean', status: 'GOOD' },
      barometerMEMS: { score: 98, driftRate: '0.00 hPa/mo', noiseFloor: 'Nominal', status: 'GOOD' },
      hygrometerCapacitive: { score: 97, driftRate: '-0.05% RH/mo', noiseFloor: 'Clean', status: 'GOOD' },
      anemometerSonic: { score: 99, driftRate: '0.0 m/s', noiseFloor: 'Clean', status: 'GOOD' },
      powerSystem: { score: 98, batteryHealth: 'Optimal (98%)', solarEfficiency: '99%', status: 'GOOD' }
    },
    faultHistory: []
  },
  'ST-105': {
    stationId: 'ST-105',
    stationName: 'Shimla Central Ridge',
    overallScore: 79,
    trendDirection: 'DEGRADING',
    degradationRatePerMonth: -2.1,
    predictedMTBFDays: 42,
    maintenancePriority: 'HIGH',
    lastCalibrated: '2026-01-15',
    nextCalibrationDue: '2026-09-15 (19 days)',
    subsystems: {
      tempRTD: { score: 91, driftRate: '+0.04°C/mo', noiseFloor: 'Nominal', status: 'GOOD' },
      barometerMEMS: { score: 58, driftRate: '-0.42 hPa/hr', noiseFloor: 'Drifting', status: 'CRITICAL' },
      hygrometerCapacitive: { score: 84, driftRate: '-0.8% RH/mo', noiseFloor: 'Nominal', status: 'GOOD' },
      anemometerSonic: { score: 89, driftRate: '0.0 m/s', noiseFloor: 'Nominal', status: 'GOOD' },
      powerSystem: { score: 82, batteryHealth: 'Good (82%)', solarEfficiency: '85%', status: 'GOOD' }
    },
    faultHistory: [
      { id: 'FH-810', date: '2026-08-27', faultType: 'DRIFT', parameter: 'PRESSURE', durationMinutes: 1080, resolvedBy: 'Under Investigation' }
    ]
  }
};

export const SYSTEM_SERVICES: SystemService[] = [
  {
    id: 'SVC-01',
    name: 'MQTT / LoRaWAN Ingestion Gateway',
    category: 'Ingestion',
    status: 'HEALTHY',
    latencyMs: 12,
    throughput: '2,480 msg/sec',
    uptime: '99.98%',
    lastHeartbeat: '0.4s ago',
    details: {
      'Active Brokers': 4,
      'Dropped Packets': '0.001%',
      'Buffer Utilization': '14%',
      'Transport Protocol': 'MQTT over TLS 1.3 / gRPC'
    }
  },
  {
    id: 'SVC-02',
    name: 'Physical QC & Hard Boundary Validator',
    category: 'Quality Control',
    status: 'HEALTHY',
    latencyMs: 3.2,
    throughput: '2,480 msg/sec',
    uptime: '100%',
    lastHeartbeat: '0.2s ago',
    details: {
      'Rule Evaluation Engine': 'WMO-No. 8 Standards',
      'Step Rate Violations': '14 flagged / 24h',
      'Climatological Boundary': 'Configured (Active)'
    }
  },
  {
    id: 'SVC-03',
    name: 'TimescaleDB / PostgreSQL Timeseries Cluster',
    category: 'Database',
    status: 'HEALTHY',
    latencyMs: 8.4,
    throughput: '18,200 IOPS',
    uptime: '99.99%',
    lastHeartbeat: '0.8s ago',
    details: {
      'Active Hypertables': 12,
      'Data Compression Ratio': '9.4x (ZSTD)',
      'Storage Allocated': '4.8 TB / 12 TB',
      'Continuous Aggregates': '1m, 5m, 1h materialized'
    }
  },
  {
    id: 'SVC-04',
    name: 'AI/ML Multi-Model Inference Service (PyTorch/ONNX)',
    category: 'ML Engine',
    status: 'HEALTHY',
    latencyMs: 4.6,
    throughput: '620 inferences/sec',
    uptime: '99.95%',
    lastHeartbeat: '0.3s ago',
    details: {
      'Models Loaded': 'Isolation Forest + Variational Autoencoder + LSTM-Transformer',
      'GPU Acceleration': 'NVIDIA TensorRT (Active)',
      'Inference Precision': 'FP16',
      'Model Drift Index (PSI)': '0.014 (Negligible)'
    }
  },
  {
    id: 'SVC-05',
    name: 'Spatial Kriging & Spatial Neighbor Engine',
    category: 'Fusion Engine',
    status: 'HEALTHY',
    latencyMs: 14.1,
    throughput: '340 spatial grids/sec',
    uptime: '99.92%',
    lastHeartbeat: '0.5s ago',
    details: {
      'Spatial Interpolator': 'Ordinary Kriging with Variogram Fitting',
      'Search Radius': '75 km',
      'Min Neighbors Required': 3,
      'Inverse Distance Weighting': 'Fallback enabled'
    }
  },
  {
    id: 'SVC-06',
    name: 'Multi-Pillar Evidence Fusion & Decision Arbiter',
    category: 'Fusion Engine',
    status: 'HEALTHY',
    latencyMs: 6.8,
    throughput: '1,200 fusions/sec',
    uptime: '99.99%',
    lastHeartbeat: '0.1s ago',
    details: {
      'Evidence Weighting': 'Bayesian Fusion + Dempster-Shafer',
      'False Positive Suppression': 'Spatial Agreement Filter (Active)',
      'Advisory Generator': 'Deterministic + Auto-Provenance Signing'
    }
  },
  {
    id: 'SVC-07',
    name: 'SkyGuard Real-time WebSocket Event Bus',
    category: 'Realtime Bus',
    status: 'HEALTHY',
    latencyMs: 18.0,
    throughput: '8,400 events/sec',
    uptime: '99.99%',
    lastHeartbeat: '0.1s ago',
    details: {
      'Connected Clients': 48,
      'Active Subscriptions': 120,
      'Heartbeat Interval': '5000 ms',
      'Zero-Copy Serialization': 'Protocol Buffers / JSON'
    }
  }
];

// Helper to generate realistic 24h telemetry series for charts
export function generateStationTelemetrySeries(
  _stationId: string, 
  baseTemp: number, 
  basePress: number, 
  baseRH: number, 
  hasSpikeAnomaly: boolean = false
): TelemetryReading[] {
  const points: TelemetryReading[] = [];
  const now = Date.now();
  const totalMinutes = 24 * 60; // 24 hours
  const stepMinutes = 15; // 15-min intervals (96 points)

  for (let i = totalMinutes; i >= 0; i -= stepMinutes) {
    const timeMs = now - (i * 60 * 1000);
    const date = new Date(timeMs);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Diurnal temperature curve (peaking around 14:00)
    const hour = date.getHours() + (date.getMinutes() / 60);
    const diurnalFactor = Math.sin(((hour - 8) / 24) * 2 * Math.PI); // peak ~14:00
    
    let temp = baseTemp + (diurnalFactor * 6.0) + (Math.sin(i / 10) * 0.4);
    let press = basePress - (diurnalFactor * 2.5) + (Math.cos(i / 15) * 0.3);
    let rh = Math.max(15, Math.min(95, baseRH - (diurnalFactor * 18.0) + (Math.sin(i / 8) * 2.0)));
    let wind = 3.0 + (Math.abs(Math.sin(i / 5)) * 4.0);
    let solar = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI) * 950);
    let rain = 0.0;

    let isAnomaly = false;
    let anomalyType: any = undefined;
    let confidence: any = undefined;

    // If hero spike is requested on ST-104 in the most recent 15 minutes:
    if (hasSpikeAnomaly && i <= 15) {
      temp = 55.2;
      rh = 12.0;
      isAnomaly = true;
      anomalyType = 'SPIKE';
      confidence = 0.968;
    }

    points.push({
      timestamp: timeStr,
      temperature: parseFloat(temp.toFixed(1)),
      pressure: parseFloat(press.toFixed(1)),
      humidity: parseFloat(rh.toFixed(1)),
      windSpeed: parseFloat(wind.toFixed(1)),
      solarIrradiance: parseFloat(solar.toFixed(0)),
      precipitation: rain,
      isAnomaly,
      anomalyType,
      confidence,
      expectedRanges: {
        tempMin: parseFloat((temp - 2.5).toFixed(1)),
        tempMax: parseFloat((temp + 2.5).toFixed(1)),
        pressMin: parseFloat((press - 3.0).toFixed(1)),
        pressMax: parseFloat((press + 3.0).toFixed(1)),
        rhMin: Math.max(10, parseFloat((rh - 8.0).toFixed(1))),
        rhMax: Math.min(100, parseFloat((rh + 8.0).toFixed(1)))
      }
    });
  }

  return points;
}
