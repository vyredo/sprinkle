import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    // @ts-ignore
    id: number;

    @Column()
    // @ts-ignore
    firstName: string;

    @Column()
    // @ts-ignore
    lastName: string;

    @Column()
    // @ts-ignore
    age: number;

    

}