/* eslint-disable @typescript-eslint/no-explicit-any */
// components/biostatistics/subanalyseCard.tsx
import { v4 as uuidv4 } from "uuid";
import Plot from "react-plotly.js";

import { CaracteristicType } from "@/types/analysis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, TableIcon, Database } from "lucide-react";

import { useEffect, useState } from "react";
import {
  baseCaracteristics,
  calculateNumericStats,
  createGlobalContingencyTable,
} from "@/lib/biostatistics";

const labelText = (label: string, mainCaracteristicName: string) => {
  return typeof label === "string"
    ? label
    : `${label} (${mainCaracteristicName})`;
};

function Qualitative({
  caracteristic,
  results,
  sheetsNames,
}: {
  caracteristic: CaracteristicType;
  results: any;
  sheetsNames: string[];
}) {
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const result : any[] = [];
  for (const sheetName of sheetsNames) {
    result.push(results[sheetName]);
  }
  result.push(result.flat());

  const matrix = createGlobalContingencyTable(
    result,
    [...sheetsNames, "Total"],
    caracteristic.name
  );
  const labels = {
    x: matrix.colLabels,
    y: matrix.rowLabels,
  };
  const contingencyTable = matrix.matrix;

  const data: {
    x: string[];
    y: number[];
    type: "bar";
    name: string;
    text: string[];
    marker: { color: string };
  }[] = [];

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];

  contingencyTable.forEach((row, index) => {
    const x =
      labels?.x.map((label) => labelText(label, caracteristic.name)) ?? [];
    const d = {
      x,
      y: row,
      text: row.map((value) => value.toString()),
      type: "bar" as const,
      name: labelText(labels?.y[index] ?? "", caracteristic.name),
      marker: { color: colors[index % colors.length] },
    };
    data.push(d);
  });

  const Charts = () => {
    return (
      <div className="rounded-lg border bg-card p-4">
        <Plot
          data={data}
          layout={{
            title: {
              text: `Distribution de ${caracteristic.name} en fonction ${sheetsNames}`,
              font: { size: 16 },
            },
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: "rgba(0,0,0,0)",
            font: { family: "Inter, system-ui, sans-serif" },
            margin: { l: 50, r: 50, t: 60, b: 50 },
          }}
          style={{ width: "100%", height: "500px" }}
          config={{
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ["pan2d", "lasso2d"],
          }}
        />
      </div>
    );
  };

  const TableData = () => {
    return (
      <div className="rounded-lg border p-2 flex flex-col gap-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">
                | {caracteristic.name}
              </TableHead>
              {labels?.x.map((label) => (
                <TableHead key={uuidv4()} className="text-center font-semibold">
                  {labelText(label, caracteristic.name)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contingencyTable.map((row, rowIndex) => (
              <TableRow key={uuidv4()} className="hover:bg-muted/30">
                <TableCell className="font-medium bg-muted/20">
                  {labelText(labels?.y[rowIndex] ?? "", caracteristic.name)}
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
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 cursor-pointer">
              <BarChart3 className="h-5 w-5 text-primary" />
              {caracteristic.name}
            </CardTitle>
            <CardDescription>
              Analyse qualitative par rapport à {sheetsNames?.join(", ")}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Qualitatif
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue={screenSize > 1024 ? "data" : "chart"}
          className="space-y-6"
        >
          {screenSize > 1024 ? (
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger
                value="data"
                className="flex items-center gap-2 cursor-pointer "
              >
                <Database className="h-4 w-4" />
                Données
              </TabsTrigger>
            </TabsList>
          ) : (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="chart"
                className="flex items-center gap-2 cursor-pointer"
              >
                <BarChart3 className="h-4 w-4" />
                Graphique
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="flex items-center gap-2 cursor-pointer"
              >
                <TableIcon className="h-4 w-4" />
                Tableau
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent
            value="data"
            className="w-full overflow-x-auto flex gap-4 space-y-4"
          >
            <Charts />
            <TableData />
          </TabsContent>

          <TabsContent value="chart" className="space-y-4">
            <Charts />
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <TableData />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Quantitative({
  caracteristic,
  results,
  sheetsNames,
}: {
  caracteristic: CaracteristicType;
  results: any;
  sheetsNames: string[];
}) {
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const data: number[][] = [];

  for (const sheetName of sheetsNames) {
    const sheetResults = results[sheetName];
    const filteredResults = sheetResults.map((r: any) =>
      Number(r[caracteristic.name])
    );
    data.push(filteredResults);
  }
  const totalData = data.flat();
  data.push(totalData);

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];

  const plotData = data.map((d, i) => ({
    y: d,
    type: "box" as const,
    name: sheetsNames[i] ? `Année ${sheetsNames[i]}` : "Total",
    marker: { color: colors[i % colors.length] },
    jitter: 0.3,
  }));

  const Charts = () => {
    return (
      <div className="rounded-lg border bg-card p-4">
        <Plot
          data={plotData}
          layout={{
            title: {
              text: `Distribution de ${caracteristic.name} en fonction ${sheetsNames}`,
              font: { size: 16 },
            },
            // xaxis: { title: mainCaracteristicName },
            // yaxis: { title: caracteristicName },
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: "rgba(0,0,0,0)",
            font: { family: "Inter, system-ui, sans-serif" },
            margin: { l: 50, r: 50, t: 60, b: 50 },
          }}
          style={{ width: "100%", height: "500px" }}
          config={{
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ["pan2d", "lasso2d"],
          }}
        />
      </div>
    );
  };

  const IQRs: {
    median: number;
    q1: number;
    q3: number;
    mean: number;
    std: number;
  }[] = [];
  data.forEach((d) => IQRs.push(calculateNumericStats(d)));
  //  IQRs.push(calculateNumericStats(data.flat()));

  const TableData = () => {
    return (
      <div className="rounded-lg border p-2 flex flex-col gap-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Statistique</TableHead>
              {sheetsNames.map((label) => (
                <TableHead key={uuidv4()} className="text-center font-semibold">
                  {label}
                </TableHead>
              ))}
              <TableHead className="text-center font-semibold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-muted/30">
              <TableCell className="font-medium bg-muted/20">
                Moyenne (Écart-type)
              </TableCell>
              {IQRs?.map((stats) => (
                <TableCell key={uuidv4()} className="text-center">
                  <div className="space-y-1">
                    <div className="font-semibold">{stats.mean.toFixed(2)}</div>
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
              {IQRs?.map((stats) => (
                <TableCell key={uuidv4()} className="text-center">
                  <div className="space-y-1">
                    <div className="font-semibold">{stats.median}</div>
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
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 cursor-pointer">
              <BarChart3 className="h-5 w-5 text-primary" />
              {caracteristic.name}
            </CardTitle>
            <CardDescription>
              Analyse quantitative par rapport à {sheetsNames?.join(", ")}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Quantitatif
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue={screenSize > 1024 ? "data" : "chart"}
          className="space-y-6"
        >
          {screenSize > 1024 ? (
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger
                value="data"
                className="flex items-center gap-2 cursor-pointer"
              >
                <BarChart3 className="h-4 w-4" />
                Données
              </TabsTrigger>
            </TabsList>
          ) : (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="chart"
                className="flex items-center gap-2 cursor-pointer"
              >
                <BarChart3 className="h-4 w-4" />
                Box Plot
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="flex items-center gap-2 cursor-pointer"
              >
                <TableIcon className="h-4 w-4" />
                Statistiques
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent
            value="data"
            className="w-full overflow-x-auto flex gap-4 space-y-4"
          >
            <Charts />
            <TableData />
          </TabsContent>

          <TabsContent value="chart" className="space-y-4">
            <Charts />
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <TableData />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function BrutCard({
  brutResults,
  sheetsNames,
}: {
  brutResults: any;
  sheetsNames: string[];
}) {
  return (
    <div className="space-y-8">
      {/* Résultats des sous-analyses */}
      <div className="space-y-6">
        {baseCaracteristics.map((caracteristic: CaracteristicType) => {
          if (caracteristic.type === "qualitative") {
            return (
              <Qualitative
                key={uuidv4()}
                caracteristic={caracteristic}
                results={brutResults}
                sheetsNames={sheetsNames}
              />
            );
          }
          if (caracteristic.type === "quantitative") {
            return (
              <Quantitative
                key={uuidv4()}
                caracteristic={caracteristic}
                results={brutResults}
                sheetsNames={sheetsNames}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
