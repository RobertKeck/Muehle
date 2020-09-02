

class Stellung implements IStellung
{
    

    private bewertung:BigInteger;
    
    /**
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
     * Zeit zu sparen,
     * da die Stellung sehr oft kopiert wird, und zum anderen um Platz zu sparen, wenn die
     * spielpositionen in eine grosse Hashtabelle gespeichert werden
     * 
     */
    spielpositionen: BigInteger[];

	private anzahlSteine:BigInteger[];
    private anzahlSteineAussen:BigInteger[];
    private amZug:BigInteger;                                     // 1 = Weiss, -1 = Schwarz                                                           
    protected anzahlMuehlen:BigInteger[];
    protected anzahlFreierNachbarfelder:BigInteger[];
    protected weissSchwarz:BigInteger;                              // spielpositionen[0] und spielpositionen[1] und anzahlSteineAussen in einem long
    protected zobristHashWert:BigInteger;
    /**
     * ----------------------------------------------------------------------------
     * es gibt 16 verschiedene Moeglichkeiten fuer eine weisse Muehle, und 16
     * Moeglichkeiten fuer eine schwarze Muehle. Jede Muehle kann die
     * Werte von 0 bis 3 annehmen. Bei 3 ist sie vollstaendig, also geschlossen.
     *----------------------------------------------------------------------------
     */
    protected muehle:BigInteger[][];                   // [2][17]
    
    /**
     * es gibt 64 verschiedene Moeglichkeiten (1..65) fuer eine offene Muehle fuer Weiss und ebenso viele fuer Schwarz.
     * Nur wenn offeneMuehle[i] = 3, dann ist dies eine offene Muehle.
     */
    protected offeneMuehle:BigInteger[][];           // new int[2][65];
    
    
    private letzterZug:Zug;          
   

    constructor ()
    {
        let bewertung = 0;
        let Zug = new Zug();
    }

    public getAnzahlSteine(): BigInteger[] {
		return anzahlSteine;
	}



	public void setAnzahlSteine(int[] anzahlSteine) {
		this.anzahlSteine = anzahlSteine;
	}



	public int[] getAnzahlSteineAussen() {
		return anzahlSteineAussen;
	}



	public void setAnzahlSteineAussen(int[] anzahlSteineAussen) {
		this.anzahlSteineAussen = anzahlSteineAussen;
	}



	public void setLetzterZug(Zug letzterZug) {
		this.letzterZug = letzterZug;
	}




	private int[]   anzahlSteine              = new int[2];
    private int[]   anzahlSteineAussen        = new int[2];
    private int     amZug;                                     // 1 = Weiss, -1 = Schwarz
                                                                  
    protected int[]   anzahlMuehlen             = new int[2];
    //protected int[]   anzahlOffenerMuehlen      = new int[2];
    protected int[]   anzahlFreierNachbarfelder = new int[2];
    protected Long    weissSchwarz;                              // spielpositionen[0] und spielpositionen[1] und anzahlSteineAussen in einem long
    //public Long   weissSchwarzHash = new Long(0);  
    protected long    zobristHashWert           = 0;
    
    /**
     * ----------------------------------------------------------------------------
     * es gibt 16 verschiedene Moeglichkeiten fuer eine weisse Muehle, und 16
     * Moeglichkeiten fuer eine schwarze Muehle. Jede Muehle kann die
     * Werte von 0 bis 3 annehmen. Bei 3 ist sie vollstaendig, also geschlossen.
     *----------------------------------------------------------------------------
     */
    protected int[][] muehle                    = new int[2][17];
    
    /**
     * es gibt 64 verschiedene Moeglichkeiten (1..65) fuer eine offene Muehle fuer Weiss und ebenso viele fuer Schwarz.
     * Nur wenn offeneMuehle[i] = 3, dann ist dies eine offene Muehle.
     */
    protected int[][] offeneMuehle              = new int[2][65];
    
    
    private Zug     letzterZug                = new Zug();
    
    

    //protected int posVon, posBis, posSteinWeg; //letzter Zug
    

    /**
     * Konstruktor
     */
    protected Stellung()
    {
    }
    


    /**
     * Aufruf der Methode bewerteStellung(int p_gewichtAnzSteine, int p_gewichtAnzMuehlen, int p_gewichtAnzOffeneMuehlen, int p_gewichtAnzFreieNachbarn)
     * mit vordefinierten Gewichten.
     * 
     * @return int
     */
//    public int bewerteStellung()
//    {
//    	return bewerteStellung(Util.GEWICHT_ANZ_STEINE, Util.GEWICHT_ANZ_MUEHLEN, Util.GEWICHT_ANZ_OFFENE_MUEHLEN, Util.GEWICHT_ANZ_FREIE_NACHBARN); 
//    }
    /**
     * Die Stellungsbewertung wird berechnet aus der Anzahl der weissen und schwarzen Steine,
     * aus der Anzahl der weissen und schwarzen Muehlen, sowie aus der Anzahl der weisssen
     * und schwarzen Zugmoeglichkeiten.
     * 
     * Die Klassenvariable bewertung wird mit dem neu berechnetem Wert belegt. Zusaetzlich wird
     * dieser neue Wert zurueckgeliefert.
     * 
     * @return int
     */
    public int bewerteStellung(int p_gewichtAnzSteine, int p_gewichtAnzMuehlen, int p_gewichtAnzOffeneMuehlen,
    		int p_gewichtAnzFreieNachbarn)
    {
        short stellungsWert = 0;
        
        // (Anzahl der weissen Steine minus Anzahl der schwarzen Steine) * Util.GEWICHT_ANZ_STEINE  
        stellungsWert += (this.anzahlSteine[0] - this.anzahlSteine[1]) * p_gewichtAnzSteine;
        
        // plus Anzahl der weissen Muehlen minus Anzahl der schwarzen Muehlen 
        stellungsWert += (this.anzahlMuehlen[0] - this.anzahlMuehlen[1]) * p_gewichtAnzMuehlen;

        // plus Anzahl der offenen weissen Muehlen minus Anzahl der offenen schwarzen Muehlen
        int[] anzOffenerMuehlen = this.getAnzahlOffenerMuehlen();
        stellungsWert += (anzOffenerMuehlen[0] - anzOffenerMuehlen[1]) * p_gewichtAnzOffeneMuehlen;
        
        // plus Anzahl der freien Nachbarfelder von Weiss minus Anzahl der freien Nachbarfelder von Schwarz
        // Die Nachbarn zu bewerten, wenn ein Spieler springen kann, macht keinen Sinn
        //if (anzahlSteine[0] > 3 && anzahlSteine[1] > 3)
        stellungsWert += (this.anzahlFreierNachbarfelder[0] - this.anzahlFreierNachbarfelder[1]) * p_gewichtAnzFreieNachbarn;
        
        // Wenn Schwarz am Zug ist, dann ist es fuer Schwarz besser, wenn die Schwarzen Steine mehr sind, als die Weissen
        // Deshalb muss fuer den Fall das Vorzeichen umgedreht werden:
        stellungsWert *= -this.amZug;
        

        this.bewertung = stellungsWert;
        return this.bewertung;
        

    }
    


    /**
     * Farbe kann die Werte 0 = WEISS und 1 = SCHWARZ annehmen
     * posNR kann die Werte 1..24 annehmen
     * 
     * @param farbe
     * @param posNr
     * @return boolean
     */
    public boolean istSteinNummerVonFarbeBesetzt(int farbe, int posNr)
    {
        if (((this.spielpositionen[farbe]) & Util.bit[posNr]) == Util.bit[posNr])
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    


    /**
     * Fuer absteigende Sortierreihenfolge.
     * Stellung mit hoechster Bewertung soll bei Sortierung einer Liste von Stellungen als erstes
     * Element auftauchen.
     */
    public int compareTo(Stellung compareObject)
    {
        return (compareObject).getBewertung() - this.getBewertung();
    }
    


    public int getBewertung()
    {
        return this.bewertung;
    }
    


    public void setBewertung(int p_bewertung)
    {
        this.bewertung = p_bewertung;
    }
    


    public Stellung kopiereStellung()
    {
        Stellung neueStellung = new Stellung();
        
        neueStellung.spielpositionen[0] = this.spielpositionen[0];
        neueStellung.spielpositionen[1] = this.spielpositionen[1];
        neueStellung.anzahlSteine[0] = this.anzahlSteine[0];
        neueStellung.anzahlSteine[1] = this.anzahlSteine[1];
        neueStellung.anzahlSteineAussen[0] = this.anzahlSteineAussen[0];
        neueStellung.anzahlSteineAussen[1] = this.anzahlSteineAussen[1];
        neueStellung.anzahlMuehlen[0] = this.anzahlMuehlen[0];
        neueStellung.anzahlMuehlen[1] = this.anzahlMuehlen[1];
//        neueStellung.anzahlOffenerMuehlen[0] = this.anzahlOffenerMuehlen[0];
//        neueStellung.anzahlOffenerMuehlen[1] = this.anzahlOffenerMuehlen[1];
        neueStellung.anzahlFreierNachbarfelder[0] = this.anzahlFreierNachbarfelder[0];
        neueStellung.anzahlFreierNachbarfelder[1] = this.anzahlFreierNachbarfelder[1];
        neueStellung.amZug = this.amZug;
        neueStellung.muehle[0] = this.muehle[0].clone();
        neueStellung.muehle[1] = this.muehle[1].clone();
        neueStellung.offeneMuehle[0] = this.offeneMuehle[0].clone();
        neueStellung.offeneMuehle[1] = this.offeneMuehle[1].clone();
        //		neueStellung.weissSchwarz = new Long(this.weissSchwarz.longValue());
        neueStellung.weissSchwarz = this.weissSchwarz;
        neueStellung.zobristHashWert = this.zobristHashWert;
        //neueStellung.weissSchwarzHash = new Long(this.weissSchwarzHash.longValue());
        neueStellung.bewertung = this.bewertung;
        neueStellung.letzterZug.setPosVon(this.letzterZug.getPosVon());
        neueStellung.letzterZug.setPosBis(this.letzterZug.getPosBis());
        neueStellung.letzterZug.setPosSteinWeg(this.letzterZug.getPosSteinWeg());
        

        return neueStellung;
    }
    


    /**
     * Ausgabe der aktuellen Stellung in einen String
     * 
     * 1-----------------2-----------------3
     * |                 |                 |
     * |                 |                 |
     * |     4-----------5-----------6     |
     * |     |                       |     |
     * |     |                       |     |
     * |     |     7-----8-----9     |     |
     * |     |     |           |     |     |
     * |     |     |           |     |     |
     * 10----11----12          13----14----15
     * |     |     |           |     |     |
     * |     |     |           |     |     |
     * |     |     16----17----18    |     |
     * |     |           |           |     |
     * |     |           |           |     |
     * |     19----------20----------21    |
     * |                 |                 |
     * |                 |                 |
     * 22----------------23----------------24
     */
    public String toString()
    {
        StringBuffer ausgabeString = new StringBuffer();
        
        ausgabeString.append(this.feld(1) + "----------------" + this.feld(2) + "----------------"
                + this.feld(3) + "\n");
        ausgabeString.append(" |                 |                 |" + "\n");
        ausgabeString.append(" |                 |                 |" + "\n");
        ausgabeString.append(" |    " + this.feld(4) + "----------" + this.feld(5) + "----------"
                + this.feld(6) + "     |" + "\n");
        ausgabeString.append(" |     |           |           |     |" + "\n");
        ausgabeString.append(" |     |           |           |     |" + "\n");
        ausgabeString.append(" |     |    " + this.feld(7) + "----" + this.feld(8) + "----"
                + this.feld(9) + "     |     |" + "\n");
        ausgabeString.append(" |     |     |           |     |     |" + "\n");
        ausgabeString.append(" |     |     |           |     |     |" + "\n");
        ausgabeString.append(this.feld(10) + "----" + this.feld(11) + "----" + this.feld(12)
                + "          " + this.feld(13) + "----" + this.feld(14) + "----" + this.feld(15)
                + "\n");
        ausgabeString.append(" |     |     |           |     |     |" + "\n");
        ausgabeString.append(" |     |     |           |     |     |" + "\n");
        ausgabeString.append(" |     |    " + this.feld(16) + "----" + this.feld(17) + "----"
                + this.feld(18) + "     |     |" + "\n");
        ausgabeString.append(" |     |           |           |     |" + "\n");
        ausgabeString.append(" |     |           |           |     |" + "\n");
        ausgabeString.append(" |    " + this.feld(19) + "----------" + this.feld(20) + "----------"
                + this.feld(21) + "     |" + "\n");
        ausgabeString.append(" |                 |                 |" + "\n");
        ausgabeString.append(" |                 |                 |" + "\n");
        ausgabeString.append(this.feld(22) + "----------------" + this.feld(23)
                + "----------------" + this.feld(24) + "\n");
        ausgabeString.append("\n");
        ausgabeString.append("Bewertung: " + this.bewertung + "\n");
        ausgabeString.append("anzahlSteineAussen Weiss: " + this.anzahlSteineAussen[0] + "\n");
        ausgabeString.append("anzahlSteineAussen Schwarz: " + this.anzahlSteineAussen[1] + "\n");
        ausgabeString.append("anzahlSteine Weiss: " + this.anzahlSteine[0] + "\n");
        ausgabeString.append("anzahlSteine Schwarz: " + this.anzahlSteine[1] + "\n");
        ausgabeString.append("anzahlMuehlen Weiss: " + this.anzahlMuehlen[0] + "\n");
        ausgabeString.append("anzahlMuehlen Schwarz: " + this.anzahlMuehlen[1] + "\n");
        ausgabeString.append("anzahlOffenerMuehlen Weiss: " + this.getAnzahlOffenerMuehlen()[0] + "\n");
        ausgabeString.append("anzahlOffenerMuehlen Schwarz: " + this.getAnzahlOffenerMuehlen()[1] + "\n");
        ausgabeString.append("anzahlFreierNachbarfelder Weiss: "
                + this.anzahlFreierNachbarfelder[0] + "\n");
        ausgabeString.append("anzahlFreierNachbarfelder Schwarz: "
                + this.anzahlFreierNachbarfelder[1] + "\n");
        ausgabeString.append("am Zug: ");
        if (this.amZug == Util.WEISS)
        {
            ausgabeString.append("Weiss");
        }
        else
        {
            ausgabeString.append("Schwarz");
        }
        ausgabeString.append("\n");
        ausgabeString.append("ZobristKey: " + this.zobristHashWert + "\n");
        ausgabeString.append("posVon: " + this.letzterZug.getPosVon() + "\n");
        ausgabeString.append("posBis: " + this.letzterZug.getPosBis() + "\n");
        ausgabeString.append("posSteinWeg: " + this.letzterZug.getPosSteinWeg() + "\n");
        return ausgabeString.toString();
    }
    


    /**
     * Wenn sich an Position posNr ein weisser Stein befindet, gebe " W" zurueck.
     * Wenn sich an Position posNr ein schwarzer Stein befindet, gebe " S" zurueck.
     * 
     * Sonst gebe "  " zurueck.
     * 
     * @param posNr
     * @return
     */
    private String feld(int posNr)
    {
        if ((this.spielpositionen[0] & Util.bit[posNr]) == Util.bit[posNr])
        {
            return " W";
        }
        else if ((this.spielpositionen[1] & Util.bit[posNr]) == Util.bit[posNr])
        {
            return " S";
        }
        else
        {
            return "  ";
            /*
             * if (posNr < 10){
             * return " " + ((Integer)posNr).toString();
             * }
             * else{
             * return ((Integer)posNr).toString();
             * }
             */
        }
    }
    


    /**
     * Es wird geprueft, ob es in der Liste von Stellungen eine Stellung gibt, die zur
     * aktuellen Stellung symmetrisch ist. Wenn das der Fall ist, wird true zurueckgeliefert.
     * 
     * Zwei Stellungen sind symmetrisch, wenn sie spiegelsymetrisch zu mindestens einer ihrer 4
     * Achsen sind.
     * Auf der jeweiligen Spiegelachse muessen die Steine identisch sein.
     * Die 4 Spiegelachsen sind folgende:
     * 1) die Vertikale durch die Felder 2, 5, 8, 17, 20, 23
     * 2) die Horizontale durch die Felder 10, 11, 12, 13, 14, 15
     * 3) die Diagonale durch die Felder 1, 4, 7, 18, 21, 24
     * 4) die Diagonale durch die Felder 3, 6, 9, 16, 19, 22
     * 
     * 
     * @param p_alleStellungen
     * @return boolean
     */
    public boolean isSymmetrisch(List<Stellung> p_alleStellungen)
    {
        ListIterator<Stellung> it = p_alleStellungen.listIterator();
        while (it.hasNext())
        {
            Stellung l_stellung = it.next();
            
            // Pruefe Vertikale
            if ((this.spielpositionen[0] & Util.VERTIKALE) == (l_stellung.getSpielpositionen()[0] & Util.VERTIKALE)
                    && (this.spielpositionen[1] & Util.VERTIKALE) == (l_stellung.getSpielpositionen()[1] & Util.VERTIKALE))
            {
                if (Util.linksGleichRechts(this.spielpositionen[0],
                        l_stellung.getSpielpositionen()[0]))
                {
                    if (Util.linksGleichRechts(this.spielpositionen[1],
                            l_stellung.getSpielpositionen()[1]))
                    {
                        if (Util.linksGleichRechts(l_stellung.getSpielpositionen()[0],
                                this.spielpositionen[0]))
                        {
                            if (Util.linksGleichRechts(l_stellung.getSpielpositionen()[1],
                                    this.spielpositionen[1]))
                            {
                                return true;
                            }
                        }
                        
                    }
                    
                }
            }
            // Pruefe Horizontale
            if ((this.spielpositionen[0] & Util.HORIZONTALE) == (l_stellung.getSpielpositionen()[0] & Util.HORIZONTALE)
                    && (this.spielpositionen[1] & Util.HORIZONTALE) == (l_stellung.getSpielpositionen()[1] & Util.HORIZONTALE))
            {
                if (Util.obenGleichUnten(this.spielpositionen[0],
                        l_stellung.getSpielpositionen()[0]))
                {
                    if (Util.obenGleichUnten(this.spielpositionen[1],
                            l_stellung.getSpielpositionen()[1]))
                    {
                        if (Util.obenGleichUnten(l_stellung.getSpielpositionen()[0],
                                this.spielpositionen[0]))
                        {
                            if (Util.obenGleichUnten(l_stellung.getSpielpositionen()[1],
                                    this.spielpositionen[1]))
                            {
                                return true;
                            }
                        }
                        
                    }
                    
                }
            }
            // Pruefe Diagonale I
            if ((this.spielpositionen[0] & Util.DIAGONALE_I) == (l_stellung.getSpielpositionen()[0] & Util.DIAGONALE_I)
                    && (this.spielpositionen[1] & Util.DIAGONALE_I) == (l_stellung.getSpielpositionen()[1] & Util.DIAGONALE_I))
            {
                if (Util.linksUntenGleichRechtsOben(this.spielpositionen[0],
                        l_stellung.getSpielpositionen()[0]))
                {
                    if (Util.linksUntenGleichRechtsOben(this.spielpositionen[1],
                            l_stellung.getSpielpositionen()[1]))
                    {
                        if (Util.linksUntenGleichRechtsOben(l_stellung.getSpielpositionen()[0],
                                this.spielpositionen[0]))
                        {
                            if (Util.linksUntenGleichRechtsOben(l_stellung.getSpielpositionen()[1],
                                    this.spielpositionen[1]))
                            {
                                return true;
                            }
                        }
                        
                    }
                    
                }
            }
            // Pruefe Diagonale II
            if ((this.spielpositionen[0] & Util.DIAGONALE_II) == (l_stellung.getSpielpositionen()[0] & Util.DIAGONALE_II)
                    && (this.spielpositionen[1] & Util.DIAGONALE_II) == (l_stellung.getSpielpositionen()[1] & Util.DIAGONALE_II))
            {
                if (Util.linksObenGleichRechtsUnten(this.spielpositionen[0],
                        l_stellung.getSpielpositionen()[0]))
                {
                    if (Util.linksObenGleichRechtsUnten(this.spielpositionen[1],
                            l_stellung.getSpielpositionen()[1]))
                    {
                        if (Util.linksObenGleichRechtsUnten(l_stellung.getSpielpositionen()[0],
                                this.spielpositionen[0]))
                        {
                            if (Util.linksObenGleichRechtsUnten(l_stellung.getSpielpositionen()[1],
                                    this.spielpositionen[1]))
                            {
                                return true;
                            }
                        }
                        
                    }
                    
                }
            }
            
            // Pruefe Vertikale
            //		    if ((this.weissSchwarz.longValue() & Util.VERTIKALE) == (l_stellung.weissSchwarz.longValue() & Util.VERTIKALE))
            //			    {
            //			    	if (Util.linksGleichRechts(this.weissSchwarz.longValue(), l_stellung.weissSchwarz.longValue()))
            //			    	{
            //				    	if (Util.linksGleichRechts(l_stellung.weissSchwarz.longValue(), this.weissSchwarz.longValue()))
            //			    		{
            //			    			return true;
            //			    		}
            //			    		
            //			    	}
            //			    }
            
        }
        return false;
    }
    


    public int[] getSpielpositionen()
    {
        return this.spielpositionen;
    }
    


    public void setSpielpositionen(int[] spielpositionen)
    {
        this.spielpositionen = spielpositionen;
    }
    

//    public int getAnzahlSteineWeiss(){
//    	return this.anzahlSteine[0];
//    }
//    public void setAnzahlSteineWeiss(int p_anzSteineWeiss){
//    	this.anzahlSteine[0] = p_anzSteineWeiss;
//    }
//    public int getAnzahlSteineSchwarz(){
//    	return this.anzahlSteine[1];
//    }
//    public void setAnzahlSteineSchwarz(int p_anzSteineSchwarz){
//    	this.anzahlSteine[1] = p_anzSteineSchwarz;
//    }
//    public int getAnzahlSteineAussenWeiss(){
//    	return this.anzahlSteineAussen[0];
//    }
//    public void setAnzahlSteineAussenWeiss(int p_anzSteineAussenWeiss){
//    	this.anzahlSteineAussen[0] = p_anzSteineAussenWeiss;    	
//    }
//    public int getAnzahlSteineAussenSchwarz(){
//    	return this.anzahlSteineAussen[1];    	
//    }
//    public void setAnzahlSteineAussenSchwarz(int p_anzSteineAussenSchwarz){
//    	this.anzahlSteineAussen[1] = p_anzSteineAussenSchwarz;    	
//    	
//    }


//
//    public int[] getAnzahlSteine(){
//    	return this.anzahlSteine;
//    }
//    public void setAnzahlSteine(int[]);
//    public int getAnzahlSteineSchwarz();
//    public void setAnzahlSteineSchwarz(int p_anzSteineSchwarz);
//    public int getAnzahlSteineAussenWeiss();
//    public void setAnzahlSteineAussenWeiss(int p_anzSteineWeiss);
//    public int getAnzahlSteineAussenSchwarz();
//    public void setAnzahlSteineAussenSchwarz(int p_anzSteineSchwarz);
//        
    
    
    public int[] getAnzahlMuehlen()
    {
        return this.anzahlMuehlen;
    }
    


    public void setAnzahlMuehlen(int[] anzahlMuehlen)
    {
        this.anzahlMuehlen = anzahlMuehlen;
    }
    


    public int[] getAnzahlFreierNachbarfelder()
    {
        return this.anzahlFreierNachbarfelder;
    }
    


    public void setAnzahlFreierNachbarfelder(int[] anzahlFreierNachbarfelder)
    {
        this.anzahlFreierNachbarfelder = anzahlFreierNachbarfelder;
    }
    


    public int getAmZug()
    {
        return this.amZug;
    }
    


    public void setAmZug(int amZug)
    {
        this.amZug = amZug;
    }
    


    public Long getWeissSchwarz()
    {
        return this.weissSchwarz;
    }
    


    public void setWeissSchwarz(Long weissSchwarz)
    {
        this.weissSchwarz = weissSchwarz;
    }
    


    public long getZobristHashWert()
    {
        return this.zobristHashWert;
    }
    


    public void setZobristHashWert(long zobristHashWert){
        this.zobristHashWert = zobristHashWert;
    }
    


    public int[][] getMuehle()
    {
        return this.muehle;
    }
    


    public void setMuehle(int[][] muehle)
    {
        this.muehle = muehle;
    }
    


    public Zug getLetzterZug()
    {
        return this.letzterZug;
    }
    


    public void setLetzterZug(IZug letzterZug)
    {
        this.letzterZug = (Zug)letzterZug;
    }



//	public int[] getAnzahlOffenerMuehlen() {
//		return anzahlOffenerMuehlen;
//	}
//
//
//
//	public void setAnzahlOffenerMuehlen(int[] anzahlOffenerMuehlen) {
//		this.anzahlOffenerMuehlen = anzahlOffenerMuehlen;
//	}
    

    public int[] getAnzahlOffenerMuehlen()
    {
        int[] anzahlOffenerMuehlen = {0, 0};
        for (int i = 1; i< 65; i++)
        {
			if (this.offeneMuehle[0][i] == 3)
			{
				if ((this.getSpielpositionen()[0] & Util.bit[ZugGenerator.freiFeldEinerOffenenMuehle[i]]) == 0
						&&
					(this.getSpielpositionen()[1] & Util.bit[ZugGenerator.freiFeldEinerOffenenMuehle[i]]) == 0)
				{
					anzahlOffenerMuehlen[0]++;
				}
			}
			if (this.offeneMuehle[1][i] == 3)
			{
				if ((this.getSpielpositionen()[0] & Util.bit[ZugGenerator.freiFeldEinerOffenenMuehle[i]]) == 0
						&&
					(this.getSpielpositionen()[1] & Util.bit[ZugGenerator.freiFeldEinerOffenenMuehle[i]]) == 0)
				{
					anzahlOffenerMuehlen[1]++;
				}
			}
        }
        return anzahlOffenerMuehlen;

    }
    

}
