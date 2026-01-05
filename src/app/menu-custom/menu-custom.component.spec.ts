import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCustomComponent } from './menu-custom.component';

describe('MenuCustomComponent', () => {
  let component: MenuCustomComponent;
  let fixture: ComponentFixture<MenuCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
