export type UserProps = {
    id?: number;
    name: string;
    email: string;
    password: string;
};

export class User {
    public id?: number;
    public name: string;
    public email: string;
    public password: string;

    constructor({ id, name, email, password }: UserProps) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
