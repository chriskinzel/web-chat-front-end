import {Injectable, NgZone} from '@angular/core';

type Handler = () => void;

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  private stopHandlers: Handler[] = [];

  private isDancing = false;
  private isFlipped = false;

  private readonly danceInterval = 500;

  constructor(private ngZone: NgZone) {}

  public dance() {
    if (!this.isDancing) {
      this.isDancing = true;

      this.ngZone.runOutsideAngular(() => {
        const updateDance = () => {
          this.allElements.forEach(element => {
            element.style.transition = `transform ${this.danceInterval / 1000}s`;

            const randomAngle = Math.random() * 20 - 10;
            element.style.transform = `rotate3d(${Math.random()},${Math.random()},${Math.random()},${randomAngle}deg)`;
          });
        };

        updateDance();
        const danceTimer = setInterval(updateDance, this.danceInterval);

        this.stopHandlers.push(() => {
          this.ngZone.runOutsideAngular(() => {
            clearInterval(danceTimer);

            this.allElements.forEach(element => {
              element.style.transform = 'rotate3d(1,1,1,0deg)';
            });

            setTimeout(() => {
              this.allElements.forEach(element => {
                element.style.transition = '';
                element.style.transform = '';
              });

              this.isDancing = false;
            }, this.danceInterval);
          });
        });
      });
    }
  }

  public flip() {
    if (!this.isFlipped) {
      this.isFlipped = true;

      const originalBodyTransform = document.body.style.transform;
      document.body.style.transform = 'scale(1,-1)';

      this.stopHandlers.push(() => {
        document.body.style.transform = originalBodyTransform;
        this.isFlipped = false;
      });
    }
  }

  public stop() {
    this.stopHandlers.forEach(handler => handler());
    this.stopHandlers = [];
  }

  private get allElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll('body *'));
  }
}
