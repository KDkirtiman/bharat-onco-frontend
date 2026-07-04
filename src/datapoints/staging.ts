export type CancerSite =
  | 'breast' | 'colorectal' | 'lung' | 'oral-cavity'
  | 'head-neck' | 'cervix' | 'ovarian' | 'other';

export type ClassificationType = 'cTNM' | 'pTNM' | 'ypTNM' | 'rTNM' | 'aTNM';

export const STAGING_SITE_LABELS: Record<CancerSite, string> = {
  breast:        'Breast Cancer',
  colorectal:    'Colorectal Cancer',
  lung:          'Lung Cancer',
  'oral-cavity': 'Oral Cavity Cancer',
  'head-neck':   'Head & Neck Cancer',
  cervix:        'Cervical Cancer',
  ovarian:       'Ovarian Cancer',
  other:         'Other',
};

export const CLASSIFICATION_LABELS: Record<ClassificationType, string> = {
  cTNM:  'Clinical (cTNM)',
  pTNM:  'Pathological (pTNM)',
  ypTNM: 'Post-therapy (ypTNM)',
  rTNM:  'Recurrent (rTNM)',
  aTNM:  'Autopsy (aTNM)',
};

export const CLASSIFICATION_COLORS: Record<ClassificationType, string> = {
  cTNM:  'bg-blue-100 text-blue-700',
  pTNM:  'bg-green-100 text-green-700',
  ypTNM: 'bg-purple-100 text-purple-700',
  rTNM:  'bg-amber-100 text-amber-700',
  aTNM:  'bg-rose-100 text-rose-700',
};

export const GYNECOLOGIC_SITES: CancerSite[] = ['cervix', 'ovarian'];
export const HEAD_NECK_SITES:   CancerSite[] = ['oral-cavity', 'head-neck'];

export const FIGO_OPTIONS: Record<'cervix' | 'ovarian', string[]> = {
  cervix: [
    'FIGO IA1', 'FIGO IA2',
    'FIGO IB1', 'FIGO IB2', 'FIGO IB3',
    'FIGO IIA1', 'FIGO IIA2', 'FIGO IIB',
    'FIGO IIIA', 'FIGO IIIB', 'FIGO IIIC1', 'FIGO IIIC2',
    'FIGO IVA', 'FIGO IVB',
  ],
  ovarian: [
    'FIGO IA', 'FIGO IB', 'FIGO IC1', 'FIGO IC2', 'FIGO IC3',
    'FIGO IIA', 'FIGO IIB',
    'FIGO IIIA1', 'FIGO IIIA2', 'FIGO IIIB', 'FIGO IIIC',
    'FIGO IVA', 'FIGO IVB',
  ],
};

export type TnmEdition = '7th' | '8th' | '9th';

export const TNM_EDITION_LABELS: Record<TnmEdition, string> = {
  '7th': 'AJCC/UICC 7th Ed. (2010–2016)',
  '8th': 'AJCC/UICC 8th Ed. (2017–2023)',
  '9th': 'UICC TNM 9th Ed. (2024–present)',
};

// 7th-edition descriptors for sites where T/N/M codes differ meaningfully
const SITE_DESCRIPTORS_7TH: Partial<Record<CancerSite, { t: string[]; n: string[]; m: string[] }>> = {
  lung: {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ',
      'T1a — ≤ 20 mm',
      'T1b — > 20 mm and ≤ 30 mm',
      'T2a — > 30 mm and ≤ 50 mm, or involves main bronchus ≥ 2 cm from carina, or visceral pleura invasion',
      'T2b — > 50 mm and ≤ 70 mm',
      'T3 — > 70 mm, or chest wall / diaphragm / mediastinal pleura / pericardium involvement; or satellite nodule in same lobe',
      'T4 — Mediastinum / heart / trachea / carina / great vessels / vertebra invasion; or satellite nodule in ipsilateral different lobe',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Ipsilateral peribronchial and/or hilar nodes',
      'N2 — Ipsilateral mediastinal and/or subcarinal nodes',
      'N3 — Contralateral mediastinal/hilar, or scalene/supraclavicular',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1a — Separate nodule(s) in contralateral lobe; pleural/pericardial nodules or malignant effusion',
      'M1b — Distant metastasis',
    ],
  },
  'oral-cavity': {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ',
      'T1 — ≤ 20 mm',
      'T2 — > 20 mm and ≤ 40 mm',
      'T3 — > 40 mm',
      'T4a — Adjacent structures: bone, inferior alveolar nerve, floor of mouth, skin',
      'T4b — Masticator space, pterygoid plates, skull base, or internal carotid artery',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Single ipsilateral node ≤ 30 mm',
      'N2a — Single ipsilateral node > 30 mm and ≤ 60 mm',
      'N2b — Multiple ipsilateral nodes, none > 60 mm',
      'N2c — Bilateral or contralateral nodes, none > 60 mm',
      'N3 — Any node > 60 mm',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1 — Distant metastasis',
    ],
  },
  'head-neck': {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ',
      'T1 — Tumour ≤ 20 mm, limited to subsite',
      'T2 — Tumour > 20 mm and ≤ 40 mm',
      'T3 — Tumour > 40 mm, or minimal extralaryngeal extension',
      'T4a — Moderately advanced: invades adjacent structures',
      'T4b — Very advanced: invades prevertebral space, encases carotid artery',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Single ipsilateral node ≤ 30 mm',
      'N2a — Single ipsilateral node > 30 mm and ≤ 60 mm',
      'N2b — Multiple ipsilateral nodes, none > 60 mm',
      'N2c — Bilateral or contralateral nodes, none > 60 mm',
      'N3 — Any node > 60 mm',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1 — Distant metastasis',
    ],
  },
};

// 9th-edition descriptors (UICC 2024) — key changes vs 8th:
//   Lung: N2 split into N2a (single station) / N2b (multiple stations); M1c split into M1c1 / M1c2
//   Head & Neck oral: T category refined to incorporate DOI more explicitly
//   Other sites: anatomic T/N/M unchanged from 8th edition
const SITE_DESCRIPTORS_9TH: Partial<Record<CancerSite, { t: string[]; n: string[]; m: string[] }>> = {
  lung: {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis(ais) — Adenocarcinoma in situ, ≤ 30 mm',
      'Tis(squ) — Squamous cell carcinoma in situ',
      'T1mi — Minimally invasive adenocarcinoma ≤ 30 mm',
      'T1a — ≤ 10 mm',
      'T1b — > 10 mm and ≤ 20 mm',
      'T1c — > 20 mm and ≤ 30 mm',
      'T2a — > 30 mm and ≤ 40 mm, or involves main bronchus, or visceral pleura invasion',
      'T2b — > 40 mm and ≤ 50 mm',
      'T3 — > 50 mm and ≤ 70 mm, or chest wall / diaphragm / phrenic nerve involvement',
      'T4 — > 70 mm, or mediastinum / heart / trachea / carina / great vessels invasion',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Ipsilateral peribronchial and/or hilar nodes',
      'N2a — Single ipsilateral mediastinal or subcarinal station',
      'N2b — Multiple ipsilateral mediastinal stations',
      'N3 — Contralateral mediastinal/hilar, or scalene/supraclavicular',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1a — Separate tumour nodule in contralateral lobe; pleural or pericardial nodules or malignant effusion',
      'M1b — Single extrathoracic metastasis in one organ',
      'M1c1 — Multiple extrathoracic metastases in one organ',
      'M1c2 — Multiple extrathoracic metastases in multiple organs',
    ],
  },
  'oral-cavity': {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ',
      'T1 — ≤ 20 mm AND depth of invasion (DOI) ≤ 5 mm',
      'T2 — ≤ 40 mm with DOI > 5 mm and ≤ 10 mm, or > 20 mm with DOI ≤ 10 mm',
      'T3 — > 40 mm, or any size with DOI > 10 mm',
      'T4a — Adjacent structures: cortical bone, inferior alveolar nerve, floor of mouth, skin',
      'T4b — Masticator space, pterygoid plates, skull base, or internal carotid artery',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Single ipsilateral node ≤ 30 mm, ENE(–)',
      'N2a — Single ipsilateral node > 30 mm and ≤ 60 mm, ENE(–)',
      'N2b — Multiple ipsilateral nodes, none > 60 mm, ENE(–)',
      'N2c — Bilateral or contralateral nodes, none > 60 mm, ENE(–)',
      'N3a — Any node > 60 mm, ENE(–)',
      'N3b — Any node with ENE(+)',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1 — Distant metastasis',
    ],
  },
  'head-neck': {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ',
      'T1 — Tumour ≤ 20 mm in greatest dimension',
      'T2 — Tumour > 20 mm and ≤ 40 mm in greatest dimension',
      'T3 — Tumour > 40 mm, or minimal extralaryngeal/extrapharyngeal extension',
      'T4a — Moderately advanced: invades adjacent structures (e.g. thyroid, trachea, prelaryngeal strap muscles)',
      'T4b — Very advanced: invades prevertebral space, encases carotid artery, or invades mediastinal structures',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Single ipsilateral node ≤ 30 mm, ENE(–)',
      'N2a — Single ipsilateral node > 30 mm and ≤ 60 mm, ENE(–)',
      'N2b — Multiple ipsilateral nodes, none > 60 mm, ENE(–)',
      'N2c — Bilateral or contralateral nodes, none > 60 mm, ENE(–)',
      'N3a — Any node > 60 mm, ENE(–)',
      'N3b — Any node with ENE(+)',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1 — Distant metastasis',
    ],
  },
};

/** Returns T/N/M descriptor options for the given site and edition. Falls back to 8th edition for sites with no edition-specific differences. */
export function getSiteDescriptors(site: CancerSite, edition: TnmEdition = '8th') {
  if (edition === '7th' && SITE_DESCRIPTORS_7TH[site]) {
    return SITE_DESCRIPTORS_7TH[site]!;
  }
  if (edition === '9th' && SITE_DESCRIPTORS_9TH[site]) {
    return SITE_DESCRIPTORS_9TH[site]!;
  }
  return SITE_DESCRIPTORS[site];
}

export const SITE_DESCRIPTORS: Record<CancerSite, { t: string[]; n: string[]; m: string[] }> = {
  breast: {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ (DCIS or LCIS)',
      'T1mi — Microinvasion ≤ 1 mm',
      'T1a — > 1 mm and ≤ 5 mm',
      'T1b — > 5 mm and ≤ 10 mm',
      'T1c — > 10 mm and ≤ 20 mm',
      'T2 — > 20 mm and ≤ 50 mm',
      'T3 — > 50 mm',
      'T4a — Extension to chest wall',
      'T4b — Oedema/ulceration of skin, satellite nodules',
      'T4c — T4a + T4b',
      'T4d — Inflammatory carcinoma',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1mi — Micrometastasis (0.2–2 mm)',
      'N1 — Ipsilateral Level I/II movable axillary nodes',
      'N2a — Fixed or matted ipsilateral axillary nodes',
      'N2b — Internal mammary nodes without axillary nodes',
      'N3a — Infraclavicular (Level III) nodes',
      'N3b — Axillary + internal mammary nodes',
      'N3c — Ipsilateral supraclavicular nodes',
    ],
    m: [
      'M0 — No distant metastasis',
      'cM0(i+) — No clinical evidence; isolated tumour cells in bone marrow',
      'M1 — Distant metastasis',
    ],
  },
  colorectal: {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ (intraepithelial)',
      'T1 — Invades submucosa',
      'T2 — Invades muscularis propria',
      'T3 — Through muscularis propria into pericolorectal tissues',
      'T4a — Penetrates visceral peritoneal surface',
      'T4b — Directly invades adjacent organs or structures',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1a — 1 regional lymph node',
      'N1b — 2–3 regional lymph nodes',
      'N1c — Tumour deposit(s), no regional nodes',
      'N2a — 4–6 regional lymph nodes',
      'N2b — 7 or more regional lymph nodes',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1a — Metastasis confined to one organ (no peritoneum)',
      'M1b — Metastasis to 2+ organs (no peritoneum)',
      'M1c — Peritoneal surface metastasis ± other organs',
    ],
  },
  lung: {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis(ais) — Adenocarcinoma in situ, ≤ 30 mm',
      'Tis(squ) — Squamous cell carcinoma in situ',
      'T1mi — Minimally invasive adenocarcinoma ≤ 30 mm',
      'T1a — ≤ 10 mm',
      'T1b — > 10 mm and ≤ 20 mm',
      'T1c — > 20 mm and ≤ 30 mm',
      'T2a — > 30 mm and ≤ 40 mm, or involves main bronchus, or visceral pleura invasion',
      'T2b — > 40 mm and ≤ 50 mm',
      'T3 — > 50 mm and ≤ 70 mm, or chest wall / diaphragm / phrenic nerve involvement',
      'T4 — > 70 mm, or mediastinum / heart / trachea / carina / great vessels invasion',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Ipsilateral peribronchial and/or hilar nodes',
      'N2 — Ipsilateral mediastinal and/or subcarinal nodes',
      'N3 — Contralateral mediastinal/hilar, or scalene/supraclavicular',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1a — Separate tumour nodule in contralateral lobe; pleural or pericardial nodules or malignant effusion',
      'M1b — Single extrathoracic metastasis in one organ',
      'M1c — Multiple extrathoracic metastases in one or multiple organs',
    ],
  },
  'oral-cavity': {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ',
      'T1 — ≤ 20 mm, depth of invasion (DOI) ≤ 5 mm',
      'T2 — ≤ 40 mm, or DOI > 5 mm and ≤ 10 mm',
      'T3 — > 40 mm, or any size with DOI > 10 mm',
      'T4a — Adjacent structures: bone, inferior alveolar nerve, floor of mouth, skin',
      'T4b — Masticator space, pterygoid plates, skull base, or internal carotid artery',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Single ipsilateral node ≤ 30 mm, ENE(–)',
      'N2a — Single ipsilateral node > 30 mm and ≤ 60 mm, ENE(–)',
      'N2b — Multiple ipsilateral nodes, none > 60 mm, ENE(–)',
      'N2c — Bilateral or contralateral nodes, none > 60 mm, ENE(–)',
      'N3a — Any node > 60 mm, ENE(–)',
      'N3b — Any node with ENE(+)',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1 — Distant metastasis',
    ],
  },
  'head-neck': {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ',
      'T1 — Tumour ≤ 20 mm, limited to larynx/pharynx/hypopharynx',
      'T2 — Tumour > 20 mm and ≤ 40 mm',
      'T3 — Tumour > 40 mm, or minimal extralaryngeal extension',
      'T4a — Moderately advanced: invades adjacent structures',
      'T4b — Very advanced: invades prevertebral space, encases carotid artery',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Single ipsilateral node ≤ 30 mm, ENE(–)',
      'N2a — Single ipsilateral node > 30 mm and ≤ 60 mm, ENE(–)',
      'N2b — Multiple ipsilateral nodes, none > 60 mm, ENE(–)',
      'N2c — Bilateral or contralateral nodes, none > 60 mm, ENE(–)',
      'N3a — Any node > 60 mm, ENE(–)',
      'N3b — Any node with ENE(+)',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1 — Distant metastasis',
    ],
  },
  cervix: {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'T1a1 — Stromal invasion ≤ 3 mm (microscopically diagnosed)',
      'T1a2 — Stromal invasion > 3 mm and ≤ 5 mm',
      'T1b1 — Tumour ≤ 20 mm',
      'T1b2 — Tumour > 20 mm and ≤ 40 mm',
      'T1b3 — Tumour > 40 mm',
      'T2a — Upper 2/3 vagina involvement, no parametrium',
      'T2a1 — ≤ 40 mm',
      'T2a2 — > 40 mm',
      'T2b — Parametrial invasion',
      'T3a — Involves lower third of vagina',
      'T3b — Extends to pelvic wall or causes hydronephrosis',
      'T4 — Invades bladder or rectal mucosa (biopsy proven)',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Regional lymph node metastasis',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1 — Distant metastasis (including inguinal nodes or intraperitoneal disease)',
    ],
  },
  ovarian: {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'T1a — One ovary or tube, capsule intact, no surface involvement',
      'T1b — Both ovaries or tubes, capsule intact, no surface involvement',
      'T1c — Surgical spill, capsule rupture, or surface tumour involvement',
      'T2a — Extension to uterus or fallopian tubes, no malignant cells in ascites',
      'T2b — Extension to other pelvic tissues',
      'T3a — Microscopic peritoneal metastasis beyond pelvis ≤ 10 mm',
      'T3b — Macroscopic peritoneal metastasis beyond pelvis > 10 mm and ≤ 20 mm',
      'T3c — Peritoneal metastasis > 20 mm ± liver/spleen surface',
    ],
    n: [
      'NX — Regional nodes cannot be assessed',
      'N0 — No regional node metastasis',
      'N1 — Regional lymph node metastasis',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1a — Pleural effusion with positive cytology',
      'M1b — Extra-abdominal/inguinal nodes or parenchymal metastasis',
    ],
  },
  other: {
    t: [
      'TX — Primary tumour cannot be assessed',
      'T0 — No evidence of primary tumour',
      'Tis — Carcinoma in situ / non-invasive tumour',
      'T1 — Tumour ≤ 2 cm or confined to organ of origin',
      'T1a — Tumour ≤ 1 cm',
      'T1b — Tumour > 1 cm and ≤ 2 cm',
      'T2 — Tumour > 2 cm and ≤ 4 cm, or minimal extension beyond organ',
      'T2a — Tumour > 2 cm and ≤ 3 cm',
      'T2b — Tumour > 3 cm and ≤ 4 cm',
      'T3 — Tumour > 4 cm or extends to adjacent structures (non-vital)',
      'T4 — Tumour invades critical adjacent structures or is unresectable',
      'T4a — Moderately advanced — resectable with clear margins anticipated',
      'T4b — Very advanced — invades masticator space, pterygoid plates, skull base, or encases carotid',
    ],
    n: [
      'NX — Regional lymph nodes cannot be assessed',
      'N0 — No regional lymph node metastasis',
      'N1 — Single ipsilateral node ≤ 3 cm, ENE negative',
      'N2 — Single ipsilateral node > 3 cm but ≤ 6 cm, ENE negative; or multiple nodes ≤ 6 cm, ENE negative',
      'N2a — Single ipsilateral node > 3 cm and ≤ 6 cm, ENE negative',
      'N2b — Multiple ipsilateral nodes ≤ 6 cm, ENE negative',
      'N2c — Bilateral or contralateral nodes ≤ 6 cm, ENE negative',
      'N3 — Any node > 6 cm, ENE negative; or any node with ENE positive',
      'N3a — Any node > 6 cm in greatest dimension, ENE negative',
      'N3b — Any node, ENE positive',
    ],
    m: [
      'M0 — No distant metastasis',
      'M1 — Distant metastasis present',
      'M1a — Single distant metastasis (single organ)',
      'M1b — Multiple distant metastases (single organ) or single distant metastasis in > 1 organ',
      'M1c — Multiple distant metastases in > 1 organ',
    ],
  },
};

function code(descriptor: string): string {
  return descriptor.split(' — ')[0].trim();
}

export function getStageLookup(site: CancerSite, t: string, n: string, m: string): string | null {
  const tc = code(t);
  const nc = code(n);
  const mc = code(m);

  if (site === 'breast') {
    if (mc === 'M1') return 'Stage IV';
    if (mc !== 'M0' && mc !== 'cM0(i+)') return null;
    const isT1 = ['T1mi', 'T1a', 'T1b', 'T1c'].includes(tc);
    const isT0orT1 = tc === 'T0' || isT1;
    const isT4 = ['T4a', 'T4b', 'T4c', 'T4d'].includes(tc);
    const isN2 = ['N2a', 'N2b'].includes(nc);
    const isN3 = ['N3a', 'N3b', 'N3c'].includes(nc);
    if (tc === 'Tis' && nc === 'N0') return 'Stage 0';
    if (isN3) return 'Stage IIIC';
    if (isT4) return 'Stage IIIB';
    if (isN2 || (tc === 'T3' && nc === 'N1')) return 'Stage IIIA';
    if (tc === 'T3' && nc === 'N0') return 'Stage IIB';
    if (tc === 'T2' && nc === 'N1') return 'Stage IIB';
    if (tc === 'T2' && nc === 'N0') return 'Stage IIA';
    if (isT0orT1 && nc === 'N1') return 'Stage IIA';
    if (isT0orT1 && nc === 'N1mi') return 'Stage IB';
    if (isT1 && nc === 'N0') return 'Stage IA';
    return null;
  }

  if (site === 'colorectal') {
    if (['M1a', 'M1b', 'M1c'].includes(mc)) return 'Stage IV';
    if (mc !== 'M0') return null;
    const isN1 = ['N1a', 'N1b', 'N1c'].includes(nc);
    const isN2 = ['N2a', 'N2b'].includes(nc);
    if (tc === 'Tis' && nc === 'N0') return 'Stage 0';
    if (['T1', 'T2'].includes(tc) && nc === 'N0') return 'Stage I';
    if (tc === 'T3' && nc === 'N0') return 'Stage IIA';
    if (tc === 'T4a' && nc === 'N0') return 'Stage IIB';
    if (tc === 'T4b' && nc === 'N0') return 'Stage IIC';
    if (['T1', 'T2'].includes(tc) && isN1) return 'Stage IIIA';
    if (tc === 'T1' && nc === 'N2a') return 'Stage IIIA';
    if (['T3', 'T4a'].includes(tc) && isN1) return 'Stage IIIB';
    if (['T2', 'T3'].includes(tc) && nc === 'N2a') return 'Stage IIIB';
    if (['T1', 'T2'].includes(tc) && nc === 'N2b') return 'Stage IIIB';
    if ((tc === 'T4a' && nc === 'N2b') || (tc === 'T4a' && isN2)) return 'Stage IIIC';
    if (tc === 'T4b' && (isN1 || isN2)) return 'Stage IIIC';
    return null;
  }

  if (site === 'lung') {
    // M codes: 9th ed splits M1c → M1c1/M1c2; 8th ed uses M1c; 7th ed uses M1a/M1b only
    if (mc === 'M1c2') return 'Stage IVB';
    if (['M1a', 'M1b', 'M1c', 'M1c1'].includes(mc)) return 'Stage IVA';
    if (mc !== 'M0') return null;
    if (nc === 'N3') return 'Stage IIIB';
    // N2: 8th ed uses N2; 9th ed splits into N2a/N2b — all map to Stage IIIA
    if (['N2', 'N2a', 'N2b'].includes(nc)) return 'Stage IIIA';
    if (nc === 'N1') {
      // T codes differ by edition but share T1a/T1b labels (different size thresholds, same staging)
      if (['T1a', 'T1b', 'T1c', 'T2a', 'T2b'].includes(tc)) return 'Stage IIB';
      if (['T3', 'T4'].includes(tc)) return 'Stage IIIA';
    }
    if (nc === 'N0') {
      if (['Tis', 'Tis(ais)', 'Tis(squ)', 'T1mi'].includes(tc)) return 'Stage 0';
      // 7th ed: T1a ≤2cm, T1b 2-3cm → IA; 8th/9th: T1a ≤1cm → IA1, T1b → IA2
      if (['T1a', 'T1b'].includes(tc)) return 'Stage IA';
      if (tc === 'T1c') return 'Stage IA3';
      if (tc === 'T2a') return 'Stage IB';
      if (tc === 'T2b') return 'Stage IIA';
      if (tc === 'T3') return 'Stage IIB';
      if (tc === 'T4') return 'Stage IIIA';
    }
    return null;
  }

  if (site === 'oral-cavity' || site === 'head-neck') {
    if (mc === 'M1') return 'Stage IVC';
    if (mc !== 'M0') return null;
    if (['N3a', 'N3b'].includes(nc) || tc === 'T4b') return 'Stage IVB';
    if (tc === 'T4a' || ['N2a', 'N2b', 'N2c'].includes(nc)) return 'Stage IVA';
    if (tc === 'Tis' && nc === 'N0') return 'Stage 0';
    if (tc === 'T1' && nc === 'N0') return 'Stage I';
    if (tc === 'T2' && nc === 'N0') return 'Stage II';
    if (tc === 'T3' && nc === 'N0') return 'Stage III';
    if (['T1', 'T2', 'T3'].includes(tc) && nc === 'N1') return 'Stage III';
    return null;
  }

  if (site === 'cervix') {
    if (mc === 'M1') return 'Stage IVB';
    if (nc === 'N1') return 'Stage IIIC1';
    if (mc !== 'M0') return null;
    if (tc === 'T1a1') return 'Stage IA1';
    if (tc === 'T1a2') return 'Stage IA2';
    if (tc === 'T1b1') return 'Stage IB1';
    if (tc === 'T1b2') return 'Stage IB2';
    if (tc === 'T1b3') return 'Stage IB3';
    if (tc === 'T2a1') return 'Stage IIA1';
    if (['T2a', 'T2a2'].includes(tc)) return 'Stage IIA2';
    if (tc === 'T2b') return 'Stage IIB';
    if (tc === 'T3a') return 'Stage IIIA';
    if (tc === 'T3b') return 'Stage IIIB';
    if (tc === 'T4') return 'Stage IVA';
    return null;
  }

  if (site === 'ovarian') {
    if (mc === 'M1a') return 'Stage IVA';
    if (mc === 'M1b') return 'Stage IVB';
    if (mc !== 'M0') return null;
    if (nc === 'N1') return 'Stage IIIA1';
    if (tc === 'T1a') return 'Stage IA';
    if (tc === 'T1b') return 'Stage IB';
    if (tc === 'T1c') return 'Stage IC';
    if (tc === 'T2a') return 'Stage IIA';
    if (tc === 'T2b') return 'Stage IIB';
    if (tc === 'T3a') return 'Stage IIIA2';
    if (tc === 'T3b') return 'Stage IIIB';
    if (tc === 'T3c') return 'Stage IIIC';
    return null;
  }

  if (site === 'other') {
    if (mc === 'M1') return 'Stage IV';
    if (mc !== 'M0') return null;
    if (['N2', 'N3'].includes(nc)) {
      return 'Stage III';
    }
    if (nc === 'N1') {
      if (['T1', 'T2'].includes(tc)) return 'Stage IIB';
      return 'Stage III';
    }
    if (nc === 'N0') {
      if (tc === 'Tis') return 'Stage 0';
      if (tc === 'T1') return 'Stage I';
      if (tc === 'T2') return 'Stage IIA';
      if (tc === 'T3') return 'Stage IIB';
      if (tc === 'T4') return 'Stage III';
    }
    return null;
  }

  return null;
}

export function mapCancerTypeToSite(cancerType: string | undefined): CancerSite {
  if (!cancerType) return 'other';
  const l = cancerType.toLowerCase();
  if (l.includes('breast'))                                          return 'breast';
  if (l.includes('colorectal') || l.includes('colon') || l.includes('rectal') || l.includes('rectum')) return 'colorectal';
  if (l.includes('lung'))                                            return 'lung';
  if (l.includes('oral'))                                            return 'oral-cavity';
  if (l.includes('head') || l.includes('neck') || l.includes('pharynx') || l.includes('larynx')) return 'head-neck';
  if (l.includes('cervix') || l.includes('cervical'))               return 'cervix';
  if (l.includes('ovar'))                                            return 'ovarian';
  return 'other';
}

export interface StagingEditEntry {
  editedAt: string;
  snapshot: {
    classType:     ClassificationType;
    edition?:      TnmEdition;
    date:          string;
    t:             string;
    n:             string;
    m:             string;
    stageGroup:    string | null;
    stageOverride?: string;
    figo?:         string;
    ene?:          'positive' | 'negative';
    planId?:       string;
    notes?:        string;
  };
}

export type StagingMode = 'tnm' | 'under-evaluation' | 'not-applicable' | 'unstable';

export const STAGING_MODE_LABELS: Record<StagingMode, string> = {
  'tnm':              'TNM Staging',
  'under-evaluation': 'Under Evaluation',
  'not-applicable':   'Not Applicable',
  'unstable':         'Unstable',
};

export interface CancerStaging {
  id:                    string;
  patientId:             string;
  cancerSite:            CancerSite;
  stagingMode?:          StagingMode;
  classType?:            ClassificationType;
  edition?:              TnmEdition;
  date:                  string;
  t?:                    string;
  n?:                    string;
  m?:                    string;
  stageGroup?:           string | null;
  stageOverride?:        string;
  figo?:                 string;
  ene?:                  'positive' | 'negative';
  planId?:               string;
  notes?:                string;
  flaggedForTumorBoard?: boolean;
  editHistory?:          StagingEditEntry[];
}

export const mockStagingRecords: CancerStaging[] = [
  {
    id:          'cs1',
    patientId:   'p1',
    cancerSite:  'breast',
    classType:   'cTNM',
    date:        '2024-01-12',
    t:           'T2 — > 20 mm and ≤ 50 mm',
    n:           'N1 — Ipsilateral Level I/II movable axillary nodes',
    m:           'M0 — No distant metastasis',
    stageGroup:  'Stage IIA',
    notes:       'Post-biopsy clinical staging',
  },
  {
    id:          'cs2',
    patientId:   'p1',
    cancerSite:  'breast',
    classType:   'ypTNM',
    date:        '2024-03-15',
    t:           'T2 — > 20 mm and ≤ 50 mm',
    n:           'N0 — No regional node metastasis',
    m:           'M0 — No distant metastasis',
    stageGroup:  'Stage IIA',
    notes:       'Post-NACT restaging — partial response',
  },
  {
    id:          'cs3',
    patientId:   'p3',
    cancerSite:  'lung',
    classType:   'cTNM',
    date:        '2024-02-20',
    t:           'T2a — > 30 mm and ≤ 40 mm, or involves main bronchus, or visceral pleura invasion',
    n:           'N1 — Ipsilateral peribronchial and/or hilar nodes',
    m:           'M0 — No distant metastasis',
    stageGroup:  'Stage IIB',
    notes:       'Initial staging at diagnosis',
  },
];
