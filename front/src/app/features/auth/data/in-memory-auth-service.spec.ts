import { InMemoryAuthService } from './in-memory-auth-service';
import { RegisterData } from '../domain/user.model';

const NEW_ACCOUNT: RegisterData = {
  name: 'Test User',
  email: 'test@exemple.fr',
  password: 'secret42',
  role: 'client',
};

describe('InMemoryAuthService', () => {
  let service: InMemoryAuthService;

  beforeEach(() => {
    service = new InMemoryAuthService();
  });

  it('starts with no user connected', () => {
    expect(service.currentUser()).toBeNull();
  });

  it('logs in a seeded account and exposes the user', () => {
    const result = service.login({ email: 'client@exemple.fr', password: 'client123' });
    expect(result.ok).toBe(true);
    expect(service.currentUser()?.role).toBe('client');
  });

  it('is lenient about email case and whitespace', () => {
    const result = service.login({ email: '  Agent@LocaDrive.fr ', password: 'agent123' });
    expect(result.ok).toBe(true);
    expect(service.currentUser()?.role).toBe('agent');
  });

  it('rejects bad credentials without connecting anyone', () => {
    const result = service.login({ email: 'client@exemple.fr', password: 'mauvais' });
    expect(result.ok).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('registers a new account and connects it immediately', () => {
    const result = service.register(NEW_ACCOUNT);
    expect(result.ok).toBe(true);
    expect(service.currentUser()?.email).toBe('test@exemple.fr');
  });

  it('rejects a duplicate email at registration', () => {
    service.register(NEW_ACCOUNT);
    service.logout();
    const result = service.register({ ...NEW_ACCOUNT, name: 'Autre' });
    expect(result.ok).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('allows logging in with a freshly registered account', () => {
    service.register(NEW_ACCOUNT);
    service.logout();
    const result = service.login({ email: NEW_ACCOUNT.email, password: NEW_ACCOUNT.password });
    expect(result.ok).toBe(true);
  });

  it('logs out', () => {
    service.login({ email: 'client@exemple.fr', password: 'client123' });
    service.logout();
    expect(service.currentUser()).toBeNull();
  });
});
