import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackingMainPage } from './packing-main.page';

describe('PackingMainPage', () => {
  let component: PackingMainPage;
  let fixture: ComponentFixture<PackingMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingMainPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackingMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
