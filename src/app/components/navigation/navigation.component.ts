import { Component } from "@angular/core"
import type { Router } from "@angular/router"

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent {
  constructor(public router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route
  }
}
