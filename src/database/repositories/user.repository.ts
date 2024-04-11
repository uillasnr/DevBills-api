import { User } from "../../entities/user.entity";
import { UserModel } from "../schemas/user.schema";

export class UserRepository {
    constructor(private model: typeof UserModel) {}

    async create(userData: User): Promise<User> {
        const createdUser = await this.model.create(userData);
        return createdUser.toObject<User>();
    }
    
    async findByEmail(email: string): Promise<User | null> {
        const userDocument = await this.model.findOne({ email }).exec();
        if (userDocument) {
            // Converter o documento do usuário em um objeto do tipo User
            const user: User = userDocument.toObject() as User;
            return user;
        } else {
            return null;
        }
    }
  
} 