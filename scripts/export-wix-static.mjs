import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "wix-export");
const BOOKSY =
  "https://booksy.com/en-us/698043_the-golf-doctor-dc_other_15534_washington";
const TRADE =
  "https://apps.golfstixvalueguide.com/tradewidget/#/product-search";
const MAPS = "https://maps.google.com/?q=1108+K+St+NW+Floor+3+Washington+DC+20005";
const YELP = "https://www.yelp.com/biz/the-golf-doctor-dc-washington";
const PHONE = "(202) 827-4202";
const EMAIL = "matt@golfdoctordc.com";

const NAV = [
  { href: "fitting.html", label: "Club Fitting" },
  { href: "club-making.html", label: "Club Making" },
  { href: "gift-cards.html", label: "Gift Cards" },
  { href: "trade-in.html", label: "Trade In" },
  { href: "about.html", label: "About" },
  { href: "partners.html", label: "Partners" },
  { href: "studio.html", label: "Studio" },
  { href: "location.html", label: "Location" },
];

const FITTINGS = [
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
    summary: "Fine-tune tee shots with TrackMan 4 so you get maximum carry and roll.",
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

const CREDENTIALS = [
  ["Golf Digest 100 Best Clubfitter", "Listed five times, recognized since 2011."],
  ["International Clubmaker of the Year", "International Clubmakers Guild, 2018."],
  ["TaylorMade National Fitters Council", "Founding member, 2019."],
  [
    "PCS & GCA Certified",
    "Professional Clubmaker's Society and Golf Clubmakers Association. GCA International Clubmaker of the World. PCS Regional Clubmaker of the Year.",
  ],
  ["True Temper Certified", "Precision shaft fitting and build."],
  ["KBS Certified Fitting Center", "Official KBS shaft fitting."],
  ["PING Certified Fitter", "Factory-recognized PING fitting."],
  ["Callaway Certified Club Fitter", "Callaway fitting certification."],
  ["Rifle Precision Shafts", "Certified Rifle fitting center."],
];

const REVIEWS = [
  ["Adrienne", "Putter Fitting", "Super knowledgeable and patient."],
  [
    "Juan",
    "Iron Fitting",
    "Matt is great. He takes his time, and is quite knowledgeable. Would come back in a heartbeat.",
  ],
  [
    "Joseph",
    "Club Fitting Follow-up",
    "Matt is a consummate professional. A prior review said he treated them like Tiger Woods, and I can echo the same experience.",
  ],
];

const SHOP = [
  [
    "Golf Club Assembly",
    "Every club is built on site to the exact prescription from your fitting — not emailed to an anonymous production line.",
  ],
  [
    "Reshafting",
    "A new shaft in a head you already love, matched to the frequency, weight, and profile your swing needs.",
  ],
  ["Regripping", "Fresh grips in the size, texture, and compound that actually fit your hands."],
  [
    "Loft & Lie",
    "Precision adjustments so the club sits the way you aim, not the way it left the factory.",
  ],
  ["Wedge Grinding", "Bounce and grind tailored to your attack angle and the turf you play."],
];

const GALLERY = [
  ["images/studio.jpg", "Fitting studio with turf, lounge chairs, and launch monitor", "The fitting bay"],
  ["images/trackman-4.jpg", "Orange TrackMan launch monitor standing on a golf course", "TrackMan 4"],
  ["images/putter.jpg", "Putter addressing a golf ball on studio turf", "Putter studio"],
  ["images/woods.jpg", "Driver and fairway woods on morning grass", "Long game"],
  ["images/irons.jpg", "Set of irons on the green", "Irons"],
  ["images/workshop-bench.jpg", "Club making workbench with shafts, grips, and tools", "On-site build shop"],
  ["images/workshop.jpg", "Club assembly workshop with loft and lie machine", "Full-service workshop"],
  ["images/putting-1.jpg", "Putting green at dusk", "The short game"],
  ["images/course-1.jpg", "Golf course at golden hour", "Where it counts"],
  ["images/sunset-golf.jpg", "Golfer silhouetted at sunset", "better golf…by design"],
  ["images/dc-cherry.jpg", "Jefferson Memorial through cherry blossoms", "Washington, D.C."],
  ["images/dc-street.jpg", "Downtown Washington street near the studio", "K Street studio"],
];

const LOGO = `<svg viewBox="0 0 40 40" class="logo-mark" aria-hidden="true">
  <rect width="40" height="40" rx="8" fill="#F4F0E6"/>
  <path fill="#0E1A14" d="M20 6.2 L31.4 11.2 V21.2 C31.4 28.2 20 34.5 20 34.5 C20 34.5 8.6 28.2 8.6 21.2 V11.2 Z"/>
  <rect x="18.4" y="13.2" width="3.2" height="14.4" rx="0.7" fill="#F4F0E6"/>
  <path fill="#C45C12" d="M21.6 13.2 L30.4 17.4 L21.6 21.6 Z"/>
</svg>`;

function layout({ title, path, body }) {
  const nav = NAV.map(
    (item) =>
      `<a href="${item.href}" class="${path === item.href ? "active" : ""}">${item.label}</a>`,
  ).join("");
  const mobileNav = [
    `<a href="index.html">Home</a>`,
    ...NAV.map((item) => `<a href="${item.href}">${item.label}</a>`),
    `<a href="book.html">Book a Fitting</a>`,
  ].join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title}</title>
  <meta name="description" content="Washington, D.C.'s most advanced golf fitting center. TrackMan 4, on-site club making, and custom fittings by Matt Grabowy."/>
  <link rel="icon" href="favicon.svg"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="css/site.css"/>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="logo" href="index.html" aria-label="The Golf Doctor DC home">
        ${LOGO}
        <span><span class="logo-name">The Golf Doctor</span><span class="logo-sub">Washington, D.C.</span></span>
      </a>
      <nav class="nav-desk" aria-label="Primary">${nav}</nav>
      <div class="header-actions">
        <a class="phone-desk" href="tel:+12028274202">${PHONE}</a>
        <a class="btn btn-primary" href="${BOOKSY}" target="_blank" rel="noreferrer">Book Now</a>
        <button class="menu-btn" id="open-menu" aria-label="Open menu">☰</button>
      </div>
    </div>
  </header>
  <div class="backdrop" id="backdrop"></div>
  <aside class="drawer" id="drawer" aria-label="Menu">
    <div class="drawer-head">
      <strong>Menu</strong>
      <button class="menu-btn" id="close-menu" aria-label="Close menu">✕</button>
    </div>
    <nav>${mobileNav}</nav>
    <div class="drawer-foot">
      <a class="btn btn-primary" href="${BOOKSY}" target="_blank" rel="noreferrer" style="width:100%">Book Now</a>
      <p style="text-align:center;margin:0.9rem 0 0"><a href="tel:+12028274202">${PHONE}</a></p>
    </div>
  </aside>
  ${body}
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <a class="logo" href="index.html">${LOGO}<span><span class="logo-name">The Golf Doctor</span><span class="logo-sub">Washington, D.C.</span></span></a>
        <p style="max-width:28rem;margin-top:1rem;line-height:1.6">Custom club fitting and on-site club making in downtown Washington, D.C. TrackMan 4. Thousands of test combinations. Built here, not shipped to a factory floor.</p>
        <p style="font-family:var(--display);font-style:italic;font-size:1.25rem;margin-top:1rem">better golf…by design</p>
      </div>
      <div>
        <p class="foot-title">Visit</p>
        <ul>
          <li><a href="${MAPS}" target="_blank" rel="noreferrer">1108 K St NW, Floor 3<br/>Washington, DC 20005</a></li>
          <li><a href="tel:+12028274202">${PHONE}</a></li>
          <li><a href="mailto:${EMAIL}?subject=Help%20me%20break%20Par!">${EMAIL}</a></li>
        </ul>
      </div>
      <div>
        <p class="foot-title">Explore</p>
        <ul>
          <li><a href="index.html">Home</a></li>
          ${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}
          <li><a href="book.html">Book a Fitting</a></li>
          <li><a href="${YELP}" target="_blank" rel="noreferrer">Reviews on Yelp</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap legal">
      <p>© ${new Date().getFullYear()} The Golf Doctor-DC, LLC</p>
      <p>All fittings by appointment. Walk-ins, please call first.</p>
    </div>
  </footer>
  <script src="js/site.js"></script>
</body>
</html>`;
}

function hero({ image, alt, eyebrow, title, subtitle, tag, compact, home, ctas = "" }) {
  return `<section class="hero${home ? " home" : ""}${compact ? " compact" : ""}">
    <img src="${image}" alt="${alt}"/>
    <div class="hero-shade"></div>
    <div class="wrap">
      <p class="eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      ${subtitle ? `<p class="lede">${subtitle}</p>` : ""}
      ${tag ? `<p class="tag">${tag}</p>` : ""}
      ${ctas ? `<div class="hero-cta">${ctas}</div>` : ""}
    </div>
  </section>`;
}

function form(kind) {
  const extra =
    kind === "gift"
      ? `<label>Amount<input id="gift-amount" name="extra" value="$150" readonly/></label>`
      : kind === "trade"
        ? `<label>Clubs<textarea name="extra" placeholder="Brand, model, year, condition"></textarea></label>`
        : "";
  const title =
    kind === "gift" ? "Request a gift card" : kind === "trade" ? "Request a trade-in quote" : "Send a note";
  const blurb =
    kind === "gift"
      ? "Choose an amount and we’ll email a Golf Doctor DC gift card."
      : kind === "trade"
        ? "Describe the clubs and we’ll send a real-time quote."
        : "Appointments are required. Tell us what you need and we’ll get back to you.";
  return `<div class="card">
    <h3>${title}</h3>
    <p class="muted">${blurb}</p>
    <form data-mail="${kind}" style="margin-top:1rem">
      <label>Name<input name="name" required autocomplete="name"/></label>
      <label>Email<input type="email" name="email" required autocomplete="email"/></label>
      <label>Phone<input type="tel" name="phone" autocomplete="tel"/></label>
      ${extra}
      <label>Message<textarea name="message" required></textarea></label>
      <button class="btn btn-primary" type="submit">Send</button>
    </form>
    <div data-sent class="hidden" style="text-align:center;padding:1.5rem 0">
      <p><strong>Thanks.</strong> Your email app should open with the note ready to send.</p>
    </div>
  </div>`;
}

const home = layout({
  title: "The Golf Doctor DC | Club Fitting in Washington, D.C.",
  path: "index.html",
  body: `<main id="main">
    ${hero({
      image: "images/hero-fairway.jpg",
      alt: "Sunlit golf fairway with sand bunkers under a stormy sky",
      eyebrow: "Downtown Washington, D.C.",
      title: "The Golf Doctor DC",
      subtitle: "Washington, D.C.'s Most Advanced Golf Fitting Center",
      tag: "better golf…by design",
      home: true,
      ctas: `<a class="btn btn-primary btn-lg" href="${BOOKSY}" target="_blank" rel="noreferrer">Book a Fitting</a>
             <a class="btn btn-inverse btn-lg" href="tel:+12028274202">Call ${PHONE}</a>`,
    })}
    <div class="ticker"><div class="wrap ticker-inner">
      <p>★ 5.0 on Booksy · 343 reviews</p>
      <span>Golf Digest 100 Best Clubfitter</span>
      <span>2018 International Clubmaker of the Year</span>
      <span>TaylorMade National Fitters Council</span>
    </div></div>
    <section class="section"><div class="wrap grid-2" style="align-items:start">
      <div>
        <span class="badge-clay">Why we do what we do</span>
        <h2 style="margin-top:1.25rem">A swing is as unique as a fingerprint.</h2>
      </div>
      <div class="prose">
        <p>No matter what anyone else might say, you just cannot get equipment that properly fits your swing long distance. Some things can only be determined by actually having you hit test clubs.</p>
        <p>So why would you let someone tell you they can choose the right set of clubs when they have never even seen you hit a ball? Come in to The Golf Doctor-DC and let us help you the way that you deserve.</p>
        <a class="btn btn-outline" href="fitting.html">Explore fittings</a>
      </div>
    </div></section>
    <section class="band"><div class="wrap split-media" style="padding:4rem 0">
      <img src="images/trackman-4.jpg" alt="Orange TrackMan launch monitor on the grass"/>
      <div class="split-copy">
        <p class="eyebrow">TrackMan Simulator</p>
        <h2 style="margin-top:0.6rem">Play and practice downtown.</h2>
        <p class="muted" style="color:rgb(244 240 230 / 0.75)">Book time to play or practice at The Golf Doctor DC. Use the state-of-the-art TrackMan simulator and keep your game sharp in the off-season. Real distances. Real play.</p>
        <a class="btn btn-primary" href="${BOOKSY}" target="_blank" rel="noreferrer" style="margin-top:1.25rem">Reserve simulator time</a>
      </div>
    </div></section>
    <section class="section"><div class="wrap">
      <div class="grid-3">
        <article class="card"><img src="images/trackman-4.jpg" alt="" class="photo" style="height:10rem;margin:-1.5rem -1.5rem 1rem"/><h3>Technology</h3><p class="muted">Combining the most advanced technology and a comprehensive inventory of club options. Test the latest heads and shafts so we can find the optimal golf club for you and your swing.</p></article>
        <article class="card"><img src="images/woods.jpg" alt="" class="photo" style="height:10rem;margin:-1.5rem -1.5rem 1rem"/><h3>Knowledge</h3><p class="muted">With more than 22 years fitting and building golf clubs, Matt Grabowy has been recognized by Golf Digest as a Top 100 Clubfitter since 2011 and was named 2018 Worldwide Clubmaker of the Year.</p></article>
        <article class="card"><img src="images/irons.jpg" alt="" class="photo" style="height:10rem;margin:-1.5rem -1.5rem 1rem"/><h3>Trade in & trade up</h3><p class="muted">Already have clubs but want the latest technology? Trade in your current set and apply the credit toward new purchases. Trade-in prices meet or exceed online prices.</p></article>
      </div>
      <p style="text-align:right;margin-top:1.5rem"><a class="btn btn-outline" href="trade-in.html">Get your trade-in value</a></p>
    </div></section>
    <section class="surface"><div class="section wrap">
      <div class="cta-row">
        <div><p class="eyebrow">Club Fitting</p><h2 style="margin-top:0.6rem">Fittings that outperform the clubs you play now.</h2></div>
        <a class="btn btn-outline" href="fitting.html">All fittings</a>
      </div>
      <div class="grid-fit" style="margin-top:2.5rem">
        ${FITTINGS.map(
          (f) => `<a class="card" href="fitting.html#${f.id}">
            <div style="display:flex;justify-content:space-between;gap:0.75rem">
              <h3>${f.name}</h3><span class="price">${f.price}</span>
            </div>
            ${f.featured ? `<span class="chip" style="margin-top:0.5rem">Best value</span>` : ""}
            <p class="muted">${f.summary}</p>
          </a>`,
        ).join("")}
      </div>
    </div></section>
    <section class="section"><div class="wrap">
      <div class="cta-row">
        <div><p class="eyebrow">The Studio</p><h2 style="margin-top:0.6rem">K Street, third floor.</h2></div>
        <a class="btn btn-outline" href="studio.html">Full gallery</a>
      </div>
      <div class="gallery-row" style="margin-top:2rem">
        ${GALLERY.slice(0, 6)
          .map(
            ([src, alt, cap]) =>
              `<figure><img src="${src}" alt="${alt}" loading="lazy"/><figcaption>${cap}</figcaption></figure>`,
          )
          .join("")}
      </div>
    </div></section>
    <section class="band"><div class="wrap section">
      <p class="eyebrow">From the fitting bay</p>
      <h2 style="margin-top:0.6rem">Golfers keep coming back.</h2>
      <div class="grid-3" style="margin-top:2.5rem">
        ${REVIEWS.map(
          ([name, service, quote]) =>
            `<blockquote class="quote"><div class="stars">★★★★★</div><p>“${quote}”</p><footer class="muted" style="color:rgb(244 240 230 / 0.6);margin-top:1rem">${name} · ${service}</footer></blockquote>`,
        ).join("")}
      </div>
    </div></section>
    <section class="section"><div class="wrap grid-2">
      <img class="photo" src="images/dc-cherry.jpg" alt="Jefferson Memorial through cherry blossoms" loading="lazy"/>
      <div>
        <p class="eyebrow">About</p>
        <h2 style="margin-top:0.6rem">Matt Grabowy, co-founder.</h2>
        <p class="muted">Beginning in 2016, The Golf Doctor-DC brought two decades of fitting and building — from beginners to PGA Tour winners — to Washington. The original Golf Doctor was founded in 1996 to give every golfer a level of service previously reserved for professionals.</p>
        <ul class="muted" style="padding-left:1.1rem">
          ${CREDENTIALS.slice(0, 4)
            .map(([t, d]) => `<li><strong>${t}.</strong> ${d}</li>`)
            .join("")}
        </ul>
        <a class="btn btn-outline" href="about.html">Read the full story</a>
      </div>
    </div></section>
    <section class="surface"><div class="wrap section cta-row">
      <div>
        <h2>Ready to get fitted?</h2>
        <p class="muted">All fittings by appointment. The studio is on the third floor at 1108 K Street NW.</p>
      </div>
      <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
        <a class="btn btn-primary" href="${BOOKSY}" target="_blank" rel="noreferrer">Book a Fitting</a>
        <a class="btn btn-outline" href="tel:+12028274202">Call ${PHONE}</a>
      </div>
    </div></section>
  </main>`,
});

const fitting = layout({
  title: "Club Fitting | The Golf Doctor DC",
  path: "fitting.html",
  body: `<main id="main">
    ${hero({
      image: "images/sunset-golf.jpg",
      alt: "Golfer silhouetted at sunset",
      eyebrow: "Club Fitting",
      title: "better golf…by design",
      subtitle:
        "A comprehensive, performance-based process developed over 20 years — with thousands of test club combinations and TrackMan 4.",
    })}
    <section class="section"><div class="wrap grid-2">
      <img class="photo" src="images/trackman-4.jpg" alt="Orange TrackMan launch monitor on the grass"/>
      <div>
        <p class="eyebrow">The process</p>
        <h2 style="margin-top:0.6rem">Clubs that outperform what you play now.</h2>
        <div class="prose" style="margin-top:1.1rem">
          <p>We use the latest analysis equipment, including TrackMan 4, to collect data while you hit — and more importantly, so you can see what is actually happening and where your shots actually go. Ball speed, spin rate, and the rest of the story, live.</p>
          <p>Other so-called fitting systems give you few options even as they make you believe you are being accurately fit. We have literally thousands of different test club combinations to determine the proper shaft for you.</p>
        </div>
        <a class="btn btn-primary" href="${BOOKSY}" target="_blank" rel="noreferrer">Book a fitting</a>
      </div>
    </div></section>
    <section class="surface"><div class="section wrap">
      <p class="eyebrow">Sessions & pricing</p>
      <h2 style="margin-top:0.6rem">Choose the work that matches the bag.</h2>
      <div style="display:grid;gap:1.5rem;margin-top:2.5rem">
        ${FITTINGS.map(
          (f) => `<article class="card" id="${f.id}">
            <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap">
              <div><h3>${f.name}</h3><p class="muted">${f.duration}</p></div>
              <div style="text-align:right"><p class="price" style="font-family:var(--display);font-size:2rem">${f.price}</p>${f.featured ? `<span class="chip">$200 off unbundled</span>` : ""}</div>
            </div>
            <div class="prose" style="margin-top:1rem">${f.body.map((p) => `<p>${p}</p>`).join("")}</div>
            <a class="btn btn-primary" href="${BOOKSY}" target="_blank" rel="noreferrer">Book Now</a>
          </article>`,
        ).join("")}
      </div>
    </div></section>
  </main>`,
});

const clubMaking = layout({
  title: "Club Making | The Golf Doctor DC",
  path: "club-making.html",
  body: `<main id="main">
    ${hero({
      image: "images/workshop-bench.jpg",
      alt: "Club making workbench with shafts, grips, and tools",
      eyebrow: "Club Making",
      title: "Built on site. By the same person who fitted you.",
      subtitle: "The best fitting in the world is worthless if the clubs you play don't match the prescription.",
    })}
    <section class="section"><div class="wrap grid-2">
      <div>
        <p class="eyebrow">What happens after the fitting</p>
        <h2 style="margin-top:0.6rem">You know exactly who is building your clubs.</h2>
        <div class="prose" style="margin-top:1.1rem">
          <p>In most shops, the fitter takes your numbers and phones or emails them off to some unidentified person who — hopefully — builds the clubs to match. Maybe they take the time. Maybe they don’t. Maybe it is an assembly line where ten people touch your clubs and none of them are accountable for mistakes.</p>
          <p>In the end, you are at the mercy of whoever builds your clubs. At The Golf Doctor-DC it is all done on site. We are certified by the Professional Clubmakers Society and the Golf Clubmakers Association.</p>
        </div>
      </div>
      <img class="photo" src="images/workshop.jpg" alt="Loft and lie machine in the club making workshop"/>
    </div></section>
    <section class="surface"><div class="section wrap">
      <p class="eyebrow">Full-service shop</p>
      <h2 style="margin-top:0.6rem">Alterations and adjustments for the clubs you already own.</h2>
      <div class="grid-3" style="margin-top:2.5rem">
        ${SHOP.map(([t, d]) => `<article class="card"><h3>${t}</h3><p class="muted">${d}</p></article>`).join("")}
      </div>
      <div style="margin-top:2rem;display:flex;gap:0.6rem;flex-wrap:wrap">
        <a class="btn btn-primary" href="tel:+12028274202">Call about shop work</a>
        <a class="btn btn-outline" href="fitting.html">Start with a fitting</a>
      </div>
    </div></section>
  </main>`,
});

const giftCards = layout({
  title: "Gift Cards | The Golf Doctor DC",
  path: "gift-cards.html",
  body: `<main id="main">
    ${hero({
      image: "images/gift-card.jpg",
      alt: "Golf Doctor DC gift card",
      eyebrow: "Gift Cards",
      title: "The gift that actually fits.",
      subtitle: "Fittings, simulator time, club making, and shop work — a Golf Doctor DC gift card covers all of it.",
      compact: true,
    })}
    <section class="section"><div class="wrap grid-2" style="align-items:start">
      <div>
        <p class="eyebrow">Online gift card</p>
        <h2 style="margin-top:0.6rem">Buy an online gift card</h2>
        <p class="muted">Choose an amount and pay with PayPal on this page. We’ll email the card so the recipient can use it in the studio for any fitting or shop service.</p>
        <ul class="muted" style="margin-top:1.5rem">
          <li>Introductory fitting — $150</li>
          <li>Driver or long game — $150</li>
          <li>Iron fitting — $175</li>
          <li>Full bag fitting — $400</li>
        </ul>
      </div>
      <form class="card" id="gift-paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_xclick"/>
        <input type="hidden" name="business" value="matt@golfdoctordc.com"/>
        <input type="hidden" name="currency_code" value="USD"/>
        <input type="hidden" name="no_shipping" value="1"/>
        <input type="hidden" name="item_name" value="Golf Doctor DC Gift Card"/>
        <input type="hidden" name="item_number" value="GIFT-CARD"/>
        <input type="hidden" name="amount" id="pp-amount" value="150.00"/>
        <input type="hidden" name="on0" value="Details"/>
        <input type="hidden" name="os0" id="pp-note" value="Studio gift card"/>
        <h3>Payment for Gift Card</h3>
        <p class="muted">Pay with PayPal. We’ll email the card after the payment clears.</p>
        <div class="amounts" style="margin-top:1.25rem">
          ${[50, 100, 150, 175, 250, 400]
            .map(
              (n) =>
                `<button type="button" data-amount="${n}" class="${n === 150 ? "on" : ""}">$${n}</button>`,
            )
            .join("")}
          <button type="button" data-amount="custom">Custom</button>
        </div>
        <label id="custom-wrap" class="hidden">Custom amount<input id="custom-amount" inputmode="decimal" placeholder="25.00"/></label>
        <label>Your name<input id="from-name" placeholder="Who is this from?"/></label>
        <label>Recipient<input id="recipient-name" placeholder="Who is this for?"/></label>
        <label>Recipient email<input id="recipient-email" type="email" placeholder="Where should we send the card?"/></label>
        <label>Message<textarea id="gift-note" placeholder="A short note to include with the card"></textarea></label>
        <p style="margin:1rem 0 0.6rem;font-family:var(--display);font-size:2rem" id="pp-total">$150.00</p>
        <button class="btn" type="submit" style="width:100%;background:#FFC439;color:#003087;border:0;font-weight:700">Pay with PayPal</button>
        <p class="muted" style="text-align:center;margin-top:0.7rem;font-size:0.8rem">Checkout opens on PayPal. Payment goes to matt@golfdoctordc.com.</p>
      </form>
    </div></section>
  </main>`,
});

const tradeIn = layout({
  title: "Trade In Clubs | The Golf Doctor DC",
  path: "trade-in.html",
  body: `<main id="main">
    ${hero({
      image: "images/irons.jpg",
      alt: "Set of irons on the green",
      eyebrow: "Trade In",
      title: "Turn old clubs into store credit.",
      subtitle: "Look up what you have, get an instant value, and put the credit toward new equipment fit here in the studio.",
    })}
    <section class="section"><div class="wrap">
      <p class="eyebrow">How it works</p>
      <h2 style="margin-top:0.6rem;max-width:36rem">Three steps. Credit you can spend here.</h2>
      <div class="grid-3" style="margin-top:2.5rem">
        <article class="card"><p class="eyebrow">01</p><h3>Look up your clubs</h3><p class="muted">Search drivers, irons, wedges, putters, and accessories in the Golf Stix value guide.</p></article>
        <article class="card"><p class="eyebrow">02</p><h3>Get an instant value</h3><p class="muted">Real-time market pricing — not a guess. Trade-in values meet or exceed typical online offers.</p></article>
        <article class="card"><p class="eyebrow">03</p><h3>Apply it as store credit</h3><p class="muted">Credit goes toward a fitting, new clubs, or club work at The Golf Doctor DC. This is store credit, not cash.</p></article>
      </div>
    </div></section>
    <section class="surface"><div class="section wrap">
      <div class="cta-row">
        <div>
          <p class="eyebrow">Value guide</p>
          <h2 style="margin-top:0.6rem">Get your trade-in value</h2>
          <p class="muted" style="max-width:36rem">Search Golf Clubs or Accessories below. When you are ready, complete the trade and we will apply the credit at the studio.</p>
        </div>
        <a class="btn btn-outline" href="${TRADE}" target="_blank" rel="noreferrer">Open in a new tab</a>
      </div>
      <iframe class="widget-frame" style="margin-top:1.5rem" title="Golf Stix trade-in value guide" src="${TRADE}"></iframe>
    </div></section>
    <section class="section"><div class="wrap" style="max-width:40rem">${form("trade")}</div></section>
  </main>`,
});

const about = layout({
  title: "About | The Golf Doctor DC",
  path: "about.html",
  body: `<main id="main">
    ${hero({
      image: "images/dc-cherry.jpg",
      alt: "Jefferson Memorial through cherry blossoms",
      eyebrow: "About Us",
      title: "The Golf Doctor-DC",
      subtitle: "Expertise and technology in Washington, D.C. — from beginners to PGA Tour winners.",
    })}
    <section class="section"><div class="wrap" style="display:grid;gap:2.5rem">
      <div class="grid-2" style="align-items:start">
        <div>
          <p class="eyebrow">The fitter</p>
          <h2 style="margin-top:0.6rem">Matt Grabowy has been fitting and building clubs for more than 20 years.</h2>
          <div class="prose" style="margin-top:1.1rem">
            <p>Beginning in 2016, The Golf Doctor-DC, led by co-founder Matt Grabowy, brought that work to Washington. Players of every skill level come through the studio — first-time golfers and Tour winners alike.</p>
            <p>We maintain the highest professional standards in the industry, certified by both the Professional Clubmaker’s Society and the Golf Clubmakers Association.</p>
          </div>
          <a class="btn btn-primary" href="book.html">Book a fitting</a>
        </div>
        <ol class="timeline">
          <li><p class="year">1996</p><p class="muted">The Golf Doctor is founded with a single goal: properly fitted golf equipment for the golfing public — the same standard of service previously available only to the professional golfer.</p></li>
          <li><p class="year">2011</p><p class="muted">Matt Grabowy is recognized by Golf Digest as a Top 100 Clubfitter, the first of five listings.</p></li>
          <li><p class="year">2016</p><p class="muted">The Golf Doctor-DC opens in Washington, bringing the fitting studio and on-site build shop to K Street.</p></li>
          <li><p class="year">2018</p><p class="muted">Matt is named International Clubmaker of the Year by the International Clubmakers Guild.</p></li>
          <li><p class="year">2019</p><p class="muted">Matt becomes a founding member of TaylorMade Golf’s National Fitters Council.</p></li>
        </ol>
      </div>
    </div></section>
    <section class="surface"><div class="section wrap">
      <p class="eyebrow">Credentials</p>
      <h2 style="margin-top:0.6rem">Certified, listed, and still independent.</h2>
      <div class="grid-fit" style="margin-top:2.5rem">
        ${CREDENTIALS.map(
          ([t, d]) => `<article class="card"><h3 style="font-size:1.2rem">${t}</h3><p class="muted">${d}</p></article>`,
        ).join("")}
      </div>
      <a class="btn btn-outline" href="partners.html" style="margin-top:1.5rem">See partner certifications</a>
    </div></section>
  </main>`,
});

const partners = layout({
  title: "Partners | The Golf Doctor DC",
  path: "partners.html",
  body: `<main id="main">
    ${hero({
      image: "images/woods.jpg",
      alt: "Driver and fairway woods on morning grass",
      eyebrow: "Partners",
      title: "Certified by the names on the shafts.",
      subtitle: "Independent fitting — with factory recognition from the companies that make the equipment.",
      compact: true,
    })}
    <section class="section"><div class="wrap">
      <p class="eyebrow">Certifications</p>
      <h2 style="margin-top:0.6rem;max-width:36rem">The same standards the manufacturers require of their own fitters.</h2>
      <p class="muted" style="max-width:40rem">We are not a big-box fitting bay. The studio is independently owned, and the certifications below are earned — Golf Digest listings, clubmaking guilds, and brand fitter programs including PING, Callaway, KBS, True Temper, and Rifle.</p>
      <div class="grid-3" style="margin-top:2.5rem">
        ${CREDENTIALS.map(
          ([t, d]) => `<article class="card" style="min-height:10rem;display:flex;flex-direction:column;justify-content:space-between"><h3>${t}</h3><p class="muted">${d}</p></article>`,
        ).join("")}
      </div>
      <a class="btn btn-primary" href="fitting.html" style="margin-top:2rem">Book with a certified fitter</a>
    </div></section>
  </main>`,
});

const studio = layout({
  title: "Studio Images | The Golf Doctor DC",
  path: "studio.html",
  body: `<main id="main">
    ${hero({
      image: "images/studio.jpg",
      alt: "Fitting studio with turf, lounge chairs, and launch monitor",
      eyebrow: "Studio Images",
      title: "The fitting bay, the putting green, the build shop.",
      subtitle: "A 1,600-square-foot studio on the third floor of 1108 K Street NW. The elevator opens into the room.",
    })}
    <section class="section"><div class="wrap">
      <p class="eyebrow">Gallery</p>
      <h2 style="margin-top:0.6rem">Inside The Golf Doctor DC</h2>
      <div class="masonry" style="margin-top:2.5rem">
        ${GALLERY.map(
          ([src, alt, cap]) =>
            `<figure><img src="${src}" alt="${alt}" loading="lazy"/><figcaption>${cap}</figcaption></figure>`,
        ).join("")}
      </div>
    </div></section>
  </main>`,
});

const location = layout({
  title: "Location | The Golf Doctor DC",
  path: "location.html",
  body: `<main id="main">
    ${hero({
      image: "images/dc-street.jpg",
      alt: "Watercolor sketch of The Golf Doctor DC on K Street",
      eyebrow: "Location",
      title: "1108 K Street NW, third floor.",
      subtitle: "Between 11th and 12th Streets NW, downtown Washington. Garage and street parking. Elevator to the studio.",
    })}
    <section class="section"><div class="wrap grid-2" style="align-items:start">
      <div>
        <p class="eyebrow">Contact us</p>
        <h2 style="margin-top:0.6rem">All fittings by appointment only.</h2>
        <p class="muted">Walk-ins are strongly encouraged to call or email first. Other hours are available at a client’s request.</p>
        <ul style="list-style:none;padding:0;margin:1.5rem 0;display:grid;gap:0.8rem">
          <li>The Golf Doctor-DC<br/>1108 K St NW, Floor 3<br/>Washington, DC 20005<br/><span class="muted">Between 11th Street NW and 12th Street NW</span></li>
          <li><a href="tel:+12028274202">${PHONE}</a></li>
          <li><a href="mailto:${EMAIL}?subject=Help%20me%20break%20Par!">${EMAIL}</a></li>
          <li>Evening fittings on Tuesday and Thursday</li>
        </ul>
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
          <a class="btn btn-primary" href="${MAPS}" target="_blank" rel="noreferrer">Get directions</a>
          <a class="btn btn-outline" href="${BOOKSY}" target="_blank" rel="noreferrer">Book Now</a>
        </div>
        <div style="margin-top:1.5rem;border:1px solid var(--border);border-radius:16px;overflow:hidden">
          <iframe title="Map of The Golf Doctor DC" src="https://maps.google.com/maps?q=1108%20K%20St%20NW%20Floor%203%20Washington%20DC%2020005&output=embed" width="100%" height="280" style="border:0" loading="lazy"></iframe>
        </div>
        <table class="hours" style="margin-top:1.5rem">
          <thead><tr><th>Day</th><th>Hours</th><th></th></tr></thead>
          <tbody>
            <tr><td>Monday</td><td>10:00am – 4:00pm</td><td class="muted">By appointment</td></tr>
            <tr><td>Tuesday</td><td>10:00am – 4:00pm</td><td class="muted">Evening fittings available</td></tr>
            <tr><td>Wednesday</td><td>10:00am – 4:00pm</td><td class="muted">By appointment</td></tr>
            <tr><td>Thursday</td><td>10:00am – 4:00pm</td><td class="muted">Evening fittings available</td></tr>
            <tr><td>Friday</td><td>10:00am – 4:00pm</td><td class="muted">By appointment</td></tr>
            <tr><td>Saturday</td><td>Closed</td><td class="muted">Hours available on request</td></tr>
            <tr><td>Sunday</td><td>Closed</td><td class="muted">Hours available on request</td></tr>
          </tbody>
        </table>
      </div>
      ${form("contact")}
    </div></section>
  </main>`,
});

const book = layout({
  title: "Book Now | The Golf Doctor DC",
  path: "book.html",
  body: `<main id="main">
    ${hero({
      image: "images/putting-1.jpg",
      alt: "Putting green at dusk",
      eyebrow: "Book Now",
      title: "Schedule a fitting.",
      subtitle: "Online booking is through Booksy. Prefer the phone? Call the studio and we’ll find a time.",
      compact: true,
    })}
    <section class="section"><div class="wrap">
      <div class="card cta-row">
        <div>
          <p class="eyebrow">Booksy</p>
          <h2 style="margin-top:0.4rem">Reserve a time online</h2>
          <p class="muted" style="max-width:36rem">Choose a service, pick a slot, and you’re on the books. All fittings are by appointment only.</p>
        </div>
        <a class="btn btn-primary btn-lg" href="${BOOKSY}" target="_blank" rel="noreferrer">Open Booksy</a>
      </div>
      <h3 style="margin-top:2.5rem;font-size:1.6rem">Services</h3>
      <ul style="list-style:none;padding:0;margin:1rem 0 0;border:1px solid var(--border);border-radius:16px;overflow:hidden;background:var(--paper)">
        ${FITTINGS.map(
          (f) =>
            `<li style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:1rem 1.25rem;border-bottom:1px solid var(--border)"><span><strong>${f.name}</strong><br/><span class="muted">${f.duration}</span></span><span class="price">${f.price}</span></li>`,
        ).join("")}
      </ul>
      <p style="margin-top:1.25rem"><a class="btn btn-outline" href="fitting.html">See fitting details</a></p>
    </div></section>
  </main>`,
});

mkdirSync(join(ROOT, "images"), { recursive: true });
cpSync(join(process.cwd(), "public/images"), join(ROOT, "images"), { recursive: true });
cpSync(join(process.cwd(), "public/favicon.svg"), join(ROOT, "favicon.svg"));

const pages = {
  "index.html": home,
  "fitting.html": fitting,
  "club-making.html": clubMaking,
  "gift-cards.html": giftCards,
  "trade-in.html": tradeIn,
  "about.html": about,
  "partners.html": partners,
  "studio.html": studio,
  "location.html": location,
  "book.html": book,
};

for (const [name, html] of Object.entries(pages)) {
  writeFileSync(join(ROOT, name), html);
}

writeFileSync(
  join(ROOT, "robots.txt"),
  "User-agent: *\nAllow: /\n",
);

console.log("Wrote", Object.keys(pages).length, "pages to", ROOT);
