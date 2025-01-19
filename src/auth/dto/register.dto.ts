import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @MinLength(4)
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8)
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must include at least one uppercase letter.',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must include at least one number.',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Password must include at least one special character (@$!%*?&).',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @ValidateIf((o) => o.password !== o.confirmPassword)
  confirmPassword: string;
}
