(function () {
  'use strict';

  var WA_NUMBER = '24174495964';
  var chat = document.getElementById('chat');
  var toggle = document.getElementById('chat-toggle');
  var body = document.getElementById('chat-body');
  var chipsBox = document.getElementById('chat-chips');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');
  var fab = document.getElementById('fab');
  var started = false;

  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function waButton(text, label) {
    return '<a class="chat__cta" href="' + waLink(text) + '" target="_blank" rel="noopener">' + (label || 'Continuer sur WhatsApp') + '</a>';
  }
  var DEVIS_WA = "Bonjour GROUPE JÉRUSALEM, je souhaite un devis.";

  // Base de connaissances issue de la grille tarifaire et de la fiche d'enregistrement
  var KB = [
    { id: 'bonjour', keys: ['bonjour', 'bonsoir', 'salut', 'hello', 'coucou', 'bjr'],
      answer: "Bonjour et bienvenue chez <strong>GROUPE JÉRUSALEM</strong> ! Je peux vous renseigner sur la location de véhicules, nos tarifs, nos services audiovisuels et d'impression, ou vous aider à demander un devis." },
    { id: 'services', keys: ['service', 'prestation', 'metier', 'que faites', 'activite', 'domaine', 'proposez', 'offre', 'competence'],
      answer: "Le Groupe propose :<ul><li><strong>Location de véhicules</strong> avec chauffeur</li><li><strong>Reportage, montage vidéo, photographie</strong>, infographie, communication et événementiel</li><li><strong>Impression numérique et sérigraphie</strong></li><li>Mobile-money, vente Edan, bouquets satellitaires, bureautique</li></ul>Qu'est-ce qui vous intéresse ?",
      chips: ['Location', 'Tarifs', 'Vidéo', 'Impression'] },
    { id: 'location', keys: ['location', 'louer', 'vehicule', 'voiture', 'chauffeur', 'flotte', 'pick', 'hilux', 'land cruiser', 'rav', 'sonata', 'hiace', 'coaster', 'bus', 'minibus', '4x4', 'transport', 'deplacement'],
      answer: "Nous louons des véhicules <strong>avec chauffeur</strong> : Sonata, pick-up (boîte manuelle ou automatique), Hiace Bus, Coaster, dernier RAV 4 et Toyota Land Cruiser (TXL, LC 300, V8). Les tarifs existent pour Libreville et pour l'intérieur du pays.",
      chips: ['Tarifs', 'Demander un devis', 'Au mois'] },
    { id: 'tarifs', keys: ['tarif', 'prix', 'cout', 'cher', 'montant', 'grille', 'par jour', 'land cruiser', 'rav', 'sonata', 'hiace', 'coaster', 'interieur'],
      answer: "Tarifs par jour, <strong>avec chauffeur</strong> (Libreville / L'Intérieur) :<ul><li>Sonata : 120 000 F</li><li>Pick-up manuel : 170 000 / 200 000 F</li><li>Pick-up automatique : 200 000 / 230 000 F</li><li>Hiace Bus : 170 000 / 200 000 F</li><li>RAV 4 : 170 000 / 200 000 F</li><li>Coaster : 270 000 / 300 000 F</li><li>Land Cruiser TXL : 270 000 / 300 000 F</li><li>Land Cruiser V8 : 350 000 / 400 000 F</li><li>Land Cruiser LC 300 : 370 000 / 400 000 F</li></ul><a class=\"chat__link\" href=\"#location\" data-close>Voir la grille complète</a>",
      chips: ['Demander un devis', 'Au mois'] },
    { id: 'mois', keys: ['mois', 'au mois', 'par mois', 'mensuel', 'forfait', 'longue duree', 'agence', 'entreprise', 'sans chauffeur', 'contrat'],
      answer: "Pour une location <strong>sans chauffeur</strong> ou un <strong>forfait mensuel</strong> (agences et entreprises), nous établissons une proposition sur mesure. Indiquez-nous le véhicule souhaité et la durée :<br>" + waButton("Bonjour GROUPE JÉRUSALEM, je souhaite un forfait de location au mois.", 'Demander un forfait sur WhatsApp') },
    { id: 'video', keys: ['video', 'reportage', 'montage', 'photo', 'infograph', 'communication', 'evenement', 'regie', 'drone', 'camera', 'film', 'tournage', 'couverture'],
      answer: "Nous réalisons du <strong>reportage</strong>, du <strong>montage vidéo</strong>, de la <strong>photographie</strong> et de l'<strong>infographie</strong>, avec régie mobile, caméras et drones, pour vos événements et votre communication.",
      chips: ['Demander un devis', 'Contact'] },
    { id: 'impression', keys: ['impression', 'imprim', 'serigraph', 'tee shirt', 'tshirt', 't shirt', 'casquette', 'mug', 'stylo', 'support', 'flocage', 'personnalis', 'cadeau', 'parapluie'],
      answer: "Notre atelier fait de l'<strong>impression numérique et de la sérigraphie</strong> sur tous types de supports : t-shirts, polos, casquettes, mugs, stylos, parapluies et objets personnalisés.",
      chips: ['Demander un devis', 'Contact'] },
    { id: 'autres', keys: ['mobile money', 'mobile-money', 'edan', 'bouquet', 'satellite', 'canal', 'bureautique', 'photocopie'],
      answer: "Le Groupe propose aussi des services de proximité : <strong>mobile-money</strong>, <strong>vente Edan</strong>, <strong>bouquets satellitaires</strong> et <strong>bureautique</strong>." },
    { id: 'devis', keys: ['devis', 'estimation', 'chiffrage', 'chiffrer', 'reserv', 'commander', 'disponib'],
      answer: "Pour un devis ou une réservation, indiquez-nous le service souhaité, les dates et le lieu :<br>" + waButton(DEVIS_WA, 'Demander un devis sur WhatsApp') + '<a class="chat__link" href="#contact" data-close>ou remplir le formulaire de devis</a>' },
    { id: 'zone', keys: ['ou etes', 'etes ou', 'c est ou', 'ou se trouve', 'trouver', 'adresse', 'situe', 'localisation', 'siege', 'bureau', 'libreville', 'zone', 'province', 'interieur', 'deplace', 'venez', 'intervenez'],
      answer: "Notre siège est à <strong>Libreville, derrière l'École Normale (ENS)</strong> — BP 150. Nos véhicules circulent à Libreville et à l'intérieur du pays.",
      chips: ['Contact', 'Tarifs'] },
    { id: 'contact', keys: ['contact', 'telephone', 'numero', 'appeler', 'joindre', 'mail', 'email', 'courriel', 'whatsapp', 'parler', 'humain', 'conseiller', 'rappeler'],
      answer: "Vous pouvez nous joindre :<ul><li>Tél. : <a href=\"tel:+24174495964\">+241 74 49 59 64</a> / <a href=\"tel:+24162775259\">62 77 52 59</a></li><li>E-mail : <a href=\"mailto:jerusalemagencedevoyage@gmail.com\">jerusalemagencedevoyage@gmail.com</a></li><li>Siège : derrière l'ENS, Libreville</li></ul>" + waButton("Bonjour GROUPE JÉRUSALEM, je souhaite être recontacté.", 'Écrire sur WhatsApp') },
    { id: 'groupe', keys: ['groupe', 'societe', 'qui etes', 'presentez', 'gerant', 'directeur', 'dirigeant', 'responsable', 'victor', 'rccm', 'legal'],
      answer: "GROUPE JÉRUSALEM est une société gabonaise (SUARL) installée à Libreville, dirigée par <strong>M. Victor MOUNDOUNGA MOUNDOUNGA</strong>, gérant. Immatriculée au RCCM sous le n° RG-LBV-2017B23084." },
    { id: 'emploi', keys: ['emploi', 'recrut', 'stage', 'cv', 'candidature', 'travailler chez', 'job', 'poste'],
      answer: "Pour une candidature ou un stage, vous pouvez adresser votre CV à <a href=\"mailto:jerusalemagencedevoyage@gmail.com\">jerusalemagencedevoyage@gmail.com</a>." },
    { id: 'merci', keys: ['merci', 'au revoir', 'bye', 'a bientot', 'parfait', 'super', 'ok merci'],
      answer: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. À bientôt chez GROUPE JÉRUSALEM." }
  ];

  var CHIP_MAP = {
    'Nos services': 'services', 'Location': 'location', 'Tarifs': 'tarifs', 'Au mois': 'mois', 'Vidéo': 'video',
    'Impression': 'impression', 'Demander un devis': 'devis', 'Contact': 'contact', 'Où êtes-vous ?': 'zone'
  };
  var DEFAULT_CHIPS = ['Nos services', 'Tarifs', 'Demander un devis', 'Où êtes-vous ?', 'Contact'];

  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9+ ]/g, ' ').replace(/\s+/g, ' ');
  }

  function findAnswer(q) {
    var t = ' ' + norm(q) + ' ';
    var best = null, bestScore = 0;
    KB.forEach(function (e) {
      var score = 0;
      e.keys.forEach(function (k) { if (t.indexOf(' ' + k) !== -1) score += k.length > 5 ? 2 : 1; });
      // Les salutations ne l'emportent que si la question ne contient rien d'autre
      if (e.id === 'bonjour' && score) score = 0.5;
      if (score > bestScore) { bestScore = score; best = e; }
    });
    return best;
  }

  function addMsg(html, who) {
    var m = document.createElement('div');
    m.className = 'chat__msg chat__msg--' + who;
    m.innerHTML = html;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  function setChips(list) {
    chipsBox.innerHTML = '';
    (list || DEFAULT_CHIPS).forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat__chip';
      b.textContent = c;
      b.addEventListener('click', function () { ask(c, CHIP_MAP[c]); });
      chipsBox.appendChild(b);
    });
  }

  function botReply(html, chips) {
    var typing = addMsg('<span class="chat__typing"><i></i><i></i><i></i></span>', 'bot');
    setTimeout(function () {
      typing.innerHTML = html;
      body.scrollTop = body.scrollHeight;
      setChips(chips);
    }, 550 + Math.min(html.length, 400));
  }

  function ask(text, forcedId) {
    addMsg(text.replace(/</g, '&lt;'), 'user');
    var entry = null;
    if (forcedId) KB.forEach(function (e) { if (e.id === forcedId) entry = e; });
    if (!entry) entry = findAnswer(text);
    if (entry) {
      botReply(entry.answer, entry.chips);
    } else {
      botReply("Je n'ai pas la réponse précise à cette question, mais notre équipe peut vous répondre directement :<br>" +
        waButton("Bonjour GROUPE JÉRUSALEM, j'ai une question : " + text, 'Poser ma question sur WhatsApp'));
    }
  }

  function open() {
    chat.classList.add('is-open');
    fab.classList.add('is-chat-open');
    chat.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    if (!started) {
      started = true;
      botReply("Bonjour 👋 Je suis l'assistant de <strong>GROUPE JÉRUSALEM</strong>. Posez-moi vos questions sur la location, nos tarifs ou nos services — je vous réponds tout de suite.");
    }
    setTimeout(function () { input.focus(); }, 300);
  }
  function close() {
    chat.classList.remove('is-open');
    fab.classList.remove('is-chat-open');
    chat.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () { chat.classList.contains('is-open') ? close() : open(); });
  document.getElementById('chat-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && chat.classList.contains('is-open')) close(); });
  body.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-close]');
    if (a) close();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = '';
    ask(q);
  });

  // Invitation discrète après quelques secondes, une seule fois par visite
  setTimeout(function () {
    try { if (sessionStorage.getItem('gjChatHint')) return; sessionStorage.setItem('gjChatHint', '1'); } catch (e) {}
    if (!chat.classList.contains('is-open')) fab.classList.add('is-hint');
    setTimeout(function () { fab.classList.remove('is-hint'); }, 6000);
  }, 5000);
})();
