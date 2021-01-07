import {Stellung} from './Stellung';
import {Util} from './Util';
import {MuehleBerechnung} from './muehleBerechnung';
import {Gewichte} from './Gewichte';

import {IZug} from './IZug';
import {IEngine} from './IEngine';



/**
 * Die KeckEngine ist eine Muehle-Engine, die ausgehend von einer bestehenden Muehle-Stellung einen
 * moeglichst optimalen Zug erzeugt und die neue Stellung an ein aufrufendes
 * @see MuehleBerechnung
 * @author Robert Keck
 *
 */
export class KeckEngine implements IEngine{

  protected muehleBerechnung: MuehleBerechnung = new MuehleBerechnung(this);

  stellungsFolgeZobristKeys: Array<number> = new Array<number>();



  protected gewichte: Gewichte = new Gewichte();



 /**
  * @param stellungsFolge Der Engine wird nicht nur eine einzelne MuehleStellung, sondern eine ganze Folge von
  *    Stellungen uebergeben.
  *    Diese Folge von Stellungen wird von der Engine benoetigt, um Remi durch Zugwiederholung zu erkennen.
  *    Ausgehend von der letzten Stellung im Vector, also der aktuellen Stellung, wird ein neuer Zug berechnet.
  * @param zugtiefeMax die maximale Zugtiefe, mit der die Engine rechnen darf
  *
  *  TODO: zusaetzlich zur maximalen Zugtiefe soll auch ein Parameter mit maxmimaler Zeit (Anzahl Sekunden pro Zug)
  *    uebergeben werden.
  *
  * @return Rueckgabe ist die Ergebnisstellung, die unter anderem den neu durchgefuehrten Zug enthaelt.
  */
 public berechneNeuenZug(stellungsFolge: Array<Stellung>, zugtiefeMax: number): IZug{
        // this.muehleBerechnung.hashTab = null;
        this.muehleBerechnung.setZugtiefeMax(zugtiefeMax);

        // this.muehleBerechnung.clearHashTabelle();
        this.muehleBerechnung.anzStellungenInHashGefunden = 0;
        this.muehleBerechnung.anzStellungenBlaetter = 0;


        let dauer = - Date.now();


        // zugGen.anzSymmetrieStellungen = 0;

        // ermittle den Besten Zug
        this.muehleBerechnung.ermittleBestenZug(
                stellungsFolge[stellungsFolge.length - 1], 0,
                -(Util.MAXIMUM + 1), (Util.MAXIMUM + 1));


        dauer += Date.now();

        console.log('Benoetigte Zeit: ' + dauer + ' Millisekunden');

        console.log('anzStellungenInHashGefunden: '
                + this.muehleBerechnung.anzStellungenInHashGefunden);
        console.log('anzStellungenBlaetter: '
                + this.muehleBerechnung.anzStellungenBlaetter);
        if (dauer !== 0)
        {
          console.log('Stellungen pro Sekunde: '
                    + this.muehleBerechnung.anzStellungenBlaetter * 1000 / dauer);
        }
        // logConsole('anzSymmetrieStellungen: ' + zugGen.anzSymmetrieStellungen);

        return this.muehleBerechnung.ergebnisStellung.getLetzterZug();
 }

 /**
  * Liefert den Namen der Engine, die den Zug durchgefuehrt hat.
  *
  * @return String
  */
 public getEngineName(): string{
  return 'K-Engine';
 }


 private logConsole(stringToLog: string): void{
  console.log(stringToLog);
 }

 public getGewichte(): Gewichte {
  return this.gewichte;
 }

 public setGewichte(gewichte: Gewichte): void {
  this.gewichte = gewichte;
 }


}
