import {IStellungAllgemein} from './IStellungAllgemein';
import {IZug} from './IZug';

/**
 * IEngine ist das Interface fuer eine MuehleEngine, die von muehle.Spiel aus aufgerufen werden kann, um als Computerspieler
 * fuer Weiss oder Schwarz zu spielen.
 * @see Spiel#start()
 *
 * @author Robert Keck
 *
 */
export interface IEngine {
  /**
   * @param p_stellungsFolge Der Engine wird nicht nur eine einzelne MuehleStellung, sondern eine ganze Folge von
   * 			Stellungen uebergeben.
   * 			Diese Folge von Stellungen wird von der Engine benoetigt, um Remi durch Zugwiederholung zu erkennen.
   * 			Ausgehend von der letzten Stellung im Vector, also der aktuellen Stellung, wird ein neuer Zug berechnet.
   *
   * @param p_zugtiefeMax	die maximale Zugtiefe, mit der die Engine rechnen darf
   *
   *  TODO: zusaetzlich zur maximalen Zugtiefe soll auch ein Parameter mit maxmimaler Zeit (Anzahl Sekunden pro Zug)
   *  		uebergeben werden.
   *
   * @return Zurueckgegeben wird der Zug, den die Engine als optimalen Zug berechnet hat.
   */
  berechneNeuenZug(stellungsFolge: Array<IStellungAllgemein>, zugtiefeMax: number): IZug;

  /**
   * Liefert den Namen der Engine, die den Zug durchgefuehrt hat. Dieser Name taucht im Zug-Logging der Muehlespielverwaltung auf.
   *
   * @return String
   */
  getEngineName(): string;

}
