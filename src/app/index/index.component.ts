import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
    if (AuthService.isAuth()) {
      console.log('Hello');
      this.router.navigateByUrl('credential')
    } else {
      this.router.navigateByUrl(AuthService.SIGN_OUT_REDIRECT)
    }
  }
}
