import mongoose, {Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";
import { stringify } from "querystring";

export interface IUser{
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String, required: true, unique: true
        },
        password: {
            type: String, required: true
        }
    },
    //We can add timestamps to automatically manage createdAt and updatedAt fields
    {
        timestamps: true
    }
)

//We can use a pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    //If the password is not modified, we can just call next to continue the save operation
    next();
})

//We can also create a method to compare the password with the hashed password
const User  = models?.User || model<IUser>("User", userSchema);


//We export the User model so that we can use it in other parts of the application
export default User;