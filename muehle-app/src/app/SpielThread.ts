import { MuehleComponent } from './muehle.component';
import {ZugGenerator} from './ZugGenerator';
import {Stellung} from './Stellung';
import {Util} from './Util';
import {Zug} from './Zug';

export class SpielThread
{

    muehleComponent: MuehleComponent;
    zugtiefeMax: number;
    zugGen: ZugGenerator = new ZugGenerator();
    zugNr = 0;
    refreshId: number;
    refreshIdWarteAufZugMensch: number;


    constructor(muehleComponent: MuehleComponent)
    {
        this.muehleComponent = muehleComponent;
        this.zugtiefeMax = Number(this.muehleComponent.getCBZugtiefe());
    }


    /**
     * Da die Funktion gameLoop via setIntverval aufgerufen wird, und dabei 'this' verloren geht,
     * muss man als Paramter den spielthread (= this) mitgeben.
     */
    gameLoop(spielThread: SpielThread): void{

            if (spielThread.muehleComponent.getSpielIstGestartet() === false){
                clearInterval(spielThread.refreshId);
                return;
            }

            spielThread.zugtiefeMax = spielThread.muehleComponent.getCBZugtiefe();
            let eigen = 0;
            if (spielThread.muehleComponent.getAktuelleStellung().getAmZug() === -1) {
                eigen = 1;
            }
            if (spielThread.muehleComponent.getCBWeiss() === ('Human')){
                spielThread.muehleComponent.computerMensch[0] = Util.MENSCH;
            }
            else{
                spielThread.muehleComponent.computerMensch[0] = Util.COMPUTER;
            }
            if (spielThread.muehleComponent.getCBSchwarz() === ('Human')){
                spielThread.muehleComponent.computerMensch[1] = Util.MENSCH;
            }
            else{
                spielThread.muehleComponent.computerMensch[1] = Util.COMPUTER;
            }
                    // ermittle die aktuell gueltigen Zuege
            spielThread.muehleComponent.alleAktuellGueltigenStellungen = spielThread.zugGen.ermittleAlleZuege(
                                                              spielThread.muehleComponent.getAktuelleStellung() as Stellung,
                                                                    spielThread.muehleComponent.stellungsFolge.length, false);
            /*------------------------------------------------------------------------------------------------------
             *                                   Mensch ist am Zug
             *-----------------------------------------------------------------------------------------------------*/
            if (spielThread.muehleComponent.computerMensch[eigen] === Util.MENSCH){
                if (spielThread.muehleComponent.getAktuelleStellung().getAmZug() === Util.WEISS){
                    spielThread.muehleComponent.log('It\'s white\'s turn');
                }
                else{
                    spielThread.muehleComponent.log('It\'s black\'s turn');
                }
                if (spielThread.muehleComponent.getNeuerZugMensch() != null){
                    spielThread.kopiereStellung(spielThread);
                    spielThread.muehleComponent.setAktuelleStellung(spielThread.muehleComponent.ermittleStellungZumGueltigenZug(
                    spielThread.muehleComponent.getNeuerZugMensch() as Zug).kopiereStellung());
                    spielThread.aktionenNachZug(spielThread);
                    spielThread.muehleComponent.setNeuerZugMensch(null);
                }
            }
            /*------------------------------------------------------------------------------------------------------
             *                                   Computer ist am Zug
             *-----------------------------------------------------------------------------------------------------*/
            else{
                spielThread.kopiereStellung(spielThread);
                let computerZug = null;
                if (spielThread.muehleComponent.getAktuelleStellung().getAmZug() === Util.WEISS){
                    //spielThread.muehleComponent.log(spielThread.muehleComponent.computerEngineWeiss.getEngineName() + ' ist mit Weiss am Zug. Bitte warten...');
                    spielThread.muehleComponent.log(spielThread.muehleComponent.computerEngineWeiss.getEngineName() + ' is thinking. Please wait...');

                    // Computerzug wird von computerEngineWeiss durchgefuehrt
                    // TODO Aufruf via WebWorker, damit der Single - Thread nicht blockiert wird
                    computerZug = spielThread.muehleComponent.computerEngineWeiss.
                                        berechneNeuenZug(spielThread.muehleComponent.stellungsFolge,
                    spielThread.zugtiefeMax);
                }
                else{
                    spielThread.muehleComponent.log(spielThread.muehleComponent.computerEngineSchwarz.getEngineName() + ' is thinking. Please wait...');

                    // Computerzug wird von computerEngineSchwarz durchgefuehrt
                    // TODO Aufruf via WebWorker, damit der Single - Thread nicht blockiert wird
                    computerZug = spielThread.muehleComponent.computerEngineSchwarz.
                                    berechneNeuenZug(spielThread.muehleComponent.stellungsFolge,
                    spielThread.zugtiefeMax);
                }
                if (computerZug === null){
                    const ausgabe = 'Es wurde kein Zug von der Engine zur�ckgegeben !! Das muehleComponent wurde abgebrochen.';
                    spielThread.muehleComponent.computerEngineWeiss = null;
                    spielThread.muehleComponent.computerEngineSchwarz = null;

                    spielThread.muehleComponent.log(ausgabe);
                    clearInterval(spielThread.refreshId);
                    return;
                }
                const stellung = spielThread.muehleComponent.ermittleStellungZumGueltigenZug(computerZug);
                // Ungueltiger Zug --> muehleComponentabbruch
                if (stellung == null){
                    const ausgabe = 'Ungueltiger Zug (PosVon: ' + computerZug.getPosVon() + '  , PosBis: '
                    + computerZug.getPosBis() + '  , PosGeschlagen: ' + computerZug.getPosSteinWeg()
                    + ')  !! Das muehleComponent wurde abgebrochen.';
                    spielThread.muehleComponent.computerEngineWeiss = null;
                    spielThread.muehleComponent.computerEngineSchwarz = null;
                    spielThread.muehleComponent.log(ausgabe);
                    clearInterval(spielThread.refreshId);
                    return;
                }
                else{
                    spielThread.muehleComponent.setAktuelleStellung(stellung.kopiereStellung());
                    spielThread.aktionenNachZug(spielThread);
                }
            }
            if (spielThread.muehleComponent.getSpielIstGestartet() === false){
                clearInterval(spielThread.refreshId);
                return;
            }
    }

    aktionenNachZug(spielThread: SpielThread): void{

        spielThread.muehleComponent.zeichneSpielfeld();
        console.log(spielThread.muehleComponent.getAktuelleStellung().toString());
        spielThread.zugNr++;
        console.log('ZugNr: ' + spielThread.zugNr);

        spielThread.muehleComponent.stellungsFolgeZobristKeys.push(spielThread.muehleComponent.getAktuelleStellung().getZobristHashWert());
        spielThread.muehleComponent.stellungsFolge.push(spielThread.muehleComponent.getAktuelleStellung());

        if (spielThread.muehleComponent.getAktuelleStellung().getAnzahlSteine()[0] < 3){
            spielThread.muehleComponent.setSpielIstGestartet(false);
            spielThread.muehleComponent.log('Black won!');
        }
        else if (spielThread.muehleComponent.getAktuelleStellung().getAnzahlSteine()[1] < 3){
            spielThread.muehleComponent.setSpielIstGestartet(false);
            spielThread.muehleComponent.log('White won!');
        }
        else if (spielThread.muehleComponent.getAktuelleStellung().getAnzahlFreierNachbarfelder()[0] === 0
                && spielThread.muehleComponent.getAktuelleStellung().getAnzahlSteineAussen()[0] === 0
                && spielThread.muehleComponent.getAktuelleStellung().getAnzahlSteine()[0] > 3)
        {
            spielThread.muehleComponent.setSpielIstGestartet(false); // Weiss wurde eingesperrt
            spielThread.muehleComponent.log('White has been locked up ==> Black won!');
        }
        else if (spielThread.muehleComponent.getAktuelleStellung().getAnzahlFreierNachbarfelder()[1] === 0
                && spielThread.muehleComponent.getAktuelleStellung().getAnzahlSteineAussen()[1] === 0
                && spielThread.muehleComponent.getAktuelleStellung().getAnzahlSteine()[1] > 3)
        {
            spielThread.muehleComponent.setSpielIstGestartet(false); // Schwarz wurde eingesperrt
            spielThread.muehleComponent.log('Black has been locked up ==> White won!');
        }

        else if (spielThread.muehleComponent.stellungsFolgeZobristKeys.indexOf(
                ///// spielThread.muehleComponent.getAktuelleStellung().getWeissSchwarz()) !==
                spielThread.muehleComponent.getAktuelleStellung().getZobristHashWert()) !==
                    spielThread.muehleComponent.stellungsFolgeZobristKeys.length - 1)
        {
            spielThread.muehleComponent.setSpielIstGestartet(false); // Remi
            spielThread.muehleComponent.log('>>> Remie because of repetition <<<');
        }
    }
    /**
     * Falls das aktuelle Spiel gestoppt wird, muss der vorgaengerZug wieder hergestellt werden.
     * Dafuer muss vorher eine Kopie erstellt werden.
     */
    kopiereStellung(spielThread: SpielThread): void{
        spielThread.muehleComponent.aktuelleStellungKopie = spielThread.muehleComponent.getAktuelleStellung().kopiereStellung() as Stellung;
        spielThread.muehleComponent.stellungsFolgeZobristKeysKopie = spielThread.muehleComponent.stellungsFolgeZobristKeys.slice();

        spielThread.muehleComponent.stellungsFolgeKopie = spielThread.muehleComponent.stellungsFolge.slice();


        spielThread.muehleComponent.alleAktuellGueltigenStellungenKopie =
                                        spielThread.muehleComponent.alleAktuellGueltigenStellungen.slice();
    }


    stop(): void{
        this.muehleComponent.setSpielIstGestartet(false);
    }
    start(): void{
      this.muehleComponent.setSpielIstGestartet(true);
      this.muehleComponent.setNeuerZugMensch(null);
      // Instead of a while loop, use setInterval to give the single UI-Thread time to paint
      this.refreshId = window.setInterval( this.gameLoop, 200, this );

    }


}
