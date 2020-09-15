package muehle.gui;

import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics;
import java.util.ListIterator;

import javax.swing.Icon;

import muehle.IStellungAllgemein;
import muehle.IZug;
import muehle.Stellung;

public class SpielbrettGrafik implements Icon
{
    private static final int   VOLLKREIS_IN_GRAD          = 360;
    public int                 spielfeldgroesse           = 800;
    public int                 abstand                    = this.spielfeldgroesse / 8;
    public final double        faktor                     = 0.333333333;
    public final int[][]       grafikSpielsteinPositionen = { { 0, 0 }, { 1, 1 }, { 4, 1 },
            { 7, 1 }, { 2, 2 }, { 4, 2 }, { 6, 2 }, { 3, 3 }, { 4, 3 }, { 5, 3 }, { 1, 4 },
            { 2, 4 }, { 3, 4 }, { 5, 4 }, { 6, 4 }, { 7, 4 }, { 3, 5 }, { 4, 5 }, { 5, 5 },
            { 2, 6 }, { 4, 6 }, { 6, 6 }, { 1, 7 }, { 4, 7 }, { 7, 7 } };
    private IStellungAllgemein stellung;
    
    int                        mousePosBis                = -1;
    int                        mousePosVon                = -1;
    boolean                    spielsteinInBewegung       = false;
    int                        spielsteinBewegung_x       = 0;
    int                        spielsteinBewegung_y       = 0;
    MuehleFrame                muehleFrame;
    
    

    public SpielbrettGrafik(MuehleFrame p_MuehleFrame)
    {
        this.muehleFrame = p_MuehleFrame;
    }
    


    public void paintIcon(Component c, Graphics g, int x, int y)
    {
        
        int c_x = c.getBounds().width;
        int c_y = c.getBounds().height;
        if (c_x < c_y)
        {
            this.spielfeldgroesse = c_x;
        }
        else
        {
            this.spielfeldgroesse = c_y;
        }
        this.abstand = (new Double(this.spielfeldgroesse / 9 + 0.5)).intValue();
        

        // Spielbrett zeichnen
        g.setColor(Color.white);
        g.fillRect(0, 0, this.getIconWidth(), this.getIconHeight());
        g.setColor(Color.black);
        g.drawLine(this.abstand, this.abstand, 7 * this.abstand, this.abstand);
        g.drawLine(this.abstand, this.abstand, this.abstand, 7 * this.abstand);
        g.drawLine(this.abstand, 7 * this.abstand, 7 * this.abstand, 7 * this.abstand);
        g.drawLine(7 * this.abstand, 7 * this.abstand, 7 * this.abstand, this.abstand);
        
        g.drawLine(2 * this.abstand, 2 * this.abstand, 6 * this.abstand, 2 * this.abstand);
        g.drawLine(2 * this.abstand, 2 * this.abstand, 2 * this.abstand, 6 * this.abstand);
        g.drawLine(2 * this.abstand, 6 * this.abstand, 6 * this.abstand, 6 * this.abstand);
        g.drawLine(6 * this.abstand, 6 * this.abstand, 6 * this.abstand, 2 * this.abstand);
        
        g.drawLine(3 * this.abstand, 3 * this.abstand, 5 * this.abstand, 3 * this.abstand);
        g.drawLine(3 * this.abstand, 3 * this.abstand, 3 * this.abstand, 5 * this.abstand);
        g.drawLine(3 * this.abstand, 5 * this.abstand, 5 * this.abstand, 5 * this.abstand);
        g.drawLine(5 * this.abstand, 5 * this.abstand, 5 * this.abstand, 3 * this.abstand);
        
        g.drawLine(4 * this.abstand, this.abstand, 4 * this.abstand, 3 * this.abstand);
        g.drawLine(4 * this.abstand, 5 * this.abstand, 4 * this.abstand, 7 * this.abstand);
        g.drawLine(this.abstand, 4 * this.abstand, 3 * this.abstand, 4 * this.abstand);
        g.drawLine(5 * this.abstand, 4 * this.abstand, 7 * this.abstand, 4 * this.abstand);
        
        // Zeichne Rand fuer Aussensteine
        int abstand_halbe = (new Double(this.abstand / 2)).intValue();
        
        g.drawLine(2 * this.abstand + abstand_halbe, 8 * this.abstand - abstand_halbe, 3
                * this.abstand + abstand_halbe, 8 * this.abstand - abstand_halbe);
        g.drawLine(3 * this.abstand + abstand_halbe, 8 * this.abstand - abstand_halbe, 3
                * this.abstand + abstand_halbe, 9 * this.abstand - abstand_halbe);
        g.drawLine(3 * this.abstand + abstand_halbe, 9 * this.abstand - abstand_halbe, 2
                * this.abstand + abstand_halbe, 9 * this.abstand - abstand_halbe);
        g.drawLine(2 * this.abstand + abstand_halbe, 9 * this.abstand - abstand_halbe, 2
                * this.abstand + abstand_halbe, 8 * this.abstand - abstand_halbe);
        
        g.drawLine(5 * this.abstand - abstand_halbe, 8 * this.abstand - abstand_halbe, 6
                * this.abstand - abstand_halbe, 8 * this.abstand - abstand_halbe);
        g.drawLine(6 * this.abstand - abstand_halbe, 8 * this.abstand - abstand_halbe, 6
                * this.abstand - abstand_halbe, 9 * this.abstand - abstand_halbe);
        g.drawLine(6 * this.abstand - abstand_halbe, 9 * this.abstand - abstand_halbe, 5
                * this.abstand - abstand_halbe, 9 * this.abstand - abstand_halbe);
        g.drawLine(5 * this.abstand - abstand_halbe, 9 * this.abstand - abstand_halbe, 5
                * this.abstand - abstand_halbe, 8 * this.abstand - abstand_halbe);
        
        if (this.muehleFrame.getSpiel().getAktuelleStellung() != null)
        {
            //  wenn Muehle geschlossen wurde, dann markiere alle schlagbaren Steine
            if (this.muehleFrame.menschKannSchlagen)
            {
                
                ListIterator<IZug> it = this.muehleFrame.getSpiel().getAlleAktuellGueltigenZuege().listIterator();
                
                while (it.hasNext())
                {
                    IZug l_zug = it.next();
                    if (l_zug.getPosBis() == this.muehleFrame.spielbrett.mousePosBis
                            && l_zug.getPosVon() == this.muehleFrame.spielbrett.mousePosVon)
                    {
                        g.setColor(Color.red);
                        System.out.println("zu schlagen: " + l_zug.getPosSteinWeg());
                        g.fillArc(
                                (new Double(
                                        this.abstand
                                                * (this.grafikSpielsteinPositionen[l_zug.getPosSteinWeg()][0] - this.faktor)
                                                + 0.5)).intValue() - 1,
                                (new Double(
                                        this.abstand
                                                * (this.grafikSpielsteinPositionen[l_zug.getPosSteinWeg()][1] - this.faktor)
                                                + 0.5)).intValue() - 1, (new Double(this.abstand
                                        * (1 - this.faktor) + 0.5)).intValue() + 2, (new Double(
                                        this.abstand * (1 - this.faktor) + 0.5)).intValue() + 2, 0,
                                360);
                        
                    }
                }
                g.setColor(Color.red);
                g.fillArc(
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.muehleFrame.spielbrett.mousePosBis][0] - this.faktor)
                                        + 0.5)).intValue() - 1,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.muehleFrame.spielbrett.mousePosBis][1] - this.faktor)
                                        + 0.5)).intValue() - 1, (new Double(this.abstand
                                * (1 - this.faktor) + 0.5)).intValue() + 2, (new Double(
                                this.abstand * (1 - this.faktor) + 0.5)).intValue() + 2, 0, 360);
                
            }
            
            // Zeichne weisse Steine der Stellung
            g.setColor(Color.lightGray);
            
            for (int bitNr = 1; bitNr < 25; bitNr++)
            {
                if (this.stellung.istSteinNummerVonFarbeBesetzt(0, bitNr))
                {
                    //if ( ((stellung.spielpositionen[0]) & Util.bit[bitNr]) == Util.bit[bitNr]){
                    g.fillArc(
                            (new Double(this.abstand
                                    * (this.grafikSpielsteinPositionen[bitNr][0] - this.faktor)
                                    + 0.5)).intValue(), (new Double(this.abstand
                                    * (this.grafikSpielsteinPositionen[bitNr][1] - this.faktor)
                                    + 0.5)).intValue(), (new Double(this.abstand
                                    * (1 - this.faktor) + 0.5)).intValue(), (new Double(
                                    this.abstand * (1 - this.faktor) + 0.5)).intValue(), 0, 360);
                }
            }
            // Zeichne schwarze Steine der Stellung
            g.setColor(Color.black);
            
            for (int bitNr = 1; bitNr < 25; bitNr++)
            {
                if (this.stellung.istSteinNummerVonFarbeBesetzt(1, bitNr))
                {
                    //if ( ((stellung.spielpositionen[1]) & Util.bit[bitNr]) == Util.bit[bitNr]){
                    g.fillArc(
                            (new Double(this.abstand
                                    * (this.grafikSpielsteinPositionen[bitNr][0] - this.faktor)
                                    + 0.5)).intValue(), (new Double(this.abstand
                                    * (this.grafikSpielsteinPositionen[bitNr][1] - this.faktor)
                                    + 0.5)).intValue(), (new Double(this.abstand
                                    * (1 - this.faktor) + 0.5)).intValue(), (new Double(
                                    this.abstand * (1 - this.faktor) + 0.5)).intValue(), 0, 360);
                }
            }
            

            // Zeichne Steine Ausserhalb
            int abstand_drittel = (new Double(this.abstand / 3)).intValue();
            if (this.stellung.getAnzahlSteineAussen()[0] > 0)
            {
                g.setColor(Color.lightGray);
                g.fillArc(3 * this.abstand - abstand_drittel, 8 * this.abstand - abstand_drittel,
                        (new Double(this.abstand * (1 - this.faktor) + 0.5)).intValue(),
                        (new Double(this.abstand * (1 - this.faktor) + 0.5)).intValue(), 0,
                        VOLLKREIS_IN_GRAD);
                g.setColor(Color.black);
                g.drawString((new Integer(this.stellung.getAnzahlSteineAussen()[0])).toString(),
                        3 * this.abstand, 8 * this.abstand);
            }
            if (this.stellung.getAnzahlSteineAussen()[1] > 0)
            {
                g.setColor(Color.black);
                g.fillArc(5 * this.abstand - abstand_drittel, 8 * this.abstand - abstand_drittel,
                        (new Double(this.abstand * (1 - this.faktor) + 0.5)).intValue(),
                        (new Double(this.abstand * (1 - this.faktor) + 0.5)).intValue(), 0, 360);
                
                g.setColor(Color.white);
                g.drawString((new Integer(this.stellung.getAnzahlSteineAussen()[1])).toString(),
                        5 * this.abstand, 8 * this.abstand);
            }
            
            // Mouse-Cursor ueber Spielstein 
            //		if (mousePosBis != -1){
            //			g.setColor(Color.green);
            //			g.drawArc((new Double(abstand * ( grafikSpielsteinPositionen[mousePosBis][0] - faktor)+ 0.5)).intValue(),
            //					  (new Double(abstand * ( grafikSpielsteinPositionen[mousePosBis][1] - faktor)+ 0.5)).intValue(),
            //					  (new Double(abstand * ( 1 - faktor)+ 0.5)).intValue(),
            //					  (new Double(abstand * ( 1 - faktor)+ 0.5)).intValue(),
            //					  0,360);
            //			
            //		}
            if (this.spielsteinInBewegung)
            {
                g.setColor(Color.green);
                g.fillArc(
                        this.spielsteinBewegung_x
                                - (new Double((this.abstand * (1 - this.faktor) + 0.5) / 2)).intValue(),
                        this.spielsteinBewegung_y
                                - (new Double((this.abstand * (1 - this.faktor) + 0.5) / 2)).intValue(),
                        (new Double(this.abstand * (1 - this.faktor) + 0.5)).intValue(),
                        (new Double(this.abstand * (1 - this.faktor) + 0.5)).intValue(), 0, 360);
            }
            
            // Markiere Zug: Position von und Position Bis  mit gruenem Kreuz,
            // geschlagenen Stein mit rotem Kreuz
            if (this.stellung.getLetzterZug().getPosVon() != 0)
            {
                g.setColor(Color.green);
                g.setColor(Color.green);
                g.drawLine(
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosVon()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosVon()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosVon()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosVon()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7);
                g.drawLine(
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosVon()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosVon()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosVon()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosVon()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7);
            }
            
            if (this.stellung.getLetzterZug().getPosBis() != 0)
            {
                g.setColor(Color.green);
                g.drawLine(
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosBis()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosBis()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosBis()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosBis()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7);
                g.drawLine(
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosBis()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosBis()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosBis()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosBis()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7);
            }
            if (this.stellung.getLetzterZug().getPosSteinWeg() != 0)
            {
                g.setColor(Color.red);
                g.drawLine(
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosSteinWeg()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosSteinWeg()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosSteinWeg()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosSteinWeg()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7);
                g.drawLine(
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosSteinWeg()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosSteinWeg()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosSteinWeg()][0] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand / 4,
                        (new Double(
                                this.abstand
                                        * (this.grafikSpielsteinPositionen[this.stellung.getLetzterZug().getPosSteinWeg()][1] - this.faktor)
                                        + 0.5)).intValue()
                                + this.abstand * 3 / 7);
            }
        }
    }
    


    public int getIconWidth()
    {
        return this.spielfeldgroesse - this.abstand;
    } // bestimmt die Breite des Icons
    


    public int getIconHeight()
    {
        return this.spielfeldgroesse;
    } // bestimmt die H�he des Icons
    
    

    public void setStellung(Stellung p_stellung)
    {
        this.stellung = p_stellung;
    }
    

}
