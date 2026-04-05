import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VisibilityService {
  private readonly _visible = signal(true);

  readonly valuesVisible = this._visible.asReadonly();

  toggle(): void {
    this._visible.update(v => !v);
  }
}
