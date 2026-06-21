import { Component } from '@angular/core';
import { AboutHeroComponent } from "./components/about-hero/about-hero.component";
import { AboutUsComponent } from "./components/about-us/about-us.component";
import { ChooseUsComponent } from "./components/choose-us/choose-us.component";
import { AboutContentComponent } from "./components/about-content/about-content.component";
import { TestimonialComponent } from "./components/testimonial/testimonial.component";
import { TeamComponent } from "./components/team/team.component";

@Component({
  selector: 'app-about',
  imports: [AboutHeroComponent, AboutUsComponent, ChooseUsComponent, AboutContentComponent, TestimonialComponent, TeamComponent],
  templateUrl: './about.component.html',
  styles: ``
})
export class AboutComponent {

}
