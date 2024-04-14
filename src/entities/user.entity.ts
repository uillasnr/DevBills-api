export type UserProps = {
    _id?: number;
    name: string;
    email: string;
    password: string;
};

export class User {
    public _id?: number;
    public name: string;
    public email: string;
    public password: string;

    constructor({ _id, name, email, password }: UserProps) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
