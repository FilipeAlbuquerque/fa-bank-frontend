import { TestBed } from '@angular/core/testing';
import { VisibilityService } from './visibility.service';

describe('VisibilityService', () => {
  let service: VisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with values visible', () => {
    expect(service.valuesVisible()).toBe(true);
  });

  it('should hide values after first toggle', () => {
    service.toggle();
    expect(service.valuesVisible()).toBe(false);
  });

  it('should show values again after second toggle', () => {
    service.toggle();
    service.toggle();
    expect(service.valuesVisible()).toBe(true);
  });
});
