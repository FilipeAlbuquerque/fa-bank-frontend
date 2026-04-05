import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardComponent } from './dashboard.component';
import { VisibilityService } from '../../core/services/visibility.service';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([{ path: 'login', component: {} as never }]),
        provideAnimationsAsync(),
      ],
    }).compileComponents();
  });

  const create = () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  };

  it('should create', () => {
    expect(create()).toBeTruthy();
  });

  it('should start with mobile menu closed', () => {
    const comp = create();
    expect(comp.mobileMenuOpen()).toBe(false);
  });

  it('toggleMobileMenu should open the menu', () => {
    const comp = create();
    comp.toggleMobileMenu();
    expect(comp.mobileMenuOpen()).toBe(true);
  });

  it('closeMobileMenu should close the menu', () => {
    const comp = create();
    comp.toggleMobileMenu();
    comp.closeMobileMenu();
    expect(comp.mobileMenuOpen()).toBe(false);
  });

  it('onEscape should close the mobile menu', () => {
    const comp = create();
    comp.toggleMobileMenu();
    comp.onEscape();
    expect(comp.mobileMenuOpen()).toBe(false);
  });

  it('toggleVisibility should delegate to VisibilityService', () => {
    const comp = create();
    const svc = TestBed.inject(VisibilityService);
    expect(svc.valuesVisible()).toBe(true);
    comp.toggleVisibility();
    expect(svc.valuesVisible()).toBe(false);
  });

  it('should expose 4 nav items', () => {
    const comp = create();
    expect(comp.navItems.length).toBe(4);
  });
});
