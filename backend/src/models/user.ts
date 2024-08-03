import mongoose, { Schema,Types } from "mongoose"
import bcrypt from 'bcryptjs'
export type UserType = {
  _id: string
  email: string
  password: string
  firstName: string
  lastName: string
  bookedHotels:Types.Array<Types.ObjectId>
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bookedHotels:[{type:Schema.Types.ObjectId,ref:'Hotel'}]
})

userSchema.pre('save',async function(next){
    //console.log(this)
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,8)
    }
    next()
})

export const User = mongoose.model<UserType>("User", userSchema)
