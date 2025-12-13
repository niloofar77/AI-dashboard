import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCustomComponent } from './header-custom.component';

describe('HeaderCustomComponent', () => {
  let component: HeaderCustomComponent;
  let fixture: ComponentFixture<HeaderCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
