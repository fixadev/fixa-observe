import {
  createClerkClient,
  Organization,
  type ClerkClient,
  User,
} from "@clerk/backend";
import { PrismaClient } from "@repo/db/src/index";
import { generateApiKey } from "./utils";
import {
  type PrivateMetadata,
  type PublicMetadata,
  type MetadataType,
} from "@repo/types/src";

export class ClerkService {
  readonly clerkClient: ClerkClient;

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

  async getUser(userId: string) {
    return await this.clerkClient.users.getUser(userId);
  }

  async createApiKey({ orgId }: { orgId: string }) {
    const apiKey = generateApiKey();
    return await this.db.apiKey.upsert({
      where: { orgId },
      create: { apiKey, orgId },
      update: { apiKey },
    });
  }

  async getApiKey({ orgId }: { orgId: string }) {
    return await this.db.apiKey.findFirst({
      where: { orgId },
    });
  }

  async decrementFreeTestsLeft({ orgId }: { orgId: string }) {
    const metadata = await this.getPublicMetadata({ orgId });
    if (metadata.freeTestsLeft === undefined) {
      return;
    }
    await this.updatePublicMetadata({
      orgId,
      metadata: {
        freeTestsLeft: metadata.freeTestsLeft - 1,
      },
    });
  }

  async decrementFreeObservabilityCallsLeft({ orgId }: { orgId: string }) {
    const metadata = await this.getPublicMetadata({ orgId });
    if (metadata.freeObservabilityCallsLeft === undefined) {
      return;
    }
    await this.updatePublicMetadata({
      orgId,
      metadata: {
        freeObservabilityCallsLeft: metadata.freeObservabilityCallsLeft - 1,
      },
    });
  }

  /**
   * Generic function to update user metadata
   */
  private async updateMetadata({
    orgId,
    userId,
    metadata,
    type,
  }: {
    orgId?: string;
    userId?: string;
    metadata: PrivateMetadata | PublicMetadata;
    type: MetadataType;
  }): Promise<Organization | User> {
    try {
      if (!orgId && !userId) {
        throw new Error("Either orgId or userId must be provided");
      }

      if (orgId) {
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
      } else {
        const user = await this.getUser(userId!);
        const existingMetadata =
          type === "private" ? user.privateMetadata : user.publicMetadata;

        const updatedMetadata = {
          ...existingMetadata,
          ...metadata,
        };

        return await this.clerkClient.users.updateUserMetadata(userId!, {
          [`${type}Metadata`]: updatedMetadata,
        });
      }
    } catch (error) {
      console.error(`Error updating ${type} metadata:`, error);
      throw new Error(`Failed to update ${type} metadata`);
    }
  }

  /**
   * Generic function to get user metadata
   */
  private async getMetadata({
    orgId,
    userId,
    type,
  }: {
    orgId?: string;
    userId?: string;
    type: MetadataType;
  }): Promise<PrivateMetadata | PublicMetadata> {
    try {
      if (!orgId && !userId) {
        throw new Error("Either orgId or userId must be provided");
      }

      if (orgId) {
        const org = await this.getOrg(orgId);
        const metadata =
          type === "private" ? org.privateMetadata : org.publicMetadata;
        return metadata ?? {};
      } else {
        const user = await this.getUser(userId!);
        const metadata =
          type === "private" ? user.privateMetadata : user.publicMetadata;
        return metadata ?? {};
      }
    } catch (error) {
      console.error(`Error getting ${type} metadata:`, error);
      throw new Error(`Failed to get ${type} metadata`);
    }
  }

  /**
   * Generic function to remove a key from user metadata
   */
  private async removeMetadataKey({
    orgId,
    userId,
    key,
    type,
  }: {
    orgId?: string;
    userId?: string;
    key: string;
    type: MetadataType;
  }): Promise<Organization | User> {
    try {
      if (!orgId && !userId) {
        throw new Error("Either orgId or userId must be provided");
      }

      if (orgId) {
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
      } else {
        const user = await this.getUser(userId!);
        const existingMetadata = {
          ...(type === "private" ? user.privateMetadata : user.publicMetadata),
        };

        delete existingMetadata[key];

        return await this.clerkClient.users.updateUserMetadata(userId!, {
          [`${type}Metadata`]: existingMetadata,
        });
      }
    } catch (error) {
      console.error(`Error removing ${type} metadata key:`, error);
      throw new Error(`Failed to remove ${type} metadata key`);
    }
  }

  // Public API methods
  /**
   * Updates private metadata for a Clerk user
   */
  async updatePrivateMetadata({
    orgId,
    userId,
    metadata,
  }: {
    orgId?: string;
    userId?: string;
    metadata: PrivateMetadata;
  }): Promise<Organization | User> {
    return this.updateMetadata({ orgId, userId, metadata, type: "private" });
  }

  /**
   * Gets private metadata for a Clerk user
   */
  async getPrivateMetadata({
    orgId,
    userId,
  }: {
    orgId?: string;
    userId?: string;
  }): Promise<PrivateMetadata> {
    return this.getMetadata({
      orgId,
      userId,
      type: "private",
    }) as Promise<PrivateMetadata>;
  }

  /**
   * Removes a key from user's private metadata
   */
  async removePrivateMetadataKey({
    orgId,
    userId,
    key,
  }: {
    orgId?: string;
    userId?: string;
    key: string;
  }): Promise<Organization | User> {
    return this.removeMetadataKey({ orgId, userId, key, type: "private" });
  }

  /**
   * Updates public metadata for a Clerk user
   */
  async updatePublicMetadata({
    orgId,
    userId,
    metadata,
  }: {
    orgId?: string;
    userId?: string;
    metadata: PublicMetadata;
  }): Promise<Organization | User> {
    return this.updateMetadata({ orgId, userId, metadata, type: "public" });
  }

  /**
   * Gets public metadata for a Clerk user
   */
  async getPublicMetadata({
    orgId,
    userId,
  }: {
    orgId?: string;
    userId?: string;
  }): Promise<PublicMetadata> {
    return this.getMetadata({
      orgId,
      userId,
      type: "public",
    }) as Promise<PublicMetadata>;
  }

  /**
   * Removes a key from user's public metadata
   */
  async removePublicMetadataKey({
    orgId,
    userId,
    key,
  }: {
    orgId?: string;
    userId?: string;
    key: string;
  }): Promise<Organization | User> {
    return this.removeMetadataKey({ orgId, userId, key, type: "public" });
  }
}
