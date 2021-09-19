class Artifact {
  public domainSignature: string;
  public repository: string;
  public uuid: string;
  public pocket: { [key: string]: any };
  public ref: RecordRef;
  public serial: string;

  constructor(domainSignature: string, repository: string, uuid: string, pocket: { [key: string]: any }) {
    this.domainSignature = domainSignature;
    this.repository = repository;
    this.uuid = uuid;
    this.pocket = pocket;
    this.ref = new RecordRef(repository, uuid);
    this.serial = this.serialize();
  }

  public setPocket(pocket: { [key: string]: any }): this {
    this.pocket = pocket;
    return this;
  }

  public deserialize(value: string | object | Artifact): Artifact {
    if (value instanceof Artifact) {
      return value;
    }

    return Artifact.deserialize(value);
  }

  public serialize(): string {
    return JSON.stringify({
      domainSignature: this.domainSignature,
      repository: this.repository,
      uuid: this.uuid,
      pocket: this.pocket,
    });
  }

  public static deserialize(value: string | object | Artifact): Artifact {
    if (value instanceof Artifact) {
      return value;
    }

    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (
      typeof parsed !== 'object' ||
      typeof parsed.domainSignature !== 'string' ||
      typeof parsed.repository !== 'string' ||
      typeof parsed.uuid !== 'string'
    ) {
      throw new Error('failed to parse artifact');
    }
    return new Artifact(
      parsed.domainSignature,
      parsed.repository,
      parsed.uuid,
      typeof parsed.pocket === 'object' ? parsed.pocket : {},
    );
  }
}

class AuthRecord extends Artifact {
  public createdAt: Date;
  public active: boolean;
  public pocket: { [key: string]: any };
  public siblings: null | Artifact[]; // <-- siblings for multi (artifact) auth

  constructor(
    domainSignature: string,
    repository: string,
    uuid: string,
    createdAt: Date,
    active: boolean,
    pocket: { [key: string]: any },
  ) {
    super(domainSignature, repository, uuid, pocket);

    this.repository = repository;
    this.uuid = uuid;
    this.createdAt = createdAt;
    this.active = active;
    this.pocket = pocket;
    this.siblings = null;
    this.serial = this.serialize();
  }

  public deserialize(value: string | AuthRecord): AuthRecord {
    if (value instanceof AuthRecord) {
      return value;
    }

    return AuthRecord.deserialize(value);
  }

  public serialize(): string {
    return JSON.stringify({
      domainSignature: this.domainSignature,
      repository: this.repository,
      uuid: this.uuid,
      createdAt: this.createdAt,
      active: this.active,
      pocket: this.pocket,
    });
  }

  public static deserialize(value: string | object | AuthRecord): AuthRecord {
    if (value instanceof AuthRecord) {
      return value;
    }

    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    typeof parsed.createdAt === 'string' && (parsed.createdAt = new Date(parsed.createdAt));
    if (
      typeof parsed !== 'object' ||
      typeof parsed.domainSignature !== 'string' ||
      typeof parsed.repository !== 'string' ||
      typeof parsed.uuid !== 'string' ||
      !(parsed.createdAt instanceof Date) ||
      typeof parsed.active !== 'boolean'
    ) {
      throw new Error('failed to parse auth record');
    }
    return new AuthRecord(
      parsed.domainSignature,
      parsed.repository,
      parsed.uuid,
      parsed.createdAt,
      parsed.active,
      typeof parsed.pocket === 'object' ? parsed.pocket : {},
    );
  }
}

class RecordRef {
  public repository: string;
  public uuid: string;

  constructor(repository: string, uuid: string) {
    if (typeof repository !== 'string' || typeof uuid !== 'string') {
      throw new Error('bad record ref');
    }
    this.repository = repository;
    this.uuid = uuid;
  }

  public isEmpty(): boolean {
    return false;
  }

  public deserialize(value: string | RecordRef): RecordRef {
    if (value instanceof RecordRef) {
      return value;
    }

    return RecordRef.deserialize(value);
  }

  public serialize(): string {
    return JSON.stringify({ repository: this.repository, uuid: this.uuid });
  }

  public static deserialize(value: string | object | RecordRef): RecordRef {
    if (value instanceof RecordRef) {
      return value;
    }

    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (typeof parsed !== 'object' || typeof parsed.repository !== 'string' || typeof parsed.uuid !== 'string') {
      throw new Error('failed to parse record ref');
    }
    return new RecordRef(parsed.repository, parsed.uuid);
  }

  public static fromRecordEntry(recordEntry: RecordEntry): RecordRef {
    return new RecordRef(recordEntry.__repository__, recordEntry.uuid);
  }
}

class Record {
  [key: string]: any;
  public uuid: string;

  constructor(data: { uuid: string; [key: string]: any }) {
    for (const key of Object.keys(data)) {
      this[key] = data[key];
    }
    this.uuid = data.uuid;
  }

  public static make(data: any): Record {
    if (typeof data !== 'object' || typeof data.uuid !== 'string' || !data.uuid) {
      throw new Error('Bad record data');
    }
    return new Record(data);
  }
}

class RecordEntry extends Record {
  public __repository__: string;

  constructor(repository: string, uuid: string, data: { [key: string]: any }) {
    super({ uuid, ...data });
    this.__repository__ = repository;
  }
}

class Artifacts {
  public child: null | Artifact;
  public parent: null | Artifact;
  public subject: null | Artifact;
  public inviter: null | Artifact;
  public invitee: null | Artifact;
  public agent: null | Artifact;
  public target: null | Artifact;
  public children: null | Artifact[];
  public parents: null | Artifact[];
  public subjects: null | Artifact[];
  public inviters: null | Artifact[];
  public invitees: null | Artifact[];
  public agents: null | Artifact[];
  public targets: null | Artifact[];
  // list A, B, C, D

  constructor(
    artifacts: {
      child?: null | Artifact;
      parent?: null | Artifact;
      subject?: null | Artifact;
      inviter?: null | Artifact;
      invitee?: null | Artifact;
      agent?: null | Artifact;
      target?: null | Artifact;
      children?: Artifact[];
      parents?: Artifact[];
      subjects?: Artifact[];
      inviters?: Artifact[];
      invitees?: Artifact[];
      agents?: Artifact[];
      targets?: Artifact[];
    } = {},
  ) {
    this.child = artifacts.child || null;
    this.parent = artifacts.parent || null;
    this.subject = artifacts.subject || null;
    this.inviter = artifacts.inviter || null;
    this.invitee = artifacts.invitee || null;
    this.agent = artifacts.agent || null;
    this.target = artifacts.target || null;
    this.children = artifacts.children || null;
    this.parents = artifacts.parents || null;
    this.subjects = artifacts.subjects || null;
    this.inviters = artifacts.inviters || null;
    this.invitees = artifacts.invitees || null;
    this.agents = artifacts.agents || null;
    this.targets = artifacts.targets || null;
  }
}

export { Artifact, AuthRecord, Record, RecordRef, RecordEntry, Artifacts };
