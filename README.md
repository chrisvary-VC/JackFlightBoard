# Jack's Flight Board

A full-screen dot-matrix flight board for aircraft passing near Auburn, Alabama.

## Start the board

Double-click `start.command`, or open `index.html` directly. The board runs entirely in your browser; no helper process or Terminal window needs to stay open.

## What it displays

- Live nearby aircraft from ADS-B.lol
- Exact aircraft photographs by registration from Wikimedia Commons when available, with a source link
- Airline, callsign, aircraft type, registration, and route
- Distance and compass direction from Auburn
- Altitude, ground speed, heading, and vertical rate
- Current wind speed, direction, and gusts from Open-Meteo
- Automatic aircraft rotation and live dead-reckoning between updates

When live aircraft data is unavailable, the board switches to clearly labeled demo data. If an exact photograph is unavailable, it uses a neutral aircraft-type illustration instead of showing the wrong airline livery.
