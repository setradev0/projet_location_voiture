import { Component, computed, input } from '@angular/core';

/**
 * Avatar utilisateur : affiche la photo de profil si présente, sinon les initiales
 * sur un fond de couleur. Décoratif (le nom est toujours affiché à côté).
 */
@Component({
  selector: 'app-user-avatar',
  template: `
    @if (photoUrl(); as photo) {
      <img
        [src]="photo"
        alt=""
        class="shrink-0 rounded-full object-cover ring-1 ring-black/10 {{ sizeClass() }}"
      />
    } @else {
      <span
        class="flex shrink-0 items-center justify-center rounded-full bg-amber-500 font-semibold text-slate-900 {{
          sizeClass()
        }}"
        aria-hidden="true"
      >
        {{ initials() }}
      </span>
    }
  `,
})
export class UserAvatar {
  readonly name = input.required<string>();
  readonly photoUrl = input<string | null>(null);
  readonly size = input<'sm' | 'lg'>('sm');

  protected readonly sizeClass = computed(() =>
    this.size() === 'lg' ? 'h-24 w-24 text-3xl' : 'h-9 w-9 text-sm',
  );

  protected readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  });
}
