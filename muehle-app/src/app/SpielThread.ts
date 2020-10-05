import { MuehleComponent } from './muehle.component';
import {ZugGenerator} from './ZugGenerator';
import {Stellung} from './Stellung';
import {Util} from './Util';
import {Zug} from './Zug';

export class SpielThread // extends Thread // TODO worker child process erstellen
{

    muehleComponent: MuehleComponent;
    muehleComponentZuEnde = true;



    constructor(muehleComponent: MuehleComponent)
    {
        this.muehleComponent = muehleComponent;
    }



    // muehleComponentschleife
    public run = async (): Promise<void> => {


        this.muehleComponentZuEnde = false;
        const zugGen = new ZugGenerator();
        let zugNr = 0;
        let zugtiefeMax: number = Number(this.muehleComponent.getCBZugtiefe());


        while (!this.muehleComponentZuEnde)
        { // && muehleComponent.threadGestoppt == false){

            this.muehleComponent.aktuelleStellungKopie = this.muehleComponent.getAktuelleStellung().kopiereStellung() as Stellung;
            this.muehleComponent.stellungsFolgeZobristKeysKopie = this.muehleComponent.stellungsFolgeZobristKeys.slice();

            this.muehleComponent.stellungsFolgeKopie = this.muehleComponent.stellungsFolge.slice();

            // ermittle die aktuell gueltigen Zuege
            this.muehleComponent.alleAktuellGueltigenStellungen = zugGen.ermittleAlleZuege(
                    this.muehleComponent.getAktuelleStellung() as Stellung,
                    this.muehleComponent.stellungsFolge.length, false);
            this.muehleComponent.alleAktuellGueltigenStellungenKopie = this.muehleComponent.alleAktuellGueltigenStellungen.slice();


            zugtiefeMax = this.muehleComponent.getCBZugtiefe();
            let eigen = 0;
            if (this.muehleComponent.getAktuelleStellung().getAmZug() === -1)
            {
                eigen = 1;
            }


            if (this.muehleComponent.getCBWeiss() === ('Mensch'))
            {
                this.muehleComponent.computerMensch[0] = Util.MENSCH;
            }
            else
            {
                this.muehleComponent.computerMensch[0] = Util.COMPUTER;
            }
            if (this.muehleComponent.getCBSchwarz() === ('Mensch'))
            {
                this.muehleComponent.computerMensch[1] = Util.MENSCH;
            }
            else
            {
                this.muehleComponent.computerMensch[1] = Util.COMPUTER;
            }


            if (this.muehleComponent.computerMensch[eigen] === Util.MENSCH)
            {
                // Mensch ist am Zug

                if (this.muehleComponent.getAktuelleStellung().getAmZug() === Util.WEISS)
                {
                    this.muehleComponent.log('Weiss ist am Zug');
                }
                else
                {
                    this.muehleComponent.log('Schwarz ist am Zug');
                }
                this.muehleComponent.setNeuerZugMensch(null);
                /***************************************
                 * TODO  change this*/
                while (this.muehleComponent.getNeuerZugMensch() == null)
                {
                    // do nothing  -- warte auf Benutzereingabe
                }
                this.muehleComponent.setAktuelleStellung(this.muehleComponent.ermittleStellungZumGueltigenZug(
                        this.muehleComponent.getNeuerZugMensch() as Zug).kopiereStellung());
                /******************************************/
            }
            else
            {
                let computerZug = null;
                // Computer ueberlegt den naechsten Zug
                if (this.muehleComponent.getAktuelleStellung().getAmZug() === Util.WEISS)
                {
                    this.muehleComponent.log(this.muehleComponent.computerEngineWeiss.getEngineName() + ' ist mit Weiss am Zug. Bitte warten...');
                    // Computerzug wird von computerEngineWeiss durchgefuehrt
                    computerZug = this.muehleComponent.computerEngineWeiss.berechneNeuenZug(this.muehleComponent.stellungsFolge,
                       zugtiefeMax);
                }
                else
                {
                    this.muehleComponent.log(this.muehleComponent.computerEngineSchwarz.getEngineName() + ' ist mit Schwarz am Zug. Bitte warten...');
                    // Computerzug wird von computerEngineWeiss durchgefuehrt
                    computerZug = this.muehleComponent.computerEngineSchwarz.berechneNeuenZug(this.muehleComponent.stellungsFolge,
                       zugtiefeMax);
                }
                if (computerZug === null){
                  const ausgabe = 'Es wurde kein Zug von der Engine zur�ckgegeben !! Das muehleComponent wurde abgebrochen.';
                  this.muehleComponent.computerEngineWeiss = null;
                  this.muehleComponent.computerEngineSchwarz = null;

                  this.muehleComponent.log(ausgabe);
                  break;
                }

                const stellung = this.muehleComponent.ermittleStellungZumGueltigenZug(computerZug);
                // Ungueltiger Zug --> muehleComponentabbruch
                if (stellung == null){
                  const ausgabe = 'Ungueltiger Zug (PosVon: ' + computerZug.getPosVon() + '  , PosBis: '
                  + computerZug.getPosBis() + '  , PosGeschlagen: ' + computerZug.getPosSteinWeg()
                  + ')  !! Das muehleComponent wurde abgebrochen.';

                  this.muehleComponent.computerEngineWeiss = null;
                  this.muehleComponent.computerEngineSchwarz = null;

                  this.muehleComponent.log(ausgabe);
                  break;
                }
                else
                {
                   this.muehleComponent.setAktuelleStellung(stellung.kopiereStellung());
                }

                // System.out.println('anzSymmetrieStellungen: ' + zugGen.anzSymmetrieStellungen);
//            try
//            {
//                Thread.sleep(1);
//                //Thread.sleep(1000);
//            }
//            catch (InterruptedException ie)
//            {
//                System.out.println(ie.toString());
//            }
               /// this.muehleComponent.setAktuelleStellung(this.muehleComponent.muehleBerechnung.ergebnisStellung.kopiereStellung());
            }

            this.muehleComponent.zeichneSpielfeld();
            console.log(this.muehleComponent.getAktuelleStellung().toString());
            zugNr++;
            console.log('ZugNr: ' + zugNr);

            this.muehleComponent.stellungsFolgeZobristKeys.push(this.muehleComponent.getAktuelleStellung().getZobristHashWert());
            this.muehleComponent.stellungsFolge.push(this.muehleComponent.getAktuelleStellung());

            if (this.muehleComponent.getAktuelleStellung().getAnzahlSteine()[0] < 3)
            {
                this.muehleComponentZuEnde = true;
                this.muehleComponent.log('Schwarz hat gewonnen!');
            }
            else if (this.muehleComponent.getAktuelleStellung().getAnzahlSteine()[1] < 3)
            {
                this.muehleComponentZuEnde = true;
                this.muehleComponent.log('Weiss hat gewonnen!');
            }
            else if (this.muehleComponent.getAktuelleStellung().getAnzahlFreierNachbarfelder()[0] === 0
                    && this.muehleComponent.getAktuelleStellung().getAnzahlSteineAussen()[0] === 0
                    && this.muehleComponent.getAktuelleStellung().getAnzahlSteine()[0] > 3)
            {
                this.muehleComponentZuEnde = true; // Weiss wurde eingesperrt
                this.muehleComponent.log('Weiss wurde eingesperrt ==> Schwarz hat gewonnen!');
            }
            else if (this.muehleComponent.getAktuelleStellung().getAnzahlFreierNachbarfelder()[1] === 0
                    && this.muehleComponent.getAktuelleStellung().getAnzahlSteineAussen()[1] === 0
                    && this.muehleComponent.getAktuelleStellung().getAnzahlSteine()[1] > 3)
            {
                this.muehleComponentZuEnde = true; // Schwarz wurde eingesperrt
                this.muehleComponent.log('Schwarz wurde eingesperrt ==> Weiss hat gewonnen!');
            }

            else if (this.muehleComponent.stellungsFolgeZobristKeys.indexOf(
                     ///// this.muehleComponent.getAktuelleStellung().getWeissSchwarz()) !==
                     this.muehleComponent.getAktuelleStellung().getZobristHashWert()) !==
                         this.muehleComponent.stellungsFolgeZobristKeys.length - 1)
            {
                this.muehleComponentZuEnde = true; // Remi
                this.muehleComponent.log('>>> Remie wegen Stellungswiederholung <<<');
            }


        }
    }
    isAlive(): boolean{
      return (this.muehleComponentZuEnde === true);
    }
    stop(): void{
      this.muehleComponentZuEnde = true;
      this.muehleComponent.worker.terminate();
    }
    start(): void{
      this.run();
      //// this.muehleComponent.worker.terminate();
    }
}
