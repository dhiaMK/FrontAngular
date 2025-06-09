import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import type { WeatherData, ForecastData, AlertsData } from "../models/weather.interface"

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  private readonly API_KEY = "09187528de32741275f391a0f544cbc7"
  private readonly BASE_URL = "https://api.openweathermap.org/data/2.5"

  constructor(private http: HttpClient) {}

  getCurrentWeather(lat: number, lon: number): Observable<WeatherData> {
    const url = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
    return this.http.get<WeatherData>(url).pipe(catchError(this.handleError))
  }

  getForecast(lat: number, lon: number): Observable<ForecastData> {
    const url = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
    return this.http.get<ForecastData>(url).pipe(catchError(this.handleError))
  }

  getWeatherAlerts(lat: number, lon: number): Observable<AlertsData> {
    // Mock alerts since One Call API requires subscription
    return new Observable((observer) => {
      const mockAlerts = this.generateMockAlerts()
      observer.next({ alerts: mockAlerts })
      observer.complete()
    })
  }

  private generateMockAlerts() {
    const shouldHaveAlert = Math.random() > 0.7
    if (!shouldHaveAlert) return []

    const alertTypes = [
      {
        event: "High Wind Warning",
        description: "Strong winds expected. Winds may reach 60-80 km/h with gusts up to 100 km/h.",
        tags: ["Wind", "Moderate"],
      },
      {
        event: "Heavy Rain Advisory",
        description: "Heavy rainfall expected. Rainfall amounts of 25-50mm possible.",
        tags: ["Rain", "Minor"],
      },
      {
        event: "Thunderstorm Watch",
        description: "Conditions favorable for thunderstorm development.",
        tags: ["Thunderstorm", "Moderate"],
      },
    ]

    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const now = Date.now() / 1000

    return [
      {
        sender_name: "Tunisia Meteorological Institute",
        event: randomAlert.event,
        start: now,
        end: now + 6 * 3600,
        description: randomAlert.description,
        tags: randomAlert.tags,
      },
    ]
  }

  private handleError(error: any) {
    console.error("Weather API error:", error)
    return throwError(() => new Error("Failed to fetch weather data"))
  }
}
