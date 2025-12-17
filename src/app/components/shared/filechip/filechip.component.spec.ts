import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilechipComponent } from './filechip.component';

describe('FilechipComponent', () => {
  let component: FilechipComponent;
  let fixture: ComponentFixture<FilechipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilechipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilechipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
