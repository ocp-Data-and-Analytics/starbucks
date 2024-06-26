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

  // Function to handle address selection and update address state
  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setAddressSelected(true);
  };

  useEffect(() => {
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
