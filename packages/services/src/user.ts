import { createClerkClient, type ClerkClient, type User } from "@clerk/backend";
import { PrismaClient } from "@repo/db/src";
import { generateApiKey } from "./utils";
import {
  type PrivateMetadata,
  type PublicMetadata,
  type MetadataType,
} from "@repo/types/src";

export class UserService {
  private clerkClient: ClerkClient;

  constructor(
    private db: PrismaClient,
    clerkSecretKey: string,
  ) {
    this.clerkClient = createClerkClient({
      secretKey: clerkSecretKey,
    });
  }

  async createApiKey(userId: string) {
    const apiKey = generateApiKey();
    return await this.db.apiKey.upsert({
      where: { userId },
      create: { apiKey, userId },
      update: { apiKey },
    });
  }

  async getApiKey(userId: string) {
    return await this.db.apiKey.findFirst({
      where: { userId },
    });
  }

  async decrementFreeTestsLeft(userId: string) {
    const metadata = await this.getPublicMetadata(userId);
    if (metadata.freeTestsLeft === undefined) {
      return;
    }
    await this.updatePublicMetadata(userId, {
      freeTestsLeft: metadata.freeTestsLeft - 1,
    });
  }

  /**
   * Generic function to update user metadata
   */
  private async updateMetadata(
    userId: string,
    metadata: PrivateMetadata | PublicMetadata,
    type: MetadataType,
  ): Promise<User> {
    try {
      const user = await this.clerkClient.users.getUser(userId);
      const existingMetadata =
        type === "private" ? user.privateMetadata : user.publicMetadata;

      const updatedMetadata = {
        ...existingMetadata,
        ...metadata,
      };

      return await this.clerkClient.users.updateUser(userId, {
        [`${type}Metadata`]: updatedMetadata,
      });
    } catch (error) {
      console.error(`Error updating user ${type} metadata:`, error);
      throw new Error(`Failed to update user ${type} metadata`);
    }
  }

  /**
   * Generic function to get user metadata
   */
  private async getMetadata(
    userId: string,
    type: MetadataType,
  ): Promise<PrivateMetadata | PublicMetadata> {
    try {
      const user = await this.clerkClient.users.getUser(userId);
      return type === "private" ? user.privateMetadata : user.publicMetadata;
    } catch (error) {
      console.error(`Error getting user ${type} metadata:`, error);
      throw new Error(`Failed to get user ${type} metadata`);
    }
  }

  /**
   * Generic function to remove a key from user metadata
   */
  private async removeMetadataKey(
    userId: string,
    key: string,
    type: MetadataType,
  ): Promise<User> {
    try {
      const user = await this.clerkClient.users.getUser(userId);
      const existingMetadata = {
        ...(type === "private" ? user.privateMetadata : user.publicMetadata),
      };

      delete existingMetadata[key];

      return await this.clerkClient.users.updateUser(userId, {
        [`${type}Metadata`]: existingMetadata,
      });
    } catch (error) {
      console.error(`Error removing user ${type} metadata key:`, error);
      throw new Error(`Failed to remove user ${type} metadata key`);
    }
  }

  // Public API methods
  /**
   * Updates private metadata for a Clerk user
   */
  async updatePrivateMetadata(
    userId: string,
    metadata: PrivateMetadata,
  ): Promise<User> {
    return this.updateMetadata(userId, metadata, "private");
  }

  /**
   * Gets private metadata for a Clerk user
   */
  async getPrivateMetadata(userId: string): Promise<PrivateMetadata> {
    return this.getMetadata(userId, "private") as Promise<PrivateMetadata>;
  }

  /**
   * Removes a key from user's private metadata
   */
  async removePrivateMetadataKey(userId: string, key: string): Promise<User> {
    return this.removeMetadataKey(userId, key, "private");
  }

  /**
   * Updates public metadata for a Clerk user
   */
  async updatePublicMetadata(
    userId: string,
    metadata: PublicMetadata,
  ): Promise<User> {
    return this.updateMetadata(userId, metadata, "public");
  }

  /**
   * Gets public metadata for a Clerk user
   */
  async getPublicMetadata(userId: string): Promise<PublicMetadata> {
    return this.getMetadata(userId, "public") as Promise<PublicMetadata>;
  }

  /**
   * Removes a key from user's public metadata
   */
  async removePublicMetadataKey(userId: string, key: string): Promise<User> {
    return this.removeMetadataKey(userId, key, "public");
  }
}
