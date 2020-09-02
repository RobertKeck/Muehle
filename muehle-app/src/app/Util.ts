package muehle;

public class Util
{
    
    //	     1-----------------2-----------------3  
    //	 *   |                 |                 |  
    //	 *   |                 |                 |  
    //	 *   |     4-----------5-----------6     |  
    //	 *   |     |           |           |     |  
    //	 *   |     |           |           |     |  
    //	 *   |     |     7-----8-----9     |     |  
    //	 *   |     |     |           |     |     |  
    //	 *   |     |     |           |     |     |  
    //	 *  10----11----12          13----14----15  
    //	 *   |     |     |           |     |     |  
    //	 *   |     |     |           |     |     |  
    //	 *   |     |    16----17----18     |     |  
    //	 *   |     |           |           |     |  
    //	 *   |     |           |           |     |  
    //	 *   |    19----------20----------21     |  
    //	 *   |                 |                 |  
    //	 *   |                 |                 |  
    //	 *  22----------------23----------------24  
    

    /**
     * 0, 2^^0, 2^^1, 2^^2, 2^^3,..., 2^^23
     */
    public static final int[] bit                  = { 0,
                                                   // 2^^(n-1)       n (= Spielposition)
            1, // 1
            2, // 2 
            4, // 3
            8, // 4
            16, // 5
            32, // 6
            64, // 7
            128, // 8
            256, // 9
            512, // 10
            1024, // 11
            2048, // 12
            4096, // 13
            8192, // 14
            16384, // 15
            32768, // 16
            65536, // 17
            131072, // 18		
            262144, // 19
            524288, // 20
            1048576, // 21
            2097152, // 22
            4194304, // 23
            8388608                               };          // 24
                                                                
    /**
     * 1 -> 3
     * 4 -> 6
     * 7 -> 9
     * 10 -> 15
     * 11 -> 14
     * 12 -> 13
     * 16 -> 18
     * 19 -> 21
     * 22 -> 24
     * 
     * Also: 4 - 1 + 32 - 8 + 256 - 64 + 16384 - 512 + 8192 - 1024 + 4096 - 2048 + 131072 - 32768 +
     * 1048576 - 262144 + 8388608 - 2097152
     * = 7201499
     */
    static final int          ADD_LINKS            = 7201499;
    
    /**
     * Also 1 + 8 + 64 + 512 + 1024 + 2048 + 32768 + 262144 + 2097152 = 2395721
     * Die LINKE_HAELFTE umfasst die Positionen 1, 4, 7, 10, 11, 12, 16, 19, 22
     */
    static final int          LINKE_HAELFTE        = 2395721;  // 001001001000111001001001
    /**
     * Die RECHTE_HAELFTE umfasst die Positionen 3, 6, 9, 13, 14, 15, 18, 21, 24
     * Also 4 + 32 + 256 + 4096 + 8192 + 16384 + 131072 + 1048576 + 8388608 = 9597220
     */
    static final int          RECHTE_HAELFTE       = 9597220;  // 100100100111000100100100
    /**
     * Die HAELFTE_LINKS_OBEN umfasst die Positionen 1, 2, 4, 5, 7, 8, 10, 11, 12
     * Also 1 + 2 + 8 + 16 + 64 + 128 + 512 + 1024 + 2048 = 3803
     */
    static final int          HAELFTE_LINKS_OBEN   = 3803;     // 000000000000111011011011
                                                                
    /**
     * Die HAELFTE_RECHTS_UNTEN umfasst die Positionen 13, 14, 15, 17, 18, 20, 21, 23, 24
     * Also 4096 + 8192 + 16384 + 65536 + 131072 + 524288 + 1048576 + 4194304 + 8388608 = 14381056
     */
    static final int          HAELFTE_RECHTS_UNTEN = 14381056; // 110110110111000000000000
                                                                
    /**
     * Die HAELFTE_LINKS_UNTEN umfasst die Positionen 10, 11, 12, 16, 17, 19, 20, 22, 23
     * Also 512 + 1024 + 2048 + 32768 + 65536 + 262144 + 524288 + 2097152 + 4194304 = 7179776
     */
    static final int          HAELFTE_LINKS_UNTEN  = 7179776;  // 011011011000111000000000
    /**
     * Die HAELFTE_RECHTS_OBEN umfasst die Positionen 2, 3, 5, 6, 8, 9, 13, 14, 15
     * Also 2 + 4 + 16 + 32 + 128 + 256 + 4096 + 8192 + 16384 = 29110
     */
    static final int          HAELFTE_RECHTS_OBEN  = 29110;    // 000000000111000110110110
                                                                
    /**
     * Die OBERE_HAELFTE umfasst die Positionen 1, 2, 3, 4, 5, 6, 7, 8, 9
     * Also 1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 + 256 = 511
     */
    static final int          OBERE_HAELFTE        = 511;      // 000000000000000111111111
    /**
     * Die UNTERE_HAELFTE umfasst die Positionen 16, 17, 18, 19, 20, 21, 22, 23, 24
     * Also 32768 + 65536 + 131072 + 262144 + 524288 + 1048576 + 2097152 + 4194304 + 8388608 =
     * 16744448
     */
    static final int          UNTERE_HAELFTE       = 16744448; // 111111111000000000000000
                                                                
    /**
     * Die Vertikale umfasst die Positionen 2, 5, 8, 17, 20, 23
     * Also 2 + 16 + 128 + 65536 + 524288 + 4194304 = 4784274
     */
    static final int          VERTIKALE            = 4784274;  // 010010010000000010010010
    //static final long VERTIKALE = 80266803085458L;  //(4784274 <<24) + 4784274; 
    /**
     * Die HORIZONTALE umfasst die Positionen 10, 11, 12, 13, 14, 15
     * Also 512 + 1024 + 2048 + 4096 + 8192 + 16384 = 32256
     */
    static final int          HORIZONTALE          = 32256;    // 000000000111111000000000
    /**
     * Die DIAGONALE_I von links oben nach rechts unten umfasst die Positionen 1, 4, 7, 18, 21, 24
     * Also 1 + 8 + 64 + 131072 + 1048576 + 8388608 = 9568329
     */
    static final int          DIAGONALE_I          = 9568329;  // 100100100000000001001001
    /**
     * Die DIAGONALE_II von rechts oben nach links unten umfasst die Positionen 3, 6, 9, 16, 19, 22
     * Also 4 + 32 + 256 + 32768 + 262144 + 2097152 = 2392356
     */
    static final int          DIAGONALE_II         = 2392356;  // 001001001000000100100100
                                                                

    /**
     * GEWICHT_ANZ_STEINE ist der Faktor, mit dem in der Stellungsbewertung die Anzahl der
     * Steine gewichtet ist.
     * Das Gewicht wird eigentlich aus einer Properties gelesen, sollte es dort nicht vorhanden sein,
     * wird folgender Default-Wert verwendet:
     */
    static final int          GEWICHT_ANZ_STEINE				= 16;
    /**
     * GEWICHT_ANZ_MUEHLEN ist der Faktor, mit dem in der Stellungsbewertung die Anzahl der
     * Muehlen gewichtet ist.
     * Das Gewicht wird eigentlich aus einer Properties gelesen, sollte es dort nicht vorhanden sein,
     * wird folgender Default-Wert verwendet:
     */
    static final int          GEWICHT_ANZ_MUEHLEN				= 4;
    /**
     * GEWICHT_ANZ_OFFENE_MUEHLEN ist der Faktor, mit dem in der Stellungsbewertung die Anzahl der
     * offenen Muehlen gewichtet ist.
     * Das Gewicht wird eigentlich aus einer Properties gelesen, sollte es dort nicht vorhanden sein,
     * wird folgender Default-Wert verwendet:
     */
    static final int          GEWICHT_ANZ_OFFENE_MUEHLEN		= 5;
    /**
     * GEWICHT_ANZ_FREIE_NACHBARN ist der Faktor, mit dem in der Stellungsbewertung die Anzahl der
     * freien Nachbarfelder gewichtet ist.
     * Das Gewicht wird eigentlich aus einer Properties gelesen, sollte es dort nicht vorhanden sein,
     * wird folgender Default-Wert verwendet:
     */
    static final int          GEWICHT_ANZ_FREIE_NACHBARN		= 3;
    
    public static final int   WEISS                = 1;
    public static final int   SCHWARZ              = -1;
    static final int          MAXIMUM              = 30000;
    static final int          UNDEFINIERT          = 50000;
    public static final int   MENSCH               = 0;
    static final int          COMPUTER             = 1;
    
    static final int          HASHFELDGROESSE      = 67108864; // 2^26
                                                                
    static final short        HASHWERT_EXACT       = 0;
    static final short        HASHWERT_ALPHA       = 1;
    static final short        HASHWERT_BETA        = 2;
    
    

    /**
     * @deprecated
     * @param x
     * @return
     */
    static int reverse(int x)
    {
        int h = 0;
        
        for (int i = 0; i < 24; i++)
        {
            h = (h << 1) + (x & 1);
            x >>= 1;
        }
        
        return h;
    }
    


    /**
     * 12 -> 13 // 1 4096 ==> 4096 * 16777216 + 4096 = 68719480832
     * 1 -> 3 // 2 4 + 32 + 256 + 131072 + 1048576 + 8388608 = 9568548 ==> 9568548 * 16777216 +
     * 9568548 = 160533606170916
     * 4 -> 6
     * 7 -> 9
     * 16 -> 18
     * 19 -> 21
     * 22 -> 24
     * 11 -> 14 // 3 8192 ==> 8192 * 16777216 + 8192 = 137438961664
     * 10 -> 15 // 5 16384 ==> 16384 * 16777216 + 16384 = 274877923328
     */
    //	static boolean linksGleichRechts(long stellung1, long stellung2) {
    //		long posNeu = stellung1;
    //		posNeu <<= 1;
    //    	if ((posNeu &  68719480832L) == (stellung2 &  68719480832L )){
    //    		posNeu <<= 1;
    //    		// Positionen 3, 6, 9, 18, 21, 24: 
    //    		
    //    		// 	4 + 32 + 256 +  131072 + 1048576 + 8388608 = 9568548
    //    		if ((posNeu & 160533606170916L) == (stellung2 & 160533606170916L )){
    //    			posNeu <<= 1;
    //    			// Position 14 muss bei 3 shifts gleich sein
    //	    		if ((posNeu & 137438961664L) == (stellung2 & 137438961664L )){
    //	    			posNeu <<= 2;
    //	    			// Position 15 muss bei 5 shifts gleich sein
    //		    		if ((posNeu & 274877923328L) == (stellung2 & 274877923328L )){	
    //		    			return true;
    //		    		}
    //	    		}
    //    		}
    //    	}
    //		return false;
    //	}
    
    static boolean linksGleichRechts(int stellung1, int stellung2)
    {
        int posNeu = stellung1 << 1;
        if ((posNeu & 4096) == (stellung2 & 4096))
        {
            posNeu <<= 1;
            // Positionen 3, 6, 9, 18, 21, 24: 
            
            // 	4 + 32 + 256 +  131072 + 1048576 + 8388608 = 9568548
            if ((posNeu & 9568548) == (stellung2 & 9568548))
            {
                posNeu <<= 1;
                // Position 14 muss bei 3 shifts gleich sein
                if ((posNeu & 8192) == (stellung2 & 8192))
                {
                    posNeu <<= 2;
                    // Position 15 muss bei 5 shifts gleich sein
                    if ((posNeu & 16384) == (stellung2 & 16384))
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    


    /**
     * 1 -> 22 //21
     * 2 -> 23
     * 3 -> 24
     * 4 -> 19 //15
     * 5 -> 20
     * 6 -> 21
     * 7 -> 16 //9
     * 8 -> 17
     * 9 -> 18
     */
    static boolean obenGleichUnten(int stellung1, int stellung2)
    {
        int posNeu = stellung1 << 9;
        // Positionen 16 + 17 + 18:  		
        // 32768 + 65536 + 131072 = 229376
        if ((posNeu & 229376) == (stellung2 & 229376))
        {
            posNeu <<= 6;
            // Positionen  19, 20, 21
            // 262144 + 524288 + 1048576 = 1835008
            if ((posNeu & 1835008) == (stellung2 & 1835008))
            {
                posNeu <<= 6;
                // Positionen  22, 23, 24
                // 2097152 + 4194304 + 8388608 = 14680064 
                if ((posNeu & 14680064) == (stellung2 & 14680064))
                {
                    return true;
                }
            }
        }
        return false;
    }
    


    /**
     * 8 -> 12 // 4 // 2048 + 65536 = 67584
     * 13 -> 17 // 4
     * 5 -> 11 // 6 // 1024 + 524288 = 525312
     * 14 -> 20 // 6
     * 9 -> 16 // 7 // 32768
     * 2 -> 10 // 8 // 512 + 4194304 = 4194816
     * 15 -> 23 // 8
     * 6 -> 19 // 13 // 262144
     * 3 -> 22 // 19 // 2097152
     */
    static boolean linksUntenGleichRechtsOben(int stellung1, int stellung2)
    {
        int posNeu = stellung1 << 4;
        if ((posNeu & 67584) == (stellung2 & 67584))
        {
            posNeu <<= 2;
            if ((posNeu & 525312) == (stellung2 & 525312))
            {
                posNeu <<= 1;
                if ((posNeu & 32768) == (stellung2 & 32768))
                {
                    posNeu <<= 1;
                    if ((posNeu & 4194816) == (stellung2 & 4194816))
                    {
                        posNeu <<= 5;
                        if ((posNeu & 262144) == (stellung2 & 262144))
                        {
                            posNeu <<= 6;
                            if ((posNeu & 2097152) == (stellung2 & 2097152))
                            {
                                return true;
                            }
                            
                        }
                        
                    }
                    
                }
            }
        }
        return false;
    }
    


    /**
     * 8 -> 13 // 5 4096 + 65536 = 69632
     * 12 -> 17 // 5
     * 5 -> 14 // 9 8192 + 524288 = 532480
     * 11 -> 20 // 9
     * 7 -> 18 // 11 131072
     * 2 -> 15 // 13 16384 + 4194304 = 4210688
     * 10 -> 23 // 13
     * 4 -> 21 // 17 1048576
     * 1 -> 24 // 23 8388608
     * 
     **/
    static boolean linksObenGleichRechtsUnten(int stellung1, int stellung2)
    {
        int posNeu = stellung1 << 5;
        if ((posNeu & 69632) == (stellung2 & 69632))
        {
            posNeu <<= 4;
            if ((posNeu & 532480) == (stellung2 & 532480))
            {
                posNeu <<= 2;
                if ((posNeu & 131072) == (stellung2 & 131072))
                {
                    posNeu <<= 2;
                    if ((posNeu & 4210688) == (stellung2 & 4210688))
                    {
                        posNeu <<= 4;
                        if ((posNeu & 1048576) == (stellung2 & 1048576))
                        {
                            posNeu <<= 6;
                            if ((posNeu & 8388608) == (stellung2 & 8388608))
                            {
                                return true;
                            }
                            
                        }
                        
                    }
                    
                }
            }
        }
        return false;
    }
    

}
