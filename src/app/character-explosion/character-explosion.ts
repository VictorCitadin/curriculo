import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-character-explosion',
  standalone: true,
  templateUrl: './character-explosion.html',
  styleUrl: './character-explosion.scss'
})
export class CharacterExplosion implements AfterViewInit, OnDestroy {
  @ViewChild('canvasEl') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  @Input() startX: number = 0;
  @Input() startY: number = 0;
  @Output() animationComplete = new EventEmitter<void>();

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private isAnimating = false;
  private animationFrameId: number = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');
    if (context) {
      this.ctx = context;
    }

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    this.startExplosion();
  }

  startExplosion() {
    this.particles = [];
    // Mais partículas já que elas aparecem em momentos diferentes
    const numParticles = 200; 
    
    for (let i = 0; i < numParticles; i++) {
      this.particles.push(new Particle(this.startX, this.startY));
    }
    
    this.isAnimating = true;
    this.animate();
  }

  animate() {
    if (!this.isAnimating) return;

    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    let allDead = true;
    
    this.particles.forEach(p => {
      p.update();
      p.draw(this.ctx);
      if (!p.isDead) {
        allDead = false;
      }
    });

    if (allDead) {
      this.isAnimating = false;
      this.animationComplete.emit();
    } else {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number = 0;
  
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/\\';
  char: string;
  size: number = Math.random() * 20 + 12; // Tamanhos variados
  
  delay: number; // Tempo de espera antes de aparecer
  activeFrameCount = 0;
  changeInterval = Math.floor(Math.random() * 8 + 4); // Muda a cada 4~11 frames
  changesCount = 0;
  maxChanges = Math.floor(Math.random() * 2) + 3; // Exatamente 3 ou 4 mudanças
  isDead = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    // Velocidade de espalhamento
    const speed = Math.random() * 10 + 4; 
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.char = this.chars[Math.floor(Math.random() * this.chars.length)];
    
    // "discordenadamente": partículas surgem em momentos variados ao longo de 1.5 segundos
    this.delay = Math.floor(Math.random() * 90);
  }

  update() {
    if (this.isDead) return;

    if (this.delay > 0) {
      // Elas se movem enquanto invisíveis para que quando aparecerem, já estejam mais perto das bordas.
      // Isso dá o efeito de que viajaram do centro e apareceram de repente no caminho.
      this.x += this.vx;
      this.y += this.vy;
      this.delay--;
      return;
    }

    // Agora está visível
    if (this.activeFrameCount === 0) {
      this.alpha = 1; // Aparece instantaneamente
    }

    // Continua se movendo para as bordas (pode ser mais devagar agora se quisermos, mas manter a mesma velocidade fica legal)
    this.x += this.vx;
    this.y += this.vy;
    
    this.activeFrameCount++;

    if (this.changesCount < this.maxChanges) {
      // Enquanto não mudou as 3 vezes...
      if (this.activeFrameCount % this.changeInterval === 0) {
        this.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        this.changesCount++;
      }
    } else {
      // Após mudar ~3 vezes, some gradualmente e rápido
      this.alpha -= 0.08; 
      if (this.alpha <= 0) {
        this.isDead = true;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0 || this.delay > 0 || this.isDead) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = `${this.size}px monospace`;
    ctx.fillStyle = '#666666'; // cinza escuro chique
    ctx.fillText(this.char, this.x, this.y);
    ctx.restore();
  }
}
