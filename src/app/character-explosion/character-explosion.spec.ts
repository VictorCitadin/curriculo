import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterExplosion } from './character-explosion';

describe('CharacterExplosion', () => {
  let component: CharacterExplosion;
  let fixture: ComponentFixture<CharacterExplosion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterExplosion],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterExplosion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
