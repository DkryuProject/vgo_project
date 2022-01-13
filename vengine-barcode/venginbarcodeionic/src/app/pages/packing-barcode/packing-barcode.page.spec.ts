import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackingBarcodePage } from './packing-barcode.page';

describe('PackingBarcodePage', () => {
  let component: PackingBarcodePage;
  let fixture: ComponentFixture<PackingBarcodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingBarcodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackingBarcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
