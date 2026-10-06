import "dotenv/config";
import { prisma } from "../lib/prisma";

const doctorsData = [
  {
    name: "Dr. Sarah Jenkins, MD",
    email: "sarah.jenkins@highlandclinic.com",
    role: "DOCTOR" as const,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
    phoneNumber: "+1 (555) 234-5678",
    address: "100 Medical Center Way, Suite 400, Highland, CA",
    profile: {
      specialty: "Cardiology",
      brief: "Dr. Sarah Jenkins has over 14 years of clinical experience specializing in interventional cardiology, heart disease prevention, and non-invasive cardiac imaging.",
      credentials: "MD, FACC, Board Certified in Cardiovascular Disease",
      languages: ["English", "Spanish"],
      rating: 4.9,
      reviewCount: 148,
      specializations: ["Preventive Cardiology", "Heart Failure", "Echocardiography"],
      isActive: true,
    },
  },
  {
    name: "Dr. Marcus Vance, MD",
    email: "marcus.vance@highlandclinic.com",
    role: "DOCTOR" as const,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
    phoneNumber: "+1 (555) 345-6789",
    address: "100 Medical Center Way, Suite 402, Highland, CA",
    profile: {
      specialty: "Neurology",
      brief: "Dr. Marcus Vance is a renowned neurologist specializing in stroke intervention, movement disorders, and neuro-rehabilitation programs.",
      credentials: "MD, PhD, FAAN, Board Certified Neurologist",
      languages: ["English", "French"],
      rating: 4.8,
      reviewCount: 112,
      specializations: ["Stroke Management", "Parkinson's Disease", "Epilepsy"],
      isActive: true,
    },
  },
  {
    name: "Dr. Elena Rostova, MD",
    email: "elena.rostova@highlandclinic.com",
    role: "DOCTOR" as const,
    image: "https://images.unsplash.com/photo-1594824813572-c51124233e08?q=80&w=800&auto=format&fit=crop",
    phoneNumber: "+1 (555) 456-7890",
    address: "100 Medical Center Way, Suite 301, Highland, CA",
    profile: {
      specialty: "Pediatrics",
      brief: "Dr. Elena Rostova is a compassionate pediatrician focusing on newborn wellness, pediatric respiratory care, and adolescent development.",
      credentials: "MD, FAAP, Board Certified Pediatrician",
      languages: ["English", "Russian", "German"],
      rating: 5.0,
      reviewCount: 205,
      specializations: ["Childhood Development", "Pediatric Asthma", "Preventive Care"],
      isActive: true,
    },
  },
  {
    name: "Dr. James Mitchell, MD",
    email: "james.mitchell@highlandclinic.com",
    role: "DOCTOR" as const,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop",
    phoneNumber: "+1 (555) 567-8901",
    address: "100 Medical Center Way, Suite 505, Highland, CA",
    profile: {
      specialty: "Orthopedic Surgery",
      brief: "Dr. James Mitchell is an expert orthopedic surgeon specializing in minimally invasive joint replacement, sports medicine, and arthroscopy.",
      credentials: "MD, FAAOS, Board Certified Orthopedic Surgeon",
      languages: ["English"],
      rating: 4.9,
      reviewCount: 176,
      specializations: ["Joint Replacement", "Sports Medicine", "Arthroscopy"],
      isActive: true,
    },
  },
  {
    name: "Dr. Priya Patel, MD",
    email: "priya.patel@highlandclinic.com",
    role: "DOCTOR" as const,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop",
    phoneNumber: "+1 (555) 678-9012",
    address: "100 Medical Center Way, Suite 210, Highland, CA",
    profile: {
      specialty: "Dermatology",
      brief: "Dr. Priya Patel is a board-certified dermatologist specializing in medical dermatology, skin cancer screening, and cosmetic skin care.",
      credentials: "MD, FAAD, Board Certified Dermatologist",
      languages: ["English", "Hindi", "Gujarati"],
      rating: 4.9,
      reviewCount: 130,
      specializations: ["Skin Cancer Screening", "Acne & Rosacea", "Laser Therapy"],
      isActive: true,
    },
  },
  {
    name: "Dr. Robert Chen, MD",
    email: "robert.chen@highlandclinic.com",
    role: "DOCTOR" as const,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
    phoneNumber: "+1 (555) 789-0123",
    address: "100 Medical Center Way, Suite 101, Highland, CA",
    profile: {
      specialty: "Internal Medicine",
      brief: "Dr. Robert Chen provides primary care and comprehensive management for chronic health conditions, diabetes, hypertension, and routine wellness.",
      credentials: "MD, FACP, Board Certified in Internal Medicine",
      languages: ["English", "Mandarin"],
      rating: 4.8,
      reviewCount: 98,
      specializations: ["Chronic Disease Management", "Hypertension", "Diabetes Care"],
      isActive: true,
    },
  },
];

async function main() {
  console.log("Seeding doctor records into backend database via Prisma...");

  for (const doc of doctorsData) {
    // Upsert User and DoctorProfile
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {
        name: doc.name,
        image: doc.image,
        role: doc.role,
        phoneNumber: doc.phoneNumber,
        address: doc.address,
      },
      create: {
        name: doc.name,
        email: doc.email,
        role: doc.role,
        image: doc.image,
        phoneNumber: doc.phoneNumber,
        address: doc.address,
      },
    });

    await prisma.doctorProfile.upsert({
      where: { userId: user.id },
      update: {
        specialty: doc.profile.specialty,
        brief: doc.profile.brief,
        credentials: doc.profile.credentials,
        languages: doc.profile.languages,
        rating: doc.profile.rating,
        reviewCount: doc.profile.reviewCount,
        specializations: doc.profile.specializations,
        isActive: doc.profile.isActive,
      },
      create: {
        userId: user.id,
        specialty: doc.profile.specialty,
        brief: doc.profile.brief,
        credentials: doc.profile.credentials,
        languages: doc.profile.languages,
        rating: doc.profile.rating,
        reviewCount: doc.profile.reviewCount,
        specializations: doc.profile.specializations,
        isActive: doc.profile.isActive,
      },
    });

    console.log(`Upserted doctor: ${doc.name} (${doc.profile.specialty})`);
  }

  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  });
