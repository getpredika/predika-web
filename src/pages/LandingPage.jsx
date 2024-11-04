import { Button } from "@/components/ui/button";

function LandingPage() {
    return (
        <div>
            <header className="flex flex-col items-center justify-center h-screen bg-blue-50">
                <h1 className="text-4xl font-bold mb-4">Améliorez votre écriture en créole haïtien</h1>
                <p className="text-lg mb-6">Une application de correction orthographique et grammaticale en créole haïtien.</p>
                <Button as="a" href="/signup" variant="primary">Commencer gratuitement</Button>
            </header>
        </div>
    );
}

export default LandingPage;
