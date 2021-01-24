import { MuehleComponent } from './../muehle.component';

export class spielbrettGrafik
{
    muehleComponent: MuehleComponent;
    private ctx: CanvasRenderingContext2D;

    mousePosBis = -1;
    mousePosVon = -1;

    constructor(muehleComponent: MuehleComponent)
    {
        this.muehleComponent = muehleComponent;
    }

    zeichneSpielBrett(): void
    {
        this.muehleComponent.ueberpruefeCanvasGroesse();
        const hintergrundfarbe = '#fadfbe';

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

        this.ctx = this.muehleComponent.canvas.nativeElement.getContext('2d');


        this.ctx.lineWidth = 1;
        // Spielbrett zeichnen
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, fensterBreite, fensterHoehe);
        this.ctx.fillStyle = hintergrundfarbe;
        this.ctx.fillRect(this.muehleComponent.abstand / 2, this.muehleComponent.abstand / 2,
                          7 * this.muehleComponent.abstand, 7 * this.muehleComponent.abstand);
        this.ctx.strokeStyle = 'black';
        this.ctx.beginPath();
        this.ctx.moveTo(this.muehleComponent.abstand, this.muehleComponent.abstand);
        this.ctx.lineTo(7 * this.muehleComponent.abstand, this.muehleComponent.abstand);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.muehleComponent.abstand, this.muehleComponent.abstand);
        this.ctx.lineTo(this.muehleComponent.abstand, 7 * this.muehleComponent.abstand);
        this.ctx.lineTo(7 * this.muehleComponent.abstand, 7 * this.muehleComponent.abstand);
        this.ctx.lineTo(7 * this.muehleComponent.abstand, this.muehleComponent.abstand);
        this.ctx.lineTo(this.muehleComponent.abstand, this.muehleComponent.abstand);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(2 * this.muehleComponent.abstand, 2 * this.muehleComponent.abstand);
        this.ctx.lineTo(6 * this.muehleComponent.abstand, 2 * this.muehleComponent.abstand);
        this.ctx.lineTo(6 * this.muehleComponent.abstand, 6 * this.muehleComponent.abstand);
        this.ctx.lineTo(2 * this.muehleComponent.abstand, 6 * this.muehleComponent.abstand);
        this.ctx.lineTo(2 * this.muehleComponent.abstand, 2 * this.muehleComponent.abstand);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(3 * this.muehleComponent.abstand, 3 * this.muehleComponent.abstand);
        this.ctx.lineTo(5 * this.muehleComponent.abstand, 3 * this.muehleComponent.abstand);
        this.ctx.lineTo(5 * this.muehleComponent.abstand, 5 * this.muehleComponent.abstand);
        this.ctx.lineTo(3 * this.muehleComponent.abstand, 5 * this.muehleComponent.abstand);
        this.ctx.lineTo(3 * this.muehleComponent.abstand, 3 * this.muehleComponent.abstand);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(4 * this.muehleComponent.abstand, this.muehleComponent.abstand);
        this.ctx.lineTo(4 * this.muehleComponent.abstand, 3 * this.muehleComponent.abstand);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(4 * this.muehleComponent.abstand, 5 * this.muehleComponent.abstand);
        this.ctx.lineTo(4 * this.muehleComponent.abstand, 7 * this.muehleComponent.abstand);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.muehleComponent.abstand, 4 * this.muehleComponent.abstand);
        this.ctx.lineTo(3 * this.muehleComponent.abstand, 4 * this.muehleComponent.abstand);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(5 * this.muehleComponent.abstand, 4 * this.muehleComponent.abstand);
        this.ctx.lineTo(7 * this.muehleComponent.abstand, 4 * this.muehleComponent.abstand);
        this.ctx.stroke();

        // Zeichne Rand fuer Aussensteine
        const abstandHalbe = Math.round(this.muehleComponent.abstand / 2 );

        this.ctx.fillStyle = hintergrundfarbe;
        this.ctx.strokeStyle = 'black';
        this.ctx.fillRect(3 * this.muehleComponent.abstand - abstandHalbe, (8 + this.muehleComponent.faktor) * this.muehleComponent.abstand - abstandHalbe,
                          this.muehleComponent.abstand , this.muehleComponent.abstand);
        this.ctx.strokeRect(3 * this.muehleComponent.abstand - abstandHalbe, (8 + this.muehleComponent.faktor) * this.muehleComponent.abstand - abstandHalbe,
                          this.muehleComponent.abstand , this.muehleComponent.abstand);

        this.ctx.fillRect(5 * this.muehleComponent.abstand - abstandHalbe, (8 + this.muehleComponent.faktor) * this.muehleComponent.abstand - abstandHalbe,
        this.muehleComponent.abstand , this.muehleComponent.abstand);
        this.ctx.strokeRect(5 * this.muehleComponent.abstand - abstandHalbe, (8 + this.muehleComponent.faktor) * this.muehleComponent.abstand - abstandHalbe,
                          this.muehleComponent.abstand , this.muehleComponent.abstand);

        if (this.muehleComponent.getAktuelleStellung() != null)
        {
           // Zeichne weisse Steine der Stellung
           this.ctx.fillStyle = 'white';

           for (let bitNr = 1; bitNr < 25; bitNr++)
           {
                if (this.muehleComponent.getAktuelleStellung().istSteinNummerVonFarbeBesetzt(0, bitNr))
                {
                    this.zeichneSpielstein(Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[bitNr][0])),
                                           Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[bitNr][1])),
                                           'white', 'black' );
                }
           }
           // Zeichne schwarze Steine der Stellung
           for (let bitNr = 1; bitNr < 25; bitNr++)
           {
              if (this.muehleComponent.getAktuelleStellung().istSteinNummerVonFarbeBesetzt(1, bitNr))
                {
                    this.zeichneSpielstein(Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[bitNr][0])),
                                           Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[bitNr][1])),
                                           'black', 'white' );
                }
           }
           //  wenn Muehle geschlossen wurde, dann markiere alle schlagbaren Steine
           if (this.muehleComponent.menschKannSchlagen)
           {
              for (const gueltigerZug of this.muehleComponent.getAlleAktuellGueltigenZuege()){

                   if (gueltigerZug.getPosBis() === this.muehleComponent.mousePosBis
                           && gueltigerZug.getPosVon() === this.muehleComponent.mousePosVon)
                   {
                        this.zeichneSpielstein(Math.round(this.muehleComponent.abstand *
                                                (this.muehleComponent.grafikSpielsteinPositionen[gueltigerZug.getPosSteinWeg()][0])),
                                               Math.round(this.muehleComponent.abstand *
                                                (this.muehleComponent.grafikSpielsteinPositionen[gueltigerZug.getPosSteinWeg()][1])),
                                              'red', 'red');
                   }
              }
              // Zeichne den Stein, der eine Muehle zumacht in Grau, solange noch kein Stein ausgewaelt wurde, der geschlagen werden soll.
              this.zeichneSpielstein(Math.round(this.muehleComponent.abstand *
                                        (this.muehleComponent.grafikSpielsteinPositionen[this.muehleComponent.mousePosBis][0])),
                                     Math.round(this.muehleComponent.abstand *
                                        (this.muehleComponent.grafikSpielsteinPositionen[this.muehleComponent.mousePosBis][1])),
                                     'grey', 'red' );
           }

           // Zeichne Steine Ausserhalb
           if (this.muehleComponent.getAktuelleStellung().getAnzahlSteineAussen()[0] > 0)
           {
                this.zeichneSpielstein(3 * this.muehleComponent.abstand , (8 + this.muehleComponent.faktor) * this.muehleComponent.abstand , 'white', 'black');

                this.ctx.font = '12px Arial';
                this.ctx.fillStyle = 'black';
                this.ctx.fillText(this.muehleComponent.getAktuelleStellung().getAnzahlSteineAussen()[0].toString(),
                             3 * this.muehleComponent.abstand - 3, (8 + this.muehleComponent.faktor) * this.muehleComponent.abstand + 5);
           }
           if (this.muehleComponent.getAktuelleStellung().getAnzahlSteineAussen()[1] > 0)
           {
                this.zeichneSpielstein(5 * this.muehleComponent.abstand, (8 + this.muehleComponent.faktor) * this.muehleComponent.abstand, 'black', 'white');

                this.ctx.font = '12px Arial';
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(this.muehleComponent.getAktuelleStellung().getAnzahlSteineAussen()[1].toString(),
                            5 * this.muehleComponent.abstand - 3, (8 + this.muehleComponent.faktor) * this.muehleComponent.abstand + 5);
           }

           if (this.muehleComponent.spielsteinInBewegung)
           {
                this.zeichneSpielstein(this.muehleComponent.spielsteinBewegungX ,
                                       this.muehleComponent.spielsteinBewegungY, 'green', 'green');
           }

           // Markiere Zug: Position von und Position Bis  mit gruenem Kreuz, geschlagenen Stein mit rotem Kreuz
           this.zeichneEinKreuz(this.muehleComponent.getAktuelleStellung().getLetzterZug().getPosVon(), 'green');
           this.zeichneEinKreuz(this.muehleComponent.getAktuelleStellung().getLetzterZug().getPosBis(), 'green');
           this.zeichneEinKreuz(this.muehleComponent.getAktuelleStellung().getLetzterZug().getPosSteinWeg(), 'red');
        }
    }

    zeichneSpielstein(x: number, y: number, fuellFarbe: string, randFarbe: string): void{
        this.ctx.fillStyle = fuellFarbe;
        this.ctx.beginPath();
        this.ctx.arc(x, y, Math.round(this.muehleComponent.abstand * (1 - this.muehleComponent.faktor) / 2), 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = randFarbe;
        this.ctx.stroke();
    }
    zeichneEinKreuz(posStein: number, farbe: string): void{
        if (typeof posStein !== 'undefined' && posStein !== 0)
        {
            this.ctx.strokeStyle = farbe;

            this.ctx.beginPath();
            this.ctx.moveTo(Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posStein][0] -
                               this.muehleComponent.faktor) + this.muehleComponent.abstand / 4),
                            Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posStein][1] -
                               this.muehleComponent.faktor) + this.muehleComponent.abstand / 4));

            this.ctx.lineTo(Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posStein][0] -
                               this.muehleComponent.faktor) + this.muehleComponent.abstand * 3 / 7),
                            Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posStein][1] -
                               this.muehleComponent.faktor) + this.muehleComponent.abstand * 3 / 7));
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posStein][0] -
                               this.muehleComponent.faktor) + this.muehleComponent.abstand * 3 / 7),
                            Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posStein][1] -
                               this.muehleComponent.faktor) + this.muehleComponent.abstand / 4));

            this.ctx.lineTo(Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posStein][0] -
                               this.muehleComponent.faktor) + this.muehleComponent.abstand / 4),
                            Math.round(this.muehleComponent.abstand * (this.muehleComponent.grafikSpielsteinPositionen[posStein][1] -
                               this.muehleComponent.faktor) + this.muehleComponent.abstand * 3 / 7));
            this.ctx.stroke();
        }

    }
}

