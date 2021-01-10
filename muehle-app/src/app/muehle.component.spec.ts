import { TestBed, waitForAsync } from '@angular/core/testing';
import { MuehleComponent } from './muehle.component';

describe('MuehleComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MuehleComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MuehleComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'muehle-app'`, () => {
    const fixture = TestBed.createComponent(MuehleComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('muehle-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(MuehleComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('muehle-app app is running!');
  });
});
