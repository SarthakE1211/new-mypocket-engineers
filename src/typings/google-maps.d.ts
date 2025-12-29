declare namespace google.maps {
    // Only declare the parts you actually use
  
    interface AutocompleteSessionToken {}
    
    interface LatLng {
      lat(): number;
      lng(): number;
    }
  
    interface Place {
      fetchFields(options: { fields: string[] }): Promise<void>;
      displayName: string;
      formattedAddress: string;
    }
  
    interface PlacePrediction {
      text: string;
      toPlace(): Place;
    }
  
    interface AutocompleteSuggestion {
      placePrediction: PlacePrediction;
    }
  
    interface AutocompleteSuggestionConstructor {
      fetchAutocompleteSuggestions(
        request: {
          input: string;
          locationRestriction?: {
            west: number;
            north: number;
            east: number;
            south: number;
          };
          origin?: { lat: number; lng: number };
          includedPrimaryTypes?: string[];
          language?: string;
          region?: string;
          sessionToken?: AutocompleteSessionToken;
        }
      ): Promise<{ suggestions: AutocompleteSuggestion[] }>;
    }
  
    var AutocompleteSuggestion: AutocompleteSuggestionConstructor;
    var AutocompleteSessionToken: {
      new (): AutocompleteSessionToken;
    };
  }
  