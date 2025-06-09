export interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    temp_min: number
    temp_max: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg?: number
  }
  visibility: number
  clouds: {
    all: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  dt: number
}

export interface ForecastDay {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg?: number
  }
  clouds: {
    all: number
  }
  pop: number
  dt_txt: string
}

export interface ForecastData {
  list: ForecastDay[]
  city: {
    name: string
    country: string
  }
}

export interface WeatherAlert {
  sender_name: string
  event: string
  start: number
  end: number
  description: string
  tags: string[]
}

export interface AlertsData {
  alerts?: WeatherAlert[]
}

export interface MarineConditions {
  swimming: {
    status: "excellent" | "good" | "fair" | "poor" | "dangerous"
    score: number
    reasons: string[]
    recommendation: string
  }
  sailing: {
    status: "excellent" | "good" | "fair" | "poor" | "dangerous"
    score: number
    reasons: string[]
    recommendation: string
  }
}

export interface PinnedPlace {
  id: string
  name: string
  lat: number
  lng: number
  description?: string
}

export interface TunisianCity {
  name: string
  lat: number
  lon: number
}

export interface DailyForecast {
  date: number
  temp_min: number
  temp_max: number
  temp_avg: number
  humidity_avg: number
  wind_speed_avg: number
  precipitation_prob: number
  weather: {
    main: string
    description: string
    icon: string
  }
  forecasts: ForecastDay[]
}
