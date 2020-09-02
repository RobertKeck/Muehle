package muehle;


import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;
import java.util.Vector;

import muehle.gui.IMuehleFrame;
import muehle.gui.MuehleFrame;

public class Spiel implements ISpiel
{
    

	protected IEngine      	   computerEngineWeiss = null;
	protected IEngine      	   computerEngineSchwarz = null;
    protected IMuehleFrame     iMuehleFrame;
    protected Vector<Long>     stellungsFolgeSchwarzWeiss = new Vector<Long>();
    protected Vector<IStellungAllgemein> stellungsFolge             = new Vector<IStellungAllgemein>();
    protected Stellung         aktuelleStellungKopie;
    protected Vector<Long>     stellungsFolgeSchwarzWeissKopie;
    protected Vector<IStellungAllgemein> stellungsFolgeKopie;
    private Stellung           aktuelleStellung           = null;
    protected SpielThread      spielThread;
    protected List<Stellung>   alleAktuellGueltigenStellungen;
    protected List<Stellung>   alleAktuellGueltigenStellungenKopie;
    //private Stellung neueStellungMensch = null;
    private Zug                neuerZugMensch             = null;
    /**
     * computerMensch[0] = COMPUTER -- Weiss wird vom Computer gespielt
     * computerMensch[0] = MENSCH -- Weiss wird vom Menschen gespielt
     * computerMensch[1] = COMPUTER -- Schwarz wird vom Computer gespielt
     * computerMensch[1] = MENSCH -- Schwarz wird vom Menschen gespielt
     */
    protected int[]            computerMensch             = new int[2];
    
    

    /**
     * Main
     * 
     * @param args
     */
    public static void main(String[] args)
    {
        Spiel spiel = new Spiel();
    }
    


    /**
     * Konstruktor
     */
    public Spiel()
    {
        this.iMuehleFrame = new MuehleFrame(this);
        this.erstelleStartStellung();
        this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);
    }
    


    /**
     * Spiele-Thread wird gestoppt
     */
    public void stoppeSpiel()
    {
    	stoppeSpiel("Das Spiel wurde unterbrochen  -  mit 'Start' kann es fortgesetzt werden.");
    }
    /**
     * Spiele-Thread wird gestoppt
     */
    public void stoppeSpiel(String p_ausgabe)
    {
    	computerEngineWeiss = null;
    	computerEngineSchwarz = null;

    	if (this.spielThread != null && this.spielThread.isAlive())
        {
            this.spielThread.stop();

            this.aktuelleStellung = this.aktuelleStellungKopie.kopiereStellung();

            this.stellungsFolgeSchwarzWeiss = new Vector<Long>(this.stellungsFolgeSchwarzWeissKopie);
            this.stellungsFolge = new Vector<IStellungAllgemein>(this.stellungsFolgeKopie);

        	// ermittle die aktuell gueltigen Zuege
            ZugGenerator zugGen = new ZugGenerator();
            this.alleAktuellGueltigenStellungen = zugGen.ermittleAlleZuege((Stellung) this.aktuelleStellung,
                    this.stellungsFolge.size(), false);

            this.log(p_ausgabe);
            this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);
        }
        
    }    
    public void zugZurueck()
    {
        
        this.stoppeSpiel();
        
        if (this.stellungsFolge.size() > 1)
        {
            
            this.stellungsFolge.remove(this.stellungsFolge.size() - 1);
            this.stellungsFolgeSchwarzWeiss.remove(this.stellungsFolgeSchwarzWeiss.size() - 1);
            this.aktuelleStellung = ((Stellung)this.stellungsFolge.get(this.stellungsFolge.size() - 1)).kopiereStellung();
            ZugGenerator zugGen = new ZugGenerator();
            this.aktuelleStellungKopie = this.aktuelleStellung.kopiereStellung();
            
            this.stellungsFolgeSchwarzWeissKopie = new Vector<Long>(this.stellungsFolgeSchwarzWeiss);
            this.stellungsFolgeKopie = new Vector<IStellungAllgemein>(this.stellungsFolge);
            
        	// ermittle die aktuell gueltigen Zuege
            this.alleAktuellGueltigenStellungen = zugGen.ermittleAlleZuege((Stellung) this.aktuelleStellung,
                    this.stellungsFolge.size(), false);
            
            this.alleAktuellGueltigenStellungenKopie = new ArrayList<Stellung>(this.alleAktuellGueltigenStellungen); 
            
            
            this.log("Der letzte Zug wurde r�ckg�ngig gemacht. Das Spiel wurde unterbrochen und kann mit 'Start' fortgesetzt werden.");
            // Stellung zeichnen
            this.zeichneSpielfeld();
            
        }
    }

    public void loescheSpielfeld()
    {
        String ausgabe = "";
        if (this.spielThread != null && this.spielThread.isAlive())
        {
            this.spielThread.stop();
        	computerEngineWeiss = null;
        	computerEngineSchwarz = null;

            ausgabe += "Das Spiel wurde beendet und das ";
        }
        this.erstelleStartStellung();
        ausgabe += "Spielfeld wurde gel�scht.";
        this.log(ausgabe);
        this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);
        
    }
    


    /**
     * Ausgabe der meldung in JTextfield und in Console
     * 
     * @param p_meldung
     */
    protected void log(String p_meldung)
    {
        this.iMuehleFrame.log(p_meldung);
        System.out.println(p_meldung);
    }
    


    protected void erstelleStartStellung()
    {
        this.aktuelleStellung = new Stellung();
        this.aktuelleStellung.setAmZug(Util.WEISS);
        int[] initialAnzahlSteine = {9,9};
        
        this.aktuelleStellung.setAnzahlSteine(initialAnzahlSteine);
        this.aktuelleStellung.setAnzahlSteineAussen(initialAnzahlSteine);
        this.aktuelleStellung.anzahlMuehlen[0] = 0;
        this.aktuelleStellung.anzahlMuehlen[1] = 0;
//        this.aktuelleStellung.anzahlOffenerMuehlen[0] = 0;
//        this.aktuelleStellung.anzahlOffenerMuehlen[1] = 0;
        this.aktuelleStellung.anzahlFreierNachbarfelder[0] = 0;
        this.aktuelleStellung.anzahlFreierNachbarfelder[1] = 0;
        for (int i = 0; i < 17; i++)
        {
            this.aktuelleStellung.muehle[0][i] = 0;
            this.aktuelleStellung.muehle[1][i] = 0;
//            this.aktuelleStellung.offeneMuehle[0][i] = 0;
//            this.aktuelleStellung.offeneMuehle[1][i] = 0;
        }
        int[] leeresSpielfeld = {0,0};
        this.aktuelleStellung.setSpielpositionen(leeresSpielfeld);
        this.aktuelleStellung.setBewertung(0);
        this.aktuelleStellung.weissSchwarz = new Long(0);
        
        this.computerMensch[0] = Util.MENSCH; // Weiss
        this.computerMensch[1] = Util.MENSCH; // Schwarz
        this.stellungsFolgeSchwarzWeiss = new Vector<Long>();
        this.stellungsFolge = new Vector<IStellungAllgemein>();
        this.stellungsFolgeSchwarzWeiss.add(this.aktuelleStellung.weissSchwarz);
        this.stellungsFolge.add(this.aktuelleStellung);
    }
    


    
    


    protected void zeichneSpielfeld()
    {
        this.iMuehleFrame.zeichneStellung(this.aktuelleStellung);
    }
    
    public void start()
    {
        
        if (this.spielThread != null)
        {
            this.spielThread.stop();
        }
        this.spielThread = new SpielThread(this);
    	computerEngineWeiss = new KeckEngine();
    	computerEngineSchwarz = new KeckEngine();
    	//computerEngineSchwarz = new ZufallsEngine();
        
        this.spielThread.start();
    }
    


    public List<IZug> getAlleAktuellGueltigenZuege()
    {
        List<IZug> alleZuege = new ArrayList<IZug>();
        
        ListIterator<Stellung> it = this.alleAktuellGueltigenStellungen.listIterator();
        while (it.hasNext())
        {
            IStellungAllgemein l_stellung = it.next();
            alleZuege.add(l_stellung.getLetzterZug());
        }
        return alleZuege;
    }
    


    public boolean spielIstGestartet()
    {
        if (this.spielThread == null)
        {
            return false;
        }
        return this.spielThread.isAlive();
    }
    


    public boolean istMenschAmZug()
    {
        if (this.spielIstGestartet())
        {
            int eigen = 0;
            if (this.aktuelleStellung.getAmZug() == -1)
            {
                eigen = 1;
            }
            if (this.computerMensch[eigen] == Util.MENSCH)
            {
                return true;
            }
        }
        return false;
    }
    


    public IMuehleFrame getMuehleFrame()
    {
        return this.iMuehleFrame;
    }
    


    public IStellung getAktuelleStellung()
    {
        return this.aktuelleStellung;
    }
    


    public void setAktuelleStellung(IStellungAllgemein aktuelleStellung)
    {
        this.aktuelleStellung = (Stellung) aktuelleStellung;
    }
    


    public IZug getNeuerZugMensch()
    {
        return this.neuerZugMensch;
    }
    


    public void setNeuerZugMensch(IZug p_neuerZug)
    {
        this.neuerZugMensch = (Zug) p_neuerZug;
    }
    


    public int[] getComputerMensch()
    {
        return this.computerMensch;
    }
    


    public void setComputerMensch(int[] computerMensch)
    {
        this.computerMensch = computerMensch;
    }
    


    /**
     * Ermittelt zum uebergeben Zug die Stellung, die entsteht, wenn der Zug ausgefuehrt wird.
     * Wenn null zurueckgegeben wird, ist der Zug nicht gueltig
     *  
     * Wenn null zur
     * @param p_gueltigerZug
     * @return
     */
    protected Stellung ermittleStellungZumGueltigenZug(Zug p_gueltigerZug)
    {
    	if (p_gueltigerZug == null){
    		return null;
    	}
        ListIterator<Stellung> it = this.alleAktuellGueltigenStellungen.listIterator();
        while (it.hasNext())
        {
            IStellungAllgemein l_stellung = it.next();
            if (l_stellung.getLetzterZug().getPosVon() == p_gueltigerZug.getPosVon() 
            		&&
           		l_stellung.getLetzterZug().getPosBis() == p_gueltigerZug.getPosBis()
           			&&
           		l_stellung.getLetzterZug().getPosSteinWeg() == p_gueltigerZug.getPosSteinWeg() )
            {
                return (Stellung) l_stellung;
            }
        }
        return null;
    }
}
