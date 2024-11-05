import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <header className="flex flex-col items-center justify-center h-screen bg-blue-50">
        <h1 className="text-4xl font-bold mb-4">
          Améliorez votre écriture en créole haïtien
        </h1>
        <p className="text-lg mb-6">
          Une application de correction orthographique et grammaticale en créole
          haïtien.
        </p>
        <Link to="/auth">
          <Button variant="primary">Commencer gratuitement</Button>
        </Link>{" "}
      </header>
    </div>
  );
}

export default LandingPage;
