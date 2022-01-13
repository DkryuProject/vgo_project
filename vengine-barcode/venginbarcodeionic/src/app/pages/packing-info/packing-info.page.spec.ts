import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackingInfoPage } from './packing-info.page';

describe('PackingInfoPage', () => {
  let component: PackingInfoPage;
  let fixture: ComponentFixture<PackingInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackingInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
