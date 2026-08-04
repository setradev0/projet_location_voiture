import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { routes } from './app.routes';
import { AuthService } from './features/auth/domain/auth-service';
import { InMemoryAuthService } from './features/auth/data/in-memory-auth-service';
import { BookingRepository } from './features/bookings/domain/booking-repository';
import { InMemoryBookingRepository } from './features/bookings/data/in-memory-booking-repository';
import { VehicleRepository } from './features/vehicles/domain/vehicle-repository';
import { InMemoryVehicleRepository } from './features/vehicles/data/in-memory-vehicle-repository';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useClass: InMemoryAuthService },
        { provide: VehicleRepository, useClass: InMemoryVehicleRepository },
        { provide: BookingRepository, useClass: InMemoryBookingRepository },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the header brand', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header a')?.textContent).toContain('Loca');
  });
});
