import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { teamMembers } from '../data';
import { MemberCardComponent } from "@app/components/cards/member-card/member-card.component";

@Component({
    selector: 'app-team',
    imports: [CommonModule, RouterLink, MemberCardComponent],
    templateUrl: './team.component.html',
    styles: ``
})
export class TeamComponent {
    teamMembers = teamMembers
}
