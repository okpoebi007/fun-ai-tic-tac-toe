
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

const TEST_MODE = true; // 👈 Change to false to go live

const bannerAdId = TEST_MODE
  ? 'ca-app-pub-3940256099942544/6300978111' // ✅ Google Test Banner
  : 'ca-app-pub-6695870861385987/2126913341'; // 🎯 My Real Banner Ad ID

const interstitialAdId = TEST_MODE
  ? 'ca-app-pub-3940256099942544/1033173712' // ✅ Google Test Interstitial
  : 'ca-app-pub-6695870861385987/8598637138'; // 🎯 My Real Interstitial Ad ID

export async function initializeAdMob() {
  try {
    await AdMob.initialize({
      initializeForTesting: TEST_MODE,
      testingDevices: TEST_MODE ? ['ABCDEF123456'] : [],
    });
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('AdMob initialization failed:', error);
  }
}

export async function showBannerAd() {
  try {
    await AdMob.showBanner({
      adId: bannerAdId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: TEST_MODE,
    });
    console.log('Banner ad shown');
  } catch (error) {
    console.error('Failed to show banner ad:', error);
  }
}

export async function showInterstitialAd() {
  try {
    await AdMob.prepareInterstitial({
      adId: interstitialAdId,
      isTesting: TEST_MODE,
    });
    await AdMob.showInterstitial();
    console.log('Interstitial ad shown');
  } catch (error) {
    console.error('Failed to show interstitial ad:', error);
  }
}
