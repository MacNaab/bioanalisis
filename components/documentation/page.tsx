/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search,
  FileSpreadsheet, 
  BarChart3, 
  Settings,
  Download,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Code,
  Database,
  PieChart,
  TrendingUp,
  Table,
  Eye,
  FileText,
  HelpCircle,
  Lightbulb,
  Target,
  Users,
  Clock,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Upload
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const quickStartSteps = [
    {
      icon: FileSpreadsheet,
      title: "Préparez vos données",
      description: "Organisez votre fichier Excel avec des en-têtes clairs",
      details: "Assurez-vous que votre fichier Excel contient des colonnes bien définies avec des noms explicites."
    },
    {
      icon: Upload,
      title: "Importez votre fichier",
      description: "Glissez-déposez votre fichier Excel (.xlsx, .xls, .csv)",
      details: "La plateforme accepte les fichiers jusqu'à 50Mo et détecte automatiquement la structure."
    },
    {
      icon: Settings,
      title: "Configurez l'analyse",
      description: "Sélectionnez vos caractéristiques principales et secondaires",
      details: "Choisissez la variable principale à analyser et les variables explicatives."
    },
    {
      icon: Play,
      title: "Lancez l'analyse",
      description: "Obtenez vos résultats en quelques secondes",
      details: "L'analyse statistique se lance automatiquement et génère visualisations et rapports."
    }
  ];

  const analysisTypes = [
    {
      type: "Analyse qualitative",
      icon: PieChart,
      description: "Variables catégorielles et nominales",
      methods: ["Test du Chi-2", "Tableau de contingence", "Graphiques en barres"],
      useCases: ["Sexe, groupe sanguin", "Réponse oui/non", "Catégories diagnostiques"]
    },
    {
      type: "Analyse quantitative",
      icon: TrendingUp,
      description: "Variables numériques continues",
      methods: ["Statistiques descriptives", "Box plots", "Tests de normalité"],
      useCases: ["Âge, poids, taille", "Dosages biologiques", "Scores de qualité de vie"]
    }
  ];

  const features = [
    {
      category: "Import et gestion des données",
      items: [
        { name: "Formats supportés", value: "Excel (.xlsx, .xls), CSV" },
        { name: "Taille maximale", value: "50 Mo par fichier" },
        { name: "Détection automatique", value: "Structure et types de données" },
        { name: "Prévisualisation", value: "Aperçu avant analyse" }
      ]
    },
    {
      category: "Analyses statistiques",
      items: [
        { name: "Tests qualitatifs", value: "Chi-2, Fisher exact" },
        { name: "Tests quantitatifs", value: "t-test, ANOVA, Mann-Whitney" },
        { name: "Statistiques descriptives", value: "Moyennes, médianes, quartiles" },
        { name: "Visualisations", value: "Box plots, histogrammes, barres" }
      ]
    },
    {
      category: "Export et rapports",
      items: [
        { name: "Format PDF", value: "Rapport complet formaté" },
        { name: "Export Excel", value: "Tableaux de résultats" },
        { name: "Graphiques HD", value: "Images haute définition" },
        { name: "Données brutes", value: "Résultats statistiques détaillés" }
      ]
    }
  ];

  const troubleshooting = [
    {
      problem: "Mon fichier ne s'importe pas",
      solutions: [
        "Vérifiez que le format est supporté (.xlsx, .xls, .csv)",
        "Assurez-vous que la taille est inférieure à 50Mo",
        "Contrôlez que le fichier n'est pas corrompu",
        "Essayez de l'ouvrir dans Excel avant l'import"
      ]
    },
    {
      problem: "Les analyses ne se lancent pas",
      solutions: [
        "Sélectionnez au moins une caractéristique principale",
        "Choisissez au moins une caractéristique secondaire",
        "Vérifiez que vos données contiennent des valeurs",
        "Assurez-vous que les colonnes ont des en-têtes"
      ]
    },
    {
      problem: "Les résultats semblent incorrects",
      solutions: [
        "Vérifiez la cohérence de vos données source",
        "Contrôlez les types de variables (qualitative/quantitative)",
        "Assurez-vous de l'absence de valeurs manquantes critiques",
        "Validez la pertinence des tests statistiques choisis"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Préparation des données",
      icon: Database,
      tips: [
        "Utilisez des en-têtes de colonnes explicites et uniques",
        "Évitez les espaces en début/fin de cellule",
        "Codez les variables qualitatives de manière cohérente",
        "Documentez les unités de mesure dans les en-têtes"
      ]
    },
    {
      title: "Configuration de l'analyse",
      icon: Settings,
      tips: [
        "Choisissez la variable principale en fonction de votre hypothèse",
        "Sélectionnez des variables secondaires pertinentes",
        "Limitez le nombre de variables pour une analyse claire",
        "Vérifiez la distribution de vos données avant analyse"
      ]
    },
    {
      title: "Interprétation des résultats",
      icon: Eye,
      tips: [
        "Examinez d'abord les statistiques descriptives",
        "Vérifiez les conditions d'application des tests",
        "Interprétez la significativité statistique avec prudence",
        "Considérez la pertinence clinique au-delà de la p-value"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 border-b">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Documentation
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Guide complet pour maîtriser votre plateforme d'analyse biostatistique. 
              Apprenez à transformer vos données en insights professionnels.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans la documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Guide rapide", href: "#quick-start", icon: Zap },
              { label: "Types d'analyses", href: "#analysis-types", icon: BarChart3 },
              { label: "Fonctionnalités", href: "#features", icon: Settings },
              { label: "Bonnes pratiques", href: "#best-practices", icon: Lightbulb },
              { label: "Dépannage", href: "#troubleshooting", icon: HelpCircle }
            ].map((item, index) => (
              <Button key={index} variant="outline" size="sm" className="gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <Tabs defaultValue="getting-started" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="getting-started">Démarrage</TabsTrigger>
            <TabsTrigger value="analysis-guide">Analyses</TabsTrigger>
            <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
            <TabsTrigger value="best-practices">Bonnes pratiques</TabsTrigger>
            <TabsTrigger value="troubleshooting">Support</TabsTrigger>
          </TabsList>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Guide de démarrage rapide</h2>
              <p className="text-lg text-muted-foreground">
                Suivez ces étapes pour réaliser votre première analyse biostatistique en quelques minutes.
              </p>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Prérequis :</strong> Navigateur moderne (Chrome, Edge, Firefox) et fichier Excel avec données structurées.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6">
              {quickStartSteps.map((step, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-primary/10">
                            Étape {index + 1}
                          </Badge>
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                          💡 <strong>Astuce :</strong> {step.details}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Format Example */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Exemple de structure de données
                </CardTitle>
                <CardDescription>
                  Format recommandé pour vos fichiers Excel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Patient_ID</th>
                        <th className="text-left p-2 font-medium">Sexe</th>
                        <th className="text-left p-2 font-medium">Age</th>
                        <th className="text-left p-2 font-medium">Groupe</th>
                        <th className="text-left p-2 font-medium">Score_QDV</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="p-2">P001</td>
                        <td className="p-2">F</td>
                        <td className="p-2">45</td>
                        <td className="p-2">Traitement</td>
                        <td className="p-2">85</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">P002</td>
                        <td className="p-2">M</td>
                        <td className="p-2">52</td>
                        <td className="p-2">Contrôle</td>
                        <td className="p-2">78</td>
                      </tr>
                      <tr>
                        <td className="p-2">...</td>
                        <td className="p-2">...</td>
                        <td className="p-2">...</td>
                        <td className="p-2">...</td>
                        <td className="p-2">...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Guide Tab */}
          <TabsContent value="analysis-guide" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Guide des analyses statistiques</h2>
              <p className="text-lg text-muted-foreground">
                Comprendre les différents types d'analyses et leurs applications en recherche biomédicale.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {analysisTypes.map((analysis, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <analysis.icon className="h-5 w-5 text-primary" />
                      </div>
                      {analysis.type}
                    </CardTitle>
                    <CardDescription>{analysis.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Méthodes disponibles</h4>
                      <ul className="space-y-1">
                        {analysis.methods.map((method, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {method}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Exemples d'usage</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.useCases.map((useCase, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Workflow Diagram */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Workflow d'analyse
                </CardTitle>
                <CardDescription>
                  Processus automatisé de traitement de vos données
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg overflow-x-auto">
                  <div className="flex justify-around items-center gap-4 min-w-max w-full">
                    {[
                      { label: "Import", icon: FileSpreadsheet },
                      { label: "Validation", icon: CheckCircle },
                      { label: "Configuration", icon: Settings },
                      { label: "Analyse", icon: BarChart3 },
                      { label: "Résultats", icon: Eye },
                      { label: "Export", icon: Download }
                    ].map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <step.icon className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{step.label}</span>
                        </div>
                        {idx < 5 && <ArrowRight className="h-5 w-5 text-muted-foreground" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Fonctionnalités détaillées</h2>
              <p className="text-lg text-muted-foreground">
                Découvrez toutes les capacités de votre plateforme d'analyse biostatistique.
              </p>
            </div>

            <div className="space-y-8">
              {features.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {category.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="outline">{item.value}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Code Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Structure de configuration
                </CardTitle>
                <CardDescription>
                  Exemple de configuration d'analyse (JSON interne)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(`{
  "primaryCharacteristic": "Groupe",
  "secondaryCharacteristics": ["Age", "Sexe", "Score_QDV"],
  "analysisType": "comparative",
  "tests": {
    "qualitative": ["chi2", "fisher"],
    "quantitative": ["ttest", "mannwhitney"]
  }
}`, 'config')}
                  >
                    {copiedCode === 'config' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "primaryCharacteristic": "Groupe",
  "secondaryCharacteristics": ["Age", "Sexe", "Score_QDV"],
  "analysisType": "comparative",
  "tests": {
    "qualitative": ["chi2", "fisher"],
    "quantitative": ["ttest", "mannwhitney"]
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Best Practices Tab */}
          <TabsContent value="best-practices" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Bonnes pratiques</h2>
              <p className="text-lg text-muted-foreground">
                Conseils d'experts pour optimiser vos analyses biostatistiques et éviter les pièges courants.
              </p>
            </div>

            <div className="space-y-6">
              {bestPractices.map((practice, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <practice.icon className="h-5 w-5 text-primary" />
                      </div>
                      {practice.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {practice.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Statistical Interpretation Guide */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-5 w-5" />
                  Guide d'interprétation statistique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Significativité statistique</h4>
                    <ul className="space-y-1 text-sm text-amber-800">
                      <li>• p &lt; 0.05 : statistiquement significatif</li>
                      <li>• p &lt; 0.01 : très significatif</li>
                      <li>• p &lt; 0.001 : hautement significatif</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Taille d'effet</h4>
                    <ul className="space-y-1 text-sm text-amber-800">
                      <li>• Toujours interpréter avec la p-value</li>
                      <li>• Considérer la pertinence clinique</li>
                      <li>• Évaluer la puissance statistique</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Troubleshooting Tab */}
          <TabsContent value="troubleshooting" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Support et dépannage</h2>
              <p className="text-lg text-muted-foreground">
                Solutions aux problèmes les plus fréquents et ressources d'aide.
              </p>
            </div>

            <div className="space-y-6">
              {troubleshooting.map((issue, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      {issue.problem}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium">Solutions recommandées :</h4>
                      <ul className="space-y-2">
                        {issue.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Support */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Besoin d'aide supplémentaire ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Notre équipe de support est là pour vous aider avec vos analyses biostatistiques.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Centre d'aide
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Contact support
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Tutoriels vidéo
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Prérequis système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Navigateurs supportés
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Chrome 90+</li>
                      <li>• Edge 90+</li>
                      <li>• Firefox 88+</li>
                      <li>• Safari 14+</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Fichiers acceptés
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Excel (.xlsx, .xls)</li>
                      <li>• CSV (UTF-8)</li>
                      <li>• Taille max : 50 Mo</li>
                      <li>• Jusqu'à 100k lignes</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Sécurité
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Traitement local</li>
                      <li>• Aucun upload serveur</li>
                      <li>• Données chiffrées</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}