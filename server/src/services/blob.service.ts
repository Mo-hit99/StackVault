import { BlobModel } from '../models/blob.model.js';
import { Blob } from '../types/index.js';

export const BlobService = {
  async saveBlobs(repoId: number, blobs: any[]): Promise<Blob[]> {
    if (!blobs || blobs.length === 0) return [];

    const saved: Blob[] = [];
    for (const b of blobs) {
      // Depending on scale, this could be optimized, but let's insert simple
      const created = await BlobModel.create({
        commitId: b.commit_id,
        repoId,
        filepath: b.filepath,
        content: b.content,
        contentHash: b.content_hash,
        size: Buffer.from(b.content).length
      });
      saved.push(created);
    }
    return saved;
  },

  async getBlobsByCommit(commitId: string, pathPrefix?: string): Promise<Blob[]> {
    if (pathPrefix) {
      return await BlobModel.findByCommitIdAndPathPrefix(commitId, pathPrefix);
    } else {
      return await BlobModel.findByCommitId(commitId);
    }
  }
};
