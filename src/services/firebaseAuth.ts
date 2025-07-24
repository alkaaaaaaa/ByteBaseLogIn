import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import type { User, AuthError, UserCredential } from 'firebase/auth';
import { auth, googleProvider, githubProvider, microsoftProvider } from '../config/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
}

export class FirebaseAuthService {
  private static instance: FirebaseAuthService;
  private currentUser: User | null = null;
  private authStateListeners: ((user: AuthUser | null) => void)[] = [];

  private constructor() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      const authUser = user ? this.mapUserToAuthUser(user) : null;
      this.authStateListeners.forEach(listener => listener(authUser));
    });
  }

  public static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }

  private mapUserToAuthUser(user: User): AuthUser {
    // Determine provider from providerData
    let provider = 'unknown';
    if (user.providerData.length > 0) {
      const providerId = user.providerData[0].providerId;
      switch (providerId) {
        case 'google.com':
          provider = 'google';
          break;
        case 'github.com':
          provider = 'github';
          break;
        case 'microsoft.com':
          provider = 'microsoft';
          break;
        default:
          provider = providerId;
      }
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider
    };
  }

  public async signInWithGoogle(): Promise<AuthUser> {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return this.mapUserToAuthUser(user);
    } catch (error) {
      const authError = error as AuthError;
      console.error('Google sign-in error:', authError);
      throw new Error(this.getErrorMessage(authError));
    }
  }

  public async signInWithGitHub(): Promise<AuthUser> {
    try {
      const result: UserCredential = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      return this.mapUserToAuthUser(user);
    } catch (error) {
      const authError = error as AuthError;
      console.error('GitHub sign-in error:', authError);
      throw new Error(this.getErrorMessage(authError));
    }
  }

  public async signInWithMicrosoft(): Promise<AuthUser> {
    try {
      const result: UserCredential = await signInWithPopup(auth, microsoftProvider);
      const user = result.user;
      return this.mapUserToAuthUser(user);
    } catch (error) {
      const authError = error as AuthError;
      console.error('Microsoft sign-in error:', authError);
      throw new Error(this.getErrorMessage(authError));
    }
  }

  public async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign-out error:', authError);
      throw new Error(this.getErrorMessage(authError));
    }
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser ? this.mapUserToAuthUser(this.currentUser) : null;
  }

  public onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Call immediately with current state
    const currentAuthUser = this.getCurrentUser();
    callback(currentAuthUser);

    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  private getErrorMessage(error: AuthError): string {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return '登录窗口被用户关闭';
      case 'auth/popup-blocked':
        return '登录弹窗被浏览器阻止，请允许弹窗后重试';
      case 'auth/cancelled-popup-request':
        return '登录请求被取消';
      case 'auth/account-exists-with-different-credential':
        return '该邮箱已使用其他登录方式注册，请使用对应的登录方式';
      case 'auth/invalid-credential':
        return '登录凭证无效';
      case 'auth/operation-not-allowed':
        return '该登录方式未启用，请联系管理员';
      case 'auth/user-disabled':
        return '该账户已被禁用';
      case 'auth/user-not-found':
        return '用户不存在';
      case 'auth/wrong-password':
        return '密码错误';
      case 'auth/too-many-requests':
        return '请求过于频繁，请稍后再试';
      case 'auth/network-request-failed':
        return '网络连接失败，请检查网络后重试';
      default:
        return error.message || '登录失败，请重试';
    }
  }
}

// Export singleton instance
export const firebaseAuthService = FirebaseAuthService.getInstance();
