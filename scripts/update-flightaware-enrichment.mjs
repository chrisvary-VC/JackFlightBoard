import { writeFile } from "node:fs/promises";

const AUBURN = { lat: 32.604052, lon: -85.490536, radiusNm: 17 };
const MAX_FLIGHTS = 8;
const key = process.env.FLIGHTAWARE_API_KEY;

if (!key) throw new Error("FLIGHTAWARE_API_KEY is not configured.");

const distanceMiles = (lat1, lon1, lat2, lon2) => {
  const radians = value => value * Math.PI / 180;
  const a = Math.sin(radians(lat2 - lat1) / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(radians(lon2 - lon1) / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(a));
};

const airport = value => {
  if (!value || typeof value === "string") return null;
  const code = value.code || value.icao || value.iata || value.code_icao || value.code_iata;
  const lat = value.latitude ?? value.lat;
  const lon = value.longitude ?? value.lon;
  if (!code || lat == null || lon == null) return null;
  return { code, city: value.city || value.municipality || value.name || "", lat, lon };
};

const response = await fetch(`https://api.airplanes.live/v2/point/${AUBURN.lat}/${AUBURN.lon}/${AUBURN.radiusNm}`);
if (!response.ok) throw new Error(`Airplanes.live returned ${response.status}`);
const live = await response.json();
const nearby = [...new Map((live.ac || [])
  .filter(aircraft => aircraft.lat != null && aircraft.lon != null && aircraft.alt_baro !== "ground")
  .map(aircraft => {
    const callsign = (aircraft.flight || "").trim().toUpperCase();
    return [callsign, { callsign, distance: distanceMiles(AUBURN.lat, AUBURN.lon, aircraft.lat, aircraft.lon) }];
  })
  .filter(([callsign]) => callsign && !/^AUB\d+$/.test(callsign)))
  .values()]
  .sort((a, b) => a.distance - b.distance)
  .slice(0, MAX_FLIGHTS);

const flights = {};
for (const nearbyFlight of nearby) {
  const url = `https://aeroapi.flightaware.com/aeroapi/flights/${encodeURIComponent(nearbyFlight.callsign)}?max_pages=1`;
  const details = await fetch(url, { headers: { "x-apikey": key } });
  if (!details.ok) continue;
  const payload = await details.json();
  const flight = (payload.flights || []).find(item => !item.actual_in && (item.actual_out || item.status === "En Route"))
    || payload.flights?.[0];
  if (!flight) continue;

  const origin = airport(flight.origin);
  const destination = airport(flight.destination);
  flights[nearbyFlight.callsign] = {
    cachedAt: new Date().toISOString(),
    flightId: flight.fa_flight_id || flight.faFlightID || "",
    aircraftType: (flight.aircraft_type || flight.aircraftType || "").toUpperCase() || null,
    origin,
    destination,
    status: flight.status || null
  };
}

await writeFile("flightaware-enrichment.json", `${JSON.stringify({
  updatedAt: new Date().toISOString(),
  source: "FlightAware AeroAPI cache — refreshed every 12 hours by GitHub Actions",
  flights
}, null, 2)}\n`);
