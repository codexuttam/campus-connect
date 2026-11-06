import { IAuthService } from './types';
import { ClerkAuthProvider } from './clerkProvider';
import { LocalAuthProvider } from './localAuthProvider';

class AuthServiceManager {
  private activeProvider: IAuthService;
  private clerkProvider: ClerkAuthProvider;
  private localProvider: LocalAuthProvider;

  constructor() {
    this.clerkProvider = new ClerkAuthProvider();
    this.localProvider = new LocalAuthProvider();

    // Check if Clerk publishable key is available in environment
    if (this.clerkProvider.isConfigured) {
      this.activeProvider = this.clerkProvider;
    } else {
      this.activeProvider = this.localProvider;
    }
  }

  get provider(): IAuthService {
    return this.activeProvider;
  }

  get isClerkConfigured(): boolean {
    return this.clerkProvider.isConfigured;
  }

  get providerName(): string {
    return this.activeProvider.providerName;
  }

  // Force provider selection (useful for dev testing / toggling)
  useLocalProvider(): void {
    this.activeProvider = this.localProvider;
  }

  useClerkProvider(): void {
    this.activeProvider = this.clerkProvider;
  }
}

export const authServiceManager = new AuthServiceManager();
export const authService = authServiceManager.provider;

