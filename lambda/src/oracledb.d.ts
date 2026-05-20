declare module "oracledb" {
  interface Connection {
    execute(
      sql: string,
      binds?: Record<string, unknown>,
      options?: Record<string, unknown>,
    ): Promise<{ rows: unknown[] }>;
    close(): Promise<void>;
  }

  interface ConnectionAttributes {
    readonly user: string;
    readonly password: string;
    readonly connectString?: string;
    readonly configDir?: string;
  }

  const OUT_FORMAT_OBJECT: number;

  function getConnection(attrs: ConnectionAttributes): Promise<Connection>;

  export default { OUT_FORMAT_OBJECT, getConnection };
}
