

import {IStellungAllgemein} from '../IStellungAllgemein';
import {ISpiel} from '../ISpiel';


export interface IMuehleFrame
{
  /**
   * Zeichnet die uebergebene Stellung
   */
   zeichneStellung(stellung: IStellungAllgemein): void;

  /**
   * Holt sich das aktuell laufende Muehlespiel
   */
  getSpiel(): ISpiel;

  /**
   * Setzt das aktuell laufende Muehlespiel
   */
  setSpiel(spiel: ISpiel): void;

  /**
   * Gibt den Inhalt der CheckboxWeiss zureuck.
   * @return Moegliche Rueckgabewerte sind "Mensch" und "Computer"
   */
  getCBWeiss(): string;

  /**
   * Gibt den Inhalt der CheckboxSchwarz zureuck.
   * @return Moegliche Rueckgabewerte sind "Mensch" und "Computer"
   */
  getCBSchwarz(): string;

  /**
   * Gibt den Inhalt der CheckboxZugtiefe zurueck. Die Computer-Engines sollen nicht
   * mehr Halbzuege in die Tiefe rechnen, als mit der Zugtiefe angegeben.
   * @return int
   */
  getCBZugtiefe(): number;

  /**
   * Ausgabe der uebergeben meldung in einem Textfield
   */
  log(meldung: string): void;
}
