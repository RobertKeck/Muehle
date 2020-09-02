package muehle;

import java.util.ArrayList;
import java.util.List;


import muehle.gui.IMuehleFrame;
import muehle.gui.MuehleFrame;

public class SpielTest implements ISpiel
{
    protected IMuehleFrame iMuehleFrame;
    private Stellung       aktuelleStellung  = null;
    protected boolean      spielIstGestartet = false;
    private Zug            neuerZugMensch    = null;
    protected int[]        computerMensch    = new int[2];
    
    

    /**
     * Main
     * 
     * @param args
     */
    public static void main(String[] args)
    {
        SpielTest spieltest = new SpielTest();
    }
    


    /**
     * Konstruktor
     * 
     */
    public SpielTest()
    {
        this.iMuehleFrame = new MuehleFrame(this);
        this.erstelleStartStellung();
        this.iMuehleFrame.zeichneStellung(this.getAktuelleStellung());
    }
    


    public void stoppeSpiel()
    {
        this.spielIstGestartet = false;
        this.iMuehleFrame.log("Spiel gestoppt");
        
    }
    


    public void loescheSpielfeld()
    {
        this.spielIstGestartet = false;
        this.iMuehleFrame.log("Spiel gel�scht.");
        

    }
    


    public void zugZurueck()
    {
        this.iMuehleFrame.log("Zug Zur�ck nicht implementiert.");
    }
    


    public void start()
    {
        this.spielIstGestartet = true;
        
    }
    


    public boolean spielIstGestartet()
    {
        return this.spielIstGestartet;
    }
    


    public boolean istMenschAmZug()
    {
        return true;
    }
    


    public IStellungAllgemein getAktuelleStellung()
    {
        return this.aktuelleStellung;
    }
    


    public void setAktuelleStellung(IStellungAllgemein p_aktuelleStellung)
    {
        this.aktuelleStellung = (Stellung) p_aktuelleStellung;
    }
    


    public IZug getNeuerZugMensch()
    {
        return this.neuerZugMensch;
    }
    


    public void setNeuerZugMensch(IZug p_neuerZug)
    {
        this.neuerZugMensch = (Zug) p_neuerZug;
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
    }
    


    public List<IZug> getAlleAktuellGueltigenZuege()
    {
        List<IZug> zugListe = new ArrayList<IZug>();
        
        return zugListe;
    }
    


    public int[] getComputerMensch()
    {
        return this.computerMensch;
    }
}
