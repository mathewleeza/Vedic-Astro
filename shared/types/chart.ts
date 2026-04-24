export interface ChartRequest {
  birth_date: string;
  birth_time: string;
  latitude: number;
  longitude: number;
  timezone: string;
  ayanamsa: string;
  house_system: string;
}

export interface PlanetPosition {
  id: string;
  name: string;
  sign: string;
  sign_num: number;
  degree: number;
  house: number;
  nakshatra: string;
  pada: number;
  is_retrograde: boolean;
  speed: number;
}

export interface ChartResponse {
  meta: {
    ayanamsa: string;
    ayanamsa_value: number;
    house_system: string;
    julian_day: number;
    utc_time: string;
  };
  ascendant: {
    sign: string;
    sign_num: number;
    degree: number;
    nakshatra: string;
    pada: number;
  };
  planets: PlanetPosition[];
  houses: { house: number; sign: string; sign_num: number }[];
  d9: {
    ascendant: { sign: string; degree: number };
    planets: PlanetPosition[];
  };
}

export interface DashaEntry {
  planet: string;
  start: string;
  end: string;
  antardashas?: DashaEntry[];
}

export interface DashaResponse {
  moon_nakshatra: string;
  dasha_balance_at_birth: { planet: string; years_remaining: number };
  mahadashas: DashaEntry[];
}
