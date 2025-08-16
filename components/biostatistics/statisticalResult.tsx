/* eslint-disable react/no-unescaped-entities */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Terminal } from "lucide-react";

interface StatisticalResultProps {
  result: {
    method: string;
    alpha: number;
    rejected: boolean;
    pValue?: number;
    statistic?: number;
    degreesOfFreedom?: number;
  };
  variableName: string;
  mainName: string;
}

export function StatisticalResult({
  result,
  variableName,
  mainName,
}: StatisticalResultProps) {
  return (
    <div className="space-y-4 mt-6">
      <Alert className="bg-background">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Résultats du test statistique</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Test utilisé :</span>
            <Badge variant="outline">{result.method}</Badge>
          </div>

          {result.pValue !== undefined && (
            <div className="grid grid-cols-2 max-w-md gap-2">
              <span className="text-muted-foreground">p-value :</span>
              <span className="font-mono font-semibold">
                {result.pValue < 0.001 ? "< 0.001" : result.pValue.toFixed(3)}
              </span>

              <span className="text-muted-foreground">Statistique :</span>
              <span className="font-mono">{result.statistic?.toFixed(3)}</span>

              {result.degreesOfFreedom !== undefined && (
                <>
                  <span className="text-muted-foreground">
                    Degrés de liberté :
                  </span>
                  <span className="font-mono">{result.degreesOfFreedom}</span>
                </>
              )}
            </div>
          )}
        </AlertDescription>
      </Alert>

      <InterpretationResult
        rejected={result.rejected}
        alpha={result.alpha}
        variableName={variableName}
        mainName={mainName}
      />
    </div>
  );
}

function InterpretationResult({
  rejected,
  alpha,
  variableName,
  mainName,
}: {
  rejected: boolean;
  alpha: number;
  variableName: string;
  mainName?: string;
}) {
  const significanceLevel = alpha * 100;

  return (
    <div className="px-2 flex items-center gap-3">
      <div className="mt-0.5">
        <ResultIcon rejected={rejected} />
      </div>
      <div className="flex-1">
        <div className="rounded-lg border p-4 bg-muted/20">
          <h4 className="font-medium mb-2">Interprétation</h4>

          {rejected ? (
            <div className="space-y-2">
              <p>
                <Badge variant="destructive" className="mr-2">
                  Rejet de H₀
                </Badge>
                Au seuil de {significanceLevel}%, nous rejetons l'hypothèse
                nulle d'indépendance.
              </p>
              <p className="text-sm text-muted-foreground">
                Cela suggère une association statistiquement significative entre{" "}
                {mainName ? <strong>{mainName}</strong> : "les feuilles Excel"}{" "}
                et la variable <strong>{variableName}</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p>
                <Badge variant="secondary" className="mr-2">
                  Non-rejet de H₀
                </Badge>
                Au seuil de {significanceLevel}%, nous ne rejetons pas
                l'hypothèse nulle.
              </p>
              <p className="text-sm text-muted-foreground">
                Nous n'avons pas détecté de différence significative dans la
                distribution de
                <strong> {variableName}</strong> selon{" "}
                {mainName ? <strong>{mainName}</strong> : "les feuilles Excel"}.
              </p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            <p>
              <strong>H₀ (Hypothèse nulle)</strong> : Les distributions sont
              identiques.
              <br />
              <strong>H₁ (Hypothèse alternative)</strong> : Les distributions
              diffèrent significativement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultIcon({ rejected }: { rejected: boolean }) {
  return rejected ? (
    <AlertCircle className="h-5 w-5 text-destructive" />
  ) : (
    <CheckCircle2 className="h-5 w-5 text-green-500" />
  );
}
