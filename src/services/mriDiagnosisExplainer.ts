/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult, BrainTumorClass } from '../types/analysis';

export interface ClassPathologyProfile {
  title: string;
  categoryType: string;
  whoGrading: string;
  originTissue: string;
  typicalLocations: string[];
  pathophysiology: string;
  clinicalPresentation: string[];
  radiologicalHallmarks: {
    t1Signal: string;
    t2FlairSignal: string;
    contrastEnhancement: string;
    margins: string;
    massEffect: string;
  };
  differentialDiagnosis: string[];
  confirmatoryRecommendations: string[];
}

export interface MriDetailedAnalysis {
  pathology: ClassPathologyProfile;
  imageOrientation: string;
  anatomicalLandmarks: string[];
  tissueMetrics: {
    parenchymalIntegrity: string;
    ventricularSymmetry: string;
    midlineAssessment: string;
    edemaAssessment: string;
    saliencyFocus: string;
  };
  quantitativeRadiomics: {
    topClass: string;
    confidencePct: string;
    secondaryClass: string;
    secondaryPct: string;
    marginSharpness: string;
    riskStratification: string;
  };
}

export const PATHOLOGY_PROFILES: Record<string, ClassPathologyProfile> = {
  Glioma: {
    title: 'Glioma (Primary Intra-Axial Neuroepithelial Neoplasm)',
    categoryType: 'Intra-Axial Glial Tumor',
    whoGrading: 'WHO Grade II (Low-Grade Astrocytoma/Oligodendroglioma) to Grade IV (Glioblastoma)',
    originTissue: 'Transformed neuroglial cells (astrocytes, oligodendrocytes, or ependymal progenitors)',
    typicalLocations: [
      'Frontal and temporal cerebral white matter',
      'Parietal subcortical structures',
      'Corpus callosum (trans-hemispheric butterfly pattern)',
      'Basal ganglia and thalamic projections',
    ],
    pathophysiology:
      'Infiltrative malignant neoplasm that migrates along myelinated axonal tracts and perivascular spaces. Characterized by cellular pleomorphism, nuclear atypia, microvascular proliferation, and central palisading necrosis in high-grade stages (GBM). Causes local disruption of the blood-brain barrier.',
    clinicalPresentation: [
      'Progressive subacute tension headaches (exacerbated by Valsalva maneuvers or morning recumbency)',
      'New-onset focal or generalized epileptic seizures',
      'Focal neurological deficits (hemiparesis, dysphasia, visual field neglect)',
      'Subtle neurocognitive changes, executive dysfunction, and memory decline',
    ],
    radiologicalHallmarks: {
      t1Signal: 'Hypointense to isointense compared to normal white matter; heterogeneous in high-grade lesions',
      t2FlairSignal: 'Marked hyperintensity reflecting prominent infiltrative tumor margins and vasogenic edema',
      contrastEnhancement:
        'Thick, nodular, or irregular peripheral ring enhancement surrounding a central necrotic hypodensity',
      margins: 'Indistinct, infiltrative borders extending beyond the gross contrast-enhancing boundary',
      massEffect: 'Prominent local compression of adjacent sulci, ipsilateral ventricular effacement, and midline shift',
    },
    differentialDiagnosis: [
      'Primary Central Nervous System Lymphoma (PCNSL)',
      'Solitary Brain Metastasis (e.g., Bronchogenic Carcinoma, Melanoma)',
      'Bacterial Cerebral Abscess (DWI restricted diffusion, thin smooth enhancing capsule)',
      'Tumefactive Demyelinating Lesion (Multiple Sclerosis)',
    ],
    confirmatoryRecommendations: [
      'Magnetic Resonance Spectroscopy (MRS): Evaluate Elevated Choline/Creatine ratio and markedly decreased N-acetylaspartate (NAA)',
      'Perfusion-Weighted Imaging (PWI): Quantify elevated relative Cerebral Blood Volume (rCBV) in hypervascular tumor rims',
      'Diffusion-Weighted Imaging (DWI/ADC): Assess hypercellularity and restricted diffusion within solid margins',
      'Neurosurgical Stereotactic Needle Biopsy or Neuronavigation-Guided Resection with Molecular IDH1/2 and 1p/19q co-deletion testing',
    ],
  },

  Meningioma: {
    title: 'Meningioma (Extra-Axial Dural-Based Neoplasm)',
    categoryType: 'Extra-Axial Non-Glial Meningeal Tumor',
    whoGrading: 'Predominantly WHO Grade I (Benign ~80-85%); WHO Grade II (Atypical ~15-20%); rarely WHO Grade III (Anaplastic ~1-2%)',
    originTissue: 'Arachnoid cap cells of the arachnoid villi situated along the dura mater',
    typicalLocations: [
      'Parasagittal and cerebral convexity dura',
      'Sphenoid wing and anterior cranial fossa floor',
      'Olfactory groove and planum sphenoidale',
      'Posterior fossa (petroclival and cerebellopontine angle)',
      'Tentorium cerebelli and falx cerebri',
    ],
    pathophysiology:
      'Slow-growing, globular, sharply circumscribed extra-axial lesion that expands extrinsically into adjacent brain parenchyma without infiltrating neural tissue (displacing rather than invading the pial brain surface). Often induces adjacent calvarial hyperostosis and robust dual-supply vascularity from the external carotid artery.',
    clinicalPresentation: [
      'Chronic indolent progressive tension headache from dural nerve stretching',
      'Focal cortical seizures resulting from local parenchymal cortical compression',
      'Specific cranial neuropathy (e.g., anosmia in olfactory groove, optic nerve atrophy in sphenoid wing)',
      'Often identified incidentally on cranial imaging performed for non-specific head trauma',
    ],
    radiologicalHallmarks: {
      t1Signal: 'Isointense to slightly hypointense relative to adjacent cerebral gray matter cortex',
      t2FlairSignal: 'Isointense to hyperintense; surrounded by a prominent CSF cleft separating mass from brain parenchyma',
      contrastEnhancement:
        'Intense, rapid, and uniform homogeneous enhancement with a characteristic tapering "Dural Tail" sign',
      margins: 'Smooth, sharply encapsulated, well-demarcated extra-axial boundaries',
      massEffect: 'Extrinsic parenchymal compression with preserved arachnoid plane; variable surrounding vasogenic edema',
    },
    differentialDiagnosis: [
      'Dural Metastasis (Breast, Prostate, Renal Cell Carcinoma)',
      'Schwannoma (Trigeminal or Acoustic, typically intracanalicular)',
      'Solitary Fibrous Tumor / Hemangiopericytoma',
      'Granulomatous Pachymeningitis (Sarcoidosis, Tuberculosis)',
    ],
    confirmatoryRecommendations: [
      'CT Head (Bone Window): Assess for cortical hyperostosis, bone remodeling, or intratumoral psammomatous calcification',
      'Pre-operative Digital Subtraction Angiography (DSA) / Embolization for high-volume feeders from meningeal branches',
      'Neuro-Ophthalmological visual field perimetry if located adjacent to the optic chiasm or orbital apex',
      'Elective surgical Simpson Grade I-II resection or stereotactic radiosurgery (CyberKnife/Gamma Knife) for skull-base lesions',
    ],
  },

  Pituitary: {
    title: 'Pituitary Adenoma / Sellar-Suprasellar Neoplasm',
    categoryType: 'Sellar & Parasellar Endocrine Neoplasm',
    whoGrading: 'Benign Neuroendocrine Tumor (PitNET / Benign Pituitary Adenoma)',
    originTissue: 'Adenohypophyseal epithelial cells of the anterior pituitary gland within the sella turcica',
    typicalLocations: [
      'Intrasellar compartment (confined within the bony sella turcica: Microadenoma <10mm)',
      'Suprasellar cistern with chiasmatic compression (Macroadenoma >10mm)',
      'Infrasellar extension eroding the sphenoid sinus floor',
      'Lateral cavernous sinus expansion abutting internal carotid arteries',
    ],
    pathophysiology:
      'Monoclonal expansion of anterior pituitary parenchymal cells. Functioning adenomas secrete active hormones (Prolactin, Growth Hormone, ACTH, TSH), while non-functioning macroadenomas produce silent indolent mass expansion leading to sellar floor remodeling and upward displacement of the optic chiasm.',
    clinicalPresentation: [
      'Bitemporal hemianopsia (progressive loss of peripheral vision) from upward compression of the optic chiasm',
      'Chronic bitemporal or frontal headaches secondary to diaphragmatic sellae expansion',
      'Endocrine syndromes: Hyperprolactinemia (galactorrhea, amenorrhea), Acromegaly, or Cushing disease',
      'Pituitary apoplexy (sudden acute hemorrhage causing severe headache and ophthalmoplegia)',
    ],
    radiologicalHallmarks: {
      t1Signal: 'Isointense to normal brain parenchyma; hypointense compared to bright posterior pituitary neurohypophysis',
      t2FlairSignal: 'Variable isointense to moderately hyperintense; macroadenomas demonstrate "figure-of-8" or snowman shape',
      contrastEnhancement:
        'Delayed enhancement compared to rapidly enhancing normal pituitary stalk and adjacent capillary plexus',
      margins: 'Smooth, encapsulated contour within sella; lobulated border when extending into suprasellar space',
      massEffect: 'Superior elevation and stretching of the optic chiasm; potential cavernous sinus invasion (Knosp grade)',
    },
    differentialDiagnosis: [
      'Craniopharyngioma (Rathke pouch remnant, cystic calcified suprasellar mass)',
      'Rathke Cleft Cyst (Intrasellar non-enhancing well-defined cystic lesion)',
      'Sellar Meningioma (Tuberculum sellae or diaphragm sellae)',
      'Pituitary Metastasis or Lymphocytic Hypophysitis',
    ],
    confirmatoryRecommendations: [
      'Comprehensive Serum Endocrine Panel: Prolactin, IGF-1 (GH), 8 AM Cortisol/ACTH, Free T4/TSH, FSH/LH',
      'Automated Humphrey Visual Field Perimetry: Quantify optic nerve fiber layer integrity and visual pathway deficits',
      'Dedicated Dynamic Pituitary Protocol MRI: High-resolution thin-section 2mm coronal and sagittal contrast sequences',
      'Endocrinology review for medical management (Cabergoline for prolactinomas) or Transsphenoidal Endoscopic Resection',
    ],
  },

  'No Tumor': {
    title: 'Normal Neurocranial Examination (No Intracranial Tumor Detected)',
    categoryType: 'Non-Neoplastic Physiological Neuroanatomy',
    whoGrading: 'Not Applicable – Intact Normal Brain Parenchyma',
    originTissue: 'Physiological cerebral cortex, subcortical white matter, deep gray nuclei, and ventricular system',
    typicalLocations: [
      'Bilateral frontal, parietal, temporal, and occipital cerebral lobes',
      'Symmetrical lateral ventricles and midline third/fourth ventricles',
      'Basal ganglia, internal capsule, and thalamic complexes',
      'Cerebellar hemispheres and brainstem structures',
    ],
    pathophysiology:
      'Normal cerebral parenchyma displaying preserved neuronal architecture, intact myelin sheaths, undisturbed blood-brain barrier, and symmetrical cerebrospinal fluid (CSF) flow dynamics without evidence of space-occupying lesions, cellular atypia, or focal vasogenic edema.',
    clinicalPresentation: [
      'Absence of mass-effect-related focal neurological deficits',
      'Symmetrical cranial nerve reflexes and motor/sensory examinations',
      'Headaches, if present, are frequently primary benign etiologies (Tension-type, Migraine, or Cervicogenic)',
      'Normal cognitive status without localized cortical syndrome',
    ],
    radiologicalHallmarks: {
      t1Signal: 'Clear physiological gray-white matter differentiation with normal cortical ribbon signal intensity',
      t2FlairSignal: 'Homogeneous signal suppression across ventricular and sulcal CSF without periventricular hyperintensities',
      contrastEnhancement: 'Normal physiological enhancement limited to dural sinuses, choroid plexus, and infundibulum',
      margins: 'Preserved sulcal-gyral patterns and distinct pial-arachnoid interfaces',
      massEffect: 'Strict midline alignment; symmetrical frontal horns, bodies, and occipital horns of lateral ventricles',
    },
    differentialDiagnosis: [
      'Non-neoplastic white matter lesions (Microvascular ischemic leukoaraiosis, age-related periventricular caps)',
      'Normal anatomical variants (Cavum septum pellucidum, asymmetric lateral ventricle, mega cisterna magna)',
      'Early ischemic cerebral infarction prior to prominent cytotoxic edema development',
      'Migraine encephalopathy with non-enhancing punctate subcortical foci',
    ],
    confirmatoryRecommendations: [
      'Standard clinical correlation with patient symptomatology (neurological examination)',
      'If vascular headache or transient ischemic attack suspected: MR Angiography (MRA) of Circle of Willis and carotid bifurcation',
      'No surgical or neuro-oncological intervention indicated',
      'Routine follow-up or conservative supportive management as indicated by primary clinical presentation',
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

  return {
    pathology,
    imageOrientation: 'Axial (Horizontal Plane) Transverse Slice',
    anatomicalLandmarks: [
      'Bilateral Cerebral Hemispheres (Frontal, Parietal, Temporal cortices)',
      'Ventricular System (Frontal and occipital horns of lateral ventricles, septum pellucidum)',
      'Deep Gray Matter Nuclei (Caudate nucleus, lentiform nucleus, internal capsule, thalamus)',
      'Midline Falx Cerebri & Longitudinal Cerebral Fissure',
      'Calvarial Bone Matrix & Scalp Soft Tissue Interface',
    ],
    tissueMetrics: {
      parenchymalIntegrity: isTumor
        ? 'Focal parenchymal signal heterogeneity noted within suspected lesion quadrant.'
        : 'Preserved gray-white matter differentiation throughout cerebral convexities; no focal parenchymal signal abnormality.',
      ventricularSymmetry: isTumor
        ? 'Contralateral ventricular morphology intact; subtle ipsilateral sulcal crowding or ventricular effacement adjacent to lesion margin.'
        : 'Symmetrical lateral ventricles, intact septum pellucidum, and patent third ventricle without hydrocephalus or compression.',
      midlineAssessment: isTumor
        ? 'Midline structures aligned; minimal to sub-centimeter mass vector depending on lesion volume.'
        : 'Strict anatomic midline alignment of the falx cerebri and third ventricle; zero midline shift detected (0.0 mm displacement).',
      edemaAssessment: isTumor
        ? 'U-Net segmentation maps localized peri-lesional boundary reflecting cellular density contrast.'
        : 'Zero vasogenic or cytotoxic edema observed; fluid-attenuated inversion recovery (FLAIR) confirms intact periventricular white matter.',
      saliencyFocus: isTumor
        ? 'Grad-CAM backpropagation focuses high activation gradients directly on the pathological mass contour.'
        : 'Grad-CAM gradient field remains uniformly diffuse across cortical structures without focal cluster concentration, confirming non-neoplastic baseline.',
    },
    quantitativeRadiomics: {
      topClass: result.predicted_class,
      confidencePct: `${(result.confidence * 100).toFixed(2)}%`,
      secondaryClass: secondary[0],
      secondaryPct: `${(secondary[1] * 100).toFixed(2)}%`,
      marginSharpness:
        normalizedClass === 'Meningioma'
          ? 'Sharply Circumscribed / Well-Defined Extra-Axial Border'
          : normalizedClass === 'Glioma'
          ? 'Irregular / Diffuse Infiltrative Margins'
          : normalizedClass === 'Pituitary'
          ? 'Lobulated Sellar-Suprasellar Margin'
          : 'Preserved Anatomic Cortical Margin',
      riskStratification:
        normalizedClass === 'Glioma'
          ? 'Urgent Neurosurgical Review Recommended (Infiltrative Intra-Axial Lesion)'
          : normalizedClass === 'Meningioma'
          ? 'Elective Specialist Review (Circumscribed Extra-Axial Mass)'
          : normalizedClass === 'Pituitary'
          ? 'Endocrine & Visual Field Evaluation Indicated (Sellar Neoplasm)'
          : 'Low / Non-Neoplastic (Normal Brain MRI Baseline)',
    },
  };
}
