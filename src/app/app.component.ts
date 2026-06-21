import { Component, inject, type OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import aos from 'aos';
import { filter, map, mergeMap } from 'rxjs';
import { ScrollToTopComponent } from "./components/scroll-to-top/scroll-to-top.component";
import { LoaderComponent } from "./components/loader/loader.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ScrollToTopComponent, LoaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    private titleService = inject(Title);
    private metaService = inject(Meta);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        aos.init();

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let route = this.activatedRoute;
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }),
                mergeMap(route => route.data)
            )
            .subscribe(data => {
                if (data['title']) {
                    this.titleService.setTitle(data['title'] + ' | Sénégal Excursions');
                }
                
                // SEO Meta tags
                if (data['description']) {
                    this.metaService.updateTag({ name: 'description', content: data['description'] });
                } else {
                    this.metaService.updateTag({ name: 'description', content: 'Découvrez les meilleures excursions au Sénégal avec Sénégal Excursions.' });
                }
                
                // Open Graph Tags
                this.metaService.updateTag({ property: 'og:title', content: data['title'] ? (data['title'] + ' | Sénégal Excursions') : 'Sénégal Excursions' });
                this.metaService.updateTag({ property: 'og:description', content: data['description'] || 'Découvrez les meilleures excursions au Sénégal.' });
                this.metaService.updateTag({ property: 'og:type', content: 'website' });
            });
    }
}
