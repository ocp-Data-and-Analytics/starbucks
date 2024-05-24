import React from "react";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"]; // Define the libraries array outside the component

const MapLoader = ({ children }) => (
  <LoadScript
    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    libraries={libraries}
    loadingElement={<div>Loading...</div>}
    id="google-map-script"
    defer
    async
  >
    {children}
  </LoadScript>
);

export default MapLoader;
