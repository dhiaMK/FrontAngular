import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { HttpClientModule } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

// Angular Material Modules
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatTabsModule } from "@angular/material/tabs"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatChipsModule } from "@angular/material/chips"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatBadgeModule } from "@angular/material/badge"
import { MatDividerModule } from "@angular/material/divider"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { NavigationComponent } from "./components/navigation/navigation.component"
import { HomeComponent } from "./components/home/home.component"
import { WeatherComponent } from "./components/weather/weather.component"
import { MapsComponent } from "./components/maps/maps.component"
import { MapComponentComponent } from "./components/map-component/map-component.component"

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    WeatherComponent,
    MapsComponent,
    MapComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
