# Jack's Flight Board

A full-screen dot-matrix flight board for aircraft passing near Auburn, Alabama.

## Start the board

Double-click `start.command`, or open `index.html` directly. The board runs entirely in your browser; no helper process or Terminal window needs to stay open.

## What it displays

- Live nearby aircraft within a 10-mile look-out radius from Airplanes.live
- Exact aircraft photographs by registration from Wikimedia Commons when available, with a source link
- Airline, callsign, aircraft type, registration, and route
- Distance and compass direction from Auburn
- Altitude, ground speed, heading, and vertical rate
- Current wind speed, direction, and gusts from Open-Meteo
- Automatic aircraft rotation and live dead-reckoning between updates

When live aircraft data is unavailable, the board switches to clearly labeled demo data. If an exact photograph is unavailable, it uses a neutral aircraft-type illustration instead of showing the wrong airline livery.

## FlightAware enrichment

The board keeps its live positions free and fast through Airplanes.live. Every 12 hours, a GitHub Action can enrich up to eight nearby non-Auburn callsigns with FlightAware AeroAPI flight details and saves only that small public cache in `flightaware-enrichment.json`. Auburn `AUB` flights always retain the Auburn logo and supplied Skyhawk image.

To turn on enrichment, add a repository Actions secret named `FLIGHTAWARE_API_KEY`, then run the **Refresh FlightAware enrichment** workflow once from the repository's Actions tab. Never put the key in `index.html` or any public file. At the current $0.005 FlightAware flight-detail rate, the eight-flight, twice-daily cap is approximately $2.40 per 30-day month; check FlightAware's current pricing before relying on that estimate.
