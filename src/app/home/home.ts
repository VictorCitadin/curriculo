import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CharacterExplosion } from '../character-explosion/character-explosion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CharacterExplosion],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  isExploding = false;
  startX = 0;
  startY = 0;
  isFadingOut = false;

  constructor(private router: Router) {}

  onSaibaMaisClick(event: MouseEvent) {
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.isExploding = true;
    this.isFadingOut = true;
  }

  onAnimationComplete() {
    this.router.navigate(['/resume']);
  }
}
