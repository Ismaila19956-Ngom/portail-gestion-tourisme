import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { serviceData } from '../../home-1/components/data';

@Component({
  selector: 'app-service-single',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-single.component.html',
  styleUrls: ['./service-single.component.scss']
})
export class ServiceSingleComponent implements OnInit {
  produit: any = null;
  loading = true;
  error = false;
  productImage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug'); // actually the ID
      if (slug) {
        // Find in mock data
        const id = parseInt(slug, 10);
        const item = serviceData.find(s => s.id === id);
        if (item) {
          this.produit = item;
          // Si l'image de mock est une image agricole (service-img1.png), on la remplace par une belle image de tourisme.
          const imgIndex = (id % 3) + 1; 
          const images = [
            'assets/images/tourisme/excursion_dakar_1781800534313.png',
            'assets/images/tourisme/excursion_casamance_1781800557434.png',
            'assets/images/tourisme/excursion_saloum_1781800545237.png',
            'assets/images/tourisme/senegal_hero_1781800514533.png'
          ];
          
          const fallbackImage = 'assets/images/tourisme/senegal_hero_1781800514533.png';
          const currentImage = item.image || fallbackImage;
          
          this.productImage = currentImage.includes('service-img') ? images[id % 4] : currentImage;
          this.loading = false;
        } else {
          this.error = true;
          this.loading = false;
        }
      } else {
        this.router.navigate(['/home-1']);
      }
    });
  }
}
