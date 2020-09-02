package muehle;

public class Zug implements IZug
{
    private int posVon;
    private int posBis;
    private int posSteinWeg;
    
    

    public int getPosVon()
    {
        return this.posVon;
    }
    


    public void setPosVon(int posVon)
    {
        this.posVon = posVon;
    }
    


    public int getPosBis()
    {
        return this.posBis;
    }
    


    public void setPosBis(int posBis)
    {
        this.posBis = posBis;
    }
    


    public int getPosSteinWeg()
    {
        return this.posSteinWeg;
    }
    


    public void setPosSteinWeg(int posSteinWeg)
    {
        this.posSteinWeg = posSteinWeg;
    }
    

}
