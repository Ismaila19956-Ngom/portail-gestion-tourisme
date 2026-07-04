import type { MemberType } from '@/types';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbComponent } from "@app/components/breadcrumb/breadcrumb.component";
import { MemberCardComponent } from "../../../components/cards/member-card/member-card.component";

@Component({
    selector: 'app-our-team',
    imports: [BreadcrumbComponent, CommonModule, MemberCardComponent],
    templateUrl: './our-team.component.html',
    styles: []
})
export class OurTeamComponent {
    teamMembers: MemberType[] = [
        {
            name: "Mouhamadou Moustapha Fall",
            role: "Guide Principal",
            image: "assets/images/tourisme/guide_homme_1.png",
        },
        {
            name: "Dr. Fatoumata Kane",
            role: "Directrice Régionale",
            image: "assets/images/tourisme/guide_femme_1.png",
        },
        {
            name: "Abdoulaye Diallo",
            role: "Expert Safari",
            image: "assets/images/tourisme/guide_homme_2.png",
        },
        {
            name: "Aissatou Sow",
            role: "Spécialiste Gastronomie",
            image: "assets/images/tourisme/guide_femme_2.png",
        },
        {
            name: "Amadou Bamba Diop",
            role: "Guide Culturel",
            image: "assets/images/tourisme/guide_homme_1.png",
        },
        {
            name: "Mariama Ba",
            role: "Coordinatrice Voyages",
            image: "assets/images/tourisme/guide_femme_1.png",
        },
        {
            name: "Cheikh Tidiane Sy",
            role: "Expert Nature",
            image: "assets/images/tourisme/guide_homme_2.png",
        },
        {
            name: "Ousmane Sonko",
            role: "Responsable Réservations",
            image: "assets/images/tourisme/guide_femme_2.png",
        }
    ]
}
