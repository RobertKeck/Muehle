package muehle;

import java.util.Vector;

public class SpielfeldModel
{
    
    Stellung         aktuelleStellung;
    Vector<Stellung> stellungsFolge;
    
    

    public Stellung getAktuelleStellung()
    {
        return this.aktuelleStellung;
    }
    


    public void setAktuelleStellung(Stellung p_Stellung)
    {
        this.aktuelleStellung = p_Stellung;
    }
    


    public Vector<Stellung> getStellungsFolge()
    {
        return this.stellungsFolge;
    }
    


    public void setStellungsFolge(Vector<Stellung> p_StellungsFolge)
    {
        this.stellungsFolge = p_StellungsFolge;
    }
}
