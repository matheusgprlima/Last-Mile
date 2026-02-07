export interface EmergencyService {
  name: string;
  /** Phone number (use for tel: link). Omit if only url is used. */
  phone?: string;
  /** Optional link (e.g. global crisis finder). When set, shown as "Visit" instead of "Call". */
  url?: string;
}

export interface CountryEmergencyData {
  countryName: string;
  services: EmergencyService[];
}

/** Global crisis/suicide finder — show when country has no line or as fallback (e.g. Gaza, conflict). */
export const GLOBAL_CRISIS_SERVICE: EmergencyService = {
  name: "Crisis & suicide prevention (find your country)",
  url: "https://findahelpline.com"
};

export const EMERGENCY_CONTACTS: Record<string, CountryEmergencyData> = {
  "US": {
    countryName: "United States",
    services: [
      { name: "Emergency (Police/Fire/Ambulance)", phone: "911" },
      { name: "Suicide & Crisis Lifeline", phone: "988" }
    ]
  },
  "BR": {
    countryName: "Brazil",
    services: [
      { name: "SAMU (Ambulância)", phone: "192" },
      { name: "CVV (Prevenção ao Suicídio)", phone: "188" }
    ]
  },
  "IR": {
    countryName: "Iran",
    services: [
      { name: "Emergency", phone: "123" },
      { name: "Iran Crisis (chat / emotional support)", url: "https://irancrisisline.org" },
      { name: "Yara's Voice (youth)", phone: "42152" }
    ]
  },
  "PS": {
    countryName: "Gaza / Palestine",
    services: [
      { name: "Ambulance", phone: "101" },
      { name: "Police", phone: "100" },
      { name: "Sawa (crisis / suicide prevention)", phone: "164" },
      { name: "Sawa (alternative)", phone: "121" }
    ]
  },
  "UA": {
    countryName: "Ukraine",
    services: [
      { name: "Emergency", phone: "112" },
      { name: "Psychological support (NPAU)", phone: "0-800-100-102" }
    ]
  },
  "VE": {
    countryName: "Venezuela",
    services: [
      { name: "Emergency", phone: "911" },
      { name: "Línea de Ayuda Psicológica (LAPSI)", phone: "04242907338" },
      { name: "AVES (suicide prevention)", phone: "+582125501500" }
    ]
  },
  "GLOBAL": {
    countryName: "Global / Other",
    services: [
      { name: "Emergency (where available)", phone: "112" },
      { name: "Crisis & suicide prevention (find your country)", url: "https://findahelpline.com" }
    ]
  }
};