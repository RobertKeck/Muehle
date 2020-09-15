
import {Stellung} from './Stellung';
import {Util} from './Util';
import {Zug} from './Zug';

import {IStellungAllgemein} from './IStellungAllgemein';
import {IZug} from './IZug';
import {ISpiel} from './ISpiel';



export class SpielTest implements ISpiel
{
    iMuehleFrame: IMuehleFrame;
    aktuelleStellung: Stellung  = null;
    spielIstGestartet = false;
    private neuerZugMensch: Zug    = null;
    computerMensch: number[]    = new Array<number>();


    /**
     * Main
     */
    /*
    public static void main(String[] args)
    {
        SpielTest spieltest = new SpielTest();
    }
    */


    /**
     * Konstruktor
     *
     */
    constructor()
    {
        // this.iMuehleFrame = new MuehleFrame(this);
        this.erstelleStartStellung();
        this.iMuehleFrame.zeichneStellung(this.getAktuelleStellung());
    }


    stoppeSpiel(): void
    {
        this.spielIstGestartet = false;
        this.iMuehleFrame.log('Spiel gestoppt');
    }


    loescheSpielfeld(): void
    {
        this.spielIstGestartet = false;
        this.iMuehleFrame.log('Spiel geloescht.');
    }


    zugZurueck(): void
    {
        this.iMuehleFrame.log('Zug Zurueck nicht implementiert.');
    }



    public start(): void
    {
        this.spielIstGestartet = true;
    }




    istMenschAmZug(): boolean
    {
        return true;
    }



    getAktuelleStellung(): IStellungAllgemein
    {
        return this.aktuelleStellung;
    }



    setAktuelleStellung(aktuelleStellung: IStellungAllgemein): void
    {
        this.aktuelleStellung = aktuelleStellung as Stellung;
    }



    getNeuerZugMensch(): IZug
    {
        return this.neuerZugMensch;
    }



    setNeuerZugMensch(neuerZug: IZug): void
    {
        this.neuerZugMensch = neuerZug as Zug;
    }



    erstelleStartStellung(): void
    {
        this.aktuelleStellung = new Stellung();
        this.aktuelleStellung.setAmZug(Util.WEISS);
        const initialAnzahlSteine = [9, 9];

        this.aktuelleStellung.setAnzahlSteine(initialAnzahlSteine);
        this.aktuelleStellung.setAnzahlSteineAussen(initialAnzahlSteine);
        this.aktuelleStellung.anzahlMuehlen[0] = 0;
        this.aktuelleStellung.anzahlMuehlen[1] = 0;
//        this.aktuelleStellung.anzahlOffenerMuehlen[0] = 0;
//        this.aktuelleStellung.anzahlOffenerMuehlen[1] = 0;
        this.aktuelleStellung.anzahlFreierNachbarfelder[0] = 0;
        this.aktuelleStellung.anzahlFreierNachbarfelder[1] = 0;
        for (let i = 0; i < 17; i++)
        {
            this.aktuelleStellung.muehle[0][i] = 0;
            this.aktuelleStellung.muehle[1][i] = 0;
//            this.aktuelleStellung.offeneMuehle[0][i] = 0;
//            this.aktuelleStellung.offeneMuehle[1][i] = 0;
        }
        const leeresSpielfeld = [0, 0];
        this.aktuelleStellung.setSpielpositionen(leeresSpielfeld);
        this.aktuelleStellung.setBewertung(0);
        this.aktuelleStellung.weissSchwarz = 0;

        this.computerMensch[0] = Util.MENSCH; // Weiss
        this.computerMensch[1] = Util.MENSCH; // Schwarz
    }



    getAlleAktuellGueltigenZuege(): IZug[]
    {
        const zugListe = new Array<IZug>();
        return zugListe;
    }



    getComputerMensch(): number[]
    {
        return this.computerMensch;
    }
    istSpielGestartet(): boolean{
      return this.spielIstGestartet;
    }
}
