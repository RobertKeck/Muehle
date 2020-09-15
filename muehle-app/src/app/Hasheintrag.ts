
export class Hasheintrag
{
    bewertung: number;
    zugtiefe: number;
    guete: number;     // 0 = Exact, 1 = Alpha, 2 = Beta
    zobristKey: number;


    constructor(bewertung: number, zugtiefe: number, guete: number, zobristKey: number)
    {
        this.bewertung = bewertung;
        this.zugtiefe = zugtiefe;
        this.guete = guete;
        this.zobristKey = zobristKey;
    }
}
