/** Compatible Spring Boot 3.3+ VIA_DTO (page sub-object) ET ancien format plat */
export interface Page<T> {
    content: T[];
    // Nouveau format Spring Data 3.3+ (VIA_DTO)
    page?: {
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    };
    // Ancien format plat (backward compatibility)
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
}

/** Extrait les métadonnées de pagination quel que soit le format reçu */
export function pageInfo(p: Page<any>): { total: number; totalPages: number; page: number; size: number } {
    return {
        total:      p?.page?.totalElements ?? p?.totalElements ?? 0,
        totalPages: p?.page?.totalPages    ?? p?.totalPages    ?? 0,
        page:       p?.page?.number        ?? p?.number        ?? 0,
        size:       p?.page?.size          ?? p?.size          ?? 0,
    };
}

export interface Police {
    id: number;
    numeroPolice: string;
    dateEmission: string;
    dateEffet: string;
    dateEcheance: string;
    duree?: number;
    statut: any;
    draft?: boolean;
    montantAssure?: number;
    primeNette?: number;
    montantTaxes?: number;
    montantFrais?: number;
    montantEtat?: number;
    montantSubvention?: number;
    primeTotale?: number;
    localisationRisque?: string;
    adresseComplete?: string;
    taciteReconduction?: boolean;
    pvImported?: boolean;
    produit?: { id: number; nom: string; code?: string; categorie?: { id: number; libelle: string } };
    agence?: { id: number; nom: string; zone?: { code: string; libelle: string } };
    client?: { id: number; nom: string; prenom: string; raisonSociale?: string; numeroClient?: string; telephone?: string; email?: string };
    validationPolice?: { code: string; libelle: string };
    garantie?: { id: number; libelle?: string };
    prime?: { id: number };
    franchise?: { id: number; lignes?: any[] };
    extensions?: any[];
    region?: { code: string; libelle: string };
    departement?: { code: string; libelle: string };
    commune?: { code: string; libelle: string };
    localite?: { code: string; libelle: string };
    // Sous-entités produit
    betail?: {
        valeurAssuree?: number; primeTotale?: number; nombreAnimaux?: number;
        typeGarantie?: string; franchiseTaux?: string; observations?: string;
        extensionTuberculose?: boolean; extensionOperation?: boolean; extensionVol?: boolean;
        animaux?: AnimalBetail[]; membres?: any[];
    };
    aviculture?: {
        nombreAnimaux?: number; prixUnitaire?: number;
        batiments?: any[]; membres?: any[];
    };
    recolte?: {
        campagne?: any; totalSuperficieAssureeHa?: number; totalMontantAssure?: number;
        totalPrimeNetteHT?: number; observationsGenerales?: string;
        parcelles?: any[]; membres?: any[];
    };
    horticulture?: {
        valeurAssureeTotale?: number; observationsGenerales?: string;
        parcelles?: any[]; membres?: any[];
    };
    equipement?: {
        montantAssureTotal?: number; primeTotale?: number; nombreEquipementsTotal?: number;
        franchiseTaux?: string; observations?: string;
        equipementsAssures?: any[]; membres?: any[];
    };
    multirisques?: { valeurAssuree?: number; primeTotale?: number; nombreAnimaux?: number; lignes?: any[] };
    arboriculture?: { totalSuperficie?: number; totalMontantAssure?: number; parcelles?: any[] };
    stocks?: any[];
    questionnaireBetail?: QuestionnaireBetail;
}

export interface AnimalBetail {
    id?: number;
    espece?: string;
    race?: string;
    sexe?: string;
    age?: string;
    numeroBoucle?: string;
    poidsVif?: number;
    valeurUnitaire?: number;
    valeurTotale?: number;
}

export interface QuestionnaireBetail {
    id?: number;
    adresse?: string;
    qualite?: string;
    nomVeterinaire?: string;
    telephoneVeterinaire?: string;
    frequenceIntervention?: string;
    distanceDomicileExploitation?: string;
    typeElevage?: { libelle: string };
    modeElevage?: string;
    dureeEmbouche?: string;
    commentaireVeterinaire?: string;
    productionLait?: string;
    elevageSimple?: string;
    detailsAnimaux?: any[];
}

export interface PevMarquage {
    id: number;
    numeroPv: string;
    dateInspection: string;
    nomVeterinaire?: string;
    lieuExploitation?: string;
    modeElevage?: string;
    hygiene?: string;
    vaccins?: string;
    observation?: string;
    animaux?: AnimalBetail[];
    police?: { id: number; numeroPolice: string };
}

export interface Sinistre {
    id: number;
    numeroDossier: string;
    dateSurvenance: string;
    dateDeclaration: string;
    dateConstat?: string;
    montantEvalue?: number;
    statut: any;   /* objet {name, description} côté backend */
    police?: Police;
}

export interface Paiement {
    id: number;
    numeroFacture?: string;
    montantPaye: number;
    dateEmission: string;
    modePaiement?: any;   /* enum objet */
    statut: any;           /* objet {name, description} côté backend */
    encaisse?: boolean;
    description?: string;
    police?: { id: number; numeroPolice: string };
    numeroPolice?: string;
    nomPolice?: string;
}

export interface QuestionnaireAviculture {
    id?: number;
    adresse?: string; qualite?: string;
    categorieChair?: { id: number; libelle: string };
    categoriePoulettes?: { id: number; libelle: string };
    categoriePondeuses?: { id: number; libelle: string };
    nbAnimauxChair?: number; nbAnimauxPoulettes?: number; nbAnimauxPondeuses?: number;
    frequenceChair?: number; frequencePoulettes?: number; frequencePondeuses?: number;
    numeroBandesChair?: string; numeroBandesPoulettes?: string; numeroBandesPondeuses?: string;
    prixAchatPondeuses?: number; prixVenteChair?: number; prixVentePoulettes?: number;
    periodeChair?: number; periodePoulettes?: number; periodePondeuses?: number;
    commentaire?: string; declarationSincerite?: { id: number; libelle: string };
    batiments?: QuestionnaireBatimentAviculture[];
}

export interface QuestionnaireBatimentAviculture {
    id?: number;
    numeroBande?: string;
    natureEspece?: { id: number; libelle: string };
    typeElevage?: { id: number; libelle: string };
    alarmeVentilation?: boolean;
    lieuAlarme?: string;
    groupeElectrogene?: boolean;
    nombreAnimaux?: number;
    chargementMax?: number;
}

export interface QuestionnaireRecolte {
    id?: number;
    nomPrenomProfession?: string; adresseDomicile?: string; qualite?: string;
    telephone?: string; situationRisque?: string; dureeMois?: number;
    dateDebut?: string; superficieCultivee?: number; superficieAssuree?: number;
    speculation?: string; speculationAutre?: string;
    chargesProduction?: number; productionEscomptee?: number;
    assurancePrecedente?: string; sinistrePrecedent?: string;
    declarationSincerite?: any;
}

export interface QuestionnaireHorticulture {
    id?: number;
    nomPrenomProfession?: string; adresseDomicile?: string; qualite?: string;
    telephone?: string; situationRisque?: string; dureeMois?: number;
    dateDebut?: string; superficieCultivee?: number; superficieAssuree?: number;
    speculation?: string; speculationAutre?: string;
    chargesProduction?: number; productionEscomptee?: number;
    assurancePrecedente?: string; sinistrePrecedent?: string;
    declarationSincerite?: any;
}

export interface VisiteTechniqueAviculture {
    id?: number; dateVisite?: string; nomVeterinaire?: string;
    souscripteur?: string; situationRisque?: string;
    categorieVolaille?: any; souche?: any;
    existenceFicheElevage?: boolean; existencePlanAlimentation?: boolean;
    existenceSuiviSanitaire?: boolean; tauxMortalite?: number;
    respectNormeAliment?: boolean; respectCourbePoids?: boolean;
    dureeVideSanitaire?: number; produitsDesinfection?: string;
    respectCalendrierVaccinal?: boolean; avisGeneral?: string; observations?: string;
    batiments?: any[];
}

export interface VisiteTechniqueHorticulture {
    id?: number; dateVisite?: string; nomExpert?: string;
    souscripteur?: string; situationRisque?: string; campagne?: any;
    systemeIrrigationFonctionnel?: boolean; existenceCloture?: boolean;
    existenceAbri?: boolean; sourceEau?: string; typeIrrigation?: string;
    avisGeneral?: string; observations?: string;
    parcelles?: any[];
}

export interface DocumentModule {
    id: number;
    libelle?: string;
    typeDocument?: { id: number; libelle?: string; code?: string };
    category?: { id: number; libelle?: string };
    product?: string;
    filename?: string;
    path?: string;
    status?: string;
    createdAt?: string;
    marquerParDefault?: boolean;
}

export interface Avenant {
    id: number;
    numeroAvenant?: string;
    dateEmission?: string;
    dateEffet?: string;
    dateEcheance?: string;
    motif?: string;
    typeAvenant?: any;
    statut?: any;
    montantPrime?: number;
    observations?: string;
    police?: { id: number; numeroPolice: string };
}

export interface ClientSummary360 {
    client?: any;
    nombrePolices?: number;
    nombrePolicesActives?: number;
    nombreSinistres?: number;
    nombreSinistresClos?: number;
    totalPrimesPayees?: number;
    totalIndemnisations?: number;
    polices?: Police[];
    sinistres?: Sinistre[];
}
