// ===== NAV =====
(function(){
  const nav = document.querySelector('nav.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const hasHero = document.querySelector('.hero');
  if(!hasHero && nav) nav.classList.add('solid');

  function updateNav(){
    if(!nav || !hasHero) return;
    const threshold = window.innerHeight * 0.6;
    nav.classList.toggle('solid', window.scrollY > threshold);
  }
  window.addEventListener('scroll', updateNav, {passive:true});
  updateNav();

  if(toggle && links){
    toggle.addEventListener('click', ()=>{
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }
})();

// ===== HERO CAROUSEL =====
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if(!slides.length) return;
  let cur = 0, timer;
  function go(n){
    slides[cur].classList.remove('active');
    if(dots[cur]) dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    if(dots[cur]) dots[cur].classList.add('active');
  }
  function auto(){ timer = setInterval(()=> go(cur+1), 6000); }
  dots.forEach(d => d.addEventListener('click', ()=>{ clearInterval(timer); go(+d.dataset.slide); auto(); }));
  auto();
})();

// ===== LIGHTBOX (galería) =====
(function(){
  const items = document.querySelectorAll('.gal-item');
  const lb = document.getElementById('lb');
  if(!items.length || !lb) return;
  const lbImg = document.getElementById('lb-img');
  const imgs = Array.from(items).map(i => i.querySelector('img').src);
  let current = 0;
  items.forEach((el, i) => {
    el.addEventListener('click', ()=>{
      current = i;
      lbImg.src = imgs[current];
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  function nav(d){ current = (current+d+imgs.length)%imgs.length; lbImg.src = imgs[current]; }
  lb.addEventListener('click', e => { if(e.target===lb || e.target.classList.contains('lb-close')) close(); });
  const prev = lb.querySelector('.lb-prev'), next = lb.querySelector('.lb-next');
  if(prev) prev.addEventListener('click', e => { e.stopPropagation(); nav(-1); });
  if(next) next.addEventListener('click', e => { e.stopPropagation(); nav(1); });
  document.addEventListener('keydown', e => {
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') nav(-1);
    if(e.key==='ArrowRight') nav(1);
  });
})();

// ===== GALLERY FILTERS =====
(function(){
  const filters = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gal-item');
  if(!filters.length) return;
  filters.forEach(f => f.addEventListener('click', ()=>{
    filters.forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    const cat = f.dataset.cat;
    items.forEach(it => {
      it.style.display = (cat==='all' || it.dataset.cat===cat) ? '' : 'none';
    });
  }));
})();

// ===== FORMULARIO DE CONTACTO =====
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const WA = '5215532749722';
  form.addEventListener('submit', e => {
    e.preventDefault();
    const g = id => (document.getElementById(id)||{}).value || '';
    const nombre=g('nombre').trim(), tel=g('telefono').trim(), tipo=g('tipo'),
          ubicacion=g('ubicacion').trim(), detalles=g('detalles').trim();
    if(!nombre || !tel || !tipo){ alert('Completa nombre, WhatsApp y tipo de mueble.'); return; }
    const msg = `Hola, vengo del formulario de contacto.\n\n*Nombre:* ${nombre}\n*WhatsApp:* ${tel}\n*Mueble:* ${tipo}\n`
      + (ubicacion ? `*Ubicación:* ${ubicacion}\n` : '')
      + (detalles ? `\n*Detalles:* ${detalles}` : '');
    if(window.gtag) gtag('event','generate_lead',{event_category:'WhatsApp',event_label:'Contacto form'});
    window.location.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    setTimeout(()=>{
      form.style.display='none';
      const ok = document.getElementById('form-success');
      if(ok) ok.classList.add('show');
    }, 500);
  });
})();
