import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { PackageComponent } from './components/package/package.component';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { HeaderComponent } from './components/header/header.component';


describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule, HttpClientTestingModule],
    declarations: [AppComponent, PackageComponent, HeaderComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
