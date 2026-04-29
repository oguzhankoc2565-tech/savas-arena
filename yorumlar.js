// Yorum sistemi - tüm oyunlarda kullanılır
function yorumSistemiOlustur(oyunAdi) {
  let yorumlar = JSON.parse(localStorage.getItem('yorumlar_' + oyunAdi) || '[]');

  let html = `
    <div id="yorumBolumu" style="
      max-width:800px;margin:20px auto;padding:20px;
      background:#111;border:1px solid rgba(255,255,255,0.1);
      border-radius:16px;font-family:Arial,sans-serif;color:#fff;">

      <h2 style="color:#FFD700;font-size:20px;margin-bottom:16px;">
        💬 Yorumlar & Puanlar
      </h2>

      <!-- Yorum Yazma Formu -->
      <div style="background:#1a1a1a;border-radius:12px;padding:16px;margin-bottom:20px;">
        <input id="yorumAd" placeholder="Adın (zorunlu)" style="
          width:100%;padding:10px;border-radius:8px;border:1px solid #333;
          background:#222;color:#fff;font-size:14px;margin-bottom:10px;">

        <div id="yildizSecim" style="margin-bottom:10px;">
          <span style="color:#aaa;font-size:13px;">Puan ver: </span>
          ${[1,2,3,4,5].map(i => `
            <span class="yildiz" data-puan="${i}" onclick="yildizSec(${i})"
              style="font-size:24px;cursor:pointer;opacity:0.4;">★</span>
          `).join('')}
        </div>

        <textarea id="yorumMetin" placeholder="Oyun hakkında ne düşünüyorsun?" style="
          width:100%;padding:10px;border-radius:8px;border:1px solid #333;
          background:#222;color:#fff;font-size:14px;height:80px;
          resize:none;margin-bottom:10px;"></textarea>

        <button onclick="yorumGonder('${oyunAdi}')" style="
          background:#FFD700;color:#000;border:none;padding:10px 24px;
          border-radius:20px;font-weight:bold;font-size:14px;cursor:pointer;">
          Yorum Gönder
        </button>
      </div>

      <!-- Yorum Listesi -->
      <div id="yorumListesi"></div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
  seciliPuan = 0;
  yorumlariGoster(oyunAdi);
}

let seciliPuan = 0;

function yildizSec(puan) {
  seciliPuan = puan;
  document.querySelectorAll('.yildiz').forEach((y, i) => {
    y.style.opacity = i < puan ? '1' : '0.3';
    y.style.color = i < puan ? '#FFD700' : '#fff';
  });
}

function yorumGonder(oyunAdi) {
  let ad = document.getElementById('yorumAd').value.trim();
  let metin = document.getElementById('yorumMetin').value.trim();

  if (!ad) { alert('Lütfen adını yaz!'); return; }
  if (!metin) { alert('Lütfen yorum yaz!'); return; }
  if (seciliPuan === 0) { alert('Lütfen puan ver!'); return; }

  let yorumlar = JSON.parse(localStorage.getItem('yorumlar_' + oyunAdi) || '[]');
  yorumlar.unshift({
    ad, metin, puan: seciliPuan,
    tarih: new Date().toLocaleDateString('tr-TR'),
    begeni: 0
  });
  localStorage.setItem('yorumlar_' + oyunAdi, JSON.stringify(yorumlar));

  document.getElementById('yorumAd').value = '';
  document.getElementById('yorumMetin').value = '';
  yildizSec(0);
  yorumlariGoster(oyunAdi);
}

function begeni(oyunAdi, index) {
  let yorumlar = JSON.parse(localStorage.getItem('yorumlar_' + oyunAdi) || '[]');
  yorumlar[index].begeni = (yorumlar[index].begeni || 0) + 1;
  localStorage.setItem('yorumlar_' + oyunAdi, JSON.stringify(yorumlar));
  yorumlariGoster(oyunAdi);
}

function yorumlariGoster(oyunAdi) {
  let yorumlar = JSON.parse(localStorage.getItem('yorumlar_' + oyunAdi) || '[]');
  let liste = document.getElementById('yorumListesi');

  if (yorumlar.length === 0) {
    liste.innerHTML = '<p style="color:#555;text-align:center;padding:20px;">Henüz yorum yok. İlk yorumu sen yap!</p>';
    return;
  }

  liste.innerHTML = yorumlar.map((y, i) => `
    <div style="
      background:#1a1a1a;border-radius:12px;padding:14px;
      margin-bottom:12px;border:1px solid rgba(255,255,255,0.07);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div>
          <span style="font-weight:bold;color:#fff;font-size:14px;">👤 ${y.ad}</span>
          <span style="color:#FFD700;margin-left:10px;font-size:16px;">
            ${'★'.repeat(y.puan)}${'☆'.repeat(5-y.puan)}
          </span>
        </div>
        <span style="color:#555;font-size:12px;">${y.tarih}</span>
      </div>
      <p style="color:#ccc;font-size:14px;line-height:1.5;margin-bottom:10px;">${y.metin}</p>
      <button onclick="begeni('${oyunAdi}', ${i})" style="
        background:transparent;border:1px solid #333;color:#aaa;
        padding:4px 12px;border-radius:10px;font-size:12px;cursor:pointer;">
        👍 ${y.begeni || 0} Beğeni
      </button>
    </div>
  `).join('');
}