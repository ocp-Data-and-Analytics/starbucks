import React, { useRef, useState } from "react";
import { Input, message } from "antd";
import { Autocomplete } from "@react-google-maps/api";

const AddrAutoComplete = ({ onSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const autocompleteRef = useRef(null);

  const handleOnLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handleOnPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const addressComponents = place.address_components;

      const address = {
        address1:
          addressComponents.find((comp) => comp.types.includes("street_number"))?.long_name +
          " " +
          addressComponents.find((comp) => comp.types.includes("route"))?.long_name,
        city: addressComponents.find((comp) => comp.types.includes("locality"))?.long_name,
        state: addressComponents.find((comp) => comp.types.includes("administrative_area_level_1"))?.short_name,
        zip: addressComponents.find((comp) => comp.types.includes("postal_code"))?.long_name,
      };

      if (address.state !== "CA") {
        message.error("Only addresses in California are allowed.");
        setInputValue(""); // Clear the input field
        return;
      }

      const formattedAddress = `${address.address1}, ${address.city}, ${address.state} ${address.zip}`;
      setInputValue(formattedAddress);
      onSelect(address);
    }
  };

  return (
    <Autocomplete onLoad={handleOnLoad} onPlaceChanged={handleOnPlaceChanged} fields={["address_components"]}>
      <Input placeholder="Enter your address" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
    </Autocomplete>
  );
};

export default AddrAutoComplete;
