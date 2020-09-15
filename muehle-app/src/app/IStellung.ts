import {IStellungAllgemein} from './IStellungAllgemein';
import {IZug} from './IZug';

type NewType = IStellungAllgemein;

export interface IStellung extends NewType
{
   /**
    * Weisse Spielposition (spielpositionen[0]) und schwarze Spielposition(spielpositionen[1]) und anzahlSteineAussen
    * werden in einem Long gespeichert. Dieses wird zurueckgegeben.
    */
    getWeissSchwarz(): number;

    /**
     * Liefert die Anzahl der freien Nachbarfelder von Schwarz und Weiss zureuck.
     */
    getAnzahlFreierNachbarfelder(): number[];

    /**
     * Liefert den ZobristHashWert der aktuellen Stellung zurueck.
     * Verfahren nach Zobrist : Fuer alle 48 Steine (24 Weisse, 24 Schwarze)
     * wird eine Zufallszahl fix gespeichert.
     * Dann ist der Hashkey H_neu einer Stellung: H_neu = H_alt XOR Zufallszahl[stein i]
     */
    getZobristHashWert(): number;

    /**
     * Bewertet die aktuelle Spielstellung.
     * @return int - Wert   zwischen   -(Util.MAXIMUM + 1) und (Util.MAXIMUM + 1)
     */
    bewerteStellung(gewichtAnzSteine: number, gewichtAnzMuehlen: number, gewichtAnzOffeneMuehlen: number,
                    gewichtAnzFreieNachbarn: number): number;
    /**
     * Setzt die Anzahl der weissen und der schwarzen Spielsteine.
     */
    setAnzahlSteine(anzahlSteine: number[]): void;
    /**
     * Setzt die Anzahl der weissen und der schwarzen Ausen-Spielsteine, also die Steine, die noch nicht eingesetzt wurden.
     */
    setAnzahlSteineAussen(anzahlSteineAussen: number[]): void;
    /**
     * Setzt die spielposition von weiss und Schwarz.
     *
     * In spielpositionen[0] sind alle weissen Steine, in spielpositionen[1] alle schwarzen Steine
     * gespeichert
     * Jedes Bit repraesentiert eine Spielposition auf dem Spielbrett
     *
     * Ein Muehle - SpielBrett hat 24 verschiedene Spielpositionen. Wenn Bit i von
     * spielpositionen[0]
     * den Wert 1 hat, dann bedeutet das, dass sich an Spielposition i ein weisser Stein befindet.
     *
     * Wenn Bit i von spielpositionen[1] den Wert 1 hat, dann bedeutet das,
     * dass sich an Spielposition i ein schwarzer Stein befindet.
     *
     *
     * Hintergrund:
     * Anstatt ein Feld von 24 Integer zu verwenden, werden nur 2 Integer verwendet, zum einen, um
     * Zeit zu sparen, da die Stellung sehr oft kopiert wird.
     * Zum anderen um Platz zu sparen, wenn die
     * spielpositionen in eine grosse Hashtabelle gespeichert werden.
     *
     */

   setSpielpositionen(spielpositionen: number[]): void;
   /**
    * Legt fest, wer am Zug ist. Wird 1 uebergeben, dann ist Weiss am Zug, wird -1 uebergeben , dann ist Schwarz am Zug.
    */
   setAmZug(amZug: number): void;
   /**
    * Gibt den letzten Zug zurueck, der zur aktuellen Stellung gefuehrt hat.
    */
   setLetzterZug(letzterZug: IZug): void;
   /**
    * Kopiert die aktuelle Stellung.
    */
   kopiereStellung(): IStellung;

}
