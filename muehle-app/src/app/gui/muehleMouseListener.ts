import {MuehleComponent } from './../muehle.component';
import {Util} from './../Util';
import {ZugGenerator} from './../ZugGenerator';
import {Stellung} from './../Stellung';


export class muehleMouseListener
{
    muehleComponent: MuehleComponent;


    zugGen: ZugGenerator = new ZugGenerator();
    alleAktuellGueltigenStellungen: Array<Stellung>;

    constructor(muehleComponent: MuehleComponent)
    {
        this.muehleComponent = muehleComponent;
        const fensterBreite = this.muehleComponent.canvas.nativeElement.offsetWidth;
        const fensterHoehe = this.muehleComponent.canvas.nativeElement.offsetHeight;

        if (fensterBreite < fensterHoehe)
        {
            this.muehleComponent.spielfeldgroesse = fensterBreite;
        }
        else
        {
            this.muehleComponent.spielfeldgroesse = fensterHoehe;
        }
        this.muehleComponent.abstand = Math.round(this.muehleComponent.spielfeldgroesse / 8 );
        this.muehleComponent.durchmesser = Math.round(this.muehleComponent.abstand * (1 - this.muehleComponent.faktor));
        this.muehleComponent.radius = this.muehleComponent.durchmesser / 2;
        this.muehleComponent.canvas.nativeElement.addEventListener('mousedown', this.mousePressed.bind(this), false);
        this.muehleComponent.canvas.nativeElement.addEventListener('touchstart', this.fingerPressed.bind(this), false);
        this.muehleComponent.canvas.nativeElement.addEventListener('mouseup', this.mouseReleased.bind(this), false);
        this.muehleComponent.canvas.nativeElement.addEventListener('touchend', this.fingerReleased.bind(this), false);
        this.muehleComponent.canvas.nativeElement.addEventListener('mousemove', this.mouseDragged.bind(this), false);
        this.muehleComponent.canvas.nativeElement.addEventListener('touchmove', this.fingerDragged.bind(this), false);

    }

    mousePressed(evt: MouseEvent): void{
        this.pressed(evt.offsetX, evt.offsetY);
    }
    fingerPressed(evt: TouchEvent): void{
        const touchobj = evt.changedTouches[0]; // erster Finger
        evt.preventDefault();
        const rect = this.muehleComponent.canvas.nativeElement.getBoundingClientRect();

        this.pressed(touchobj.pageX - rect.left, touchobj.pageY - rect.top);
    }
    pressed(pressedX: number, pressedY: number): void
    {
        /*  console.log('pressedX: ' + pressedX);
            console.log('pressedY: ' + pressedY); */
        // Wenn das Spiel nicht am laufen ist, darf kein Spielstein verschoben werden. Dasselbe
        // gilt, wenn der Mensch nicht am Zug ist.
        if (!this.muehleComponent.getSpielIstGestartet() || !this.muehleComponent.istMenschAmZug())
        {
            return;
        }
        let eigen = 0;

        if (this.muehleComponent.getAktuelleStellung().getAmZug() === Util.WEISS)
        {
            this.muehleComponent.grafikSpielsteinPositionen[0][0] = 3;
            this.muehleComponent.grafikSpielsteinPositionen[0][1] = 8 +  this.muehleComponent.faktor;
        }
        else
        {
            this.muehleComponent.grafikSpielsteinPositionen[0][0] = 5;
            this.muehleComponent.grafikSpielsteinPositionen[0][1] = 8 +  this.muehleComponent.faktor;
        }
        let posAktuell = -1;
        for (let posNr = 0; posNr < 25; posNr++)
        {
            const xVon = Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posNr][0]) -
                                      this.muehleComponent.radius);
            const yVon = Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posNr][1]) -
                                      this.muehleComponent.radius);

            const xBis = xVon + this.muehleComponent.durchmesser;
            const yBis = yVon + this.muehleComponent.durchmesser;

            if (pressedX >= xVon && pressedX <= xBis && pressedY >= yVon
                    && pressedY <= yBis)
            {
                posAktuell = posNr;
            }
        }


        if (posAktuell !== -1)
        {
            if (this.muehleComponent.getAktuelleStellung().getAmZug() === Util.SCHWARZ)
            {
                eigen = 1;
            }
            if (this.muehleComponent.getComputerMensch()[eigen] === Util.MENSCH)
            {
                if (!this.muehleComponent.menschKannSchlagen)
                {
                    if (this.muehleComponent.getAktuelleStellung().istSteinNummerVonFarbeBesetzt(
                            eigen, posAktuell))
                    {
                        this.muehleComponent.spielsteinInBewegung = true;
                        this.muehleComponent.spielsteinBewegungX = pressedX;
                        this.muehleComponent.spielsteinBewegungY = pressedY;
                        this.muehleComponent.zeichneSpielfeld();
                        this.muehleComponent.mousePosVon = posAktuell;
                    }
                }
                else
                {
                    for (const gueltigeStellung of this.alleAktuellGueltigenStellungen){
                        const gueltigerZug = gueltigeStellung.getLetzterZug();
                        if (gueltigerZug.getPosBis() === this.muehleComponent.mousePosBis
                                && gueltigerZug.getPosVon() === this.muehleComponent.mousePosVon
                                && gueltigerZug.getPosSteinWeg() === posAktuell)
                        {
                            this.muehleComponent.setNeuerZugMensch(gueltigerZug);
                            this.muehleComponent.menschKannSchlagen = false;
                            this.muehleComponent.mousePosVon = -1;
                            this.muehleComponent.mousePosBis = -1;
                        }
                    }
                }
            }

        }
    }
    mouseReleased(evt: MouseEvent): void{
        this.released(evt.offsetX, evt.offsetY);
    }

    fingerReleased(evt: TouchEvent): void{
        const touchobj = evt.changedTouches[0]; // erster Finger
        evt.preventDefault();
        const rect = this.muehleComponent.canvas.nativeElement.getBoundingClientRect();
        this.released(touchobj.clientX - rect.left, touchobj.clientY - rect.top);
    }
    released(releasedX: number, releasedY: number): void
    {
        // Wenn das Spiel nicht am laufen ist, darf kein Spielstein verschoben werden. Dasselbe
        // gilt, wenn der Mensch nicht am Zug ist.
        if (!this.muehleComponent.getSpielIstGestartet() || !this.muehleComponent.istMenschAmZug())
        {
            return;
        }
        this.muehleComponent.spielsteinInBewegung = false;
        if (!this.muehleComponent.menschKannSchlagen)
        {



            this.muehleComponent.mousePosBis = -1;
            for (let posNr = 1; posNr < 25; posNr++)
            {

                const xVon = Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posNr][0] ) -
                                         this.muehleComponent.radius);
                const yVon = Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posNr][1] ) -
                                         this.muehleComponent.radius);

                const xBis = xVon + this.muehleComponent.durchmesser;
                const yBis = yVon + this.muehleComponent.durchmesser;

                if (releasedX >= xVon && releasedX <= xBis && releasedY >= yVon
                        && releasedY <= yBis)
                {
                    this.muehleComponent.mousePosBis = posNr;
                }
            }

            if (this.muehleComponent.mousePosBis !== -1)
            {
                this.alleAktuellGueltigenStellungen = this.zugGen.ermittleAlleZuege(this.muehleComponent.getAktuelleStellung() as Stellung,
                        this.muehleComponent.stellungsFolge.length, false);
                for (const gueltigeStellung of this.alleAktuellGueltigenStellungen)
                {
                    const gueltigerZug = gueltigeStellung.getLetzterZug();
                    if (gueltigerZug.getPosBis() === this.muehleComponent.mousePosBis
                            && gueltigerZug.getPosVon() === this.muehleComponent.mousePosVon)
                    {
                        if (gueltigerZug.getPosSteinWeg() === 0)
                        {
                            this.muehleComponent.setNeuerZugMensch(gueltigerZug);
                            this.muehleComponent.getAktuelleStellung().setLetzterZug(gueltigerZug);
                            this.muehleComponent.menschKannSchlagen = false;
                        }
                        else
                        {
                            this.muehleComponent.menschKannSchlagen = true;
                        }

                    }
                }
            }
        }
        this.muehleComponent.zeichneSpielfeld();
    }

    mouseDragged(evt: MouseEvent): void{
        this.dragged(evt.offsetX, evt.offsetY);
    }

    fingerDragged(evt: TouchEvent): void{
        const touchobj = evt.changedTouches[0]; // erster Finger
        evt.preventDefault();
        const rect = this.muehleComponent.canvas.nativeElement.getBoundingClientRect();
        this.dragged(touchobj.clientX - rect.left, touchobj.clientY - rect.top);
    }
    dragged(draggedX: number, draggedY: number): void
    {
        if (this.muehleComponent.spielsteinInBewegung)
        {
            this.muehleComponent.spielsteinBewegungX = draggedX;
            this.muehleComponent.spielsteinBewegungY = draggedY;
            this.muehleComponent.zeichneSpielfeld();
        }
    }

}
