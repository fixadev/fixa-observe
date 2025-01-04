import {
  createClerkClient,
  Organization,
  type ClerkClient,
} from "@clerk/backend";
import { PrismaClient } from "@repo/db/src/index";
import { generateApiKey } from "./utils";
import {
  type PrivateMetadata,
  type PublicMetadata,
  type MetadataType,
} from "@repo/types/src";

export class OrgService {
  private clerkClient: ClerkClient;

  constructor(private db: PrismaClient) {
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error("CLERK_SECRET_KEY is not set");
    }
    this.clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }

  async getOrg(orgId: string) {
    return await this.clerkClient.organizations.getOrganization({
      organizationId: orgId,
    });
  }

  async createApiKey(orgId: string) {
    const apiKey = generateApiKey();
    return await this.db.apiKey.upsert({
      where: { orgId },
      create: { apiKey, orgId },
      update: { apiKey },
    });
  }

  async getApiKey(orgId: string) {
    return await this.db.apiKey.findFirst({
      where: { orgId },
    });
  }

  async decrementFreeTestsLeft(orgId: string) {
    const metadata = await this.getPublicMetadata(orgId);
    if (metadata.freeTestsLeft === undefined) {
      return;
    }
    await this.updatePublicMetadata(orgId, {
      freeTestsLeft: metadata.freeTestsLeft - 1,
    });
  }

  async decrementFreeObservabilityCallsLeft(orgId: string) {
    const metadata = await this.getPublicMetadata(orgId);
    if (metadata.freeObservabilityCallsLeft === undefined) {
      return;
    }
    await this.updatePublicMetadata(orgId, {
      freeObservabilityCallsLeft: metadata.freeObservabilityCallsLeft - 1,
    });
  }

  /**
   * Generic function to update user metadata
   */
  private async updateMetadata(
    orgId: string,
    metadata: PrivateMetadata | PublicMetadata,
    type: MetadataType,
  ): Promise<Organization> {
    try {
      const org = await this.getOrg(orgId);
      const existingMetadata =
        type === "private" ? org.privateMetadata : org.publicMetadata;

      const updatedMetadata = {
        ...existingMetadata,
        ...metadata,
      };

      return await this.clerkClient.organizations.updateOrganizationMetadata(
        orgId,
        {
          [`${type}Metadata`]: updatedMetadata,
        },
      );
    } catch (error) {
      console.error(`Error updating user ${type} metadata:`, error);
      throw new Error(`Failed to update user ${type} metadata`);
    }
  }

  /**
   * Generic function to get user metadata
   */
  private async getMetadata(
    orgId: string,
    type: MetadataType,
  ): Promise<PrivateMetadata | PublicMetadata> {
    try {
      const org = await this.getOrg(orgId);
      const metadata =
        type === "private" ? org.privateMetadata : org.publicMetadata;
      return metadata ?? {};
    } catch (error) {
      console.error(`Error getting user ${type} metadata:`, error);
      throw new Error(`Failed to get user ${type} metadata`);
    }
  }

  /**
   * Generic function to remove a key from user metadata
   */
  private async removeMetadataKey(
    orgId: string,
    key: string,
    type: MetadataType,
  ): Promise<Organization> {
    try {
      const org = await this.getOrg(orgId);
      const existingMetadata = {
        ...(type === "private" ? org.privateMetadata : org.publicMetadata),
      };

      delete existingMetadata[key];

      return await this.clerkClient.organizations.updateOrganizationMetadata(
        orgId,
        {
          [`${type}Metadata`]: existingMetadata,
        },
      );
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
    orgId: string,
    metadata: PrivateMetadata,
  ): Promise<Organization> {
    return this.updateMetadata(orgId, metadata, "private");
  }

  /**
   * Gets private metadata for a Clerk user
   */
  async getPrivateMetadata(orgId: string): Promise<PrivateMetadata> {
    return this.getMetadata(orgId, "private") as Promise<PrivateMetadata>;
  }

  /**
   * Removes a key from user's private metadata
   */
  async removePrivateMetadataKey(
    orgId: string,
    key: string,
  ): Promise<Organization> {
    return this.removeMetadataKey(orgId, key, "private");
  }

  /**
   * Updates public metadata for a Clerk user
   */
  async updatePublicMetadata(
    orgId: string,
    metadata: PublicMetadata,
  ): Promise<Organization> {
    return this.updateMetadata(orgId, metadata, "public");
  }

  /**
   * Gets public metadata for a Clerk user
   */
  async getPublicMetadata(orgId: string): Promise<PublicMetadata> {
    return this.getMetadata(orgId, "public") as Promise<PublicMetadata>;
  }

  /**
   * Removes a key from user's public metadata
   */
  async removePublicMetadataKey(
    orgId: string,
    key: string,
  ): Promise<Organization> {
    return this.removeMetadataKey(orgId, key, "public");
  }
}
