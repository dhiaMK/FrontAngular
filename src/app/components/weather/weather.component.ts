import { Component, type OnInit } from "@angular/core"
import type { WeatherService } from "../../services/weather.service"
import type {
  WeatherData,
  ForecastData,
  AlertsData,
  MarineConditions,
  TunisianCity,
  DailyForecast,
} from "../../models/weather.interface"

@Component({
  selector: "app-weather",
  templateUrl: "./weather.component.html",
  styleUrls: ["./weather.component.scss"],
})
export class WeatherComponent implements OnInit {
  tunisianCities: TunisianCity[] = [
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

  selectedCity: TunisianCity = this.tunisianCities[0]
  weatherData: WeatherData | null = null
  forecastData: ForecastData | null = null
  alertsData: AlertsData | null = null
  marineConditions: MarineConditions | null = null
  dailyForecasts: DailyForecast[] = []
  loading = false
  error: string | null = null

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.fetchWeather(this.selectedCity)
  }

  selectCity(city: TunisianCity): void {
    this.selectedCity = city
    this.fetchWeather(city)
  }

  fetchWeather(city: TunisianCity): void {
    this.loading = true
    this.error = null
    this.weatherData = null
    this.forecastData = null
    this.alertsData = null
    this.marineConditions = null

    // Fetch current weather
    this.weatherService.getCurrentWeather(city.lat, city.lon).subscribe({
      next: (weather) => {
        this.weatherData = weather
        this.marineConditions = this.assessMarineConditions(weather)
        this.loading = false
      },
      error: (error) => {
        this.error = error.message
        this.loading = false
      },
    })

    // Fetch forecast
    this.weatherService.getForecast(city.lat, city.lon).subscribe({
      next: (forecast) => {
        this.forecastData = forecast
        this.dailyForecasts = this.processForecastData(forecast)
      },
      error: (error) => {
        console.error("Forecast error:", error)
      },
    })

    // Fetch alerts
    this.weatherService.getWeatherAlerts(city.lat, city.lon).subscribe({
      next: (alerts) => {
        this.alertsData = alerts
      },
      error: (error) => {
        console.error("Alerts error:", error)
      },
    })
  }

  private assessMarineConditions(weather: WeatherData): MarineConditions {
    const temp = weather.main.temp
    const windSpeed = weather.wind.speed
    const visibility = weather.visibility / 1000
    const weatherMain = weather.weather[0].main
    const pressure = weather.main.pressure

    // Swimming conditions
    let swimmingScore = 100
    const swimmingReasons: string[] = []

    if (temp < 18) {
      swimmingScore -= 40
      swimmingReasons.push("Water temperature too cold for comfortable swimming")
    } else if (temp < 22) {
      swimmingScore -= 20
      swimmingReasons.push("Water temperature is cool, may be uncomfortable")
    }

    if (windSpeed > 8) {
      swimmingScore -= 30
      swimmingReasons.push("Strong winds creating rough sea conditions")
    } else if (windSpeed > 5) {
      swimmingScore -= 15
      swimmingReasons.push("Moderate winds may create choppy waters")
    }

    if (weatherMain === "Thunderstorm") {
      swimmingScore -= 60
      swimmingReasons.push("Thunderstorms present - lightning danger")
    } else if (weatherMain === "Rain") {
      swimmingScore -= 25
      swimmingReasons.push("Rainy conditions reduce swimming enjoyment")
    }

    // Sailing conditions
    let sailingScore = 100
    const sailingReasons: string[] = []

    if (windSpeed < 2) {
      sailingScore -= 30
      sailingReasons.push("Insufficient wind for sailing")
    } else if (windSpeed > 12) {
      sailingScore -= 40
      sailingReasons.push("Strong winds dangerous for recreational sailing")
    }

    if (weatherMain === "Thunderstorm") {
      sailingScore -= 70
      sailingReasons.push("Thunderstorms extremely dangerous for sailing")
    }

    const getStatus = (score: number) => {
      if (score >= 80) return "excellent"
      if (score >= 65) return "good"
      if (score >= 45) return "fair"
      if (score >= 25) return "poor"
      return "dangerous"
    }

    return {
      swimming: {
        status: getStatus(swimmingScore),
        score: Math.max(0, swimmingScore),
        reasons: swimmingReasons,
        recommendation: this.getRecommendation(swimmingScore, "swimming"),
      },
      sailing: {
        status: getStatus(sailingScore),
        score: Math.max(0, sailingScore),
        reasons: sailingReasons,
        recommendation: this.getRecommendation(sailingScore, "sailing"),
      },
    }
  }

  private getRecommendation(score: number, activity: "swimming" | "sailing"): string {
    if (score >= 80)
      return activity === "swimming" ? "Perfect conditions for swimming!" : "Excellent sailing conditions!"
    if (score >= 65) return activity === "swimming" ? "Good swimming conditions." : "Good sailing weather."
    if (score >= 45)
      return activity === "swimming" ? "Swimming possible but be cautious." : "Sailing possible but requires caution."
    if (score >= 25) return activity === "swimming" ? "Swimming not recommended." : "Sailing not recommended."
    return activity === "swimming" ? "Do not swim! Dangerous conditions." : "Do not sail! Dangerous conditions."
  }

  private processForecastData(forecastData: ForecastData): DailyForecast[] {
    const dailyForecasts: { [key: string]: any[] } = {}

    forecastData.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toDateString()
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = []
      }
      dailyForecasts[date].push(forecast)
    })

    return Object.entries(dailyForecasts)
      .slice(0, 5)
      .map(([date, forecasts]) => {
        const temps = forecasts.map((f: any) => f.main.temp)
        const tempMins = forecasts.map((f: any) => f.main.temp_min)
        const tempMaxs = forecasts.map((f: any) => f.main.temp_max)

        return {
          date: new Date(date).getTime() / 1000,
          temp_min: Math.min(...tempMins),
          temp_max: Math.max(...tempMaxs),
          temp_avg: temps.reduce((a: number, b: number) => a + b, 0) / temps.length,
          humidity_avg: forecasts.reduce((sum: number, f: any) => sum + f.main.humidity, 0) / forecasts.length,
          wind_speed_avg: forecasts.reduce((sum: number, f: any) => sum + f.wind.speed, 0) / forecasts.length,
          precipitation_prob: Math.max(...forecasts.map((f: any) => f.pop)),
          weather: forecasts[0].weather[0],
          forecasts: forecasts,
        }
      })
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "excellent":
        return "primary"
      case "good":
        return "primary"
      case "fair":
        return "accent"
      case "poor":
        return "warn"
      case "dangerous":
        return "warn"
      default:
        return "primary"
    }
  }

  getWeatherIcon(iconCode: string): string {
    const iconMap: { [key: string]: string } = {
      "01d": "wb_sunny",
      "01n": "brightness_3",
      "02d": "partly_cloudy_day",
      "02n": "partly_cloudy_night",
      "03d": "cloud",
      "03n": "cloud",
      "04d": "cloud",
      "04n": "cloud",
      "09d": "grain",
      "09n": "grain",
      "10d": "rainy",
      "10n": "rainy",
      "11d": "thunderstorm",
      "11n": "thunderstorm",
      "13d": "ac_unit",
      "13n": "ac_unit",
      "50d": "foggy",
      "50n": "foggy",
    }
    return iconMap[iconCode] || "cloud"
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  formatDayName(timestamp: number): string {
    const date = new Date(timestamp * 1000)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", { weekday: "long" })
    }
  }
}
