export interface EmergencyService {
  name: string;
  phone: string;
}

export interface CountryEmergencyData {
  countryName: string;
  services: EmergencyService[];
}

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
      { name: "CVV (Suicide Prevention)", phone: "188" }
    ]
  },
  "GLOBAL": {
    countryName: "Global / Universal",
    services: [
      { name: "Emergency (GSM Standard)", phone: "112" }
    ]
  }
};