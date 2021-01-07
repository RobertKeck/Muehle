import {MuehleComponent } from './../muehle.component';
import {Util} from './../Util';
import {ZugGenerator} from './../ZugGenerator';
import {Stellung} from './../Stellung';


export class muehleMouseListener
{
    muehleComponent: MuehleComponent;
    abstand: number;

    zugGen: ZugGenerator = new ZugGenerator();
    alleAktuellGueltigenStellungen: Array<Stellung>;

    constructor(muehleComponent: MuehleComponent)
    {
        this.muehleComponent = muehleComponent;
        const fensterBreite = this.muehleComponent.canvas.nativeElement.offsetHeight;
        const fensterHoehe = this.muehleComponent.canvas.nativeElement.offsetWidth;

        if (fensterBreite < fensterHoehe)
        {
            this.muehleComponent.spielfeldgroesse = fensterBreite;
        }
        else
        {
            this.muehleComponent.spielfeldgroesse = fensterHoehe;
        }
        this.abstand = Math.round(this.muehleComponent.spielfeldgroesse / 9 );
        this.muehleComponent.canvas.nativeElement.addEventListener('mousedown', this.mousePressed.bind(this), false);
        this.muehleComponent.canvas.nativeElement.addEventListener('mouseup', this.mouseReleased.bind(this), false);
        this.muehleComponent.canvas.nativeElement.addEventListener('mousemove', this.mouseDragged.bind(this), false);
    }

    mousePressed(evt: MouseEvent): void
    {

        // Wenn das Spiel nicht am laufen ist, darf kein Spielstein verschoben werden. Dasselbe
        // gilt, wenn der Mensch nicht am Zug ist.
        if (!this.muehleComponent.istSpielGestartet() || !this.muehleComponent.istMenschAmZug())
        {
            return;
        }
        let eigen = 0;

        const durchmesser = Math.round(this.abstand * (1 - this.muehleComponent.faktor) );
        if (this.muehleComponent.getAktuelleStellung().getAmZug() === Util.WEISS)
        {
            this.muehleComponent.grafikSpielsteinPositionen[0][0] = 3;
            this.muehleComponent.grafikSpielsteinPositionen[0][1] = 8 + this.muehleComponent.faktor;
        }
        else
        {
            this.muehleComponent.grafikSpielsteinPositionen[0][0] = 5;
            this.muehleComponent.grafikSpielsteinPositionen[0][1] = 8 + this.muehleComponent.faktor;
        }
        let posAktuell = -1;
        for (let posNr = 0; posNr < 25; posNr++)
        {
            const xVon = Math.round(this.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posNr][0] -
                                   this.muehleComponent.faktor));
            const yVon = Math.round(this.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posNr][1] -
                                   this.muehleComponent.faktor));

            const xBis = xVon + durchmesser;
            const yBis = yVon + durchmesser;

            if (evt.offsetX >= xVon && evt.offsetX <= xBis && evt.offsetY >= yVon
                    && evt.offsetY <= yBis)
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
                        this.muehleComponent.spielsteinBewegungX = evt.offsetX;
                        this.muehleComponent.spielsteinBewegungY = evt.offsetY;
                        this.muehleComponent.zeichneStellung('');
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
    mouseReleased(evt: MouseEvent): void
    {
        // Wenn das Spiel nicht am laufen ist, darf kein Spielstein verschoben werden. Dasselbe
        // gilt, wenn der Mensch nicht am Zug ist.
        if (!this.muehleComponent.istSpielGestartet() || !this.muehleComponent.istMenschAmZug())
        {
            return;
        }
        this.muehleComponent.spielsteinInBewegung = false;
        if (!this.muehleComponent.menschKannSchlagen)
        {

            const durchmesser = Math.round(this.abstand * (1 - this.muehleComponent.faktor));
            if (this.muehleComponent.getAktuelleStellung().getAmZug() === Util.WEISS)
            {
                this.muehleComponent.grafikSpielsteinPositionen[0][0] = 3;
                this.muehleComponent.grafikSpielsteinPositionen[0][1] = 8;
            }
            else
            {
                this.muehleComponent.grafikSpielsteinPositionen[0][0] = 5;
                this.muehleComponent.grafikSpielsteinPositionen[0][1] = 8;
            }
            this.muehleComponent.mousePosBis = -1;
            for (let posNr = 1; posNr < 25; posNr++)
            {

                const xVon = Math.round(this.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posNr][0] -
                                                                                                   this.muehleComponent.faktor));
                const yVon = Math.round(this.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posNr][1] -
                                                                                                   this.muehleComponent.faktor));

                const xBis = xVon + durchmesser;
                const yBis = yVon + durchmesser;

                if (evt.offsetX >= xVon && evt.offsetX <= xBis && evt.offsetY >= yVon
                        && evt.offsetY <= yBis)
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

    mouseDragged(evt: MouseEvent): void
    {
        if (this.muehleComponent.spielsteinInBewegung)
        {
            this.muehleComponent.spielsteinBewegungX = evt.offsetX;
            this.muehleComponent.spielsteinBewegungY = evt.offsetY;
            this.muehleComponent.zeichneStellung('');
        }
    }

}
