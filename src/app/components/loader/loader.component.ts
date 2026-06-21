import { NgIf, NgFor } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';

@Component({
    selector: 'app-loader',
    imports: [NgIf, NgFor],
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
    @Input() icon?: string;
    @Input() className?: string;
    
    showPreloader: boolean = true;
    letters = ['S', 'E', 'N', 'E', 'G', 'A', 'L'];

    ngOnInit() {
        // Apparaît uniquement au chargement initial de l'application
        setTimeout(() => {
            this.showPreloader = false;
        }, 1500); // 1.5s pour bien voir l'animation au démarrage
    }
}
