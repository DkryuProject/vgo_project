import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Oauth2RedirectPage } from './oauth2-redirect.page';

describe('Oauth2RedirectPage', () => {
  let component: Oauth2RedirectPage;
  let fixture: ComponentFixture<Oauth2RedirectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Oauth2RedirectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Oauth2RedirectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
