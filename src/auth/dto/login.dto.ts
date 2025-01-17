import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string; 

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}