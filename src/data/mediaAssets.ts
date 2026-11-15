import heroPapuma from '../assets/real/hero_papuma.jpg';
import fajarPapuma from '../assets/real/fajar_papuma.jpg';
import pantaiPapuma from '../assets/real/pantai_papuma.jpg';
import pantaiWatuUlo from '../assets/real/pantai_watu_ulo.jpg';
import watuUloSunset from '../assets/real/watu_ulo_sunset.jpg';
import telukLove from '../assets/real/teluk_love.jpg';
import pantaiPayangan from '../assets/real/pantai_payangan.jpg';
import pantaiPuger from '../assets/real/pantai_puger.jpg';
import pantaiBandealit from '../assets/real/pantai_bandealit.jpg';
import pantaiNanggelan from '../assets/real/pantai_nanggelan.jpg';
import airTerjunJember from '../assets/real/air_terjun_jember.jpg';
import tancakTulis from '../assets/real/tancak_tulis.jpg';
import tujuhBidadariWaterfall from '../assets/real/tujuh_bidadari_waterfall.jpg';
import airTerjunAntrokan from '../assets/real/air_terjun_antrokan.jpg';
import gunungGambir from '../assets/real/gunung_gambir.jpg';
import rembangan from '../assets/real/rembangan.jpg';
import gunungPasang from '../assets/real/gunung_pasang.jpg';
import cafeGumitir from '../assets/real/cafe_gumitir.jpg';
import tamanBotaniPool from '../assets/real/taman_botani_pool.jpg';
import tamanBotani from '../assets/real/taman_botani.jpg';
import jemberMiniZoo from '../assets/real/jember_mini_zoo.jpg';
import tempurejo from '../assets/real/tempurejo.jpg';
import pemandianPatemon from '../assets/real/pemandian_patemon.jpg';
import alunAlunJember from '../assets/real/alun_alun_jember.jpg';
import situsCalokArjasa from '../assets/real/situs_calok_arjasa.jpg';

export const MEDIA_ASSETS: Record<string, string> = {
  '/src/assets/real/hero_papuma.jpg': heroPapuma,
  '/src/assets/real/fajar_papuma.jpg': fajarPapuma,
  '/src/assets/real/pantai_papuma.jpg': pantaiPapuma,
  '/src/assets/real/pantai_watu_ulo.jpg': pantaiWatuUlo,
  '/src/assets/real/watu_ulo_sunset.jpg': watuUloSunset,
  '/src/assets/real/teluk_love.jpg': telukLove,
  '/src/assets/real/pantai_payangan.jpg': pantaiPayangan,
  '/src/assets/real/pantai_puger.jpg': pantaiPuger,
  '/src/assets/real/pantai_bandealit.jpg': pantaiBandealit,
  '/src/assets/real/pantai_nanggelan.jpg': pantaiNanggelan,
  '/src/assets/real/air_terjun_jember.jpg': airTerjunJember,
  '/src/assets/real/tancak_tulis.jpg': tancakTulis,
  '/src/assets/real/tujuh_bidadari_waterfall.jpg': tujuhBidadariWaterfall,
  '/src/assets/real/air_terjun_antrokan.jpg': airTerjunAntrokan,
  '/src/assets/real/gunung_gambir.jpg': gunungGambir,
  '/src/assets/real/rembangan.jpg': rembangan,
  '/src/assets/real/gunung_pasang.jpg': gunungPasang,
  '/src/assets/real/cafe_gumitir.jpg': cafeGumitir,
  '/src/assets/real/taman_botani_pool.jpg': tamanBotaniPool,
  '/src/assets/real/taman_botani.jpg': tamanBotani,
  '/src/assets/real/jember_mini_zoo.jpg': jemberMiniZoo,
  '/src/assets/real/tempurejo.jpg': tempurejo,
  '/src/assets/real/pemandian_patemon.jpg': pemandianPatemon,
  '/src/assets/real/alun_alun_jember.jpg': alunAlunJember,
  '/src/assets/real/situs_calok_arjasa.jpg': situsCalokArjasa,
};

export function resolveMediaAsset(path: string, fallback?: string): string {
  if (MEDIA_ASSETS[path]) {
    return MEDIA_ASSETS[path];
  }
  if (fallback && MEDIA_ASSETS[fallback]) {
    return MEDIA_ASSETS[fallback];
  }
  return path;
}
