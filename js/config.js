/* ===== GAU MAITRY SETTINGS — EDIT ONLY THIS FILE FOR PRICES & CONTACT ===== */
const SITE = {
  // 1) WHATSAPP NUMBER: country code + number, digits only, no + or spaces.
  //    Format: 91 followed by your 10-digit number  ->  "91XXXXXXXXXX"
  whatsappNumber: "919921472123",

  // 2) CONTACT DETAILS (leave "" until you have them; the site shows a placeholder)
  phoneDisplay: "919921472123",   // e.g. "+91 XXXXX XXXXX"
  email: "shreeji.enterprises082026@gmail.com",          // e.g. "name@example.com"

  // 3) DELIVERY CHARGE: keep null until confirmed. Use a number (e.g. 50) once decided.
  deliveryCharge: null,

  // 4) PRODUCTS. Set price to a number (e.g. 120) when confirmed. Keep null if not confirmed.
  products: [
    {
      id: "loban",
      name: "Loban Sambrani Dhoop Cup",
      hindi: "लोबान साम्रानी धूप कप",
      pack: "12 cups",
      image: "assets/loban-sambrani.png",
      price: 120
    },
    {
      id: "guggul",
      name: "Guggul Sambrani Dhoop Cup",
      hindi: "गुग्गुल साम्रानी धूप कप",
      pack: "12 cups",
      image: "assets/guggul-sambrani.png",
      price: 120
    }
  ]
};
