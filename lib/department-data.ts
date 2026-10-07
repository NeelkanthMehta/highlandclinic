import {
  Heart,
  Brain,
  Stethoscope,
  Bone,
  Eye,
  Activity,
  Sparkles,
  Smile,
  LucideIcon,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Calendar,
  PhoneCall,
  FileText,
} from "lucide-react";

export interface ClinicalProcedure {
  title: string;
  description: string;
  duration?: string;
  category?: string;
}

export interface DepartmentFacility {
  title: string;
  description: string;
}

export interface DepartmentFAQ {
  question: string;
  answer: string;
}

export interface DepartmentMetadata {
  slug: string;
  dbName: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  icon: LucideIcon;
  location: string;
  hours: string;
  phone: string;
  email: string;
  emergencyExtension: string;
  keyStats: {
    stat: string;
    label: string;
  }[];
  specializations: string[];
  conditionsTreated: string[];
  procedures: ClinicalProcedure[];
  facilities: DepartmentFacility[];
  faqs: DepartmentFAQ[];
}

export const DEPARTMENT_METADATA_MAP: Record<string, DepartmentMetadata> = {
  cardiology: {
    slug: "cardiology",
    dbName: "Cardiology",
    title: "Cardiology Department",
    tagline: "Comprehensive Cardiovascular Care, Advanced Diagnostics, & Heart Health Center",
    description:
      "The Cardiology Department at Highland Medical Center provides state-of-the-art diagnostic, preventive, and interventional cardiac services. Our team of board-certified cardiologists utilizes cutting-edge medical technology to diagnose and treat complex heart conditions with compassionate, personalized patient care.",
    iconName: "Heart",
    icon: Heart,
    location: "100 Medical Center Way, Suite 400, Highland, CA",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM | Sat: 9:00 AM - 1:00 PM (Emergency 24/7)",
    phone: "(555) 123-4567 ext. 400",
    email: "cardiology@highland.med",
    emergencyExtension: "24/7 Cardiac Emergency: Option 1",
    keyStats: [
      { stat: "14+", label: "Years Clinical Excellence" },
      { stat: "4.9/5", label: "Patient Rating Average" },
      { stat: "24/7", label: "Emergency Cardiac Triage" },
      { stat: "100%", label: "Board Certified Specialists" },
    ],
    specializations: [
      "Preventive Cardiology & Risk Assessment",
      "Interventional Cardiology",
      "Heart Failure & Cardiomyopathy Management",
      "Non-Invasive Cardiac Imaging (Echocardiography, CT)",
      "Electrophysiology & Arrhythmia Treatment",
      "Vascular & Peripheral Artery Disease",
    ],
    conditionsTreated: [
      "Coronary Artery Disease (CAD)",
      "Hypertension (High Blood Pressure)",
      "Congestive Heart Failure",
      "Atrial Fibrillation & Arrhythmia",
      "Hyperlipidemia (High Cholesterol)",
      "Valvular Heart Disease",
      "Angina & Chest Pain Evaluation",
    ],
    procedures: [
      {
        title: "Electrocardiogram (ECG / EKG)",
        description: "Quick, non-invasive recording of heart electrical activity to diagnose arrhythmias, ischemia, and structural heart changes.",
        duration: "15 - 20 mins",
        category: "Diagnostic",
      },
      {
        title: "Transthoracic Echocardiogram (TTE)",
        description: "High-resolution ultrasound imaging to evaluate cardiac chamber dimensions, valve function, ejection fraction, and wall motion.",
        duration: "45 mins",
        category: "Imaging",
      },
      {
        title: "Exercise Stress Testing & Nuclear Imaging",
        description: "Evaluates coronary blood flow and exercise tolerance during controlled treadmill activity paired with continuous ECG monitoring.",
        duration: "60 mins",
        category: "Diagnostic",
      },
      {
        title: "Holter & Ambulatory Rhythm Monitoring",
        description: "Continuous 24 to 48-hour wearable monitoring to detect transient palpitations, syncope, and occult atrial fibrillation.",
        duration: "24-48 hours",
        category: "Monitoring",
      },
      {
        title: "Coronary Angiography & Cardiac Catheterization",
        description: "Minimally invasive diagnostic procedure to visualize coronary artery blockages and guide angioplasty or stent placement.",
        duration: "1 - 2 hours",
        category: "Interventional",
      },
    ],
    facilities: [
      {
        title: "Cardiac Catheterization & Angiography Lab",
        description: "Equipped with flat-panel digital fluoroscopy for real-time arterial imaging and precision endovascular procedures.",
      },
      {
        title: "Non-Invasive Echo & Vascular Diagnostics Suite",
        description: "Features 3D speckle-tracking echocardiography machines and carotid Doppler diagnostic tools.",
      },
      {
        title: "Intensive Cardiac Care Unit (ICCU)",
        description: "Dedicated 12-bed unit offering continuous hemodynamic monitoring for acute cardiac admissions.",
      },
      {
        title: "24/7 Rapid Chest Pain Triage Unit",
        description: "Immediate bedside troponin testing and emergency ECG analysis for acute coronary syndromes.",
      },
    ],
    faqs: [
      {
        question: "Do I need a referral from a primary care doctor to book a cardiology consultation?",
        answer: "While self-referrals are accepted for many routine visits, certain insurance providers require a primary care referral for specialist coverage. We recommend checking with your insurance provider prior to your visit.",
      },
      {
        question: "How should I prepare for a treadmill cardiac stress test?",
        answer: "Please wear comfortable walking shoes and loose-fitting athletic attire. Avoid caffeine, heavy meals, and tobacco for at least 4 hours before the test. Your cardiologist will advise if any medications should be temporarily paused.",
      },
      {
        question: "What items should I bring to my first appointment?",
        answer: "Please bring a photo ID, your current insurance card, a list of all current prescription and over-the-counter medications, and any recent ECGs, lab reports, or records from previous doctors.",
      },
      {
        question: "How quickly can I get the results of my echocardiogram or Holter monitor?",
        answer: "Preliminary results are often reviewed during your visit. Complete official reports are finalized by our board-certified cardiologists within 24 to 48 hours and uploaded directly to your patient portal.",
      },
    ],
  },
  neurology: {
    slug: "neurology",
    dbName: "Neurology",
    title: "Neurology Department",
    tagline: "Advanced Brain & Nervous System Care, Stroke Response, & Neuro-Rehabilitation",
    description:
      "Highland Medical Center's Neurology Department specializes in the diagnosis, management, and treatment of complex disorders affecting the brain, spinal cord, peripheral nerves, and neuromuscular system. Our multidisciplinary team combines advanced neuro-imaging with evidence-based therapies.",
    iconName: "Brain",
    icon: Brain,
    location: "100 Medical Center Way, Suite 402, Highland, CA",
    hours: "Monday - Friday: 8:30 AM - 4:30 PM | Saturday by Appointment",
    phone: "(555) 123-4567 ext. 402",
    email: "neurology@highland.med",
    emergencyExtension: "Stroke Response Triage: Option 2",
    keyStats: [
      { stat: "16+", label: "Years Specialized Experience" },
      { stat: "4.8/5", label: "Patient Satisfaction Score" },
      { stat: "Rapid", label: "Emergency Stroke Response" },
      { stat: "PhD/MD", label: "Subspecialist Leadership" },
    ],
    specializations: [
      "Acute Stroke Intervention & Prevention",
      "Movement Disorders (Parkinson's Disease, Tremors)",
      "Epilepsy & Seizure Disorders",
      "Headache & Facial Pain Medicine",
      "Neuromuscular Disorders & Neuropathy",
      "Cognitive Neurology & Memory Disorders",
    ],
    conditionsTreated: [
      "Ischemic & Hemorrhagic Stroke",
      "Parkinson's Disease & Dystonia",
      "Epilepsy & Unexplained Seizures",
      "Migraines & Chronic Daily Headaches",
      "Multiple Sclerosis (MS)",
      "Peripheral Neuropathy & Sciatica",
      "Mild Cognitive Impairment & Dementia",
    ],
    procedures: [
      {
        title: "Digital Electroencephalogram (EEG)",
        description: "Measures electrical activity in the brain to diagnose epilepsy, encephalopathy, and sleep disturbance.",
        duration: "45 - 60 mins",
        category: "Diagnostic",
      },
      {
        title: "Electromyography (EMG) & Nerve Conduction Velocity (NCV)",
        description: "Evaluates peripheral nerve function and muscular response to identify nerve compression or neuropathy.",
        duration: "45 mins",
        category: "Diagnostic",
      },
      {
        title: "High-Field Brain & Spine MRI Review",
        description: "Detailed structural neuro-imaging analysis for stroke lesions, MS plaques, and nerve root compression.",
        duration: "30 mins",
        category: "Imaging",
      },
      {
        title: "Therapeutic Botox Injection for Chronic Migraine",
        description: "Targeted pericranial injections for patients suffering from chronic daily headaches resistant to oral medications.",
        duration: "30 mins",
        category: "Therapeutic",
      },
    ],
    facilities: [
      {
        title: "Comprehensive Stroke Triage Center",
        description: "Dedicated rapid-assessment protocol with instant neuro-vascular imaging and emergency thrombolysis coordination.",
      },
      {
        title: "Video-EEG Epilepsy Monitoring Unit",
        description: "Specialized monitoring suite designed for long-term continuous brain activity evaluation.",
      },
      {
        title: "Neuro-Rehabilitation & Gait Laboratory",
        description: "Integrated physical and occupational therapy facility for stroke recovery and movement disorders.",
      },
    ],
    faqs: [
      {
        question: "When should someone seek emergency care for neurological symptoms?",
        answer: "Seek IMMEDIATE emergency medical attention if you experience sudden face drooping, arm weakness, speech difficulty (FAST), sudden severe headache, sudden vision loss, or confusion.",
      },
      {
        question: "What occurs during an initial neurological examination?",
        answer: "Your neurologist will assess mental status, cranial nerve function, motor strength, sensation, reflexes, balance, and coordination to pinpoint the source of symptoms.",
      },
      {
        question: "Are EMG/NCV tests painful?",
        answer: "EMG/NCV tests involve mild electrical pulses and fine needle insertions. Most patients describe slight tingling or brief discomfort, which subsides immediately after testing.",
      },
    ],
  },
  pediatrics: {
    slug: "pediatrics",
    dbName: "Pediatrics",
    title: "Pediatrics Department",
    tagline: "Compassionate Healthcare for Infants, Children, & Adolescents",
    description:
      "Highland Medical Center's Pediatrics Department is dedicated to nurturing the health and development of young patients from newborn infancy through adolescence. We offer well-child checks, vaccinations, acute illness care, and specialized pediatric allergy and asthma management in a warm, child-friendly environment.",
    iconName: "Stethoscope",
    icon: Stethoscope,
    location: "100 Medical Center Way, Suite 301, Highland, CA",
    hours: "Monday - Friday: 8:00 AM - 5:30 PM | Sat: 8:30 AM - 12:30 PM",
    phone: "(555) 123-4567 ext. 301",
    email: "pediatrics@highland.med",
    emergencyExtension: "Pediatric Urgent Line: Option 3",
    keyStats: [
      { stat: "5.0/5", label: "Top-Rated Pediatric Care" },
      { stat: "200+", label: "Verified 5-Star Reviews" },
      { stat: "Child", label: "Friendly Clinical Environment" },
      { stat: "FAAP", label: "Certified Pediatric Physicians" },
    ],
    specializations: [
      "Newborn Care & Infant Development",
      "Pediatric Asthma & Respiratory Care",
      "Childhood Allergy & Immunology",
      "Adolescent Medicine & Growth Evaluation",
      "Pediatric Immunizations & Preventive Health",
      "Behavioral & Developmental Screening",
    ],
    conditionsTreated: [
      "Pediatric Asthma & Bronchiolitis",
      "Ear Infections (Otitis Media)",
      "Childhood Allergies & Eczema",
      "Developmental Delays & ADHD Evaluation",
      "Common Viral & Bacterial Infections",
      "Nutritional & Growth Disorders",
    ],
    procedures: [
      {
        title: "Well-Child Developmental Examinations",
        description: "Comprehensive growth, vision, hearing, and motor skills assessment tailored for every milestone age.",
        duration: "30 mins",
        category: "Preventive",
      },
      {
        title: "CDC-Scheduled Pediatric Immunizations",
        description: "Safe, scheduled childhood vaccines administered in a gentle, comforting environment.",
        duration: "15 mins",
        category: "Vaccination",
      },
      {
        title: "Pediatric Spirometry & Asthma Management",
        description: "Child-friendly lung function testing and customized action plans for childhood asthma.",
        duration: "30 mins",
        category: "Respiratory",
      },
    ],
    facilities: [
      {
        title: "Child-Friendly Consultation Rooms",
        description: "Vibrant, calming clinical suites equipped with sensory-soothing equipment and pediatric vitals monitoring.",
      },
      {
        title: "Dedicated Newborn & Well-Baby Clinic",
        description: "Isolated clean area for infant weigh-ins, lactation support, and initial newborn checkups.",
      },
    ],
    faqs: [
      {
        question: "At what ages should my child have routine well-child visits?",
        answer: "Recommended well-child visits occur at 3-5 days after birth, and at 1, 2, 4, 6, 9, 12, 15, 18, and 24 months, followed by annual visits from age 3 onward.",
      },
      {
        question: "Can I get same-day appointments for acute sick visits?",
        answer: "Yes, we reserve morning and afternoon same-day slots for acute illnesses such as high fever, ear pain, asthma flare-ups, or severe coughs.",
      },
    ],
  },
  orthopedics: {
    slug: "orthopedics",
    dbName: "Orthopedics",
    title: "Orthopedic Surgery & Joint Center",
    tagline: "Advanced Bone Health, Joint Replacement, & Sports Medicine",
    description:
      "The Orthopedic Surgery Department at Highland Medical Center provides expert care for musculoskeletal injuries, joint degeneration, sports trauma, and spinal conditions. Utilizing minimally invasive arthroscopic and robotic surgical techniques, we help patients regain mobility, eliminate pain, and return to an active lifestyle.",
    iconName: "Bone",
    icon: Bone,
    location: "100 Medical Center Way, Suite 505, Highland, CA",
    hours: "Monday - Thursday: 7:30 AM - 4:30 PM | Friday: 8:00 AM - 3:30 PM",
    phone: "(555) 123-4567 ext. 505",
    email: "orthopedics@highland.med",
    emergencyExtension: "Orthopedic Trauma Desk: Option 4",
    keyStats: [
      { stat: "15+", label: "Years Surgical Expertise" },
      { stat: "4.9/5", label: "Patient Satisfaction" },
      { stat: "Robotic", label: "Precision Joint Technology" },
      { stat: "FAAOS", label: "Board Certified Surgeons" },
    ],
    specializations: [
      "Minimally Invasive Joint Replacement (Hip & Knee)",
      "Sports Medicine & Arthroscopic Surgery",
      "Rotator Cuff & Shoulder Reconstruction",
      "ACL & Meniscus Repair",
      "Fracture Care & Musculoskeletal Trauma",
      "Hand, Wrist, & Carpal Tunnel Surgery",
    ],
    conditionsTreated: [
      "Hip & Knee Osteoarthritis",
      "Torn Ligaments (ACL, MCL, PCL)",
      "Rotator Cuff & Shoulder Tendonitis",
      "Bone Fractures & Dislocations",
      "Carpal Tunnel Syndrome & Trigger Finger",
      "Spinal Stenosis & Sciatica",
    ],
    procedures: [
      {
        title: "Total & Partial Joint Replacement",
        description: "State-of-the-art hip and knee implants designed for rapid recovery and natural joint articulation.",
        duration: "1 - 2 hours",
        category: "Surgical",
      },
      {
        title: "Diagnostic & Therapeutic Knee/Shoulder Arthroscopy",
        description: "Minimally invasive keyhole surgery to repair torn cartilage, ligaments, or loose bodies.",
        duration: "45 - 90 mins",
        category: "Surgical",
      },
      {
        title: "Ultrasound-Guided Joint Injections",
        description: "Targeted corticosteroid or viscosupplementation injections for arthritis pain relief.",
        duration: "20 mins",
        category: "Non-Surgical",
      },
    ],
    facilities: [
      {
        title: "Motion Analysis & Rehabilitation Physical Therapy Suite",
        description: "Equipped with body-weight support systems, resistance stations, and specialized physical recovery gear.",
      },
      {
        title: "Digital Orthopedic X-Ray & Imaging Hub",
        description: "Immediate high-resolution musculoskeletal X-rays available directly in the consultation room.",
      },
    ],
    faqs: [
      {
        question: "How long is the recovery period after knee or hip replacement?",
        answer: "Most patients walk with assistance the same day of surgery. Full return to normal daily activities usually takes 4 to 8 weeks with dedicated physical therapy.",
      },
      {
        question: "Are non-surgical treatment options explored first?",
        answer: "Absolutely. We emphasize conservative care first, including physical therapy, anti-inflammatory regimens, activity modification, and targeted injections before recommending surgery.",
      },
    ],
  },
  ophthalmology: {
    slug: "ophthalmology",
    dbName: "Ophthalmology",
    title: "Ophthalmology & Vision Center",
    tagline: "Comprehensive Eye Care, Cataract Surgery, & Laser Diagnostics",
    description:
      "Highland Medical Center's Ophthalmology Department delivers comprehensive medical and surgical eye care. From routine vision screening to advanced micro-incision cataract surgery and macular degeneration therapies, our clinic protects and preserves your sight using state-of-the-art optical diagnostic systems.",
    iconName: "Eye",
    icon: Eye,
    location: "100 Medical Center Way, Suite 205, Highland, CA",
    hours: "Monday - Friday: 8:30 AM - 4:30 PM",
    phone: "(555) 123-4567 ext. 205",
    email: "eye@highland.med",
    emergencyExtension: "Eye Triage Line: Option 5",
    keyStats: [
      { stat: "100%", label: "Micro-Incision Laser Tech" },
      { stat: "4.9/5", label: "Patient Rating" },
      { stat: "OCT", label: "High-Res Retina Scans" },
      { stat: "Care", label: "Comprehensive Vision Clinic" },
    ],
    specializations: [
      "Micro-Incision Cataract Surgery & Premium IOLs",
      "Glaucoma Diagnosis & Pressure Management",
      "Diabetic Retinopathy & Macular Degeneration",
      "Corneal Disorders & Dry Eye Clinic",
      "Refractive & Laser Vision Correction",
      "Comprehensive Eye Exams & Optical Prescriptions",
    ],
    conditionsTreated: [
      "Cataracts & Lens Clouding",
      "Glaucoma & High Intraocular Pressure",
      "Age-Related Macular Degeneration (AMD)",
      "Diabetic Eye Disease",
      "Dry Eye Syndrome & Blepharitis",
      "Refractive Errors (Myopia, Hyperopia, Astigmatism)",
    ],
    procedures: [
      {
        title: "Optical Coherence Tomography (OCT) Retina Scan",
        description: "Cross-sectional laser scanning of retina layers for early macular disease and glaucoma detection.",
        duration: "20 mins",
        category: "Diagnostic",
      },
      {
        title: "Micro-Incision Cataract Extraction with Premium Lens",
        description: "Outpatient ultrasound phacoemulsification replacing cloudy lenses with clear intraocular lenses.",
        duration: "30 mins",
        category: "Surgical",
      },
      {
        title: "SLT & YAG Ophthalmic Laser Therapy",
        description: "Targeted laser treatment for open-angle glaucoma pressure reduction and posterior capsulotomy.",
        duration: "15 mins",
        category: "Laser",
      },
    ],
    facilities: [
      {
        title: "Ophthalmic Surgical Laser Suite",
        description: "Features femtosecond laser technology and intraoperative microscope systems for sub-millimeter surgical accuracy.",
      },
      {
        title: "Digital Corneal & Retinal Diagnostic Imaging Suite",
        description: "High-speed OCT scanners, visual field analyzers, and digital fundus photography cameras.",
      },
    ],
    faqs: [
      {
        question: "How often should adults get a comprehensive eye exam?",
        answer: "Adults under 40 should be examined every 2 years. Adults 40 and older, or those with diabetes or hypertension, should undergo annual dilated eye exams.",
      },
      {
        question: "Is cataract surgery painful?",
        answer: "No. Cataract surgery is performed under topical anesthetic drops and mild sedation. Patients feel no pain during the 15-minute outpatient procedure.",
      },
    ],
  },
  "general-medicine": {
    slug: "general-medicine",
    dbName: "General Medicine",
    title: "General & Internal Medicine",
    tagline: "Primary Care, Chronic Disease Management, & Preventive Wellness",
    description:
      "The General & Internal Medicine Department serves as the foundational healthcare home for adult patients at Highland Medical Center. We emphasize holistic preventive wellness, routine health screening, and expert coordination for chronic medical conditions such as diabetes, hypertension, and high cholesterol.",
    iconName: "Activity",
    icon: Activity,
    location: "100 Medical Center Way, Suite 101, Highland, CA",
    hours: "Monday - Friday: 8:00 AM - 6:00 PM | Sat: 9:00 AM - 2:00 PM",
    phone: "(555) 123-4567 ext. 101",
    email: "internalmed@highland.med",
    emergencyExtension: "General Care Desk: Option 6",
    keyStats: [
      { stat: "4.8/5", label: "Patient Trust Rating" },
      { stat: "Full", label: "Comprehensive Primary Care" },
      { stat: "On-site", label: "Diagnostic Laboratory" },
      { stat: "FACP", label: "Board Certified Internists" },
    ],
    specializations: [
      "Adult Primary Care & Executive Physicals",
      "Chronic Disease Management (Diabetes, Hypertension)",
      "Cardiovascular Risk Factor Control",
      "Preventive Cancer & Metabolic Screenings",
      "Immunizations & Adult Health Maintenance",
      "Geriatric Health & Multi-Condition Care",
    ],
    conditionsTreated: [
      "Type 2 Diabetes Mellitus",
      "Essential Hypertension",
      "Hypercholesterolemia & Metabolic Syndrome",
      "Upper Respiratory Infections & Bronchitis",
      "Thyroid Hypo/Hyperfunction",
      "Gastroesophageal Reflux Disease (GERD)",
    ],
    procedures: [
      {
        title: "Annual Executive Physical Examination",
        description: "Thorough head-to-toe physical, ECG, metabolic blood panel, lipid profile, and lifestyle risk assessment.",
        duration: "45 mins",
        category: "Preventive",
      },
      {
        title: "Comprehensive Diabetic & Metabolic Monitoring",
        description: "HbA1c testing, kidney function screening, peripheral nerve checks, and personalized blood sugar plans.",
        duration: "30 mins",
        category: "Chronic Care",
      },
    ],
    facilities: [
      {
        title: "CLIA-Certified Rapid Blood Laboratory",
        description: "On-site blood draw and processing laboratory providing same-day metabolic and CBC results.",
      },
      {
        title: "Preventive Health & Lifestyle Consultation Suite",
        description: "Dedicated space for nutritional counseling, smoking cessation, and weight management.",
      },
    ],
    faqs: [
      {
        question: "How frequently should I have routine blood work performed?",
        answer: "Healthy adults should have baseline blood work annually. Patients managing chronic conditions like diabetes or high cholesterol may need testing every 3 to 6 months.",
      },
      {
        question: "What is the difference between General Medicine and urgent care?",
        answer: "General Medicine provides ongoing, continuous long-term care, preventive screening, and relationship-based health management, whereas urgent care addresses immediate non-life-threatening illnesses.",
      },
    ],
  },
  dermatology: {
    slug: "dermatology",
    dbName: "Dermatology",
    title: "Dermatology Department",
    tagline: "Medical Dermatology, Skin Cancer Screening, & Skin Health",
    description:
      "Highland Medical Center's Dermatology Department offers comprehensive medical, surgical, and cosmetic skin care. Our board-certified dermatologists treat skin cancer, acne, eczema, psoriasis, and complex dermatological conditions using advanced laser therapy and precise surgical excision.",
    iconName: "Sparkles",
    icon: Sparkles,
    location: "100 Medical Center Way, Suite 210, Highland, CA",
    hours: "Monday - Friday: 8:30 AM - 5:00 PM",
    phone: "(555) 123-4567 ext. 210",
    email: "dermatology@highland.med",
    emergencyExtension: "Urgent Skin Triage: Option 7",
    keyStats: [
      { stat: "4.9/5", label: "Patient Rating" },
      { stat: "130+", label: "Verified Reviews" },
      { stat: "Full-Body", label: "Skin Cancer Screening" },
      { stat: "FAAD", label: "Board Certified Specialists" },
    ],
    specializations: [
      "Full-Body Skin Cancer & Melanoma Screening",
      "Acne, Rosacea, & Inflammatory Skin Care",
      "Eczema, Psoriasis, & Autoimmune Dermatology",
      "Surgical Excision of Moles & Skin Lesions",
      "Laser Therapy & Phototherapy",
      "Cosmetic Skin Rejuvenation & Anti-Aging",
    ],
    conditionsTreated: [
      "Basal & Squamous Cell Carcinoma, Melanoma",
      "Severe Acne Vulgaris & Cystic Acne",
      "Atopic Dermatitis (Eczema) & Psoriasis",
      "Rosacea & Facial Erythema",
      "Contact Dermatitis & Hives",
      "Alopecia & Hair Loss Disorders",
    ],
    procedures: [
      {
        title: "Full-Body Dermoscopic Skin Examination",
        description: "High-magnification dermoscopy inspecting every mole and lesion for early melanoma signs.",
        duration: "30 mins",
        category: "Screening",
      },
      {
        title: "Diagnostic Punch & Shave Biopsy",
        description: "Quick, localized tissue sample collection sent for histopathological analysis.",
        duration: "15 mins",
        category: "Diagnostic",
      },
    ],
    facilities: [
      {
        title: "Dermatopathology & Biopsy Processing Unit",
        description: "Direct tissue specimen handling ensuring fast turnaround for pathology results.",
      },
      {
        title: "Medical Laser & Phototherapy Suite",
        description: "Targeted narrowband UVB phototherapy and vascular lasers for psoriasis and rosacea.",
      },
    ],
    faqs: [
      {
        question: "How often should I get a full-body skin exam?",
        answer: "We recommend an annual skin cancer screening for all adults, or every 6 months for individuals with a personal or family history of skin cancer or numerous moles.",
      },
      {
        question: "What signs should prompt an immediate mole evaluation?",
        answer: "Follow the ABCDE rule: Asymmetry, Border irregularity, Color changes, Diameter > 6mm, or Evolving size/shape/bleeding.",
      },
    ],
  },
  "dental-care": {
    slug: "dental-care",
    dbName: "Dental Care",
    title: "Dental Care Department",
    tagline: "Preventive Dentistry, Restorative Care, & Smile Aesthetics",
    description:
      "Highland Medical Center's Dental Care Department provides family dentistry, dental hygiene, oral surgery, and cosmetic dentistry. We focus on preventive oral health, painless cavity treatment, crowns, and emergency tooth care.",
    iconName: "Smile",
    icon: Smile,
    location: "100 Medical Center Way, Suite 105, Highland, CA",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM | Sat: 8:30 AM - 1:00 PM",
    phone: "(555) 123-4567 ext. 105",
    email: "dental@highland.med",
    emergencyExtension: "Dental Emergency Triage: Option 8",
    keyStats: [
      { stat: "4.8/5", label: "Patient Satisfaction" },
      { stat: "3D", label: "Digital Dental Imaging" },
      { stat: "Painless", label: "Gentle Dental Procedures" },
      { stat: "Complete", label: "Preventive Oral Hygiene" },
    ],
    specializations: [
      "Preventive Dental Cleaning & Periodontal Maintenance",
      "Composite Fillings & Restorative Dentistry",
      "Crowns, Bridges, & Dental Prosthetics",
      "Endodontics (Root Canal Therapy)",
      "Teeth Whitening & Aesthetic Veneers",
      "Emergency Dental Trauma & Extraction",
    ],
    conditionsTreated: [
      "Dental Caries (Cavities)",
      "Gingivitis & Periodontitis",
      "Tooth Sensitivity & Cracked Teeth",
      "Impacted Teeth & Wisdom Tooth Pain",
      "Enamel Erosion & Tooth Loss",
    ],
    procedures: [
      {
        title: "Prophylaxis Cleaning & Polish",
        description: "Professional plaque and tartar removal, dental flossing, and fluoride treatment.",
        duration: "45 mins",
        category: "Preventive",
      },
      {
        title: "Tooth-Colored Composite Restoration",
        description: "Natural-looking composite resin cavity filling matched to your tooth shade.",
        duration: "45 mins",
        category: "Restorative",
      },
    ],
    facilities: [
      {
        title: "3D Digital Cone-Beam CT & Intraoral Imaging Suite",
        description: "Ultra-low radiation 3D scanning for precise dental structure and root mapping.",
      },
    ],
    faqs: [
      {
        question: "How often should I have a dental cleaning and checkup?",
        answer: "Routine dental cleanings and examinations are recommended every 6 months to maintain optimal gum and tooth health.",
      },
    ],
  },
};

/**
 * Normalizes any department slug or title into a canonical slug
 */
export function normalizeDepartmentSlug(input: string): string {
  const normalized = input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (normalized.includes("cardio")) return "cardiology";
  if (normalized.includes("neuro")) return "neurology";
  if (normalized.includes("pedia")) return "pediatrics";
  if (normalized.includes("ortho")) return "orthopedics";
  if (normalized.includes("ophthal")) return "ophthalmology";
  if (normalized.includes("general") || normalized.includes("internal")) return "general-medicine";
  if (normalized.includes("derma")) return "dermatology";
  if (normalized.includes("dent")) return "dental-care";
  return normalized;
}

/**
 * Gets metadata for a department, providing smart fallback if custom slug is given
 */
export function getDepartmentMetadata(slugOrTitle: string): DepartmentMetadata {
  const slug = normalizeDepartmentSlug(slugOrTitle);
  if (DEPARTMENT_METADATA_MAP[slug]) {
    return DEPARTMENT_METADATA_MAP[slug];
  }

  // Fallback for unknown dynamic departments from DB
  const formattedTitle = slugOrTitle
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    slug,
    dbName: formattedTitle,
    title: `${formattedTitle} Department`,
    tagline: `Specialized ${formattedTitle} Care & Clinical Excellence at Highland Medical Center`,
    description: `Highland Medical Center's ${formattedTitle} Department provides expert clinical consultation, diagnostic testing, and comprehensive patient care. Our experienced physicians are committed to providing personalized healthcare solutions.`,
    iconName: "Stethoscope",
    icon: Stethoscope,
    location: "100 Medical Center Way, Highland, CA",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    phone: "(555) 123-4567",
    email: "info@highland.med",
    emergencyExtension: "General Emergency: 911",
    keyStats: [
      { stat: "100%", label: "Patient Care Commitment" },
      { stat: "4.8/5", label: "Quality Rating" },
      { stat: "Modern", label: "Diagnostic Facility" },
      { stat: "Certified", label: "Specialist Team" },
    ],
    specializations: [
      `${formattedTitle} Consultation`,
      "Diagnostic Evaluation",
      "Preventive Healthcare",
      "Patient Education & Wellness",
    ],
    conditionsTreated: [
      `Acute & Chronic ${formattedTitle} Conditions`,
      "General Clinical Symptoms",
      "Health Screenings",
    ],
    procedures: [
      {
        title: `${formattedTitle} Initial Assessment`,
        description: "Comprehensive physical exam and health history review.",
        duration: "30-45 mins",
        category: "Diagnostic",
      },
    ],
    facilities: [
      {
        title: `${formattedTitle} Clinical Suite`,
        description: "Equipped with state-of-the-art diagnostic instruments for patient care.",
      },
    ],
    faqs: [
      {
        question: `How do I prepare for a ${formattedTitle} appointment?`,
        answer: "Please bring your photo ID, insurance card, medical records, and a list of current medications.",
      },
    ],
  };
}

