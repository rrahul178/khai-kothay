export type Category = "rice" | "meat" | "sweet" | "fish" | "tea" | "street" | "seasonal";

export const categories: { id: Category; labelBn: string; labelEn: string; emoji: string }[] = [
  { id: "rice", labelBn: "ভাত/বিরিয়ানি", labelEn: "Rice meals", emoji: "🍛" },
  { id: "meat", labelBn: "মাংস", labelEn: "Meat", emoji: "🥩" },
  { id: "sweet", labelBn: "মিষ্টি", labelEn: "Sweets", emoji: "🍮" },
  { id: "fish", labelBn: "মাছ", labelEn: "Fish", emoji: "🐟" },
  { id: "tea", labelBn: "চা", labelEn: "Tea", emoji: "☕" },
  { id: "street", labelBn: "স্ট্রিট ফুড", labelEn: "Street food", emoji: "🌶️" },
  { id: "seasonal", labelBn: "মৌসুমি", labelEn: "Seasonal", emoji: "🥭" },
];

export type Food = {
  slug: string;
  nameEn: string;
  nameBn: string;
  category: Category;
  originDistrict: string; // district slug
  description: string;
  /** Optional photo, e.g. "/foods/kacchi-biryani.jpg" (file in /public/foods). Falls back to an illustrated tile. */
  image?: string;
  /** Photo credit, shown if the image needs attribution. */
  imageCredit?: string;
};

// Iconic regional foods. Descriptions are short and general; expand/verify as you grow content.
export const foods: Food[] = [
  { slug: "kacchi-biryani", nameEn: "Kacchi Biryani", nameBn: "কাচ্চি বিরিয়ানি", category: "rice", originDistrict: "dhaka-district", description: "Old Dhaka's signature mutton biryani, cooked with raw marinated meat and rice layered together, served with borhani." },
  { slug: "bakarkhani", nameEn: "Bakarkhani", nameBn: "বাকরখানি", category: "sweet", originDistrict: "dhaka-district", description: "Crisp, layered Old Dhaka flatbread, enjoyed with tea or as a savoury-sweet snack." },
  { slug: "haji-biryani", nameEn: "Haji Biryani", nameBn: "হাজীর বিরিয়ানি", category: "rice", originDistrict: "dhaka-district", description: "A Old Dhaka favourite mutton biryani known for its simple, aromatic style." },
  { slug: "borhani", nameEn: "Borhani", nameBn: "বোরহানি", category: "tea", originDistrict: "dhaka-district", description: "Spiced yoghurt drink served alongside biryani to cut the richness." },
  { slug: "fuchka", nameEn: "Fuchka", nameBn: "ফুচকা", category: "street", originDistrict: "dhaka-district", description: "Crisp hollow shells filled with spiced chickpeas, potato and tamarind water." },
  { slug: "chotpoti", nameEn: "Chotpoti", nameBn: "চটপটি", category: "street", originDistrict: "dhaka-district", description: "Tangy, spicy chickpea and potato street snack topped with egg and onion." },
  { slug: "bogura-mishti-doi", nameEn: "Bogura Mishti Doi", nameBn: "বগুড়ার মিষ্টি দই", category: "sweet", originDistrict: "bogura", description: "Sweet, thick, caramel-toned yoghurt set in earthen pots, the pride of Bogura." },
  { slug: "porabari-chomchom", nameEn: "Porabari Chomchom", nameBn: "পোড়াবাড়ীর চমচম", category: "sweet", originDistrict: "tangail", description: "Tangail's famous syrupy, slightly caramelised cottage-cheese sweet." },
  { slug: "cumilla-roshmalai", nameEn: "Cumilla Roshmalai", nameBn: "কুমিল্লার রসমালাই", category: "sweet", originDistrict: "cumilla", description: "Soft chhana patties soaked in thickened, cardamom-scented milk." },
  { slug: "chattogram-kala-bhuna", nameEn: "Chattogram Kala Bhuna", nameBn: "চট্টগ্রামের কালা ভুনা", category: "meat", originDistrict: "chattogram-district", description: "Dark, deeply spiced slow-cooked beef, a Chattogram mezban classic." },
  { slug: "mezbani-beef", nameEn: "Chattogram Mezbani Beef", nameBn: "চট্টগ্রামের মেজবানি মাংস", category: "meat", originDistrict: "chattogram-district", description: "Peppery beef curry served at traditional Chattogram feasts (mezban)." },
  { slug: "ilish-bhapa", nameEn: "Ilish (Hilsa) Dishes", nameBn: "ইলিশ", category: "fish", originDistrict: "chandpur", description: "Hilsa, the national fish, cooked as bhapa, bhaja or in mustard gravy; strongly tied to Chandpur and Barishal." },
  { slug: "barishal-ilish", nameEn: "Barishal Ilish", nameBn: "বরিশালের ইলিশ", category: "fish", originDistrict: "barishal-district", description: "Hilsa from the southern rivers, prized in monsoon season." },
  { slug: "sylhet-seven-color-tea", nameEn: "Seven-Layer Tea", nameBn: "সাত রঙের চা", category: "tea", originDistrict: "moulvibazar", description: "Layered tea from Sreemangal, the tea capital of Bangladesh." },
  { slug: "shatkora-beef", nameEn: "Shatkora Beef", nameBn: "শাতকরা গরুর মাংস", category: "meat", originDistrict: "sylhet-district", description: "Sylheti beef curry soured with the aromatic shatkora citrus." },
  { slug: "rajshahi-mango", nameEn: "Rajshahi Mango", nameBn: "রাজশাহীর আম", category: "seasonal", originDistrict: "rajshahi-district", description: "Summer mangoes from the Rajshahi region, including Himsagar and Langra." },
  { slug: "chapai-aam", nameEn: "Chapai Nawabganj Mango", nameBn: "চাঁপাইনবাবগঞ্জের আম", category: "seasonal", originDistrict: "chapai-nawabganj", description: "Famed mango belt produce sold across the country each summer." },
  { slug: "natore-kanchagolla", nameEn: "Natore Kanchagolla", nameBn: "নাটোরের কাঁচাগোল্লা", category: "sweet", originDistrict: "natore", description: "Light, milky Natore sweet made from fresh chhana and sugar." },
  { slug: "kushtia-tilkut", nameEn: "Kushtia Tilkut", nameBn: "কুষ্টিয়ার তিলের খাজা", category: "sweet", originDistrict: "kushtia", description: "Sesame-based sweet associated with Kushtia." },
  { slug: "muktagachha-monda", nameEn: "Muktagachha Monda", nameBn: "মুক্তাগাছার মণ্ডা", category: "sweet", originDistrict: "mymensingh-district", description: "Dense, milk-based sweet from Muktagachha in Mymensingh." },
  { slug: "kishoreganj-doi", nameEn: "Kishoreganj Doi & Sweets", nameBn: "কিশোরগঞ্জের দই-মিষ্টি", category: "sweet", originDistrict: "kishoreganj", description: "Local yoghurt and traditional sweets found in Kishoreganj town shops." },
  { slug: "kishoreganj-beef-rice", nameEn: "Beef & Rice Meal", nameBn: "ভাত-গরুর মাংস", category: "rice", originDistrict: "kishoreganj", description: "A classic everyday hotel meal: steamed rice with beef and local sides." },
  { slug: "pitha", nameEn: "Winter Pitha", nameBn: "শীতের পিঠা", category: "seasonal", originDistrict: "dhaka-district", description: "Seasonal rice-flour cakes such as bhapa, patishapta and chitoi pitha." },
  { slug: "bhorta-rice", nameEn: "Bhorta & Rice", nameBn: "ভর্তা-ভাত", category: "rice", originDistrict: "dhaka-district", description: "Mashed vegetable and dried-fish bhortas with steamed rice." },
  { slug: "jhalmuri", nameEn: "Jhalmuri", nameBn: "ঝালমুড়ি", category: "street", originDistrict: "dhaka-district", description: "Spicy puffed rice mix tossed with mustard oil, chilli and onion." },
  { slug: "coxs-bazar-shutki", nameEn: "Cox's Bazar Shutki", nameBn: "কক্সবাজারের শুঁটকি", category: "fish", originDistrict: "coxs-bazar", description: "Dried fish, a coastal staple, cooked with chilli and onion." },
  { slug: "khulna-chui-jhal", nameEn: "Khulna Chui Jhal", nameBn: "খুলনার চুইঝাল মাংস", category: "meat", originDistrict: "khulna-district", description: "Meat cooked with chui jhal, a pungent aromatic climber root." },
  { slug: "rangpur-tehari", nameEn: "Tehari", nameBn: "তেহারি", category: "rice", originDistrict: "dhaka-district", description: "Spiced beef and rice dish, a popular breakfast or lunch across the country." },
  { slug: "dinajpur-lychee", nameEn: "Dinajpur Lychee", nameBn: "দিনাজপুরের লিচু", category: "seasonal", originDistrict: "dinajpur", description: "Summer lychees from the Dinajpur region." },
];

export const getFood = (slug: string) => foods.find((f) => f.slug === slug);
