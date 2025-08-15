/* eslint-disable @typescript-eslint/no-explicit-any */
// components/biostatistics/subanalyseCard.tsx
import { v4 as uuidv4 } from "uuid";
import Plot from "react-plotly.js";
import { AnalysisSubType, AnalysisType } from "@/types/analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, TableIcon, Code, TrendingUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const labelText = (label: string, mainCaracteristicName: string) => {
  return typeof label === "string"
    ? label
    : `${label} (${mainCaracteristicName})`;
};

function Qualitative({
  caracteristicName,
  mainCaracteristicName,
  contingencyTable,
  result,
  labels,
}: {
  caracteristicName: string;
  mainCaracteristicName: string;
  contingencyTable: number[][];
  result: any;
  labels: AnalysisSubType["labels"];
}) {
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const data: {
    x: string[];
    y: number[];
    type: "bar";
    name: string;
    text: string[];
    marker: { color: string };
  }[] = [];

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  contingencyTable.forEach((row, index) => {
    const d = {
      x: labels?.x ?? [],
      y: row,
      text: row.map((value) => value.toString()),
      type: "bar" as const,
      name: labelText(labels?.y[index] ?? "", mainCaracteristicName),
      marker: { color: colors[index % colors.length] },
    };
    data.push(d);
  });

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {caracteristicName}
            </CardTitle>
            <CardDescription>
              Analyse qualitative par rapport à {mainCaracteristicName}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Qualitatif
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="chart" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Graphique
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              Tableau
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <Plot
                data={data}
                layout={{
                  title: {
                    text: `Distribution de ${caracteristicName} par ${mainCaracteristicName}`,
                    font: { size: 16 }
                  },
                  // xaxis: { title: caracteristicName },
                  // yaxis: { title: 'Fréquence' },
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  font: { family: 'Inter, system-ui, sans-serif' },
                  margin: { l: 50, r: 50, t: 60, b: 50 },
                }}
                style={{ width: '100%', height: '500px' }}
                config={{ 
                  responsive: true,
                  displayModeBar: true,
                  modeBarButtonsToRemove: ['pan2d', 'lasso2d']
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">
                      {mainCaracteristicName} / {caracteristicName}
                    </TableHead>
                    {labels?.x.map((label) => (
                      <TableHead key={uuidv4()} className="text-center font-semibold">
                        {labelText(label, caracteristicName)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contingencyTable.map((row, rowIndex) => (
                    <TableRow key={uuidv4()} className="hover:bg-muted/30">
                      <TableCell className="font-medium bg-muted/20">
                        {labelText(labels?.y[rowIndex] ?? "", mainCaracteristicName)}
                      </TableCell>
                      {row.map((cell) => (
                        <TableCell key={uuidv4()} className="text-center">
                          <Badge variant="secondary">{cell}</Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Collapsible open={isResultsOpen} onOpenChange={setIsResultsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                  {isResultsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <Code className="h-4 w-4" />
                  Résultats statistiques détaillés
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3">
                <div className="rounded-lg border bg-muted/20 p-4">
                  <pre className="text-sm overflow-auto max-h-96 font-mono">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Quantitative({
  caracteristicName,
  mainCaracteristicName,
  result,
  data,
  labels,
  IQR,
}: {
  caracteristicName: string;
  mainCaracteristicName: string;
  result: any;
  data: any[];
  labels: AnalysisSubType["labels"];
  IQR: AnalysisSubType["IQR"];
}) {
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const plotData = data.map((d, i) => ({
    y: d,
    type: "box" as const,
    name: labelText(labels?.y[i] ?? "", mainCaracteristicName),
    marker: { color: colors[i % colors.length] },
    // boxpoints: 'outliers',
    jitter: 0.3,
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {caracteristicName}
            </CardTitle>
            <CardDescription>
              Analyse quantitative par rapport à {mainCaracteristicName}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Quantitatif
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="chart" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Box Plot
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <Plot
                data={plotData}
                layout={{
                  title: {
                    text: `Distribution de ${caracteristicName} par ${mainCaracteristicName}`,
                    font: { size: 16 }
                  },
                  // xaxis: { title: mainCaracteristicName },
                  // yaxis: { title: caracteristicName },
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  font: { family: 'Inter, system-ui, sans-serif' },
                  margin: { l: 50, r: 50, t: 60, b: 50 },
                }}
                style={{ width: '100%', height: '500px' }}
                config={{ 
                  responsive: true,
                  displayModeBar: true,
                  modeBarButtonsToRemove: ['pan2d', 'lasso2d']
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Statistique</TableHead>
                    {labels?.y.map((label) => (
                      <TableHead key={uuidv4()} className="text-center font-semibold">
                        {labelText(label, mainCaracteristicName)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-muted/30">
                    <TableCell className="font-medium bg-muted/20">
                      Moyenne (Écart-type)
                    </TableCell>
                    {IQR?.map((stats, index) => (
                      <TableCell key={index} className="text-center">
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {stats.mean.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            (±{stats.std.toFixed(2)})
                          </div>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="hover:bg-muted/30">
                    <TableCell className="font-medium bg-muted/20">
                      Médiane [Q1 ; Q3]
                    </TableCell>
                    {IQR?.map((stats, index) => (
                      <TableCell key={index} className="text-center">
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {stats.median}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            [{stats.q1} ; {stats.q3}]
                          </div>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Collapsible open={isResultsOpen} onOpenChange={setIsResultsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                  {isResultsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <Code className="h-4 w-4" />
                  Résultats des tests statistiques
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3">
                <div className="rounded-lg border bg-muted/20 p-4">
                  <pre className="text-sm overflow-auto max-h-96 font-mono">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function SubCard({
  analysisResults,
}: {
  analysisResults: AnalysisType;
}) {
  const subanalyses = analysisResults.subanalyses;

  console.log("analysisResults : ", analysisResults);
  console.log("subanalyses : ", subanalyses);

  return (
    <div className="space-y-8">
      {/* En-tête de l'analyse */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Analyse de : {analysisResults.main}
        </h2>
        <p className="text-muted-foreground">
          {subanalyses.length} analyse(s) effectuée(s)
        </p>
      </div>

      {/* Résultats des sous-analyses */}
      <div className="space-y-6">
        {subanalyses.map((sub: AnalysisSubType) => {
          if (sub.caracteristic.type === "qualitative") {
            if (sub.caracteristic.options && sub.contingencyTable) {
              return (
                <Qualitative
                  key={uuidv4()}
                  mainCaracteristicName={analysisResults.main}
                  caracteristicName={sub.caracteristic.name}
                  result={sub.result}
                  contingencyTable={sub.contingencyTable}
                  labels={sub.labels}
                />
              );
            }
          }

          if (sub.caracteristic.type === "quantitative") {
            return (
              <Quantitative
                key={uuidv4()}
                caracteristicName={sub.caracteristic.name}
                mainCaracteristicName={analysisResults.main}
                result={sub.result}
                data={sub.data}
                IQR={sub.IQR}
                labels={sub.labels}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}