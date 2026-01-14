import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Politik sou Vi Prive</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-sm mb-8">Dènye mizajou: 20 Desanm 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Enfòmasyon Nou Kolekte</h2>
            <p className="text-muted-foreground mb-4">
              Lè w itilize Predika, nou kolekte enfòmasyon pou bay epi amelyore sèvis nou yo:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Enfòmasyon kont (non, imel) lè w enskri</li>
              <li>Pwogresyon aprantisaj ak rezilta quiz ou yo</li>
              <li>Mo w chèche ak sove</li>
              <li>Done itilizasyon pou amelyore fonksyon nou yo</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Kòman Nou Itilize Enfòmasyon W</h2>
            <p className="text-muted-foreground mb-4">
              Nou itilize enfòmasyon w pou:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Bay eksperyans aprantisaj vokabilè pèsonalize</li>
              <li>Swiv pwogresyon ak reyisit ou</li>
              <li>Amelyore diksyonè ak fonksyon pwononsyasyon nou an</li>
              <li>Voye mizajou enpòtan sou sèvis nou an</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Sekirite Done</h2>
            <p className="text-muted-foreground">
              Nou mete an plas mezi sekirite selon estanda endistri a pou pwoteje enfòmasyon pèsonèl ou.
              Done w kripte nan transpò ak nan depo. Nou revize pratik sekirite nou yo regilyèman
              pou asire enfòmasyon w rete an sekirite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Dwa W yo</h2>
            <p className="text-muted-foreground mb-4">
              Ou gen dwa pou:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Aksede done pèsonèl ou</li>
              <li>Mande koreksyon done ki pa egzak</li>
              <li>Mande pou efase kont ou</li>
              <li>Ekspòte done aprantisaj ou</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Kontakte Nou</h2>
            <p className="text-muted-foreground">
              Si w gen kesyon sou Politik sou Vi Prive sa a, tanpri kontakte nou nan{" "}
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
