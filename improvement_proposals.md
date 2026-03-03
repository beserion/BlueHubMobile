# MarineDash İyileştirme ve Yeni Özellik Önerileri

Mevcut modüler yapı üzerine, projenin **verimliliğini (efficiency)** ve **kullanıcı dostu (user-friendly)** olma özelliğini artıracak aşağıdaki geliştirmeleri yapabiliriz:

## 1. Kullanıcı Deneyimi (UX) ve Arayüz
- **🌙 Dark/Light Mod Desteği:** Kullanıcıların çalışma ortamına göre tema değiştirebilmesi. Tailwind CSS ile kolayca entegre edilebilir.
- **🌍 Çoklu Dil Desteği (i18n):** Şu an arayüzde Türkçe ve İngilizce karışık durumda. `i18next` kullanarak dil seçeneği (TR/EN) ekleyebiliriz.
- **🔔 Gelişmiş Bildirim Merkezi:** Sağ üstteki zil ikonuna tıklandığında açılan, okunmamış bildirimleri gösteren ve "okundu" olarak işaretlenebilen bir pop-up menü.
- **📍 Breadcrumbs (Ekmek Kırıntıları):** Kullanıcının hangi sayfada olduğunu ve bir üst menüye nasıl döneceğini gösteren navigasyon yardımcısı (Örn: Ana Sayfa > Satış > Detay).

## 2. Verimlilik ve Performans
- **⚡ Code Splitting (Lazy Loading):** `React.lazy` ve `Suspense` kullanarak, kullanıcı sadece ilgili sayfaya gittiğinde o sayfanın kodunun yüklenmesini sağlamak. Bu, uygulamanın açılış hızını ciddi oranda artırır.
- **🔍 Global Arama ve Filtreleme:** Üst bar'daki tarih aralığı ve arama kutusunun tüm dashboard'ları etkileyecek şekilde çalışır hale getirilmesi (Context API veya Zustand ile global state yönetimi).
- **📥 Veri Dışa Aktarma (Export):** Tablolardaki verilerin (örneğin Satış Raporları) Excel veya PDF formatında indirilmesi özelliği.

## 3. İşlevsellik
- **📝 Form Yönetimi ve Validasyon:** Yeni Sipariş/Fatura/Personel ekleme formları oluşturmak ve bu formlarda `react-hook-form` + `zod` kullanarak hata kontrolü yapmak.
- **📊 Özelleştirilebilir Dashboard:** Kullanıcının ana sayfadaki widget'ların yerini sürükle-bırak (drag-and-drop) yöntemiyle değiştirebilmesi.

## Önerilen Öncelik Sıralaması
1. **Lazy Loading:** Performans için hızlı bir kazanım.
2. **Global State & Filtreleme:** Kullanıcıların verilerle etkileşime girmesini sağlar.
3. **Dark Mod:** Görsel olarak en büyük etkiyi yaratır.

Hangisine öncelik vermek istersiniz?
