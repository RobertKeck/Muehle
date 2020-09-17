import { Component } from '@angular/core';
import { SpielThread } from './SpielThread';
import {ZugGenerator} from './ZugGenerator';
import {Stellung} from './Stellung';
import {Util} from './Util';
import {Zug} from './Zug';
import {KeckEngine} from './KeckEngine';
import {IStellungAllgemein} from './IStellungAllgemein';
import {IZug} from './IZug';
import {IEngine} from './IEngine';
import {ISpiel} from './ISpiel';
import {IStellung} from './IStellung';


@Component({
  selector: 'app-root',
  templateUrl: './muehle.component.html',
  styleUrls: ['./muehle.component.css']
})
export class MuehleComponent implements ISpiel
{
    title = 'muehle-app';
    logTextField = '';
    comboboxZugtiefe = 5;
    comboboxWeiss = 'Computer';
    comboboxSchwarz = 'Computer';

    computerEngineWeiss: IEngine = null;
    computerEngineSchwarz: IEngine = null;
    // iMuehleFrame: IMuehleFrame;
    stellungsFolgeSchwarzWeiss: number[] = new Array<number>();
    stellungsFolge: IStellungAllgemein[] = new Array<IStellungAllgemein>();
    aktuelleStellungKopie: Stellung;
    stellungsFolgeSchwarzWeissKopie: number[];
    stellungsFolgeKopie: Array<IStellungAllgemein>;
    private aktuelleStellung: Stellung           = null;
    spielThread: SpielThread;
    alleAktuellGueltigenStellungen: Stellung[];
    alleAktuellGueltigenStellungenKopie: Stellung[];
    // private neueStellungMensch: Stellung = null;
    private neuerZugMensch: Zug = null;
    /**
     * computerMensch[0] = COMPUTER -- Weiss wird vom Computer gespielt
     * computerMensch[0] = MENSCH -- Weiss wird vom Menschen gespielt
     * computerMensch[1] = COMPUTER -- Schwarz wird vom Computer gespielt
     * computerMensch[1] = MENSCH -- Schwarz wird vom Menschen gespielt
     */
    computerMensch: number[] = new Array<number>();



    /**
     * Main
     *
     */
    /*
    public static void main(String[] args)
    {
        Spiel spiel = new Spiel();
    }
    */


    /**
     * Konstruktor
     */
    construtor(): void
    {
        /////// this.iMuehleFrame = new MuehleFrame(this);
        this.erstelleStartStellung();
        /////// this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);
    }


    /**
     * Spiele-Thread wird gestoppt
     */
    stoppeSpiel(): void
    {
      this.computerEngineWeiss = null;
      this.computerEngineSchwarz = null;

      if (this.spielThread != null && this.spielThread.isAlive())
      {
            this.spielThread.stop();

            this.aktuelleStellung = this.aktuelleStellungKopie.kopiereStellung();

            this.stellungsFolgeSchwarzWeiss = this.stellungsFolgeSchwarzWeissKopie.slice();
            this.stellungsFolge = this.stellungsFolgeKopie.slice();

            // ermittle die aktuell gueltigen Zuege
            const zugGen = new ZugGenerator();
            this.alleAktuellGueltigenStellungen = zugGen.ermittleAlleZuege(this.aktuelleStellung,
                    this.stellungsFolge.length, false);

            this.log('Das Spiel wurde unterbrochen  -  mit \'Start\' kann es fortgesetzt werden.');
            //// this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);
        }

    }
    zugZurueck(): void
    {

        this.stoppeSpiel();

        if (this.stellungsFolge.length > 1)
        {

            this.stellungsFolge.pop();
            this.stellungsFolgeSchwarzWeiss.pop();
            this.aktuelleStellung = (this.stellungsFolge[(this.stellungsFolge.length - 1)] as Stellung).kopiereStellung();
            const zugGen = new ZugGenerator();
            this.aktuelleStellungKopie = this.aktuelleStellung.kopiereStellung();

            this.stellungsFolgeSchwarzWeissKopie = this.stellungsFolgeSchwarzWeiss.slice();
            this.stellungsFolgeKopie = this.stellungsFolge.slice();

            // ermittle die aktuell gueltigen Zuege
            this.alleAktuellGueltigenStellungen = zugGen.ermittleAlleZuege(this.aktuelleStellung,
                    this.stellungsFolge.length, false);

            this.alleAktuellGueltigenStellungenKopie = this.alleAktuellGueltigenStellungen.slice();


            this.log('Der letzte Zug wurde rueckgaengig gemacht. Das Spiel wurde unterbrochen und kann mit \'Start\' fortgesetzt werden.');
            // Stellung zeichnen
            this.zeichneSpielfeld();

        }
    }

    loescheSpielfeld(): void
    {
        let ausgabe = '';
        if (this.spielThread != null && this.spielThread.isAlive())
        {
          this.spielThread.stop();
          this.computerEngineWeiss = null;
          this.computerEngineSchwarz = null;

          ausgabe += 'Das Spiel wurde beendet und das ';
        }
        this.erstelleStartStellung();
        ausgabe += 'Spielfeld wurde gel�scht.';
        this.log(ausgabe);
        //// this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);

    }



    /**
     * Ausgabe der meldung in JTextfield und in Console
     *
     */
    log(meldung: string): void
    {
        // this.iMuehleFrame.log(meldung);
        this.logTextField += meldung;
        console.log(meldung);
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
        this.stellungsFolgeSchwarzWeiss = new Array<number>();
        this.stellungsFolge =  new Array<IStellungAllgemein>();
        this.stellungsFolgeSchwarzWeiss.push(this.aktuelleStellung.weissSchwarz);
        this.stellungsFolge.push(this.aktuelleStellung);
    }


    zeichneSpielfeld(): void
    {
        // TODO
        // this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);
    }

    start(): void
    {

        this.logTextField += 'Spiel wurde gestartet..';
        if (this.spielThread != null)
        {
            this.spielThread.stop();
        }
        this.spielThread = new SpielThread(this);
        this.computerEngineWeiss = new KeckEngine();
        this.computerEngineSchwarz = new KeckEngine();
        // computerEngineSchwarz = new ZufallsEngine();

        this.spielThread.start();
    }



    getAlleAktuellGueltigenZuege(): IZug[]
    {
        const alleZuege = new Array<IZug>();


        for (const it of this.alleAktuellGueltigenStellungen)
        {
            alleZuege.push(it.getLetzterZug());
        }
        return alleZuege;
    }



    istSpielGestartet(): boolean
    {
        if (this.spielThread == null)
        {
            return false;
        }
        return this.spielThread.isAlive();
    }



    istMenschAmZug(): boolean
    {
        if (this.istSpielGestartet())
        {
            let eigen = 0;
            if (this.aktuelleStellung.getAmZug() === -1)
            {
                eigen = 1;
            }
            if (this.computerMensch[eigen] === Util.MENSCH)
            {
                return true;
            }
        }
        return false;
    }


    /*
    getMuehleFrame(): IMuehleFrame
    {
        return this.iMuehleFrame;
    }
    */


    getAktuelleStellung(): IStellung
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

    getComputerMensch(): number[]
    {
        return this.computerMensch;
    }

    setComputerMensch(computerMensch: number[]): void
    {
        this.computerMensch = computerMensch;
    }

    /**
     * Ermittelt zum uebergeben Zug die Stellung, die entsteht, wenn der Zug ausgefuehrt wird.
     * Wenn null zurueckgegeben wird, ist der Zug nicht gueltig
     */
     ermittleStellungZumGueltigenZug(gueltigerZug: Zug): Stellung
    {
       if (gueltigerZug == null){
         return null;
       }
       for (const stellung of this.alleAktuellGueltigenStellungen){
            if (stellung.getLetzterZug().getPosVon() === gueltigerZug.getPosVon()
               &&
               stellung.getLetzterZug().getPosBis() === gueltigerZug.getPosBis()
               &&
               stellung.getLetzterZug().getPosSteinWeg() === gueltigerZug.getPosSteinWeg() )
            {
                return stellung;
            }
       }
       return null;
    }
    getCBZugtiefe(): number{
      return this.comboboxZugtiefe;
    }
    getCBWeiss(): string{
      return this.comboboxWeiss;
    }
    getCBSchwarz(): string{
      return this.comboboxSchwarz;
    }
}
