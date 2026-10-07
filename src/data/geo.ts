// Bangladesh: 8 divisions, 64 districts (official hierarchy).
// Coordinates are approximate district-headquarters centres, for map pins and "near me" fallback.

export type Division = { slug: string; nameEn: string; nameBn: string };
export type District = {
  slug: string;
  nameEn: string;
  nameBn: string;
  division: string; // division slug
  lat: number;
  lng: number;
};

export const divisions: Division[] = [
  { slug: "barishal", nameEn: "Barishal", nameBn: "বরিশাল" },
  { slug: "chattogram", nameEn: "Chattogram", nameBn: "চট্টগ্রাম" },
  { slug: "dhaka", nameEn: "Dhaka", nameBn: "ঢাকা" },
  { slug: "khulna", nameEn: "Khulna", nameBn: "খুলনা" },
  { slug: "mymensingh", nameEn: "Mymensingh", nameBn: "ময়মনসিংহ" },
  { slug: "rajshahi", nameEn: "Rajshahi", nameBn: "রাজশাহী" },
  { slug: "rangpur", nameEn: "Rangpur", nameBn: "রংপুর" },
  { slug: "sylhet", nameEn: "Sylhet", nameBn: "সিলেট" },
];

type Row = [string, string, string, string, number, number];

const rows: Row[] = [
  // Barishal
  ["barishal", "Barguna", "বরগুনা", "barguna", 22.16, 90.12],
  ["barishal", "Barishal", "বরিশাল", "barishal-district", 22.7, 90.37],
  ["barishal", "Bhola", "ভোলা", "bhola", 22.69, 90.65],
  ["barishal", "Jhalokati", "ঝালকাঠি", "jhalokati", 22.64, 90.2],
  ["barishal", "Patuakhali", "পটুয়াখালী", "patuakhali", 22.36, 90.33],
  ["barishal", "Pirojpur", "পিরোজপুর", "pirojpur", 22.58, 89.97],
  // Chattogram
  ["chattogram", "Bandarban", "বান্দরবান", "bandarban", 22.2, 92.22],
  ["chattogram", "Brahmanbaria", "ব্রাহ্মণবাড়িয়া", "brahmanbaria", 23.96, 91.11],
  ["chattogram", "Chandpur", "চাঁদপুর", "chandpur", 23.23, 90.67],
  ["chattogram", "Chattogram", "চট্টগ্রাম", "chattogram-district", 22.36, 91.78],
  ["chattogram", "Cumilla", "কুমিল্লা", "cumilla", 23.46, 91.18],
  ["chattogram", "Cox's Bazar", "কক্সবাজার", "coxs-bazar", 21.43, 91.98],
  ["chattogram", "Feni", "ফেনী", "feni", 23.01, 91.4],
  ["chattogram", "Khagrachhari", "খাগড়াছড়ি", "khagrachhari", 23.12, 91.98],
  ["chattogram", "Lakshmipur", "লক্ষ্মীপুর", "lakshmipur", 22.94, 90.84],
  ["chattogram", "Noakhali", "নোয়াখালী", "noakhali", 22.87, 91.1],
  ["chattogram", "Rangamati", "রাঙামাটি", "rangamati", 22.65, 92.17],
  // Dhaka
  ["dhaka", "Dhaka", "ঢাকা", "dhaka-district", 23.81, 90.41],
  ["dhaka", "Faridpur", "ফরিদপুর", "faridpur", 23.61, 89.84],
  ["dhaka", "Gazipur", "গাজীপুর", "gazipur", 24.0, 90.43],
  ["dhaka", "Gopalganj", "গোপালগঞ্জ", "gopalganj", 23.01, 89.83],
  ["dhaka", "Kishoreganj", "কিশোরগঞ্জ", "kishoreganj", 24.43, 90.78],
  ["dhaka", "Madaripur", "মাদারীপুর", "madaripur", 23.17, 90.2],
  ["dhaka", "Manikganj", "মানিকগঞ্জ", "manikganj", 23.86, 90.0],
  ["dhaka", "Munshiganj", "মুন্সীগঞ্জ", "munshiganj", 23.55, 90.53],
  ["dhaka", "Narayanganj", "নারায়ণগঞ্জ", "narayanganj", 23.62, 90.5],
  ["dhaka", "Narsingdi", "নরসিংদী", "narsingdi", 23.92, 90.72],
  ["dhaka", "Rajbari", "রাজবাড়ী", "rajbari", 23.76, 89.64],
  ["dhaka", "Shariatpur", "শরীয়তপুর", "shariatpur", 23.22, 90.35],
  ["dhaka", "Tangail", "টাঙ্গাইল", "tangail", 24.25, 89.92],
  // Khulna
  ["khulna", "Bagerhat", "বাগেরহাট", "bagerhat", 22.66, 89.79],
  ["khulna", "Chuadanga", "চুয়াডাঙ্গা", "chuadanga", 23.64, 88.85],
  ["khulna", "Jashore", "যশোর", "jashore", 23.17, 89.21],
  ["khulna", "Jhenaidah", "ঝিনাইদহ", "jhenaidah", 23.54, 89.17],
  ["khulna", "Khulna", "খুলনা", "khulna-district", 22.82, 89.55],
  ["khulna", "Kushtia", "কুষ্টিয়া", "kushtia", 23.9, 89.12],
  ["khulna", "Magura", "মাগুরা", "magura", 23.49, 89.42],
  ["khulna", "Meherpur", "মেহেরপুর", "meherpur", 23.76, 88.63],
  ["khulna", "Narail", "নড়াইল", "narail", 23.17, 89.5],
  ["khulna", "Satkhira", "সাতক্ষীরা", "satkhira", 22.72, 89.07],
  // Mymensingh
  ["mymensingh", "Jamalpur", "জামালপুর", "jamalpur", 24.92, 89.95],
  ["mymensingh", "Mymensingh", "ময়মনসিংহ", "mymensingh-district", 24.75, 90.4],
  ["mymensingh", "Netrokona", "নেত্রকোণা", "netrokona", 24.87, 90.73],
  ["mymensingh", "Sherpur", "শেরপুর", "sherpur", 25.02, 90.02],
  // Rajshahi
  ["rajshahi", "Bogura", "বগুড়া", "bogura", 24.85, 89.37],
  ["rajshahi", "Joypurhat", "জয়পুরহাট", "joypurhat", 25.1, 89.02],
  ["rajshahi", "Naogaon", "নওগাঁ", "naogaon", 24.8, 88.93],
  ["rajshahi", "Natore", "নাটোর", "natore", 24.42, 89.0],
  ["rajshahi", "Chapai Nawabganj", "চাঁপাইনবাবগঞ্জ", "chapai-nawabganj", 24.6, 88.28],
  ["rajshahi", "Pabna", "পাবনা", "pabna", 24.0, 89.23],
  ["rajshahi", "Rajshahi", "রাজশাহী", "rajshahi-district", 24.37, 88.6],
  ["rajshahi", "Sirajganj", "সিরাজগঞ্জ", "sirajganj", 24.45, 89.7],
  // Rangpur
  ["rangpur", "Dinajpur", "দিনাজপুর", "dinajpur", 25.63, 88.64],
  ["rangpur", "Gaibandha", "গাইবান্ধা", "gaibandha", 25.33, 89.53],
  ["rangpur", "Kurigram", "কুড়িগ্রাম", "kurigram", 25.81, 89.64],
  ["rangpur", "Lalmonirhat", "লালমনিরহাট", "lalmonirhat", 25.99, 89.28],
  ["rangpur", "Nilphamari", "নীলফামারী", "nilphamari", 25.93, 88.86],
  ["rangpur", "Panchagarh", "পঞ্চগড়", "panchagarh", 26.34, 88.55],
  ["rangpur", "Rangpur", "রংপুর", "rangpur-district", 25.75, 89.25],
  ["rangpur", "Thakurgaon", "ঠাকুরগাঁও", "thakurgaon", 26.03, 88.47],
  // Sylhet
  ["sylhet", "Habiganj", "হবিগঞ্জ", "habiganj", 24.38, 91.42],
  ["sylhet", "Moulvibazar", "মৌলভীবাজার", "moulvibazar", 24.48, 91.77],
  ["sylhet", "Sunamganj", "সুনামগঞ্জ", "sunamganj", 25.07, 91.4],
  ["sylhet", "Sylhet", "সিলেট", "sylhet-district", 24.9, 91.87],
];

export const districts: District[] = rows.map(([division, nameEn, nameBn, slug, lat, lng]) => ({
  division,
  nameEn,
  nameBn,
  slug,
  lat,
  lng,
}));

export const getDistrict = (slug: string) => districts.find((d) => d.slug === slug);
export const getDivision = (slug: string) => divisions.find((d) => d.slug === slug);
