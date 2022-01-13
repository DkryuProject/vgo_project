import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackingListPage } from './packing-list.page';

describe('PackingListPage', () => {
  let component: PackingListPage;
  let fixture: ComponentFixture<PackingListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
