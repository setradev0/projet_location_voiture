import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './core/config/api-base-url';
import { AuthService } from './features/auth/domain/auth-service';
import { InMemoryAuthService } from './features/auth/data/in-memory-auth-service';
import { BookingRepository } from './features/bookings/domain/booking-repository';
import { InMemoryBookingRepository } from './features/bookings/data/in-memory-booking-repository';
import { VehicleRepository } from './features/vehicles/domain/vehicle-repository';
import { InMemoryVehicleRepository } from './features/vehicles/data/in-memory-vehicle-repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    // URL de l'API selon l'environnement actif (dev : gateway local, prod : /api).
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    // Inversion de dépendance : les adaptateurs mock sont branchés ici,
    // à remplacer par des adaptateurs HTTP sans toucher aux features.
    { provide: VehicleRepository, useClass: InMemoryVehicleRepository },
    { provide: AuthService, useClass: InMemoryAuthService },
    { provide: BookingRepository, useClass: InMemoryBookingRepository },
  ],
};
