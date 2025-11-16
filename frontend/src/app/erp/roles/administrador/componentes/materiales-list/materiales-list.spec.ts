import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesList } from './materiales-list';

describe('MaterialesList', () => {
  let component: MaterialesList;
  let fixture: ComponentFixture<MaterialesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
