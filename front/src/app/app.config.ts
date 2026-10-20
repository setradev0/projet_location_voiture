import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './core/config/api-base-url';
import { authInterceptor } from './core/http/auth.interceptor';
import { AuthService } from './features/auth/domain/auth-service';
import { HttpAuthService } from './features/auth/data/http-auth-service';
import { BookingRepository } from './features/bookings/domain/booking-repository';
import { HttpBookingRepository } from './features/bookings/data/http-booking-repository';
import { VehicleRepository } from './features/vehicles/domain/vehicle-repository';
import { HttpVehicleRepository } from './features/vehicles/data/http-vehicle-repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    { provide: VehicleRepository, useClass: HttpVehicleRepository },
    { provide: AuthService, useClass: HttpAuthService },
    { provide: BookingRepository, useClass: HttpBookingRepository },
    provideAppInitializer(() => {
      const vehicles = inject(VehicleRepository);
      const bookings = inject(BookingRepository);
      return Promise.all([vehicles.hydrate(), bookings.hydrate()]);
    }),
  ],
};
