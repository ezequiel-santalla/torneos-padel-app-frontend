import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  authService = inject(AuthService);
  private router = inject(Router);
  private sweetAlertService = inject(SweetAlertService);

  ngOnInit() {
    this.authService.checkAuthStatus().subscribe();
  }

  async onLogout() {
    const userName = this.authService.name();

    const confirmed = await this.sweetAlertService.confirmLogout(userName || undefined);

    if (confirmed) {
      this.sweetAlertService.showLoading(
        'Cerrando sesión...',
        'Procesando...'
      );

      setTimeout(() => {
        this.authService.logout();
        this.sweetAlertService.close();

        this.sweetAlertService.showLogoutSuccess(userName || undefined);

        this.router.navigate(['/auth/login']);
      }, 800);
    }
  }
}
