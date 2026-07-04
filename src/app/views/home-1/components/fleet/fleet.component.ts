import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Vehicle {
  name: string;
  image: string;
  icon: string;
  capacity: string;
  ideal: string;
  features: string[];
  badge: string;
  badgeColor: string;
}

@Component({
  selector: 'app-fleet',
  imports: [CommonModule, RouterLink],
  templateUrl: './fleet.component.html',
  styles: ``
})
export class FleetComponent {
  activeVehicle = 0;

  vehicles: Vehicle[] = [
    {
      name: '4x4 Land Cruiser Safari',
      image: 'assets/images/tourisme/flotte_4x4.png',
      icon: 'fa-solid fa-truck-monster',
      capacity: '6 passagers',
      ideal: 'Safaris & Pistes',
      badge: 'Populaire',
      badgeColor: '#F1B53B',
      features: [
        'Climatisation puissante',
        'Idéal hors route & pistes sablées',
        'Toit panoramique safari',
        'Équipement de survie inclus',
        'Chauffeur guide certifié'
      ]
    },
    {
      name: 'Minibus Climatisé Confort',
      image: 'assets/images/tourisme/flotte_minibus.png',
      icon: 'fa-solid fa-bus',
      capacity: '20 passagers',
      ideal: 'Groupes & Transferts',
      badge: 'Idéal Groupes',
      badgeColor: '#3E4F22',
      features: [
        'Climatisation multi-zones',
        'Sièges inclinables confortables',
        'Système audio & écrans',
        'Wi-Fi à bord',
        'Rangements bagages spacieux'
      ]
    },
    {
      name: 'Pirogue Motorisée Traditionnelle',
      image: 'assets/images/tourisme/flotte_pirogue.png',
      icon: 'fa-solid fa-sailboat',
      capacity: '12 passagers',
      ideal: 'Excursions Nautiques',
      badge: 'Unique',
      badgeColor: '#0077b6',
      features: [
        'Visite Lac Rose & Sine-Saloum',
        'Gilets de sauvetage fournis',
        'Capitaine expérimenté',
        'Équipement snorkeling inclus',
        'Excursion au lever / coucher du soleil'
      ]
    }
  ];

  setActive(i: number) {
    this.activeVehicle = i;
  }
}
