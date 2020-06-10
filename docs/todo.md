# ToDo
## Player (main + renderer)
zum Anzeigen -> weitgehend fertig - v.A. Anpassung
## Redis
## Transfer + Control
zur Netzwerk- und internen Kommunikation (Dateien)
- IP:5230
  - GET /transfer/[slideshowid]/[path]/[to]/[file] -> gibt Ressource oder 404 zurück
    - Authentifizierung: JSON Web token
  - POST /transfer/[slideshowid]/[path]/[to]/[file] -> speichert Ressource auf der Node oder gibt 5xx zurück
    - Authentifizierung: JSON Web token
  - (HEAD /transfer/[slideshowid]/[path]/[to]/[file] -> gibt Ressource oder 404 zurück
    - Authentifizierung: JSON Web token
  - GET oder POST /control?[gql] -> gibt Informationen über Node und Slideshows zurück oder setzt diese
    - Authentifizierung: JSON Web token