export const SITE = {
  name: "The Golf Doctor DC",
  shortName: "Golf Doctor DC",
  tagline: "better golf…by design",
  headline: "Washington, D.C.'s Most Advanced Golf Fitting Center",
  phone: "(202) 827-4202",
  phoneHref: "tel:+12028274202",
  email: "Matt@golfdoctordc.com",
  emailHref:
    "mailto:Matt@golfdoctordc.com?subject=Help%20me%20break%20Par!",
  paypalEmail: "matt@golfdoctordc.com",
  booksy:
    "https://booksy.com/en-us/698043_the-golf-doctor-dc_other_15534_washington",
  maps: "https://maps.google.com/?q=1108+K+St+NW+Floor+3+Washington+DC+20005",
  yelp: "https://www.yelp.com/biz/the-golf-doctor-dc-washington",
  tradeIn:
    "https://apps.golfstixvalueguide.com/tradewidget/#/product-search",
  address: {
    name: "The Golf Doctor-DC",
    line1: "1108 K St NW, Floor 3",
    line2: "Washington, DC 20005",
    cross: "Between 11th Street NW and 12th Street NW",
  },
} as const;

export const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/fitting", label: "Club Fitting" },
  { to: "/club-making", label: "Club Making" },
  { to: "/gift-cards", label: "Gift Cards" },
  { to: "/trade-in", label: "Trade In" },
  { to: "/about", label: "About" },
  { to: "/partners", label: "Partners" },
  { to: "/studio", label: "Studio" },
  { to: "/location", label: "Location" },
] as const;

export const HOURS = [
  { day: "Monday", time: "10:00am – 4:00pm", note: "By appointment" },
  {
    day: "Tuesday",
    time: "10:00am – 4:00pm",
    note: "Evening fittings available",
  },
  { day: "Wednesday", time: "10:00am – 4:00pm", note: "By appointment" },
  {
    day: "Thursday",
    time: "10:00am – 4:00pm",
    note: "Evening fittings available",
  },
  { day: "Friday", time: "10:00am – 4:00pm", note: "By appointment" },
  { day: "Saturday", time: "Closed", note: "Hours available on request" },
  { day: "Sunday", time: "Closed", note: "Hours available on request" },
] as const;

export type Fitting = {
  id: string;
  name: string;
  price: string;
  duration?: string;
  featured?: boolean;
  summary: string;
  body: string[];
};

export const FITTINGS: Fitting[] = [
  {
    id: "full-bag",
    name: "Full Bag Fitting",
    price: "$400",
    duration: "Two sessions",
    featured: true,
    summary:
      "Driver, long game, irons, and putter — bundled and $200 off the individual price.",
    body: [
      "Looking at multiple fitting sessions? Individually, a full bag (driver, long game, irons, and putter) runs up to $600. The Full Bag Fitting offers a significant discount when you bundle those sessions into two visits.",
      "We recommend scheduling no more than one session on any given day, and ask that both sessions be completed within 45 days. The full bag price is $400 — $200 off the individual price of all four sessions.",
    ],
  },
  {
    id: "driver",
    name: "Driver Fitting",
    price: "$150",
    duration: "90–120 minutes",
    summary:
      "Fine-tune tee shots with TrackMan 4 so you get maximum carry and roll.",
    body: [
      "Using the latest TrackMan 4 launch monitor and a comprehensive array of test equipment, we fine-tune your performance so you get the most out of your tee shots.",
      "By measuring the precise details of the swing and the flight of the ball, TrackMan 4 lets us accurately determine your ball flight and fit you for maximum carry and roll.",
      "We match your swing with the appropriate shaft and clubhead, working with current clubs and shafts so you leave with a driver that matches the optimal characteristics for your swing.",
    ],
  },
  {
    id: "irons",
    name: "Iron Fitting",
    price: "$175",
    duration: "120 minutes",
    summary:
      "Heads, shafts, and set make-up — offset, sole, blade or cavity, and the long irons you actually need.",
    body: [
      "While most of the time in any fitting is dedicated to shaft characteristics, a significant part of the iron fitting is determining the proper clubheads and set make-up for you.",
      "Do you need offset or a wide sole? A blade, an oversize cavity-back, or something in between? Some golfers carry a 2-iron; some won't carry anything longer than a 5-iron. We take the time to make sure you get the clubs you need — without getting stuck with clubs you don't need or would find difficult to use.",
    ],
  },
  {
    id: "long-game",
    name: "Long Game Fitting",
    price: "$150",
    duration: "About 90 minutes",
    summary:
      "Fairway woods, hybrids, or both — the right head, loft, and shaft for how you actually play.",
    body: [
      "Do you need hybrids, fairway woods, or some combination of both? Different golfers perform better with different clubs, and the long game is critical to improving your scores.",
      "Fairway woods: finding the correct shaft is critical, but it isn't enough. We also determine the correct type of fairway wood and the appropriate loft.",
      'Hybrids: as their popularity has grown, so has the variety of head and shaft types. Getting fitted makes sure these "rescue" clubs are as easy and forgiving to hit as possible.',
    ],
  },
  {
    id: "wedges",
    name: "Wedge Fitting",
    price: "$100",
    duration: "About 60 minutes",
    summary:
      "Bounce, grind, and gapping so your short game actually matches the courses you play.",
    body: [
      "Different course conditions require different wedges. So do different swings. We make sure you are getting the right wedges so your short game is the best it can be.",
      "Do you know the bounce and grind of your wedges? Are they correct for your swing and the courses you play on? TrackMan lets us accurately measure spin rates and gap your scoring clubs so you have a better shot at the pin.",
    ],
  },
  {
    id: "putter",
    name: "Putter Fitting",
    price: "$125",
    duration: "About 75 minutes",
    summary:
      "Length, lie, loft, head type, and grip — the club you use more than twice as often as any other.",
    body: [
      "An average golfer will hit the driver 12–13 times in a round, a 7-iron about 15 times, a sand wedge 14 times — and the putter 32 times. If you're using a club that often, it needs to match how you putt.",
      "We test to make sure your putter is the proper length, lie angle, loft, head type, grip size, and more. When your putter fits you, it becomes easier to make a consistent stroke.",
      "Anyone can make a four-foot putt. The trick is to have the confidence that you can make them all.",
    ],
  },
  {
    id: "intro",
    name: "Introductory Fitting",
    price: "$150",
    duration: "About 90 minutes",
    summary:
      "For golfers starting out — length, lie, and grips that fit your body before you learn the game on the wrong equipment.",
    body: [
      "Learning golf is hard enough without wondering if your clubs are too long or too short, or if the grips fit your hand. Come in for an introductory clubfitting to make sure new clubs meet your physical needs.",
      "We measure you so any clubs you buy start you on the right path and give you a solid foundation for the golf swing. This session is designed for beginners who want to start with properly sized equipment.",
    ],
  },
];

export const SHOP_SERVICES = [
  {
    title: "Golf Club Assembly",
    text: "Every club is built on site to the exact prescription from your fitting — not emailed to an anonymous production line.",
  },
  {
    title: "Reshafting",
    text: "A new shaft in a head you already love, matched to the frequency, weight, and profile your swing needs.",
  },
  {
    title: "Regripping",
    text: "Fresh grips in the size, texture, and compound that actually fit your hands.",
  },
  {
    title: "Loft & Lie",
    text: "Precision adjustments so the club sits the way you aim, not the way it left the factory.",
  },
  {
    title: "Wedge Grinding",
    text: "Bounce and grind tailored to your attack angle and the turf you play.",
  },
] as const;

export const CREDENTIALS = [
  {
    title: "Golf Digest 100 Best Clubfitter",
    detail: "Listed five times, recognized since 2011.",
  },
  {
    title: "International Clubmaker of the Year",
    detail: "International Clubmakers Guild, 2018.",
  },
  {
    title: "TaylorMade National Fitters Council",
    detail: "Founding member, 2019.",
  },
  {
    title: "PCS & GCA Certified",
    detail: "Professional Clubmaker's Society and Golf Clubmakers Association. GCA International Clubmaker of the World. PCS Regional Clubmaker of the Year.",
  },
  {
    title: "True Temper Certified",
    detail: "Precision shaft fitting and build.",
  },
  {
    title: "KBS Certified Fitting Center",
    detail: "Official KBS shaft fitting.",
  },
  {
    title: "PING Certified Fitter",
    detail: "Factory-recognized PING fitting.",
  },
  {
    title: "Callaway Certified Club Fitter",
    detail: "Callaway fitting certification.",
  },
  {
    title: "Rifle Precision Shafts",
    detail: "Certified Rifle fitting center.",
  },
] as const;

export const REVIEWS = [
  {
    name: "Adrienne",
    service: "Putter Fitting",
    quote: "Super knowledgeable and patient.",
  },
  {
    name: "Juan",
    service: "Iron Fitting",
    quote:
      "Matt is great. He takes his time, and is quite knowledgeable. Would come back in a heartbeat.",
  },
  {
    name: "Joseph",
    service: "Club Fitting Follow-up",
    quote:
      "Matt is a consummate professional. A prior review said he treated them like Tiger Woods, and I can echo the same experience.",
  },
  {
    name: "Andrew",
    service: "Iron Fitting",
    quote:
      "I learned a ton and feel confident in the set we landed on. Highly recommended.",
  },
  {
    name: "Pamela",
    service: "Full Bag Fitting",
    quote:
      "The first half of my full-bag fitting was exactly what I hoped for — after years of lessons and so-called fittings.",
  },
  {
    name: "Paul",
    service: "Club Fitting",
    quote:
      "Matt is fantastic. He's genuinely kind, patient, and honest throughout the entire fitting process.",
  },
] as const;

export const GALLERY = [
  {
    src: "/images/fitting-bay.jpg",
    alt: "TaylorMade golf balls on studio turf with the club wall and TrackMan bay behind",
    caption: "The hitting bay",
  },
  {
    src: "/images/fitting-lounge.jpg",
    alt: "TrackMan hitting bay with a 7-iron launch on the screen",
    caption: "The fitting lounge",
  },
  {
    src: "/images/trackman-4.jpg",
    alt: "Orange TrackMan launch monitor standing on a golf course",
    caption: "TrackMan 4",
  },
  {
    src: "/images/ball-roll-2.jpg",
    alt: "Composite ball-roll of a putt, from skid into true roll",
    caption: "Putter studio",
  },
  {
    src: "/images/long-game.jpg",
    alt: "Four different ball flights falling onto a golf green around the pin",
    caption: "Long game",
  },
  {
    src: "/images/irons.jpg",
    alt: "Set of irons on the green",
    caption: "Irons",
  },
  {
    src: "/images/workshop-bench.jpg",
    alt: "Club making workbench with shafts, grips, and tools",
    caption: "On-site build shop",
  },
  {
    src: "/images/regrip.jpg",
    alt: "A golf club being regripped on the workshop bench",
    caption: "Full-service workshop",
  },
  {
    src: "/images/putting-1.jpg",
    alt: "Putting green at dusk",
    caption: "The short game",
  },
  {
    src: "/images/course-1.jpg",
    alt: "Golf course at golden hour",
    caption: "Where it counts",
  },
  {
    src: "/images/sunset-golf.jpg",
    alt: "Golfer silhouetted at sunset",
    caption: "better golf…by design",
  },
  {
    src: "/images/dc-cherry.jpg",
    alt: "Jefferson Memorial through cherry blossoms",
    caption: "Washington, D.C.",
  },
  {
    src: "/images/k-street-studio.jpg",
    alt: "Architectural sketch of The Golf Doctor DC storefront on K Street",
    caption: "K Street studio",
  },
] as const;

export const GIFT_AMOUNTS = [50, 100, 150, 175, 250, 400] as const;
