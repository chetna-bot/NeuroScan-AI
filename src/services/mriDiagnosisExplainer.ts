/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult } from '../types/analysis';

export interface DifferentialItem {
  condition: string;
  distinguishingFeatures: string;
  imagingDiscriminator: string;
}

export interface SequenceFinding {
  modality: string;
  acronym: string;
  signalBehavior: 'Hypointense' | 'Isointense' | 'Hyperintense' | 'Heterogeneous' | 'Marked Enhancement' | 'Suppressed';
  visualDescription: string;
  clinicalSignificance: string;
}

export interface ClassPathologyProfile {
  title: string;
  categoryType: string;
  plainLanguageSummary: string;
  whoGrading: string;
  whoGradingDetailed: string;
  originTissue: string;
  typicalLocations: string[];
  pathophysiology: string;
  molecularBiomarkers: string[];
  clinicalPresentation: string[];
  radiologicalHallmarks: {
    t1Signal: string;
    t2Signal: string;
    flairSignal: string;
    t2FlairSignal: string;
    contrastEnhancement: string;
    dwiAdcRestriction: string;
    mrSpectroscopy: string;
    perfusionPwi: string;
    margins: string;
    massEffect: string;
  };
  anatomicalRiskZones: string[];
  surgicalRadiotherapyApproach: string;
  pharmacotherapyAndSupport: string[];
  differentialDiagnosis: DifferentialItem[];
  confirmatoryRecommendations: string[];
}

export interface MriDetailedAnalysis {
  pathology: ClassPathologyProfile;
  plainExplanation: string;
  imageOrientation: string;
  anatomicalLandmarks: string[];
  sequenceMatrix: SequenceFinding[];
  tissueMetrics: {
    parenchymalIntegrity: string;
    ventricularSymmetry: string;
    midlineAssessment: string;
    edemaAssessment: string;
    saliencyFocus: string;
    herniationRisk: string;
  };
  quantitativeRadiomics: {
    topClass: string;
    confidencePct: string;
    secondaryClass: string;
    secondaryPct: string;
    marginSharpness: string;
    riskStratification: string;
    whoGradeClassification: string;
    urgencyLevel: 'Emergency / High Urgency' | 'Urgent Specialist Review' | 'Elective Outpatient' | 'Normal Physiological';
  };
}

export const PATHOLOGY_PROFILES: Record<string, ClassPathologyProfile> = {
  Glioma: {
    title: 'Glioma (Primary Intra-Axial Neuroepithelial Neoplasm)',
    categoryType: 'Intra-Axial Malignant Glial Neoplasm',
    plainLanguageSummary:
      'A glioma is a primary brain tumor arising from glial support cells inside the brain tissue itself (intra-axial). Unlike circumscribed non-cancerous lumps that push brain tissue aside, gliomas tend to grow like tree roots, microscopically infiltrating normal brain pathways. Treatment typically requires neurosurgical resection, advanced MRI molecular profiling, radiation therapy, and targeted systemic therapy.',
    whoGrading: 'WHO Grade 2 to Grade 4 (Glioblastoma, IDH-wildtype)',
    whoGradingDetailed:
      '2021 WHO CNS5 Integrated Classification: Graded from WHO CNS Grade 2 (low-grade astrocytoma/oligodendroglioma) through Grade 3 (anaplastic astrocytoma) to Grade 4 (Glioblastoma, IDH-wildtype; or Astrocytoma, IDH-mutant Grade 4 with CDKN2A/B homozygous deletion).',
    originTissue:
      'Transformed neuroglial lineage precursors: mature astrocytes, oligodendrocyte progenitor cells, or neural stem cell niches lining the subventricular zone (SVZ).',
    typicalLocations: [
      'Frontal Lobe subcortical white matter and prefrontal associative tracts',
      'Temporal Lobe (often involving the hippocampus, amygdala, and superior temporal gyrus)',
      'Parietal Lobe periventricular tracts and centrum semiovale',
      'Corpus Callosum (often demonstrating trans-hemispheric bridging, termed "butterfly glioma")',
      'Thalamus and brainstem (pontine gliomas / DIPG in younger cohorts)',
    ],
    pathophysiology:
      'Characterized by extensive microscopic infiltration along myelinated axonal white matter tracts (fascicles) and perivascular spaces of Virchow-Robin. High-grade variants (Glioblastoma) undergo rapid neoangiogenesis driven by VEGF hypersecretion, resulting in friable, disorganized, leaky capillaries that disrupt the blood-brain barrier (BBB). This culminates in severe vasogenic edema, microscopic ischemic microthrombi, pseudopalisading necrosis, and prominent genomic instability.',
    molecularBiomarkers: [
      'IDH1 / IDH2 status: R132H mutation confers significantly favorable prognosis over IDH-wildtype',
      '1p/19q codeletion: Definitive diagnostic molecular hallmark for Oligodendroglioma lineage',
      'MGMT Promoter Methylation: Predicts hyper-sensitivity to alkylating chemotherapy (Temozolomide)',
      'EGFR Amplification & TERT Promoter Mutation: Hallmarks of aggressive IDH-wildtype Glioblastoma',
      'CDKN2A/B Homozygous Deletion: Upgrades IDH-mutant astrocytomas directly to WHO Grade 4',
    ],
    clinicalPresentation: [
      'New-onset epileptic seizures (focal motor seizures or secondary generalized tonic-clonic attacks in 70%+ of patients)',
      'Progressive tension headache, notably worse upon morning awakening or with Valsalva/coughing due to elevated intracranial pressure (ICP)',
      'Subacute progressive neurological deficits: contralateral hemiparesis, dysphasia/aphasia, visual spatial neglect',
      'Personality shifts, cognitive slowing, emotional blunting, and frontal executive dysfunction',
      'Nausea, projectile vomiting, and bilateral papilledema when mass effect exceeds intracranial compliance',
    ],
    radiologicalHallmarks: {
      t1Signal:
        'Predominantly hypointense to isointense compared to gray matter; marked heterogeneity with central hypointense fluid liquefaction in necrotic cores.',
      t2Signal:
        'Hyperintense mass with significant surrounding peritumoral hyperintensity reflecting infiltrative tumor cells interspersed with vasogenic water accumulation.',
      flairSignal:
        'FLAIR hyperintensity extending beyond T1 contrast margins; high-grade tumors show central non-suppressing necrosis with peripheral edema.',
      t2FlairSignal:
        'Hyperintense mass with significant surrounding infiltrative peritumoral vasogenic edema',
      contrastEnhancement:
        'Classic thick, nodular, irregular peripheral ring-enhancement around an avascular, non-enhancing central necrotic core (+Gadolinium DTPA).',
      dwiAdcRestriction:
        'Restricted diffusion (bright DWI, dark ADC) within hypercellular solid viable tumor margins; facilitated diffusion within central necrotic cavity.',
      mrSpectroscopy:
        'Elevated Choline (Cho) peak (accelerated membrane phospholipid turnover), marked suppression of N-acetylaspartate (NAA, neuronal loss), Cho/NAA ratio > 2.0, with prominent Lactate/Lipid doublet peaks (anaerobic glycolysis and membrane necrosis).',
      perfusionPwi:
        'Markedly elevated relative Cerebral Blood Volume (rCBV > 1.75 to 4.0+) in hypervascular enhancing rims reflecting microvascular hyperplasia.',
      margins:
        'Indistinct, infiltrative, poorly demarcated borders blending into surrounding cerebral white matter tracts.',
      massEffect:
        'Compressive mass effect with sulcal effacement, ipsilateral lateral ventricular compression, and potentially threatening subfalcine or transtentorial herniation.',
    },
    anatomicalRiskZones: [
      'Primary Motor Cortex (Precentral Gyrus) & Corticospinal Tract (risk of hemiplegia)',
      'Dominant Left Frontal Operculum / Broca Area (risk of expressive motor aphasia)',
      'Superior/Middle Temporal Gyrus / Wernicke Area (risk of receptive sensory aphasia)',
      'Optic Radiations (Meyer loop in temporal lobe, risks contralateral homonymous superior quadrantanopia)',
    ],
    surgicalRadiotherapyApproach:
      'Maximal safe surgical resection utilizing intraoperative 5-ALA (5-aminolevulinic acid) fluorescence-guided resection, cortical neuronavigation, and intraoperative functional motor/speech mapping (awake craniotomy for eloquent zones). Followed by Stupp Protocol: Fractionated external beam radiotherapy (60 Gy in 30 fractions) with concurrent and adjuvant Temozolomide (TMZ).',
    pharmacotherapyAndSupport: [
      'Dexamethasone (4-16 mg/day with PPI gastroprotection): Rapidly stabilizes endothelial junctions to attenuate vasogenic edema',
      'Levetiracetam (Keppra 500-1500 mg BID): First-line non-enzyme-inducing anti-epileptic drug for seizure control and perioperative prophylaxis',
      'Temozolomide (TMZ): Oral alkylating chemotherapy crossing the blood-brain barrier',
      'Tumor Treating Fields (TTFields / Optune): Low-intensity alternating electric fields disrupting mitotic spindle assembly',
    ],
    differentialDiagnosis: [
      {
        condition: 'Primary CNS Lymphoma (PCNSL)',
        distinguishingFeatures: 'Periventricular deep white matter, homogeneous intense enhancement, avid DWI restriction',
        imagingDiscriminator: 'Lacks thick necrotic ring; homogeneous "dense" contrast uptake with very low ADC values throughout',
      },
      {
        condition: 'Solitary Brain Metastasis',
        distinguishingFeatures: 'Located at gray-white matter junction, disproportionately massive edema relative to small tumor nidus',
        imagingDiscriminator: 'Well-circumscribed spheroidal ring, no non-enhancing infiltrative disease beyond T2 edema rim',
      },
      {
        condition: 'Bacterial Cerebral Abscess',
        distinguishingFeatures: 'Rapid clinical progression, systemic infectious signs, fever, elevated ESR/CRP',
        imagingDiscriminator: 'Smooth, thin, collagenous enhancing rim; intense uniform DWI diffusion restriction throughout central core',
      },
      {
        condition: 'Tumefactive Demyelinating Lesion',
        distinguishingFeatures: 'Younger demyelinating cohort, multiple sclerosis history',
        imagingDiscriminator: 'Open-ring ("horseshoe") enhancement opening towards cerebral cortex; minimal mass effect relative to lesion size',
      },
    ],
    confirmatoryRecommendations: [
      'Multi-parametric MRI with 3D T1-Gadolinium isotropic volumetric acquisition, DSC-Perfusion (rCBV), and multi-voxel Proton MRS',
      'Diffusion Tensor Imaging (DTI) Tractography: Map corticospinal tract and arcuate fasciculus displacement versus axonal infiltration',
      'Urgent Neurosurgical Consultation for stereotactic needle biopsy or open craniotomy with surgical pathology',
      'Next-Generation Sequencing (NGS) molecular panel: IDH1/2 mutation, 1p/19q codeletion, MGMT promoter methylation, TERT, BRAF V600E',
    ],
  },

  Meningioma: {
    title: 'Meningioma (Extra-Axial Dural-Based Neoplasm)',
    categoryType: 'Extra-Axial Non-Glial Meningeal Tumor',
    plainLanguageSummary:
      'A meningioma is a slow-growing tumor that develops from the meninges—the protective membrane envelopes encasing the brain and spinal cord. Because it grows outside the brain substance (extra-axial), it pushes against the brain surface rather than infiltrating into brain cells. Over 80% are benign (WHO Grade 1) and many can be cured or permanently stabilized with surgical resection or precision radiosurgery.',
    whoGrading: 'WHO Grade 1 (Benign ~80-85%) to Grade 2/3 (Atypical/Malignant)',
    whoGradingDetailed:
      '2021 WHO Classification: WHO Grade 1 (Benign, ~80-85% of cases; Meningothelial, Fibrous, Transitional subtypes); WHO Grade 2 (Atypical, ~15-20%; marked by increased mitoses ≥4/10 HPF, brain invasion, or sheet-like growth); WHO Grade 3 (Anaplastic / Malignant, ~1-2%; mitoses ≥20/10 HPF or rhabdoid/papillary histology).',
    originTissue:
      'Arachnoid cap cells found within the arachnoid villi and pacchionian granulations situated along dural venous sinuses and skull base dura.',
    typicalLocations: [
      'Parasagittal and cerebral convexity dura (adjacent to superior sagittal sinus)',
      'Sphenoid wing (inner, middle, outer thirds extending toward superior orbital fissure)',
      'Olfactory groove and planum sphenoidale (anterior cranial fossa floor)',
      'Posterior fossa (petroclival junction and cerebellopontine angle)',
      'Tentorium cerebelli and falx cerebri (interhemispheric dura)',
    ],
    pathophysiology:
      'Originates from neoplastic arachnoid cap cells that multiply into an encapsulated, globular, well-circumscribed extra-axial mass. As it expands, it invades adjacent dural leaflets and stretches the overlying arachnoid membrane, creating a preserved CSF cleft between the tumor and the brain pial surface. High vascularity is supplied primarily by branches of the external carotid artery (middle meningeal artery). Often stimulates intense reactive osteoblastic proliferation in adjacent skull bone, causing hyperostosis.',
    molecularBiomarkers: [
      'NF2 (Neurofibromin 2) gene alterations / Monosomy 22q: Present in 50-60% of sporadic and convexity meningiomas',
      'TRAF7, KLF4, AKT1 mutations: Highly enriched in skull-base, secretory, and olfactory groove meningiomas',
      'SMO (Smoothened) mutations: Observed in medial anterior skull-base meningiomas',
      'TERT promoter mutation & BAP1 loss: Critical genetic markers driving high recurrence and progression to WHO Grade 3',
      'Ki-67 / MIB-1 proliferation index: Low (<3-4%) in Grade 1; elevated (≥5-10%) in Grade 2/3 variants',
    ],
    clinicalPresentation: [
      'Insidious, slowly progressing tension headaches caused by stretching of richly innervated dural pain fibers',
      'Focal epileptic seizures caused by mechanical compression and irritative gliosis on the underlying cerebral cortex',
      'Focal neurological deficits tailored to skull base location: anosmia (olfactory groove), exophthalmos / visual field loss (sphenoid wing)',
      'Cranial nerve palsies (CN V facial numbness, CN VII/VIII deficits in petroclival or CPA locations)',
      'Often discovered as an incidental finding on cranial MRI/CT performed for unrelated head trauma or migraines (~30% of cases)',
    ],
    radiologicalHallmarks: {
      t1Signal:
        'Isointense to mildly hypointense relative to adjacent cerebral gray matter cortex, demonstrating smooth, lobulated borders.',
      t2Signal:
        'Isointense to hyperintense; surrounded by a characteristic hyperintense "CSF cleft sign" separating mass from cerebral cortex.',
      flairSignal:
        'Mass remains well-defined; surrounding subcortical white matter may show variable vasogenic edema due to venous compression.',
      t2FlairSignal:
        'Isointense to hyperintense with preserved extra-axial CSF cleft and variable white matter vasogenic edema',
      contrastEnhancement:
        'Intense, rapid, and remarkably homogeneous enhancement on T1+Gadolinium with a prominent tapering "Dural Tail Sign" extending along adjacent dura.',
      dwiAdcRestriction:
        'Typically shows unrestricted or slightly facilitated diffusion on ADC; atypical/malignant variants show restricted diffusion.',
      mrSpectroscopy:
        'Marked Alanine peak at 1.48 ppm (classic metabolic fingerprint of meningioma), elevated Choline, with absent or negligible NAA and Creatine.',
      perfusionPwi:
        'Markedly elevated rCBV with rapid arterial contrast wash-in and delayed clearance, characteristic of non-blood-brain barrier dural vasculature.',
      margins:
        'Sharply demarcated, smooth, encapsulated extra-axial contour cleanly distinct from the compressed cortical ribbon.',
      massEffect:
        'Extrinsic indentation ("buckling") of adjacent cerebral cortex and white matter; mass effect is compressive rather than invasive.',
    },
    anatomicalRiskZones: [
      'Superior Sagittal Sinus & Transverse Sinuses (risk of sinus thrombosis or tumor encasement)',
      'Cavernous Sinus & Internal Carotid Artery (risk of cranial nerve palsies III, IV, V1, V2, VI)',
      'Optic Canals & Chiasm (risk of progressive visual loss and blindness)',
      'Petrous Apex & Brainstem (risk of basilar artery and lower cranial nerve impingement)',
    ],
    surgicalRadiotherapyApproach:
      'Surgical excision targeting Simpson Grade 1 (complete tumor and involved dural/bone resection) or Simpson Grade 2. For surgically inaccessible skull-base locations or residual tumors, Stereotactic Radiosurgery (SRS, e.g., Gamma Knife, CyberKnife: 12-14 Gy marginal dose) provides 90%+ 10-year local progression-free control.',
    pharmacotherapyAndSupport: [
      'Pre-operative Endovascular Embolization: Particle embolization of middle meningeal artery branches to reduce intraoperative blood loss',
      'Short-course Dexamethasone: For patients exhibiting marked peritumoral vasogenic edema prior to craniotomy',
      'Levetiracetam: Indicated when cortical irritation produces focal or generalized seizures',
      'Serial Neuroimaging Surveillance: Annual MRI surveillance for asymptomatic, small (<2 cm) incidental Grade 1 meningiomas',
    ],
    differentialDiagnosis: [
      {
        condition: 'Dural Metastasis',
        distinguishingFeatures: 'History of systemic carcinoma (breast, lung, prostate, renal cell), multi-centric dural deposits',
        imagingDiscriminator: 'Destructive calvarial erosion without hyperostosis; lack of classic Alanine peak on MRS',
      },
      {
        condition: 'Vestibular / Trigeminal Schwannoma',
        distinguishingFeatures: 'Located along CN path, non-dural centered, widens internal acoustic meatus',
        imagingDiscriminator: 'Centered on neural canal, lacks prominent dural tail sign; heterogeneously cystic on T2',
      },
      {
        condition: 'Solitary Fibrous Tumor / Hemangiopericytoma',
        distinguishingFeatures: 'Aggressive dural-based mass with higher recurrence and extracranial metastatic propensity',
        imagingDiscriminator: 'Heterogeneous enhancement with prominent internal flow voids; bony osteolysis rather than hyperostosis',
      },
      {
        condition: 'Neurosarcoidosis / Hypertrophic Pachymeningitis',
        distinguishingFeatures: 'Systemic inflammatory markers, bilateral diffuse dural thickening',
        imagingDiscriminator: 'Sheet-like nodular dural thickening rather than a solitary encapsulated globular mass',
      },
    ],
    confirmatoryRecommendations: [
      'High-Resolution Non-Contrast Bone CT of the Skull: Assess hyperostosis, osteolysis, and osseous skull base remodeling',
      'MR Venography (MRV): Evaluate patency and caliber of the superior sagittal or transverse/sigmoid dural venous sinuses',
      'Formal Neuro-Ophthalmology Visual Field Evaluation for lesions near anterior cranial fossa or sella',
      'Neurosurgical Consultation to stratify between active surgical candidate vs conservative MRI watchful waiting',
    ],
  },

  Pituitary: {
    title: 'Pituitary Neuroendocrine Tumor (PitNET / Sellar-Suprasellar Neoplasm)',
    categoryType: 'Sellar & Parasellar Endocrine Neoplasm',
    plainLanguageSummary:
      'A pituitary adenoma (or pituitary neuroendocrine tumor, PitNET) is an abnormal growth located in the sella turcica, a small bony pocket at the base of the skull directly beneath the optic nerves. These tumors are almost always benign. They can cause two main issues: hormone imbalances (over-secreting hormones like prolactin or cortisol) or visual loss (when growing upward and pressing on the optic chiasm, cutting off peripheral vision). They are frequently treated with medications or minimally invasive endoscopic nose surgery.',
    whoGrading: 'Benign Neuroendocrine Tumor (PitNET)',
    whoGradingDetailed:
      'WHO Classification of Tumors of Endocrine Organs: Benign Pituitary Neuroendocrine Tumors (PitNETs). Categorized by size: Microadenoma (<10 mm in diameter) vs Macroadenoma (≥10 mm in diameter) vs Giant Adenoma (≥40 mm). Classified clinically into Functional (hormone-secreting, ~65%) and Non-Functional (silent mass effect, ~35%).',
    originTissue:
      'Specialized epithelial hormone-producing endocrine cells of the anterior pituitary gland (adenohypophysis).',
    typicalLocations: [
      'Intrasellar Compartment (strictly confined within the bony sella turcica: typical microadenoma)',
      'Suprasellar Cistern (extending upward through diaphragmatic aperture into optic chiasm cistern)',
      'Infrasellar / Sphenoid Sinus (eroding downward through thin floor of sella into sphenoid air sinus)',
      'Lateral Parasellar / Cavernous Sinus (expanding laterally into venous plexus surrounding carotid artery)',
    ],
    pathophysiology:
      'Monoclonal expansion of anterior pituitary cells. As the lesion enlarges beyond 10 mm, it expands the sellar bowl and breaches the fibrous diaphragma sellae, ascending into the suprasellar cistern where it compresses the optic chiasm from below. Upward tension produces a classic waist-like constriction ("snowman" or "figure-of-8" appearance) at the diaphragmatic notch. Lateral growth breaches the thin medial cavernous sinus wall (Knosp classification Grades 0-4). Endocrine dysregulation results from autonomous hormone production or stalk compression ("stalk effect" hyperprolactinemia).',
    molecularBiomarkers: [
      'Pituitary Lineage Transcription Factors: Pit-1 (GH, PRL, TSH), TPIT (ACTH), SF-1 (FSH/LH, gonadotrophs)',
      'AIP (Aryl hydrocarbon receptor-interacting protein) mutations: Associated with young-onset aggressive somatotroph adenomas',
      'MEN1 (Multiple Endocrine Neoplasia Type 1) gene: Screened in familial or recurrent multi-glandular cases',
      'Ki-67 index and p53 immunoreactivity: Elevated markers suggest higher risk of aggressive regrowth',
      'Somatostatin Receptor Subtype (SSTR2/SSTR5) Expression: Predicts therapeutic response to somatostatin analogs',
    ],
    clinicalPresentation: [
      'Bitemporal Hemianopsia: Gradual loss of the outer/lateral halves of visual fields in both eyes due to chiasmatic decussating fiber compression',
      'Persistent dull frontal or retro-orbital headaches resulting from stretch on the diaphragma sellae',
      'Hyperprolactinemia Syndromes: Galactorrhea, amenorrhea, infertility, and loss of libido',
      'Growth Hormone Overproduction (Acromegaly): Enlargement of hands, feet, jaw, coarsening of facial features, hypertension, and sleep apnea',
      'ACTH Overproduction (Cushing Disease): Central adiposity, moon facies, buffalo hump, purple abdominal striae, osteoporosis',
      'Pituitary Apoplexy (Medical Emergency): Sudden excruciating headache, acute diplopia, ptosis, visual collapse, and adrenal insufficiency due to acute intratumoral hemorrhage',
    ],
    radiologicalHallmarks: {
      t1Signal:
        'Isointense to normal brain cortex; microadenomas appear as focal hypointense zones within normally enhancing gland on dynamic imaging.',
      t2Signal:
        'Isointense to moderately hyperintense; macroadenomas display classic "figure-of-8" morphology constricted at the diaphragma sellae.',
      flairSignal:
        'Suppressed CSF in basal cisterns highlights the protruding suprasellar contour of the tumor mass.',
      t2FlairSignal:
        'Isointense to moderately hyperintense sellar/suprasellar mass with waist-like constriction',
      contrastEnhancement:
        'Normal pituitary gland and infundibular stalk enhance immediately and avidly; adenomas demonstrate delayed contrast enhancement (+Gadolinium).',
      dwiAdcRestriction:
        'Typically shows facilitated diffusion; marked restriction suggests high cellularity or acute intratumoral apoplexy.',
      mrSpectroscopy:
        'Sellar bone susceptibility limits routine MRS, but elevated choline and low NAA can be identified in large suprasellar components.',
      perfusionPwi:
        'Demonstrates distinct microvascular delay compared to the rapid capillary blush of the normal anterior lobe vascular tuft.',
      margins:
        'Smooth, encapsulated, lobulated contours extending into the suprasellar and parasellar anatomical corridors.',
      massEffect:
        'Superior displacement and mechanical deformation of the optic chiasm; erosion of sellar floor; Knosp grading of cavernous sinus encasement.',
    },
    anatomicalRiskZones: [
      'Optic Chiasm & Prechiasmatic Optic Nerves (risk of irreversible bitemporal visual loss / blindness)',
      'Cavernous Sinus Internal Carotid Artery (risk of carotid encasement or intraoperative injury)',
      'Cranial Nerves III, IV, V1, V2, and VI within Cavernous Sinus (risk of ophthalmoplegia and diplopia)',
      'Hypothalamus and Third Ventricle Floor (risk of hypopituitarism, poikilothermia, and hydrocephalus in giant variants)',
    ],
    surgicalRadiotherapyApproach:
      'Endoscopic Endonasal Transsphenoidal Surgery (EETS): The modern gold standard surgical technique accessing the sella through the sphenoid sinus without opening the brain. For residual or cavernous sinus invading tumors, Fractionated Stereotactic Radiosurgery (SRS) delivers focused ionizing radiation while sparing the radiosensitive optic chiasm (restricted to <8-10 Gy to optic apparatus).',
    pharmacotherapyAndSupport: [
      'Dopamine Agonists (Cabergoline 0.25-1.0 mg twice weekly): First-line definitive medical therapy for Prolactinomas, inducing >80% tumor shrinkage without surgery',
      'Somatostatin Receptor Ligands (Octreotide LAR, Lanreotide): First-line medical therapy for GH-secreting adenomas (Acromegaly)',
      'Hydrocortisone Replacement Therapy: Urgent physiological glucocorticoid replacement if adrenal axis is suppressed or during apoplexy',
      'Levothyroxine: Thyroid hormone substitution for central hypothyroidism secondary to TSH deficiency',
    ],
    differentialDiagnosis: [
      {
        condition: 'Craniopharyngioma',
        distinguishingFeatures: 'Arises from Rathke pouch remnants, bimodal age distribution (children & older adults)',
        imagingDiscriminator: 'Predominantly suprasellar with prominent cystic components, calcifications on CT, and rim enhancement',
      },
      {
        condition: 'Rathke Cleft Cyst',
        distinguishingFeatures: 'Benign epithelial cyst inside the sella, often asymptomatic',
        imagingDiscriminator: 'Well-circumscribed, non-enhancing fluid mass; characteristic non-enhancing intracystic mucinous nodule',
      },
      {
        condition: 'Tuberculum Sellae Meningioma',
        distinguishingFeatures: 'Arises from dural roof of sphenoid/sellar anterior edge, preserves normal pituitary gland underneath',
        imagingDiscriminator: 'Intense homogeneous enhancement with classic dural tail; normal pituitary gland visualized separately below',
      },
      {
        condition: 'Lymphocytic Hypophysitis',
        distinguishingFeatures: 'Autoimmune inflammation of pituitary, often postpartum females',
        imagingDiscriminator: 'Thickened, non-tapering infundibular stalk with symmetrical triangular pituitary enlargement and rapid steroid response',
      },
    ],
    confirmatoryRecommendations: [
      'Dedicated Dynamic High-Resolution Pituitary Protocol MRI: 2 mm thin-section coronal and sagittal T1/T2 with dynamic IV gadolinium contrast',
      'Automated Humphrey 30-2 Visual Field Perimetry: Quantify baseline retinal sensitivity and visual pathway impairment',
      'Comprehensive Basal Serum Pituitary Hormonal Panel: Prolactin, IGF-1, 8 AM Cortisol & ACTH, Free T4 & TSH, LH, FSH, Testosterone/Estradiol',
      'Multidisciplinary Pituitary Center Consultation (Neurosurgery + Neuro-Endocrinology + Neuro-Ophthalmology)',
    ],
  },

  'No Tumor': {
    title: 'Normal Neurocranial Examination (Non-Neoplastic Physiological Scan)',
    categoryType: 'Physiological Neuroanatomy – Intact Brain Parenchyma',
    plainLanguageSummary:
      'This MRI scan demonstrates normal, healthy brain architecture. The neural tissue shows crisp definition between gray matter (cortex) and white matter tracts, the ventricles that circulate spinal fluid are symmetrical and unobstructed, and there is no evidence of an intracranial tumor, abnormal swelling, or blood-brain barrier disruption.',
    whoGrading: 'Not Applicable – Physiological Healthy Neuroanatomy',
    whoGradingDetailed:
      'Not Applicable – Physiological healthy neuroanatomy without evidence of WHO CNS neoplastic proliferation.',
    originTissue:
      'Normal cerebral cortex, subcortical myelinated tracts, deep basal ganglia, ventricular ependyma, and leptomeninges.',
    typicalLocations: [
      'Bilateral Cerebral Hemispheres (Frontal, Temporal, Parietal, Occipital lobes)',
      'Subcortical and Deep White Matter tracts (Centrum Semiovale, Corona Radiata, Corpus Callosum)',
      'Deep Gray Matter Nuclei (Caudate, Putamen, Globus Pallidus, Thalamus)',
      'Ventricular Cavities (Frontal, Temporal, Occipital horns of lateral ventricles, third & fourth ventricles)',
      'Posterior Fossa (Cerebellar hemispheres, vermis, midbrain, pons, medulla oblongata)',
    ],
    pathophysiology:
      'Completely intact neuroarchitecture. Endothelial tight junctions of the blood-brain barrier remain fully preserved, preventing contrast extravasation. Normal astrocytic end-feet maintain fluid homeostasis without vasogenic edema. Symmetrical cerebrospinal fluid (CSF) production, bulk flow from choroid plexuses through the foramina of Monro, Sylvian aqueduct, and Magendie/Luschka to arachnoid villi, maintaining normal physiological intracranial pressure (7-15 mmHg).',
    molecularBiomarkers: [
      'Intact wild-type genomic profile across normal neural and glial cellular populations',
      'Absence of oncogenic driver mutations (IDH1/2 wild-type in physiological context, intact 1p/19q loci, unmethylated MGMT baseline)',
      'Normal baseline neuronal metabolic markers on MRS (stable high NAA, balanced Choline and Creatine)',
      'Absence of abnormal circulating neuro-oncological liquid biopsy markers',
    ],
    clinicalPresentation: [
      'Normal neurocognitive and cranial nerve status on objective physical examination',
      'If the patient underwent imaging for headache, common benign non-structural etiologies include tension-type headaches, migraine without aura, or cervicogenic discomfort',
      'Absence of focal neurological deficits, motor weakness, or asymmetric reflex abnormalities',
      'Absence of papilledema or signs of elevated intracranial pressure',
    ],
    radiologicalHallmarks: {
      t1Signal:
        'Crisp, distinct physiological gray-white matter differentiation. Cortex exhibits expected intermediate signal while myelinated white matter is slightly hyperintense.',
      t2Signal:
        'Normal myelinated brain parenchyma with uniform high signal from fluid in subarachnoid spaces and basal cisterns.',
      flairSignal:
        'Complete physiological suppression of cerebrospinal fluid across all sulci and ventricles without abnormal periventricular hyperintensities or leukoaraiosis.',
      t2FlairSignal:
        'Complete physiological suppression of cerebrospinal fluid across all sulci and ventricles',
      contrastEnhancement:
        'Strictly physiological contrast enhancement restricted to vascular dural venous sinuses, choroid plexuses, and pituitary infundibulum (+Gadolinium).',
      dwiAdcRestriction:
        'Uniform isotropic Brownian motion across cerebral parenchyma without areas of cytotoxic diffusion restriction (ADC values normal ~0.7-0.9 x 10⁻³ mm²/s).',
      mrSpectroscopy:
        'Normal Hunter angle pattern: Prominent N-acetylaspartate (NAA) peak at 2.0 ppm indicating healthy neuronal integrity; Choline/Creatine ratio < 1.0; complete absence of Lactate/Lipid peaks.',
      perfusionPwi:
        'Symmetrical cortical and deep gray matter cerebral blood volume (CBV) and cerebral blood flow (CBF) without pathological hyperperfusion.',
      margins:
        'Pristine anatomical gyral-sulcal contours and well-preserved subarachnoid space architecture.',
      massEffect:
        'Strict midline alignment: Falx cerebri, third ventricle, and septum pellucidum aligned at 0.0 mm deviation; lateral ventricles demonstrate bilateral volumetric symmetry.',
    },
    anatomicalRiskZones: [
      'All eloquent cerebral regions (motor strip, language networks, visual cortex) are structurally intact and uncompressed',
      'Foramen of Monro and cerebral aqueduct remain fully patent with uninterrupted CSF dynamics',
      'Basal cisterns (suprasellar, ambient, quadrigeminal) show preserved volumes without effacement',
    ],
    surgicalRadiotherapyApproach:
      'No neurosurgical, oncological, or radiotherapeutic intervention is required or indicated. The neuroimaging study confirms the absence of space-occupying lesions.',
    pharmacotherapyAndSupport: [
      'No neuro-oncological medications indicated',
      'Symptomatic management of primary headaches (e.g., NSAIDs, Triptans for migraines, hydration, lifestyle optimization) under primary care guidance',
      'Reassurance provided to the patient regarding structural brain normalcy',
    ],
    differentialDiagnosis: [
      {
        condition: 'Age-Related Microvascular Ischemic Changes',
        distinguishingFeatures: 'Punctate non-enhancing T2/FLAIR hyperintensities in subcortical white matter in older adults',
        imagingDiscriminator: 'Small (<5 mm) non-space-occupying foci without mass effect, diffusion restriction, or contrast enhancement',
      },
      {
        condition: 'Normal Anatomical Variants',
        distinguishingFeatures: 'Cavum septum pellucidum, asymmetric lateral ventricle, mega cisterna magna, prominent Virchow-Robin perivascular spaces',
        imagingDiscriminator: 'Follows pure CSF signal across all sequences without surrounding signal alteration or parenchymal deformation',
      },
      {
        condition: 'Ultra-Early Ischemic Stroke (<3 Hours)',
        distinguishingFeatures: 'Acute focal neurological deficit in an emergency setting',
        imagingDiscriminator: 'Checked on emergency DWI/ADC; conventional T1/T2 may appear normal in hyperacute phase',
      },
    ],
    confirmatoryRecommendations: [
      'Correlate imaging findings with patient history, physical examination, and presenting symptoms',
      'If vascular etiology is suspected (TIA or pulsating tinnitus), consider MR Angiography (MRA) or CT Angiography of intracranial and cervical vessels',
      'No routine follow-up brain MRI necessary unless new focal neurological deficits emerge',
    ],
  },
};

export function getMriDetailedAnalysis(result: AnalysisResult): MriDetailedAnalysis {
  const normalizedClass =
    result.predicted_class in PATHOLOGY_PROFILES ? result.predicted_class : 'No Tumor';
  const pathology = PATHOLOGY_PROFILES[normalizedClass];

  // Derive secondary probability
  const sortedProbs = Object.entries(result.probabilities || {})
    .filter(([cls]) => cls.toLowerCase() !== result.predicted_class.toLowerCase())
    .sort((a, b) => b[1] - a[1]);
  const secondary = sortedProbs[0] || ['None', 0];

  const isTumor = normalizedClass !== 'No Tumor';
  const confPct = (result.confidence * 100).toFixed(2);

  // Build Sequence Matrix
  const sequenceMatrix: SequenceFinding[] = [
    {
      modality: 'T1-Weighted (Pre-Contrast)',
      acronym: 'T1w',
      signalBehavior:
        normalizedClass === 'Glioma'
          ? 'Hypointense'
          : normalizedClass === 'Meningioma'
          ? 'Isointense'
          : normalizedClass === 'Pituitary'
          ? 'Isointense'
          : 'Isointense',
      visualDescription: pathology.radiologicalHallmarks.t1Signal,
      clinicalSignificance: 'Provides primary anatomical boundaries, subcortical architecture, and identifies gross necrosis or hemorrhage.',
    },
    {
      modality: 'T2-Weighted & FLAIR',
      acronym: 'T2/FLAIR',
      signalBehavior:
        normalizedClass === 'Glioma'
          ? 'Hyperintense'
          : normalizedClass === 'Meningioma'
          ? 'Hyperintense'
          : normalizedClass === 'Pituitary'
          ? 'Hyperintense'
          : 'Suppressed',
      visualDescription: `${pathology.radiologicalHallmarks.t2Signal} · ${pathology.radiologicalHallmarks.flairSignal}`,
      clinicalSignificance: 'Maps vasogenic edema, cellular water content, infiltrative margins, and subarachnoid CSF space integrity.',
    },
    {
      modality: 'T1 Post-Contrast (+Gadolinium)',
      acronym: 'T1+C',
      signalBehavior:
        normalizedClass === 'Glioma'
          ? 'Heterogeneous'
          : normalizedClass === 'Meningioma'
          ? 'Marked Enhancement'
          : normalizedClass === 'Pituitary'
          ? 'Heterogeneous'
          : 'Suppressed',
      visualDescription: pathology.radiologicalHallmarks.contrastEnhancement,
      clinicalSignificance: 'Assesses blood-brain barrier integrity, active neoangiogenesis, and distinguishes viable tumor from necrotic tissue.',
    },
    {
      modality: 'Diffusion-Weighted Imaging & ADC',
      acronym: 'DWI / ADC',
      signalBehavior:
        normalizedClass === 'Glioma'
          ? 'Heterogeneous'
          : normalizedClass === 'Meningioma'
          ? 'Isointense'
          : normalizedClass === 'Pituitary'
          ? 'Isointense'
          : 'Isointense',
      visualDescription: pathology.radiologicalHallmarks.dwiAdcRestriction,
      clinicalSignificance: 'Quantifies cellular density and Brownian water restriction, distinguishing abscesses, high-grade tumors, and benign lesions.',
    },
    {
      modality: 'Magnetic Resonance Spectroscopy',
      acronym: '1H-MRS',
      signalBehavior:
        normalizedClass === 'Glioma'
          ? 'Heterogeneous'
          : normalizedClass === 'Meningioma'
          ? 'Heterogeneous'
          : normalizedClass === 'Pituitary'
          ? 'Isointense'
          : 'Isointense',
      visualDescription: pathology.radiologicalHallmarks.mrSpectroscopy,
      clinicalSignificance: 'Evaluates molecular metabolites (Choline/NAA and Choline/Creatine ratios, Alanine, and Lactate/Lipid peaks).',
    },
    {
      modality: 'Perfusion-Weighted Imaging',
      acronym: 'DSC-PWI',
      signalBehavior:
        normalizedClass === 'Glioma'
          ? 'Marked Enhancement'
          : normalizedClass === 'Meningioma'
          ? 'Marked Enhancement'
          : normalizedClass === 'Pituitary'
          ? 'Heterogeneous'
          : 'Suppressed',
      visualDescription: pathology.radiologicalHallmarks.perfusionPwi,
      clinicalSignificance: 'Measures relative cerebral blood volume (rCBV) to grade tumor angiogenesis and differentiate recurrence from radiation necrosis.',
    },
  ];

  // Plain-Language synthesis
  const plainExplanation =
    normalizedClass === 'Glioma'
      ? `This MRI scan was classified with ${confPct}% confidence as a Glioma. Gliomas are tumors originating inside the brain tissue itself (intra-axial). The AI model's Grad-CAM heatmap and U-Net segmentation pinpoint focal parenchymal signal heterogeneity and infiltrative borders typical of glial neoplasms. In clinical practice, this finding warrants high-priority multidisciplinary review to evaluate surgical resection safety, perform molecular testing (such as IDH mutation and MGMT methylation status), and mitigate surrounding cerebral swelling.`
      : normalizedClass === 'Meningioma'
      ? `This MRI scan was classified with ${confPct}% confidence as a Meningioma. Meningiomas are tumors that grow from the protective layers covering the brain (the meninges). Because they are extra-axial (outside the actual brain tissue), they typically push on the brain rather than invade it directly. Most meningiomas (>80%) are benign WHO Grade 1 lesions. Clinical management frequently involves either conservative periodic MRI monitoring, elective surgical resection, or targeted stereotactic radiosurgery (Gamma Knife/CyberKnife).`
      : normalizedClass === 'Pituitary'
      ? `This MRI scan was classified with ${confPct}% confidence as a Pituitary Sellar Neoplasm (PitNET). Located in the sella turcica at the skull base beneath the optic chiasm, pituitary tumors are almost always benign. They are categorized either by hormone hypersecretion (functioning adenomas) or by their compressive mass effect on vision (non-functioning macroadenomas causing bitemporal peripheral visual loss). Treatment typically involves specialized endocrine evaluation, medication (such as dopamine agonists for prolactinomas), or minimally invasive endoscopic transsphenoidal surgery.`
      : `This MRI scan was classified with ${confPct}% confidence as Normal Brain Anatomy (No Tumor Detected). The cerebral cortex, white matter tracts, deep basal ganglia, and ventricular cavities show intact structural symmetry, preserved gray-white differentiation, and strict midline alignment with 0.0 mm of shift. There is no evidence of a space-occupying neoplasm, abnormal mass effect, or vasogenic edema. Any clinical symptoms (such as headaches) should be correlated clinically with non-neoplastic primary conditions.`;

  return {
    pathology,
    plainExplanation,
    imageOrientation: 'Axial (Horizontal Plane) Transverse Slice',
    anatomicalLandmarks: [
      'Bilateral Cerebral Hemispheres (Frontal, Parietal, Temporal, Occipital cortices)',
      'Ventricular System (Frontal and occipital horns of lateral ventricles, septum pellucidum, third ventricle)',
      'Deep Gray Matter Nuclei (Caudate nucleus, putamen, globus pallidus, thalamus, internal capsule)',
      'Midline Falx Cerebri & Longitudinal Interhemispheric Fissure',
      'Calvarial Osseous Neurocranium, Diploid Space, and Scalp Soft Tissue Interface',
      'Posterior Fossa Compartment (Cerebellar folia and fourth ventricular outflow where visible)',
    ],
    sequenceMatrix,
    tissueMetrics: {
      parenchymalIntegrity: isTumor
        ? 'Focal parenchymal signal heterogeneity observed within the suspected quadrant, consistent with space-occupying cellular proliferation.'
        : 'Preserved gray-white matter differentiation throughout bilateral cerebral convexities; pristine parenchymal signal continuity.',
      ventricularSymmetry: isTumor
        ? 'Contralateral ventricular cavity remains patent; ipsilateral lateral ventricle exhibits subtle compression or sulcal effacement adjacent to mass lesion.'
        : 'Symmetrical lateral ventricles, intact septum pellucidum, and patent third ventricle without hydrocephalic dilatation or external compression.',
      midlineAssessment: isTumor
        ? 'Midline vector demonstrates localized lateralized vector; clinical monitoring recommended to assess shift against the 5.0 mm intracranial pressure threshold.'
        : 'Strict anatomic midline alignment of the falx cerebri and third ventricle; zero midline shift detected (0.0 mm displacement).',
      edemaAssessment: isTumor
        ? 'U-Net segmentation maps localized peri-lesional border correlating with altered cellular water diffusivity and vasogenic microenvironment.'
        : 'Zero vasogenic or cytotoxic edema observed; fluid-attenuated inversion recovery confirms healthy, uncompromised periventricular white matter.',
      saliencyFocus: isTumor
        ? 'Grad-CAM backpropagation focuses high-intensity activation gradients directly over the primary pathological mass contour.'
        : 'Grad-CAM gradient field remains uniformly diffuse across cortical structures without focal cluster concentration, confirming non-neoplastic baseline.',
      herniationRisk: isTumor
        ? 'Low-to-Moderate local mass effect; no acute subfalcine, uncal, or tonsillar herniation features identified on this single axial cut.'
        : 'Zero herniation risk (Intracranial compliance fully preserved; patent basal cisterns and physiological CSF flow).',
    },
    quantitativeRadiomics: {
      topClass: result.predicted_class,
      confidencePct: `${confPct}%`,
      secondaryClass: secondary[0],
      secondaryPct: `${(secondary[1] * 100).toFixed(2)}%`,
      marginSharpness:
        normalizedClass === 'Meningioma'
          ? 'Sharply Circumscribed / Well-Defined Extra-Axial Dural Cleft'
          : normalizedClass === 'Glioma'
          ? 'Irregular / Infiltrative Intra-Axial Parenchymal Margins'
          : normalizedClass === 'Pituitary'
          ? 'Lobulated Sellar-Suprasellar Margin with Diaphragmatic Notch'
          : 'Preserved Anatomic Gyral & Cortical Ribbon Margins',
      riskStratification:
        normalizedClass === 'Glioma'
          ? 'Urgent Neurosurgical Review Recommended (Infiltrative Intra-Axial Lesion)'
          : normalizedClass === 'Meningioma'
          ? 'Specialist Neurosurgical / Radiosurgical Consultation (Circumscribed Extra-Axial Mass)'
          : normalizedClass === 'Pituitary'
          ? 'Endocrine & Visual Field Evaluation Indicated (Sellar Neoplasm)'
          : 'Low / Physiological (Normal Brain MRI Baseline)',
      whoGradeClassification: pathology.whoGradingDetailed,
      urgencyLevel:
        normalizedClass === 'Glioma'
          ? 'Emergency / High Urgency'
          : normalizedClass === 'Meningioma'
          ? 'Urgent Specialist Review'
          : normalizedClass === 'Pituitary'
          ? 'Urgent Specialist Review'
          : 'Normal Physiological',
    },
  };
}
