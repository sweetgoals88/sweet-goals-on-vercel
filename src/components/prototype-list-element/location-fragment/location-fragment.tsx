import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import debounce from "lodash.debounce";
import { OnChangeProps } from "../prototype-list-element";
import { LocationOption } from "@/app/api/geocoding/route";
import { API_ENDPOINTS } from "@/app/api/endpoints";

type DisplayLocationOption = {
  label: string;
  value: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
};

const displayFromLocation = (locationOption: LocationOption): DisplayLocationOption => {
    return {
        label: locationOption.locationName,
        value: {
            latitude: locationOption.latitude,
            longitude: locationOption.longitude,
            locationName: locationOption.locationName
        }
    };
}

export default function LocationFragment(props: OnChangeProps<LocationOption>) {
  const [options, setOptions] = useState<DisplayLocationOption[]>([ displayFromLocation(props.props.initialValue) ]);
  const [inputValue, setInputValue] = useState("");

  const fetchLocations = useCallback(
    debounce(async (query: string) => {
      if (!query) return;

      try {
        const response = await fetch(`${API_ENDPOINTS.GEOCODING}?query=${encodeURIComponent(query)}`);
        const data: LocationOption[] = await response.json();

        const formatted = data.map((result) => (displayFromLocation(result)));
        setOptions(formatted);
      } catch (err) {
        console.error("Error fetching geolocation:", err);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchLocations(inputValue);
  }, [inputValue, fetchLocations]);

  const handleChange = (option: DisplayLocationOption | null) => {
    if (option) {
        props.props.onChange(option.value);
    }
  };

  return (
    <div style={{ minWidth: "250px" }}>
      <label style={{ fontSize: "0.9rem" }}>Ubicación</label>
      <Select
        value={displayFromLocation(props.props.initialValue)}
        onInputChange={(value) => setInputValue(value)}
        onChange={handleChange}
        options={options}
        placeholder="Buscar ubicación..."
        isClearable
      />
    </div>
  );
}
