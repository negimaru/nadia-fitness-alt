// Nadia Fitness Dance Studio — single source of truth for everything that repeats or changes.
// Edit ONLY this file to change classes, the timetable, phone, address, call hours, rating or legal owner data.
// Every page renders from it (assets/js/app.js), so the timetable, the "Hoy" board, class pages,
// footer, contact form and structured data always match.
// - day: 0 = Monday … 4 = Friday. start/end: "H:MM".
// - owner fields left as null show a highlighted placeholder on the legal pages.
// - The content between the braces must stay valid JSON (tools/*.py read it).
window.NF = {
  "studio": {
    "name": "Nadia Fitness Dance Studio",
    "tagline": "Academia de baile y fitness en Torrox Costa",
    "phone": "654 691 336",
    "phoneIntl": "+34654691336",
    "whatsapp": "34654691336",
    "whatsappText": "¡Hola! Quiero información sobre las clases.",
    "street": "Urb. Santa Rosa, Calle Margarita 6",
    "postalCode": "29793",
    "locality": "Torrox Costa",
    "region": "Málaga",
    "country": "ES",
    "geo": {
      "lat": 36.734952643097586,
      "lng": -3.973681796403784
    },
    "mapsUrl": "https://maps.app.goo.gl/jp69zpacG6Zni4Du5",
    "reviewsUrl": "https://www.google.com/maps/search/?api=1&query=Nadia%20Fitness%20Dance%20Studio%20Torrox",
    "rating": {
      "value": "5,0",
      "count": 29
    },
    "instagram": "https://www.instagram.com/nadiafitnessdancestudio/",
    "instagramHandle": "@nadiafitnessdancestudio",
    "facebook": "https://www.facebook.com/profile.php?id=61571423443783",
    "season": "2026/27",
    "areaServed": [
      "Torrox",
      "Torrox Costa",
      "Nerja",
      "Algarrobo"
    ],
    "siteUrl": "https://negimaru.github.io/nadia-fitness-alt/"
  },
  "owner": {
    "name": null,
    "nif": null,
    "email": null
  },
  "legalUpdated": "17 de noviembre de 2026",
  "days": [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes"
  ],
  "callHours": [
    {
      "day": 0,
      "from": "9:00",
      "to": "16:00"
    },
    {
      "day": 1,
      "from": "11:00",
      "to": "16:00"
    },
    {
      "day": 2,
      "from": "9:00",
      "to": "16:00"
    },
    {
      "day": 3,
      "from": "13:00",
      "to": "16:00"
    },
    {
      "day": 4,
      "from": "13:00",
      "to": "16:00"
    }
  ],
  "classes": [
    {
      "id": "dance-baby",
      "name": "Grupo Dance Baby",
      "type": "dance",
      "kind": "Baile",
      "audience": "Peques",
      "summary": "Los más pequeños de la academia se inician en el baile jugando: ritmo, coordinación y sus primeras coreografías en grupo.",
      "description": "Los más pequeños de la academia se inician en el baile jugando: ritmo, coordinación y sus primeras coreografías en grupo.",
      "photo": "clases/dance-baby.webp",
      "photoAlt": "Clase de Grupo Dance Baby en Nadia Fitness Dance Studio",
      "placeholder": true
    },
    {
      "id": "dance-intermedio",
      "name": "Grupo Dance Intermedio",
      "type": "dance",
      "kind": "Baile",
      "audience": "Con base",
      "summary": "Dos grupos, Intermedio 1 e Intermedio 2, para quien ya tiene base y quiere seguir progresando en técnica y coreografía.",
      "description": "Dos grupos, Intermedio 1 e Intermedio 2, para quien ya tiene base y quiere seguir progresando en técnica y coreografía.",
      "photo": "clases/dance-intermedio.webp",
      "photoAlt": "Clase de Grupo Dance Intermedio en Nadia Fitness Dance Studio",
      "placeholder": true
    },
    {
      "id": "dance-avanzado",
      "name": "Grupo Dance Avanzado",
      "type": "dance",
      "kind": "Baile",
      "audience": "Nivel avanzado",
      "summary": "Coreografías más exigentes para quien ya domina la base y quiere ir un paso más allá.",
      "description": "Coreografías más exigentes para quien ya domina la base y quiere ir un paso más allá.",
      "photo": "clases/dance-avanzado.webp",
      "photoAlt": "Clase de Grupo Dance Avanzado en Nadia Fitness Dance Studio",
      "placeholder": true
    },
    {
      "id": "wedance-adultos",
      "name": "WeDance Grupo Adulto",
      "type": "dance",
      "kind": "Baile",
      "audience": "Adultos",
      "summary": "Baile en grupo para adultos. Aprende coreografías, muévete y pásalo bien sin necesidad de experiencia previa.",
      "description": "Baile en grupo para adultos. Aprende coreografías, muévete y pásalo bien sin necesidad de experiencia previa.",
      "photo": "bailarina.webp",
      "photoAlt": "Bailarina en plena coreografía",
      "placeholder": false
    },
    {
      "id": "fitdance",
      "name": "Fitdance",
      "type": "dance",
      "kind": "Baile y fitness",
      "audience": "Adultos",
      "summary": "Clase dirigida que mezcla fitness y baile: cardio a ritmo de coreografía para sudar sin darte cuenta.",
      "description": "Clase dirigida que mezcla fitness y baile: cardio a ritmo de coreografía para sudar sin darte cuenta.",
      "photo": "monitora-fitdance.webp",
      "photoAlt": "Nadia, monitora de Fitdance, con micrófono",
      "placeholder": false
    },
    {
      "id": "powerhiit",
      "name": "PowerHIIT",
      "type": "fit",
      "kind": "Fitness",
      "audience": "Adultos",
      "summary": "Entrenamiento funcional de alta intensidad por intervalos. Tienes grupo de mañana y de tarde para encajarlo en tu semana.",
      "description": "Entrenamiento funcional de alta intensidad por intervalos. Tienes grupo de mañana y de tarde para encajarlo en tu semana.",
      "photo": "clases/powerhiit.webp",
      "photoAlt": "Clase de PowerHIIT en Nadia Fitness Dance Studio",
      "placeholder": true
    },
    {
      "id": "aquafitness",
      "name": "Aquafitness",
      "type": "fit",
      "kind": "Fitness en el agua",
      "audience": "Adultos",
      "summary": "Ejercicio en el agua, en piscina exterior: trabajo cardiovascular y de tono muscular con bajo impacto en las articulaciones.",
      "description": "Ejercicio en el agua, en piscina exterior: trabajo cardiovascular y de tono muscular con bajo impacto en las articulaciones.",
      "photo": "clases/aquafitness.webp",
      "photoAlt": "Clase de Aquafitness en Nadia Fitness Dance Studio",
      "placeholder": true
    }
  ],
  "sessions": [
    {
      "class": "powerhiit",
      "day": 1,
      "start": "9:30",
      "end": "10:30",
      "label": "",
      "note": "Entrenamiento funcional"
    },
    {
      "class": "powerhiit",
      "day": 3,
      "start": "9:30",
      "end": "10:30",
      "label": "",
      "note": "Entrenamiento funcional"
    },
    {
      "class": "powerhiit",
      "day": 4,
      "start": "9:30",
      "end": "10:30",
      "label": "",
      "note": "Entrenamiento funcional"
    },
    {
      "class": "aquafitness",
      "day": 3,
      "start": "12:00",
      "end": "13:00",
      "label": "",
      "note": ""
    },
    {
      "class": "aquafitness",
      "day": 4,
      "start": "12:00",
      "end": "13:00",
      "label": "",
      "note": ""
    },
    {
      "class": "dance-intermedio",
      "day": 0,
      "start": "16:30",
      "end": "17:30",
      "label": "Grupo Dance Intermedio 1",
      "note": ""
    },
    {
      "class": "dance-baby",
      "day": 1,
      "start": "16:30",
      "end": "17:30",
      "label": "",
      "note": ""
    },
    {
      "class": "dance-intermedio",
      "day": 2,
      "start": "16:30",
      "end": "17:30",
      "label": "Grupo Dance Intermedio 1",
      "note": ""
    },
    {
      "class": "dance-baby",
      "day": 3,
      "start": "16:30",
      "end": "17:30",
      "label": "",
      "note": ""
    },
    {
      "class": "dance-avanzado",
      "day": 4,
      "start": "16:30",
      "end": "17:30",
      "label": "",
      "note": ""
    },
    {
      "class": "dance-intermedio",
      "day": 0,
      "start": "17:30",
      "end": "18:30",
      "label": "Grupo Dance Intermedio 2",
      "note": ""
    },
    {
      "class": "dance-avanzado",
      "day": 1,
      "start": "17:30",
      "end": "18:30",
      "label": "",
      "note": ""
    },
    {
      "class": "dance-intermedio",
      "day": 2,
      "start": "17:30",
      "end": "18:30",
      "label": "Grupo Dance Intermedio 2",
      "note": ""
    },
    {
      "class": "wedance-adultos",
      "day": 4,
      "start": "17:30",
      "end": "18:30",
      "label": "",
      "note": ""
    },
    {
      "class": "aquafitness",
      "day": 0,
      "start": "19:00",
      "end": "20:00",
      "label": "",
      "note": ""
    },
    {
      "class": "powerhiit",
      "day": 1,
      "start": "19:30",
      "end": "20:30",
      "label": "",
      "note": "Entrenamiento funcional"
    },
    {
      "class": "aquafitness",
      "day": 2,
      "start": "19:00",
      "end": "20:00",
      "label": "",
      "note": ""
    },
    {
      "class": "powerhiit",
      "day": 3,
      "start": "19:30",
      "end": "20:30",
      "label": "",
      "note": "Entrenamiento funcional"
    },
    {
      "class": "aquafitness",
      "day": 0,
      "start": "20:00",
      "end": "21:00",
      "label": "",
      "note": ""
    },
    {
      "class": "fitdance",
      "day": 1,
      "start": "20:30",
      "end": "21:30",
      "label": "",
      "note": "Clase dirigida"
    },
    {
      "class": "aquafitness",
      "day": 2,
      "start": "20:00",
      "end": "21:00",
      "label": "",
      "note": ""
    },
    {
      "class": "fitdance",
      "day": 3,
      "start": "20:30",
      "end": "21:30",
      "label": "",
      "note": "Clase dirigida"
    }
  ]
};
