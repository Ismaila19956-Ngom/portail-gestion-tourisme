import type { MemberType } from '@/types';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbComponent } from "@app/components/breadcrumb/breadcrumb.component";
import { MemberCardComponent } from "../../../components/cards/member-card/member-card.component";

@Component({
    selector: 'app-our-team',
    imports: [BreadcrumbComponent, CommonModule, MemberCardComponent],
    templateUrl: './our-team.component.html',
    styles: ``
})
export class OurTeamComponent {
    teamMembers: MemberType[] = [
        {
            name: "Mouhamadou Moustapha Fall",
            role: "Directeur Général",
            image: "assets/images/produits/hf_20260311_171219_5b524bb6-6fdb-497a-aca4-a8f867462f52.jpeg",
        },
        {
            name: "Dr. Fatoumata Kane",
            role: "Directrice Technique",
            image: "assets/images/produits/hf_20260311_164048_86f66af8-95f1-4418-b76a-4b4735fea65e.jpeg",
        },
        {
            name: "Abdoulaye Diallo",
            role: "D. Administratif & Financier",
            image: "assets/images/produits/hf_20260311_162925_fa56a58b-89f5-4b10-93ac-243916e02792.jpeg",
        },
        {
            name: "Aissatou Sow",
            role: "Dir. Relations Publiques",
            image: "assets/images/produits/hf_20260311_165624_de84638b-1839-484b-adfe-acebf00f9f55.jpeg",
        },
        {
            name: "Amadou Bamba Diop",
            role: "Chef du Département Sinistres",
            image: "assets/images/produits/hf_20260311_162925_e9aeb871-2b45-44a0-9d8b-0e2923673b3d.jpeg",
        },
        {
            name: "Mariama Ba",
            role: "Responsable Actuariat",
            image: "assets/images/produits/hf_20260311_164048_ee881310-4c1c-4717-895a-fe275c17150c.jpeg",
        },
        {
            name: "Cheikh Tidiane Sy",
            role: "Responsable Informatique",
            image: "assets/images/produits/hf_20260311_165624_6dcc6b61-eda0-4493-a515-5573ce35ca6f.jpeg",
        },
        {
            name: "Ousmane Sonko",
            role: "Responsable Réassurance",
            image: "assets/images/produits/hf_20260311_162925_871036b1-9cf1-4fdb-8480-7b3ce42bf7a7.jpeg",
        }
    ]

}
