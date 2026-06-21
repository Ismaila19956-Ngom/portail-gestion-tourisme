import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { workData } from '../data';

@Component({
    selector: 'app-work',
    imports: [ CommonModule,NgbNavModule,RouterLink],
    templateUrl: './work.component.html',
    styles: ``
})
export class WorkComponent implements OnInit {
    active = 'tab0';
    tabs: any[] = [];
    activeDemarche: any = null;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        // Force the use of static tourism data instead of fetching from the old CNAAS API
        this.tabs = workData;
    }

    private mapStepsData(data: any[]) {
        if (data && data.length > 0) {
            this.tabs = data.map((e, index) => ({
                id: e.id,
                icon: `assets/img/icons/work${index % 4 + 1}.svg`,
                title: e.etape?.libelle || '',
                duration: 800 + (index * 200),
                image: e.imageUrl,
                description: e.description
            }));
        } else {
            this.tabs = workData;
        }
    }
}
