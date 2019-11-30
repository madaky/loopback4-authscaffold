import { DefaultCrudRepository } from '@loopback/repository';
import { Users } from '../models';
import { MongoseDataSource } from '../datasources';
import { inject } from '@loopback/core';



export interface User {
  id: string;
  email: string;
  password: string;

}

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id
  > {
  constructor(
    @inject('datasources.Mongose') dataSource: MongoseDataSource,
  ) {
    super(Users, dataSource);
  }


}
