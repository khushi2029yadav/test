import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  Station, 
  AnomalyAlert, 
  PageId, 
  FaultInjectionConfig, 
  PipelineStep, 
  ChatMessage 
} from '../types';
import { 
  INITIAL_STATIONS, 
  INITIAL_ALERTS, 
  HERO_ALERT_SPIKE, 
  HERO_ALERT_GENUINE_WEATHER 
} from '../data/mockData';

export interface ToastItem {
  id: string;
  type: 'CRITICAL_ANOMALY' | 'GENUINE_WEATHER' | 'SYSTEM' | 'SUCCESS';
  title: string;
  message: string;
  stationId?: string;
  alertId?: string;
  timestamp: string;
}

interface SkyGuardContextType {
  // Navigation & Page State
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  
  // Stations
  stations: Station[];
  selectedStationId: string;
  selectedStation: Station;
  setSelectedStationId: (id: string) => void;
  
  // Alerts
  alerts: AnomalyAlert[];
  selectedAlertId: string;
  selectedAlert: AnomalyAlert | undefined;
  setSelectedAlertId: (id: string) => void;
  resolveAlert: (id: string) => void;
  acceptCorrectionAdvisory: (alertId: string) => void;

  // Real-time & WebSocket
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  streamSpeed: number;
  setStreamSpeed: (speed: number) => void;
  connectionState: 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';
  setConnectionState: (state: 'CONNECTED' | 'RECONNECTING' | 'OFFLINE') => void;
  latencyMs: number;
  lastUpdated: string;
  
  // Toasts
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
  addToast: (toast: Omit<ToastItem, 'id' | 'timestamp'>) => void;

  // Simulator & Pipeline
  pipelineSteps: PipelineStep[];
  isPipelineActive: boolean;
  injectFault: (config: FaultInjectionConfig) => Promise<void>;
  resetToDefaultState: () => void;

  // Guided SIH Demo Tour (Steps 1 to 11)
  demoStep: number;
  isTourActive: boolean;
  setIsTourActive: (active: boolean) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  goToDemoStep: (step: number) => void;

  // SkyGuard AI Copilot
  copilotMessages: ChatMessage[];
  sendCopilotMessage: (promptText: string) => void;
  isCopilotTyping: boolean;
  isAssistantDrawerOpen: boolean;
  setIsAssistantDrawerOpen: (open: boolean) => void;

  // Quick Station Drawer
  isStationDrawerOpen: boolean;
  setIsStationDrawerOpen: (open: boolean) => void;
}

const SkyGuardContext = createContext<SkyGuardContextType | undefined>(undefined);

const DEFAULT_PIPELINE_STEPS: PipelineStep[] = [
  { id: 'step-1', name: 'Ingested', label: '1. Raw Ingestion', status: 'COMPLETED', latencyMs: 2, outputSummary: 'CRC32 Verified • MQTT/gRPC Buffer Ingested', timestamp: '14:48:12.012' },
  { id: 'step-2', name: 'QC', label: '2. Physical QC', status: 'FLAGGED', latencyMs: 3, outputSummary: 'WMO Boundary Violated: +13.4°C/min rate of change', timestamp: '14:48:12.015' },
  { id: 'step-3', name: 'Features', label: '3. Feature Eng', status: 'COMPLETED', latencyMs: 5, outputSummary: 'Z-score: 5.82σ • Diurnal baseline delta: +26.8°C', timestamp: '14:48:12.020' },
  { id: 'step-4', name: 'ML', label: '4. ML Models', status: 'FLAGGED', latencyMs: 8, outputSummary: 'Autoencoder Loss: 8.74 • Isolation Forest: 0.942', timestamp: '14:48:12.028' },
  { id: 'step-5', name: 'Spatial', label: '5. Spatial Kriging', status: 'FLAGGED', latencyMs: 14, outputSummary: '3 Neighbours Disagree (Δ > 26.4°C) • IDW: 28.4°C', timestamp: '14:48:12.042' },
  { id: 'step-6', name: 'Fusion', label: '6. Evidence Fusion', status: 'FLAGGED', latencyMs: 6, outputSummary: 'Confidence: 96.8% • Root Cause: SPIKE (Sensor Fault)', timestamp: '14:48:12.048' },
  { id: 'step-7', name: 'Alert', label: '7. Alert Dispatch', status: 'COMPLETED', latencyMs: 4, outputSummary: 'CRITICAL Alert ALT-2026-8801 Generated', timestamp: '14:48:12.052' },
  { id: 'step-8', name: 'WebSocket', label: '8. Realtime Stream', status: 'COMPLETED', latencyMs: 2, outputSummary: 'Broadcasted to 48 active WebSocket clients', timestamp: '14:48:12.054' }
];

export const SkyGuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [selectedStationId, setSelectedStationId] = useState<string>('ST-104');
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(INITIAL_ALERTS);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('ALT-2026-8801');
  
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1);
  const [connectionState, setConnectionState] = useState<'CONNECTED' | 'RECONNECTING' | 'OFFLINE'>('CONNECTED');
  const [latencyMs, setLatencyMs] = useState<number>(24);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  
  const [toasts, setToasts] = useState<ToastItem[]>([
    {
      id: 'toast-init',
      type: 'CRITICAL_ANOMALY',
      title: 'CRITICAL SENSOR ANOMALY',
      message: 'ST-104 • Haridwar Foothills • Temperature Spike +26.8°C • Confidence 96.8%',
      stationId: 'ST-104',
      alertId: 'ALT-2026-8801',
      timestamp: '14:48:12'
    }
  ]);

  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(DEFAULT_PIPELINE_STEPS);
  const [isPipelineActive, setIsPipelineActive] = useState<boolean>(false);

  // Guided SIH Tour
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isTourActive, setIsTourActive] = useState<boolean>(true);

  // Drawers
  const [isStationDrawerOpen, setIsStationDrawerOpen] = useState<boolean>(false);
  const [isAssistantDrawerOpen, setIsAssistantDrawerOpen] = useState<boolean>(false);

  // AI Copilot Messages
  const [copilotMessages, setCopilotMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      content: "👋 Hello, I am SkyGuard AI Intelligence Copilot. I am actively monitoring 10 telemetry stations across the network.\n\nCurrently, **ST-104 (Haridwar Foothills)** has been flagged with a **CRITICAL SPIKE (55.2°C)**. How can I assist with your meteorological quality control today?",
      timestamp: '14:48:15',
      stationContextId: 'ST-104',
      alertContextId: 'ALT-2026-8801',
      suggestedActions: [
        { label: 'Why was ST-104 flagged?', actionType: 'NAVIGATE', payload: 'alert-detail' },
        { label: 'Compare with ST-101 & ST-103', actionType: 'NAVIGATE', payload: 'analytics' },
        { label: 'Inspect sensor health history', actionType: 'NAVIGATE', payload: 'health' }
      ]
    }
  ]);
  const [isCopilotTyping, setIsCopilotTyping] = useState<boolean>(false);

  const selectedStation = stations.find(s => s.id === selectedStationId) || stations[0];
  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

  const addToast = useCallback((toast: Omit<ToastItem, 'id' | 'timestamp'>) => {
    const id = 'toast-' + Math.random().toString(36).substr(2, 9);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newToast: ToastItem = { ...toast, id, timestamp: now };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Real-time streaming simulation effect
  useEffect(() => {
    if (!isStreaming || connectionState !== 'CONNECTED') return;

    const intervalTime = Math.max(1000, 3000 / streamSpeed);

    const interval = setInterval(() => {
      // Jitter latency slightly (18ms - 32ms)
      setLatencyMs(Math.floor(18 + Math.random() * 14));
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // Slight natural micro-variations for normal stations
      setStations(prev => prev.map(station => {
        if (station.status === 'ANOMALY') return station; // preserve anomaly state until resolved or injected

        const tempJitter = (Math.random() - 0.5) * 0.2;
        const pressJitter = (Math.random() - 0.5) * 0.1;
        const rhJitter = (Math.random() - 0.5) * 0.4;
        const windJitter = (Math.random() - 0.5) * 0.3;

        return {
          ...station,
          lastSeen: '1 sec ago',
          currentReadings: {
            ...station.currentReadings,
            temperature: parseFloat((station.currentReadings.temperature + tempJitter).toFixed(1)),
            pressure: parseFloat((station.currentReadings.pressure + pressJitter).toFixed(1)),
            humidity: Math.max(10, Math.min(100, parseFloat((station.currentReadings.humidity + rhJitter).toFixed(1)))),
            windSpeed: Math.max(0, parseFloat((station.currentReadings.windSpeed + windJitter).toFixed(1)))
          }
        };
      }));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed, connectionState]);

  // Inject Fault Function with animated pipeline execution
  const injectFault = useCallback(async (config: FaultInjectionConfig) => {
    setIsPipelineActive(true);

    const targetStation = stations.find(s => s.id === config.stationId) || stations[0];
    const faultType = config.faultType;

    // Reset pipeline steps to 'PROCESSING' sequence
    setPipelineSteps(prev => prev.map(step => ({ ...step, status: 'PROCESSING', outputSummary: 'Evaluating telemetry stream...' })));

    // Step-by-step pipeline execution
    const delays = [200, 350, 500, 700, 900, 1100, 1300, 1500];

    // Pipeline Step 1: Ingestion
    setTimeout(() => {
      setPipelineSteps(prev => prev.map((s, idx) => idx === 0 ? {
        ...s,
        status: 'COMPLETED',
        outputSummary: `Ingested ${config.stationId} • Payload: ${config.parameter} = ${config.customValue ?? '55.2'}`,
        timestamp: new Date().toISOString().substring(11, 23)
      } : s));
    }, delays[0]);

    // Pipeline Step 2: Physical QC
    setTimeout(() => {
      setPipelineSteps(prev => prev.map((s, idx) => idx === 1 ? {
        ...s,
        status: faultType === 'GENUINE_WEATHER' ? 'COMPLETED' : 'FLAGGED',
        outputSummary: faultType === 'GENUINE_WEATHER' 
          ? 'Physical bounds acceptable (Synoptic scale heatwave)' 
          : `Physical step limit violated (+${(config.severityPercent * 0.3).toFixed(1)}/min)`,
        timestamp: new Date().toISOString().substring(11, 23)
      } : s));
    }, delays[1]);

    // Pipeline Step 3: Feature Engineering
    setTimeout(() => {
      setPipelineSteps(prev => prev.map((s, idx) => idx === 2 ? {
        ...s,
        status: 'COMPLETED',
        outputSummary: `Extracted rolling Z-score (${(config.severityPercent / 18).toFixed(2)}σ) & Diurnal FFT harmonics`,
        timestamp: new Date().toISOString().substring(11, 23)
      } : s));
    }, delays[2]);

    // Pipeline Step 4: ML Inference
    setTimeout(() => {
      setPipelineSteps(prev => prev.map((s, idx) => idx === 3 ? {
        ...s,
        status: faultType === 'GENUINE_WEATHER' ? 'COMPLETED' : 'FLAGGED',
        outputSummary: faultType === 'GENUINE_WEATHER'
          ? 'Autoencoder reconstruction error: 1.12 (Within tolerance)'
          : `Isolation Forest Score: 0.94 • Autoencoder Loss: ${(config.severityPercent / 12).toFixed(2)}`,
        timestamp: new Date().toISOString().substring(11, 23)
      } : s));
    }, delays[3]);

    // Pipeline Step 5: Spatial Neighbor Kriging
    setTimeout(() => {
      setPipelineSteps(prev => prev.map((s, idx) => idx === 4 ? {
        ...s,
        status: faultType === 'GENUINE_WEATHER' ? 'COMPLETED' : 'FLAGGED',
        outputSummary: faultType === 'GENUINE_WEATHER'
          ? 'Spatial Consensus: 3 of 3 neighbours agree (Heat dome confirmed)'
          : `Spatial Disagreement: Neighbours average 28.2°C (Local delta: +${(config.severityPercent * 0.28).toFixed(1)}°C)`,
        timestamp: new Date().toISOString().substring(11, 23)
      } : s));
    }, delays[4]);

    // Pipeline Step 6: Multi-Pillar Evidence Fusion
    setTimeout(() => {
      setPipelineSteps(prev => prev.map((s, idx) => idx === 5 ? {
        ...s,
        status: faultType === 'GENUINE_WEATHER' ? 'COMPLETED' : 'FLAGGED',
        outputSummary: faultType === 'GENUINE_WEATHER'
          ? 'Fusion Confidence: 94.2% GENUINE WEATHER • Suppress Sensor Escalation'
          : `Fusion Confidence: 96.8% ${faultType} Sensor Malfunction`,
        timestamp: new Date().toISOString().substring(11, 23)
      } : s));
    }, delays[5]);

    // Pipeline Step 7: Alert Engine
    setTimeout(() => {
      const isGenuine = faultType === 'GENUINE_WEATHER';
      const alertId = 'ALT-' + Date.now().toString().slice(-6);

      const injectedValue = config.customValue ?? (
        config.parameter === 'TEMPERATURE' ? (isGenuine ? 45.4 : 55.2) :
        config.parameter === 'PRESSURE' ? 782.5 :
        config.parameter === 'HUMIDITY' ? 99.8 : 45.0
      );

      const newAlert: AnomalyAlert = {
        id: alertId,
        stationId: config.stationId,
        stationName: targetStation.name,
        region: targetStation.region,
        parameter: config.parameter,
        rawValue: injectedValue,
        unit: config.parameter === 'TEMPERATURE' ? '°C' : config.parameter === 'PRESSURE' ? 'hPa' : '%',
        expectedValue: isGenuine ? 44.9 : 28.4,
        rootCause: faultType,
        severity: isGenuine ? 'HIGH' : 'CRITICAL',
        status: isGenuine ? 'SUSPICIOUS' : 'CRITICAL',
        weatherVsFault: isGenuine ? 'LIKELY_GENUINE_WEATHER' : 'LIKELY_SENSOR_FAULT',
        confidence: isGenuine ? 0.942 : 0.968,
        timestamp: 'Just now',
        humanReadableExplanation: isGenuine
          ? `Extreme ${config.parameter} observation of ${injectedValue}°C supported by 3 adjacent stations during regional synoptic heat event.`
          : `Rapid ${faultType} fault injected on ${config.stationId}. Spatial Kriging and Autoencoder divergence indicate sensor hardware defect.`,
        recommendedAction: isGenuine
          ? 'Preserve raw value. Transmit synoptic heatwave advisory.'
          : 'Suppress raw observation from forecast grids. Ingest spatial advisory value 28.4°C.',
        evidence: isGenuine ? HERO_ALERT_GENUINE_WEATHER.evidence : HERO_ALERT_SPIKE.evidence,
        correction: {
          originalValue: injectedValue,
          suggestedValue: isGenuine ? injectedValue : 28.4,
          unit: config.parameter === 'TEMPERATURE' ? '°C' : 'hPa',
          method: isGenuine ? 'Neighbor Ensemble Average' : 'Spatial Kriging Interpolation',
          confidence: 97.4,
          provenanceHash: '0x' + Math.random().toString(16).substr(2, 28),
          timestamp: new Date().toISOString(),
          isAdvisoryOnly: true,
          status: isGenuine ? 'ACCEPTED_DOWNSTREAM' : 'ADVISED'
        }
      };

      setAlerts(prev => [newAlert, ...prev]);
      setSelectedAlertId(alertId);

      // Update station reading and state
      setStations(prev => prev.map(s => {
        if (s.id === config.stationId) {
          return {
            ...s,
            status: isGenuine ? 'NORMAL' : 'ANOMALY',
            healthScore: isGenuine ? s.healthScore : Math.max(45, s.healthScore - 18),
            activeAlertCount: s.activeAlertCount + 1,
            recentFaultType: faultType,
            currentReadings: {
              ...s.currentReadings,
              temperature: config.parameter === 'TEMPERATURE' ? injectedValue : s.currentReadings.temperature,
              pressure: config.parameter === 'PRESSURE' ? injectedValue : s.currentReadings.pressure,
              humidity: config.parameter === 'HUMIDITY' ? injectedValue : s.currentReadings.humidity,
            }
          };
        }
        return s;
      }));

      setPipelineSteps(prev => prev.map((s, idx) => idx === 6 ? {
        ...s,
        status: 'COMPLETED',
        outputSummary: `Dispatched ${newAlert.severity} Alert ${alertId}`,
        timestamp: new Date().toISOString().substring(11, 23)
      } : s));

      // Pop toast
      addToast({
        type: isGenuine ? 'GENUINE_WEATHER' : 'CRITICAL_ANOMALY',
        title: isGenuine ? 'GENUINE REGIONAL WEATHER DETECTED' : `NEW ANOMALY • ${config.stationId} • ${faultType}`,
        message: `${targetStation.name} • ${config.parameter} = ${injectedValue} • Confidence ${(newAlert.confidence * 100).toFixed(1)}%`,
        stationId: config.stationId,
        alertId: alertId
      });
    }, delays[6]);

    // Pipeline Step 8: WebSocket Broadcast
    setTimeout(() => {
      setPipelineSteps(prev => prev.map((s, idx) => idx === 7 ? {
        ...s,
        status: 'COMPLETED',
        outputSummary: 'Realtime map, charts, and telemetry refreshed without reload',
        timestamp: new Date().toISOString().substring(11, 23)
      } : s));
      setIsPipelineActive(false);
    }, delays[7]);

  }, [stations, addToast]);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED' } : a));
    
    // Normalize station
    const targetAlert = alerts.find(a => a.id === alertId);
    if (targetAlert) {
      setStations(prev => prev.map(s => {
        if (s.id === targetAlert.stationId) {
          return {
            ...s,
            status: 'NORMAL',
            healthScore: Math.min(96, s.healthScore + 15),
            activeAlertCount: Math.max(0, s.activeAlertCount - 1),
            currentReadings: {
              ...s.currentReadings,
              temperature: 28.4 // restored to kriging baseline
            }
          };
        }
        return s;
      }));
    }

    addToast({
      type: 'SUCCESS',
      title: 'ALERT RESOLVED & SENSOR NORMALIZED',
      message: `Alert ${alertId} marked as resolved. Normal telemetry baseline restored.`
    });
  }, [alerts, addToast]);

  const acceptCorrectionAdvisory = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          correction: {
            ...a.correction,
            status: 'ACCEPTED_DOWNSTREAM'
          }
        };
      }
      return a;
    }));

    addToast({
      type: 'SUCCESS',
      title: 'ADVISORY VALUE ACCEPTED',
      message: 'Suggested spatial kriging value routed to downstream numerical models. Raw observation preserved in raw audit vault.'
    });
  }, [addToast]);

  const resetToDefaultState = useCallback(() => {
    setStations(INITIAL_STATIONS);
    setAlerts(INITIAL_ALERTS);
    setSelectedStationId('ST-104');
    setSelectedAlertId('ALT-2026-8801');
    setPipelineSteps(DEFAULT_PIPELINE_STEPS);
    addToast({
      type: 'SYSTEM',
      title: 'SYSTEM RESTORED',
      message: 'Reset to initial SIH Hero scenario with ST-104 Spike & ST-109 Heatwave.'
    });
  }, [addToast]);

  // Guided SIH Demo Tour Handlers
  const goToDemoStep = useCallback((step: number) => {
    setDemoStep(step);
    
    switch (step) {
      case 1: // Open Dashboard
        setCurrentPage('dashboard');
        break;
      case 2: // Open ST-104
        setSelectedStationId('ST-104');
        setCurrentPage('station-detail');
        break;
      case 3: // Inject temperature spike
        setCurrentPage('simulator');
        break;
      case 4: // Watch live update
        setCurrentPage('dashboard');
        break;
      case 5: // Open alert
        setSelectedAlertId('ALT-2026-8801');
        setCurrentPage('alert-detail');
        break;
      case 6: // Open evidence
        setSelectedAlertId('ALT-2026-8801');
        setCurrentPage('alert-detail');
        break;
      case 7: // Show fusion
        setSelectedAlertId('ALT-2026-8801');
        setCurrentPage('alert-detail');
        break;
      case 8: // Ask AI why
        setIsAssistantDrawerOpen(true);
        break;
      case 9: // Show correction
        setCurrentPage('alert-detail');
        break;
      case 10: // Trigger genuine weather case
        setSelectedStationId('ST-109');
        setSelectedAlertId('ALT-2026-8802');
        setCurrentPage('dashboard');
        break;
      case 11: // Open health
        setSelectedStationId('ST-104');
        setCurrentPage('health');
        break;
      default:
        break;
    }
  }, []);

  const nextDemoStep = useCallback(() => {
    const next = demoStep < 11 ? demoStep + 1 : 1;
    goToDemoStep(next);
  }, [demoStep, goToDemoStep]);

  const prevDemoStep = useCallback(() => {
    const prev = demoStep > 1 ? demoStep - 1 : 11;
    goToDemoStep(prev);
  }, [demoStep, goToDemoStep]);

  // AI Copilot Interaction
  const sendCopilotMessage = useCallback((promptText: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stationContextId: selectedStationId,
      alertContextId: selectedAlertId
    };

    setCopilotMessages(prev => [...prev, userMsg]);
    setIsCopilotTyping(true);

    setTimeout(() => {
      let replyContent = "";
      let snippets: any[] = [];
      let suggestedActions: any[] = [];

      const lower = promptText.toLowerCase();

      if (lower.includes('why') || lower.includes('flagged') || lower.includes('spike')) {
        replyContent = `### Anomaly Root Cause Analysis for ${selectedStation.id} (${selectedStation.name})\n\n**ST-104** was flagged with a **CRITICAL SPIKE (55.2°C)** at 14:48:12 IST.\n\nHere is the multi-pillar evidence breakdown:\n1. **Temporal Anomaly (Rate-of-Change)**: Instantaneous jump of **+26.8°C within 120s** (Z-Score: **5.82σ**). This exceeds physical mountain foothills maximum limits (+1.5°C/min).\n2. **Spatial Disagreement**: Surrounding stations **ST-101 (Dehradun: 28.1°C)**, **ST-103 (Rishikesh: 28.8°C)**, and **ST-102 (Mussoorie: 24.2°C)** report stable baselines. Agreement index is only **4.2%**.\n3. **Multivariate Thermodynamic Violation**: Ambient Relative Humidity abruptly dropped to 12.0% without matching enthalpy or solar radiation changes.\n4. **ML Autoencoder Loss**: Reconstruction loss **8.74x** above threshold.\n\n**Final Fusion Verdict**: 96.8% Confidence in **Local RTD Sensor Hardware Malfunction**.`;
        
        snippets = [
          { pillar: 'Temporal', detail: '+13.4°C/min (Limit: 1.5°C/min)', badge: 'FAIL' },
          { pillar: 'Spatial', detail: 'Neighbours agree 4.2% (Kriging: 28.4°C)', badge: 'FAIL' },
          { pillar: 'ML Model', detail: 'Isolation Forest 94.2% anomaly probability', badge: 'FAIL' }
        ];

        suggestedActions = [
          { label: 'View 5-Pillar Evidence', actionType: 'NAVIGATE', payload: 'alert-detail' },
          { label: 'Accept Kriging Advisory (28.4°C)', actionType: 'APPLY_CORRECTION', payload: 'ALT-2026-8801' },
          { label: 'Dispatch Field Engineer', actionType: 'DISPATCH_TECH', payload: 'ST-104' }
        ];
      } else if (lower.includes('genuine') || lower.includes('weather') || lower.includes('heatwave')) {
        replyContent = `### Genuine Weather vs Sensor Fault Evaluation\n\nUnlike sensor faults which show local spatial isolation, **genuine extreme weather events** (such as synoptic heatwaves or convective squalls) display strong **spatial neighbor agreement** and **thermodynamic physical coherence**.\n\n**Example: Station ST-109 (Pune Western Ghats - 45.4°C)**\n- **Neighbor Confirmation**: Ahmednagar (44.8°C), Solapur (46.1°C), and Satara (44.2°C) all corroborate the synoptic heat dome (94.8% spatial consensus).\n- **Diurnal Coherence**: Gradual climb of +0.4°C/10min aligned with peak solar noon zenith.\n- **System Action**: Sensor fault escalation was **SUPPRESSED**, raw reading preserved, and weather advisory published.`;

        snippets = [
          { pillar: 'Spatial Consensus', detail: '94.8% agreement across 3 regional AWS', badge: 'PASS' },
          { pillar: 'Diurnal Solar Curve', detail: 'Synchronized with 980 W/m² irradiance', badge: 'PASS' }
        ];

        suggestedActions = [
          { label: 'Inspect Pune ST-109 Heatwave Case', actionType: 'NAVIGATE', payload: 'dashboard' }
        ];
      } else if (lower.includes('healthy') || lower.includes('health') || lower.includes('maintenance')) {
        replyContent = `### Sensor Subsystem Health Report: ${selectedStation.id}\n\n- **Overall Station Health Score**: **${selectedStation.healthScore}/100**\n- **Temperature RTD Sensor**: **42/100 (CRITICAL)** — Rapid drift detected (+0.85°C/mo) and intermittent open circuit.\n- **Barometer MEMS**: **88/100 (GOOD)** — Baseline stable.\n- **Hygrometer Capacitive**: **71/100 (WARN)** — Calibration overdue by 105 days.\n- **Power Subsystem**: **86/100** (Battery: 88%, Solar: 42.5W).\n- **Predicted MTBF**: **14 Days until catastrophic failure**.\n\n**Recommendation**: Generate urgent maintenance ticket for PT100 RTD module replacement.`;
        
        snippets = [
          { pillar: 'RTD Sensor', detail: 'Score 42/100 • Critical Drift', badge: 'CRITICAL' },
          { pillar: 'MTBF', detail: '14 Days remaining', badge: 'URGENT' }
        ];

        suggestedActions = [
          { label: 'Open Sensor Health Dashboard', actionType: 'NAVIGATE', payload: 'health' }
        ];
      } else if (lower.includes('action') || lower.includes('what should i do')) {
        replyContent = `### Recommended Operational Actions for ${selectedStation.id}\n\n1. **Quarantine Raw Observation**: Suppress the 55.2°C temperature reading from public forecasts and downstream NWP models.\n2. **Apply Spatial Advisory**: Inject the Kriging reconstruction value (**28.4°C**) into the numerical grid.\n3. **Preserve Raw Value**: Raw observation 55.2°C is cryptographically signed and stored in the audit vault with hash \`0x8f2a9c33e14b7218d6a057bf2c08\`.\n4. **Generate Maintenance Ticket**: Dispatch field maintenance team to inspect Haridwar AWS PT100 probe connection and radiation shield.`;

        suggestedActions = [
          { label: 'Accept Advisory (28.4°C)', actionType: 'APPLY_CORRECTION', payload: 'ALT-2026-8801' },
          { label: 'Dispatch Field Engineer', actionType: 'DISPATCH_TECH', payload: 'ST-104' }
        ];
      } else {
        replyContent = `### SkyGuard Telemetry Copilot Analysis\n\nI am continuously analyzing the 10 AWS stations in the network using our 5-pillar fusion engine:\n- **Temporal**: Rate-of-change and sudden inflection checks\n- **Statistical**: Robust Z-Score, MAD, and CUSUM\n- **ML Inference**: Isolation Forest & LSTM Autoencoder reconstruction\n- **Spatial Kriging**: Cross-station validation with neighboring AWS nodes\n- **Multivariate Consistency**: Psychrometric and thermodynamic physical constraints\n\nHow else can I assist with your meteorological data quality workflow?`;
        
        suggestedActions = [
          { label: 'Why was ST-104 flagged?', actionType: 'NAVIGATE', payload: 'alert-detail' },
          { label: 'Show recent anomalies', actionType: 'NAVIGATE', payload: 'alerts' },
          { label: 'Open Sensor Health', actionType: 'NAVIGATE', payload: 'health' }
        ];
      }

      const assistantMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stationContextId: selectedStationId,
        alertContextId: selectedAlertId,
        evidenceSnippets: snippets,
        suggestedActions: suggestedActions
      };

      setCopilotMessages(prev => [...prev, assistantMsg]);
      setIsCopilotTyping(false);
    }, 600);
  }, [selectedStationId, selectedAlertId, selectedStation]);

  return (
    <SkyGuardContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        stations,
        selectedStationId,
        selectedStation,
        setSelectedStationId,
        alerts,
        selectedAlertId,
        selectedAlert,
        setSelectedAlertId,
        resolveAlert,
        acceptCorrectionAdvisory,
        isStreaming,
        setIsStreaming,
        streamSpeed,
        setStreamSpeed,
        connectionState,
        setConnectionState,
        latencyMs,
        lastUpdated,
        toasts,
        dismissToast,
        addToast,
        pipelineSteps,
        isPipelineActive,
        injectFault,
        resetToDefaultState,
        demoStep,
        isTourActive,
        setIsTourActive,
        nextDemoStep,
        prevDemoStep,
        goToDemoStep,
        copilotMessages,
        sendCopilotMessage,
        isCopilotTyping,
        isAssistantDrawerOpen,
        setIsAssistantDrawerOpen,
        isStationDrawerOpen,
        setIsStationDrawerOpen
      }}
    >
      {children}
    </SkyGuardContext.Provider>
  );
};

export const useSkyGuard = () => {
  const context = useContext(SkyGuardContext);
  if (!context) {
    throw new Error('useSkyGuard must be used within a SkyGuardProvider');
  }
  return context;
};
