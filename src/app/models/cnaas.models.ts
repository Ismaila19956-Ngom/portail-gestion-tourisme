/* ============================================================
   Interfaces TypeScript — Sénégal Excursions Portail
   Synchronis�es avec le backend Spring Boot (senegal-excursions-backend)
============================================================ */

export interface ValeurRef {
    id: number;
    code: string;
    libelle: string;
    description?: string;
}

/* ── Catégorie produit ── */
export interface CategorieProduit {
    id?: number;
    code: string;
    libelle: string;
}

export interface Partenaire {
    id?: number;
    nom: string;
    logo?: string;
    url?: string;
}

/* ── Produit ── */
export interface Produit {
    id: number;
    code: string;
    nom: string;
    description?: string;
    imageUrl?: string;
    branche?: ValeurRef;
    categorie?: ValeurRef;
}

/* ── Garantie ── */
export interface Garantie {
    id: number;
    code: string;
    libelle: string;
    description?: string;
    obligatoire: boolean;
    active?: boolean;
    plafond?: number;
    produit?: { id: number };
    zone?: ValeurRef;
}

/* ── Prime ── */
export interface LignePrime {
    id: number;
    code: string;
    valeurPrime?: number;
    typePrime?: string;    /* POURCENTAGE | MONTANT */
    montantHa?: number;
    min?: number;
    max?: number;
    active?: boolean;
    categorie?: ValeurRef;
    souche?: ValeurRef;
    periode?: ValeurRef;
    valeurAssuree?: ValeurRef;
    zone?: ValeurRef;
}

export interface Prime {
    id: number;
    dateEffet: string;
    dateFin?: string;
    active?: boolean;
    lignes: LignePrime[];
}

/* ── Franchise ── */
export interface LigneFranchise {
    id: number;
    code: string;
    libelle: string;
    typeCalcul: string;    /* TAUX | MONTANT | POURCENTAGE | MONTANT_FIXE */
    valeur: number;
    min?: number;
    max?: number;
}

export interface Franchise {
    id: number;
    dateEffet: string;
    dateFin?: string;
    active: boolean;
    lignes: LigneFranchise[];
}

/* ── Extension ── */
export interface Extension {
    id: number;
    code: string;
    libelle: string;
    majoration: number;
    min?: number;
    max?: number;
    description?: string;
    dateEffet?: string;
    dateFin?: string;
    active?: boolean;
}

/* ── Taxe ── */
export interface Taxe {
    id: number;
    code: string;
    libelle: string;
    valeur: number;
    dateDebut?: string;
    dateFin?: string;
    active: boolean;
}

/* ── Frais ── */
export interface Frais {
    id: number;
    code: string;
    libelle: string;
    montantMin?: number;
    montantDefaut: number;
    montantMax?: number;
    description?: string;
    active?: boolean;
}

/* ── Page r�ponse Spring ── */
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

/* ── D�tail complet d'un produit ── */
export interface ProduitDetail {
    produit: Produit;
    garanties: Garantie[];
    primes: Prime[];
    franchises: Franchise[];
    extensions: Extension[];
    taxes: Taxe[];
    frais: Frais[];
}
