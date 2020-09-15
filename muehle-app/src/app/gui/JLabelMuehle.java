package muehle.gui;


import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.util.ListIterator;

import javax.swing.JLabel;

import muehle.IStellung;
import muehle.IZug;
import muehle.Util;
import muehle.Zug;


public class JLabelMuehle extends JLabel implements MouseListener, MouseMotionListener
{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1220171385210433872L;
	
	MuehleFrame muehleFrame;
    
    

    public JLabelMuehle(MuehleFrame p_MuehleFrame)
    {
        this.addMouseListener(this);
        this.addMouseMotionListener(this);
        this.muehleFrame = p_MuehleFrame;
        this.setIcon(p_MuehleFrame.spielbrett);
    }
    


    public void mousePressed(MouseEvent evt)
    {
        
        // Wenn das Spiel nicht am laufen ist, darf kein Spielstein verschoben werden. Dasselbe
        // gilt, wenn der Mensch nicht am Zug ist.
        if (!this.muehleFrame.getSpiel().spielIstGestartet() || !this.muehleFrame.getSpiel().istMenschAmZug())
        {
            return;
        }
        int eigen = 0;
        
        //muehleFrame.spielbrett.mousePosBis = -1;
        
        int durchmesser = (new Double(this.muehleFrame.spielbrett.abstand
                * (1 - this.muehleFrame.spielbrett.faktor) + 0.5)).intValue();
        if (this.muehleFrame.getSpiel().getAktuelleStellung().getAmZug() == Util.WEISS)
        {
            this.muehleFrame.spielbrett.grafikSpielsteinPositionen[0][0] = 3;
            this.muehleFrame.spielbrett.grafikSpielsteinPositionen[0][1] = 8;
        }
        else
        {
            this.muehleFrame.spielbrett.grafikSpielsteinPositionen[0][0] = 5;
            this.muehleFrame.spielbrett.grafikSpielsteinPositionen[0][1] = 8;
        }
        int posAktuell = -1;
        for (int posNr = 0; posNr < 25; posNr++)
        {
            
            int x_von = (new Double(
                    this.muehleFrame.spielbrett.abstand
                            * (this.muehleFrame.spielbrett.grafikSpielsteinPositionen[posNr][0] - this.muehleFrame.spielbrett.faktor)
                            + 0.5)).intValue();
            int y_von = (new Double(
                    this.muehleFrame.spielbrett.abstand
                            * (this.muehleFrame.spielbrett.grafikSpielsteinPositionen[posNr][1] - this.muehleFrame.spielbrett.faktor)
                            + 0.5)).intValue();
            
            int x_bis = x_von + durchmesser;
            int y_bis = y_von + durchmesser;
            
            if (evt.getX() >= x_von && evt.getX() <= x_bis && evt.getY() >= y_von
                    && evt.getY() <= y_bis)
            {
                //muehleFrame.spielbrett.mousePos = posNr;
                posAktuell = posNr;
            }
        }
        

        if (posAktuell != -1)
        {
            if (this.muehleFrame.getSpiel().getAktuelleStellung().getAmZug() == Util.SCHWARZ)
            {
                eigen = 1;
            }
            if (this.muehleFrame.getSpiel().getComputerMensch()[eigen] == Util.MENSCH)
            {
                if (!this.muehleFrame.menschKannSchlagen)
                {
                    if (this.muehleFrame.getSpiel().getAktuelleStellung().istSteinNummerVonFarbeBesetzt(
                            eigen, posAktuell))
                    {
                        this.muehleFrame.spielbrett.spielsteinInBewegung = true;
                        this.muehleFrame.spielbrett.spielsteinBewegung_x = evt.getX();
                        this.muehleFrame.spielbrett.spielsteinBewegung_y = evt.getY();
                        this.muehleFrame.spielbrett.mousePosVon = posAktuell;
                    }
                }
                else
                {
                    
                    ListIterator<IZug> it = this.muehleFrame.getSpiel().getAlleAktuellGueltigenZuege().listIterator();
                    
                    while (it.hasNext())
                    {
                        IZug l_zug = it.next();
                        if (l_zug.getPosBis() == this.muehleFrame.spielbrett.mousePosBis
                                && l_zug.getPosVon() == this.muehleFrame.spielbrett.mousePosVon
                                && l_zug.getPosSteinWeg() == posAktuell)
                        {
                            this.muehleFrame.getSpiel().setNeuerZugMensch(l_zug);
                            this.muehleFrame.menschKannSchlagen = false;
                            this.muehleFrame.spielbrett.mousePosVon = -1;
                            this.muehleFrame.spielbrett.mousePosBis = -1;
                        }
                    }
                }
            }
            
        }
    }
    


    public void mouseEntered(MouseEvent evt)
    {
    }
    


    public void mouseExited(MouseEvent evt)
    {
    }
    


    public void mouseClicked(MouseEvent evt)
    {
        
    }
    


    public void mouseReleased(MouseEvent evt)
    {
        
        // Wenn das Spiel nicht am laufen ist, darf kein Spielstein verschoben werden. Dasselbe
        // gilt, wenn der Mensch nicht am Zug ist.
        if (this.muehleFrame.getSpiel() == null || !this.muehleFrame.getSpiel().spielIstGestartet()
                || !this.muehleFrame.getSpiel().istMenschAmZug())
        {
            return;
        }
        this.muehleFrame.spielbrett.spielsteinInBewegung = false;
        if (!this.muehleFrame.menschKannSchlagen)
        {
            
            int durchmesser = (new Double(this.muehleFrame.spielbrett.abstand
                    * (1 - this.muehleFrame.spielbrett.faktor) + 0.5)).intValue();
            if (this.muehleFrame.getSpiel().getAktuelleStellung().getAmZug() == Util.WEISS)
            {
                this.muehleFrame.spielbrett.grafikSpielsteinPositionen[0][0] = 3;
                this.muehleFrame.spielbrett.grafikSpielsteinPositionen[0][1] = 8;
            }
            else
            {
                this.muehleFrame.spielbrett.grafikSpielsteinPositionen[0][0] = 5;
                this.muehleFrame.spielbrett.grafikSpielsteinPositionen[0][1] = 8;
            }
            this.muehleFrame.spielbrett.mousePosBis = -1;
            for (int posNr = 1; posNr < 25; posNr++)
            {
                
                int x_von = (new Double(
                        this.muehleFrame.spielbrett.abstand
                                * (this.muehleFrame.spielbrett.grafikSpielsteinPositionen[posNr][0] - this.muehleFrame.spielbrett.faktor)
                                + 0.5)).intValue();
                int y_von = (new Double(
                        this.muehleFrame.spielbrett.abstand
                                * (this.muehleFrame.spielbrett.grafikSpielsteinPositionen[posNr][1] - this.muehleFrame.spielbrett.faktor)
                                + 0.5)).intValue();
                
                int x_bis = x_von + durchmesser;
                int y_bis = y_von + durchmesser;
                
                if (evt.getX() >= x_von && evt.getX() <= x_bis && evt.getY() >= y_von
                        && evt.getY() <= y_bis)
                {
                    this.muehleFrame.spielbrett.mousePosBis = posNr;
                }
            }
            
            if (this.muehleFrame.spielbrett.mousePosBis != -1)
            {
                ListIterator<IZug> it = this.muehleFrame.getSpiel().getAlleAktuellGueltigenZuege().listIterator();
                while (it.hasNext())
                {
                    IZug l_zug = it.next();
                    if (l_zug.getPosBis() == this.muehleFrame.spielbrett.mousePosBis
                            && l_zug.getPosVon() == this.muehleFrame.spielbrett.mousePosVon)
                    {
                        if (l_zug.getPosSteinWeg() == 0)
                        {
                            this.muehleFrame.getSpiel().setNeuerZugMensch(l_zug);
                            ((IStellung)this.muehleFrame.getSpiel().getAktuelleStellung()).setLetzterZug((Zug) l_zug);
                        }
                        else
                        {
                            this.muehleFrame.menschKannSchlagen = true;
                        }
                        
                    }
                }
            }
        }
        this.muehleFrame.zeichneStellung(this.muehleFrame.getSpiel().getAktuelleStellung());
    }
    


    public void mouseDragged(MouseEvent evt)
    {
        if (this.muehleFrame.spielbrett.spielsteinInBewegung)
        {
            this.muehleFrame.spielbrett.spielsteinBewegung_x = evt.getX();
            this.muehleFrame.spielbrett.spielsteinBewegung_y = evt.getY();
            this.muehleFrame.zeichneStellung(this.muehleFrame.getSpiel().getAktuelleStellung());
        }
    }
    


    public void mouseMoved(MouseEvent evt)
    {
        
        //
        //		 
        //		 int durchmesser = (new Double(muehleFrame.spielbrett.abstand * ( 1 - muehleFrame.spielbrett.faktor)+ 0.5)).intValue();
        //		 if (muehleFrame.aktuelleStellung.amZug == Util.WEISS){
        //			 muehleFrame.spielbrett.grafikSpielsteinPositionen[0][0] = 3;
        //			 muehleFrame.spielbrett.grafikSpielsteinPositionen[0][1] = 8;
        //		 }
        //		 else{
        //			 muehleFrame.spielbrett.grafikSpielsteinPositionen[0][0] = 5;
        //			 muehleFrame.spielbrett.grafikSpielsteinPositionen[0][1] = 8;
        //		 }
        //		 for (int posNr = 0; posNr < 25; posNr++){
        //			 
        //			 int x_von = (new Double(muehleFrame.spielbrett.abstand * ( muehleFrame.spielbrett.grafikSpielsteinPositionen[posNr][0] - muehleFrame.spielbrett.faktor)+ 0.5)).intValue();
        //			 int y_von = (new Double(muehleFrame.spielbrett.abstand * ( muehleFrame.spielbrett.grafikSpielsteinPositionen[posNr][1] - muehleFrame.spielbrett.faktor)+ 0.5)).intValue();
        //			 
        //			 int x_bis = x_von + durchmesser;
        //			 int y_bis = y_von + durchmesser;
        //			 
        //			 if (evt.getX() >= x_von && evt.getX() <= x_bis &&
        //				 evt.getY() >= y_von && evt.getY() <= y_bis){
        //				 muehleFrame.spielbrett.mousePos = posNr;
        //				 muehleFrame.zeichneStellung(muehleFrame.aktuelleStellung);
        //				 return;
        //			 }
        //		 }
        //		 if (muehleFrame.spielbrett.mousePos != -1){
        //			 muehleFrame.spielbrett.mousePos = -1;
        //			 muehleFrame.zeichneStellung(muehleFrame.aktuelleStellung);
        //		 }
        

    }
}
