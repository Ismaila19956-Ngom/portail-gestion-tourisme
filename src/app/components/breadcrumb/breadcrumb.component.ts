import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-breadcrumb',
    imports: [RouterLink],
    templateUrl: './breadcrumb.component.html',
    styles: [`
        a.backline {
            color: #F1B53B !important;
            font-weight: 700 !important;
            background: rgba(0,0,0,0.35) !important;
            padding: 5px 14px !important;
            border-radius: 20px !important;
            backdrop-filter: blur(4px) !important;
            border: 1px solid rgba(241,181,59,0.25) !important;
            display: inline-block !important;
        }
        a.backline span, a.backline i {
            color: #F1B53B !important;
            font-weight: 700 !important;
        }
        a.backline:hover {
            color: #ffffff !important;
            background: rgba(241,181,59,0.2) !important;
        }
        a.backline:hover span, a.backline:hover i {
            color: #ffffff !important;
        }
    `]
})
export class BreadcrumbComponent {
    @Input() title!: string
    @Input() subTitle?: string
}
