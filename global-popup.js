(function(){
    // Inject styles once
    const css = `
    .global-popup-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.28);pointer-events:none;opacity:0;transition:opacity 220ms ease;z-index:10000}
    .global-popup-overlay.visible{opacity:1;pointer-events:auto}
    .global-popup{background:linear-gradient(135deg,#ffffff,#f7fff7);border-radius:12px;padding:18px 22px;width:320px;text-align:center;box-shadow:0 0 0 1px rgba(0,0,0,0.06), 0 24px 50px rgba(0,0,0,0.3);transform:translateY(10px) scale(.96);opacity:0;transition:transform 360ms cubic-bezier(.2,.9,.2,1),opacity 240ms ease}
    .global-popup-overlay.visible .global-popup{transform:translateY(0) scale(1);opacity:1}
    .global-popup .dot{width:64px;height:64px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin:0 auto 10px;background:linear-gradient(135deg,#3fb36f,#1f8f4a);color:white;font-size:34px;box-shadow:0 10px 26px rgba(31,143,74,0.24)}
    .global-popup h4{margin:6px 0 2px 0;color:#143}
    .global-popup p{margin:0;color:#556}
    `;
    const style = document.createElement('style'); style.innerHTML = css; document.head.appendChild(style);

    // Insert markup
    const overlay = document.createElement('div'); overlay.id = 'globalPopupOverlay'; overlay.className = 'global-popup-overlay'; overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = `
        <div class="global-popup" role="dialog" aria-modal="true" aria-label="Notification">
            <div class="dot">✓</div>
            <h4 id="globalPopupTitle">Done</h4>
            <p id="globalPopupMsg">Action completed</p>
        </div>
    `;
    document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(overlay); });

    // Show function
    window.showGlobalPopup = function(title, msg, opts){
        opts = opts || {};
        const o = document.getElementById('globalPopupOverlay');
        if(!o) return;
        const t = document.getElementById('globalPopupTitle');
        const m = document.getElementById('globalPopupMsg');
        if(title) t.innerText = title; else t.innerText = opts.title || 'Done';
        if(msg) m.innerText = msg; else m.innerText = opts.msg || '';
        o.classList.add('visible');
        o.setAttribute('aria-hidden','false');
        // hide after short delay
        clearTimeout(window._globalPopupTimeout);
        window._globalPopupTimeout = setTimeout(function(){
            o.classList.remove('visible');
            o.setAttribute('aria-hidden','true');
        }, opts.duration || 900);
    };

    // Override system alert
    window.alert = function(msg){
        window.showGlobalPopup('Alert', msg, { duration: 3000 });
    };

    // Global button listener
    document.addEventListener('click', function(e){
        try{
            const btn = e.target.closest && e.target.closest('button');
            if(!btn) return;
            // Skip if explicitly asked
            if(btn.hasAttribute('data-skip-global-popup') || btn.classList.contains('no-global-popup')) return;
            // Skip if button already opens a modal or overlays (heuristic: has data-toggle or aria-haspopup)
            if(btn.hasAttribute('data-toggle') || btn.getAttribute('aria-haspopup')==='true') return;
            // Allow some buttons to proceed without popup if they navigate away (like anchors styled as buttons are <a>, not <button>)
            const text = (btn.getAttribute('data-popup-message') || btn.innerText || '').trim();
            const title = text ? text.split('\n')[0] : 'Done';
            const msg = '';
            // show popup (short)
            showGlobalPopup(title, msg, { duration: 900 });
        }catch(err){/* ignore */}
    }, true);
})();
