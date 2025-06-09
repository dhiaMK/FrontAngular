import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { HomeComponent } from "./components/home/home.component"
import { WeatherComponent } from "./components/weather/weather.component"
import { MapsComponent } from "./components/maps/maps.component"

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "weather", component: WeatherComponent },
  { path: "maps", component: MapsComponent },
  { path: "**", redirectTo: "" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
