export interface Finding {
  text: string;
  attributed_to: string[];
}

export interface AnalysisSection {
  title: string;
  findings: Finding[];
}

export interface Yoga {
  name: string;
  present: boolean;
  conditions_met: string;
  effect: string;
}

export interface AnalysisResponse {
  personality: {
    summary: string;
    sections: AnalysisSection[];
  };
  timing: {
    current_dasha: {
      mahadasha: string;
      antardasha: string;
      start: string;
      end: string;
      interpretation: string;
    };
    upcoming_dashas: any[];
    current_transits: {
      planet: string;
      transiting_over: string;
      interpretation: string;
    }[];
  };
  yogas: Yoga[];
}
