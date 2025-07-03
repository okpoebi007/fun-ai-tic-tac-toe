
class EnhancedSoundService {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    // Create audio elements with data URLs for different sound effects
    this.sounds.tap = new Audio();
    this.sounds.win = new Audio();
    this.sounds.draw = new Audio();
    this.sounds.move = new Audio();

    // Enhanced tap sound
    this.sounds.tap.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmARBSuBy/LMeSMFKYHO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSMFKoHO8tiJOQcXaLrr7qhVFApGn+DyvmERBSuAy/LNeSUGJHfH8N2QQAoUXbTo66pUFglGnt/yv2EQBCqBzu7JZxIIJoPM5dmLPAcQZb3n554UCQ5Soo/';
    
    // Victory sound
    this.sounds.win.src = 'data:audio/wav;base64,UklGRuICAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQoEAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmARBSuBy/LMeSMFKYHO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSMFKoHO8tiJOQcXaLrr7qhVFApGn+DyvmERBSuAy/LNeSUGJHfH8N2QQAoUXbTo66pUFglGnt/yv2EQBCqBzu7JZxIIJoPM5dmLPAcQZb3n554UCQ5Soo/yuF4OBReGzejJZxQHJInU8dmKNwgZaLvt55hQDAhQp+TwtmYdBjeR1/LNeSQGJHfH8N2QQAoUXrLp66tVFAlFnd7yv2EQBSuAy/LMeSQGJnfH8N2QQAoUXbTo66pUFglFnt/yv2EQBCqAzu7JaBEIJ4TN5dmLPAcQZr3n55hQDAhQp+TwtmYdBjiR1/LMeSMFKYHO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSUGJnfH8N2QQAoUXbTo66tVFAlFnd7yv2EQBSqBzu7JZxQHJInT8dmKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeS4GJnbH8N2QQAoUXrPr66hVFApFnd7yv2EQBCqAze7JZxQHJInU8dmLPAcQZr3n554UCQ5SoozyuF4PBReGzu6zdAoTBSuAzu7JZxQHJIrS8dqLPQcQZr3n554UCQ5Soo/yuF4OBRef';
    
    // Draw sound
    this.sounds.draw.src = 'data:audio/wav;base64,UklGRhgBAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YfQAAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmARBSuBy/LMeSMFKYHO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSMFKoHO8tiJOQcXaLrr7qhVFApGn+DyvmERBSuAy/LNeSUGJHfH8N2QQAoUXbTo66pUFglGnt/yv2EQBCqBzu7JZxIIJoPM5dmLPAcQZb3n554UCQ5Soo/';
    
    // Move transition sound
    this.sounds.move.src = 'data:audio/wav;base64,UklGRlQBAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YTABAAA=';
  }

  playTap() {
    this.playSound('tap');
  }

  playWin() {
    this.playSound('win');
  }

  playDraw() {
    this.playSound('draw');
  }

  playMove() {
    this.playSound('move');
  }

  private playSound(soundName: string) {
    if (this.enabled && this.sounds[soundName]) {
      try {
        this.sounds[soundName].currentTime = 0;
        this.sounds[soundName].play().catch(() => {
          // Silently fail if audio can't play
        });
      } catch (error) {
        console.warn(`Failed to play sound: ${soundName}`, error);
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const enhancedSoundService = new EnhancedSoundService();
