import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Tèm ak Kondisyon Sevi</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-sm mb-8">Dènye mizajou: 20 Desanm 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Akseptasyon Tèm yo</h2>
            <p className="text-muted-foreground">
              Lè w aksede epi itilize Predika, ou aksepte epi dakò pou respekte Tèm ak Kondisyon Sevi sa yo.
              Si w pa dakò ak tèm sa yo, tanpri pa itilize sèvis nou an.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Deskripsyon Sèvis la</h2>
            <p className="text-muted-foreground">
              Predika se yon platfòm aprantisaj vokabilè ki bay definisyon diksyonè,
              pwononsyasyon, fraz egzanp, quiz, ak lòt fonksyon edikasyonèl pou ede
              itilizatè yo elaji vokabilè yo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Kont Itilizatè</h2>
            <p className="text-muted-foreground mb-4">
              Pou aksede sèten fonksyon, ou dwe kreye yon kont. Ou dakò pou:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Bay enfòmasyon egzak ak konplè</li>
              <li>Kenbe idantifyan kont ou an sekirite</li>
              <li>Avize nou si gen aks san otorizasyon</li>
              <li>Responsab pou tout aktivite anba kont ou</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Itilizasyon Akseptab</h2>
            <p className="text-muted-foreground mb-4">
              Ou dakò pou w pa:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Itilize sèvis la pou okenn rezon ilegal</li>
              <li>Eseye jwenn aks san otorizasyon nan sistèm nou yo</li>
              <li>Enterfere oswa deranje sèvis la</li>
              <li>Pataje kont ou ak lòt moun</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Pwopriyete Entèlektyèl</h2>
            <p className="text-muted-foreground">
              Tout kontni, fonksyon, ak fonksyonalite Predika se pou nou yo ye epi yo pwoteje
              pa lwa entènasyonal sou dwa dotè, mak komèsyal, ak lòt lwa sou pwopriyete entèlektyèl.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Limitasyon Responsabilite</h2>
            <p className="text-muted-foreground">
              Predika bay "jan li ye a" san okenn garanti. Nou p ap responsab
              pou okenn domaj endirekt, ensidantèl, espesyal, oswa ki gen konsékans ki soti nan
              itilizasyon sèvis la.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Chanjman nan Tèm yo</h2>
            <p className="text-muted-foreground">
              Nou rezve dwa pou modifye tèm sa yo nenpot lè. Nou pral avize itilizatè yo sou
              chanjman enpitan pa imel oswa nan sèvis la.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Kontak</h2>
            <p className="text-muted-foreground">
              Pou kesyon sou Tèm sa yo, tanpri vizite{" "}
              <Link href="/contact" className="text-primary hover:underline">
                paj kontak nou an
              </Link>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
