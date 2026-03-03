# APK Build Rehberi (MarineDash / BlueHUB)

Bu proje **Capacitor** ile React (Vite) web uygulamasını Android APK’ya dönüştürür.

## Ön koşul: Java (JDK 17)

APK derlemek için **JDK 17** kurulu olmalı ve `JAVA_HOME` ayarlanmış olmalı.

### JDK 17 kurulumu (Windows)

**Manuel kurulum (önerilen):**
1. [Eclipse Temurin JDK 17](https://adoptium.net/temurin/releases/?version=17&os=windows&arch=x64&package=jdk) veya [Microsoft Build of OpenJDK 17](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17) indir.
2. Kurulumu yap, örneğin: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\`
3. Sistem ortam değişkenlerinde **JAVA_HOME** ekle veya güncelle:
   - Örnek: `JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot`
   - `Path` içine ekle: `%JAVA_HOME%\bin`
4. Yeni bir terminal açıp doğrula: `java -version`

## APK oluşturma adımları

### 1. Bağımlılıklar (ilk sefer veya değişiklik sonrası)
```bash
npm install
```

### 2. Web build + Android sync
```bash
npm run build:android
```
Bu komut önce `vite build` ile web çıktısını üretir, sonra `npx cap sync android` ile Android projesine kopyalar.

### 3. APK derleme
```bash
cd android
.\gradlew.bat assembleDebug
```
Release APK için (imzalı):
```bash
.\gradlew.bat assembleRelease
```

### 4. APK konumu
- **Debug:** `android\app\build\outputs\apk\debug\app-debug.apk`
- **Release:** `android\app\build\outputs\apk\release\app-release-unsigned.apk` (imzalama ayrı yapılır)

## Hızlı özet

| Adım | Komut |
|------|--------|
| Web + sync | `npm run build:android` |
| APK (debug) | `cd android` → `.\gradlew.bat assembleDebug` |
| Android Studio’da aç | `npm run android:open` |

## Sorun giderme

- **"JAVA_HOME is not set"**  
  JDK 17 kurulduktan sonra `JAVA_HOME` ve `Path` ayarlarını yapıp terminali yeniden açın.

- **Gradle hatası**  
  `android` klasöründe: `.\gradlew.bat clean` sonra tekrar `.\gradlew.bat assembleDebug`.

- **Web değişiklikleri**  
  Kod değiştirdikten sonra mutlaka: `npm run build:android` sonra tekrar APK derleyin.

Bu adımlarla sorunsuz çalışan bir APK build’i alabilirsiniz.
