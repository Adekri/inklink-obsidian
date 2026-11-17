# InkLink for Obsidian – read-later queue for Supernote

*Česká verze je [níže](#česky).*

The reading-queue feature keeps its Czech name “Ke čtení” (“to read”) in folder and note names; you can rename them in the settings.

An Obsidian plugin that turns a shared article link into two things: a Markdown note with the article text, and an EPUB in a vault folder that syncs to your Supernote e-ink tablet.

It is one half of a workflow:

> **Phone → Obsidian → Supernote → Obsidian.** You share an article from your phone's browser to Obsidian. This plugin downloads it and creates a note and an EPUB. The EPUB syncs to the Supernote, where you read it. With the companion plugin **InkLink for Supernote**, text you select while reading is appended as a quote to the article's note, and finished articles are marked as read. Each half also works on its own: this plugin is a plain “save article as note + EPUB” tool, and InkLink for Supernote works without it.

The interface is in English and Czech and follows the language set in Obsidian.

## What it does

- **Collects links** from three places:
  - on Android, the item **InkLink – send to Supernote** in the menu Obsidian shows after *Share → Obsidian*,
  - lines containing a URL in a source note (default `Ke čtení.md`),
  - a newly created note that contains nothing but a URL (optionally a title and a URL).
- **Downloads the article**, extracts the main text with [Readability](https://github.com/mozilla/readability) and saves:
  - a note in `Clippings/` with frontmatter (`title`, `source`, `author`, `published`, `created`, `description`, `tags`, `stav`, `supernote`, `ke-cteni-id`),
  - an EPUB in `Ke čtení/`, named `<title> – <id>.epub`, with a title page and images resized to at most 1404 px wide.
- **Rewrites the processed line** in the source note to `- [Title](link) → [[Clippings/Title]]`. It is a plain list item, not a checkbox, so task plugins ignore it.
- **Skips duplicates**: the same URL (ignoring `utm_*` and similar tracking parameters) is not downloaded twice.
- **Never fails silently**: a paywalled or text-less page produces a note with `stav: nepodařilo-se` and a message explaining why. Without an internet connection the link waits in the source note.

Commands: **Process all links** (also the book icon in the ribbon) and **Retry failed articles**.

The frontmatter values of `stav` are Czech because they are shared with the Supernote plugin: `na-supernote` (queued), `přečteno` (read), `nepodařilo-se` (failed).

## Installation

### From Obsidian
*Settings → Community plugins → Browse*, search for “InkLink”, install and enable. (Available once the plugin is accepted into the community directory.)

### Manually
1. Download `main.js`, `manifest.json` and `styles.css` from the latest release.
2. Put them in `<your vault>/.obsidian/plugins/inklink/`.
3. In *Settings → Community plugins*, turn off Restricted mode if needed and enable **InkLink**.

Do the same on your phone, or let your sync service carry the plugin over (with Obsidian Sync: enable syncing of installed community plugins).

## Setting up the Supernote side

1. **The EPUB must reach the tablet.** The folder `Ke čtení` lives in your vault, so whatever syncs the vault to the Supernote must also sync `.epub` files. With Obsidian Sync, turn on *Settings → Sync → Sync all other types* on every device. The Standard plan does not transfer files over 5 MB, which is why the default EPUB size limit is 4.5 MB.
2. **In InkLink for Supernote, turn on “Reading queue (“Ke čtení”)”.** It is off by default.
3. **Folder names must match.** If you change the *Supernote folder* or *Article notes folder* here, change them in the settings of InkLink for Supernote too.

Obsidian's file explorer does not list `.epub` files, so the `Ke čtení` folder looks empty in Obsidian even when the files are there. To see them, enable *Settings → Files and links → Detect all file extensions*.

## Settings

| Setting | Default | Notes |
|---|---|---|
| Source note | `Ke čtení.md` | Where links are collected. |
| Article notes folder | `Clippings` | Where article notes go. |
| Supernote folder | `Ke čtení` | Where EPUB files go. |
| Process automatically on this device | on | Per device. Phones process after 3 s, computers after 45 s, so the device you shared from usually gets there first. |
| Detect a new note containing only a link | on | See the warning below. |
| Images in EPUB | on | Notes only ever link to images on the web. |
| Maximum EPUB size (MB) | 4.5 | Images that do not fit are left out. |
| Format of a processed line | plain list item | Optionally a `- [x]` checkbox. |

## Limitations

- **Paywalls and logins.** The plugin sees what an anonymous visitor sees. Paywall detection is a heuristic (very little text, or the page declaring itself non-free); a site that serves a long teaser without saying so will be saved as if it were the full article.
- **JavaScript-rendered pages.** Pages that build their content in the browser yield no text.
- **Sharing menu is Android-only.** Obsidian only lets plugins add an item to its share menu on Android, through an event that is not part of the documented API and could change. On other platforms, paste the link into the source note.
- **No PDF output**, EPUB only.
- An article already saved in the notes folder by other means (same `source` URL) is treated as a duplicate and gets no EPUB.

## Network use and privacy

The plugin makes network requests only to:

- the URL you share or paste, to download the article,
- the image URLs found in that article, to embed them in the EPUB (unless images are turned off).

It sends nothing else anywhere: no telemetry, no accounts, no third-party services. The sites you fetch from see an ordinary request from your device, as if you had opened the page.

## Risks – please read

- The plugin **creates and overwrites files** in your vault: notes in the article notes folder, EPUB files in the Supernote folder, and lines in the source note.
- With *Detect a new note containing only a link* turned on, a **newly created note that contains only a URL is moved to the trash** after its link is taken over. This also happens if you create such a note by hand. Notes that existed before are never touched. Turn the setting off if you keep notes like that.
- It downloads content from arbitrary websites you point it at.
- The software is provided **without any warranty** (see the licence). **Back up your vault** before you start using it.

## Development

```
npm install
npm test          # unit tests (vitest)
npm run typecheck
npm run build     # bundles to build/main.js
```

`src/core/` holds the logic that does not depend on Obsidian (URLs, queue, file names, frontmatter, Readability, XHTML, EPUB) and is covered by tests in `tests/`. `src/main.ts`, `src/images.ts` and `src/settings.ts` connect it to Obsidian.

## Licence

[MIT](LICENSE) © Adekri

---

# Česky

*Funkce se dál jmenuje „Ke čtení“ – tak se jmenuje složka s EPUB i zdrojová poznámka.*

**InkLink pro Obsidian** je doplněk, který ze sdíleného odkazu na článek udělá dvě věci: poznámku s textem článku a EPUB ve složce vaultu, která se synchronizuje na e-ink tablet Supernote.

Je to polovina většího celku:

> **Mobil → Obsidian → Supernote → Obsidian.** Článek sdílíš z prohlížeče v mobilu do Obsidianu. Tento doplněk ho stáhne a vytvoří poznámku a EPUB. EPUB se synchronizuje na Supernote, kde si ho přečteš. S pluginem **InkLink pro Supernote** se text, který při čtení označíš, připíše jako citace do poznámky článku, a dočtené články se označí jako přečtené. Každá část funguje i samostatně: tento doplněk jako obyčejné „ulož článek jako poznámku a EPUB“, InkLink pro Supernote i bez něj.

Rozhraní je česky a anglicky a řídí se jazykem nastaveným v Obsidianu.

## Co dělá

- **Sbírá odkazy** ze tří míst:
  - na Androidu položka **InkLink – poslat na Supernote** v nabídce, kterou Obsidian ukáže po *Sdílet → Obsidian*,
  - řádky s adresou ve zdrojové poznámce (výchozí `Ke čtení.md`),
  - nově vytvořená poznámka, která obsahuje jen adresu (případně název a adresu).
- **Stáhne článek**, hlavní text vytáhne pomocí [Readability](https://github.com/mozilla/readability) a uloží:
  - poznámku do `Clippings/` s frontmatterem (`title`, `source`, `author`, `published`, `created`, `description`, `tags`, `stav`, `supernote`, `ke-cteni-id`),
  - EPUB do `Ke čtení/` s názvem `<název> – <id>.epub`, s titulní stránkou a obrázky zmenšenými nejvýš na 1404 px na šířku.
- **Přepíše zpracovaný řádek** ve zdrojové poznámce na `- [Název](odkaz) → [[Clippings/Název]]`. Je to obyčejná odrážka, ne zaškrtávací políčko, takže ji pluginy na úkoly ignorují.
- **Nestahuje duplicity**: stejná adresa (bez `utm_*` a podobných sledovacích parametrů) se podruhé nestahuje.
- **Neselhává potichu**: stránka za paywallem nebo bez textu skončí poznámkou se `stav: nepodařilo-se` a hláškou s důvodem. Bez připojení k internetu odkaz počká ve zdrojové poznámce.

Příkazy: **Zpracovat vše** (také ikona knihy v postranní liště) a **Zkusit znovu nepodařené**.

Hodnoty položky `stav`: `na-supernote` (ve frontě), `přečteno`, `nepodařilo-se`.

## Instalace

### Z Obsidianu
*Nastavení → Komunitní pluginy → Procházet*, vyhledej „InkLink“, nainstaluj a zapni. (Až bude doplněk přijat do katalogu komunitních pluginů.)

### Ručně
1. Stáhni `main.js`, `manifest.json` a `styles.css` z posledního vydání.
2. Vlož je do `<tvůj vault>/.obsidian/plugins/inklink/`.
3. V *Nastavení → Komunitní pluginy* případně vypni omezený režim a zapni **InkLink**.

Totéž udělej na mobilu, nebo nech doplněk přenést synchronizací (u Obsidian Sync zapni synchronizaci nainstalovaných komunitních pluginů).

## Nastavení na straně Supernote

1. **EPUB se musí dostat na tablet.** Složka `Ke čtení` leží ve vaultu, takže to, co synchronizuje vault na Supernote, musí přenášet i soubory `.epub`. U Obsidian Sync zapni na všech zařízeních *Nastavení → Sync → Synchronizovat všechny ostatní typy*. Základní tarif nepřenese soubor nad 5 MB, proto je výchozí limit velikosti EPUB 4,5 MB.
2. **V pluginu InkLink pro Supernote zapni „Fronta „Ke čtení““.** U nové instalace je vypnutá.
3. **Názvy složek se musí shodovat.** Když tady změníš *Složku pro Supernote* nebo *Složku s poznámkami článků*, změň je i v nastavení InkLinku pro Supernote.

Obsidian soubory `.epub` ve svém seznamu souborů neukazuje, takže složka `Ke čtení` v něm vypadá prázdná, i když v ní soubory jsou. Chceš-li je vidět, zapni *Nastavení → Soubory a odkazy → Detekovat všechny přípony souborů*.

## Volby

| Volba | Výchozí | Poznámka |
|---|---|---|
| Zdrojová poznámka | `Ke čtení.md` | Kam se sbírají odkazy. |
| Složka s poznámkami článků | `Clippings` | Kam se ukládají poznámky. |
| Složka pro Supernote | `Ke čtení` | Kam se ukládají EPUB. |
| Automatické zpracování na tomto zařízení | zapnuto | Pro každé zařízení zvlášť. Mobil zpracuje odkaz za 3 s, počítač za 45 s, takže ho obvykle stihne zařízení, ze kterého sdílíš. |
| Rozpoznat novou poznámku jen s odkazem | zapnuto | Viz upozornění níže. |
| Obrázky v EPUB | zapnuto | V poznámce jsou vždy jen odkazy na obrázky na webu. |
| Největší velikost EPUB (MB) | 4,5 | Obrázky nad limit se vynechají. |
| Formát zpracovaného řádku | obyčejná odrážka | Volitelně zaškrtávací políčko `- [x]`. |

## Omezení

- **Paywally a přihlášení.** Doplněk vidí to, co nepřihlášený návštěvník. Paywall se pozná jen odhadem (velmi málo textu, nebo stránka sama uvádí placený obsah); web, který pošle dlouhou ukázku bez označení, se uloží jako celý článek.
- **Stránky postavené na JavaScriptu.** Když se obsah skládá až v prohlížeči, text se nezíská.
- **Nabídka sdílení jen na Androidu.** Obsidian dovoluje doplňkům přidat položku do nabídky sdílení jen na Androidu, a to přes událost, která není v dokumentovaném API a může se změnit. Jinde vlož odkaz do zdrojové poznámky.
- **Žádné PDF**, jen EPUB.
- Článek, který už ve složce s poznámkami je odjinud (stejná adresa v `source`), se bere jako duplicita a EPUB k němu nevznikne.

## Síť a soukromí

Doplněk se připojuje jen:

- na adresu, kterou sdílíš nebo vložíš, aby stáhl článek,
- na adresy obrázků z toho článku, aby je vložil do EPUB (pokud obrázky nevypneš).

Nic jiného nikam neposílá: žádná telemetrie, žádné účty, žádné služby třetích stran. Web, ze kterého stahuješ, vidí běžný požadavek z tvého zařízení, jako bys stránku otevřela v prohlížeči.

## Rizika – čti prosím

- Doplněk **vytváří a přepisuje soubory** ve vaultu: poznámky ve složce s články, EPUB ve složce pro Supernote a řádky ve zdrojové poznámce.
- Se zapnutou volbou *Rozpoznat novou poznámku jen s odkazem* se **nově vytvořená poznámka obsahující jen adresu přesune do koše**, jakmile se z ní odkaz převezme. Stane se to i tehdy, když takovou poznámku vytvoříš ručně. Starších poznámek se doplněk nikdy nedotkne. Pokud si takové poznámky děláš, volbu vypni.
- Stahuje obsah z libovolných webů, na které ho pošleš.
- Software je poskytován **bez jakékoli záruky** (viz licence). Než ho začneš používat, **zálohuj si vault**.

## Licence

[MIT](LICENSE) © Adekri
