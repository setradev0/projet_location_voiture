import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VehicleCard } from './vehicle-card';
import { Vehicle } from '../../features/vehicles/domain/vehicle.model';

const VEHICLE: Vehicle = {
  id: 'v1',
  brand: 'Renault',
  model: 'Clio V',
  category: 'citadine',
  city: 'Paris',
  pricePerDay: 30,
  seats: 5,
  transmission: 'manuelle',
  fuel: 'essence',
};

describe('VehicleCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleCard],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function create(rentalDays: number | null = null) {
    const fixture = TestBed.createComponent(VehicleCard);
    fixture.componentRef.setInput('vehicle', VEHICLE);
    fixture.componentRef.setInput('rentalDays', rentalDays);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the vehicle name, city and daily price', () => {
    const el = create();
    expect(el.querySelector('h3')?.textContent).toContain('Renault Clio V');
    expect(el.textContent).toContain('Paris');
    expect(el.textContent).toContain('30');
  });

  it('shows the total price when a rental duration is provided', () => {
    const el = create(5);
    expect(el.textContent).toContain('150');
    expect(el.textContent).toContain('5 jours');
  });

  it('hides the total price without a duration', () => {
    const el = create();
    expect(el.textContent).not.toContain('pour');
  });

  it('links to the vehicle detail page', () => {
    const el = create();
    const link = el.querySelector('a');
    expect(link?.getAttribute('href')).toContain('/vehicules/v1');
  });
});
