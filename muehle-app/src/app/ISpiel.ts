import {IStellungAllgemein} from './IStellungAllgemein';
import {IZug} from './IZug';

export interface ISpiel
{

   /**
    * Das aktuell laufende Spiel wird, wenn noch nicht geschehen, gestoppt. Die beim Start initialisierten Engines werden auf null gesetzt.
    */
    stoppeSpiel(): void;

    /**
     * Das aktuell laufende Spiel wird, wenn noch nicht geschehen, gestoppt, anschliessend wird die Startstellung aufgebaut.
     */
    loescheSpielfeld(): void;

    /**
     * Das aktuell laufende Spiel wird, wenn noch nicht geschehen, gestoppt, und der letzte Zug wird rueckgaengig gemacht.
     */
    zugZurueck(): void;

    /**
     * Das Spiel wird mit der aktuell vorhanden Stellung gestartet. Das kann die Initialstellung sein, oder auch die Stellung,
     * die nach dem letzen stoppen stehen blieb.
     * Fuer Weiss und fuer Schwarz wird eine ComputerEngine initialisiert.
     */
    start(): void;

    /**
     * @return Liefert eine Liste von allen gueltigen Zuegen, die in der aktuellen Stellung moeglich sind.
     */
    getAlleAktuellGueltigenZuege(): Array<IZug>;

    /**
     * Liefert true zurueck, wenn aktuell ein Muehlespiel am laufen ist, sonst false.
     * @return boolean
     */
    istSpielGestartet(): boolean;

    /**
     * Liefert true zureuck, wenn aktuell ein Muehlespiel am laufen ist, und ein Mensch am Zug ist.
     * Ansonsten liefert es false zureuck.
     * @return boolean
     */
    istMenschAmZug(): boolean;

    /**
     * @return Gibt die aktuelle Muehlestellung zurueck.
     */
    getAktuelleStellung(): IStellungAllgemein;

    /**
     * Setzt die aktuelle Muehlestellung mit der uebergebenen Stellung.
     */
    setAktuelleStellung(aktuelleStellung: IStellungAllgemein): void;

    /**
     * @return Liest den neuesten Zug des Menschen zureuck. Wenn null zurueckgegeben wird, dann hat der Mensch noch nicht gezogen.
     */
    getNeuerZugMensch(): IZug;

    /**
     * Setzt den neuesten Zug des Menschen
     */
    setNeuerZugMensch(neuerZug: IZug): void;

    /**
     * Gibt zurueck, wer (Computer oder Mensch) im laufenden Spiel Schwarz und Weiss spielt.
     *
     * @return <br>
     * computerMensch[0] = COMPUTER --> Weiss wird vom Computer gespielt <br>
     * computerMensch[0] = MENSCH --> Weiss wird vom Menschen gespielt <br>
     * computerMensch[1] = COMPUTER --> Schwarz wird vom Computer gespielt <br>
     * computerMensch[1] = MENSCH --> Schwarz wird vom Menschen gespielt
     */
    getComputerMensch(): number[];

}
