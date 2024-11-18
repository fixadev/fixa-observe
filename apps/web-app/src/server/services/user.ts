import { clerkClient, type User } from "@clerk/nextjs/server";

type MetadataType = "public" | "private";

export interface PrivateMetadata {
  slackAccessToken?: string;
  apiKey?: string;
}

export interface PublicMetadata {
  slackWebhookUrl?: string;
}

export class UserService {
  /**
   * Generic function to update user metadata
   */
  private async updateMetadata(
    userId: string,
    metadata: PrivateMetadata | PublicMetadata,
    type: MetadataType,
  ): Promise<User> {
    try {
      const user = await clerkClient.users.getUser(userId);
      const existingMetadata =
        type === "private" ? user.privateMetadata : user.publicMetadata;

      const updatedMetadata = {
        ...existingMetadata,
        ...metadata,
      };

      return await clerkClient.users.updateUser(userId, {
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
      const user = await clerkClient.users.getUser(userId);
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
      const user = await clerkClient.users.getUser(userId);
      const existingMetadata = {
        ...(type === "private" ? user.privateMetadata : user.publicMetadata),
      };

      delete existingMetadata[key];

      return await clerkClient.users.updateUser(userId, {
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

// Export singleton instance
export const userService = new UserService();
