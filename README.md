# AI Mapa - Časový manažer s navigací

AI Mapa je komplexní aplikace, která kombinuje časový manažer s mapovou navigací. Aplikace využívá umělou inteligenci pro automatické plánování úkolů, odhad doby trvání a navigaci na místa, která potřebujete navštívit.

## Hlavní funkce

### Časový manažer
- Přidávání jednotlivých úkolů s odhadem doby trvání
- Automatický odhad doby trvání úkolů pomocí AI
- Přidávání volnočasových aktivit
- Sledování dokončených úkolů
- Zobrazení aktuálního času a odpočtu do čtvrtka

### Komplexní úkoly
- Zadání komplexního úkolu, který AI automaticky rozdělí na dílčí úkoly
- Automatické plánování dílčích úkolů v časovém rozvrhu
- Identifikace míst, která je potřeba navštívit
- Zobrazení míst na mapě s možností navigace

### Mapová navigace
- Vyhledávání míst pomocí přirozeného jazyka
- Zobrazení trasy k vyhledaným místům
- Informace o vzdálenosti a době cesty
- Zobrazení okolních míst

## Jak používat aplikaci

### Nastavení API klíče
1. Klikněte na tlačítko "API Klíč" v pravém horním rohu
2. Zadejte svůj OpenAI API klíč (můžete získat na [OpenAI platformě](https://platform.openai.com/api-keys))
3. Klikněte na "Uložit klíč"

### Přidání jednotlivého úkolu
1. V sekci "Nový úkol" zadejte název úkolu
2. Volitelně zadejte odhadovanou dobu trvání v minutách nebo klikněte na ikonu hodin pro automatický odhad
3. Klikněte na tlačítko "+" pro přidání úkolu

### Přidání volnočasové aktivity
1. V sekci "Volnočasová aktivita" zadejte název aktivity
2. Klikněte na tlačítko "+" pro přidání aktivity

### Zadání komplexního úkolu
1. Klikněte na tlačítko "Komplexní úkol" vedle nadpisu "Můj časový manažer"
2. Zadejte popis komplexního úkolu (např. "Nakoupit potraviny v Kauflandu a vyzvednout balíček na poště")
3. Klikněte na "Rozdělit a automaticky naplánovat"
4. AI rozdělí úkol na dílčí úkoly, přidá je do seznamu a vytvoří časový rozvrh
5. Pokud úkol obsahuje místa k navštívení, budou automaticky zobrazena na mapě

### Použití mapy
1. Klikněte na tlačítko "Mapa" v horní části aplikace
2. Zadejte do vyhledávacího pole, co hledáte (např. "Kde je nejbližší kavárna")
3. Klikněte na "Hledat" nebo stiskněte Enter
4. Na mapě se zobrazí trasa k vyhledanému místu
5. V pravé části se zobrazí informace o trase a okolních místech

### Práce s místy z komplexních úkolů
1. Po zadání komplexního úkolu s místy k navštívení se aplikace automaticky přepne na mapu
2. V levé části se zobrazí seznam míst k navštívení
3. Kliknutím na místo v seznamu zobrazíte trasu k tomuto místu
4. Mezi časovým manažerem a mapou můžete přepínat pomocí tlačítek v horní části

## Technické informace

Aplikace je postavena na následujících technologiích:
- React.js - frontend framework
- OpenAI API - pro AI funkce (rozdělení úkolů, odhad času)
- Google Maps API - pro mapové funkce a navigaci

## Instalace a spuštění

### Standardní instalace

1. Naklonujte repozitář: `git clone -b v1 https://github.com/frimmelma/ai-map.git`
2. Přejděte do adresáře: `cd ai-map`
3. Nainstalujte závislosti bez varování: `npm run clean-install`
4. Spusťte vývojový server bez varování: `./start-without-warnings.sh`
5. Aplikace bude dostupná na adrese: `http://localhost:3000`

### Spuštění pomocí Docker Compose

1. Nainstalujte Docker a Docker Compose:
   - **Ubuntu/Debian**: `sudo apt install docker.io docker-compose`
   - **Fedora**: `sudo dnf install docker docker-compose`
   - **Windows/Mac**: Stáhněte [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. Naklonujte repozitář: `git clone -b v1 https://github.com/frimmelma/ai-map.git`
3. Přejděte do kořenového adresáře: `cd ai-map`
4. Sestavte a spusťte kontejnery: `docker-compose up --build`
5. Aplikace bude dostupná na adrese: `http://localhost:3000`

### Řešení problémů

Pokud se při instalaci zobrazují varování o zastaralých balíčcích:

1. Ujistěte se, že používáte větev `v1`: `git checkout v1`
2. Použijte skript pro čistou instalaci: `npm run clean-install`
3. Nebo spusťte aplikaci pomocí Docker Compose, který automaticky potlačí všechna varování

## Poznámky

- Pro plné využití funkcí aplikace je potřeba zadat OpenAI API klíč
- Aplikace ukládá data do localStorage, takže zůstanou zachována i po obnovení stránky
- Aplikace je optimalizována pro desktop i mobilní zařízení
