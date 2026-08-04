import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { agentGuard, authGuard } from './auth.guards';
import { AuthService } from './domain/auth-service';
import { InMemoryAuthService } from './data/in-memory-auth-service';

const ROUTE = {} as ActivatedRouteSnapshot;
const STATE = { url: '/recherche' } as RouterStateSnapshot;

describe('auth guards', () => {
  let auth: InMemoryAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useClass: InMemoryAuthService }],
    });
    auth = TestBed.inject(AuthService) as InMemoryAuthService;
  });

  const run = (guard: typeof authGuard) =>
    TestBed.runInInjectionContext(() => guard(ROUTE, STATE));

  describe('authGuard', () => {
    it('redirects anonymous visitors to the login page with a returnUrl', () => {
      const result = run(authGuard);
      expect(result).toBeInstanceOf(UrlTree);
      expect(result!.toString()).toContain('/connexion');
      expect(result!.toString()).toContain('returnUrl');
    });

    it('lets any connected user through', () => {
      auth.login({ email: 'client@exemple.fr', password: 'client123' });
      expect(run(authGuard)).toBe(true);
    });
  });

  describe('agentGuard', () => {
    it('redirects anonymous visitors to the login page', () => {
      const result = run(agentGuard);
      expect(result).toBeInstanceOf(UrlTree);
      expect(result!.toString()).toContain('/connexion');
    });

    it('redirects a connected client to the search page', () => {
      auth.login({ email: 'client@exemple.fr', password: 'client123' });
      const result = run(agentGuard);
      expect(result).toBeInstanceOf(UrlTree);
      expect(result!.toString()).toContain('/recherche');
    });

    it('lets an agent through', () => {
      auth.login({ email: 'agent@locadrive.fr', password: 'agent123' });
      expect(run(agentGuard)).toBe(true);
    });
  });
});
