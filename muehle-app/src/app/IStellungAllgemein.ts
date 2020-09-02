
interface IStellungAllgemein
{
	/**
     * Liefert den zuletzt durchgefuehrten Zug zurueck.
     * @return IZug
	 */
    getLetzterZug():IZug;

    /**
     *  Gibt an, wer bei der Stellung am Zug ist.
     *  1 = Weiss, -1 = Schwarz
     * @return int
     */
    getAmZug():BigInteger;

    /**
     * Farbe kann die Werte 0 = WEISS und 1 = SCHWARZ annehmen
     * posNR kann die Werte 1..24 annehmen
     * 
     * @see IZug#getPosVon() Verteilung der Positionen im Muehlefeld 
     * 
     * @param farbe
     * @param posNr
     * @return boolean
     */
    istSteinNummerVonFarbeBesetzt(farbe:BigInteger, posNr:BigInteger):boolean;
    
    /**
     * In getSpielpositionen()[0] sind alle weissen Steine, in getSpielpositionen()[1] alle schwarzen Steine
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
     * @see IZug#getPosVon() Verteilung der Positionen im Muehlefeld 
     *  
     */
    getSpielpositionen():BigInteger[];
    
    /**
     * Liefert die Anzahl der Steine von Weiss und Schwarz
     * @return liefert ein feld[2] von int zurueck. In getAnzahlSteine()[0] ist die Anzahl der weissen Steine enthalten,
     * 		 	in getAnzahlSteine()[1] die Anzahl der schwarzen Steine.
     */
    getAnzahlSteine():BigInteger[];
    /**
     * Liefert die Anzahl der Steine von Weiss und Schwarz, die noch nicht eingesetzt wurden, also die sich noch
     * ausserhalb des Spielbrettes befinden.
     * 
     * @return liefert ein feld[2] von int zurueck. In getAnzahlSteineAussen()[0] ist die Anzahl der weissen AussenSteine enthalten,
     * 			 in getAnzahlSteineAussen()[1] die Anzahl der schwarzen AussenSteine.
     */
	getAnzahlSteineAussen():BigInteger[];


    
  
}
