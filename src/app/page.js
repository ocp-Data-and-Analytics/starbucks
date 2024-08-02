"use client";

import React, { useState, useEffect } from "react";
import useAddress from "./hooks/useAddress";
import Maps from "./components/Maps";
import StoreList from "./components/StoreList";
import AddrAutoComplete from "./components/Autocomplete";
import MapLoader from "./components/MapLoader";
import axios from "axios";

const Home = () => {
  const [address, setAddress] = useState({
    address1: "",
    city: "",
    state: "",
    zip: "",
  });

  const { location, error } = useAddress(address);
  const [stores, setStores] = useState([]);
  const [addressSelected, setAddressSelected] = useState(false);
  const [data, setData] = useState({});
  // Function to handle address selection and update address state
  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setAddressSelected(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/keys");
      const result = await response.json();
      setData(result);
    };
    console.log("Data from /api/keys:", data);
    console.log(`Current environment: ${process.env.NODE_ENV}`);
    console.log(`Google Maps API Key - updated:, ${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
    console.log(`Current environment: ${process.env.NEXT_PUBLIC_SIMPLETEST}`);
    if (location && addressSelected) {
      axios
        .post("/api/location", {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 10, // radius in miles
        })
        .then((response) => {
          setStores(response.data);
        })
        .catch((error) => {
          console.error("Error fetching stores :", error);
        });
    }
    fetchData();
  }, [location, addressSelected]);

  return (
    <MapLoader>
      <div>
        <h1>Nearest Starbucks</h1>
        <AddrAutoComplete onSelect={handleAddressSelect} /> {/* Pass onSelect prop */}
        <br />
        {error && <p>Error: {error}</p>}
        {!location && <p>Loading...</p>}
        {location && addressSelected && (
          <>
            <Maps center={location} stores={stores} />
            <StoreList stores={stores} />
          </>
        )}
      </div>
    </MapLoader>
  );
};

export default Home;
