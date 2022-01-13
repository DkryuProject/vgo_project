import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendOutPage } from './send-out.page';

describe('SendOutPage', () => {
  let component: SendOutPage;
  let fixture: ComponentFixture<SendOutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendOutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
