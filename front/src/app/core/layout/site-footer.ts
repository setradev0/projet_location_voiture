import { Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  template: `
    <footer class="bg-slate-950 py-10 text-slate-400">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm sm:flex-row"
      >
        <p class="font-semibold text-white">Loca<span class="text-amber-400">Drive</span></p>
        <ul class="flex flex-wrap items-center gap-6">
          <li><a href="#" class="transition hover:text-white">Mentions légales</a></li>
          <li><a href="#" class="transition hover:text-white">CGV</a></li>
          <li><a href="#" class="transition hover:text-white">Confidentialité</a></li>
        </ul>
        <p>© 2026 LocaDrive. Tous droits réservés.</p>
      </div>
    </footer>
  `,
})
export class SiteFooter {}
