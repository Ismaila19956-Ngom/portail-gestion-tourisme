import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PortailTourismeService, Excursion, Reservation } from '../../../services/portail-tourisme.service';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-excursion',
  templateUrl: './detail-excursion.html',
  styleUrls: ['./detail-excursion.scss'],
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NgbCarouselModule]
})
export class DetailExcursionComponent implements OnInit {
  excursion: Excursion | null = null;
  loading = true;
  bookingForm!: FormGroup;
  bookingSuccess = false;
  bookingError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: PortailTourismeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadExcursion(+id);
    } else {
      this.router.navigate(['/excursions']);
    }
    this.initForm();
  }

  loadExcursion(id: number): void {
    this.tourService.getExcursionById(id).subscribe({
      next: (data) => {
        if (data && data.active) {
          this.excursion = data;
        } else {
          this.router.navigate(['/excursions']);
        }
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/excursions']);
        this.loading = false;
      }
    });
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      nomClient: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      dateReservation: ['', [Validators.required]],
      nombrePersonnes: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.excursion || !this.excursion.id) {
      return;
    }

    const reservation: Reservation = {
      ...this.bookingForm.value,
      excursionId: this.excursion.id,
      statut: 'PENDING'
    };

    this.tourService.createReservation(reservation).subscribe({
      next: () => {
        this.bookingSuccess = true;
        this.bookingError = false;
        this.bookingForm.reset({ nombrePersonnes: 1 });
      },
      error: () => {
        this.bookingError = true;
        this.bookingSuccess = false;
      }
    });
  }
}
