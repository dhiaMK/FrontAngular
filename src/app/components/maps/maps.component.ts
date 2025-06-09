import { Component, type OnInit } from "@angular/core"
import type { PinnedPlace } from "../../models/weather.interface"

@Component({
  selector: "app-maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.scss"],
})
export class MapsComponent implements OnInit {
  pinnedPlaces: PinnedPlace[] = []
  newPlaceName = ""
  selectedPlace: PinnedPlace | null = null

  constructor() {}

  ngOnInit(): void {
    this.loadPinnedPlaces()
  }

  private loadPinnedPlaces(): void {
    const saved = localStorage.getItem("pinnedPlaces")
    if (saved) {
      this.pinnedPlaces = JSON.parse(saved)
    }
  }

  private savePinnedPlaces(): void {
    localStorage.setItem("pinnedPlaces", JSON.stringify(this.pinnedPlaces))
  }

  onMapClick(lat: number, lng: number, name?: string): void {
    const newPlace: PinnedPlace = {
      id: Date.now().toString(),
      name: name || this.newPlaceName || `Place ${this.pinnedPlaces.length + 1}`,
      lat,
      lng,
    }

    this.pinnedPlaces.push(newPlace)
    this.savePinnedPlaces()
    this.newPlaceName = ""
  }

  onPlaceSelect(place: PinnedPlace): void {
    this.selectedPlace = place
  }

  removePinnedPlace(id: string): void {
    this.pinnedPlaces = this.pinnedPlaces.filter((place) => place.id !== id)
    this.savePinnedPlaces()

    if (this.selectedPlace?.id === id) {
      this.selectedPlace = null
    }
  }

  clearAllPlaces(): void {
    this.pinnedPlaces = []
    this.selectedPlace = null
    this.savePinnedPlaces()
  }

  selectPlace(place: PinnedPlace): void {
    this.selectedPlace = place
  }
}
