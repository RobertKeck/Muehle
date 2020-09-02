
interface IStellung extends IStellungAllgemein
{

	/**
	 * Weisse Spielposition (spielpositionen[0]) und schwarze Spielposition(spielpositionen[1]) und anzahlSteineAussen
	 * werden in einem Long gespeichert. Dieses wird zurueckgegeben.
	 * @return
	 */
    getWeissSchwarz():BigInteger;


    /**
     * Liefert die Anzahl der freien Nachbarfelder von Schwarz und Weiss zureuck.
     * @return
     */
    getAnzahlFreierNachbarfelder():BigInteger[];
    

    /**
     * Liefert den ZobristHashWert der aktuellen Stellung zurueck.
     * Verfahren nach Zobrist : Fuer alle 48 Steine (24 Weisse, 24 Schwarze)
     * wird eine Zufallszahl fix gespeichert.
     * Dann ist der Hashkey H_neu einer Stellung: H_neu = H_alt XOR Zufallszahl[stein i]
     * @return
     */
    getZobristHashWert():BigInteger;
    

    /**
     * Bewertet die aktuelle Spielstellung.
     * @return int - Wert   zwischen   -(Util.MAXIMUM + 1) und (Util.MAXIMUM + 1)
     */
    bewerteStellung(p_gewichtAnzSteine:BigInteger, p_gewichtAnzMuehlen:BigInteger, p_gewichtAnzOffeneMuehlen:BigInteger,
    		p_gewichtAnzFreieNachbarn:BigInteger):BigInteger;    
    /**
     * Setzt die Anzahl der weissen und der schwarzen Spielsteine.
     * @param anzahlSteine
     */
	setAnzahlSteine(anzahlSteine:BigInteger[]);
    /**
     * Setzt die Anzahl der weissen und der schwarzen Ausen-Spielsteine, also die Steine, die noch nicht eingesetzt wurden.
     * @param anzahlSteine
     */	
	setAnzahlSteineAussen(anzahlSteineAussen:BigInteger[]);
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

	setSpielpositionen(spielpositionen:BigInteger[]) ;
	/**
	 * Legt fest, wer am Zug ist. Wird 1 uebergeben, dann ist Weiss am Zug, wird -1 uebergeben , dann ist Schwarz am Zug.
	 * @param amZug
	 */
	setAmZug(amZug:BigInteger);
	/**
	 * Gibt den letzten Zug zurueck, der zur aktuellen Stellung gefuehrt hat. 
	 * @param letzterZug
	 */
    setLetzterZug(letzterZug:IZug);
    /**
     * Kopiert die aktuelle Stellung.
     * @return
     */
    kopiereStellung():IStellung;

}
