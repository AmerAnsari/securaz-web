import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@modules/header/header.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
    if (AuthService.isAuth()) {
      this.router.navigateByUrl(AuthService.SIGN_IN_REDIRECT)
    }
  }
}
