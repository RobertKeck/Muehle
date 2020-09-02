package muehle;

import java.util.Collections;
import java.util.List;
import java.util.Vector;

public class ZufallsEngine implements IEngine{
	
	public IZug berechneNeuenZug(Vector<IStellungAllgemein> p_stellungsFolge, int p_zugtiefeMax){
		Stellung l_stellung = (Stellung)p_stellungsFolge.lastElement();
		ZugGenerator    zugGen                      = new ZugGenerator();
		
		List<Stellung> alleStellungen =  zugGen.ermittleAlleZuege(l_stellung, 0, false);
		Collections.sort(alleStellungen);
		return alleStellungen.get(0).getLetzterZug();
	}

		
	public String getEngineName(){
		return "ZufallsEngine";
	}
		

}
