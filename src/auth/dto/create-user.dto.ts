import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, ValidateIf, Matches, ValidationArguments} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @MinLength(4)
  @MaxLength(20)
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(4)
  @MaxLength(20)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must include at least one uppercase letter.' })
  @Matches(/(?=.*\d)/, { message: 'Password must include at least one number.' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must include at least one special character (@$!%*?&).' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @MinLength(4)
  @MaxLength(20)
  @ValidateIf((o) => o.password !== o.passwordConfirm)
  passwordConfirm: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string; 

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(4)
  @MaxLength(20)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must include at least one uppercase letter.' })
  @Matches(/(?=.*\d)/, { message: 'Password must include at least one number.' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must include at least one special character (@$!%*?&).' })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @MinLength(4)
  @MaxLength(20)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must include at least one uppercase letter.' })
  @Matches(/(?=.*\d)/, { message: 'Password must include at least one number.' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must include at least one special character (@$!%*?&).' })
  newPasswordConfirm: string;

  @IsString()
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @ValidateIf((o) => o.newPassword !== o.passwordConfirm)
  @IsNotEmpty({
    message: 'Password confirmation does not match the password.',
  })
  passwordConfirmationValidation(_: ResetPasswordDto, args: ValidationArguments) {
    return args.object['newPassword'] === args.object['passwordConfirm'];
  }
  passwordConfirm: string;

}