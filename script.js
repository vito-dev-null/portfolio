document.addEventListener('DOMContentLoaded',()=>{
  // year
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  // nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if(navToggle && nav){
    navToggle.addEventListener('click',()=>{
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? 'none' : 'block';
    });
  }

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
          // hide mobile nav after click
          if(window.innerWidth < 720 && nav){nav.style.display='none';navToggle.setAttribute('aria-expanded','false')}
        }
      }
    })
  })

  // form
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const privacy = form.privacy.checked;
      if(!name || !email || !message || !privacy){
        status.textContent = 'Per favore compila tutti i campi e accetta la privacy.';
        status.style.color = 'var(--accent)';
        return;
      }
      // For demo: open mailto with prefilled subject and body
      const subject = encodeURIComponent('Richiesta da sito — ' + name);
      const body = encodeURIComponent(message + '\n\n--\n' + name + '\n' + email);
      window.location.href = `mailto:user@example.com?subject=${subject}&body=${body}`;
      status.textContent = 'Apro il client email per inviare il messaggio...';
    })
  }

  // GitHub projects section
  const githubProjects = document.getElementById('github-projects');
  if(githubProjects){
    const languageColors = {
      JavaScript: '#f1c40f',
      TypeScript: '#4f9cff',
      Java: '#e76f51',
      HTML: '#ff7f50',
      CSS: '#5dade2',
      Python: '#4ecdc4',
      Shell: '#2ecc71',
      PHP: '#8e44ad'
    };

    const renderGithubProjects = (repos) => {
      if (!repos.length) {
        githubProjects.insertAdjacentHTML('beforeend', '<div class="github-empty">Nessun repository pubblico disponibile al momento.</div>');
        return;
      }

      const cardsHtml = repos.map(repo => {
        const name = repo.name || 'Repository';
        const description = repo.description || 'Nessuna descrizione disponibile';
        const url = repo.html_url || repo.url;
        const language = repo.language || 'Repository';
        const stars = typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0;

        return `
          <a class="github-project-card" href="${url}" target="_blank" rel="noreferrer">
            <div class="github-project-top">
              <span class="github-project-name">${name}</span>
              <span class="github-project-star">★ ${stars}</span>
            </div>
            <p>${description}</p>
            <div class="github-project-meta">
              <span class="lang-dot" style="background:${languageColors[language] || '#0ea5e9'}"></span>
              <span>${language}</span>
            </div>
          </a>
        `;
      }).join('');

      githubProjects.insertAdjacentHTML('beforeend', cardsHtml);
    };

    fetch('https://api.github.com/users/vitodorio/repos?sort=updated&per_page=6')
      .then(response => {
        if(!response.ok) throw new Error('GitHub API unavailable');
        return response.json();
      })
      .then(repos => {
        const filtered = (Array.isArray(repos) ? repos : [])
          .filter(repo => !repo.fork)
          .slice(0, 6);
        renderGithubProjects(filtered);
      })
      .catch(err => {
        console.warn('GitHub projects fallback used:', err);
        renderGithubProjects([]);
      });
  }

  // AI assistant simple interactions
  const aiOpenBtn = document.querySelector('.assistant-button');
  const aiCloseBtn = document.querySelector('.ai-close-btn');
  const assistantWidget = document.querySelector('.assistant-widget');
  const aiHelp = document.getElementById('ai-help');
  const aiAssistant = document.getElementById('ai-assistant');
  // Remove simple alert behavior and rely on the chat toggle for interaction
  if(aiCloseBtn && assistantWidget){
    aiCloseBtn.addEventListener('click',()=>{
      assistantWidget.style.display = 'none';
    });
  }
  if(aiHelp){
    aiHelp.addEventListener('click',()=>{
      window.location.hash = '#contact';
    })
  }

  const breachForm = document.getElementById('breachForm');
  const breachResult = document.getElementById('breachResult');

  const renderBreachResult = (data = {}) => {
    if(!breachResult) return;

    const email = (data.email || 'Email').toUpperCase();
    const breached = !!data.breached;
    const list = Array.isArray(data.breaches) ? data.breaches : [];
    const firstBreach = list[0];
    const breachLabel = typeof firstBreach === 'string'
      ? firstBreach
      : (firstBreach && typeof firstBreach === 'object'
        ? (firstBreach.name || firstBreach.domain || firstBreach.title || firstBreach.source || 'Violazione rilevata')
        : 'Violazione rilevata');

    if (breached) {
      breachResult.className = 'breach-result breached';
      breachResult.innerHTML = `
        <div class="breach-report breach-report-match">
          <div class="breach-report-panel breach-report-left">
            <div class="breach-meta-label">Email</div>
            <div class="breach-email-row">
              <img class="breach-avatar" src="assets/images1.jpeg" alt="Breach Hunter logo" />
              <span class="breach-email">${email}</span>
            </div>

            <div class="breach-meta-label">Stato</div>
            <div class="breach-status breached">COMPROMESSA</div>

            <div class="breach-meta-label breach-meta-violations">Violazioni rilevate</div>
            <div class="breach-violations-text">${breachLabel}</div>
          </div>

          <div class="breach-report-panel breach-report-right">
            <div class="breach-detail-box">
              <h4>⚠️ Account Violato: Cosa Fare Subito</h4>
              <p>I tuoi dati sono comparsi in un archivio di violazioni. Agisci tempestivamente:</p>
              <ul class="breach-action-list">
                <li>• <strong class="text-danger-bright">Cambia password:</strong> aggiorna subito la password dell'email e dei servizi importanti.</li>
                <li>• <strong class="text-danger-bright">Attiva la 2FA:</strong> abilita l'autenticazione a due fattori.</li>
                <li>• <strong class="text-danger-bright">Controlla le sessioni:</strong> disconnetti dispositivi sconosciuti o sospetti.</li>
                <li>• <strong class="text-danger-bright">Verifica il PC:</strong> esegui una scansione antivirus per escludere infostealer.</li>
              </ul>
              <p>Se non sei sicuro, contatta il supporto e cambia le credenziali da un dispositivo sicuro.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    breachResult.className = 'breach-result safe';
    breachResult.innerHTML = `
      <div class="breach-report breach-report-match">
        <div class="breach-report-panel breach-report-left">
          <div class="breach-meta-label">Email</div>
          <div class="breach-email-row">
            <img class="breach-avatar" src="assets/images1.jpeg" alt="Breach Hunter logo" />
            <span class="breach-email">${email}</span>
          </div>

          <div class="breach-meta-label">Stato</div>
          <div class="breach-status safe">SICURA</div>

          <div class="breach-meta-label breach-meta-violations">Violazioni</div>
          <div class="breach-violations-text">Nessuna violazione rilevata per questo indirizzo.</div>
        </div>

        <div class="breach-report-panel breach-report-right">
          <div class="breach-detail-box safe-box">
            <h4>🛡️ Account Sicuro: Nessuna Violazione</h4>
            <p>L'indirizzo email non risulta compromesso nei database analizzati.</p>
            <ul class="breach-action-list">
              <li>• <strong class="text-safe-bright">Nessun leak:</strong> Nessuna traccia dell'email in archivi di violazioni o log di infostealer noti.</li>
              <li>• <strong class="text-safe-bright">Prevenzione attiva:</strong> Ricorda di utilizzare password uniche per ogni servizio online.</li>
              <li>• <strong class="text-safe-bright">Protezione 2FA:</strong> Abilita sempre l'autenticazione a due fattori sui tuoi account principali.</li>
              <li>• <strong class="text-safe-bright">Monitoraggio:</strong> Esegui periodicamente una nuova scansione per tenere la situazione sotto controllo.</li>
            </ul>
            <p>Continua a mantenere buone pratiche di sicurezza per proteggere i tuoi account.</p>
          </div>
        </div>
      </div>
    `;
  };

  if (breachForm) {
    breachForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const emailInput = document.getElementById('breachEmail');
      const email = (emailInput && emailInput.value ? emailInput.value.trim() : '').toLowerCase();
      if (!email || !email.includes('@')) {
        if (breachResult) {
          breachResult.className = 'breach-result breached';
          breachResult.innerHTML = '<div class="breach-empty">Inserisci un indirizzo email valido.</div>';
        }
        return;
      }

      if (breachResult) {
        breachResult.className = 'breach-result';
        breachResult.innerHTML = '<div class="breach-empty">Verifico la tua email con il backend…</div>';
      }

      try {
        const response = await fetch(`http://localhost:8080/api/check?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
          throw new Error(`Errore API (${response.status})`);
        }
        const json = await response.json();
        renderBreachResult(json);
      } catch (error) {
        if (breachResult) {
          breachResult.className = 'breach-result breached';
          breachResult.innerHTML = `
            <div class="breach-report">
              <div class="breach-report-head">
                <span class="breach-email">${email}</span>
                <span class="breach-status breached">Errore</span>
              </div>
              <p class="breach-note">Impossibile contattare il backend. Assicurati che l’app Java sia in esecuzione su localhost:8080.</p>
            </div>
          `;
        }
        console.error(error);
      }
    });
  }

  // New AI floating widget interactions (existing chat toggles if present)
  const aiToggle = document.getElementById('ai-toggle');
  const aiChat = document.getElementById('ai-chat');
  const aiMessages = document.getElementById('ai-messages');
  const aiInput = document.getElementById('ai-input');
  const aiSend = document.getElementById('ai-send');
  if(aiToggle && aiChat){
    aiToggle.addEventListener('click',()=>{
      const open = aiChat.style.display !== 'none';
      aiChat.style.display = open ? 'none' : 'flex';
      aiChat.setAttribute('aria-hidden', String(open));
      if(!open){ aiInput.focus(); }
    })
  }
  if(aiSend && aiInput && aiMessages){
    aiSend.addEventListener('click', async ()=>{
      const text = aiInput.value.trim();
      if(!text) return;
      // append user message
      const userMsg = document.createElement('div'); userMsg.className='msg user'; userMsg.textContent = text;
      aiMessages.appendChild(userMsg);
      aiInput.value=''; aiMessages.scrollTop = aiMessages.scrollHeight;

      // show loading/typing message
      const loading = document.createElement('div'); loading.className='msg bot'; loading.textContent = 'Assistente: sto scrivendo...';
      aiMessages.appendChild(loading);
      aiMessages.scrollTop = aiMessages.scrollHeight;

      try{
        const resp = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });
        if(!resp.ok){
          throw new Error('AI service error');
        }
        const json = await resp.json();
        loading.textContent = json.reply || 'Mi dispiace, non ho una risposta al momento.';
        aiMessages.scrollTop = aiMessages.scrollHeight;
      }catch(err){
        console.error(err);
        loading.textContent = 'Errore: impossibile raggiungere il servizio AI. Riprovare più tardi.';
        aiMessages.scrollTop = aiMessages.scrollHeight;
      }
    });
    // send on Enter
    aiInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); aiSend.click(); } });
  }

  const sliderTrack = document.querySelector('.quote-slider-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  if(sliderTrack && prevBtn && nextBtn){
    prevBtn.addEventListener('click',()=>{
      sliderTrack.scrollBy({left:-560, behavior:'smooth'});
    });
    nextBtn.addEventListener('click',()=>{
      sliderTrack.scrollBy({left:560, behavior:'smooth'});
    });
  }

  // Inbox form (tabella messaggi)
  const inboxForm = document.getElementById('inbox-form');
  const inboxStatus = document.getElementById('inbox-status');
  if(inboxForm){
    inboxForm.addEventListener('submit',e=>{
      e.preventDefault();
      const name = inboxForm.name.value.trim();
      const email = inboxForm.email.value.trim();
      const message = inboxForm.message.value.trim();
      if(!name || !email || !message){
        if(inboxStatus) inboxStatus.textContent = 'Per favore compila tutti i campi.';
        return;
      }
      const subject = encodeURIComponent('Messaggio dal sito — ' + name);
      const body = encodeURIComponent(message + '\n\n--\n' + name + '\n' + email);
      window.location.href = `mailto:user@example.com?subject=${subject}&body=${body}`;
      if(inboxStatus) inboxStatus.textContent = 'Apro il client email per inviare il messaggio...';
    });
  }

  /* Cookie banner handling */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  try{
    const consent = localStorage.getItem('site_cookie_consent');
    if(!consent && cookieBanner){
      cookieBanner.hidden = false;
    }
  }catch(e){
    // localStorage may be disabled; still show banner
    if(cookieBanner) cookieBanner.hidden = false;
  }
  if(cookieAccept && cookieBanner){
    cookieAccept.addEventListener('click',()=>{
      try{ localStorage.setItem('site_cookie_consent','accepted'); }catch(e){}
      cookieBanner.hidden = true;
    });
  }
  const cookieReject = document.getElementById('cookie-reject');
  if(cookieReject){
    cookieReject.addEventListener('click',()=>{
      try{ localStorage.setItem('site_cookie_consent','rejected'); }catch(e){}
      if(cookieBanner) cookieBanner.hidden = true;
      // optional: show a brief message
      const status = document.createElement('div'); status.textContent = 'Hai rifiutato i cookie.'; status.className='muted';
      if(document.querySelector('.cookie-inner')){
        document.querySelector('.cookie-inner').appendChild(status);
        setTimeout(()=>{ if(status && status.parentNode) status.parentNode.removeChild(status); },3000);
      }
    });
  }

});

// Expose a safe initializer to wire header-dependent interactions after header HTML is injected dynamically
window.initHeader = function(){
  if(window.headerInitDone) return; // avoid duplicate initialization
  window.headerInitDone = true;

  // nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if(navToggle && nav){
    navToggle.addEventListener('click',()=>{
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? 'none' : 'block';
    });
  }

  // assistant controls
  const aiToggle = document.getElementById('ai-toggle');
  const aiChat = document.getElementById('ai-chat');
  const aiInput = document.getElementById('ai-input');
  if(aiToggle && aiChat){
    aiToggle.addEventListener('click',()=>{
      const open = aiChat.style.display !== 'none';
      aiChat.style.display = open ? 'none' : 'flex';
      aiChat.setAttribute('aria-hidden', String(open));
      if(!open && aiInput){ aiInput.focus(); }
    });
  }

  const aiCloseBtn = document.querySelector('.ai-close-btn');
  const assistantWidget = document.querySelector('.assistant-widget');
  if(aiCloseBtn && assistantWidget){
    aiCloseBtn.addEventListener('click',()=>{ assistantWidget.style.display = 'none'; });
  }
};

// If header was present statically on load, initialize immediately
if(document.readyState === 'complete' || document.readyState === 'interactive'){
  setTimeout(()=>{ if(window.initHeader) window.initHeader(); }, 50);
}
