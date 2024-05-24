// hooks/useGeolocation.js
import { useState, useEffect } from "react";
import axios from "axios";

const useAddress = ({ address1, address2 = "", city, state, zip, country = "US" }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const address = `${address1} ${address2} ${city} ${state} ${zip} ${country}`.trim();
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Ensure this is set in your .env.local file

      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            address: address,
            key: apiKey,
          },
        });

        const data = response.data;
        if (data.status === "OK") {
          const { lat, lng } = data.results[0].geometry.location;
          setLocation({ latitude: lat, longitude: lng });
        } else {
          setError("Unable to fetch coordinates for the provided address");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCoordinates();
  }, [address1, address2, city, state, zip, country]);

  return { location, error };
};

export default useAddress;
