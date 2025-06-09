import {
  Component,
  type OnInit,
  type OnDestroy,
  Input,
  Output,
  EventEmitter,
  type ElementRef,
  ViewChild,
} from "@angular/core"
import type { PinnedPlace, TunisianCity } from "../../models/weather.interface"

declare global {
  interface Window {
    L: any
  }
}

@Component({
  selector: "app-map-component",
  templateUrl: "./map-component.component.html",
  styleUrls: ["./map-component.component.scss"],
})
export class MapComponentComponent implements OnInit, OnDestroy {
  @ViewChild("mapContainer", { static: true }) mapContainer!: ElementRef

  @Input() pinnedPlaces: PinnedPlace[] = []
  @Input() selectedPlace: PinnedPlace | null = null

  @Output() mapClick = new EventEmitter<{ lat: number; lng: number; name?: string }>()
  @Output() placeSelect = new EventEmitter<PinnedPlace>()

  private map: any = null
  private cityMarkers: any[] = []
  private pinMarkers: any[] = []
  private mapLoaded = false

  private tunisianCities: TunisianCity[] = [
    { name: "Bizerte", lat: 37.2744, lon: 9.8739 },
    { name: "Tunis", lat: 36.8065, lon: 10.1815 },
    { name: "Nabeul", lat: 36.4561, lon: 10.7376 },
    { name: "Hammamet", lat: 36.4, lon: 10.6167 },
    { name: "Sousse", lat: 35.8256, lon: 10.636 },
    { name: "Monastir", lat: 35.7643, lon: 10.8113 },
    { name: "Mahdia", lat: 35.5047, lon: 11.0622 },
    { name: "Sfax", lat: 34.7406, lon: 10.7603 },
    { name: "Medenine", lat: 33.3549, lon: 10.5055 },
  ]

  constructor() {}

  ngOnInit(): void {
    this.initializeMap()
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove()
    }
  }

  ngOnChanges(): void {
    if (this.mapLoaded) {
      this.updatePinMarkers()
      this.handleSelectedPlaceChange()
    }
  }

  private async initializeMap(): Promise<void> {
    try {
      await this.loadLeaflet()
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Initialize the map
      this.map = window.L.map(this.mapContainer.nativeElement).setView([34.0, 9.5], 6)

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(this.map)

      // Add city markers
      this.addCityMarkers()

      // Handle map clicks
      this.map.on("click", (e: any) => {
        const { lat, lng } = e.latlng
        this.mapClick.emit({ lat, lng })
      })

      // Add controls
      this.map.zoomControl.setPosition("topright")
      window.L.control.scale().addTo(this.map)

      this.mapLoaded = true
      this.updatePinMarkers()
    } catch (error) {
      console.error("Failed to initialize Leaflet map:", error)
    }
  }

  private async loadLeaflet(): Promise<void> {
    // Load CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id = "leaflet-css"
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)
    }

    // Load JS
    if (!window.L) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        script.crossOrigin = ""
        script.onload = () => resolve(undefined)
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
  }

  private addCityMarkers(): void {
    this.tunisianCities.forEach((city) => {
      const cityIcon = window.L.divIcon({
        html: `
          <div style="
            background-color: #dc2626;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        className: "custom-city-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const marker = window.L.marker([city.lat, city.lon], { icon: cityIcon }).addTo(this.map)
      marker.bindPopup(`<strong>${city.name}</strong><br/>Major City`)
      this.cityMarkers.push(marker)
    })
  }

  private updatePinMarkers(): void {
    if (!this.map || !window.L) return

    // Clear existing pin markers
    this.pinMarkers.forEach((marker) => {
      this.map.removeLayer(marker)
    })
    this.pinMarkers = []

    // Add new pin markers
    this.pinnedPlaces.forEach((place) => {
      const isSelected = this.selectedPlace?.id === place.id

      const pinIcon = window.L.divIcon({
        html: `
          <div style="
            position: relative;
            width: 24px;
            height: 30px;
          ">
            <svg width="24" height="30" viewBox="0 0 24 30" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 18 12 18s12-10.8 12-18C24 5.4 18.6 0 12 0z" 
                    fill="${isSelected ? "#fbbf24" : "#059669"}" 
                    stroke="white" 
                    stroke-width="1"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
            </svg>
          </div>
        `,
        className: "custom-pin-marker",
        iconSize: [24, 30],
        iconAnchor: [12, 30],
        popupAnchor: [0, -30],
      })

      const marker = window.L.marker([place.lat, place.lng], { icon: pinIcon }).addTo(this.map)

      marker.bindPopup(`
        <div style="text-align: center;">
          <strong>${place.name}</strong><br/>
          <small>Lat: ${place.lat.toFixed(4)}, Lng: ${place.lng.toFixed(4)}</small>
        </div>
      `)

      marker.on("click", () => {
        this.placeSelect.emit(place)
      })

      this.pinMarkers.push(marker)
    })
  }

  private handleSelectedPlaceChange(): void {
    if (!this.map || !this.selectedPlace) return

    this.map.flyTo([this.selectedPlace.lat, this.selectedPlace.lng], 12, {
      duration: 1.5,
    })
  }
}
