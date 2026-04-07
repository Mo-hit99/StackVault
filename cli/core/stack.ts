import { saveCommit, loadCommit, readHead, writeHead, Commit } from './storage.js';

export class CommitStack {
  /**
   * Pushes a new commit node down into the local storage
   */
  async push(commit: Commit): Promise<void> {
    await saveCommit(commit);
    await writeHead(commit.id);
  }

  /**
   * Peeks the current HEAD commit object
   */
  async peek(): Promise<Commit | null> {
    const headId = await readHead();
    if (!headId || headId === 'null') {
      return null;
    }
    return this.getCommit(headId);
  }

  /**
   * Traverses backward through the history getting all commit objects
   */
  async traverse(): Promise<Commit[]> {
    const commits: Commit[] = [];
    let currentId = await readHead();

    while (currentId && currentId !== 'null') {
      const currentCommit = await this.getCommit(currentId);
      commits.push(currentCommit);
      currentId = currentCommit.parent;
    }

    return commits;
  }

  /**
   * Gets a specific commit by ID
   */
  async getCommit(id: string): Promise<Commit> {
    return await loadCommit(id);
  }
}
