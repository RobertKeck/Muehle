package muehle;

public class Hasheintrag
{
    public int   bewertung;
    public short zugtiefe;
    public short guete;     // 0 = Exact, 1 = Alpha, 2 = Beta	
    public long  zobristKey;
    
    

    public Hasheintrag(int p_bewertung, short p_zugtiefe, short p_guete, long p_zobristKey)
    {
        this.bewertung = p_bewertung;
        this.zugtiefe = p_zugtiefe;
        this.guete = p_guete;
        this.zobristKey = p_zobristKey;
    }
}
