import React, { memo, useState } from "react";
import WeatherDisplay from "./pages/WeatherDisplay/WeatherDisplay";
import MapDisplay from "./pages/MapDisplay/MapDisplay";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const App: React.FC = () => {
  const [latitude, setLatitude] = useState<any>(51.5074);
  const [longitude, setLongitude] = useState<any>(-0.1278);
  const [address, setAddress] = useState<string>("");
  const [zoom, setZoom] = useState<number>(10);

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setLatitude(latLng.lat);
    setLongitude(latLng.lng);
    setAddress(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (latitude === null || longitude === null) {
      alert("Latitude and longitude cannot be empty.");
      return;
    }
    setZoom(12); // Adjust zoom level if necessary
  };

  const getFormData = () => {
    return (
      <>
        <header className="App-header" style={{marginBottom:"20px"}}>
          <h1>User Form</h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label>Latitude</label>
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value !== '' ? parseFloat(e.target.value) : '')}
                required
                style={{
                  padding: "8px 5px",
                  border: "1px solid gray",
                  borderRadius: "8px",
                  display: "block",
                  marginTop: "4px",
                }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label>Longitude </label>
              <input
                type="number"
                value={longitude}
              onChange={(e) => setLongitude(e.target.value !== '' ? parseFloat(e.target.value) : '')}
                required
                style={{
                  padding: "8px 5px",
                  border: "1px solid gray",
                  borderRadius: "8px",
                  display: "block",
                }}
              />
            </div>
            <div>
              <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div>
                    <input
                      {...getInputProps({ placeholder: "Search Places ..." })}
                      style={{
                        padding: "8px 5px",
                        border: "1px solid gray",
                        borderRadius: "8px",
                        display: "block",
                      }}
                    />
                    <div>
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion: any) => {
                        const style = {
                          backgroundColor: suggestion.active
                            ? "#a8dadc"
                            : "#fff",
                        };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, { style })}
                          >
                            {suggestion?.description}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </div>
            <button
              type="submit"
              style={{
                padding: "8px 67px",
                border: "1px solid gray",
                borderRadius: "8px",
                marginTop: "8px",
                color: "white",
                background: "black",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
        </header>
      </>
    );
  };
  return (
    <>
      <div className="App" style={{ margin: "0 20px",background:"gray" }}>
         <WeatherDisplay />
        {getFormData()}


        <MapDisplay latitude={latitude} longitude={longitude} zoom={zoom} />
      </div>
    </>
  );
};

export default memo(App);
