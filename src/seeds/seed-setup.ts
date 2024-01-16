import { Role } from 'src/common';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class Seed1703915494755 implements MigrationInterface {
  name: string = 'Seed1703915494755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isRoleTableExist = await this.checkTableExist('role', queryRunner);
    const isUserTableExist = await this.checkTableExist('user', queryRunner);
    const isUserRoleTableExist = await this.checkTableExist('user_role', queryRunner);
    if (isRoleTableExist) {
      for (const roleName in Role) {
        await this.createSeedRole(roleName, queryRunner);
      }
    }
    if (isUserTableExist && isUserRoleTableExist) await this.createSuperAdmin(queryRunner);
    console.log('Seeding Done!\n');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isUserRoleTableExist = await this.checkTableExist('user_role', queryRunner);
    const isRoleTableExist = await this.checkTableExist('role', queryRunner);
    const isUserTableExist = await this.checkTableExist('user', queryRunner);

    if (isUserRoleTableExist) await queryRunner.query(`DELETE FROM user_role`);
    if (isRoleTableExist) await queryRunner.query(`DELETE FROM role`);
    if (isUserTableExist) await queryRunner.query(`DELETE FROM user`);
  }

  private async checkTableExist(table_name: string, queryRunner: QueryRunner): Promise<boolean> {
    const dbName =
      process.env['NODE_ENV'] === 'production' || process.env['NODE_ENV'] === 'development'
        ? process.env['DEV_DB_NAME']
        : process.env['TEST_DB_NAME'];

    const result = await queryRunner.query(`
    SELECT count(*) as cnt
    FROM information_schema.tables
    WHERE table_schema = '${dbName}'
    AND table_name = '${table_name}'`);

    return Number(result[0].cnt) ? true : false;
  }

  private async createSeedRole(roleName: string, queryRunner: QueryRunner) {
    const isExist = await queryRunner.query(`SELECT * FROM role WHERE role_name='${roleName}'`);
    if (!isExist.length)
      await queryRunner.query(`INSERT INTO role (role_name) VALUES ('${roleName}')`);
  }

  // TODO transaction
  private async createSuperAdmin(queryRunner: QueryRunner) {
    const superAdminEmail = process.env['SUPER_ADMIN_EMAIL'];
    const superAdminPassword = process.env['SUPER_ADMIN_PASSWORD'];
    const superAdminUsername = process.env['SUPER_ADMIN_USERNAME'];

    if (!superAdminEmail || !superAdminPassword || !superAdminUsername) throw Error();

    const superAdminPasswordHash = await this.passwordEncoding(superAdminPassword);

    const result = await queryRunner.query(
      `SELECT count(*) as cnt FROM user WHERE email='${superAdminEmail}'`,
    );
    const isExistEmail = Number(result[0].cnt) ? true : false;
    if (isExistEmail) throw Error();
    const resultSuperAdmin = await queryRunner.query(
      `INSERT INTO user (username, email, password_hash) 
      VALUES ('SuperAdmin', '${superAdminEmail}', '${superAdminPasswordHash}')`,
    );
    const superAdminId = resultSuperAdmin.insertId;

    const getSuperAdminRoleId = await queryRunner.query(
      `SELECT role_id FROM role WHERE role_name='${Role.SuperAdmin}'`,
    );
    const superAdminRoleId = Number(
      getSuperAdminRoleId[0].role_id ? getSuperAdminRoleId[0].role_id : 0,
    );
    if (!superAdminRoleId) throw Error();

    const resultUserRole = await queryRunner.query(`
    INSERT INTO user_role (role_name, user_id, role_id)
    VALUES ('${Role.SuperAdmin}', ${superAdminId}, ${superAdminRoleId})
    `);

    if (!resultUserRole.affectedRows) throw Error();
    return true;
  }

  private async passwordEncoding(password: string): Promise<string> {
    const saltOrRounds = Number(process.env['BCRYPT_SALT']);
    if (!saltOrRounds) throw Error();
    const passwordHash = await bcrypt.hash(password, saltOrRounds);
    return passwordHash;
  }
}
